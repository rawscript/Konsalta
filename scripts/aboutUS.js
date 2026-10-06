gsap.registerPlugin(ScrollTrigger);

// ============ CURSOR ============
const cursor = document.querySelector(".cursor");
let mx = 0,
  my = 0,
  cx = 0,
  cy = 0;
document.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
});
(function animateCursor() {
  cx += (mx - cx) * 0.2;
  cy += (my - cy) * 0.2;
  cursor.style.left = cx + "px";
  cursor.style.top = cy + "px";
  requestAnimationFrame(animateCursor);
})();
document
  .querySelectorAll("a, button, .tile, .fpill, .feature-card")
  .forEach((el) => {
    el.addEventListener("mouseenter", () =>
      gsap.to(cursor, { width: 36, height: 36, duration: 0.3 }),
    );
    el.addEventListener("mouseleave", () =>
      gsap.to(cursor, { width: 12, height: 12, duration: 0.3 }),
    );
  });

// ============ SVG LINE LENGTHS ============
document.querySelectorAll(".constellation-lines path").forEach((path) => {
  const length = path.getTotalLength();
  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length;
});

// ============ PAGE LOAD ============
const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
tl.to(".site-header", { opacity: 1, duration: 0.8 }, 0)
  .to(
    ".title-inner",
    { y: 0, duration: 1.1, stagger: 0.08, ease: "power4.out" },
    0.2,
  )
  .to(".hero-desc", { opacity: 1, duration: 0.8 }, 0.9)
  .from(".hero-desc", { y: 20, duration: 0.8 }, 0.9)
  .to(".cta-btn", { opacity: 1, duration: 0.7 }, 1.0)
  .from(".cta-btn", { y: 20, duration: 0.7 }, 1.0)
  .to(
    ".tile",
    {
      opacity: 1,
      scale: 1,
      duration: 1.2,
      stagger: { each: 0.07, from: "center" },
      ease: "elastic.out(1, 0.6)",
    },
    0.5,
  )
  .from(
    ".tile",
    {
      scale: 0,
      duration: 1.2,
      stagger: { each: 0.07, from: "center" },
      ease: "elastic.out(1, 0.6)",
    },
    0.5,
  )
  .to(
    ".constellation-lines path",
    {
      strokeDashoffset: 0,
      duration: 1.4,
      stagger: 0.06,
      ease: "power2.inOut",
    },
    0.8,
  )
  .to(".workspace", { opacity: 1, duration: 0.8 }, 1.6)
  .from(
    ".fpill",
    {
      y: 30,
      scale: 0.5,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "back.out(1.6)",
    },
    1.6,
  )
  .from(
    ".workspace-label, .learn-more",
    { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 },
    1.6,
  );

// ============ CONSTELLATION 3D TILT ============
const constellation = document.getElementById("constellation");
const constellationInner = document.getElementById("constellationInner");
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

// ============ SCROLL: CONSTELLATION PARALLAX ============
gsap.to(".constellation", {
  y: 100,
  scale: 0.92,
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: 1,
  },
});
gsap.to(".hero-left", {
  y: 60,
  opacity: 0.4,
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: 1,
  },
});

// ============ STAT NUMBER COUNTER ============
document.querySelectorAll(".stat-num").forEach((el) => {
  const target = parseInt(el.dataset.num);
  const suffix = el.querySelector(".accent");
  const suffixText = suffix ? suffix.outerHTML : "";
  ScrollTrigger.create({
    trigger: el,
    start: "top 85%",
    once: true,
    onEnter: () => {
      let obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => {
          let display = Math.floor(obj.val);
          if (target >= 1000)
            display = "+" + (display / 1000).toFixed(1).replace(".0", "") + "k";
          else if (
            target >= 100 &&
            target <= 999 &&
            suffix &&
            suffix.textContent === "k"
          )
            display = "+" + display;
          el.innerHTML = display + suffixText;
        },
      });
    },
  });
});

// ============ SECTION TITLE REVEALS ============
function splitWords(selector) {
  document.querySelectorAll(selector).forEach((el) => {
    const words = el.innerText.split(" ");
    el.innerHTML = words
      .map(
        (w) =>
          `<span class="sword" style="display:inline-block;overflow:hidden;padding-bottom:0.12em;vertical-align:top;"><span class="sword-inner" style="display:inline-block;transform:translateY(110%);will-change:transform;">${w}</span></span>`,
      )
      .join(" ");
  });
}
splitWords(".features-title");
splitWords(".quote-text");
splitWords(".final-cta-h2");

// Note: splitWords destroys spans like .accent. Re-color accent words for final-cta.
document.querySelectorAll(".final-cta-h2 .sword-inner").forEach((el) => {
  if (el.textContent.includes("good") || el.textContent.includes("ones")) {
    el.style.color = "var(--yellow)";
  }
});

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
  stagger: 0.05,
  ease: "power4.out",
  scrollTrigger: {
    trigger: ".final-cta-h2",
    start: "top 80%",
    toggleActions: "play none none reverse",
  },
});

// ============ FEATURE CARDS REVEAL ============
gsap.from(".feature-card", {
  y: 80,
  opacity: 0,
  duration: 1,
  stagger: 0.15,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".feature-cards",
    start: "top 75%",
    toggleActions: "play none none reverse",
  },
});

// ============ QUOTE MARK ============
gsap.from(".quote-mark", {
  scale: 0,
  rotation: -45,
  duration: 1.2,
  ease: "elastic.out(1, 0.6)",
  scrollTrigger: {
    trigger: ".quote-mark",
    start: "top 80%",
    toggleActions: "play none none reverse",
  },
});

// ============ FEATURE CARD 3D HOVER ============
document.querySelectorAll(".feature-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(card, {
      rotationY: x * 8,
      rotationX: -y * 8,
      y: -12,
      duration: 0.5,
      transformPerspective: 1200,
      ease: "power2.out",
    });
  });
  card.addEventListener("mouseleave", () => {
    gsap.to(card, {
      rotationY: 0,
      rotationX: 0,
      y: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.5)",
    });
  });
});

// ============ FINAL CTA PULSE ON ENTRY ============
gsap.from(".final-cta-card", {
  scale: 0.92,
  opacity: 0,
  duration: 1.2,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".final-cta-card",
    start: "top 80%",
    toggleActions: "play none none reverse",
  },
});

// Refresh
window.addEventListener("load", () => ScrollTrigger.refresh());
