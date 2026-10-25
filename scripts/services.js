// Konsalta — Services Interactive Capabilities & GSAP Motion

if (typeof gsap !== "undefined") {
  document.body.classList.add("js-ready");
  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }
}

// ===== SEARCH PLACEHOLDER QUERIES =====
const searchQueries = [
  "Evidence synthesis & survey design",
  "AI-enabled dashboards & analytics",
  "Market intelligence & sector mapping",
  "Policy briefs & regulatory reviews",
  "Monitoring, evaluation & learning (MEL)",
  "Strategy & change management",
  "Executive coaching & leadership programmes",
  "Institutional capacity strengthening",
  "Knowledge translation & strategic communications"
];

let queryIndex = 0;
let isTyping = false;
let userIsSearching = false;

document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === "undefined") return;

  // ===== ANIMATION CONFIG FOR MOBILE PERFORMANCE =====
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.innerWidth <= 768;
  const isSmallMobile = window.innerWidth <= 480;

  // ===== CURSOR TRACKING =====
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

    // Grow cursor on interactive elements
    document
      .querySelectorAll("a, button, .float-card, .sphere, .service-card, .filter-tab, .search-bar, .delivery-card")
      .forEach((el) => {
        el.addEventListener("mouseenter", () => {
          gsap.to(cursor, {
            width: 34,
            height: 34,
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

  // ===== MASTER INTRO LOAD TIMELINE =====
  const introTl = gsap.timeline({ defaults: { ease: "power3.out" } });

  // 1. Header & Background Shapes reveal
  introTl
    .fromTo(
      ".site-header",
      { opacity: 0, y: -24 },
      { opacity: 1, y: 0, duration: 0.7 },
      0
    )
    .fromTo(
      ".bg-shape",
      { opacity: 0, scale: 0.75 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.1,
        stagger: { each: 0.04, from: "random" },
        ease: "power2.out"
      },
      0.1
    )
    // 2. Hero Header text elements
    .fromTo(
      ".hero-badge",
      { opacity: 0, scale: 0.85, y: -10 },
      { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.8)" },
      0.2
    )
    .fromTo(
      ".services-hero-title .title-line",
      { opacity: 0, y: 42 },
      { opacity: 1, y: 0, duration: 0.85, stagger: 0.12, ease: "power3.out" },
      0.3
    )
    .fromTo(
      ".services-hero-desc",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7 },
      0.5
    )
    .fromTo(
      ".hero-scroll-indicator",
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.6 },
      0.65
    )
    // 3. Central Stage: Sphere & Tiles
    .fromTo(
      ".sphere",
      { opacity: 0, scale: 0.45, rotation: -30 },
      { opacity: 1, scale: 1, rotation: 0, duration: 1.1, ease: "back.out(1.4)" },
      0.35
    )
    .fromTo(
      ".tile",
      { opacity: 0, scale: 0.5 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.55,
        stagger: { each: 0.025, from: "center" },
        ease: "back.out(1.6)"
      },
      0.55
    )
    // 4. Floating Cards fan-out
    .fromTo(
      ".float-card",
      { opacity: 0, scale: 0.35, rotation: "+=22" },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.85,
        stagger: { each: 0.06, from: "random" },
        ease: "back.out(1.7)"
      },
      0.65
    )
    // 5. Search Bar expand
    .fromTo(
      ".search-bar",
      { opacity: 0, scaleX: 0.4, scaleY: 0.7 },
      { opacity: 1, scaleX: 1, scaleY: 1, duration: 0.8, ease: "back.out(1.5)" },
      0.8
    );

  // ===== PARALLAX ON BACKGROUND SHAPES (SCROLLTRIGGER) =====
  if (typeof ScrollTrigger !== "undefined") {
    document.querySelectorAll(".bg-shape").forEach((shape) => {
      const speed = parseFloat(shape.dataset.speed || 0.2);
      gsap.to(shape, {
        y: speed * -280,
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2
        }
      });
    });

    // Hero stage dispersal parallax on scroll
    ScrollTrigger.create({
      trigger: ".page",
      start: "top top",
      end: "+=520",
      scrub: 1.2,
      onUpdate: (self) => {
        const p = self.progress;
        document.querySelectorAll(".float-card").forEach((card, i) => {
          const dirX = i % 2 === 0 ? -1 : 1;
          const dirY = i < 3 ? -1 : 1;
          gsap.set(card, {
            xPercent: dirX * p * 28,
            yPercent: dirY * p * 28
          });
        });
        gsap.set(".sphere", { scale: 1 + p * 0.06, y: p * 40 });
        gsap.set(".services-hero-header", { y: p * -30, opacity: 1 - p * 0.45 });
      }
    });

    // Spectrum Section Header Reveal
    gsap.from(".spectrum-header > *", {
      y: 35,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".spectrum-header",
        start: "top 86%",
        once: true
      }
    });

    // 9 Service Cards Staggered Batch Entrance
    ScrollTrigger.batch(".service-card", {
      start: "top 88%",
      onEnter: (batch) => {
        gsap.fromTo(
          batch,
          { opacity: 0, y: 40, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: "power2.out",
            overwrite: "auto"
          }
        );
      },
      once: true
    });

    // Delivery Section Entrance
    gsap.from(".delivery-head > *", {
      y: 30,
      opacity: 0,
      duration: 0.75,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".delivery-head",
        start: "top 86%",
        once: true
      }
    });

    gsap.fromTo(
      ".delivery-card",
      { y: 35, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.65,
        stagger: 0.08,
        ease: "power2.out",
        clearProps: "transform",
        scrollTrigger: {
          trigger: ".delivery-cards",
          start: "top 88%",
          once: true
        }
      }
    );

    // Final CTA Section Entrance & Parallax Orbs
    gsap.from(".final-cta-card", {
      scale: 0.93,
      opacity: 0,
      y: 35,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".final-cta",
        start: "top 82%",
        once: true
      }
    });

    gsap.to(".final-cta-card .orb-1", {
      x: 35,
      y: 25,
      ease: "none",
      scrollTrigger: {
        trigger: ".final-cta",
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5
      }
    });

    gsap.to(".final-cta-card .orb-2", {
      x: -35,
      y: -25,
      ease: "none",
      scrollTrigger: {
        trigger: ".final-cta",
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5
      }
    });
  }

  // ===== 3D GLASS TILT & MOUSE SPECULAR GLOW ON SERVICE CARDS =====
  // Skip 3D transforms on mobile for performance
  if (!isMobile && !prefersReducedMotion) {
    document.querySelectorAll(".service-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);

        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotX = ((y - cy) / cy) * -5.5;
        const rotY = ((x - cx) / cx) * 5.5;

        gsap.to(card, {
          rotateX: rotX,
          rotateY: rotY,
          transformPerspective: 900,
          duration: 0.25,
          ease: "power2.out",
          overwrite: "auto"
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto"
        });
      });
    });
  }

  // ===== MOUSE PARALLAX ON HERO & BACKGROUND SHAPES =====
  // Skip on mobile for performance
  if (!isMobile && !prefersReducedMotion) {
    document.addEventListener("mousemove", (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / window.innerWidth;
      const dy = (e.clientY - cy) / window.innerHeight;

      // Background shapes subtle spatial drift
      document.querySelectorAll(".bg-shape").forEach((shape, i) => {
        const speed = parseFloat(shape.dataset.speed || 0.2);
        const strength = (i % 2 === 0 ? -1 : 1) * Math.abs(speed) * 24;
        gsap.to(shape, {
          x: dx * strength,
          y: dy * strength,
          duration: 1.1,
          ease: "power2.out",
          overwrite: "auto"
        });
      });

      // Sphere subtle 3D tilt
      gsap.to(".sphere", {
        x: dx * -12,
        y: dy * -12,
        rotationY: dx * 5,
        rotationX: -dy * 5,
        transformPerspective: 1200,
        duration: 0.7,
        ease: "power2.out",
        overwrite: "auto"
      });

      // Floating cards drift
      document.querySelectorAll(".float-card").forEach((card, i) => {
        const strength = 10 + (i % 4) * 4;
        gsap.to(card, {
          x: dx * strength * -1,
          y: dy * strength * -1,
          duration: 0.8,
          ease: "power2.out",
          overwrite: "auto"
        });
      });
    });
  }

  // ===== CARD HOVER INTERACTIONS (HERO) =====
  // Reduce hover animations on mobile
  if (!prefersReducedMotion) {
    document.querySelectorAll(".float-card").forEach((card) => {
      card.addEventListener("mouseenter", () => {
        gsap.to(card, {
          scale: isMobile ? 1.08 : 1.18,
          rotation: 0,
          duration: 0.4,
          ease: "back.out(2)",
          overwrite: "auto",
          zIndex: 10
        });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          scale: 1,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto",
          zIndex: 4,
          clearProps: "rotation"
        });
      });
      card.addEventListener("click", () => {
        const grid = document.getElementById("services-grid");
        if (grid) {
          grid.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }

  // ===== CONTINUOUS SPHERE ROTATION =====
  gsap.to(".sphere-inner", {
    rotation: 360,
    duration: 220,
    repeat: -1,
    ease: "none",
    transformOrigin: "center center"
  });

  // ===== FLOATING CARDS CONTINUOUS BOBBING =====
  gsap.utils.toArray(".float-card").forEach((card, i) => {
    gsap.to(card, {
      y: "-=" + (6 + (i % 3) * 3),
      duration: 2.8 + i * 0.3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1.5 + i * 0.2
    });
  });

  // ===== SPHERE CLICK - shuffle tiles & scroll to grid =====
  const sphere = document.getElementById("sphere");
  if (sphere) {
    sphere.addEventListener("click", (e) => {
      if (e.target.closest(".search-bar")) return;

      gsap.fromTo(
        ".sphere-inner",
        { rotation: 0 },
        { rotation: 90, duration: 0.6, ease: "power2.inOut" }
      );

      gsap.fromTo(
        ".tile",
        { scale: 1 },
        {
          scale: 0.9,
          duration: 0.3,
          stagger: { each: 0.02, from: "center" },
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut"
        }
      );
    });
  }

  // ===== TYPING ANIMATION =====
  const searchInput = document.getElementById("searchInput");

  function typeText(text, callback) {
    if (userIsSearching || !searchInput) return;
    searchInput.placeholder = "";
    let i = 0;
    isTyping = true;
    const interval = setInterval(() => {
      if (userIsSearching) {
        clearInterval(interval);
        isTyping = false;
        return;
      }
      if (i <= text.length) {
        searchInput.placeholder = text.substring(0, i);
        i++;
      } else {
        clearInterval(interval);
        isTyping = false;
        setTimeout(callback, 2400);
      }
    }, 50);
  }

  function eraseText(callback) {
    if (userIsSearching || !searchInput) return;
    let text = searchInput.placeholder;
    isTyping = true;
    const interval = setInterval(() => {
      if (userIsSearching) {
        clearInterval(interval);
        isTyping = false;
        return;
      }
      if (text.length > 0) {
        text = text.substring(0, text.length - 1);
        searchInput.placeholder = text;
      } else {
        clearInterval(interval);
        isTyping = false;
        setTimeout(callback, 400);
      }
    }, 25);
  }

  function cycleSearchText() {
    if (userIsSearching) return;
    queryIndex = (queryIndex + 1) % searchQueries.length;
    eraseText(() => {
      typeText(searchQueries[queryIndex], cycleSearchText);
    });
  }

  // Start typing cycle
  setTimeout(() => {
    cycleSearchText();
  }, 2200);

  // Stop cycling on input focus / typing
  if (searchInput) {
    searchInput.addEventListener("focus", () => {
      userIsSearching = true;
      searchInput.placeholder = "Type keywords (e.g. AI, surveys, policy, coaching)...";
    });

    searchInput.addEventListener("blur", () => {
      if (!searchInput.value.trim()) {
        userIsSearching = false;
        cycleSearchText();
      }
    });

    // Real-time live filtering of the 9 cards
    searchInput.addEventListener("input", (e) => {
      const term = e.target.value.toLowerCase().trim();
      const cards = document.querySelectorAll(".service-card");

      // Auto-reset category tabs to "all" when searching directly
      document.querySelectorAll(".filter-tab").forEach((tab) => {
        tab.classList.toggle("active", tab.dataset.filter === "all");
      });

      cards.forEach((card) => {
        const title = card.querySelector(".service-title")?.innerText.toLowerCase() || "";
        const desc = card.querySelector(".service-description")?.innerText.toLowerCase() || "";
        const keywords = card.dataset.keywords || "";
        const match = !term || title.includes(term) || desc.includes(term) || keywords.includes(term);

        if (match) {
          card.classList.remove("is-hidden");
          gsap.to(card, { opacity: 1, scale: 1, duration: 0.3, overwrite: "auto" });
        } else {
          gsap.to(card, {
            opacity: 0,
            scale: 0.95,
            duration: 0.2,
            onComplete: () => card.classList.add("is-hidden")
          });
        }
      });
    });
  }

  // ===== SEARCH BUTTON CLICK =====
  const searchBtn = document.getElementById("searchBtn");
  if (searchBtn) {
    searchBtn.addEventListener("click", function (e) {
      e.stopPropagation();

      gsap.fromTo(
        this,
        { rotation: 0 },
        { rotation: 360, duration: 0.8, ease: "back.out(1.6)" }
      );

      if (!isTyping) {
        cycleSearchText();
      }

      const grid = document.getElementById("services-grid");
      if (grid) {
        grid.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // ===== FILTER TABS LOGIC =====
  const filterTabs = document.querySelectorAll(".filter-tab");
  const serviceCards = document.querySelectorAll(".service-card");

  filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      filterTabs.forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      const filterVal = tab.dataset.filter;

      // Clear search input on tab change
      if (searchInput && searchInput.value) {
        searchInput.value = "";
      }

      serviceCards.forEach((card) => {
        const category = card.dataset.category;
        const isMatch = filterVal === "all" || category === filterVal;

        if (isMatch) {
          card.classList.remove("is-hidden");
          gsap.fromTo(
            card,
            { opacity: 0, y: 15, scale: 0.98 },
            { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power2.out" }
          );
        } else {
          card.classList.add("is-hidden");
        }
      });
    });
  });
});
