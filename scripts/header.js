/**
 * header.js — Mobile navigation toggle
 * Handles the hamburger menu open/close behaviour across all pages.
 */
(function () {
  const toggle = document.querySelector(".header-menu-toggle");
  const nav = document.getElementById("primary-navigation");

  if (!toggle || !nav) return;

  // Close nav when clicking outside of it
  document.addEventListener("click", function (e) {
    if (
      nav.classList.contains("nav-open") &&
      !nav.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      closeNav();
    }
  });

  // Close nav on Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("nav-open")) {
      closeNav();
      toggle.focus();
    }
  });

  toggle.addEventListener("click", function () {
    const isOpen = nav.classList.contains("nav-open");
    isOpen ? closeNav() : openNav();
  });

  // Close nav when a link inside it is clicked (single-page navigation)
  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeNav);
  });

  function openNav() {
    nav.classList.add("nav-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close navigation menu");
  }

  function closeNav() {
    nav.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation menu");
  }
})();
