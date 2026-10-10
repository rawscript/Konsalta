document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const status = document.querySelector(".form-status");
  const overlay = document.querySelector(".send-overlay");
  const card = document.querySelector(".contact-card");

  if (!form || !status || !card || !overlay) {
    return;
  }

  if (
    window.gsap &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    window.gsap
      .timeline({ defaults: { ease: "power3.out" } })
      .from(".back-link", { opacity: 0, x: -12, duration: 0.45 })
      .from(
        ".intro .eyebrow, .intro h1, .intro > p:last-child",
        { opacity: 0, y: 18, duration: 0.6, stagger: 0.1 },
        "-=0.25",
      )
      .fromTo(
        ".contact-card",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.75, clearProps: "opacity,transform" },
        "-=0.2",
      )
      .from(
        ".contact-copy > *, .contact-form > *",
        { opacity: 0, y: 12, duration: 0.45, stagger: 0.06 },
        "-=0.35",
      );
  }

  const playSendAnimation = () => {
    if (
      !window.gsap ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const planeGroup = overlay.querySelector(".plane-group");
    const shadow = overlay.querySelector(".plane-shadow");
    const trail = overlay.querySelector(".flight-trail");
    const checkmark = overlay.querySelector(".checkmark-group");

    card.classList.add("is-hidden");
    overlay.classList.add("is-visible");

    const tl = window.gsap.timeline({
      defaults: { ease: "power2.inOut" },
    });

    tl.set(planeGroup, {
      x: 0,
      y: 0,
      rotation: -24,
      rotateX: 22,
      rotateY: -14,
      scale: 0.62,
      opacity: 0,
      transformOrigin: "50% 50%",
    })
      .set(shadow, { opacity: 0, scale: 0.7, x: 0, y: 0 })
      .set(trail, { strokeDashoffset: 100, opacity: 0 })
      .set(checkmark, { opacity: 0, scale: 0.5, x: 0, y: 0 })
      .to(card, { opacity: 0, duration: 0.18 }, 0)
      .to(
        trail,
        { opacity: 1, strokeDashoffset: 0, duration: 0.7, ease: "power1.out" },
        0.15,
      )
      .to(
        planeGroup,
        {
          opacity: 1,
          x: 110,
          y: -42,
          rotation: -8,
          rotateX: 14,
          rotateY: -6,
          scale: 0.88,
          duration: 0.7,
          ease: "power3.out",
        },
        0.15,
      )
      .to(
        planeGroup,
        {
          x: 290,
          y: -180,
          rotation: 18,
          rotateX: 4,
          rotateY: 10,
          scale: 1.04,
          duration: 1.1,
          ease: "power2.out",
        },
        0.8,
      )
      .to(
        shadow,
        {
          opacity: 0.9,
          x: 170,
          y: 55,
          scale: 0.9,
          duration: 1.1,
          ease: "power2.out",
        },
        0.8,
      )
      .to(
        planeGroup,
        {
          x: 345,
          y: -230,
          rotation: 28,
          rotateX: -8,
          rotateY: 18,
          scale: 1.12,
          duration: 0.5,
          ease: "power1.in",
        },
        1.9,
      )
      .to(
        planeGroup,
        {
          opacity: 0,
          duration: 0.12,
        },
        2.25,
      )
      .to(
        checkmark,
        {
          opacity: 1,
          scale: 1,
          duration: 0.28,
          ease: "back.out(1.7)",
        },
        2.2,
      )
      .to(
        overlay,
        {
          opacity: 0,
          duration: 0.42,
          ease: "power2.inOut",
          onComplete: () => overlay.classList.remove("is-visible"),
        },
        2.9,
      )
      .to(
        card,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
          onStart: () => card.classList.remove("is-hidden"),
        },
        2.9,
      );
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      status.textContent =
        "Please complete all required fields before sending your enquiry.";
      status.classList.remove("success");
      status.classList.add("error");
      return;
    }

    const formData = new FormData(form);
    const name = (formData.get("name") || "there").toString().trim();

    status.textContent = `Thanks${name && name !== "there" ? `, ${name}` : ""}. Your enquiry has been received and the Konsalta team will get back to you soon.`;
    status.classList.remove("error");
    status.classList.add("success");
    form.reset();
    playSendAnimation();
  });
});
