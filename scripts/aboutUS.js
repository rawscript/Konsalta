// Konsalta — About Us Controller & GSAP Animations

if (typeof gsap !== "undefined") {
  document.body.classList.add("js-ready");
  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }
}

document.addEventListener("DOMContentLoaded", () => {
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
      .querySelectorAll("a, button, .serve-card, .why-card-6, .team-card, .bullet-item-card, .principle-card, .principle-tab")
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
        ".hero-content .section-badge",
        { opacity: 0, y: -12, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.6)" },
        0.15
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
      // Reveal Section Headers as they enter view
      ScrollTrigger.batch(".section-head", {
        start: "top 88%",
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, duration: 0.65, ease: "power2.out", overwrite: "auto" }
          );
        },
        once: true,
      });

      // 1. Who We Serve Cards (batched by row)
      ScrollTrigger.batch(".serve-card", {
        start: "top 88%",
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, y: 35 },
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              stagger: 0.12,
              ease: "power2.out",
              overwrite: "auto",
            }
          );
        },
        once: true,
      });

      // 2. Approach Quote Box
      gsap.fromTo(
        ".approach-quote-box",
        { opacity: 0, y: 30, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.75,
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
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: "power2.out",
              overwrite: "auto",
            }
          );
        },
        once: true,
      });

      // 4. Why Konsalta 6 Cards (batched)
      ScrollTrigger.batch(".why-card-6", {
        start: "top 88%",
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, y: 35 },
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              stagger: 0.1,
              ease: "power2.out",
              overwrite: "auto",
            }
          );
        },
        once: true,
      });

      // 5. Meet The Team Cards (batched individually as each card is reached)
      ScrollTrigger.batch(".team-card", {
        start: "top 88%",
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, y: 35 },
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              stagger: 0.12,
              ease: "power2.out",
              overwrite: "auto",
            }
          );
        },
        once: true,
      });

      // 6. Why Konsalta 5 Bullets (batched)
      ScrollTrigger.batch(".bullet-item-card", {
        start: "top 88%",
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, x: -25 },
            {
              opacity: 1,
              x: 0,
              duration: 0.6,
              stagger: 0.1,
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
        { opacity: 0, y: 30, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.75,
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
});
