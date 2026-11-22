document.addEventListener("DOMContentLoaded", () => {
  const siteHeader = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".header-menu-toggle");
  const headerNav = document.querySelector("#primary-navigation");

  const getPageName = (pathname) =>
    pathname.split("/").filter(Boolean).pop()?.toLowerCase() || "index.html";
  const currentPage = getPageName(window.location.pathname);
  const matchesCurrentPage = (link) => {
    return (
      getPageName(new URL(link.href, window.location.href).pathname) ===
      currentPage
    );
  };

  if (headerNav) {
    const navLinks = [...headerNav.querySelectorAll("a[href]")];
    navLinks.forEach((link) => {
      link.classList.remove("active");
      link.removeAttribute("aria-current");
    });

    const currentNavLink = navLinks.find(matchesCurrentPage);
    if (currentNavLink) {
      currentNavLink.classList.add("active");
      currentNavLink.setAttribute("aria-current", "page");
    } else if (currentPage !== "index.html") {
      const currentPageIndicator = document.createElement("span");
      currentPageIndicator.className = "header-current-page";
      currentPageIndicator.setAttribute("aria-current", "page");
      currentPageIndicator.textContent =
        {
          "insights.html": "Insights",
          "faq.html": "FAQs",
          "governance.html": "Governance",
          "consultant-onboarding.html": "Join Our Network",
        }[currentPage] || document.title.split(/[|—-]/)[0].trim();
      headerNav.append(currentPageIndicator);
    }
  }

  const headerButton = siteHeader?.querySelector(".header-btn[href]");
  if (headerButton && matchesCurrentPage(headerButton)) {
    headerButton.classList.add("is-current-page");
    headerButton.setAttribute("aria-current", "page");
  }

  const homeLink = siteHeader?.querySelector(".logo[href]");
  if (homeLink && matchesCurrentPage(homeLink)) {
    homeLink.setAttribute("aria-current", "page");
  }

  if (!menuToggle || !headerNav) {
    return;
  }

  const closeMenu = () => {
    headerNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = headerNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu",
    );
  });

  headerNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window
    .matchMedia("(min-width: 851px)")
    .addEventListener("change", closeMenu);
});
