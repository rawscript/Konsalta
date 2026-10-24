// ===== DATA SETS =====
// Hero content per nav tab
const heroData = {
  why: {
    words: ["We", "drive", "growth", "to", "your", "business"],
    subtitle:
      "Unlock your brand's potential with our proven marketing expertise. From strategy to execution, we drive growth.",
  },
  about: {
    words: ["Built", "by", "operators", "who", "shipped", "real", "brands"],
    subtitle:
      "Six years in-house at growth-stage startups taught us what actually moves a number. Now we run that playbook for you.",
  },
  portfolio: {
    words: ["Forty", "launches.", "Eleven", "rebrands.", "Three", "IPOs."],
    subtitle:
      "Selected work across SaaS, consumer, and fintech. Every project earned a number we can show you on a call.",
  },
};

// Testimonials carousel
const testimonials = [
  {
    p1: "Core Methodology Principle.",
    p2: "Impressed with the results!",
    initials: "K.",
    avatars: [12, 47],
  },
  {
    p1: "Connecting deep domain research with high-level advisory to shape actionable institutional growth.",
    p2: "Senior Advisory.",
    initials: "K.",
    avatars: [32, 68],
  },
  {
    p1: "Impact Comes from Actionable Insights.",
    p2: "Konsalta Initiative.",
    initials: "K.",
    avatars: [52, 60],
  },
];
let testimonialIndex = 0;

// ===== INIT =====
if (typeof gsap !== "undefined") {
  document.body.classList.add("js-ready");
}

document.addEventListener("DOMContentLoaded", () => {
  // ===== GSAP-POWERED CHECKERED GRID TRACKING EFFECT =====
  initCheckeredGridTracking();

  // ===== INTRO TIMELINE =====
  if (typeof gsap !== "undefined") {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.to(
      ".headline .word, .headline .arrow",
      { opacity: 1, duration: 0.4, stagger: 0.06 },
      0.2
    )
      .from(
        ".headline .word",
        {
          y: 40,
          rotateX: -50,
          duration: 0.8,
          stagger: 0.06,
          ease: "back.out(1.4)",
        },
        "<",
      )
      .from(
        ".headline .arrow",
        {
          scale: 0,
          rotation: -90,
          duration: 0.7,
          ease: "back.out(2)",
        },
        "-=0.4",
      )
      .to(".subtitle", { opacity: 1, duration: 0.5 }, "-=0.3")
      .from(".subtitle", { y: 14, duration: 0.55 }, "<")
      .to(".cta-yellow", { opacity: 1, duration: 0.4 }, "-=0.3")
      .from(
        ".cta-yellow",
        {
          y: 24,
          scale: 0.85,
          duration: 0.7,
          ease: "back.out(1.7)",
        },
        "<",
      )
      .to(
        ".card-base, .stat-half",
        { opacity: 1, duration: 0.4, stagger: 0.1 },
        "-=0.2",
      )
      .from(
        ".card-base, .stat-half",
        {
          y: 30,
          scale: 0.96,
          duration: 0.7,
          stagger: 0.1,
          ease: "back.out(1.4)",
        },
        "<",
      )
      .to(".tag", { opacity: 1, duration: 0.3, stagger: 0.06 }, "-=0.5")
      .from(
        ".tag",
        {
          scale: 0.3,
          duration: 0.7,
          stagger: 0.06,
          ease: "back.out(2)",
        },
        "<",
      );

    // Continuous loops
    gsap.to(".headline .arrow", {
      y: -5,
      rotation: 3,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 2.5,
    });

    gsap.to(".cta-yellow", {
      scale: 1.02,
      duration: 1.6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 3,
    });

    // ===== ANIMATED COUNTERS =====
    animateCounter("#stat1Num", 9, "Services", 1.6);
    animateCounter("#stat2Num", 100, "%", 1.6, );
  }

  function animateCounter(selector, target, suffix, duration, prefix = "") {
    const el = document.querySelector(selector);
    if (!el) return;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: duration,
      ease: "power2.out",
      delay: 1.8,
      onUpdate: () => {
        let displayVal;
        if (target >= 1) {
          displayVal = obj.val.toFixed(target % 1 === 0 ? 0 : 1);
        } else {
          displayVal = obj.val.toFixed(1);
        }
        el.textContent = prefix + displayVal + suffix;
      },
    });
  }

  // ===== NAV TAB SWITCHING =====
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      const tab = link.dataset.tab;
      if (!tab || !heroData[tab]) return;

      // Update active state
      document
        .querySelectorAll(".nav-link")
        .forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      const data = heroData[tab];
      const headlineEl = document.getElementById("headline");
      const subtitleEl = document.getElementById("subtitle");

      if (typeof gsap === "undefined") {
        // No-animation fallback
        rebuildHeadline(data.words);
        subtitleEl.textContent = data.subtitle;
        return;
      }

      // Fade out current content
      gsap.to(".headline .word, .headline .arrow", {
        opacity: 0,
        y: -10,
        duration: 0.25,
        stagger: 0.02,
        ease: "power2.in",
        onComplete: () => {
          // Rebuild headline
          rebuildHeadline(data.words);

          // Fade in new
          gsap.set(".headline .word, .headline .arrow", { opacity: 0, y: 15 });
          gsap.to(".headline .word, .headline .arrow", {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.04,
            ease: "back.out(1.4)",
          });
        },
      });

      gsap.to(subtitleEl, {
        opacity: 0,
        y: -6,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          subtitleEl.textContent = data.subtitle;
          gsap.set(subtitleEl, { opacity: 0, y: 8 });
          gsap.to(subtitleEl, {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power3.out",
          });
        },
      });
    });
  });

  function rebuildHeadline(words) {
    const headlineEl = document.getElementById("headline");
    const arrowHTML = headlineEl.querySelector(".arrow").outerHTML;
    headlineEl.innerHTML =
      words.map((w) => `<span class="word">${w}</span>`).join(" ") +
      " " +
      arrowHTML;
  }

  // ===== SHUFFLEABLE TAGS =====
  function shuffleTags() {
    if (typeof gsap === "undefined") return;
    const container = document.getElementById("tagsContainer");
    const tags = container.querySelectorAll(".tag");
    const containerRect = container.getBoundingClientRect();

    // Define rough slots so tags don't overlap horribly
    const slots = [
      { top: 5, left: 25 },
      { top: 18, left: 0 },
      { top: 18, left: 55 },
      { top: 42, left: 12 },
      { top: 42, left: 58 },
      { top: 70, left: 4 },
      { top: 70, left: 50 },
      { top: 88, left: 25 },
    ];
    const shuffled = [...slots].sort(() => Math.random() - 0.5);

    tags.forEach((tag, i) => {
      const slot = shuffled[i] || shuffled[0];
      const rotation = Math.random() * 14 - 7;
      gsap.to(tag, {
        top: slot.top + "%",
        left: slot.left + "%",
        rotation: rotation,
        duration: 0.7,
        ease: "back.out(1.4)",
        delay: i * 0.03,
      });
    });
  }

  document.querySelectorAll(".tag").forEach((tag) => {
    tag.addEventListener("click", (e) => {
      e.stopPropagation();
      shuffleTags();

      if (typeof gsap !== "undefined") {
        gsap.fromTo(
          tag,
          { scale: 1 },
          {
            scale: 1.25,
            duration: 0.18,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut",
          },
        );
      }
    });
    // hover lift
    tag.addEventListener("mouseenter", () => {
      if (typeof gsap !== "undefined") {
        gsap.to(tag, {
          y: "-=6",
          scale: 1.05,
          duration: 0.25,
          ease: "back.out(2)",
          overwrite: "auto",
        });
      }
    });
    tag.addEventListener("mouseleave", () => {
      if (typeof gsap !== "undefined") {
        gsap.to(tag, {
          y: 0,
          scale: 1,
          duration: 0.35,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    });
  });

  // ===== TESTIMONIAL CAROUSEL =====
  function cycleTestimonial() {
    testimonialIndex = (testimonialIndex + 1) % testimonials.length;
    const t = testimonials[testimonialIndex];

    const p1 = document.getElementById("testimonialP1");
    const p2 = document.getElementById("testimonialP2");
    const initials = document.getElementById("authorInitials");
    const avatarsContainer = document.getElementById("testimonialAvatars");

    if (typeof gsap === "undefined") {
      p1.textContent = t.p1;
      p2.textContent = t.p2;
      initials.textContent = t.initials;
      return;
    }

    gsap.to([p1, p2, initials], {
      opacity: 0,
      y: -8,
      duration: 0.22,
      ease: "power2.in",
      stagger: 0.04,
      onComplete: () => {
        p1.textContent = t.p1;
        p2.textContent = t.p2;
        initials.textContent = t.initials;

        // Update avatar imgs
        const avatarEls = avatarsContainer.querySelectorAll(".avatar-mini img");
        t.avatars.forEach((idx, i) => {
          if (avatarEls[i]) {
            // Blank neutral gray avatar SVG placeholder
            avatarEls[i].src =
              `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><rect width='100%' height='100%' fill='%23e2e8f0'/><circle cx='40' cy='32' r='16' fill='%23cbd5e1'/><path d='M12 72 C 12 52, 28 44, 40 44 C 52 44, 68 52, 68 72 Z' fill='%23cbd5e1'/></svg>`;
          }
        });

        gsap.set([p1, p2, initials], { opacity: 0, y: 8 });
        gsap.to([p1, p2, initials], {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.05,
          ease: "power3.out",
        });

        // Initials badge pop
        gsap.fromTo(
          initials,
          { scale: 0.7 },
          { scale: 1, duration: 0.5, ease: "back.out(2)" },
        );
      },
    });
  }

  document
    .querySelectorAll("#testimonialAvatars .avatar-mini, #authorInitials")
    .forEach((el) => {
      el.style.cursor = "pointer";
      el.addEventListener("click", cycleTestimonial);
    });

  // Auto-cycle every 7s
  setInterval(cycleTestimonial, 7000);

  // ===== BOOK A CALL ATTENTION =====
  const ctaBig = document.getElementById("ctaBig");
  if (ctaBig) {
    ctaBig.addEventListener("click", function () {
      if (typeof gsap === "undefined") return;
      gsap.fromTo(
        this,
        { scale: 0.94 },
        { scale: 1, duration: 0.6, ease: "elastic.out(1.2, 0.4)" },
      );
      // Pulse the headline arrow
      gsap.fromTo(
        ".headline .arrow",
        { scale: 1 },
        {
          scale: 1.3,
          rotation: 15,
          duration: 0.4,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut",
        },
      );
    });
  }

  const bookCtaNav = document.getElementById("bookCtaNav");
  if (bookCtaNav) {
    bookCtaNav.addEventListener("click", function () {
      const target = document.getElementById("ctaBig");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        if (typeof gsap !== "undefined") {
          setTimeout(() => {
            gsap.fromTo(
              target,
              { scale: 1 },
              {
                scale: 1.08,
                duration: 0.4,
                yoyo: true,
                repeat: 2,
                ease: "power2.inOut",
              },
            );
          }, 400);
        }
      }
    });
  }

  // Stat half hover triggers counter replay
  const statTop = document.getElementById("statTop");
  if (statTop) {
    statTop.addEventListener("click", () => {
      if (typeof gsap === "undefined") return;
      const el = document.getElementById("stat1Num");
      if (!el) return;
      const obj = { val: 0 };
      gsap.to(obj, {
        val: 1.2,
        duration: 1.2,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = obj.val.toFixed(1) + "M+";
        },
      });
    });
  }

  const statBottom = document.getElementById("statBottom");
  if (statBottom) {
    statBottom.addEventListener("click", () => {
      if (typeof gsap === "undefined") return;
      const el = document.getElementById("stat2Num");
      if (!el) return;
      const obj = { val: 0 };
      gsap.to(obj, {
        val: 3,
        duration: 1.2,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = "$" + obj.val.toFixed(0) + "M";
        },
      });
    });
  }
}); // DOMContentLoaded

function initCheckeredGridTracking() {
  const page = document.querySelector(".page");
  if (!page) return;

  let canvas = document.getElementById("pageGridCanvas");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "pageGridCanvas";
    canvas.className = "page-grid-canvas";
    canvas.setAttribute("aria-hidden", "true");
    page.insertBefore(canvas, page.firstChild);
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const CELL_SIZE = 54;
  // Radius of a few squares (approx 4.2 squares = ~226px)
  const RADIUS = CELL_SIZE * 4.2;

  let width = 0;
  let height = 0;
  let dpr = 1;

  function resizeCanvas() {
    const rect = page.getBoundingClientRect();
    width = Math.ceil(rect.width);
    height = Math.ceil(rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas, { passive: true });

  if (typeof ResizeObserver !== "undefined") {
    const ro = new ResizeObserver(() => {
      resizeCanvas();
    });
    ro.observe(page);
  }

  // GSAP animated tracker state
  const tracker = {
    x: -999,
    y: -999,
    intensity: 0,
  };

  let needsClear = false;
  let lastClientX = -999;
  let lastClientY = -999;

  function handlePointer(clientX, clientY) {
    lastClientX = clientX;
    lastClientY = clientY;

    const rect = page.getBoundingClientRect();
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    // Check if pointer is in or near .page
    const isInside =
      clientX >= rect.left - 50 &&
      clientX <= rect.right + 50 &&
      clientY >= rect.top - 50 &&
      clientY <= rect.bottom + 50;

    if (!isInside) {
      if (tracker.intensity > 0) {
        if (typeof gsap !== "undefined") {
          gsap.to(tracker, {
            intensity: 0,
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto",
          });
        } else {
          tracker.intensity = 0;
        }
      }
      return;
    }

    // Inside .page: smoothly move x, y and ensure intensity is 1
    if (typeof gsap !== "undefined") {
      gsap.to(tracker, {
        x: mouseX,
        y: mouseY,
        intensity: 1,
        duration: 0.22,
        ease: "power2.out",
        overwrite: "auto",
      });
    } else {
      tracker.x = mouseX;
      tracker.y = mouseY;
      tracker.intensity = 1;
    }
  }

  window.addEventListener("pointermove", (e) => {
    handlePointer(e.clientX, e.clientY);
  }, { passive: true });

  window.addEventListener("scroll", () => {
    if (lastClientX !== -999) {
      handlePointer(lastClientX, lastClientY);
    }
  }, { passive: true });

  document.addEventListener("mouseleave", () => {
    if (typeof gsap !== "undefined") {
      gsap.to(tracker, {
        intensity: 0,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
    } else {
      tracker.intensity = 0;
    }
  });

  function drawCheckeredGrid() {
    ctx.clearRect(0, 0, width, height);

    if (tracker.intensity <= 0.001) return;

    const totalCols = Math.ceil(width / CELL_SIZE);
    const totalRows = Math.ceil(height / CELL_SIZE);

    const minCol = Math.max(0, Math.floor((tracker.x - RADIUS) / CELL_SIZE));
    const maxCol = Math.min(totalCols - 1, Math.ceil((tracker.x + RADIUS) / CELL_SIZE));
    const minRow = Math.max(0, Math.floor((tracker.y - RADIUS) / CELL_SIZE));
    const maxRow = Math.min(totalRows - 1, Math.ceil((tracker.y + RADIUS) / CELL_SIZE));

    for (let c = minCol; c <= maxCol; c++) {
      for (let r = minRow; r <= maxRow; r++) {
        const isCheckered = (c + r) % 2 === 0;
        const isAlternate = (c + r) % 2 !== 0;

        const cellCenterX = (c + 0.5) * CELL_SIZE;
        const cellCenterY = (r + 0.5) * CELL_SIZE;
        const dist = Math.hypot(cellCenterX - tracker.x, cellCenterY - tracker.y);

        if (dist >= RADIUS) continue;

        const norm = 1 - dist / RADIUS;
        const falloff = Math.pow(norm, 1.25);

        // Grid cell coordinates fitting inside the 54px background grid
        const cellX = c * CELL_SIZE + 1.5;
        const cellY = r * CELL_SIZE + 1.5;
        const cellW = CELL_SIZE - 3;
        const cellH = CELL_SIZE - 3;

        if (isCheckered) {
          // Muted warm brand terracotta tone (visible & tasteful)
          const alpha = falloff * tracker.intensity * 0.35;
          if (alpha > 0.005) {
            ctx.fillStyle = `rgba(242, 101, 34, ${alpha.toFixed(3)})`;
            ctx.beginPath();
            if (ctx.roundRect) {
              ctx.roundRect(cellX, cellY, cellW, cellH, 4);
            } else {
              ctx.rect(cellX, cellY, cellW, cellH);
            }
            ctx.fill();
          }
        } else if (isAlternate) {
          // Subtle complementary muted navy tone for genuine checkerboard contrast
          const alpha = falloff * tracker.intensity * 0.16;
          if (alpha > 0.005) {
            ctx.fillStyle = `rgba(11, 45, 83, ${alpha.toFixed(3)})`;
            ctx.beginPath();
            if (ctx.roundRect) {
              ctx.roundRect(cellX, cellY, cellW, cellH, 4);
            } else {
              ctx.rect(cellX, cellY, cellW, cellH);
            }
            ctx.fill();
          }
        }
      }
    }
  }

  if (typeof gsap !== "undefined") {
    gsap.ticker.add(() => {
      if (tracker.intensity <= 0.001) {
        if (needsClear) {
          ctx.clearRect(0, 0, width, height);
          needsClear = false;
        }
        return;
      }
      needsClear = true;
      drawCheckeredGrid();
    });
  } else {
    function fallbackLoop() {
      if (tracker.intensity > 0.001) {
        drawCheckeredGrid();
      }
      requestAnimationFrame(fallbackLoop);
    }
    requestAnimationFrame(fallbackLoop);
  }
}

