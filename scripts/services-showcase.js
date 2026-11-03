/* Services showcase — behaviour only (markup lives in the HTML).
   Requires GSAP (already loaded on the page). Self-contained: no globals. */
(function () {
  "use strict";
  const stage = document.getElementById("svStage");
  if (!stage || !window.gsap) return;

  const panels = [...stage.querySelectorAll(".sv-panel")];
  const N = panels.length;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const D = (v) => (reduce ? 0 : v);
  const mqHover = matchMedia("(hover: hover) and (pointer: fine)");
  let active = -1;
  let pinned = 0;

  function open(i) {
    if (i === active) return;
    active = i;
    panels.forEach((p, j) => {
      const on = j === i;
      p.setAttribute("aria-expanded", on);
      gsap.to(p, { flexGrow: on ? 1 : 0, duration: D(0.7), ease: "power3.out", overwrite: "auto" });
      gsap.to(p.querySelector(".sv-img"), { scale: on ? 1 : 1.12, duration: D(0.9), ease: "power2.out", overwrite: "auto" });
      gsap.to(p.querySelector(".sv-tint"), { opacity: on ? 0 : 1, duration: D(0.5), overwrite: "auto" });
      gsap.to(p.querySelector(".sv-grad"), { opacity: on ? 1 : 0, duration: D(0.5), overwrite: "auto" });
      gsap.to(p.querySelector(".sv-short"), { opacity: on ? 0 : 1, duration: D(on ? 0.2 : 0.4), delay: on ? 0 : D(0.2), overwrite: "auto" });
      gsap.to(p.querySelectorAll(".sv-reveal"), {
        opacity: on ? 1 : 0,
        y: on ? 0 : 14,
        duration: D(on ? 0.5 : 0.15),
        delay: on ? D(0.25) : 0,
        stagger: on ? D(0.08) : 0,
        ease: "power2.out",
        overwrite: "auto",
      });
    });
  }

  /* initial state: first panel open, no animation */
  gsap.set(panels, { flexGrow: 0 });
  panels.forEach((p, j) => {
    if (j !== 0) return;
    gsap.set(p, { flexGrow: 1 });
    gsap.set(p.querySelector(".sv-img"), { scale: 1 });
    gsap.set(p.querySelector(".sv-tint"), { opacity: 0 });
    gsap.set(p.querySelector(".sv-grad"), { opacity: 1 });
    gsap.set(p.querySelector(".sv-short"), { opacity: 0 });
    gsap.set(p.querySelectorAll(".sv-reveal"), { opacity: 1, y: 0 });
    p.setAttribute("aria-expanded", "true");
  });
  active = 0;

  /* interactions */
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
  stage.addEventListener("pointerleave", () => {
    if (mqHover.matches) open(pinned);
  });

  /* one-time entrance when the section scrolls into view */
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