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
    .from(".site-header",           { autoAlpha: 0, y: -18, duration: 0.6 })
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

}); // end DOMContentLoaded

// Recalculate ScrollTrigger positions after all assets are loaded
window.addEventListener("load", () => {
  if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
}, { once: true });
