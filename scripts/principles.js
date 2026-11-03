/* Seven principles — behaviour only (markup lives in the HTML).
   Requires GSAP (already loaded on the page). Self-contained: no globals. */
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

  /* interactions */
  cards.forEach((c, i) => {
    c.addEventListener("pointerenter", () => {
      if (mqHover.matches) open(i);
    });
    c.addEventListener("click", () => {
      pinned = i;
      open(i);
    });
    c.addEventListener("focus", () => open(i));
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
    c.addEventListener("pointermove", (e) => {
      const r = c.getBoundingClientRect();
      gsap.to(c, { "--mx": e.clientX - r.left + "px", "--my": e.clientY - r.top + "px", duration: D(0.35), overwrite: "auto" });
    });
  });
  stage.addEventListener("pointerleave", () => {
    if (mqHover.matches) open(pinned);
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