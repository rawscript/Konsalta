// Konsalta — Insights Page Controller

const RSS_URL = "https://rss.app/feeds/v1.1/dXjZInAsmq46tGgy.json";

if (typeof gsap !== "undefined") {
  document.body.classList.add("js-ready");
  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }
}

document.addEventListener("DOMContentLoaded", () => {

  // ─── MOBILE PERFORMANCE CONFIG ───────────────────────────────────────────
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.innerWidth <= 768;
  const isSmallMobile = window.innerWidth <= 480;

  // ─── 1. CUSTOM CURSOR ────────────────────────────────────────────────────
  const cursor = document.querySelector(".cursor");
  const isFinePointer = window.matchMedia("(pointer: fine)").matches;

  if (cursor && isFinePointer) {
    document.body.classList.add("has-custom-cursor");
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let cx = mx, cy = my;

    document.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });

    document.querySelectorAll("a, button, .stream-card, .editorial-card, .rss-card, .subpage-tab").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("cursor--large"),    { passive: true });
      el.addEventListener("mouseleave", () => cursor.classList.remove("cursor--large"), { passive: true });
    });

    (function tick() {
      cx += (mx - cx) * 0.2;
      cy += (my - cy) * 0.2;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    })();
  }

  // ─── 2. GSAP INTRO ───────────────────────────────────────────────────────
  if (typeof gsap !== "undefined") {
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .fromTo(".site-header",           { opacity: 0, y: -24 }, { opacity: 1, y: 0, duration: 0.7 }, 0)
      .fromTo(".subpage-dock",          { opacity: 0, y: -18, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.5)" }, 0.15)
      .fromTo(".bg-shape",              { opacity: 0, scale: 0.75 }, { opacity: 1, scale: 1, duration: 1.1, stagger: { each: 0.05, from: "random" }, ease: "power2.out" }, 0.1)
      .fromTo(".subpage-1 .insights-hero-title .title-line", { opacity: 0, y: 42 }, { opacity: 1, y: 0, duration: 0.85, stagger: 0.12 }, 0.3)
      .fromTo(".subpage-1 .insights-hero-desc", { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.7 }, 0.5)
      .fromTo(".editorial-card",        { opacity: 0, scale: 0.94, y: 35 }, { opacity: 1, scale: 1, y: 0, duration: 0.95, ease: "power3.out" }, 0.6)
      .fromTo(".floating-signal",       { opacity: 0, scale: 0.8, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "back.out(1.8)" }, 0.9);

    // Background shape parallax - Skip on mobile for performance
    if (typeof ScrollTrigger !== "undefined") {
      if (!isMobile && !prefersReducedMotion) {
        document.querySelectorAll(".bg-shape").forEach((shape) => {
          const speed = parseFloat(shape.dataset.speed || 0.2);
          gsap.to(shape, {
            y: speed * -260, ease: "none",
            scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 1.2 }
          });
        });
      }

      // Stream card animations - reduced on mobile
      const cardY = isMobile ? 20 : 35;
      const cardDuration = isMobile ? 0.5 : 0.7;
      const cardStagger = isMobile ? 0.06 : 0.12;

      ScrollTrigger.batch(".stream-card", {
        start: "top 85%",
        onEnter: (batch) => gsap.fromTo(batch, { opacity: 0, y: cardY, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: cardDuration, stagger: cardStagger, ease: "power2.out" }),
        once: true
      });
    }

    // Mouse parallax on background shapes - Skip on mobile for performance
    if (!isMobile && !prefersReducedMotion) {
      document.addEventListener("mousemove", (e) => {
        const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / window.innerWidth;
        const dy = (e.clientY - cy) / window.innerHeight;

        document.querySelectorAll(".bg-shape").forEach((shape, i) => {
          const speed = parseFloat(shape.dataset.speed || 0.2);
          const dist  = (i % 2 === 0 ? -1 : 1) * Math.abs(speed) * 24;
          gsap.to(shape, { x: dx * dist, y: dy * dist, duration: 1.2, ease: "power2.out", overwrite: "auto" });
        });

        gsap.to(".floating-signal.signal-1", { x: dx * -14, y: dy * -14, duration: 0.8, ease: "power2.out", overwrite: "auto" });
        gsap.to(".floating-signal.signal-2", { x: dx * 16,  y: dy * 16,  duration: 0.8, ease: "power2.out", overwrite: "auto" });
      }, { passive: true });
    }
  }

  // ─── 3. SUBPAGE DOCK NAVIGATION ──────────────────────────────────────────
  const dockTabs  = document.querySelectorAll(".subpage-tab");
  const stepLinks = document.querySelectorAll(".step-link-btn");
  const subpages  = document.querySelectorAll(".insights-subpage");

  function scrollToSubpage(targetId) {
    const el = document.querySelector(targetId);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 140, behavior: "smooth" });
    dockTabs.forEach((t) => t.classList.toggle("active", t.dataset.target === targetId));
  }

  dockTabs.forEach((t)  => t.addEventListener("click",  () => scrollToSubpage(t.dataset.target)));
  stepLinks.forEach((l) => l.addEventListener("click",  () => scrollToSubpage(l.dataset.target)));

  window.addEventListener("scroll", () => {
    let active = "#subpage-1";
    const pos  = window.scrollY + 220;
    subpages.forEach((s) => { if (pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight) active = "#" + s.id; });
    dockTabs.forEach((t) => t.classList.toggle("active", t.dataset.target === active));
  }, { passive: true });

  // ─── 4. SECTOR SHOWCASE ANIMATIONS ──────────────────────────────────────
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    // Header line draws in
    const headerY = isMobile ? 18 : 28;
    const headerDuration = isMobile ? 0.5 : 0.7;

    gsap.from(".sector-showcase-header > *", {
      opacity: 0, y: headerY, duration: headerDuration, stagger: 0.12, ease: "power3.out",
      scrollTrigger: { trigger: "#sectorShowcase", start: "top 82%", once: true }
    });

    // Cards stagger up with a slight rotation for personality - skip rotation on mobile
    const cardY = isMobile ? 28 : 44;
    const cardDuration = isMobile ? 0.45 : 0.65;
    const cardRotation = isMobile || prefersReducedMotion ? 0 : 1.5;

    gsap.from(".sector-card", {
      opacity: 0, y: cardY, rotation: cardRotation, scale: 0.96,
      duration: cardDuration, stagger: 0.1, ease: "power3.out",
      scrollTrigger: { trigger: ".sector-grid", start: "top 84%", once: true }
    });

    // Icon bounces in after the card - skip on mobile for performance
    if (!isSmallMobile && !prefersReducedMotion) {
      gsap.from(".sector-icon", {
        scale: 0, opacity: 0, duration: 0.5, stagger: 0.1, ease: "back.out(2)",
        scrollTrigger: { trigger: ".sector-grid", start: "top 80%", once: true },
        delay: 0.15
      });
    }
  }

  // ─── 5. RSS FEED ─────────────────────────────────────────────────────────
  const grid = document.getElementById("rssFeedGrid");
  if (!grid) return;

  function formatDate(iso) {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    } catch { return ""; }
  }

  function truncate(str, max) {
    if (!str) return "";
    return str.length > max ? str.slice(0, max).trimEnd() + "…" : str;
  }

  function buildCard(item) {
    const date    = formatDate(item.date_published);
    const title   = truncate(item.title || "", 90);
    const excerpt = truncate(item.content_text || "", 180);
    const img     = item.image || "";
    const url     = item.url  || "#";

    return `
      <a class="rss-card" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${title}">
        ${img ? `<div class="rss-card-img-wrap"><img src="${img}" alt="" loading="lazy" class="rss-card-img" /></div>` : `<div class="rss-card-img-wrap rss-card-img-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 21V9"/></svg></div>`}
        <div class="rss-card-body">
          ${date ? `<span class="rss-card-date">${date}</span>` : ""}
          <p class="rss-card-excerpt">${excerpt}</p>
          <span class="rss-card-cta">Read on LinkedIn
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </span>
        </div>
      </a>`;
  }

  function showError() {
    grid.innerHTML = `
      <div class="rss-error">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
        <p>Could not load feed. <a href="https://www.linkedin.com/company/konsalta-hub-africa/" target="_blank" rel="noopener noreferrer">View on LinkedIn →</a></p>
      </div>`;
  }

  fetch(RSS_URL)
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then((data) => {
      const items = (data.items || []).slice(0, 6);
      if (!items.length) { showError(); return; }

      grid.innerHTML = items.map(buildCard).join("");

      // Animate cards in if GSAP is available
      if (typeof gsap !== "undefined") {
        gsap.fromTo(".rss-card",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: "power2.out" }
        );
      }
    })
    .catch(showError);

});
