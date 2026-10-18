// Konsalta — Header Navigation & Responsive Menu Controller
(function () {
  function initHeaderNav() {
    const menuToggle = document.querySelector(".header-menu-toggle");
    const headerNav = document.querySelector("#primary-navigation");

    if (!menuToggle || !headerNav) return;
    if (menuToggle.dataset.navBound === "true") return;
    menuToggle.dataset.navBound = "true";

    const closeMenu = () => {
      headerNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
    };

    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = headerNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );
    });

    headerNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close when clicking outside of the header
    document.addEventListener("click", (e) => {
      if (!headerNav.contains(e.target) && !menuToggle.contains(e.target)) {
        closeMenu();
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeMenu();
      }
    });

    // Close when resizing back to desktop
    const mql = window.matchMedia("(min-width: 851px)");
    const handleMqlChange = (e) => {
      if (e.matches) closeMenu();
    };

    if (mql.addEventListener) {
      mql.addEventListener("change", handleMqlChange);
    } else if (mql.addListener) {
      mql.addListener(handleMqlChange);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeaderNav);
  } else {
    initHeaderNav();
  }
})();
