document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("consultantForm");
  const progressBar = document.querySelector(".progress-fill");
  const progressValue = document.querySelector(".progress-value");
  const progressContainer = document.querySelector(".progress-container");

  if (!form) {
    return;
  }

  // Section toggle functionality
  const sectionHeaders = document.querySelectorAll(".section-header");
  sectionHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const section = header.closest(".form-section");
      const content = section.querySelector(".section-content");
      const isExpanded = header.getAttribute("aria-expanded") === "true";

      header.setAttribute("aria-expanded", !isExpanded);
      
      if (!isExpanded) {
        content.classList.add("expanded");
      } else {
        content.classList.remove("expanded");
      }
    });
  });

  // Expand first section by default
  const firstSection = document.querySelector(".form-section");
  if (firstSection) {
    const firstContent = firstSection.querySelector(".section-content");
    const firstHeader = firstSection.querySelector(".section-header");
    if (firstContent && firstHeader) {
      firstContent.classList.add("expanded");
      firstHeader.setAttribute("aria-expanded", "true");
    }
  }

  // Character count for bio
  const bioField = document.getElementById("bio");
  const bioCount = document.getElementById("bioCount");
  if (bioField && bioCount) {
    bioField.addEventListener("input", () => {
      bioCount.textContent = bioField.value.length;
    });
  }

  // Progress tracking
  const updateProgress = () => {
    const allInputs = form.querySelectorAll(
      "input:required, select:required, textarea:required"
    );
    
    // For expertise section, just check if ANY checkbox is selected
    const expertiseSection = form.querySelector('[data-section="expertise"]');
    const hasExpertiseSelected = expertiseSection && (
      expertiseSection.querySelectorAll('input[name="expertise"]:checked').length > 0 ||
      expertiseSection.querySelectorAll('input[name="skills"]:checked').length > 0
    );
    
    const filledInputs = Array.from(allInputs).filter((input) => {
      if (input.type === "checkbox" || input.type === "radio") {
        const name = input.name;
        return form.querySelector(`[name="${name}"]:checked`) !== null;
      }
      return input.value.trim() !== "";
    });

    // Add virtual "filled" for expertise section if any checkbox is selected
    let adjustedFilled = filledInputs.length;
    let adjustedTotal = allInputs.length;
    
    // If expertise section has selections but no required fields, count it as filled
    if (hasExpertiseSelected) {
      // This ensures the progress bar reflects the expertise section completion
      const expertiseRequired = expertiseSection.querySelectorAll('input:required, select:required, textarea:required').length;
      if (expertiseRequired === 0) {
        adjustedFilled += 1;
        adjustedTotal += 1;
      }
    }

    const progress = Math.round((adjustedFilled / adjustedTotal) * 100);
    progressBar.style.width = `${progress}%`;
    progressValue.textContent = `${progress}%`;
    progressContainer.setAttribute("aria-valuenow", progress);

    // Update section statuses
    updateSectionStatuses();
  };

  // Update section status indicators
  const updateSectionStatuses = () => {
    const sections = form.querySelectorAll(".form-section");
    
    sections.forEach((section) => {
      const statusIndicator = section.querySelector(".section-status");
      const sectionName = section.getAttribute("data-section");
      
      // Special handling for expertise section (section 3)
      if (sectionName === "expertise") {
        const expertiseChecked = section.querySelectorAll('input[name="expertise"]:checked').length > 0;
        const skillsChecked = section.querySelectorAll('input[name="skills"]:checked').length > 0;
        
        // If at least one checkbox is checked in either group, mark as complete
        statusIndicator.classList.remove("complete", "incomplete");
        if (expertiseChecked || skillsChecked) {
          statusIndicator.classList.add("complete");
        }
        return;
      }
      
      // Standard handling for other sections
      const requiredInputs = section.querySelectorAll(
        "input:required, select:required, textarea:required"
      );
      
      if (requiredInputs.length === 0) return;
      
      const filledInputs = Array.from(requiredInputs).filter((input) => {
        if (input.type === "checkbox" || input.type === "radio") {
          const name = input.name;
          return section.querySelector(`[name="${name}"]:checked`) !== null;
        }
        return input.value.trim() !== "";
      });
      
      const isComplete = filledInputs.length === requiredInputs.length;
      const hasAnyFilled = filledInputs.length > 0;
      
      statusIndicator.classList.remove("complete", "incomplete");
      
      if (isComplete) {
        statusIndicator.classList.add("complete");
      } else if (hasAnyFilled) {
        statusIndicator.classList.add("incomplete");
      }
    });
  };

  // Update progress on input
  form.addEventListener("input", updateProgress);
  form.addEventListener("change", updateProgress);

  // Initial progress calculation
  updateProgress();

  // Form submission
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      const invalidField = form.querySelector(":invalid");
      const invalidSection = invalidField?.closest(".form-section");
      if (invalidSection) {
        invalidSection.querySelector(".section-content").classList.add("expanded");
        invalidSection
          .querySelector(".section-header")
          .setAttribute("aria-expanded", "true");
        window.setTimeout(() => {
          invalidField.focus();
          form.reportValidity();
        }, 400);
      } else {
        form.reportValidity();
      }
      return;
    }

    const formData = new FormData(form);
    const name = (formData.get("fullName") || "").toString().trim();

    const submitBtn = form.querySelector('button[type="submit"]');
    const submitLabel = submitBtn.querySelector("span");
    const originalBtnText = submitLabel.textContent;
    submitBtn.disabled = true;
    submitLabel.textContent = "Submitting...";

    try {
      const response = await fetch("/api/consultant-onboarding", {
        method: 'POST',
        body: formData
      });
      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.error || "Your application could not be submitted. Please try again.",
        );
      }
      showSuccessMessage(name);
    } catch (error) {
      console.error("Consultant application submission failed:", error);
      showErrorMessage(
        error instanceof Error
          ? error.message
          : "Your application could not be submitted. Please try again or email engage@konsaltahub.org.",
      );
    } finally {
      submitBtn.disabled = false;
      submitLabel.textContent = originalBtnText;
    }
  });

  // Success message display
  function showSuccessMessage(name) {
    // Play success sound if supported
    try {
      const successSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZizcIHm/F8t9+M' +
        'AIZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZizcIHm/F8t9+MwIZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZizcIHm/F8t9+M');
      successSound.volume = 0.3;
      successSound.play().catch(() => {}); // Silently fail if audio not supported
    } catch (e) {
      // Audio not supported or blocked
    }

    // Create success overlay
    const overlay = document.createElement("div");
    overlay.className = "success-overlay";
    overlay.innerHTML = `
      <div class="success-card">
        <div class="success-checkmark">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 49L39 73L85 27" />
          </svg>
        </div>
        <h2>Welcome to Konsalta!</h2>
        <p class="success-greeting"></p>
        <p class="success-subtext">Your application has been received and our team will review it shortly. We'll be in touch soon!</p>
        <button class="success-btn" onclick="this.closest('.success-overlay').remove()">Close</button>
      </div>
    `;
    overlay.querySelector(".success-greeting").textContent =
      `Thank you${name ? `, ${name}` : ""} for your interest in joining our expert network.`;

    document.body.appendChild(overlay);

    // Animate in
    if (window.gsap && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.gsap.timeline()
        .set(overlay, { opacity: 0 })
        .set(".success-card", { scale: 0.8, y: 30 })
        .set(".success-checkmark", { scale: 0.5, opacity: 0 })
        .to(overlay, { opacity: 1, duration: 0.3 })
        .to(".success-card", { scale: 1, y: 0, duration: 0.5, ease: "back.out(1.5)" }, "-=0.2")
        .to(".success-checkmark", { 
          scale: 1.15, 
          opacity: 1, 
          duration: 0.4, 
          ease: "back.out(2)" 
        }, "-=0.3")
        .to(".success-checkmark", { scale: 1, duration: 0.2 }, "-=0.1");
    } else {
      overlay.style.opacity = "1";
    }

    // Reset form
    form.reset();
    updateProgress();
  }

  function showErrorMessage(message) {
    const overlay = document.createElement("div");
    overlay.className = "success-overlay error-overlay";
    overlay.innerHTML = `
      <div class="success-card error-card">
        <div class="error-icon">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" stroke="currentColor" stroke-width="6" fill="none"/>
            <path d="M35 35L65 65M65 35L35 65" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
          </svg>
        </div>
        <h2>Something went wrong</h2>
        <p class="error-message"></p>
        <p class="success-subtext">Please try again or contact us directly at engage@konsaltahub.org</p>
        <button class="success-btn" onclick="this.closest('.success-overlay').remove()">Close</button>
      </div>
    `;
    overlay.querySelector(".error-message").textContent = message;

    document.body.appendChild(overlay);

    if (window.gsap && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.gsap.timeline()
        .set(overlay, { opacity: 0 })
        .set(".success-card", { scale: 0.8, y: 30 })
        .to(overlay, { opacity: 1, duration: 0.3 })
        .to(".success-card", { scale: 1, y: 0, duration: 0.5, ease: "back.out(1.5)" }, "-=0.2");
    } else {
      overlay.style.opacity = "1";
    }
  }

  // GSAP entrance animations
  if (window.gsap && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.gsap.timeline({ defaults: { ease: "power3.out" } })
      .from(".back-link", { opacity: 0, x: -12, duration: 0.45 })
      .from(".intro .eyebrow, .intro h1, .intro > p", 
        { opacity: 0, y: 18, duration: 0.6, stagger: 0.1 }, "-=0.25")
      .from(".progress-container", 
        { opacity: 0, y: -20, duration: 0.5 }, "-=0.3")
      .from(".form-section", 
        { opacity: 0, y: 20, duration: 0.5, stagger: 0.1 }, "-=0.2");
  }
});