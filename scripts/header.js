/**
 * KONSALTA UNIFIED HEADER & NAVIGATION
 * ------------------------------------
 * Edit `HEADER_NAV_CONFIG` below to add, remove, rename, or reorder
 * navigation links and the primary CTA button across every page.
 */
const HEADER_NAV_CONFIG = {
  homeHref: "index.html",
  homeCueLabel: "Home",
  links: [
    { href: "index.html", words: ["Home"], className: "mobile-nav-home" },
    { href: "aboutUs.html", words: ["About", "Konsalta"] },
    { href: "services.html", words: ["Our", "Services"] },
    { href: "whyUs.html", words: ["Why", "Konsalta"] },
    { href: "insights.html", words: ["Our", "Insights"] },
    { href: "contactUs.html", words: ["Contact", "Us"] },
  ],
  cta: {
    href: "consultant-onboarding.html",
    label: "Apply to join Our Network",
    mobileWords: ["Apply to join", "Our Network"],
  },
  extraPageTitles: {
    "faq.html": "FAQs",
    "governance.html": "Governance",
  },
};

document.addEventListener("DOMContentLoaded", () => {
  const siteHeader = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".header-menu-toggle");
  const headerNav = document.querySelector("#primary-navigation");

  const getPageName = (pathname) =>
    pathname.split("/").filter(Boolean).pop()?.toLowerCase() || "index.html";
  const currentPage = getPageName(window.location.pathname);
  const matchesCurrentPage = (href) =>
    getPageName(new URL(href, window.location.href).pathname) === currentPage;

  const createWordLink = (href, words, extraClass = "") => {
    const link = document.createElement("a");
    link.href = href;
    if (extraClass) {
      link.className = extraClass;
    }
    words.forEach((word, index) => {
      if (index > 0) {
        link.append(document.createTextNode(" "));
      }
      const span = document.createElement("span");
      span.textContent = word;
      link.append(span);
    });
    return link;
  };

  if (siteHeader) {
    const syncStickyState = () => {
      siteHeader.classList.toggle("is-stuck", window.scrollY > 8);
    };
    window.addEventListener("scroll", syncStickyState, { passive: true });
    syncStickyState();
  }

  const homeLink = siteHeader?.querySelector(".logo[href]");
  if (homeLink) {
    homeLink.href = HEADER_NAV_CONFIG.homeHref;
    homeLink.setAttribute("aria-label", "Konsalta — Go to Home");
    homeLink.title = "Go to Home";

    if (!homeLink.querySelector(".logo-home-cue")) {
      const cue = document.createElement("span");
      cue.className = "logo-home-cue";
      cue.setAttribute("aria-hidden", "true");
      cue.innerHTML = `<svg viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20h5v-6h4v6h5V9.5"/></svg><span class="logo-home-text">${HEADER_NAV_CONFIG.homeCueLabel}</span>`;
      homeLink.append(cue);
    }

    const isHome = matchesCurrentPage(homeLink.href);
    homeLink.classList.toggle("is-current-page", isHome);
    if (isHome) {
      homeLink.setAttribute("aria-current", "page");
    } else {
      homeLink.removeAttribute("aria-current");
    }
  }

  if (headerNav) {
    headerNav.setAttribute("aria-label", "Primary");
    const fragment = document.createDocumentFragment();

    HEADER_NAV_CONFIG.links.forEach(({ href, words, className = "" }) => {
      fragment.append(createWordLink(href, words, className));
    });

    fragment.append(
      createWordLink(
        HEADER_NAV_CONFIG.cta.href,
        HEADER_NAV_CONFIG.cta.mobileWords,
        "mobile-nav-contact",
      ),
    );

    headerNav.replaceChildren(fragment);

    const navLinks = [...headerNav.querySelectorAll("a[href]")];
    const mainNavLinks = navLinks.filter(
      (link) => !link.classList.contains("mobile-nav-contact"),
    );

    navLinks.forEach((link) => {
      if (matchesCurrentPage(link.href)) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });

    const matchedMainNav = mainNavLinks.some((link) =>
      matchesCurrentPage(link.href),
    );
    const isCtaPage = matchesCurrentPage(HEADER_NAV_CONFIG.cta.href);

    if (!matchedMainNav && !isCtaPage) {
      const currentPageIndicator = document.createElement("span");
      currentPageIndicator.className = "header-current-page";
      currentPageIndicator.setAttribute("aria-current", "page");
      currentPageIndicator.textContent =
        HEADER_NAV_CONFIG.extraPageTitles[currentPage] ||
        document.title.split(/[|—-]/)[0].trim();
      headerNav.append(currentPageIndicator);
    }
  }

  const headerButton = siteHeader?.querySelector(".header-btn[href]");
  if (headerButton) {
    headerButton.href = HEADER_NAV_CONFIG.cta.href;
    headerButton.textContent = HEADER_NAV_CONFIG.cta.label;

    if (matchesCurrentPage(headerButton.href)) {
      headerButton.classList.add("is-current-page");
      headerButton.setAttribute("aria-current", "page");
    } else {
      headerButton.classList.remove("is-current-page");
      headerButton.removeAttribute("aria-current");
    }
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
