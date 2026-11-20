gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
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
    gsap.set(constellationInner, { transformPerspective: 1500 });
    const rotateY = gsap.quickTo(constellationInner, "rotationY", {
      duration: 0.8,
      ease: "power2.out",
    });
    const rotateX = gsap.quickTo(constellationInner, "rotationX", {
      duration: 0.8,
      ease: "power2.out",
    });

    constellation.addEventListener("mousemove", (e) => {
      const rect = constellation.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      rotateY(x * 12);
      rotateX(-y * 8);
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
});


/* ==========================================================================
   SERVICES PREVIEW  ·  append to main.js
   - Desktop (>=900px): hover / focus / click switches the preview panel.
   - Mobile: accordion (one open at a time, tap the open one to close it).
   - Arrow keys / Home / End move between triggers.
   - Staggered scroll reveal and a pointer-follow glow on the panel.
   Safe to append: wrapped in an IIFE and exits if the section is absent.
   ========================================================================== */
(() => {
  const root = document.getElementById("services-preview");
  if (!root) return;

  const items = Array.from(root.querySelectorAll(".svc-item"));
  const triggers = items.map((item) => item.querySelector(".svc-trigger"));
  const desktop = window.matchMedia("(min-width: 900px)");
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Active item ---------- */
  function setActive(index, allowClose = false) {
    const isOpen = items[index].classList.contains("is-active");
    const close = allowClose && isOpen;

    items.forEach((item, i) => {
      const on = !close && i === index;
      item.classList.toggle("is-active", on);
      triggers[i].setAttribute("aria-expanded", String(on));
    });
  }

  triggers.forEach((trigger, i) => {
    trigger.addEventListener("click", () => {
      const wasOpen = items[i].classList.contains("is-active");
      setActive(i, !desktop.matches);

      // On mobile, keep the newly opened header in view after the layout shifts.
      if (!desktop.matches && !wasOpen) {
        setTimeout(() => {
          const top = trigger.getBoundingClientRect().top;
          if (top < 0 || top > window.innerHeight * 0.6) {
            trigger.scrollIntoView({
              block: "start",
              behavior: reduceMotion.matches ? "auto" : "smooth",
            });
          }
        }, 450);
      }
    });

    trigger.addEventListener("mouseenter", () => {
      if (desktop.matches && canHover.matches) setActive(i);
    });

    trigger.addEventListener("focus", () => {
      if (desktop.matches) setActive(i);
    });

    trigger.addEventListener("keydown", (e) => {
      const last = triggers.length - 1;
      let next = null;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") next = i === last ? 0 : i + 1;
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = i === 0 ? last : i - 1;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = last;
      if (next !== null) {
        e.preventDefault();
        triggers[next].focus();
      }
    });
  });

  // Desktop always needs exactly one active panel.
  function ensureOneActive() {
    if (desktop.matches && !items.some((it) => it.classList.contains("is-active"))) {
      setActive(0);
    }
  }
  desktop.addEventListener
    ? desktop.addEventListener("change", ensureOneActive)
    : desktop.addListener(ensureOneActive);
  ensureOneActive();

  /* ---------- Pointer-follow glow on the preview card ---------- */
  if (!reduceMotion.matches && canHover.matches) {
    root.querySelectorAll(".svc-card").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = Array.from(root.querySelectorAll("[data-reveal]"));
  if (reduceMotion.matches || !("IntersectionObserver" in window)) return;

  root.classList.add("is-ready");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );
  revealEls.forEach((el) => io.observe(el));
})();

/* ==========================================================================
   SEVEN PRINCIPLES PREVIEW  ·  append to main.js
   - Staggered scroll reveal (rules draw in, rows rise in sequence).
   - On touch devices (no hover), the row at the middle of the screen lights up
     as you scroll; on desktop the CSS :hover state does this instead.
   Safe to append: IIFE, exits if the section is absent, no GSAP required.
   ========================================================================== */
(() => {
  const root = document.getElementById("principles-preview");
  if (!root || !("IntersectionObserver" in window)) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fineHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Reveal ---------- */
  if (!reduceMotion) {
    root.classList.add("is-ready");
    const reveal = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            reveal.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    root.querySelectorAll("[data-reveal]").forEach((el) => reveal.observe(el));
  }

  /* ---------- Scroll-spy highlight (touch devices only) ---------- */
  if (!fineHover) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => entry.target.classList.toggle("is-current", entry.isIntersecting));
      },
      { rootMargin: "-42% 0px -42% 0px" } // a thin band across the middle of the viewport
    );
    root.querySelectorAll(".prv-row").forEach((row) => spy.observe(row));
  }
})();