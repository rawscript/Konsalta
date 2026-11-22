/* site.js — replaces main.js and main-fx.js. Keep header.js and theme.js as they are.
   One reveal observer, one accordion, one scroll-spy, a GSAP hero intro, and back-to-top. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hover = matchMedia("(hover: hover) and (pointer: fine)");
  const wide = matchMedia("(min-width: 900px)");

  /* Sticky header shadow */
  const header = $(".site-header");
  const onScroll = () => header && header.classList.toggle("is-stuck", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Scroll reveal: stagger by position among revealed siblings */
  const reveals = $$("[data-reveal]");
  reveals.forEach((el) => {
    const sibs = [...el.parentElement.children].filter((c) => c.hasAttribute("data-reveal"));
    el.style.setProperty("--i", sibs.indexOf(el));
  });
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      }),
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  }

  /* Services: tabs on desktop, accordion on mobile */
  const items = $$(".svc-item");
  const triggers = items.map((i) => $(".svc-trigger", i));
  const setActive = (idx, allowClose) => {
    const close = allowClose && items[idx].classList.contains("is-active");
    items.forEach((item, i) => {
      const on = !close && i === idx;
      item.classList.toggle("is-active", on);
      triggers[i].setAttribute("aria-expanded", String(on));
    });
  };
  triggers.forEach((t, i) => {
    t.addEventListener("click", () => setActive(i, !wide.matches));
    t.addEventListener("mouseenter", () => { if (wide.matches && hover.matches) setActive(i); });
    t.addEventListener("focus", () => { if (wide.matches && t.matches(":focus-visible")) setActive(i); });
    t.addEventListener("keydown", (e) => {
      const last = triggers.length - 1;
      const next = { ArrowDown: i === last ? 0 : i + 1, ArrowRight: i === last ? 0 : i + 1,
        ArrowUp: i ? i - 1 : last, ArrowLeft: i ? i - 1 : last, Home: 0, End: last }[e.key];
      if (next !== undefined) { e.preventDefault(); triggers[next].focus(); }
    });
  });
  wide.addEventListener("change", () => {
    if (wide.matches && !items.some((i) => i.classList.contains("is-active"))) setActive(0);
  });

  /* Principles: highlight the row at mid-screen on touch devices (desktop uses :hover) */
  if (!hover.matches && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (es) => es.forEach((e) => e.target.classList.toggle("is-current", e.isIntersecting)),
      { rootMargin: "-42% 0px -42% 0px" }
    );
    $$(".prv-row").forEach((r) => spy.observe(r));
  }

  /* Back to top */
  const top = $(".to-top");
  if (top) top.addEventListener("click", () => scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));

  /* Hero intro + mosaic parallax (needs GSAP; page stays fully visible without it) */
  if (!window.gsap || reduce || !$(".hero .tl")) return;
  gsap.registerPlugin(window.ScrollTrigger);
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl.from(".hero .badge", { opacity: 0, y: -14, duration: 0.6 })
    .from(".tl .in", { yPercent: 110, duration: 1, stagger: 0.1, ease: "power4.out" }, 0.1)
    .from(".hero-desc, .hero .actions", { opacity: 0, y: 20, duration: 0.7, stagger: 0.12 }, 0.6)
    .from(".pic", { opacity: 0, scale: 0.88, duration: 1, stagger: 0.12, ease: "back.out(1.4)" }, 0.3);

  if (window.ScrollTrigger && wide.matches) {
    $$(".pic[data-speed]").forEach((p) =>
      gsap.to(p, {
        y: Number(p.dataset.speed),
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.8 },
      })
    );
  }
})();