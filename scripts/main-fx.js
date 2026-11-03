// fx.js — load with `defer` AFTER main.js
(() => {
  const fine = matchMedia("(pointer: fine)").matches;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1. Hero cursor-spotlight dot grid
  const hero = document.querySelector(".hero");
  if (hero && fine) {
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", e.clientX - r.left + "px");
      hero.style.setProperty("--my", e.clientY - r.top + "px");
    });
  }

  // 2. Cursor-lit feature cards
  document.querySelectorAll(".feature-card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--cx", e.clientX - r.left + "px");
      card.style.setProperty("--cy", e.clientY - r.top + "px");
    });
  });

  // 3. Network canvas in the dark section
  const section = document.querySelector(".features");
  if (section) {
    const canvas = document.createElement("canvas");
    canvas.className = "net-canvas";
    canvas.setAttribute("aria-hidden", "true");
    section.prepend(canvas);
    const ctx = canvas.getContext("2d");
    const LINK = 130, REACH = 180;
    let w = 0, h = 0, nodes = [], raf = 0;
    const mouse = { x: -999, y: -999 };

    const frame = (move) => {
      ctx.clearRect(0, 0, w, h);
      if (move) {
        for (const p of nodes) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        ctx.fillStyle = "rgba(156,192,234,.55)";
        ctx.beginPath();
        ctx.arc(a.x, a.y, 1.6, 0, 6.283);
        ctx.fill();
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            ctx.strokeStyle = `rgba(156,192,234,${(1 - d / LINK) * 0.22})`;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (dm < REACH) {
          ctx.strokeStyle = `rgba(242,101,34,${(1 - dm / REACH) * 0.6})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
    };

    const loop = () => { frame(true); raf = requestAnimationFrame(loop); };

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = section.clientWidth; h = section.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(90, Math.round((w * h) / 16000));
      nodes = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      }));
      frame(false);
    };
    new ResizeObserver(resize).observe(section);

    section.addEventListener("pointermove", (e) => {
      const r = section.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    section.addEventListener("pointerleave", () => { mouse.x = mouse.y = -999; });

    if (!reduce) {
      // Only animate while the section is on screen
      new IntersectionObserver(([en]) => {
        cancelAnimationFrame(raf);
        if (en.isIntersecting) loop();
      }).observe(section);
    }
  }

  // 4. Scroll-drawn cycle line
  const track = document.querySelector(".cycle-track");
  if (track) {
    const fill = track.querySelector(".cycle-fill");
    const dots = [...track.querySelectorAll("i")];
    const marks = [0.167, 0.5, 0.833];
    const paint = (p) => {
      fill.style.transform = `scaleX(${p})`;
      dots.forEach((d, i) => d.classList.toggle("on", p >= marks[i]));
    };
    if (reduce || !window.ScrollTrigger) {
      paint(1);
    } else {
      ScrollTrigger.create({
        trigger: ".feature-cards",
        start: "top 80%",
        end: "top 25%",
        scrub: 0.6,
        onUpdate: (s) => paint(s.progress),
      });
    }
  }

  // 5. Magnetic CTA buttons
  if (fine && !reduce && window.gsap) {
    document.querySelectorAll(".cta-btn").forEach((btn) => {
      const x = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power3" });
      const y = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power3" });
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        x((e.clientX - r.left - r.width / 2) * 0.25);
        y((e.clientY - r.top - r.height / 2) * 0.35);
      });
      btn.addEventListener("pointerleave", () => { x(0); y(0); });
    });
  }
})();