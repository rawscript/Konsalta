gsap.registerPlugin(ScrollTrigger);

// ============================================================
// INITIAL STATES + APPLY DATA-ROT
// ============================================================
gsap.set("#nav", { opacity: 0, y: -20 });
gsap.set(".small-team .word > span", { y: "105%" });
gsap.set(".big-results .letter", { y: 80, opacity: 0 });
gsap.set("#subline", { opacity: 0, y: 20 });
gsap.set(".t-card", { opacity: 0 });
gsap.set(".stats-inner", { opacity: 0 });

// Apply each card's natural rotation as the rest-state, but start them off-screen above + rotated
document.querySelectorAll(".card").forEach((card) => {
  const rot = parseFloat(card.dataset.rot) || 0;
  card.dataset.restRot = rot;
  gsap.set(card, { y: -800, rotation: rot + 25, opacity: 0, scale: 0.7 });
});


// ============================================================
// INTRO TIMELINE
// ============================================================
const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
intro
  .to("#nav", { opacity: 1, y: 0, duration: 0.8 }, 0.1)
  .to(
    ".small-team .word > span",
    {
      y: "0%",
      duration: 0.9,
      stagger: 0.08,
      ease: "power3.out",
    },
    0.3,
  )
  .to(
    ".big-results .letter",
    {
      y: 0,
      opacity: 1,
      duration: 0.9,
      stagger: 0.05,
      ease: "back.out(1.6)",
    },
    0.55,
  )
  .to(
    ".card",
    {
      y: 0,
      opacity: 1,
      scale: 1,
      rotation: (i, el) => parseFloat(el.dataset.restRot) || 0,
      duration: 1.1,
      stagger: { each: 0.08, from: "center" },
      ease: "back.out(1.4)",
    },
    0.8,
  )
  .to("#subline", { opacity: 1, y: 0, duration: 0.8 }, 1.6);

// ============================================================
// CONTINUOUS FLOAT ON CARDS
// ============================================================
document.querySelectorAll(".card").forEach((card, i) => {
  const rot = parseFloat(card.dataset.restRot) || 0;
  gsap.to(card, {
    y: `+=${8 + (i % 3) * 5}`,
    rotation: rot + (i % 2 === 0 ? 1.5 : -1.5),
    duration: 3 + (i % 4) * 0.5,
    delay: 1.8 + i * 0.1,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
  });
});

// ============================================================
// MOUSE PARALLAX ON CARDS
// ============================================================
const hero = document.querySelector(".hero");
let mx = 0,
  my = 0,
  tx = 0,
  ty = 0;
if (hero) {
  hero.addEventListener("mousemove", (e) => {
    const r = hero.getBoundingClientRect();
    mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    my = ((e.clientY - r.top) / r.height - 0.5) * 2;
  });
  hero.addEventListener("mouseleave", () => {
    mx = 0;
    my = 0;
  });
}

function parallax() {
  tx += (mx - tx) * 0.05;
  ty += (my - ty) * 0.05;
  document.querySelectorAll(".card").forEach((card) => {
    const d = parseFloat(card.dataset.depth) || 8;
    card.style.translate = `${tx * d}px ${ty * d * 0.5}px`;
  });
  requestAnimationFrame(parallax);
}
if (hero) parallax();

// ============================================================
// CARD HOVER 3D LIFT
// ============================================================
document.querySelectorAll(".card").forEach((card) => {
  const restRot = parseFloat(card.dataset.restRot) || 0;
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(card, {
      rotateX: -py * 16,
      rotateY: px * 16,
      scale: 1.12,
      zIndex: 20,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 700,
      overwrite: "auto",
    });
  });
  card.addEventListener("mouseleave", () => {
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      zIndex: card.style.zIndex || "",
      duration: 0.8,
      ease: "elastic.out(1, 0.6)",
      overwrite: "auto",
    });
  });
  card.addEventListener("click", () => {
    gsap.fromTo(
      card,
      { scale: 1.15 },
      {
        scale: 1.05,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      },
    );
  });
});

// ============================================================
// SCROLL: CARDS FAN OUT, "big results" SCALES UP
// ============================================================
if (hero) {
  ScrollTrigger.create({
    trigger: hero,
    start: "top top",
    end: "bottom top",
    scrub: 0.8,
    onUpdate: (self) => {
      const p = self.progress;
      gsap.set(".big-results", { scale: 1 + 0.15 * p, opacity: 1 - 0.4 * p });
      gsap.set(".small-team", { y: -60 * p, opacity: 1 - p * 1.5 });
      const moves = [
        { x: -260, y: -40, rot: -25 },
        { x: -200, y: 20, rot: -18 },
        { x: -120, y: 80, rot: -10 },
        { x: -40, y: 120, rot: -4 },
        { x: 40, y: 120, rot: 4 },
        { x: 120, y: 80, rot: 12 },
        { x: 200, y: 20, rot: 22 },
        { x: 260, y: -40, rot: 28 },
      ];
      document.querySelectorAll(".card").forEach((card, i) => {
        const m = moves[i];
        const rest = parseFloat(card.dataset.restRot) || 0;
        gsap.set(card, {
          x: m.x * p,
          y: m.y * p,
          rotation: rest + m.rot * p,
        });
      });
      gsap.set("#subline", { opacity: 1 - p * 2 });
    },
  });
}

// ============================================================
// PINNED APPROACH CAROUSEL
// ============================================================
document.querySelectorAll(".approach-carousel").forEach((carousel) => {
  const slides = Array.from(carousel.querySelectorAll(".approach-slide"));
  const dots = Array.from(
    carousel.querySelectorAll(".approach-pagination button"),
  );
  const slideCopy = slides.map((slide) =>
    Array.from(slide.querySelector(".approach-copy").children),
  );

  if (
    slides.length < 2 ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  const syncDots = (progress) => {
    const activeIndex = Math.min(
      slides.length - 1,
      Math.floor(progress * slides.length),
    );

    dots.forEach((dot, index) => {
      if (index === activeIndex) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });
  };

  carousel.classList.add("is-enhanced");
  gsap.set(slides, { autoAlpha: 0, xPercent: 100 });
  gsap.set(slides[0], { autoAlpha: 1, xPercent: 0 });
  gsap.set(slideCopy.flat(), { autoAlpha: 0, y: 20 });

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: carousel,
      start: "top top",
      end: () => `+=${window.innerHeight * slides.length}`,
      pin: true,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => syncDots(self.progress),
    },
  });

  timeline.fromTo(
    slideCopy[0],
    { autoAlpha: 0, y: 20 },
    { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08, ease: "none" },
    0,
  );

  slides.slice(1).forEach((slide, index) => {
    const position = index + 1;
    timeline
      .to(
        slides[index],
        { autoAlpha: 0, xPercent: -8, duration: 0.65, ease: "none" },
        position,
      )
      .to(
        slideCopy[index],
        { autoAlpha: 0, y: -12, duration: 0.4, stagger: 0.04, ease: "none" },
        position,
      )
      .fromTo(
        slide,
        { autoAlpha: 0, xPercent: 100 },
        { autoAlpha: 1, xPercent: 0, duration: 0.65, ease: "none" },
        position,
      )
      .fromTo(
        slideCopy[index + 1],
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08, ease: "none" },
        position + 0.08,
      );
  });

  timeline.to({}, { duration: 0.35 }, slides.length - 0.35);
  syncDots(timeline.scrollTrigger.progress);

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      const trigger = timeline.scrollTrigger;
      const targetScroll =
        trigger.start +
        (trigger.end - trigger.start) * ((index + 0.5) / slides.length);
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    });
  });
});

// ============================================================
// PINNED 3D IMPACT GALLERY
// ============================================================
const impactGallery = document.querySelector(".impact-gallery");
const impactTrack = impactGallery?.querySelector(".impact-gallery-track");
const impactCards = Array.from(
  impactGallery?.querySelectorAll(".impact-gallery-card") || [],
);
const impactDots = Array.from(
  impactGallery?.querySelectorAll(".impact-gallery-pagination button") || [],
);

if (
  impactGallery &&
  impactTrack &&
  impactCards.length > 1 &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const getImpactScrollAmount = () =>
    -(impactTrack.scrollWidth - window.innerWidth);
  let activeImpactIndex = -1;

  const updateImpactCards = () => {
    const viewportCenter = window.innerWidth / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;

    impactCards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const distance = rect.left + rect.width / 2 - viewportCenter;
      const normalizedDistance = gsap.utils.clamp(
        -1,
        1,
        distance / (window.innerWidth * 0.5),
      );
      const absoluteDistance = Math.abs(distance);

      if (absoluteDistance < closestDistance) {
        closestDistance = absoluteDistance;
        closestIndex = index;
      }

      gsap.set(card, {
        rotationY: normalizedDistance * 38,
        scale: gsap.utils.clamp(
          0.76,
          1,
          1 - absoluteDistance / (window.innerWidth * 1.8),
        ),
        z: -absoluteDistance * 0.16,
      });
    });

    impactDots.forEach((dot, index) => {
      if (index === closestIndex) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });

    if (closestIndex !== activeImpactIndex) {
      activeImpactIndex = closestIndex;
      const copy = impactCards[closestIndex].querySelector(
        ".impact-gallery-card-copy",
      );
      const copyContent = Array.from(copy.children);

      gsap.fromTo(
        copyContent,
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.out",
          overwrite: true,
        },
      );
    }
  };

  const impactTween = gsap.to(impactTrack, {
    x: getImpactScrollAmount,
    ease: "none",
    scrollTrigger: {
      trigger: impactGallery,
      start: "top top",
      end: () => `+=${Math.max(1, Math.abs(getImpactScrollAmount()))}`,
      pin: true,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: updateImpactCards,
      onRefresh: updateImpactCards,
    },
  });

  updateImpactCards();

  impactDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      const trigger = impactTween.scrollTrigger;
      const progress = index / (impactCards.length - 1);
      window.scrollTo({
        top: trigger.start + (trigger.end - trigger.start) * progress,
        behavior: "smooth",
      });
    });
  });
}

// ============================================================
// TEAM GRID REVEAL ON SCROLL
// ============================================================
const whoWeServeReveal = gsap.timeline({
  scrollTrigger: {
    trigger: ".who-we-serve",
    start: "top 80%",
    once: true,
  },
});

whoWeServeReveal.from("#who-we-serve-heading", {
  opacity: 0,
  y: 28,
  duration: 0.8,
  ease: "power3.out",
});

gsap.from(".eyebrow, .team-head h2, .team-head p", {
  opacity: 0,
  y: 30,
  duration: 0.9,
  stagger: 0.1,
  ease: "power3.out",
  scrollTrigger: { trigger: ".team-head", start: "top 80%" },
});

gsap.to(".t-card", {
  opacity: 1,
  y: 0,
  duration: 1,
  stagger: 0.08,
  ease: "power3.out",
  scrollTrigger: { trigger: ".team-grid", start: "top 80%" },
});
gsap.from(".t-card", {
  y: 80,
  scale: 0.9,
  rotation: (i) => (i % 2 === 0 ? -3 : 3),
  duration: 1,
  stagger: 0.08,
  ease: "back.out(1.3)",
  scrollTrigger: { trigger: ".team-grid", start: "top 80%" },
});

// ============================================================
// STATS REVEAL + COUNTERS
// ============================================================
gsap.to(".stats-inner", {
  opacity: 1,
  y: 0,
  duration: 1.2,
  ease: "power3.out",
  scrollTrigger: { trigger: ".stats", start: "top 80%" },
});
gsap.from(".stats-inner", {
  y: 60,
  scale: 0.97,
  duration: 1.2,
  ease: "power3.out",
  scrollTrigger: { trigger: ".stats", start: "top 80%" },
});

ScrollTrigger.create({
  trigger: ".stats",
  start: "top 75%",
  onEnter: () => {
    document.querySelectorAll(".stat-block .num").forEach((el) => {
      const target = parseFloat(el.dataset.count);
      const span = el.querySelector("span");
      gsap.to(
        { v: 0 },
        {
          v: target,
          duration: 2,
          ease: "power2.out",
          onUpdate: function () {
            span.textContent = Math.floor(this.targets()[0].v).toString();
          },
        },
      );
    });
  },
  once: true,
});

// ============================================================
// CTA / BUTTON CLICKS
// ============================================================
document.querySelectorAll(".nav-cta, .arrow-pill").forEach((btn) => {
  btn.addEventListener("click", () => {
    gsap.fromTo(
      btn,
      { scale: 1 },
      {
        scale: 0.93,
        duration: 0.12,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      },
    );
  });
});

// Big results: subtle letter rise on hover of the wrap
const bigResultsWrap = document.querySelector(".big-results-wrap");
if (bigResultsWrap) {
  bigResultsWrap.addEventListener("mouseenter", () => {
    gsap.to(".big-results .letter", {
      y: -8,
      duration: 0.5,
      stagger: 0.03,
      ease: "back.out(1.6)",
    });
  });
  bigResultsWrap.addEventListener("mouseleave", () => {
    gsap.to(".big-results .letter", {
      y: 0,
      duration: 0.6,
      stagger: 0.03,
      ease: "elastic.out(1, 0.6)",
    });
  });
}
