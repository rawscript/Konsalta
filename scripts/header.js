document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".header-menu-toggle");
  const headerNav = document.querySelector("#primary-navigation");

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
