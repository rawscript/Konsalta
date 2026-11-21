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

function initCityNetwork() {
  const canvas = document.getElementById("city-network-canvas");
  const context = canvas?.getContext("2d");
  if (!canvas || !context) return;

  const cities = [
    { name: "Dakar", x: 0.14, y: 0.07 },
    { name: "Nairobi", x: 0.5, y: 0.12 },
    { name: "Cairo", x: 0.86, y: 0.18 },
    { name: "Accra", x: 0.17, y: 0.27 },
    { name: "Kigali", x: 0.82, y: 0.35 },
    { name: "Lagos", x: 0.48, y: 0.4 },
    { name: "Lusaka", x: 0.14, y: 0.53 },
    { name: "Addis Ababa", x: 0.84, y: 0.58 },
    { name: "Harare", x: 0.5, y: 0.66 },
    { name: "Maputo", x: 0.16, y: 0.78 },
    { name: "Johannesburg", x: 0.83, y: 0.85 },
    { name: "Cape Town", x: 0.48, y: 0.96 },
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

  function draw() {
    frame = 0;
    scrollY = window.scrollY;
    context.clearRect(0, 0, viewportWidth, viewportHeight);

    const points = cities.map((city) => ({
      ...city,
      px:
        (viewportWidth < 640
          ? city.x < 0.5
            ? 0.08
            : 0.92
          : city.x) * viewportWidth,
      py: city.y * pageHeight - scrollY,
    }));

    points.forEach((point, index) => {
      if (point.py < -36 || point.py > viewportHeight + 36) return;
      const distance = Math.hypot(pointer.x - point.px, pointer.y - point.py);
      const proximity = pointer.active
        ? Math.max(0, 1 - distance / 190)
        : 0;

      points.slice(index + 1).forEach((other) => {
        if (other.py < -36 || other.py > viewportHeight + 36) return;
        const linkDistance = Math.hypot(
          other.px - point.px,
          other.py - point.py,
        );
        if (linkDistance > Math.min(290, viewportWidth * 0.34)) return;

        const otherDistance = Math.hypot(
          pointer.x - other.px,
          pointer.y - other.py,
        );
        const linkProximity = pointer.active
          ? Math.max(proximity, 1 - otherDistance / 190)
          : 0;

        context.beginPath();
        context.moveTo(point.px, point.py);
        context.lineTo(other.px, other.py);
        context.strokeStyle = `rgba(11, 45, 83, ${0.05 + linkProximity * 0.1})`;
        context.lineWidth = 1;
        context.stroke();
      });

      const color = index % 3 === 0 ? "242, 101, 34" : "11, 45, 83";
      const radius = 2 + proximity * 2;
      context.beginPath();
      context.arc(point.px, point.py, radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(${color}, ${0.3 + proximity * 0.38})`;
      context.fill();

      context.beginPath();
      context.arc(point.px, point.py, 7 + proximity * 7, 0, Math.PI * 2);
      context.strokeStyle = `rgba(${color}, ${0.12 + proximity * 0.16})`;
      context.lineWidth = 1;
      context.stroke();

      context.font = "600 10px 'Manrope', sans-serif";
      const onRight = point.px > viewportWidth / 2;
      context.textAlign = onRight ? "right" : "left";
      context.fillStyle = `rgba(11, 45, 83, ${0.24 + proximity * 0.36})`;
      context.fillText(
        point.name,
        point.px + (onRight ? -12 : 12),
        point.py + 3,
      );
    });
  }

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener(
    "scroll",
    () => {
      scheduleDraw();
    },
    { passive: true },
  );
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
