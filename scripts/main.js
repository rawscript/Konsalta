gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".header-menu-toggle");
  const headerNav = document.querySelector("#primary-navigation");

  if (menuToggle && headerNav) {
    const closeMenu = () => {
      headerNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = headerNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu",
      );
    });

    headerNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window
      .matchMedia("(min-width: 851px)")
      .addEventListener("change", closeMenu);
  }

  // ============ CURSOR ============
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

    document
      .querySelectorAll(
        "a, button, .tile, .feature-card, .header-btn, .cta-btn, .secondary-btn",
      )
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

  // ============ SVG LINE LENGTHS ============
  document.querySelectorAll(".constellation-lines path").forEach((path) => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
  });

  // ============ INITIAL STATES VIA GSAP ============
  gsap.set(".site-header", { opacity: 0 });
  gsap.set(".hero-badge", { opacity: 0, y: -15 });
  gsap.set(".title-inner", { y: "110%" });
  gsap.set(".hero-desc", { opacity: 0, y: 20 });
  gsap.set(".hero-actions", { opacity: 0, y: 20 });
  gsap.set(".tile", { opacity: 0, scale: 0 });

  // ============ PAGE LOAD TIMELINE ============
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl.to(".site-header", { opacity: 1, duration: 0.8 }, 0)
    .to(".hero-badge", { opacity: 1, y: 0, duration: 0.6 }, 0.15)
    .to(
      ".title-inner",
      { y: 0, duration: 1.1, stagger: 0.1, ease: "power4.out" },
      0.25,
    )
    .to(".hero-desc", { opacity: 1, y: 0, duration: 0.8 }, 0.75)
    .to(".hero-actions", { opacity: 1, y: 0, duration: 0.7 }, 0.9)
    .to(
      ".tile",
      {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        stagger: { each: 0.07, from: "center" },
        ease: "elastic.out(1, 0.6)",
      },
      0.4,
    )
    .to(
      ".constellation-lines path",
      {
        strokeDashoffset: 0,
        duration: 1.4,
        stagger: 0.06,
        ease: "power2.inOut",
      },
      0.7,
    );

  // ============ CONSTELLATION 3D TILT ============
  const constellation = document.getElementById("constellation");
  const constellationInner = document.getElementById("constellationInner");
  if (constellation && constellationInner && isFinePointer) {
    constellation.addEventListener("mousemove", (e) => {
      const rect = constellation.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(constellationInner, {
        rotationY: x * 12,
        rotationX: -y * 8,
        duration: 0.8,
        transformPerspective: 1500,
        ease: "power2.out",
      });
    });
    constellation.addEventListener("mouseleave", () => {
      gsap.to(constellationInner, {
        rotationY: 0,
        rotationX: 0,
        duration: 1,
        ease: "elastic.out(1, 0.5)",
      });
    });
  }

  // ============ SCROLL: CONSTELLATION PARALLAX ============
  gsap.to(".constellation", {
    y: 90,
    scale: () =>
      window.innerWidth <= 380 ? 0.44 : window.innerWidth <= 700 ? 0.55 : 0.94,
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });
  gsap.to(".hero-left", {
    y: 50,
    opacity: 0.45,
    scrollTrigger: {
      start: "top top",
      end: "bottom top",
      scrub: 1,
    },
  });

  // ============ SECTION TITLE REVEALS ============
  function splitWords(selector) {
    document.querySelectorAll(selector).forEach((el) => {
      const childNodes = Array.from(el.childNodes);
      el.innerHTML = "";
      childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const parts = node.nodeValue.split(/(\s+)/);
          parts.forEach((w) => {
            if (/^\s+$/.test(w)) {
              el.appendChild(document.createTextNode(w));
            } else if (w.length > 0) {
              const span = document.createElement("span");
              span.className = "sword";
              span.style.cssText =
                "display:inline-block;overflow:hidden;padding-bottom:0.12em;vertical-align:top;";
              span.innerHTML = `<span class="sword-inner" style="display:inline-block;transform:translateY(110%);will-change:transform;">${w}</span>`;
              el.appendChild(span);
            }
          });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const clone = node.cloneNode(true);
          const parts = clone.innerText.split(/(\s+)/);
          clone.innerHTML = "";
          parts.forEach((w) => {
            if (/^\s+$/.test(w)) {
              clone.appendChild(document.createTextNode(w));
            } else if (w.length > 0) {
              const span = document.createElement("span");
              span.className = "sword";
              span.style.cssText =
                "display:inline-block;overflow:hidden;padding-bottom:0.12em;vertical-align:top;";
              span.innerHTML = `<span class="sword-inner" style="display:inline-block;transform:translateY(110%);will-change:transform;">${w}</span>`;
              clone.appendChild(span);
            }
          });
          el.appendChild(clone);
        }
      });
    });
  }

  splitWords(".features-title");
  splitWords(".quote-text");
  splitWords(".final-cta-h2");

  gsap.to(".features-title .sword-inner", {
    y: 0,
    duration: 1,
    stagger: 0.04,
    ease: "power4.out",
    scrollTrigger: {
      trigger: ".features-title",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
  });

  gsap.to(".quote-text .sword-inner", {
    y: 0,
    duration: 0.9,
    stagger: 0.03,
    ease: "power4.out",
    scrollTrigger: {
      trigger: ".quote-text",
      start: "top 75%",
      toggleActions: "play none none reverse",
    },
  });

  gsap.to(".final-cta-h2 .sword-inner", {
    y: 0,
    duration: 1,
    stagger: 0.04,
    ease: "power4.out",
    scrollTrigger: {
      trigger: ".final-cta-h2",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
  });

  // ============ FEATURE CARDS REVEAL ============
  gsap.from(".feature-card", {
    y: 60,
    opacity: 0,
    duration: 0.9,
    stagger: 0.15,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".feature-cards",
      start: "top 75%",
      toggleActions: "play none none reverse",
    },
  });

  // ============ QUOTE MARK ANIMATION ============
  if (document.querySelector(".quote-mark")) {
    gsap.from(".quote-mark", {
      scale: 0,
      rotation: -30,
      duration: 1.2,
      ease: "elastic.out(1, 0.6)",
      scrollTrigger: {
        trigger: ".quote-section",
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    });
  }

  // ============ FEATURE CARD 3D HOVER ============
  if (isFinePointer) {
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

  // Refresh
  ScrollTrigger.refresh();
});
