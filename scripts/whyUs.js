gsap.registerPlugin(ScrollTrigger);

// ============================================================
// INITIAL STATES
// ============================================================
gsap.set('#nav', { opacity: 0, y: -20 });
gsap.set('.why-headline .wh-line', { opacity: 0, y: 40 });
gsap.set('.why-sub', { opacity: 0, y: 20 });
gsap.set('.why-cta', { opacity: 0, y: 16 });
gsap.set('.why-hero-badge', { opacity: 0, scale: 0.8 });

// ============================================================
// INTRO TIMELINE
// ============================================================
const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
intro
  .to('#nav', { opacity: 1, y: 0, duration: 0.8 }, 0.1)
  .to('.why-headline .wh-line', { opacity: 1, y: 0, duration: 0.9, stagger: 0.15 }, 0.3)
  .to('.why-sub', { opacity: 1, y: 0, duration: 0.8 }, 0.7)
  .to('.why-cta', { opacity: 1, y: 0, duration: 0.7 }, 0.9)
  .to('.why-hero-badge', { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.4)' }, 0.6);

// ============================================================
// MOBILE MENU TOGGLE (copy from aboutUS.js)
// ============================================================
const mobileMenuToggle = document.querySelector('.nav-menu-toggle');
const primaryNavigation = document.querySelector('#primary-navigation');
if (mobileMenuToggle && primaryNavigation) {
  const closeMobileMenu = () => {
    primaryNavigation.classList.remove('is-open');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    mobileMenuToggle.setAttribute('aria-label', 'Open navigation menu');
  };
  mobileMenuToggle.addEventListener('click', () => {
    const isOpen = primaryNavigation.classList.toggle('is-open');
    mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
    mobileMenuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  });
  primaryNavigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobileMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileMenu(); });
  window.matchMedia('(min-width: 751px)').addEventListener('change', closeMobileMenu);
}

// ============================================================
// DIFF CARDS SCROLL REVEAL
// ============================================================
gsap.utils.toArray('.diff-card').forEach((card, i) => {
  gsap.fromTo(card,
    { opacity: 0, y: 50, scale: 0.97 },
    {
      opacity: 1, y: 0, scale: 1,
      duration: 0.9,
      delay: i * 0.07,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        once: true
      }
    }
  );
});

// ============================================================
// DIFF SECTION HEADER REVEAL
// ============================================================
gsap.from('.diff-header', {
  opacity: 0, y: 30, duration: 0.9, ease: 'power3.out',
  scrollTrigger: { trigger: '.diff-section', start: 'top 80%', once: true }
});

// ============================================================
// TRUST CARDS REVEAL
// ============================================================
gsap.utils.toArray('.trust-card').forEach((card, i) => {
  gsap.fromTo(card,
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0,
      duration: 0.85,
      delay: i * 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.trust-grid', start: 'top 82%', once: true }
    }
  );
});

// ============================================================
// STATS REVEAL + COUNTERS
// ============================================================
gsap.to('.stats-inner', {
  opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
  scrollTrigger: { trigger: '.stats', start: 'top 80%' }
});
gsap.from('.stats-inner', {
  y: 60, scale: 0.97, duration: 1.2, ease: 'power3.out',
  scrollTrigger: { trigger: '.stats', start: 'top 80%' }
});

ScrollTrigger.create({
  trigger: '.stats',
  start: 'top 75%',
  onEnter: () => {
    document.querySelectorAll('.stat-block .num').forEach(el => {
      const target = parseFloat(el.dataset.count);
      const span = el.querySelector('span');
      gsap.to({ v: 0 }, {
        v: target,
        duration: 2,
        ease: 'power2.out',
        onUpdate: function () {
          span.textContent = Math.floor(this.targets()[0].v).toString();
        }
      });
    });
  },
  once: true
});

// ============================================================
// FINAL CTA REVEAL
// ============================================================
gsap.fromTo('.final-cta-why .final-cta-card',
  { opacity: 0, y: 40, scale: 0.98 },
  {
    opacity: 1, y: 0, scale: 1,
    duration: 1.1, ease: 'power3.out',
    scrollTrigger: { trigger: '.final-cta-why', start: 'top 80%', once: true }
  }
);

// ============================================================
// RESPECT REDUCED MOTION PREFERENCES
// ============================================================
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Disable all GSAP animations
  gsap.globalTimeline.pause();
  
  // Set all animated elements to their final states
  gsap.set(['#nav', '.why-headline .wh-line', '.why-sub', '.why-cta', '.why-hero-badge'], {
    opacity: 1,
    y: 0,
    scale: 1
  });
  
  // Show all cards immediately
  gsap.set(['.diff-card', '.trust-card', '.final-cta-why .final-cta-card'], {
    opacity: 1,
    y: 0,
    scale: 1
  });
  
  // Set stats numbers to final values
  document.querySelectorAll('.stat-block .num').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const span = el.querySelector('span');
    if (span) span.textContent = target.toString();
  });
}