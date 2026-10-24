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

}); // end DOMContentLoaded

// Refresh ScrollTrigger after fonts/images finish loading so trigger
// positions are calculated against the final settled layout.
window.addEventListener("load", function () {
  if (typeof ScrollTrigger !== "undefined") {
    ScrollTrigger.refresh();
  }
});
