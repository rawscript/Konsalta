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
      message: formData.get("message")
    };

    // Disable submit button while sending
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
      // Determine API URL based on environment
      const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000/api/contact'
        : '/api/contact';

      console.log('Sending to:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Result:', result);

      if (result.success) {
        status.textContent = `Thanks${name && name !== "there" ? `, ${name}` : ""}. Your enquiry has been received and the Konsalta team will get back to you soon.`;
        status.classList.remove("error");
        status.classList.add("success");
        form.reset();
        playSendAnimation();
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      status.textContent = error.message || "Sorry, there was a problem sending your enquiry. Please email us directly at engage@konsaltahub.org";
      status.classList.remove("success");
      status.classList.add("error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });
});
