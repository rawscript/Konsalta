/**
 * whyUs.js — optimised for performance
 * - Single DOMContentLoaded entry point
 * - Cursor uses rAF loop only, no per-element GSAP tweens
 * - Orb parallax merged into one scrub timeline
 * - Panel update debounced with a single timer ref
 */

document.addEventListener("DOMContentLoaded", () => {

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

  const reduceMotion  = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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

    // cinematic panels — batch so stagger is driven by one ST instance
    gsap.from(".cinematic-panel", {
      autoAlpha: 0, y: 40, duration: 0.75, stagger: 0.08,
      scrollTrigger: { trigger: ".accordion-container", start: "top 80%", once: true },
    });

    // why-cards — use gsap.utils.toArray + batch for clean stagger
    gsap.from(".section-head-why, .why-card-6", {
      autoAlpha: 0, y: 36, duration: 0.65, stagger: 0.08,
      scrollTrigger: { trigger: ".why-konsalta-section", start: "top 86%", once: true },
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
//   MULTI-HUB CONNECTION MESH (Negative Space Network)
//   Visualizes Konsalta's multi-hub African research & advisory
//   network with ambient floating, animated signal pulses,
//   and high-visibility negative space presence.
// ============================================================
function initMultiHubMesh() {
  const canvas = document.getElementById("hubMeshCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const COLOR_NAVY = "#0B2D53";
  const COLOR_ORANGE = "#F26522";

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

  // Strategic hub placement in negative space (left & right gutters)
  const hubsData = [
    // ── Hero & Top Flanks (Visible immediately on load) ──
    { xP: 0.055, yP: 0.045, code: "HRE", city: "Harare", color: COLOR_ORANGE, primary: true, phase: 0 },
    { xP: 0.125, yP: 0.085, code: "", city: "", color: COLOR_NAVY, primary: false, phase: 1.2 },
    { xP: 0.045, yP: 0.135, code: "LUN", city: "Lusaka", color: COLOR_NAVY, primary: true, phase: 2.1 },
    { xP: 0.115, yP: 0.185, code: "", city: "", color: COLOR_ORANGE, primary: false, phase: 3.0 },

    { xP: 0.935, yP: 0.050, code: "NBO", city: "Nairobi", color: COLOR_ORANGE, primary: true, phase: 0.8 },
    { xP: 0.865, yP: 0.095, code: "KGL", city: "Kigali", color: COLOR_NAVY, primary: true, phase: 2.5 },
    { xP: 0.945, yP: 0.150, code: "ADD", city: "Addis Ababa", color: COLOR_NAVY, primary: true, phase: 1.7 },
    { xP: 0.875, yP: 0.200, code: "", city: "", color: COLOR_ORANGE, primary: false, phase: 3.3 },

    // ── Pillars Section Flanks ──
    { xP: 0.055, yP: 0.260, code: "GBE", city: "Gaborone", color: COLOR_NAVY, primary: true, phase: 1.5 },
    { xP: 0.125, yP: 0.325, code: "WDH", city: "Windhoek", color: COLOR_ORANGE, primary: true, phase: 2.7 },
    { xP: 0.045, yP: 0.390, code: "", city: "", color: COLOR_NAVY, primary: false, phase: 3.9 },

    { xP: 0.935, yP: 0.275, code: "DAR", city: "Dar es Salaam", color: COLOR_NAVY, primary: true, phase: 0.4 },
    { xP: 0.865, yP: 0.340, code: "EBB", city: "Kampala", color: COLOR_ORANGE, primary: true, phase: 1.8 },
    { xP: 0.945, yP: 0.405, code: "", city: "", color: COLOR_NAVY, primary: false, phase: 2.9 },

    // ── Accordion / Mid Section Flanks ──
    { xP: 0.050, yP: 0.475, code: "MPM", city: "Maputo", color: COLOR_ORANGE, primary: true, phase: 1.1 },
    { xP: 0.120, yP: 0.540, code: "", city: "", color: COLOR_NAVY, primary: false, phase: 2.3 },
    { xP: 0.060, yP: 0.605, code: "LLW", city: "Lilongwe", color: COLOR_NAVY, primary: true, phase: 3.4 },

    { xP: 0.940, yP: 0.485, code: "CAI", city: "Cairo", color: COLOR_NAVY, primary: true, phase: 0.6 },
    { xP: 0.870, yP: 0.550, code: "", city: "", color: COLOR_ORANGE, primary: false, phase: 1.9 },
    { xP: 0.935, yP: 0.615, code: "LOS", city: "Lagos", color: COLOR_ORANGE, primary: true, phase: 2.8 },

    // ── 6 Strategic Pillars Flanks ──
    { xP: 0.055, yP: 0.690, code: "ACC", city: "Accra", color: COLOR_NAVY, primary: true, phase: 0.9 },
    { xP: 0.130, yP: 0.755, code: "ABJ", city: "Abidjan", color: COLOR_ORANGE, primary: true, phase: 2.0 },
    { xP: 0.048, yP: 0.825, code: "DKR", city: "Dakar", color: COLOR_NAVY, primary: true, phase: 3.2 },
    { xP: 0.115, yP: 0.890, code: "", city: "", color: COLOR_NAVY, primary: false, phase: 4.1 },

    { xP: 0.930, yP: 0.700, code: "JNB", city: "Johannesburg", color: COLOR_ORANGE, primary: true, phase: 1.3 },
    { xP: 0.865, yP: 0.765, code: "", city: "", color: COLOR_NAVY, primary: false, phase: 2.4 },
    { xP: 0.940, yP: 0.835, code: "CPT", city: "Cape Town", color: COLOR_NAVY, primary: true, phase: 3.5 },
    { xP: 0.875, yP: 0.900, code: "MRU", city: "Mauritius", color: COLOR_ORANGE, primary: true, phase: 0.5 },
  ];

  // Guaranteed constellation links forming continuous geometric network
  const constellationLinks = [
    // Left flank chains
    [0, 1], [1, 2], [2, 3], [3, 8], [8, 9], [9, 10], [10, 14], [14, 15], [15, 16], [16, 20], [20, 21], [21, 22], [22, 23],
    [0, 2], [1, 3], [8, 10], [14, 16], [20, 22],
    // Right flank chains
    [4, 5], [5, 6], [6, 7], [7, 11], [11, 12], [12, 13], [13, 17], [17, 18], [18, 19], [19, 24], [24, 25], [25, 26], [26, 27],
    [4, 6], [5, 7], [11, 13], [17, 19], [24, 26], [25, 27],
    // Subtle cross-arch connectors at transition spaces
    [3, 7], [10, 13], [21, 25]
  ];

  // Travelling data pulses along links
  const pulses = [
    { linkIdx: 0, progress: 0.2, speed: 0.0035 },
    { linkIdx: 2, progress: 0.7, speed: 0.0040 },
    { linkIdx: 7, progress: 0.4, speed: 0.0038 },
    { linkIdx: 12, progress: 0.1, speed: 0.0042 },
    { linkIdx: 17, progress: 0.5, speed: 0.0036 },
    { linkIdx: 22, progress: 0.8, speed: 0.0045 }
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

  function render() {
    ctx.clearRect(0, 0, width, height);

    const now = performance.now();
    const elapsed = (now - startTime) * 0.001;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, 1);

    // Smooth cursor interpolation
    mouse.x += (mouse.targetX - mouse.x) * 0.18;
    mouse.y += (mouse.targetY - mouse.y) * 0.18;

    // Compute screen coordinates for all nodes
    const screenNodes = [];
    for (let i = 0; i < hubsData.length; i++) {
      const h = hubsData[i];
      const pageX = h.xP * width;
      const pageY = h.yP * docHeight;

      // Gentle floating oscillation
      const floatX = reduceMotion ? 0 : Math.sin(elapsed * 1.1 + h.phase) * 3.5;
      const floatY = reduceMotion ? 0 : Math.cos(elapsed * 0.9 + h.phase) * 3.5;

      const vx = pageX + floatX;
      const vy = pageY - scrollY + floatY;

      // Proximity to mouse
      let prox = 0;
      if (mouse.active > 0) {
        const dx = mouse.x - vx;
        const dy = mouse.y - vy;
        const dist = Math.hypot(dx, dy);
        if (dist < 240) {
          prox = (1 - dist / 240) * mouse.active;
        }
      }

      screenNodes.push({
        ...h,
        vx,
        vy,
        prox,
        visible: vy >= -120 && vy <= height + 120,
      });
    }

    // 1. Draw Guaranteed Constellation Links
    for (let i = 0; i < constellationLinks.length; i++) {
      const link = constellationLinks[i];
      const a = screenNodes[link[0]];
      const b = screenNodes[link[1]];
      if (!a || !b) continue;
      if (!a.visible && !b.visible) continue;

      const maxProx = Math.max(a.prox, b.prox);
      const isCrossArch = Math.abs(a.vx - b.vx) > width * 0.4;
      const baseAlpha = isCrossArch ? 0.10 : 0.28;
      const activeAlpha = baseAlpha + maxProx * 0.55;

      ctx.save();
      ctx.beginPath();
      if (isCrossArch) {
        ctx.setLineDash([4, 8]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.moveTo(a.vx, a.vy);
      ctx.lineTo(b.vx, b.vy);

      if (maxProx > 0.05) {
        const grad = ctx.createLinearGradient(a.vx, a.vy, b.vx, b.vy);
        grad.addColorStop(0, a.color === COLOR_ORANGE ? `rgba(242, 101, 34, ${activeAlpha})` : `rgba(11, 45, 83, ${activeAlpha})`);
        grad.addColorStop(1, b.color === COLOR_ORANGE ? `rgba(242, 101, 34, ${activeAlpha})` : `rgba(11, 45, 83, ${activeAlpha})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4 + maxProx * 1.0;
      } else {
        ctx.strokeStyle = `rgba(11, 45, 83, ${baseAlpha})`;
        ctx.lineWidth = isCrossArch ? 1 : 1.2;
      }
      ctx.stroke();
      ctx.restore();
    }

    // 2. Animate Data Signal Pulses Along Links
    if (!reduceMotion) {
      for (let p = 0; p < pulses.length; p++) {
        const pulse = pulses[p];
        pulse.progress = (pulse.progress + pulse.speed) % 1;
        const link = constellationLinks[pulse.linkIdx];
        if (!link) continue;
        const a = screenNodes[link[0]];
        const b = screenNodes[link[1]];
        if (!a || !b || (!a.visible && !b.visible)) continue;

        const px = a.vx + (b.vx - a.vx) * pulse.progress;
        const py = a.vy + (b.vy - a.vy) * pulse.progress;

        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = pulse.linkIdx % 2 === 0 ? "rgba(242, 101, 34, 0.85)" : "rgba(11, 45, 83, 0.75)";
        ctx.fill();
      }
    }

    // 3. Draw Dynamic Cursor Connector Rays
    if (mouse.active > 0) {
      for (let i = 0; i < screenNodes.length; i++) {
        const node = screenNodes[i];
        if (!node.visible || node.prox <= 0.02) continue;

        const grad = ctx.createLinearGradient(mouse.x, mouse.y, node.vx, node.vy);
        grad.addColorStop(0, `rgba(242, 101, 34, ${0.55 * node.prox})`);
        grad.addColorStop(0.7, `rgba(11, 45, 83, ${0.30 * node.prox})`);
        grad.addColorStop(1, `rgba(11, 45, 83, ${0.12 * node.prox})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2 + node.prox * 1.2;
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(node.vx, node.vy);
        ctx.stroke();
      }
    }

    // 4. Render Hub Nodes & Badges
    for (let i = 0; i < screenNodes.length; i++) {
      const node = screenNodes[i];
      if (!node.visible) continue;

      const p = node.prox;
      const isOrange = node.color === COLOR_ORANGE;
      const baseRadius = node.primary ? 5.0 : 3.2;
      const radius = baseRadius * (1 + p * 0.35);

      if (node.primary) {
        // Outer pulsing orbit ring
        const pulse = Math.sin(elapsed * 2.2 + node.phase) * 2.2;
        const ringR = (15 + pulse) * (1 + p * 0.32);

        ctx.beginPath();
        ctx.arc(node.vx, node.vy, ringR, 0, Math.PI * 2);
        ctx.strokeStyle = isOrange
          ? `rgba(242, 101, 34, ${0.40 + p * 0.45})`
          : `rgba(11, 45, 83, ${0.35 + p * 0.45})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Inner orbit ring
        ctx.beginPath();
        ctx.arc(node.vx, node.vy, 9 * (1 + p * 0.2), 0, Math.PI * 2);
        ctx.strokeStyle = isOrange
          ? `rgba(242, 101, 34, ${0.25 + p * 0.35})`
          : `rgba(11, 45, 83, ${0.22 + p * 0.35})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Solid Hub Core with subtle glow
        ctx.save();
        ctx.beginPath();
        ctx.arc(node.vx, node.vy, radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();

        // Hub Code Badge (e.g. "HRE", "NBO", "JNB")
        if (node.code) {
          const isLeft = node.vx < width / 2;
          const labelX = isLeft ? node.vx + 18 : node.vx - 18;
          const labelY = node.vy + 4;

          ctx.save();
          ctx.font = "700 11px 'JetBrains Mono', monospace";
          ctx.textAlign = isLeft ? "left" : "right";

          // Text opacity: clearly visible at rest (0.80), brighter on proximity
          const textAlpha = 0.80 + p * 0.20;
          ctx.fillStyle = isOrange
            ? `rgba(242, 101, 34, ${textAlpha})`
            : `rgba(11, 45, 83, ${textAlpha})`;

          ctx.fillText(node.code, labelX, labelY);

          // Subtitle / City name
          if (node.city) {
            ctx.font = "600 9.5px 'Manrope', sans-serif";
            const cityAlpha = 0.50 + p * 0.50;
            ctx.fillStyle = `rgba(11, 45, 83, ${cityAlpha})`;
            ctx.fillText(node.city, labelX, labelY + 13);
          }

          // Small connector tick mark
          ctx.beginPath();
          ctx.moveTo(node.vx + (isLeft ? 7 : -7), node.vy);
          ctx.lineTo(node.vx + (isLeft ? 14 : -14), node.vy);
          ctx.strokeStyle = isOrange
            ? `rgba(242, 101, 34, ${0.55 + p * 0.4})`
            : `rgba(11, 45, 83, ${0.45 + p * 0.4})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          ctx.restore();
        }
      } else {
        // Secondary vertex: geometric diamond waypoint
        ctx.save();
        ctx.translate(node.vx, node.vy);
        ctx.rotate(Math.PI / 4);
        ctx.fillStyle = isOrange
          ? `rgba(242, 101, 34, ${0.50 + p * 0.45})`
          : `rgba(11, 45, 83, ${0.45 + p * 0.45})`;
        ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
        ctx.restore();
      }
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}
