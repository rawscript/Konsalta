/* Seven principles — behaviour only (markup lives in the HTML).
   Requires GSAP (already loaded on the page). Self-contained: no globals.

   Changes from the previous version (fast-cursor fix):
   - Hover no longer fires per-card on `pointerenter`. One stage-level handler
     decides which card is under the cursor, using hover-intent:
       * slow / deliberate movement opens the card straight away;
       * a fast sweep waits until the cursor settles, then opens the card it
         rests on, so cards crossed in passing never start their animations.
   - Synthetic pointer events the browser fires when layout shifts under a
     still cursor are ignored (movement < MIN_MOVE), which breaks the
     open → layout shift → neighbour opens → layout shift … flicker loop.
   - The cursor glow is written once per animation frame with a plain
     setProperty instead of creating a new GSAP tween on every pointermove.
   - Leaving the stage reverts to the pinned card after a short delay.
   - Focus only opens a card for keyboard focus (:focus-visible). */
(function () {
  "use strict";
  const stage = document.getElementById("prStage");
  if (!stage || !window.gsap) return;

  const cards = [...stage.querySelectorAll(".pr-card")];
  const N = cards.length;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const D = (v) => (reduce ? 0 : v);
  const mqV = matchMedia("(max-width: 760px)");
  const mqT = matchMedia("(max-width: 1000px)");
  const mqHover = matchMedia("(hover: hover) and (pointer: fine)");
  const state = cards.map(() => ({ tl: 0, tr: 0, bl: 0, br: 0 }));
  let active = -1;
  let pinned = 0;

  const write = (el, o) => {
    for (const k in o) el.style.setProperty("--" + k, o[k] + "px");
  };

  /* Edge e sits between card e and e+1 (e = -1 and e = N-1 are the outer ends).
     true = "/" lean. The open card has the same lean on both sides (parallelogram);
     every other card has opposite leans (trapezoid), so parallel edges interlock. */
  function targets(open) {
    const S = parseFloat(getComputedStyle(stage).getPropertyValue("--pr-s")) || 48;
    const dir = (e) =>
      e >= open - 1 && e <= open
        ? true
        : e < open - 1
          ? (open - 1 - e) % 2 === 0
          : (e - open) % 2 === 0;
    const trail = (d) => (d ? [0, S] : [S, 0]);
    const lead = (d) => (d ? [S, 0] : [0, S]);
    return cards.map((_, j) => {
      const L = lead(dir(j - 1));
      const T = trail(dir(j));
      return mqV.matches
        ? { tl: L[0], tr: L[1], bl: T[0], br: T[1] }
        : { tl: L[0], bl: L[1], tr: T[0], br: T[1] };
    });
  }

  function shape(open, animate) {
    const t = targets(open);
    cards.forEach((c, j) => {
      if (!animate) {
        Object.assign(state[j], t[j]);
        write(c, state[j]);
        return;
      }
      gsap.to(state[j], {
        ...t[j],
        duration: D(0.75),
        ease: "power3.inOut",
        overwrite: "auto",
        onUpdate: () => write(c, state[j]),
      });
    });
  }

  function open(i, force) {
    if (i === active && !force) return;
    active = i;
    const grow = mqV.matches ? 9 : 6;
    cards.forEach((c, j) => {
      const on = j === i;
      c.setAttribute("aria-expanded", on);
      gsap.to(c, { flexGrow: on ? grow : 1, duration: D(0.75), ease: "power3.inOut", overwrite: "auto" });
      gsap.to(c.querySelector(".pr-tag"), { opacity: on ? 0 : 1, duration: D(0.25), overwrite: "auto" });
      gsap.to(c.querySelector(".pr-fill"), { opacity: on ? 1 : 0, duration: D(0.5), ease: "power2.out", overwrite: "auto" });
      gsap.to(c.querySelectorAll(".pr-reveal"), {
        opacity: on ? 1 : 0,
        y: on ? 0 : 14,
        duration: D(on ? 0.5 : 0.15),
        delay: on ? D(0.3) : 0,
        stagger: on ? D(0.08) : 0,
        ease: "power2.out",
        overwrite: "auto",
      });
    });
    shape(i, true);
  }

  /* initial state */
  gsap.set(cards, { flexGrow: 1 });
  shape(0, false);
  open(0, true);

  const relayout = () => {
    shape(active, false);
    open(active, true);
  };
  mqV.addEventListener("change", relayout);
  mqT.addEventListener("change", () => shape(active, false));

  /* ---------- click / keyboard ---------- */
  cards.forEach((c, i) => {
    c.addEventListener("click", () => {
      pinned = i;
      open(i);
    });
    c.addEventListener("focus", () => {
      if (c.matches(":focus-visible")) open(i);
    });
    c.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        pinned = i;
        open(i);
      }
      const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (k) {
        e.preventDefault();
        cards[(i + k + N) % N].focus();
      }
    });
  });

  /* ---------- hover intent + cursor glow (one handler for the whole stage) ---------- */
  const MIN_MOVE = 3; // px: ignore synthetic moves caused by layout shifting under a still cursor
  const CALM_SPEED = 0.45; // px/ms: slower than this counts as deliberate, open immediately
  const SETTLE = 90; // ms: after a fast sweep, open the card the cursor comes to rest on
  const LEAVE_DELAY = 160; // ms: grace period before reverting to the pinned card

  let px = 0;
  let py = 0;
  let pt = 0;
  let hoverTimer = 0;
  let leaveTimer = 0;
  let glowRaf = 0;
  let glowCard = null;
  let gx = 0;
  let gy = 0;

  const cardAt = (x, y) => {
    const el = document.elementFromPoint(x, y);
    const c = el && el.closest(".pr-card");
    return c ? cards.indexOf(c) : -1;
  };
  const hoverAt = (x, y) => {
    const i = cardAt(x, y);
    if (i > -1) open(i); // seams between cards return -1: keep the current card
  };
  const paintGlow = () => {
    glowRaf = 0;
    if (!glowCard) return;
    const r = glowCard.getBoundingClientRect();
    glowCard.style.setProperty("--mx", gx - r.left + "px");
    glowCard.style.setProperty("--my", gy - r.top + "px");
  };

  stage.addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;

    /* cursor glow: at most one write per frame */
    const gc = e.target.closest && e.target.closest(".pr-card");
    if (gc) {
      glowCard = gc;
      gx = e.clientX;
      gy = e.clientY;
      if (!glowRaf) glowRaf = requestAnimationFrame(paintGlow);
    }

    /* hover intent */
    if (!mqHover.matches) return;
    clearTimeout(leaveTimer);
    const now = performance.now();
    const dist = Math.hypot(e.clientX - px, e.clientY - py);
    if (dist < MIN_MOVE) return;
    const speed = dist / Math.max(now - pt, 1);
    px = e.clientX;
    py = e.clientY;
    pt = now;
    clearTimeout(hoverTimer);
    if (speed < CALM_SPEED) hoverAt(px, py);
    else hoverTimer = setTimeout(() => hoverAt(px, py), SETTLE);
  });

  stage.addEventListener("pointerleave", (e) => {
    if (e.pointerType === "touch" || !mqHover.matches) return;
    clearTimeout(hoverTimer);
    clearTimeout(leaveTimer);
    leaveTimer = setTimeout(() => open(pinned), LEAVE_DELAY);
  });

  /* one-time entrance when the section scrolls into view */
  if (!reduce && "IntersectionObserver" in window) {
    gsap.set(cards, { opacity: 0 });
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        gsap.to(cards, { opacity: 1, duration: 0.9, stagger: 0.08, ease: "power2.out" });
      },
      { threshold: 0.2 }
    );
    io.observe(stage);
  }
})();