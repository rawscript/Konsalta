// Konsalta — About Us Controller & GSAP Animations

if (typeof gsap !== "undefined") {
  document.body.classList.add("js-ready");
  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // ============ MOBILE PERFORMANCE CONFIG ============
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.innerWidth <= 768;
  const isSmallMobile = window.innerWidth <= 480;

  // ============ 1. CUSTOM CURSOR ============
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

    // Cursor scaling on interactive elements
    document
      .querySelectorAll("a, button, .serve-card, .why-card-6, .bullet-item-card, .principle-card, .principle-tab")
      .forEach((el) => {
        el.addEventListener("mouseenter", () => {
          gsap.to(cursor, {
            width: 32,
            height: 32,
            opacity: 0.85,
            duration: 0.25,
            ease: "power2.out",
          });
        });
        el.addEventListener("mouseleave", () => {
          gsap.to(cursor, {
            width: 12,
            height: 12,
            opacity: 1,
            duration: 0.25,
            ease: "power2.out",
          });
        });
      });
  }

  // ============ 2. GSAP INTRO TIMELINE ============
  if (typeof gsap !== "undefined") {
    const introTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    introTl
      .fromTo(
        ".site-header",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.7 },
        0
      )
      .fromTo(
        ".hero-main-title",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.85 },
        0.3
      )
      .fromTo(
        ".hero-lead-text",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.75 },
        0.45
      )
      .fromTo(
        ".hero-actions",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        0.6
      )
      .fromTo(
        ".hero-stat-card",
        { opacity: 0, y: 32, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.75,
          stagger: 0.1,
          ease: "power2.out"
        },
        0.7
      );

    // ============ 3. SCROLLTRIGGER SECTION REVEALS ============
    if (typeof ScrollTrigger !== "undefined") {
      // Animation values based on viewport
      const revealY = isMobile ? 18 : 25;
      const revealDuration = isMobile ? 0.45 : 0.65;
      const staggerDelay = isMobile ? 0.06 : 0.1;

      // Reveal Section Headers as they enter view
      ScrollTrigger.batch(".section-head", {
        start: "top 88%",
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, y: revealY },
            { opacity: 1, y: 0, duration: revealDuration, ease: "power2.out", overwrite: "auto" }
          );
        },
        once: true,
      });

      // 1. Who We Serve Cards (batched by row)
      const serveCardY = isMobile ? 22 : 35;
      ScrollTrigger.batch(".serve-card", {
        start: "top 88%",
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, y: serveCardY },
            {
              opacity: 1,
              y: 0,
              duration: revealDuration,
              stagger: staggerDelay,
              ease: "power2.out",
              overwrite: "auto",
            }
          );
        },
        once: true,
      });

      // 2. Approach Quote Box
      const quoteY = isMobile ? 20 : 30;
      gsap.fromTo(
        ".approach-quote-box",
        { opacity: 0, y: quoteY, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: revealDuration,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".approach-quote-box",
            start: "top 85%",
            once: true,
          },
        }
      );

      // 3. Approach Principle Cards (individually / batched as each principle is reached)
      ScrollTrigger.batch(".principle-card", {
        start: "top 88%",
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, y: revealY },
            {
              opacity: 1,
              y: 0,
              duration: revealDuration,
              stagger: staggerDelay,
              ease: "power2.out",
              overwrite: "auto",
            }
          );
        },
        once: true,
      });

      // 4. Why Choose Us 6 Cards (batched)
      ScrollTrigger.batch(".why-card-6", {
        start: "top 88%",
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, y: serveCardY },
            {
              opacity: 1,
              y: 0,
              duration: revealDuration,
              stagger: staggerDelay,
              ease: "power2.out",
              overwrite: "auto",
            }
          );
        },
        once: true,
      });

      // 6. Why Choose Us 5 Bullets (batched)
      ScrollTrigger.batch(".bullet-item-card", {
        start: "top 88%",
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, x: isMobile ? -15 : -25 },
            {
              opacity: 1,
              x: 0,
              duration: revealDuration,
              stagger: staggerDelay,
              ease: "power2.out",
              overwrite: "auto",
            }
          );
        },
        once: true,
      });

      // 7. CTA Banner
      gsap.fromTo(
        ".about-cta-card",
        { opacity: 0, y: quoteY, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: revealDuration,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".about-cta-section",
            start: "top 85%",
            once: true,
          },
        }
      );

      // Refresh ScrollTrigger after full window load (fonts, images)
      window.addEventListener("load", () => {
        ScrollTrigger.refresh();
      });
    }
  }

  // ============ 4. PRINCIPLE TABS INTERACTION ============
  const tabs = document.querySelectorAll(".principle-tab");
  const cards = document.querySelectorAll(".principle-card");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetId = tab.dataset.target;
      if (!targetId) return;

      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const targetCard = document.getElementById(targetId);
      if (targetCard) {
        cards.forEach((c) => c.classList.remove("active-target"));
        targetCard.classList.add("active-target");
        targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  });

  // ============ 5. INTERACTIVE WHO-WE-SERVE STARS ============
  // initServeStars();

});

// ============================================================
//   SERVE STARS — Euclidean ambient + hover-invert animation
//   Events fire on the SVG element (visiblePainted pixels only)
//   so rectangular bounding-box overlap between nearby stars
//   never blocks a neighbour's color inversion.
// ============================================================
// function initServeStars() {
//   const stars = document.querySelectorAll(".serve-star");
//   if (!stars.length || typeof gsap === "undefined") return;

//   const COLOR_NAVY   = "#0B2D53";
//   const COLOR_ORANGE = "#F26522";

//   // Reuse the same cursor blob that the main cursor handler drives
//   const cursor = document.querySelector(".cursor");

//   stars.forEach((star, index) => {
//     const colorType   = star.dataset.starColor;
//     const baseTilt    = parseFloat(star.dataset.tilt || 0);
//     const baseColor   = colorType === "blue" ? COLOR_NAVY : COLOR_ORANGE;
//     const invertColor = colorType === "blue" ? COLOR_ORANGE : COLOR_NAVY;

//     // The SVG is the pixel-accurate hit target; the div is the GSAP animation target
//     const svgEl = star.querySelector("svg");

//     // Snap to the authored tilt before floating kicks in
//     gsap.set(star, { rotation: baseTilt, transformOrigin: "50% 50%" });

//     // Coordinated but independent float — each star has its own rhythm
//     const floatY     = index % 2 === 0 ? -10 : 8;
//     const floatRot   = baseTilt + (index % 2 === 0 ? 13 : -11);
//     const floatScale = 1 + (index % 3 === 0 ? 0.09 : 0.04);
//     const floatDur   = 2.1 + (index % 5) * 0.38;
//     const floatDelay = (index * 0.19) % 1.6;

//     gsap.to(star, {
//       y        : floatY,
//       rotation : floatRot,
//       scale    : floatScale,
//       duration : floatDur,
//       repeat   : -1,
//       yoyo     : true,
//       ease     : "sine.inOut",
//       delay    : floatDelay,
//     });

//     if (!svgEl) return;

//     // Hover → invert color, pop scale, spin — events on SVG pixels only
//     svgEl.addEventListener("mouseenter", () => {
//       gsap.to(star, {
//         color     : invertColor,
//         scale     : 1.5,
//         rotation  : baseTilt + 45,
//         duration  : 0.28,
//         ease      : "back.out(2.2)",
//         overwrite : "auto",
//       });
//       // Scale the custom cursor blob
//       if (cursor) {
//         gsap.to(cursor, { width: 32, height: 32, opacity: 0.85, duration: 0.25, ease: "power2.out" });
//       }
//     });

//     // Leave → restore original color, scale, and tilt; re-attach float
//     svgEl.addEventListener("mouseleave", () => {
//       gsap.to(star, {
//         color     : baseColor,
//         scale     : 1,
//         rotation  : baseTilt,
//         duration  : 0.42,
//         ease      : "power2.out",
//         overwrite : "auto",
//         onComplete: () => {
//           gsap.to(star, {
//             y        : floatY,
//             rotation : floatRot,
//             scale    : floatScale,
//             duration : floatDur,
//             repeat   : -1,
//             yoyo     : true,
//             ease     : "sine.inOut",
//           });
//         },
//       });
//       // Restore cursor
//       if (cursor) {
//         gsap.to(cursor, { width: 12, height: 12, opacity: 1, duration: 0.25, ease: "power2.out" });
//       }
//     });
//   });
// }




// =========== SEVEN PRINCIPLES STAGE ============
/* aboutUS.js — excerpt after cleanup.
   The old principles block (everything that used #stage, .card, .tag, .reveal and
   stage.innerHTML) is deleted: principles.js now owns that section.
   Removing the `if (!stage) return;` guard is what makes the two features below
   run again, because that early return used to exit the whole callback. */
document.addEventListener("DOMContentLoaded", () => {
  if (!window.gsap) return;

  // ============ FEATURE CARD 3D HOVER ============
  const isFinePointerLocal = window.matchMedia("(pointer: fine)").matches;
  if (isFinePointerLocal) {
    document.querySelectorAll(".feature-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, {
          rotationY: x * 8,
          rotationX: -y * 8,
          y: -10,
          duration: 0.4,
          transformPerspective: 1200,
          ease: "power2.out",
        });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          rotationY: 0,
          rotationX: 0,
          y: 0,
          duration: 0.7,
          ease: "elastic.out(1, 0.5)",
        });
      });
    });
  }

  // ============ FINAL CTA PULSE ON ENTRY ============
  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger); // harmless if already registered elsewhere
    gsap.from(".final-cta-card", {
      scale: 0.94,
      opacity: 0,
      duration: 1.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".final-cta-card",
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });
    ScrollTrigger.refresh();
  }
});
