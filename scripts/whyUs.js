/**
 * whyUs.js — optimised for performance
 * - Single DOMContentLoaded entry point
 * - Cursor uses rAF loop only, no per-element GSAP tweens
 * - Orb parallax merged into one scrub timeline
 * - Panel update debounced with a single timer ref
 */

document.addEventListener("DOMContentLoaded", () => {

  // ─── MOBILE PERFORMANCE CONFIG ───────────────────────────────────────────
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.innerWidth <= 768;
  const isSmallMobile = window.innerWidth <= 480;

  // ─── ACCORDION PANEL UPDATE ──────────────────────────────────────────────
  const mainDisplay  = document.getElementById("mainDisplay");
  const displayNum   = document.getElementById("displayNum");
  const displayCat   = document.getElementById("displayCategory");
  const displayTitle = document.getElementById("displayTitle");
  const displayDesc  = document.getElementById("displayDesc");
  const displayContent = document.getElementById("displayContent");
  let panelTimer;

  function updateMainPanel(panel) {
    const { img, num, category, title, desc } = panel.dataset;
    clearTimeout(panelTimer);
    displayContent.classList.add("fade-out");
    panelTimer = setTimeout(() => {
      mainDisplay.style.backgroundImage = `url("${img}")`;
      displayNum.textContent   = num;
      displayCat.textContent   = category;
      displayTitle.textContent = title;
      displayDesc.textContent  = desc;
      displayContent.classList.remove("fade-out");
    }, 200);
  }

  document.querySelectorAll(".thumb-panel").forEach((thumb) => {
    thumb.addEventListener("mouseenter", () => updateMainPanel(thumb));
    thumb.addEventListener("focus",      () => updateMainPanel(thumb));
  });

  // ─── CUSTOM CURSOR ───────────────────────────────────────────────────────
  const cursor       = document.querySelector(".cursor");
  const isFinePointer = window.matchMedia("(pointer: fine)").matches;

  if (cursor && isFinePointer) {
    document.body.classList.add("has-custom-cursor");

    let mx = window.innerWidth  / 2;
    let my = window.innerHeight / 2;
    let cx = mx, cy = my;

    // Single mousemove listener — cheap, no GSAP involved
    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
    }, { passive: true });

    // CSS classes handle the size change — zero JS tween overhead
    document.querySelectorAll("a, button, .why-card-6, .cinematic-panel").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("cursor--large"),    { passive: true });
      el.addEventListener("mouseleave", () => cursor.classList.remove("cursor--large"), { passive: true });
    });

    // Single rAF loop for smooth lag, writing only transform
    (function tick() {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    })();
  }

  // ─── GSAP + SCROLLTRIGGER ────────────────────────────────────────────────
  if (typeof gsap === "undefined") return;

  const reduceMotion  = prefersReducedMotion;
  const canHover      = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hasST         = typeof ScrollTrigger !== "undefined";

  if (hasST) gsap.registerPlugin(ScrollTrigger);

  if (reduceMotion) return;

  // ── Intro timeline ──────────────────────────────────────────────────────
  gsap.timeline({ defaults: { ease: "power3.out" } })
    .fromTo(".site-header", { autoAlpha: 0, y: -12 }, { autoAlpha: 1, y: 0, duration: 0.6, clearProps: "transform" })
    .from(".headline .word > span", { yPercent: 105, duration: 0.85, stagger: 0.08, ease: "power4.out" }, 0.14)
    .from("#inlineImg, #ideaPill",  { scale: 0, duration: 0.6, stagger: 0.1, ease: "back.out(1.5)" }, 0.3);

  // ── Ambient orb drift on load (CSS handles these via keyframe would be
  //    lighter, but GSAP yoyo is already set up — keep it, just don't repeat
  //    for the third orb which isn't animated individually) ─────────────────
  gsap.to("#inlineImg", { y: 6,  rotation:  2,   duration: 2.8, delay: 1.4, ease: "sine.inOut", yoyo: true, repeat: -1 });
  gsap.to("#ideaPill",  { y: 5,  rotation: -1.5, duration: 3.2, delay: 1.6, ease: "sine.inOut", yoyo: true, repeat: -1 });

  // ── Parallax: merge all three orbs into ONE ScrollTrigger timeline ───────
  // One scrub = one scroll listener instead of three separate ones
  if (hasST) {
    const orbTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".parallax-stage",
        start: "top top",
        end: "bottom top",
        scrub: 1.2,
      },
    });
    orbTl
      .to(".hero-orb-one",   { y: 180,        ease: "none" }, 0)
      .to(".hero-orb-two",   { y: -120, x: 20, ease: "none" }, 0)
      .to(".hero-orb-three", { y: -90,  x: 40, ease: "none" }, 0);

    // ── Scroll-reveal animations ───────────────────────────────────────────
    // pillars frame
    gsap.from(".pillars-frame", {
      autoAlpha: 0, y: 24, duration: 0.8,
      scrollTrigger: { trigger: ".section-1", start: "top 84%", once: true },
    });
    gsap.from(".section-content, .section-subtitle", {
      autoAlpha: 0, y: 18, duration: 0.65, stagger: 0.12,
      scrollTrigger: { trigger: ".section-1", start: "top 78%", once: true },
    });

    // intro bridge section
    gsap.from(".why-intro-label, .why-intro-title, .why-intro-text", {
      autoAlpha: 0, y: 28, duration: 0.7, stagger: 0.1,
      scrollTrigger: { trigger: ".why-intro-section", start: "top 80%", once: true },
    });

    // cinematic panels — batch so stagger is driven by one ST instance
    gsap.from(".cinematic-panel", {
      autoAlpha: 0, y: 40, duration: 0.75, stagger: 0.08,
      scrollTrigger: { trigger: ".accordion-container", start: "top 80%", once: true },
    });

    // why-cards — use gsap.utils.toArray + batch for clean stagger
    gsap.from(".wc-item", {
      autoAlpha: 0, y: 36, duration: 0.65, stagger: 0.08,
      scrollTrigger: { trigger: ".why-unified-section", start: "top 85%", once: true },
    });

    // CTA row
    gsap.from(".why-cta-row", {
      autoAlpha: 0, y: 24, duration: 0.7,
      scrollTrigger: { trigger: ".why-cta-row", start: "top 88%", once: true },
    });
  }

  // ── Hover interactions (desktop only) ────────────────────────────────────
  if (canHover) {
    const inlineImg = document.getElementById("inlineImg");
    const ideaPill  = document.getElementById("ideaPill");
    const leaf      = ideaPill?.querySelector(".leaf");

    inlineImg?.addEventListener("mouseenter", () =>
      gsap.to(inlineImg, { scale: 1.08, rotation: 4,   duration: 0.3, ease: "back.out(1.6)" }));
    inlineImg?.addEventListener("mouseleave", () =>
      gsap.to(inlineImg, { scale: 1,    rotation: 0,   duration: 0.5, ease: "elastic.out(1, 0.6)" }));

    ideaPill?.addEventListener("mouseenter", () => {
      gsap.to(ideaPill, { scale: 1.06, rotation: -3, duration: 0.3, ease: "back.out(1.6)" });
      if (leaf) gsap.to(leaf, { rotation: "+=360", duration: 0.7, ease: "power2.inOut" });
    });
    ideaPill?.addEventListener("mouseleave", () =>
      gsap.to(ideaPill, { scale: 1, rotation: 0, duration: 0.5, ease: "elastic.out(1, 0.6)" }));
  }

  // ============ MULTI-HUB CONNECTION MESH ============
  initMultiHubMesh();

}); // end DOMContentLoaded

// Refresh ScrollTrigger after fonts/images finish loading
window.addEventListener("load", function () {
  if (typeof ScrollTrigger !== "undefined") {
    ScrollTrigger.refresh();
  }
}, { once: true });

// ============================================================
//   PAN-AFRICAN TOTEM & ADINKRA WISDOM CANVASES
//   Replaces the mathematical flight-path / polygon mesh
//   with Concept 2: Adinkra wisdom symbols (Mate Masie, Dwennimmen,
//   Nyame Nti), vertical architectural Kente woven guidelines,
//   and African advisory hub nodes.
// ============================================================
function initMultiHubMesh() {
  const canvas = document.getElementById("hubMeshCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const COLOR_NAVY = "#0B2D53";
  const COLOR_ORANGE = "#F26522";
  const COLOR_GOLD = "#C89A2A";

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width = window.innerWidth;
  let height = window.innerHeight;

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // Strategic hub placement in vertical margin totem columns
  // Keeping real African regional hubs, anchored alongside elegant vertical Kente axes
  const hubsData = [
    // ── Left Column Hubs (Zimbabwe / Southern / Western Africa) ──
    { xP: 0.052, yP: 0.055, code: "HRE", city: "Harare", color: COLOR_ORANGE, symbol: "dwennimmen", phase: 0 },
    { xP: 0.052, yP: 0.165, code: "LUN", city: "Lusaka", color: COLOR_NAVY, symbol: "matemasie", phase: 1.8 },
    { xP: 0.052, yP: 0.285, code: "GBE", city: "Gaborone", color: COLOR_NAVY, symbol: "kente-knot", phase: 3.1 },
    { xP: 0.052, yP: 0.415, code: "WDH", city: "Windhoek", color: COLOR_ORANGE, symbol: "nyamenti", phase: 0.9 },
    { xP: 0.052, yP: 0.545, code: "MPM", city: "Maputo", color: COLOR_NAVY, symbol: "dwennimmen", phase: 2.2 },
    { xP: 0.052, yP: 0.675, code: "ACC", city: "Accra", color: COLOR_ORANGE, symbol: "matemasie", phase: 1.4 },
    { xP: 0.052, yP: 0.805, code: "ABJ", city: "Abidjan", color: COLOR_NAVY, symbol: "kente-knot", phase: 2.9 },
    { xP: 0.052, yP: 0.925, code: "DKR", city: "Dakar", color: COLOR_ORANGE, symbol: "nyamenti", phase: 0.5 },

    // ── Right Column Hubs (East, North & Southern Hubs) ──
    { xP: 0.948, yP: 0.055, code: "NBO", city: "Nairobi", color: COLOR_ORANGE, symbol: "matemasie", phase: 0.7 },
    { xP: 0.948, yP: 0.165, code: "KGL", city: "Kigali", color: COLOR_NAVY, symbol: "dwennimmen", phase: 2.4 },
    { xP: 0.948, yP: 0.285, code: "ADD", city: "Addis Ababa", color: COLOR_NAVY, symbol: "nyamenti", phase: 1.2 },
    { xP: 0.948, yP: 0.415, code: "DAR", city: "Dar es Salaam", color: COLOR_ORANGE, symbol: "kente-knot", phase: 3.3 },
    { xP: 0.948, yP: 0.545, code: "EBB", city: "Kampala", color: COLOR_NAVY, symbol: "matemasie", phase: 1.9 },
    { xP: 0.948, yP: 0.675, code: "LOS", city: "Lagos", color: COLOR_ORANGE, symbol: "dwennimmen", phase: 0.3 },
    { xP: 0.948, yP: 0.805, code: "JNB", city: "Johannesburg", color: COLOR_ORANGE, symbol: "kente-knot", phase: 2.6 },
    { xP: 0.948, yP: 0.925, code: "CPT", city: "Cape Town", color: COLOR_NAVY, symbol: "nyamenti", phase: 1.6 },
  ];

  const mouse = {
    x: -9999,
    y: -9999,
    targetX: -9999,
    targetY: -9999,
    active: 0,
  };

  let mouseTimeout;
  window.addEventListener("pointermove", (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    mouse.active = 1;
    window.clearTimeout(mouseTimeout);
    mouseTimeout = window.setTimeout(() => {
      mouse.active = 0;
    }, 2800);
  });

  window.addEventListener("pointerleave", () => {
    mouse.active = 0;
  });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const startTime = performance.now();

  // Helper functions to draw authentic Adinkra symbols cleanly in Canvas
  function drawMateMasie(ctx, x, y, size, color, alpha) {
    // "What I hear, I keep" — symbol of wisdom, knowledge and learning
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = 1.3;

    const r = size * 0.48;
    const s = size * 0.28;
    // Four interlocking diamond squares forming the emblem of 4 eyes/ears of wisdom
    [-s, s].forEach(dx => {
      [-s, s].forEach(dy => {
        ctx.strokeRect(dx - r * 0.35, dy - r * 0.35, r * 0.7, r * 0.7);
      });
    });
    ctx.beginPath();
    ctx.arc(0, 0, 2.2, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  function drawDwennimmen(ctx, x, y, size, color, alpha) {
    // Ram's horns — symbol of strength and humility
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = 1.3;

    const r = size * 0.42;
    // Central core
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2);
    ctx.stroke();

    // Four outward horn curves
    [0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].forEach(rot => {
      ctx.save();
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.arc(r * 0.5, 0, r * 0.45, Math.PI, 0, false);
      ctx.stroke();
      ctx.restore();
    });
    ctx.restore();
  }

  function drawNyameNti(ctx, x, y, size, color, alpha) {
    // "By God's grace" / Plant stalk — symbol of organic growth & life
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = 1.3;

    const h = size * 0.55;
    ctx.beginPath();
    ctx.moveTo(0, -h);
    ctx.lineTo(0, h);
    ctx.stroke();

    // Symmetrical chevron leaves
    [-h * 0.4, 0, h * 0.4].forEach(ly => {
      ctx.beginPath();
      ctx.moveTo(-h * 0.45, ly - 3);
      ctx.quadraticCurveTo(0, ly, h * 0.45, ly - 3);
      ctx.stroke();
    });
    ctx.restore();
  }

  function drawKenteKnot(ctx, x, y, size, color, alpha) {
    // Interlocking woven chevron knot
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = 1.3;

    const s = size * 0.45;
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.lineTo(s, 0);
    ctx.lineTo(0, s);
    ctx.lineTo(-s, 0);
    ctx.closePath();
    ctx.stroke();

    // Inner cross knot
    ctx.beginPath();
    ctx.moveTo(-s * 0.5, 0);
    ctx.lineTo(s * 0.5, 0);
    ctx.moveTo(0, -s * 0.5);
    ctx.lineTo(0, s * 0.5);
    ctx.stroke();
    ctx.restore();
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    const now = performance.now();
    const elapsed = (now - startTime) * 0.001;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, 1);

    // Smooth cursor interpolation
    mouse.x += (mouse.targetX - mouse.x) * 0.18;
    mouse.y += (mouse.targetY - mouse.y) * 0.18;

    const leftColX = width * 0.052;
    const rightColX = width * 0.948;

    // 1. Draw Architectural Vertical Kente Guide Stripes (Subtle, elegant vertical totems)
    // Avoids all harsh diagonal polygon lines across the page!
    [leftColX, rightColX].forEach((colX, colIdx) => {
      ctx.save();
      const isLeft = colIdx === 0;

      // Soft vertical guide axis
      ctx.beginPath();
      ctx.setLineDash([8, 8]);
      ctx.moveTo(colX, 0);
      ctx.lineTo(colX, height);
      ctx.strokeStyle = "rgba(11, 45, 83, 0.10)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Parallel secondary accent line (woven Kente spacing)
      const offset = isLeft ? 14 : -14;
      ctx.beginPath();
      ctx.setLineDash([]);
      ctx.moveTo(colX + offset, 0);
      ctx.lineTo(colX + offset, height);
      ctx.strokeStyle = "rgba(242, 101, 34, 0.07)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Repeating subtle horizontal weft ticks down the margin
      const tickStep = 60;
      for (let ty = 30; ty < height; ty += tickStep) {
        ctx.beginPath();
        ctx.moveTo(colX - 6, ty);
        ctx.lineTo(colX + 6, ty);
        ctx.strokeStyle = "rgba(11, 45, 83, 0.08)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.restore();
    });

    // 2. Compute screen coordinates & render Hubs + Adinkra Motifs
    for (let i = 0; i < hubsData.length; i++) {
      const h = hubsData[i];
      const pageX = h.xP * width;
      const pageY = h.yP * docHeight;

      // Subtle breath oscillation along vertical totem
      const floatY = reduceMotion ? 0 : Math.sin(elapsed * 1.2 + h.phase) * 3;
      const vx = pageX;
      const vy = pageY - scrollY + floatY;

      // Visibility clipping
      if (vy < -90 || vy > height + 90) continue;

      // Mouse proximity interaction (lights up organically when user hovers nearby)
      let prox = 0;
      if (mouse.active > 0) {
        const dx = mouse.x - vx;
        const dy = mouse.y - vy;
        const dist = Math.hypot(dx, dy);
        if (dist < 220) {
          prox = (1 - dist / 220) * mouse.active;
        }
      }

      const isLeft = vx < width / 2;
      const isOrange = h.color === COLOR_ORANGE;
      const primaryColor = isOrange ? COLOR_ORANGE : COLOR_NAVY;
      const baseAlpha = 0.28 + prox * 0.65;

      // ── Draw Chosen Adinkra Symbol behind/beside the hub ──
      const symbolSize = 26 + prox * 4;
      if (h.symbol === "matemasie") {
        drawMateMasie(ctx, vx, vy, symbolSize, primaryColor, baseAlpha);
      } else if (h.symbol === "dwennimmen") {
        drawDwennimmen(ctx, vx, vy, symbolSize, primaryColor, baseAlpha);
      } else if (h.symbol === "nyamenti") {
        drawNyameNti(ctx, vx, vy, symbolSize, primaryColor, baseAlpha);
      } else {
        drawKenteKnot(ctx, vx, vy, symbolSize, primaryColor, baseAlpha);
      }

      // ── Central African Hub Core & Ring ──
      ctx.save();
      ctx.beginPath();
      ctx.arc(vx, vy, 4.2 + prox * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = primaryColor;
      ctx.globalAlpha = 0.85 + prox * 0.15;
      ctx.fill();

      // Subtle warm outer orbit ring on hover
      if (prox > 0.05) {
        ctx.beginPath();
        ctx.arc(vx, vy, 16 * (1 + prox * 0.2), 0, Math.PI * 2);
        ctx.strokeStyle = isOrange ? "rgba(242, 101, 34, 0.45)" : "rgba(11, 45, 83, 0.4)";
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      ctx.restore();

      // ── African Hub Code Badge & Label (e.g., "HRE / Harare", "NBO / Nairobi") ──
      const labelX = isLeft ? vx + 22 : vx - 22;
      const labelY = vy + 4;

      ctx.save();
      ctx.font = "700 11px 'JetBrains Mono', monospace";
      ctx.textAlign = isLeft ? "left" : "right";

      const textAlpha = 0.82 + prox * 0.18;
      ctx.fillStyle = isOrange
        ? `rgba(242, 101, 34, ${textAlpha})`
        : `rgba(11, 45, 83, ${textAlpha})`;
      ctx.fillText(h.code, labelX, labelY);

      // Subtitle / City name
      if (h.city) {
        ctx.font = "600 9.5px 'Manrope', sans-serif";
        const cityAlpha = 0.52 + prox * 0.48;
        ctx.fillStyle = `rgba(11, 45, 83, ${cityAlpha})`;
        ctx.fillText(h.city, labelX, labelY + 13);
      }

      // Refined fine connector tick mark from motif to city name
      ctx.beginPath();
      ctx.moveTo(vx + (isLeft ? 9 : -9), vy);
      ctx.lineTo(vx + (isLeft ? 17 : -17), vy);
      ctx.strokeStyle = isOrange
        ? `rgba(242, 101, 34, ${0.45 + prox * 0.4})`
        : `rgba(11, 45, 83, ${0.35 + prox * 0.4})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.restore();
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}