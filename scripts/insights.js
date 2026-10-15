// Konsalta — Our Insights Page Controller & Motion

if (typeof gsap !== "undefined") {
  document.body.classList.add("js-ready");
  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // ===== 1. CURSOR TRACKING =====
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

    // Grow cursor on interactive elements
    document
      .querySelectorAll("a, button, input, .stream-card, .editorial-card, .preview-card-glass, .subpage-tab")
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

  // ===== 2. GSAP INTRO LOAD ANIMATIONS =====
  if (typeof gsap !== "undefined") {
    const introTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    introTl
      .fromTo(
        ".site-header",
        { opacity: 0, y: -24 },
        { opacity: 1, y: 0, duration: 0.7 },
        0
      )
      .fromTo(
        ".subpage-dock",
        { opacity: 0, y: -18, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.5)" },
        0.15
      )
      .fromTo(
        ".bg-shape",
        { opacity: 0, scale: 0.75 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.1,
          stagger: { each: 0.05, from: "random" },
          ease: "power2.out"
        },
        0.1
      )
      .fromTo(
        ".subpage-1 .hero-badge",
        { opacity: 0, scale: 0.85, y: -10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.8)" },
        0.25
      )
      .fromTo(
        ".subpage-1 .insights-hero-title .title-line",
        { opacity: 0, y: 42 },
        { opacity: 1, y: 0, duration: 0.85, stagger: 0.12, ease: "power3.out" },
        0.35
      )
      .fromTo(
        ".subpage-1 .insights-hero-desc",
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.7 },
        0.55
      )
      .fromTo(
        ".editorial-card",
        { opacity: 0, scale: 0.94, y: 35 },
        { opacity: 1, scale: 1, y: 0, duration: 0.95, ease: "power3.out" },
        0.65
      )
      .fromTo(
        ".floating-signal",
        { opacity: 0, scale: 0.8, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "back.out(1.8)" },
        0.95
      );

    // Parallax on Background Shapes via ScrollTrigger
    if (typeof ScrollTrigger !== "undefined") {
      document.querySelectorAll(".bg-shape").forEach((shape) => {
        const speed = parseFloat(shape.dataset.speed || 0.2);
        gsap.to(shape, {
          y: speed * -260,
          ease: "none",
          scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2
          }
        });
      });

      // Stream cards reveal in Subpage 1
      ScrollTrigger.batch(".stream-card", {
        start: "top 85%",
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, y: 35, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.12, ease: "power2.out" }
          );
        },
        once: true
      });

      // Subpage 2 Entrance
      gsap.from(".subpage-2 .subpage-header > *", {
        y: 35,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#subpage-2",
          start: "top 78%",
          once: true
        }
      });

      gsap.from(".signup-glass-hub", {
        y: 40,
        opacity: 0,
        scale: 0.96,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".signup-glass-hub",
          start: "top 82%",
          once: true
        }
      });

      gsap.from(".stream-preview-container", {
        y: 35,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".stream-preview-container",
          start: "top 85%",
          once: true
        }
      });
    }

    // Mouse Parallax on Background Shapes and Hero Signals
    document.addEventListener("mousemove", (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / window.innerWidth;
      const dy = (e.clientY - cy) / window.innerHeight;

      document.querySelectorAll(".bg-shape").forEach((shape, i) => {
        const speed = parseFloat(shape.dataset.speed || 0.2);
        const dist = (i % 2 === 0 ? -1 : 1) * Math.abs(speed) * 24;
        gsap.to(shape, {
          x: dx * dist,
          y: dy * dist,
          duration: 1.2,
          ease: "power2.out",
          overwrite: "auto"
        });
      });

      gsap.to(".floating-signal.signal-1", {
        x: dx * -14,
        y: dy * -14,
        duration: 0.8,
        ease: "power2.out",
        overwrite: "auto"
      });

      gsap.to(".floating-signal.signal-2", {
        x: dx * 16,
        y: dy * 16,
        duration: 0.8,
        ease: "power2.out",
        overwrite: "auto"
      });
    });
  }

  // ===== 3. SUBPAGE CONTROLLER DOCK & NAVIGATION =====
  const dockTabs = document.querySelectorAll(".subpage-tab");
  const stepLinks = document.querySelectorAll(".step-link-btn");

  function scrollToSubpage(targetId) {
    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;

    const offsetTop = targetEl.getBoundingClientRect().top + window.scrollY - 140;
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth"
    });

    dockTabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.target === targetId);
    });
  }

  dockTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      scrollToSubpage(tab.dataset.target);
    });
  });

  stepLinks.forEach((link) => {
    link.addEventListener("click", () => {
      scrollToSubpage(link.dataset.target);
    });
  });

  // Highlight active dock tab based on viewport scroll position
  const subpages = document.querySelectorAll(".insights-subpage");
  window.addEventListener("scroll", () => {
    let currentId = "#subpage-1";
    const scrollPos = window.scrollY + 220;

    subpages.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = "#" + section.id;
      }
    });

    dockTabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.target === currentId);
    });
  }, { passive: true });

  // ===== 4. THE 4 STREAM BUTTONS & PREVIEW SHOWCASE =====
  const streamButtons = document.querySelectorAll(".stream-btn");
  const streamPanels = document.querySelectorAll(".stream-panel");
  const previewTitle = document.getElementById("previewTitle");

  const previewTitles = {
    publications: "Publications Preview: African Market Trade & Policy Reform",
    briefs: "Briefs Preview: Decarbonization in Agribusiness & Supply Chains",
    news: "News & Blogs Preview: Real-Time Ground Signals from Metropolitan Hubs",
    "thought-leadership": "Thought Leadership Preview: Strategic Clarity in Volatile Cycles"
  };

  streamButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const streamKey = btn.dataset.stream;

      // Toggle active preference state
      btn.classList.toggle("active");
      const isNowActive = btn.classList.contains("active");
      btn.setAttribute("aria-pressed", isNowActive.toString());

      // Show preview panel for the clicked stream
      streamPanels.forEach((panel) => {
        if (panel.id === `panel-${streamKey}`) {
          panel.classList.add("active");
          if (typeof gsap !== "undefined") {
            gsap.fromTo(
              panel,
              { opacity: 0, y: 15 },
              { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
            );
          }
        } else {
          panel.classList.remove("active");
        }
      });

      if (previewTitle && previewTitles[streamKey]) {
        previewTitle.textContent = previewTitles[streamKey];
      }
    });
  });

  // ===== 5. SUBSCRIPTION FORM LOGIC =====
  const subForm = document.getElementById("insightSubscriptionForm");
  const emailInput = document.getElementById("subscriberEmail");
  const formFeedback = document.getElementById("formFeedback");
  const notifyBtn = document.getElementById("notifyBtn");

  if (subForm && emailInput && formFeedback) {
    subForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const emailVal = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Validate email
      if (!emailVal || !emailRegex.test(emailVal)) {
        formFeedback.className = "form-feedback error";
        formFeedback.textContent = "Please enter a valid institutional or personal email address.";
        emailInput.focus();
        return;
      }

      // Collect selected stream preferences
      const activeStreams = [];
      document.querySelectorAll(".stream-btn.active").forEach((b) => {
        const text = b.querySelector(".btn-text")?.textContent || "";
        if (text) activeStreams.push(text);
      });

      if (activeStreams.length === 0) {
        formFeedback.className = "form-feedback error";
        formFeedback.textContent = "Please select at least one intelligence stream above.";
        return;
      }

      // Animate button feedback
      if (notifyBtn) {
        notifyBtn.disabled = true;
        const originalContent = notifyBtn.innerHTML;
        notifyBtn.innerHTML = `<span>Adding...</span>`;

        setTimeout(() => {
          formFeedback.className = "form-feedback success";
          formFeedback.innerHTML = `
            <strong>Access Confirmed!</strong> ${emailVal} has been added to priority dispatch.
            <div style="margin-top: 4px; font-size: 12px; font-weight: normal; opacity: 0.9;">
              Selected Streams: ${activeStreams.join(", ")}.
            </div>
          `;

          notifyBtn.innerHTML = `<span>Registered ✓</span>`;
          notifyBtn.style.background = "#15803d";

          // Save preference locally
          try {
            localStorage.setItem(
              "konsalta_subscriber",
              JSON.stringify({
                email: emailVal,
                streams: activeStreams,
                date: new Date().toISOString()
              })
            );
          } catch (err) {
            // silent ignore
          }

          setTimeout(() => {
            emailInput.value = "";
            notifyBtn.disabled = false;
            notifyBtn.innerHTML = originalContent;
            notifyBtn.style.background = "";
          }, 4500);
        }, 600);
      }
    });
  }
});
