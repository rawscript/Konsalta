(() => {
  const storageKey = "konsalta-theme";
  let theme = "light";

  try {
    const savedTheme = window.localStorage.getItem(storageKey);
    if (savedTheme === "light" || savedTheme === "dark") {
      theme = savedTheme;
    }
  } catch (error) {
    console.warn("Unable to read the saved theme preference.", error);
  }

  document.documentElement.dataset.theme = theme;

  const initializeThemeToggle = () => {
    const isMobile = window.matchMedia("(max-width: 850px)");
    const updateLogo = () => {
      const picture = document.querySelector(".site-header .logo picture");
      const image = picture?.querySelector("img");
      const mobileSource = picture?.querySelector("source");

      if (!image) {
        return;
      }

      const isDark = theme === "dark";
      image.src = `public/Logo-${isDark ? "4" : "3"}.png`;

      if (mobileSource) {
        mobileSource.srcset = `public/Logo-${isDark ? "6" : "5"}.png`;
      }
    };

    const toggle = document.createElement("button");
    toggle.className = "theme-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-pressed", String(theme === "dark"));
    toggle.innerHTML = `
      <svg class="theme-toggle-moon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8 8.5 8.5 0 1 0 20.2 15.1Z" />
      </svg>
      <svg class="theme-toggle-sun" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
      </svg>
      <span class="theme-toggle-label"></span>
    `;

    const updateToggle = () => {
      const isDark = theme === "dark";
      toggle.setAttribute("aria-pressed", String(isDark));
      toggle.setAttribute(
        "aria-label",
        `Switch to ${isDark ? "light" : "dark"} mode`,
      );
      toggle.title = `Switch to ${isDark ? "light" : "dark"} mode`;
      toggle.querySelector(".theme-toggle-label").textContent = isDark
        ? "light"
        : "dark";
      toggle.classList.toggle("is-dark", isDark);
      updateLogo();
    };

    toggle.addEventListener("click", () => {
      theme = theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = theme;
      updateToggle();
      isMobile.addEventListener("change", updateLogo);

      try {
        window.localStorage.setItem(storageKey, theme);
      } catch (error) {
        console.warn("Unable to save the theme preference.", error);
      }
    });

    updateToggle();

    const siteHeader = document.querySelector(".site-header");
    const headerButton = siteHeader?.querySelector(".header-btn");

    if (siteHeader && headerButton) {
      const actions = document.createElement("div");
      actions.className = "site-header-actions";
      siteHeader.insertBefore(actions, headerButton);
      actions.append(toggle, headerButton);
    } else if (siteHeader) {
      siteHeader.append(toggle);
    } else {
      toggle.classList.add("theme-toggle-floating");
      document.body.append(toggle);
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeThemeToggle, {
      once: true,
    });
  } else {
    initializeThemeToggle();
  }
})();
