(function () {
  'use strict';
  var root = document.documentElement;
  var KEY = 'roafit-tema';

  /* ---- Tema claro/oscuro (solo preferencia local, sin cookies) ---- */
  function temaActual() {
    var t = root.getAttribute('data-theme');
    if (t) return t;
    return 'oscuro'; /* oscuro por defecto, igual que la portada */
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

  /* ---- Botón flotante de contacto ----
     WHATSAPP: escribe tu número con prefijo de país, sin espacios ni «+»
     (ejemplo: '34600111222'). Mientras esté vacío, el botón lleva a Contacto.
     El mismo dato está también en index.html. */
  var WHATSAPP = '';
  var WHATSAPP_MENSAJE = 'Hola Luis, vengo de roafit.com y quiero información.';
  function iniciarBoton() {
    var enlace = document.querySelector('.site-nav a[href$="contacto.html"]');
    var ruta = location.pathname;
    if (!enlace || /\/herramientas\//.test(ruta)) return;          /* las herramientas ya tienen «Enviar a mi coach» */
    if (!WHATSAPP && /contacto\.html$/.test(ruta)) return;          /* ya estás en Contacto */
    var caja = document.createElement('div');
    caja.className = 'fab';
    var a = document.createElement('a');
    var icono = WHATSAPP
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.9.9-1.1 2.2-.5 3.5a11 11 0 0 0 4.3 4.3c1.6.7 2.2.7 3 .6.5-.1 1.5-.6 1.700-1.200.2-.6.2-1.100.1-1.200z"/></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H9l-5 4V5a1 1 0 0 1 1-1z"/></svg>';
    a.innerHTML = icono + '<span>' + (WHATSAPP ? 'WhatsApp' : 'Escríbeme') + '</span>';
    if (WHATSAPP) { a.href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(WHATSAPP_MENSAJE); a.target = '_blank'; a.rel = 'noopener'; }
    else { a.href = enlace.href; }
    caja.appendChild(a);
    document.body.appendChild(caja);
    var quieto = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var raton = window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)').matches;
    if (quieto || !raton) return;
    window.addEventListener('pointermove', function (e) {     /* sigue un poco al cursor al acercarse */
      var r = caja.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      a.style.transform = Math.sqrt(dx * dx + dy * dy) < 150 ? 'translate(' + (dx * .3).toFixed(1) + 'px,' + (dy * .3).toFixed(1) + 'px)' : '';
    }, { passive: true });
  }

  function iniciar() { iniciarTema(); iniciarMenu(); iniciarReveal(); iniciarBoton(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
