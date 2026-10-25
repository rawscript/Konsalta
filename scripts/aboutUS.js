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
      .querySelectorAll("a, button, .serve-card, .why-card-6, .bullet-item-card, .principle-card, .principle-tab, .team-nav-pill, .carousel-nav-btn, .carousel-dot, .dossier-tab, .dossier-social-link, .dossier-action-btn, .carousel-toggle-play")
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

      // 4. Why Konsalta 6 Cards (batched)
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

      // 5. Meet The Team Showcase Carousel Reveal
      gsap.fromTo(
        ".team-showcase-carousel",
        { opacity: 0, y: serveCardY },
        {
          opacity: 1,
          y: 0,
          duration: isMobile ? 0.55 : 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".team-section",
            start: "top 82%",
            once: true,
          },
        }
      );

      // 6. Why Konsalta 5 Bullets (batched)
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
  initServeStars();

  // ============ 6. CREATIVE TEAM SHOWCASE CAROUSEL CONTROLLER ============
  initTeamCarousel();
});

function initTeamCarousel() {
  const carousel = document.getElementById("teamCarousel");
  if (!carousel) return;

  const viewport = carousel.querySelector(".team-carousel-viewport");
  const track = carousel.querySelector(".team-carousel-track");
  const slides = Array.from(carousel.querySelectorAll(".team-carousel-slide"));
  const pills = Array.from(carousel.querySelectorAll(".team-nav-pill"));
  const dots = Array.from(carousel.querySelectorAll(".carousel-dot"));
  const btnPrev = carousel.querySelector(".btn-prev");
  const btnNext = carousel.querySelector(".btn-next");
  const numCurrent = document.getElementById("currentSlideNum");
  const progressBar = document.getElementById("carouselProgressBar");
  const playToggle = document.getElementById("carouselPlayToggle");
  const totalSlides = slides.length;

  if (totalSlides === 0) return;

  let currentIndex = 0;
  let isPlaying = true;
  let autoplayTimer = null;
  const AUTOPLAY_INTERVAL = 5500;

  // Calculate slide position to center the active slide in the viewport
  function updateCarousel(smooth = true) {
    if (!viewport || !track) return;
    const activeSlide = slides[currentIndex];
    if (!activeSlide) return;

    const viewportWidth = viewport.offsetWidth;
    const slideOffsetLeft = activeSlide.offsetLeft;
    const slideWidth = activeSlide.offsetWidth;

    // Calculate translation to position activeSlide exactly in the center
    const targetX = (viewportWidth / 2) - (slideOffsetLeft + slideWidth / 2);

    track.style.transition = smooth
      ? "transform 0.65s cubic-bezier(0.2, 0.9, 0.3, 1)"
      : "none";
    track.style.transform = `translateX(${targetX}px)`;

    // Update active slide classes & 3D tilt
    slides.forEach((slide, idx) => {
      const isActive = idx === currentIndex;
      slide.classList.toggle("is-active", isActive);

      // Subtle 3D perspective effect for flanking slides
      if (isActive) {
        slide.style.transform = "scale(1) translateZ(0)";
      } else if (idx < currentIndex) {
        slide.style.transform = "scale(0.9) translateZ(-40px) rotateY(10deg)";
      } else {
        slide.style.transform = "scale(0.9) translateZ(-40px) rotateY(-10deg)";
      }
    });

    // Update pill buttons (scoped container scroll, NEVER scroll window)
    const pillsNav = carousel.querySelector(".team-nav-pills");
    pills.forEach((pill, idx) => {
      const isActive = idx === currentIndex;
      pill.classList.toggle("is-active", isActive);
      pill.setAttribute("aria-selected", isActive ? "true" : "false");
      if (isActive && pillsNav && pillsNav.scrollWidth > pillsNav.clientWidth) {
        const offset = pill.offsetLeft - (pillsNav.clientWidth / 2) + (pill.offsetWidth / 2);
        pillsNav.scrollTo({ left: offset, behavior: "smooth" });
      }
    });

    // Update dots
    dots.forEach((dot, idx) => {
      dot.classList.toggle("is-active", idx === currentIndex);
    });

    // Update counter display
    if (numCurrent) {
      numCurrent.textContent = String(currentIndex + 1).padStart(2, "0");
    }

    // Update progress bar width
    if (progressBar) {
      const percent = ((currentIndex + 1) / totalSlides) * 100;
      progressBar.style.width = `${percent}%`;
    }
  }

  function goToSlide(index, smooth = true) {
    currentIndex = (index + totalSlides) % totalSlides;
    updateCarousel(smooth);
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  // --- Autoplay Controls ---
  function startAutoplay() {
    stopAutoplay();
    if (isPlaying) {
      autoplayTimer = setInterval(() => {
        // Only advance if carousel is currently visible in viewport to prevent unwanted work
        const rect = carousel.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        if (isInViewport) {
          nextSlide();
        }
      }, AUTOPLAY_INTERVAL);
    }
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  function pauseTemporarily() {
    stopAutoplay();
    // Resume after 12 seconds of inactivity
    setTimeout(() => {
      if (isPlaying) startAutoplay();
    }, 12000);
  }

  // Prev / Next button clicks
  if (btnPrev) {
    btnPrev.addEventListener("click", () => {
      prevSlide();
      resetAutoplay();
    });
  }

  if (btnNext) {
    btnNext.addEventListener("click", () => {
      nextSlide();
      resetAutoplay();
    });
  }

  // Top quick-nav pills
  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const targetIdx = parseInt(pill.getAttribute("data-index"), 10);
      if (!isNaN(targetIdx)) {
        goToSlide(targetIdx);
        resetAutoplay();
      }
    });
  });

  // Dots navigation
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const targetIdx = parseInt(dot.getAttribute("data-index"), 10);
      if (!isNaN(targetIdx)) {
        goToSlide(targetIdx);
        resetAutoplay();
      }
    });
  });

  // Clicking neighbor slide glides it into focus
  slides.forEach((slide, idx) => {
    slide.addEventListener("click", (e) => {
      if (idx !== currentIndex && !e.target.closest(".dossier-tab, .dossier-social-link, .dossier-action-btn")) {
        goToSlide(idx);
        resetAutoplay();
      }
    });
  });

  // Autoplay Play/Pause Toggle button
  if (playToggle) {
    playToggle.addEventListener("click", () => {
      isPlaying = !isPlaying;
      const pauseIcon = playToggle.querySelector(".state-pause");
      const playIcon = playToggle.querySelector(".state-play");
      if (isPlaying) {
        if (pauseIcon) pauseIcon.style.display = "inline-flex";
        if (playIcon) playIcon.style.display = "none";
        startAutoplay();
      } else {
        if (pauseIcon) pauseIcon.style.display = "none";
        if (playIcon) playIcon.style.display = "inline-flex";
        stopAutoplay();
      }
    });
  }

  // Pause autoplay on mouse enter, resume on mouse leave
  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", () => {
    if (isPlaying) startAutoplay();
  });

  // Touch and Drag swipe handling
  let isPointerDown = false;
  let startPointerX = 0;
  let diffX = 0;

  viewport.addEventListener("touchstart", (e) => {
    isPointerDown = true;
    startPointerX = e.touches[0].clientX;
    diffX = 0;
    stopAutoplay();
  }, { passive: true });

  viewport.addEventListener("touchmove", (e) => {
    if (!isPointerDown) return;
    diffX = e.touches[0].clientX - startPointerX;
  }, { passive: true });

  viewport.addEventListener("touchend", () => {
    if (!isPointerDown) return;
    isPointerDown = false;
    if (diffX < -45) {
      nextSlide();
    } else if (diffX > 45) {
      prevSlide();
    }
    if (isPlaying) startAutoplay();
  });

  // Mouse drag support
  viewport.addEventListener("mousedown", (e) => {
    if (e.target.closest("button, a, input")) return;
    isPointerDown = true;
    startPointerX = e.clientX;
    diffX = 0;
    stopAutoplay();
  });

  window.addEventListener("mousemove", (e) => {
    if (!isPointerDown) return;
    diffX = e.clientX - startPointerX;
  });

  window.addEventListener("mouseup", () => {
    if (!isPointerDown) return;
    isPointerDown = false;
    if (diffX < -50) {
      nextSlide();
    } else if (diffX > 50) {
      prevSlide();
    }
    if (isPlaying) startAutoplay();
  });

  // Keyboard accessibility
  window.addEventListener("keydown", (e) => {
    if (document.activeElement && document.activeElement.tagName === "INPUT") return;
    const rect = carousel.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;

    if (e.key === "ArrowLeft") {
      prevSlide();
      resetAutoplay();
    } else if (e.key === "ArrowRight") {
      nextSlide();
      resetAutoplay();
    }
  });

  // --- Scoped Dossier Tabs (Pedigree / Mandate / Contact) ---
  carousel.querySelectorAll(".team-profile-dossier").forEach((dossier) => {
    const tabs = dossier.querySelectorAll(".dossier-tab");
    const panels = dossier.querySelectorAll(".dossier-panel");

    tabs.forEach((tab) => {
      tab.addEventListener("click", (e) => {
        e.stopPropagation();
        pauseTemporarily(); // User is reading, give them time!
        const target = tab.getAttribute("data-tab-target");

        tabs.forEach((t) => t.classList.toggle("is-active", t === tab));
        panels.forEach((p) => {
          const isTarget = p.getAttribute("data-panel") === target;
          p.classList.toggle("is-active", isTarget);
        });
      });
    });
  });

  // Window resize handler
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateCarousel(false);
    }, 100);
  });

  // Initial render & autoplay start
  // Delay slightly to ensure fonts & layout dimensions are ready
  setTimeout(() => {
    updateCarousel(false);
    startAutoplay();
  }, 150);
}

// ============================================================
//   SERVE STARS — Euclidean ambient + hover-invert animation
//   Events fire on the SVG element (visiblePainted pixels only)
//   so rectangular bounding-box overlap between nearby stars
//   never blocks a neighbour's color inversion.
// ============================================================
function initServeStars() {
  const stars = document.querySelectorAll(".serve-star");
  if (!stars.length || typeof gsap === "undefined") return;

  const COLOR_NAVY   = "#0B2D53";
  const COLOR_ORANGE = "#F26522";

  // Reuse the same cursor blob that the main cursor handler drives
  const cursor = document.querySelector(".cursor");

  stars.forEach((star, index) => {
    const colorType   = star.dataset.starColor;
    const baseTilt    = parseFloat(star.dataset.tilt || 0);
    const baseColor   = colorType === "blue" ? COLOR_NAVY : COLOR_ORANGE;
    const invertColor = colorType === "blue" ? COLOR_ORANGE : COLOR_NAVY;

    // The SVG is the pixel-accurate hit target; the div is the GSAP animation target
    const svgEl = star.querySelector("svg");

    // Snap to the authored tilt before floating kicks in
    gsap.set(star, { rotation: baseTilt, transformOrigin: "50% 50%" });

    // Coordinated but independent float — each star has its own rhythm
    const floatY     = index % 2 === 0 ? -10 : 8;
    const floatRot   = baseTilt + (index % 2 === 0 ? 13 : -11);
    const floatScale = 1 + (index % 3 === 0 ? 0.09 : 0.04);
    const floatDur   = 2.1 + (index % 5) * 0.38;
    const floatDelay = (index * 0.19) % 1.6;

    gsap.to(star, {
      y        : floatY,
      rotation : floatRot,
      scale    : floatScale,
      duration : floatDur,
      repeat   : -1,
      yoyo     : true,
      ease     : "sine.inOut",
      delay    : floatDelay,
    });

    if (!svgEl) return;

    // Hover → invert color, pop scale, spin — events on SVG pixels only
    svgEl.addEventListener("mouseenter", () => {
      gsap.to(star, {
        color     : invertColor,
        scale     : 1.5,
        rotation  : baseTilt + 45,
        duration  : 0.28,
        ease      : "back.out(2.2)",
        overwrite : "auto",
      });
      // Scale the custom cursor blob
      if (cursor) {
        gsap.to(cursor, { width: 32, height: 32, opacity: 0.85, duration: 0.25, ease: "power2.out" });
      }
    });

    // Leave → restore original color, scale, and tilt; re-attach float
    svgEl.addEventListener("mouseleave", () => {
      gsap.to(star, {
        color     : baseColor,
        scale     : 1,
        rotation  : baseTilt,
        duration  : 0.42,
        ease      : "power2.out",
        overwrite : "auto",
        onComplete: () => {
          gsap.to(star, {
            y        : floatY,
            rotation : floatRot,
            scale    : floatScale,
            duration : floatDur,
            repeat   : -1,
            yoyo     : true,
            ease     : "sine.inOut",
          });
        },
      });
      // Restore cursor
      if (cursor) {
        gsap.to(cursor, { width: 12, height: 12, opacity: 1, duration: 0.25, ease: "power2.out" });
      }
    });
  });
}
