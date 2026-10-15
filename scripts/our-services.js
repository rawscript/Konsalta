// ===== DATA SETS =====
// Hero content per nav tab
const heroData = {
  why: {
    words: ["We", "drive", "growth", "to", "your", "business"],
    subtitle:
      "Unlock your brand's potential with our proven marketing expertise. From strategy to execution, we drive growth."
  },
  about: {
    words: ["Built", "by", "operators", "who", "shipped", "real", "brands"],
    subtitle:
      "Six years in-house at growth-stage startups taught us what actually moves a number. Now we run that playbook for you."
  },
  portfolio: {
    words: ["Forty", "launches.", "Eleven", "rebrands.", "Three", "IPOs."],
    subtitle:
      "Selected work across SaaS, consumer, and fintech. Every project earned a number we can show you on a call."
  }
};

// Testimonials carousel
const testimonials = [
  {
    p1: "The final product exceeded my expectations.",
    p2: "Impressed with the results!",
    initials: "AS.",
    avatars: [12, 47]
  },
  {
    p1: "Best agency we've ever worked with.",
    p2: "ROI through the roof in six weeks.",
    initials: "MK.",
    avatars: [32, 68]
  },
  {
    p1: "They understood our vision and shipped it fast.",
    p2: "Felt like an extension of our team.",
    initials: "JR.",
    avatars: [52, 60]
  }
];
let testimonialIndex = 0;

// ===== INIT =====
if (typeof gsap !== "undefined") {
  document.body.classList.add("js-ready");
}

document.addEventListener("DOMContentLoaded", () => {
  // ===== INTRO TIMELINE =====
  if (typeof gsap !== "undefined") {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.to(".top-bar", { opacity: 1, duration: 0.4 })
      .from(
        ".top-bar",
        {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.8,
          ease: "power2.inOut"
        },
        "<"
      )
      .to("nav", { opacity: 1, duration: 0.4 }, "-=0.3")
      .from(
        "nav",
        { y: -20, scale: 0.95, duration: 0.7, ease: "back.out(1.5)" },
        "<"
      )
      .to(
        ".headline .word, .headline .arrow",
        { opacity: 1, duration: 0.4, stagger: 0.06 },
        "-=0.3"
      )
      .from(
        ".headline .word",
        {
          y: 40,
          rotateX: -50,
          duration: 0.8,
          stagger: 0.06,
          ease: "back.out(1.4)"
        },
        "<"
      )
      .from(
        ".headline .arrow",
        {
          scale: 0,
          rotation: -90,
          duration: 0.7,
          ease: "back.out(2)"
        },
        "-=0.4"
      )
      .to(".subtitle", { opacity: 1, duration: 0.5 }, "-=0.3")
      .from(".subtitle", { y: 14, duration: 0.55 }, "<")
      .to(".cta-yellow", { opacity: 1, duration: 0.4 }, "-=0.3")
      .from(
        ".cta-yellow",
        {
          y: 24,
          scale: 0.85,
          duration: 0.7,
          ease: "back.out(1.7)"
        },
        "<"
      )
      .to(
        ".card-base, .stat-half",
        { opacity: 1, duration: 0.4, stagger: 0.1 },
        "-=0.2"
      )
      .from(
        ".card-base, .stat-half",
        {
          y: 30,
          scale: 0.96,
          duration: 0.7,
          stagger: 0.1,
          ease: "back.out(1.4)"
        },
        "<"
      )
      .to(".tag", { opacity: 1, duration: 0.3, stagger: 0.06 }, "-=0.5")
      .from(
        ".tag",
        {
          scale: 0.3,
          duration: 0.7,
          stagger: 0.06,
          ease: "back.out(2)"
        },
        "<"
      );

    // Continuous loops
    gsap.to(".headline .arrow", {
      y: -5,
      rotation: 3,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 2.5
    });

    gsap.to(".cta-yellow", {
      scale: 1.02,
      duration: 1.6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 3
    });

    // ===== ANIMATED COUNTERS =====
    animateCounter("#stat1Num", 1.2, "M+", 1.6);
    animateCounter("#stat2Num", 3, "M", 1.6, "$");
  }

  function animateCounter(selector, target, suffix, duration, prefix = "") {
    const el = document.querySelector(selector);
    if (!el) return;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: duration,
      ease: "power2.out",
      delay: 1.8,
      onUpdate: () => {
        let displayVal;
        if (target >= 1) {
          displayVal = obj.val.toFixed(target % 1 === 0 ? 0 : 1);
        } else {
          displayVal = obj.val.toFixed(1);
        }
        el.textContent = prefix + displayVal + suffix;
      }
    });
  }

  // ===== NAV TAB SWITCHING =====
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      const tab = link.dataset.tab;
      if (!tab || !heroData[tab]) return;

      // Update active state
      document
        .querySelectorAll(".nav-link")
        .forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      const data = heroData[tab];
      const headlineEl = document.getElementById("headline");
      const subtitleEl = document.getElementById("subtitle");

      if (typeof gsap === "undefined") {
        // No-animation fallback
        rebuildHeadline(data.words);
        subtitleEl.textContent = data.subtitle;
        return;
      }

      // Fade out current content
      gsap.to(".headline .word, .headline .arrow", {
        opacity: 0,
        y: -10,
        duration: 0.25,
        stagger: 0.02,
        ease: "power2.in",
        onComplete: () => {
          // Rebuild headline
          rebuildHeadline(data.words);

          // Fade in new
          gsap.set(".headline .word, .headline .arrow", { opacity: 0, y: 15 });
          gsap.to(".headline .word, .headline .arrow", {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.04,
            ease: "back.out(1.4)"
          });
        }
      });

      gsap.to(subtitleEl, {
        opacity: 0,
        y: -6,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          subtitleEl.textContent = data.subtitle;
          gsap.set(subtitleEl, { opacity: 0, y: 8 });
          gsap.to(subtitleEl, {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power3.out"
          });
        }
      });
    });
  });

  function rebuildHeadline(words) {
    const headlineEl = document.getElementById("headline");
    const arrowHTML = headlineEl.querySelector(".arrow").outerHTML;
    headlineEl.innerHTML =
      words.map((w) => `<span class="word">${w}</span>`).join(" ") +
      " " +
      arrowHTML;
  }

  // ===== SHUFFLEABLE TAGS =====
  function shuffleTags() {
    if (typeof gsap === "undefined") return;
    const container = document.getElementById("tagsContainer");
    const tags = container.querySelectorAll(".tag");
    const containerRect = container.getBoundingClientRect();

    // Define rough slots so tags don't overlap horribly
    const slots = [
      { top: 5, left: 25 },
      { top: 18, left: 0 },
      { top: 18, left: 55 },
      { top: 42, left: 12 },
      { top: 42, left: 58 },
      { top: 70, left: 4 },
      { top: 70, left: 50 },
      { top: 88, left: 25 }
    ];
    const shuffled = [...slots].sort(() => Math.random() - 0.5);

    tags.forEach((tag, i) => {
      const slot = shuffled[i] || shuffled[0];
      const rotation = Math.random() * 14 - 7;
      gsap.to(tag, {
        top: slot.top + "%",
        left: slot.left + "%",
        rotation: rotation,
        duration: 0.7,
        ease: "back.out(1.4)",
        delay: i * 0.03
      });
    });
  }

  document.querySelectorAll(".tag").forEach((tag) => {
    tag.addEventListener("click", (e) => {
      e.stopPropagation();
      shuffleTags();

      if (typeof gsap !== "undefined") {
        gsap.fromTo(
          tag,
          { scale: 1 },
          {
            scale: 1.25,
            duration: 0.18,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
          }
        );
      }
    });
    // hover lift
    tag.addEventListener("mouseenter", () => {
      if (typeof gsap !== "undefined") {
        gsap.to(tag, {
          y: "-=6",
          scale: 1.05,
          duration: 0.25,
          ease: "back.out(2)",
          overwrite: "auto"
        });
      }
    });
    tag.addEventListener("mouseleave", () => {
      if (typeof gsap !== "undefined") {
        gsap.to(tag, {
          y: 0,
          scale: 1,
          duration: 0.35,
          ease: "power2.out",
          overwrite: "auto"
        });
      }
    });
  });

  // ===== TESTIMONIAL CAROUSEL =====
  function cycleTestimonial() {
    testimonialIndex = (testimonialIndex + 1) % testimonials.length;
    const t = testimonials[testimonialIndex];

    const p1 = document.getElementById("testimonialP1");
    const p2 = document.getElementById("testimonialP2");
    const initials = document.getElementById("authorInitials");
    const avatarsContainer = document.getElementById("testimonialAvatars");

    if (typeof gsap === "undefined") {
      p1.textContent = t.p1;
      p2.textContent = t.p2;
      initials.textContent = t.initials;
      return;
    }

    gsap.to([p1, p2, initials], {
      opacity: 0,
      y: -8,
      duration: 0.22,
      ease: "power2.in",
      stagger: 0.04,
      onComplete: () => {
        p1.textContent = t.p1;
        p2.textContent = t.p2;
        initials.textContent = t.initials;

        // Update avatar imgs
        const avatarEls = avatarsContainer.querySelectorAll(".avatar-mini img");
        t.avatars.forEach((idx, i) => {
          if (avatarEls[i])
            avatarEls[i].src = `https://i.pravatar.cc/80?img=${idx}`;
        });

        gsap.set([p1, p2, initials], { opacity: 0, y: 8 });
        gsap.to([p1, p2, initials], {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.05,
          ease: "power3.out"
        });

        // Initials badge pop
        gsap.fromTo(
          initials,
          { scale: 0.7 },
          { scale: 1, duration: 0.5, ease: "back.out(2)" }
        );
      }
    });
  }

  document
    .querySelectorAll("#testimonialAvatars .avatar-mini, #authorInitials")
    .forEach((el) => {
      el.style.cursor = "pointer";
      el.addEventListener("click", cycleTestimonial);
    });

  // Auto-cycle every 7s
  setInterval(cycleTestimonial, 7000);

  // ===== BOOK A CALL ATTENTION =====
  document.getElementById("ctaBig").addEventListener("click", function () {
    if (typeof gsap === "undefined") return;
    gsap.fromTo(
      this,
      { scale: 0.94 },
      { scale: 1, duration: 0.6, ease: "elastic.out(1.2, 0.4)" }
    );
    // Pulse the headline arrow
    gsap.fromTo(
      ".headline .arrow",
      { scale: 1 },
      {
        scale: 1.3,
        rotation: 15,
        duration: 0.4,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      }
    );
  });

  document.getElementById("bookCtaNav").addEventListener("click", function () {
    // Smooth scroll to the big CTA + pulse it
    const target = document.getElementById("ctaBig");
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    if (typeof gsap !== "undefined") {
      setTimeout(() => {
        gsap.fromTo(
          target,
          { scale: 1 },
          {
            scale: 1.08,
            duration: 0.4,
            yoyo: true,
            repeat: 2,
            ease: "power2.inOut"
          }
        );
      }, 400);
    }
  });

  // Stat half hover triggers counter replay
  document.getElementById("statTop").addEventListener("click", () => {
    if (typeof gsap === "undefined") return;
    const el = document.getElementById("stat1Num");
    const obj = { val: 0 };
    gsap.to(obj, {
      val: 1.2,
      duration: 1.2,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = obj.val.toFixed(1) + "M+";
      }
    });
  });

  document.getElementById("statBottom").addEventListener("click", () => {
    if (typeof gsap === "undefined") return;
    const el = document.getElementById("stat2Num");
    const obj = { val: 0 };
    gsap.to(obj, {
      val: 3,
      duration: 1.2,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = "$" + obj.val.toFixed(0) + "M";
      }
    });
  });
}); // DOMContentLoaded
