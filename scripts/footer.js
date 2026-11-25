/**
 * KONSALTA UNIFIED FOOTER
 * -----------------------
 * Edit `FOOTER_CONFIG` below to update footer branding, social links,
 * columns, copyright, or developer credit across every page.
 */
const FOOTER_CONFIG = {
  logoSrc: "public/Logo-4.png",
  logoAlt: "Konsalta",
  tagline: "Turning Knowledge, Into Impact.",
  social: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/konsalta-hub-africa/",
      external: true,
      svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 9h4v11H4zM6 3.500a2.200 2.200 0 1 1 0 4.400 2.200 2.200 0 0 1 0-4.400zM10 9h3.800v1.600c.600-1.100 2-1.900 3.700-1.900 3.400 0 4.500 2.200 4.500 5.400V20h-4v-5.200c0-1.400-.4-2.300-1.700-2.300-1.400 0-2.300 1-2.300 2.500V20h-4z"/></svg>`,
    },
    {
      label: "WhatsApp",
      href: "https://wa.me/?text=Hello%20Konsalta%2C%20I%20would%20like%20to%20start%20a%20conversation.",
      external: true,
      svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2a9.9 9.9 0 0 0-8.45 15.08L2 22l5.07-1.33A9.99 9.99 0 1 0 12.04 2Zm0 18.1a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.01.79.8-2.93-.19-.3A8.11 8.11 0 1 1 12.04 20.1Zm4.45-6.08c-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.47-.39-.41-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.09 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z"/></svg>`,
    },
    {
      label: "Email",
      href: "mailto:engage@konsaltahub.org",
      external: false,
      svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>`,
    },
  ],
  columns: [
    {
      heading: "Company",
      links: [
        { label: "About Konsalta", href: "aboutUs.html" },
        { label: "Why Choose us", href: "whyUs.html" },
        { label: "Contact Us", href: "contactUs.html" },
        { label: "FAQs", href: "faq.html" },
      ],
    },
    {
      heading: "Governance",
      links: [
        { label: "Ethics & Integrity", href: "governance.html#ethics" },
        { label: "Privacy Policy", href: "governance.html#privacy" },
        { label: "Terms of Engagement", href: "governance.html#terms" },
      ],
    },
  ],
  wordmark: "Konsalta",
  copyright: "© 2026 Konsalta. All rights reserved.",
  credit: "Developed by Momentum Labs CLG.",
};

document.addEventListener("DOMContentLoaded", () => {
  const footer = document.querySelector("footer.site-footer");
  if (!footer) {
    return;
  }

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const topWrap = document.createElement("div");
  topWrap.className = "wrap foot-top";

  const brand = document.createElement("div");
  brand.className = "foot-brand";

  const logo = document.createElement("img");
  logo.src = FOOTER_CONFIG.logoSrc;
  logo.alt = FOOTER_CONFIG.logoAlt;

  const tagline = document.createElement("p");
  tagline.textContent = FOOTER_CONFIG.tagline;

  const socialList = document.createElement("ul");
  socialList.className = "social";
  FOOTER_CONFIG.social.forEach(({ label, href, external, svg }) => {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("aria-label", label);
    if (external) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    link.innerHTML = svg;
    li.append(link);
    socialList.append(li);
  });

  brand.append(logo, tagline, socialList);
  topWrap.append(brand);

  FOOTER_CONFIG.columns.forEach(({ heading, links }) => {
    const nav = document.createElement("nav");
    nav.className = "foot-col";
    nav.setAttribute("aria-label", heading);

    const h4 = document.createElement("h4");
    h4.textContent = heading;
    nav.append(h4);

    links.forEach(({ label, href }) => {
      const link = document.createElement("a");
      link.href = href;
      link.textContent = label;
      nav.append(link);
    });

    topWrap.append(nav);
  });

  const wordmark = document.createElement("p");
  wordmark.className = "foot-word";
  wordmark.setAttribute("aria-hidden", "true");
  wordmark.textContent = FOOTER_CONFIG.wordmark;

  const bottomWrap = document.createElement("div");
  bottomWrap.className = "wrap foot-bottom";

  const copyrightSpan = document.createElement("span");
  copyrightSpan.textContent = FOOTER_CONFIG.copyright;

  const creditSpan = document.createElement("span");
  creditSpan.className = "foot-credit";
  creditSpan.textContent = FOOTER_CONFIG.credit;

  const toTopBtn = document.createElement("button");
  toTopBtn.className = "to-top";
  toTopBtn.type = "button";
  toTopBtn.setAttribute("aria-label", "Back to top");
  toTopBtn.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';
  toTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  bottomWrap.append(copyrightSpan, creditSpan, toTopBtn);
  footer.replaceChildren(topWrap, wordmark, bottomWrap);
});

