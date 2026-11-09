(() => {
  const siteScriptUrl = document.currentScript?.src;
  if (siteScriptUrl) {
    const logoUrl = new URL('../img/roafit-logo.png', siteScriptUrl).href;
    document.querySelectorAll('.brand, .hero-brandline').forEach((slot) => {
      const logo = document.createElement('img');
      logo.className = 'brand-image';
      logo.alt = '';
      logo.setAttribute('aria-hidden', 'true');
      logo.addEventListener('load', () => slot.classList.add('has-brand-image'), { once: true });
      logo.addEventListener('error', () => logo.remove(), { once: true });
      logo.src = logoUrl;
      slot.prepend(logo);
    });
  }

  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-site-nav]');
  const header = document.querySelector('.site-header');

  if (toggle && nav) {
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'nav-close';
    closeButton.textContent = 'Cerrar';
    closeButton.setAttribute('aria-label', 'Cerrar menú de navegación');
    nav.prepend(closeButton);

    const setMenuOpen = (isOpen, { returnFocus = false } = {}) => {
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
      nav.classList.toggle('is-open', isOpen);
      header?.classList.toggle('menu-open', isOpen);
      document.body.classList.toggle('menu-open', isOpen);
      if (returnFocus) toggle.focus();
    };

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      setMenuOpen(!isOpen);
    });

    closeButton.addEventListener('click', () => setMenuOpen(false, { returnFocus: true }));

    nav.addEventListener('click', (event) => {
      if (event.target instanceof Element && event.target.closest('a')) {
        setMenuOpen(false);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenuOpen(false, { returnFocus: true });
      }
    });

    document.addEventListener('click', (event) => {
      if (toggle.getAttribute('aria-expanded') !== 'true') return;
      if (event.target instanceof Node && !nav.contains(event.target) && !toggle.contains(event.target)) {
        setMenuOpen(false);
      }
    });

    header?.addEventListener('focusout', (event) => {
      if (event.relatedTarget instanceof Node && !header.contains(event.relatedTarget)) {
        setMenuOpen(false);
      }
    });

    window.addEventListener('resize', () => {
      if (window.matchMedia('(min-width: 54rem)').matches) setMenuOpen(false);
    });
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll('main > section, .article, .site-footer .footer-grid');
    if (revealTargets.length) {
      const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            currentObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });

      revealTargets.forEach((target) => {
        target.classList.add('reveal-on-scroll');
        observer.observe(target);
      });
      document.documentElement.classList.add('reveal-ready');
    }
  }
})();
