/* Why Konsalta cards — optional polish (entrance + cursor highlight).
   The cards work without this file. Requires GSAP (already on the page). */
(function () {
  "use strict";
  const block = document.getElementById("why-konsalta");
  if (!block || !window.gsap) return;

  const items = [...block.querySelectorAll(".wc-item")];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* cursor-follow highlight */
  if (canHover && !reduce) {
    items.forEach((item) => {
      const card = item.querySelector(".wc-card");
      item.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        gsap.to(card, { "--mx": e.clientX - r.left + "px", "--my": e.clientY - r.top + "px", duration: 0.35, overwrite: "auto" });
      });
    });
  }

  /* one-time staggered entrance when the block scrolls into view */
  if (!reduce && "IntersectionObserver" in window) {
    gsap.set(items, { opacity: 0, y: 28 });
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.09,
          ease: "power3.out",
          clearProps: "transform", // hand hover transforms back to CSS
        });
      },
      { threshold: 0.15 }
    );
    io.observe(block.querySelector(".wc-grid"));
  }
})();