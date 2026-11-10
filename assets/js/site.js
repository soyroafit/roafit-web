(function () {
  'use strict';
  var root = document.documentElement;
  var KEY = 'roafit-tema';

  /* ---- Tema claro/oscuro (solo preferencia local, sin cookies) ---- */
  function temaActual() {
    var t = root.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro';
  }
  function aplicarMeta(t) {
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', '#000000');
  }
  function iniciarTema() {
    var botones = document.querySelectorAll('[data-theme-toggle]');
    function etiqueta(t) {
      botones.forEach(function (b) {
        b.setAttribute('aria-label', t === 'claro' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
      });
    }
    aplicarMeta(temaActual());
    etiqueta(temaActual());
    botones.forEach(function (b) {
      b.addEventListener('click', function () {
        var nuevo = temaActual() === 'claro' ? 'oscuro' : 'claro';
        root.setAttribute('data-theme', nuevo);
        try { localStorage.setItem(KEY, nuevo); } catch (e) {}
        aplicarMeta(nuevo);
        etiqueta(nuevo);
      });
    });
  }

  /* ---- Menú móvil a pantalla completa ---- */
  function iniciarMenu() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var nav = document.querySelector('[data-site-nav]');
    var header = document.querySelector('.site-header');
    if (!toggle || !nav) return;

    function abierto() { return nav.classList.contains('is-open'); }
    function abrir() {
      nav.classList.add('is-open');
      document.body.classList.add('menu-open');
      if (header) header.classList.add('menu-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Cerrar menú de navegación');
    }
    function cerrar(devolverFoco) {
      nav.classList.remove('is-open');
      document.body.classList.remove('menu-open');
      if (header) header.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menú de navegación');
      if (devolverFoco) toggle.focus();
    }
    toggle.addEventListener('click', function () { abierto() ? cerrar(false) : abrir(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && abierto()) cerrar(true);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('a')) cerrar(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 864 && abierto()) cerrar(false);
    });
  }

  /* ---- Aparición suave (respeta "reducir movimiento") ---- */
  function iniciarReveal() {
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var items = document.querySelectorAll('main > section:not(.hero), .site-footer .footer-grid');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    items.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) return; /* ya visible: no se oculta */
      el.classList.add('reveal-ready');
      io.observe(el);
    });
  }

  function iniciar() { iniciarTema(); iniciarMenu(); iniciarReveal(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
