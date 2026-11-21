document.addEventListener("DOMContentLoaded", () => {
  initCityNetwork();

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (typeof gsap === "undefined" || reduceMotion) return;

  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  gsap
    .timeline({ defaults: { ease: "power3.out" } })
    .fromTo(
      ".site-header",
      { autoAlpha: 0, y: -12 },
      { autoAlpha: 1, y: 0, duration: 0.6, clearProps: "transform" },
    )
    .from(
      ".hero-copy > *, .hero-note",
      { autoAlpha: 0, y: 24, duration: 0.7, stagger: 0.1 },
      0.15,
    );

  if (typeof ScrollTrigger !== "undefined") {
    gsap.from(".why-intro-inner", {
      autoAlpha: 0,
      y: 24,
      duration: 0.7,
      scrollTrigger: {
        trigger: ".why-intro-section",
        start: "top 82%",
        once: true,
      },
    });

    gsap.from(".wc-item", {
      autoAlpha: 0,
      y: 28,
      duration: 0.6,
      stagger: 0.08,
      scrollTrigger: {
        trigger: ".why-unified-section",
        start: "top 84%",
        once: true,
      },
    });

    gsap.from(".lf-panel", {
      autoAlpha: 0,
      y: 24,
      duration: 0.7,
      scrollTrigger: {
        trigger: ".lf",
        start: "top 84%",
        once: true,
      },
    });

    gsap.from(".final-cta-card", {
      autoAlpha: 0,
      y: 24,
      duration: 0.7,
      scrollTrigger: {
        trigger: ".final-cta",
        start: "top 84%",
        once: true,
      },
    });
  }
});

window.addEventListener(
  "load",
  () => {
    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.refresh();
    }
  },
  { once: true },
);

/* ============================================================
   KONSALTA WHY US — AFRICAN ADINKRA & KENTE RHYTHM (CONCEPT 2)
   Replaces mathematical polygon chords with authentic Pan-African
   cultural totems along the side margins (Mate Masie, Dwennimmen,
   Nyame Dua) and woven Kente guide threads.
   ============================================================ */
function initCityNetwork() {
  const canvas = document.getElementById("city-network-canvas");
  const context = canvas?.getContext("2d");
  if (!canvas || !context) return;

  // Station African presence nodes strictly along the side flanks (left and right gutters)
  const flankNodes = [
    { name: "Dakar", side: "left", yNorm: 0.08, totem: "mateMasie" },
    { name: "Cairo", side: "right", yNorm: 0.14, totem: "nyameDua" },
    { name: "Accra", side: "left", yNorm: 0.24, totem: "dwennimmen" },
    { name: "Nairobi", side: "right", yNorm: 0.32, totem: "mateMasie" },
    { name: "Lagos", side: "left", yNorm: 0.42, totem: "nyameDua" },
    { name: "Kigali", side: "right", yNorm: 0.51, totem: "dwennimmen" },
    { name: "Lusaka", side: "left", yNorm: 0.62, totem: "mateMasie" },
    { name: "Addis Ababa", side: "right", yNorm: 0.71, totem: "nyameDua" },
    { name: "Harare", side: "left", yNorm: 0.81, totem: "dwennimmen" },
    { name: "Johannesburg", side: "right", yNorm: 0.89, totem: "mateMasie" },
    { name: "Cape Town", side: "left", yNorm: 0.96, totem: "nyameDua" },
  ];

  const pointer = { x: -1000, y: -1000, active: false };
  let viewportWidth = 0;
  let viewportHeight = 0;
  let pageHeight = 0;
  let scrollY = window.scrollY;
  let frame = 0;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  function scheduleDraw() {
    if (frame) return;
    frame = window.requestAnimationFrame(draw);
  }

  function resize() {
    viewportWidth = window.innerWidth;
    viewportHeight = window.innerHeight;
    pageHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      viewportHeight,
    );
    canvas.width = Math.round(viewportWidth * dpr);
    canvas.height = Math.round(viewportHeight * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    scheduleDraw();
  }

  // Helper functions to draw authentic Adinkra totems
  function drawMateMasie(ctx, cx, cy, size, alpha, orangeWeight) {
    // Four interlocking knowledge squares
    const half = size / 2;
    const q = size / 4;
    ctx.save();
    ctx.strokeStyle = `rgba(242, 101, 34, ${alpha * 0.9 * orangeWeight + 0.15 * (1 - orangeWeight)})`;
    ctx.lineWidth = 1.2;
    // Central diamond
    ctx.strokeRect(cx - q, cy - q, half, half);
    // 4 satellite squares
    ctx.strokeStyle = `rgba(11, 45, 83, ${alpha * 0.7})`;
    ctx.strokeRect(cx - half, cy - half, q, q);
    ctx.strokeRect(cx + q, cy - half, q, q);
    ctx.strokeRect(cx - half, cy + q, q, q);
    ctx.strokeRect(cx + q, cy + q, q, q);
    ctx.restore();
  }

  function drawDwennimmen(ctx, cx, cy, size, alpha, orangeWeight) {
    // Ram's horns: concentric curved spirals signifying strength and humility
    ctx.save();
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = `rgba(242, 101, 34, ${alpha * 0.85 * orangeWeight + 0.12 * (1 - orangeWeight)})`;
    // Left horn
    ctx.beginPath();
    ctx.arc(cx - size * 0.25, cy, size * 0.28, Math.PI * 0.2, Math.PI * 1.8);
    ctx.stroke();
    // Right horn
    ctx.beginPath();
    ctx.arc(cx + size * 0.25, cy, size * 0.28, -Math.PI * 0.8, Math.PI * 0.8);
    ctx.stroke();
    // Core knot
    ctx.fillStyle = `rgba(11, 45, 83, ${alpha * 0.8})`;
    ctx.beginPath();
    ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawNyameDua(ctx, cx, cy, size, alpha, orangeWeight) {
    // Altar of God / harmony stepped pillar
    ctx.save();
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = `rgba(11, 45, 83, ${alpha * 0.75})`;
    // Cross bars
    ctx.beginPath();
    ctx.moveTo(cx - size * 0.4, cy - size * 0.3);
    ctx.lineTo(cx + size * 0.4, cy - size * 0.3);
    ctx.moveTo(cx - size * 0.25, cy);
    ctx.lineTo(cx + size * 0.25, cy);
    ctx.moveTo(cx - size * 0.35, cy + size * 0.3);
    ctx.lineTo(cx + size * 0.35, cy + size * 0.3);
    // Vertical stem
    ctx.moveTo(cx, cy - size * 0.45);
    ctx.lineTo(cx, cy + size * 0.45);
    ctx.stroke();

    // Central accent dot
    ctx.fillStyle = `rgba(242, 101, 34, ${alpha * 0.9})`;
    ctx.beginPath();
    ctx.arc(cx, cy, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function draw() {
    frame = 0;
    scrollY = window.scrollY;
    context.clearRect(0, 0, viewportWidth, viewportHeight);

    // Margins along the left and right flanks
    const isMobile = viewportWidth < 768;
    const leftX = isMobile ? 18 : Math.max(34, Math.min(60, viewportWidth * 0.04));
    const rightX = viewportWidth - leftX;

    // 1. Draw subtle vertical Kente woven rhythm guidelines along the gutters
    context.save();
    [leftX, rightX].forEach((gutterX) => {
      // Woven guide line
      context.beginPath();
      context.moveTo(gutterX, 0);
      context.lineTo(gutterX, viewportHeight);
      context.strokeStyle = "rgba(11, 45, 83, 0.045)";
      context.lineWidth = 1;
      context.setLineDash([8, 12]);
      context.stroke();

      // Subtle Kente chevrons every 160px
      const chevronStep = 160;
      const offset = (scrollY * 0.3) % chevronStep;
      for (let y = -offset; y < viewportHeight + chevronStep; y += chevronStep) {
        context.beginPath();
        context.moveTo(gutterX - 6, y - 5);
        context.lineTo(gutterX, y);
        context.lineTo(gutterX + 6, y - 5);
        context.strokeStyle = "rgba(242, 101, 34, 0.08)";
        context.lineWidth = 1;
        context.setLineDash([]);
        context.stroke();
      }
    });
    context.restore();

    // 2. Draw African Presence Nodes & Adinkra Totems along the flanks
    flankNodes.forEach((node, index) => {
      const px = node.side === "left" ? leftX : rightX;
      const py = node.yNorm * pageHeight - scrollY;

      // Cull if offscreen
      if (py < -50 || py > viewportHeight + 50) return;

      const dist = Math.hypot(pointer.x - px, pointer.y - py);
      const proximity = pointer.active ? Math.max(0, 1 - dist / 180) : 0;
      const alpha = 0.38 + proximity * 0.55;
      const totemSize = isMobile ? 16 : 22 + proximity * 4;

      // Draw the cultural Adinkra motif
      if (node.totem === "mateMasie") {
        drawMateMasie(context, px, py, totemSize, alpha, index % 2 === 0 ? 1 : 0);
      } else if (node.totem === "dwennimmen") {
        drawDwennimmen(context, px, py, totemSize, alpha, index % 2 === 0 ? 1 : 0);
      } else {
        drawNyameDua(context, px, py, totemSize, alpha, index % 2 === 0 ? 1 : 0);
      }

      // Outer gentle pulse ring on proximity
      if (proximity > 0.05) {
        context.save();
        context.beginPath();
        context.arc(px, py, totemSize * 0.9, 0, Math.PI * 2);
        context.strokeStyle = `rgba(242, 101, 34, ${proximity * 0.3})`;
        context.lineWidth = 1;
        context.stroke();
        context.restore();
      }

      // City Label along the flank (hidden on very small screens to maintain ultra-clean gutters)
      if (!isMobile) {
        context.save();
        context.font = "600 10.5px 'Manrope', sans-serif";
        const onRight = node.side === "right";
        context.textAlign = onRight ? "right" : "left";
        context.fillStyle = `rgba(11, 45, 83, ${0.28 + proximity * 0.5})`;
        context.fillText(node.name, px + (onRight ? -totemSize - 6 : totemSize + 6), py + 4);
        context.restore();
      }
    });
  }

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("scroll", scheduleDraw, { passive: true });
  window.addEventListener("pointermove", (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
    scheduleDraw();
  }, { passive: true });
  window.addEventListener("pointerleave", () => {
    pointer.active = false;
    scheduleDraw();
  });
  window.addEventListener("load", resize, { once: true });

  if ("ResizeObserver" in window) {
    new ResizeObserver(resize).observe(document.body);
  }

  resize();
}
