const thumbs = document.querySelectorAll(".thumb-panel");
const mainDisplay = document.getElementById("mainDisplay");
const displayNum = document.getElementById("displayNum");
const displayCategory = document.getElementById("displayCategory");
const displayTitle = document.getElementById("displayTitle");
const displayDesc = document.getElementById("displayDesc");
const displayContent = document.getElementById("displayContent");
let panelUpdateTimer;

function updateMainPanel(panel) {
  const { img, num, category, title, desc } = panel.dataset;

  window.clearTimeout(panelUpdateTimer);
  displayContent.classList.add("fade-out");

  panelUpdateTimer = window.setTimeout(() => {
    mainDisplay.style.backgroundImage = `url("${img}")`;
    displayNum.textContent = num;
    displayCategory.textContent = category;
    displayTitle.textContent = title;
    displayDesc.textContent = desc;
    displayContent.classList.remove("fade-out");
  }, 200);
}

thumbs.forEach((thumb) => {
  thumb.addEventListener("mouseenter", () => updateMainPanel(thumb));
  thumb.addEventListener("focus", () => updateMainPanel(thumb));
});

document.addEventListener("DOMContentLoaded", () => {

  // ============ CUSTOM CURSOR ============
  const cursor = document.querySelector(".cursor");
  const isFinePointer = window.matchMedia("(pointer: fine)").matches;

  if (cursor && isFinePointer) {
    document.body.classList.add("has-custom-cursor");
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx;
    let cy = my;

    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
    });

    (function animateCursor() {
      cx += (mx - cx) * 0.22;
      cy += (my - cy) * 0.22;
      cursor.style.left = cx + "px";
      cursor.style.top = cy + "px";
      requestAnimationFrame(animateCursor);
    })();

    // Cursor scaling on interactive elements — only if GSAP is available
    if (typeof gsap !== "undefined") {
      document
        .querySelectorAll("a, button, .serve-card, .why-card-6, .cinematic-panel")
        .forEach((el) => {
          el.addEventListener("mouseenter", () => {
            gsap.to(cursor, { width: 32, height: 32, opacity: 0.85, duration: 0.25, ease: "power2.out" });
          });
          el.addEventListener("mouseleave", () => {
            gsap.to(cursor, { width: 12, height: 12, opacity: 1, duration: 0.25, ease: "power2.out" });
          });
        });
    }
  }

  // ============ GSAP ANIMATIONS ============
  if (typeof gsap !== "undefined") {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const hasScrollTrigger = typeof ScrollTrigger !== "undefined";

    if (hasScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    if (!reduceMotion) {
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Cards are visible by default via CSS; GSAP animates them in on scroll
      gsap.set(".section-head-why, .why-card-6", { autoAlpha: 1 });

      intro
        .from(".site-header", { autoAlpha: 0, y: -18, duration: 0.65 })
        .from(
          ".headline .word > span",
          { yPercent: 105, duration: 0.9, stagger: 0.09, ease: "power4.out" },
          0.16,
        )
        .from(
          "#inlineImg, #ideaPill",
          { scale: 0, duration: 0.65, stagger: 0.12, ease: "back.out(1.5)" },
          0.34,
        )
        .to(".hero-orb-one", { x: 34, y: 18, duration: 2.2, ease: "sine.inOut" }, 0)
        .to(".hero-orb-two", { x: -28, y: -12, duration: 2.5, ease: "sine.inOut" }, 0.1)
        .to(".hero-orb-three", { x: 16, y: 22, duration: 2.8, ease: "sine.inOut" }, 0.2);

      gsap.to("#inlineImg", {
        y: 6,
        rotation: 2,
        duration: 2.8,
        delay: 1.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      gsap.to("#ideaPill", {
        y: 5,
        rotation: -1.5,
        duration: 3.2,
        delay: 1.7,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      if (hasScrollTrigger) {
        // Orbs parallax through the full parallax-stage (hero + pillars)
        gsap.to(".hero-orb-one", {
          y: 180,
          scrollTrigger: { trigger: ".parallax-stage", start: "top top", end: "bottom top", scrub: 1.4 },
        });
        gsap.to(".hero-orb-two", {
          y: -120,
          x: 20,
          scrollTrigger: { trigger: ".parallax-stage", start: "top top", end: "bottom top", scrub: 1.8 },
        });
        gsap.to(".hero-orb-three", {
          y: -90,
          x: 40,
          scrollTrigger: { trigger: ".parallax-stage", start: "top top", end: "bottom top", scrub: 1.0 },
        });
        // Pillars frame fades in gently as it enters view
        gsap.from(".pillars-frame", {
          autoAlpha: 0,
          y: 28,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ".section-1", start: "top 82%", once: true },
        });
        gsap.from(".section-content, .section-subtitle", {
          autoAlpha: 0,
          y: 20,
          duration: 0.7,
          stagger: 0.14,
          scrollTrigger: { trigger: ".section-1", start: "top 75%", once: true },
        });
        gsap.from(".cinematic-panel", {
          autoAlpha: 0,
          y: 48,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: { trigger: ".accordion-container", start: "top 78%", once: true },
        });
        gsap.from(".section-head-why, .why-card-6", {
          autoAlpha: 0,
          y: 42,
          duration: 0.7,
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".why-konsalta-section",
            start: "top 85%",
            once: true,
          },
        });
      }

      if (canHover) {
        const inlineImg = document.getElementById("inlineImg");
        const ideaPill = document.getElementById("ideaPill");

        inlineImg.addEventListener("mouseenter", () => {
          gsap.to(inlineImg, { scale: 1.08, rotation: 4, duration: 0.35, ease: "back.out(1.6)" });
        });
        inlineImg.addEventListener("mouseleave", () => {
          gsap.to(inlineImg, { scale: 1, rotation: 0, duration: 0.55, ease: "elastic.out(1, 0.6)" });
        });
        ideaPill.addEventListener("mouseenter", () => {
          gsap.to(ideaPill, { scale: 1.06, rotation: -3, duration: 0.35, ease: "back.out(1.6)" });
          gsap.to(ideaPill.querySelector(".leaf"), { rotation: "+=360", duration: 0.75, ease: "power2.inOut" });
        });
        ideaPill.addEventListener("mouseleave", () => {
          gsap.to(ideaPill, { scale: 1, rotation: 0, duration: 0.55, ease: "elastic.out(1, 0.6)" });
        });
      }
    }
  }

  // ============ MULTI-HUB CONNECTION MESH ============
  initMultiHubMesh();

}); // end DOMContentLoaded

// Refresh ScrollTrigger after fonts/images finish loading so trigger
// positions are calculated against the final settled layout.
window.addEventListener("load", function () {
  if (typeof ScrollTrigger !== "undefined") {
    ScrollTrigger.refresh();
  }
});

// ============================================================
//   MULTI-HUB CONNECTION MESH (Negative Space Network)
//   Visualizes Konsalta's multi-hub African network
//   with ambient node floating & interactive cursor proximity
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
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // Strategic hub placement in negative space (left & right gutters + transition zones)
  const hubsData = [
    // Hero & Top Header Flanks
    { xP: 0.08, yP: 0.06, code: "HRE", city: "Harare", color: COLOR_ORANGE, primary: true, phase: 0 },
    { xP: 0.15, yP: 0.12, code: "", city: "", color: COLOR_NAVY, primary: false, phase: 1.2 },
    { xP: 0.05, yP: 0.19, code: "LUN", city: "Lusaka", color: COLOR_NAVY, primary: true, phase: 2.1 },
    { xP: 0.92, yP: 0.07, code: "NBO", city: "Nairobi", color: COLOR_ORANGE, primary: true, phase: 0.8 },
    { xP: 0.85, yP: 0.15, code: "KGL", city: "Kigali", color: COLOR_NAVY, primary: true, phase: 2.5 },
    { xP: 0.94, yP: 0.22, code: "", city: "", color: COLOR_ORANGE, primary: false, phase: 3.1 },

    // Pillars Intro & Frame Flanks
    { xP: 0.06, yP: 0.28, code: "GBE", city: "Gaborone", color: COLOR_NAVY, primary: true, phase: 1.5 },
    { xP: 0.13, yP: 0.35, code: "WDH", city: "Windhoek", color: COLOR_ORANGE, primary: true, phase: 2.7 },
    { xP: 0.04, yP: 0.42, code: "", city: "", color: COLOR_NAVY, primary: false, phase: 3.9 },
    { xP: 0.93, yP: 0.30, code: "DAR", city: "Dar es Salaam", color: COLOR_NAVY, primary: true, phase: 0.4 },
    { xP: 0.86, yP: 0.38, code: "EBB", city: "Kampala", color: COLOR_ORANGE, primary: true, phase: 1.8 },
    { xP: 0.95, yP: 0.44, code: "ADD", city: "Addis Ababa", color: COLOR_NAVY, primary: true, phase: 2.9 },

    // Accordion & Transition Flanks
    { xP: 0.05, yP: 0.51, code: "MPM", city: "Maputo", color: COLOR_ORANGE, primary: true, phase: 1.1 },
    { xP: 0.12, yP: 0.58, code: "", city: "", color: COLOR_NAVY, primary: false, phase: 2.3 },
    { xP: 0.07, yP: 0.65, code: "LLW", city: "Lilongwe", color: COLOR_NAVY, primary: true, phase: 3.4 },
    { xP: 0.94, yP: 0.52, code: "CAI", city: "Cairo", color: COLOR_NAVY, primary: true, phase: 0.6 },
    { xP: 0.87, yP: 0.59, code: "", city: "", color: COLOR_ORANGE, primary: false, phase: 1.9 },
    { xP: 0.93, yP: 0.66, code: "LOS", city: "Lagos", color: COLOR_ORANGE, primary: true, phase: 2.8 },

    // 6 Value Drivers Flanks
    { xP: 0.06, yP: 0.73, code: "ACC", city: "Accra", color: COLOR_NAVY, primary: true, phase: 0.9 },
    { xP: 0.14, yP: 0.79, code: "ABJ", city: "Abidjan", color: COLOR_ORANGE, primary: true, phase: 2.0 },
    { xP: 0.05, yP: 0.86, code: "DKR", city: "Dakar", color: COLOR_NAVY, primary: true, phase: 3.2 },
    { xP: 0.12, yP: 0.92, code: "", city: "", color: COLOR_NAVY, primary: false, phase: 4.1 },
    { xP: 0.93, yP: 0.74, code: "JNB", city: "Johannesburg", color: COLOR_ORANGE, primary: true, phase: 1.3 },
    { xP: 0.86, yP: 0.81, code: "", city: "", color: COLOR_NAVY, primary: false, phase: 2.4 },
    { xP: 0.94, yP: 0.88, code: "CPT", city: "Cape Town", color: COLOR_NAVY, primary: true, phase: 3.5 },
    { xP: 0.88, yP: 0.94, code: "MRU", city: "Mauritius", color: COLOR_ORANGE, primary: true, phase: 0.5 },
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

      // Subtle float motion
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
        if (dist < 210) {
          prox = (1 - dist / 210) * mouse.active;
        }
      }

      screenNodes.push({
        ...h,
        vx,
        vy,
        prox,
        visible: vy >= -80 && vy <= height + 80,
      });
    }

    // 1. Draw ambient connecting threads between neighbouring visible nodes
    for (let i = 0; i < screenNodes.length; i++) {
      const a = screenNodes[i];
      if (!a.visible) continue;

      for (let j = i + 1; j < screenNodes.length; j++) {
        const b = screenNodes[j];
        if (!b.visible) continue;

        const dx = b.vx - a.vx;
        const dy = b.vy - a.vy;
        const dist = Math.hypot(dx, dy);

        // Connect nodes on the same flank within reasonable distance
        if (dist < 260 && Math.abs(dx) < 180) {
          const maxProx = Math.max(a.prox, b.prox);
          const baseAlpha = 0.045;
          const activeAlpha = baseAlpha + maxProx * 0.32;

          ctx.beginPath();
          ctx.moveTo(a.vx, a.vy);
          ctx.lineTo(b.vx, b.vy);

          if (maxProx > 0.05) {
            const grad = ctx.createLinearGradient(a.vx, a.vy, b.vx, b.vy);
            grad.addColorStop(0, a.color === COLOR_ORANGE ? `rgba(242, 101, 34, ${activeAlpha})` : `rgba(11, 45, 83, ${activeAlpha})`);
            grad.addColorStop(1, b.color === COLOR_ORANGE ? `rgba(242, 101, 34, ${activeAlpha})` : `rgba(11, 45, 83, ${activeAlpha})`);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1 + maxProx * 0.6;
          } else {
            ctx.strokeStyle = `rgba(11, 45, 83, ${baseAlpha})`;
            ctx.lineWidth = 1;
          }
          ctx.stroke();
        }
      }
    }

    // 2. Draw dynamic cursor connector rays to nearby nodes
    if (mouse.active > 0) {
      for (let i = 0; i < screenNodes.length; i++) {
        const node = screenNodes[i];
        if (!node.visible || node.prox <= 0.01) continue;

        const grad = ctx.createLinearGradient(mouse.x, mouse.y, node.vx, node.vy);
        grad.addColorStop(0, `rgba(242, 101, 34, ${0.45 * node.prox})`);
        grad.addColorStop(0.65, `rgba(11, 45, 83, ${0.22 * node.prox})`);
        grad.addColorStop(1, `rgba(11, 45, 83, ${0.08 * node.prox})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1 + node.prox * 1.0;
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(node.vx, node.vy);
        ctx.stroke();
      }
    }

    // 3. Render Hub Nodes & Labels
    for (let i = 0; i < screenNodes.length; i++) {
      const node = screenNodes[i];
      if (!node.visible) continue;

      const p = node.prox;
      const isOrange = node.color === COLOR_ORANGE;
      const baseRadius = node.primary ? 3.0 : 1.8;
      const radius = baseRadius * (1 + p * 0.35);

      if (node.primary) {
        // Outer pulsing orbit ring
        const pulse = Math.sin(elapsed * 2 + node.phase) * 1.5;
        const ringR = (8.5 + pulse) * (1 + p * 0.3);

        ctx.beginPath();
        ctx.arc(node.vx, node.vy, ringR, 0, Math.PI * 2);
        ctx.strokeStyle = isOrange
          ? `rgba(242, 101, 34, ${0.2 + p * 0.4})`
          : `rgba(11, 45, 83, ${0.16 + p * 0.35})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Inner solid hub core
        ctx.beginPath();
        ctx.arc(node.vx, node.vy, radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Hub Badge Label (e.g. "HRE", "NBO", "JNB")
        if (node.code) {
          const isLeft = node.vx < width / 2;
          const labelX = isLeft ? node.vx + 14 : node.vx - 14;
          const labelY = node.vy + 3.5;

          ctx.save();
          ctx.font = "600 9px 'JetBrains Mono', monospace";
          ctx.textAlign = isLeft ? "left" : "right";

          // Text opacity: 0.35 at rest, up to 0.95 when near cursor
          const textAlpha = 0.32 + p * 0.63;
          ctx.fillStyle = isOrange
            ? `rgba(242, 101, 34, ${textAlpha})`
            : `rgba(11, 45, 83, ${textAlpha})`;

          ctx.fillText(node.code, labelX, labelY);

          // Subtitle / City name on hover
          if (p > 0.35 && node.city) {
            ctx.font = "500 8px 'Manrope', sans-serif";
            ctx.fillStyle = `rgba(11, 45, 83, ${(p - 0.35) * 1.4})`;
            ctx.fillText(node.city, labelX, labelY + 11);
          }

          // Small connector tick mark
          ctx.beginPath();
          ctx.moveTo(node.vx + (isLeft ? 5 : -5), node.vy);
          ctx.lineTo(node.vx + (isLeft ? 10 : -10), node.vy);
          ctx.strokeStyle = isOrange ? `rgba(242, 101, 34, ${0.3 + p * 0.5})` : `rgba(11, 45, 83, ${0.25 + p * 0.4})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.restore();
        }
      } else {
        // Secondary vertex: delicate geometric diamond
        ctx.save();
        ctx.translate(node.vx, node.vy);
        ctx.rotate(Math.PI / 4);
        ctx.fillStyle = isOrange
          ? `rgba(242, 101, 34, ${0.3 + p * 0.5})`
          : `rgba(11, 45, 83, ${0.25 + p * 0.45})`;
        ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
        ctx.restore();
      }
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}
