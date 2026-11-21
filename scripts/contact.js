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

    const checkmark = overlay.querySelector(".checkmark-group");
    
    // Play success sound if supported
    try {
      const successSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZizcIHm/F8t9+M' +
        'AIZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZizcIHm/F8t9+MwIZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZizcIHm/F8t9+M');
      successSound.volume = 0.3;
      successSound.play().catch(() => {}); // Silently fail if audio not supported
    } catch (e) {
      // Audio not supported or blocked
    }

    card.classList.add("is-hidden");
    overlay.classList.add("is-visible");

    const tl = window.gsap.timeline({
      defaults: { ease: "power2.inOut" },
    });

    tl.set(checkmark, { opacity: 0, scale: 0.5, x: 0, y: 0 })
      .to(card, { opacity: 0, duration: 0.3 }, 0)
      .to(overlay, { opacity: 1, duration: 0.2 }, 0)
      .to(
        checkmark,
        {
          opacity: 1,
          scale: 1.15,
          duration: 0.4,
          ease: "back.out(2)",
        },
        0.3,
      )
      .to(
        checkmark,
        {
          scale: 1,
          duration: 0.2,
          ease: "power2.out",
        },
        0.7,
      )
      .to(
        overlay,
        {
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
          onComplete: () => overlay.classList.remove("is-visible"),
        },
        1.5,
      )
      .to(
        card,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
          onStart: () => card.classList.remove("is-hidden"),
        },
        1.5,
      );
  };

  form.addEventListener("submit", async (event) => {
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

    // Collect form data
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      company: formData.get("company"),
      projectType: formData.get("projectType"),
      message: formData.get("message"),
    };

    // Disable submit button while sending
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
      const response = await fetch("/api/contact", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.error || "Sorry, your enquiry could not be sent. Please try again.",
        );
      }

      status.textContent = `Thanks${name && name !== "there" ? `, ${name}` : ""}. Your enquiry has been received and the Konsalta team will get back to you soon.`;
      status.classList.remove("error");
      status.classList.add("success");
      form.reset();
      playSendAnimation();
    } catch (error) {
      console.error("Contact form submission failed:", error);
      status.textContent =
        error instanceof Error
          ? error.message
          : "Sorry, there was a problem sending your enquiry. Please email engage@konsaltahub.org.";
      status.classList.remove("success");
      status.classList.add("error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });

  // ============================================================
  // TAB SWITCHING (Contact Form <-> Consultant Onboarding Form)
  // ============================================================
  const tabBtnContact = document.getElementById("tabBtnContact");
  const tabBtnOnboarding = document.getElementById("tabBtnOnboarding");
  const panelContact = document.getElementById("panelContact");
  const panelOnboarding = document.getElementById("panelOnboarding");
  const introTitle = document.querySelector(".intro h1");
  const introDesc = document.querySelector(".intro > p:last-of-type");
  const onboardingLink = document.querySelector(".onboarding-link");

  function switchTab(target) {
    if (target === "onboarding") {
      tabBtnContact?.classList.remove("active");
      tabBtnContact?.setAttribute("aria-selected", "false");
      tabBtnOnboarding?.classList.add("active");
      tabBtnOnboarding?.setAttribute("aria-selected", "true");

      if (panelContact) panelContact.style.display = "none";
      if (panelOnboarding) {
        panelOnboarding.style.display = "block";
        panelOnboarding.classList.add("active");
      }

      if (introTitle) introTitle.textContent = "Consultant Onboarding";
      if (introDesc) {
        introDesc.textContent =
          "Help us deliver evidence, insights and impact. Complete the form below to join our expert network.";
      }
    } else {
      tabBtnOnboarding?.classList.remove("active");
      tabBtnOnboarding?.setAttribute("aria-selected", "false");
      tabBtnContact?.classList.add("active");
      tabBtnContact?.setAttribute("aria-selected", "true");

      if (panelOnboarding) {
        panelOnboarding.style.display = "none";
        panelOnboarding.classList.remove("active");
      }
      if (panelContact) panelContact.style.display = "block";

      if (introTitle) introTitle.textContent = "Contact Us";
      if (introDesc) {
        introDesc.textContent =
          "Tell us about your needs and we’ll help you move from insight to action.";
      }
    }
  }

  tabBtnContact?.addEventListener("click", () => switchTab("contact"));
  tabBtnOnboarding?.addEventListener("click", () => switchTab("onboarding"));

  // If user clicks the in-form helper link "Interested in joining as a consultant?"
  if (onboardingLink) {
    onboardingLink.addEventListener("click", (e) => {
      e.preventDefault();
      switchTab("onboarding");
      panelOnboarding?.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Check URL hash if user landed with #onboarding
  if (window.location.hash === "#onboarding") {
    switchTab("onboarding");
  }
});
