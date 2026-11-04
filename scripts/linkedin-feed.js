/* LinkedIn feed — entrance animation.
   The section works without this file. Self-contained (own IntersectionObserver),
   so it doesn't touch whyUs.js or its ScrollTriggers. */
(function () {
  "use strict";
  const root = document.getElementById("linkedin-feed");
  if (!root || !window.gsap) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!("IntersectionObserver" in window)) return;

  const cards = [...root.querySelectorAll(".lf-card")];
  gsap.set(cards, { opacity: 0, y: 32 });

  const io = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: "power3.out",
        clearProps: "transform", // hand hover transforms back to CSS
      });
    },
    { threshold: 0.15 }
  );
  io.observe(root.querySelector(".lf-grid"));
})();