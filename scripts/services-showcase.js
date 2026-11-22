/* Services showcase — behaviour for horizontal expanding image panels.
   Requires GSAP (already loaded on the page). Self-contained: no globals. */
(function () {
  "use strict";
  const stage = document.getElementById("svStage");
  if (!stage || !window.gsap) return;

  const panels = [...stage.querySelectorAll(".sv-panel")];
  const pills = [...document.querySelectorAll(".sv-pill")];
  const N = panels.length;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const D = (v) => (reduce ? 0 : v);
  const mqHover = matchMedia("(hover: hover) and (pointer: fine)");
  let active = -1;
  let pinned = 0;

  function open(i) {
    if (i === active || i < 0 || i >= N) return;
    active = i;

    // Update pill tabs
    pills.forEach((pill, j) => {
      const isSelected = j === i;
      pill.classList.toggle("is-active", isSelected);
      pill.setAttribute("aria-selected", String(isSelected));
    });

    // Animate panels
    panels.forEach((p, j) => {
      const on = j === i;
      p.setAttribute("aria-expanded", String(on));
      gsap.to(p, { flexGrow: on ? 1 : 0, duration: D(0.7), ease: "power3.out", overwrite: "auto" });
      const img = p.querySelector(".sv-img");
      if (img) gsap.to(img, { scale: on ? 1 : 1.12, duration: D(0.9), ease: "power2.out", overwrite: "auto" });
      const tint = p.querySelector(".sv-tint");
      if (tint) gsap.to(tint, { opacity: on ? 0 : 1, duration: D(0.5), overwrite: "auto" });
      const grad = p.querySelector(".sv-grad");
      if (grad) gsap.to(grad, { opacity: on ? 1 : 0, duration: D(0.5), overwrite: "auto" });
      const short = p.querySelector(".sv-short");
      if (short) gsap.to(short, { opacity: on ? 0 : 1, duration: D(on ? 0.2 : 0.4), delay: on ? 0 : D(0.2), overwrite: "auto" });
      const reveals = p.querySelectorAll(".sv-reveal");
      if (reveals.length) {
        gsap.to(reveals, {
          opacity: on ? 1 : 0,
          y: on ? 0 : 14,
          duration: D(on ? 0.5 : 0.15),
          delay: on ? D(0.25) : 0,
          stagger: on ? D(0.08) : 0,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    });
  }

  /* Initial state: first panel open, no animation */
  gsap.set(panels, { flexGrow: 0 });
  panels.forEach((p, j) => {
    if (j !== 0) return;
    gsap.set(p, { flexGrow: 1 });
    const img = p.querySelector(".sv-img");
    if (img) gsap.set(img, { scale: 1 });
    const tint = p.querySelector(".sv-tint");
    if (tint) gsap.set(tint, { opacity: 0 });
    const grad = p.querySelector(".sv-grad");
    if (grad) gsap.set(grad, { opacity: 1 });
    const short = p.querySelector(".sv-short");
    if (short) gsap.set(short, { opacity: 0 });
    const reveals = p.querySelectorAll(".sv-reveal");
    if (reveals.length) gsap.set(reveals, { opacity: 1, y: 0 });
    p.setAttribute("aria-expanded", "true");
  });
  if (pills[0]) {
    pills[0].classList.add("is-active");
    pills[0].setAttribute("aria-selected", "true");
  }
  active = 0;

  /* Interactions on panels */
  panels.forEach((p, i) => {
    p.addEventListener("pointerenter", () => {
      if (mqHover.matches) open(i);
    });
    p.addEventListener("click", () => {
      pinned = i;
      open(i);
    });
    p.addEventListener("focus", () => open(i));
    p.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        pinned = i;
        open(i);
      }
      const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (k) {
        e.preventDefault();
        panels[(i + k + N) % N].focus();
      }
    });
  });

  /* Interactions on pill tabs */
  pills.forEach((pill, i) => {
    pill.addEventListener("click", () => {
      pinned = i;
      open(i);
    });
    pill.addEventListener("pointerenter", () => {
      if (mqHover.matches) open(i);
    });
  });

  stage.addEventListener("pointerleave", () => {
    if (mqHover.matches) open(pinned);
  });

  /* Hash deep-linking */
  const hashIndexMap = {
    "#research": 0, "#research-insights": 0,
    "#market-intelligence": 1, "#insights": 1,
    "#data": 2, "#data-ai": 2,
    "#policy": 3, "#policy-advisory": 3, "#policy-impact": 3,
    "#strategy": 4, "#strategy-advisory": 4,
    "#mel": 5,
    "#capacity": 6,
    "#coaching": 7,
    "#knowledge": 8, "#communication-capacity": 8
  };

  const handleHash = () => {
    const h = window.location.hash.toLowerCase();
    if (h in hashIndexMap) {
      pinned = hashIndexMap[h];
      open(pinned);
    }
  };
  handleHash();
  window.addEventListener("hashchange", handleHash);

  /* One-time entrance animation */
  if (!reduce && "IntersectionObserver" in window) {
    gsap.set(panels, { opacity: 0, y: 24 });
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        gsap.to(panels, { opacity: 1, y: 0, duration: 0.8, stagger: 0.06, ease: "power2.out" });
      },
      { threshold: 0.15 }
    );
    io.observe(stage);
  }
})();
