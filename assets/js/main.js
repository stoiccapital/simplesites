// SimpleSites minimal JS
// - Load navbar partial
// - Mobile nav toggle
// - FAQ accordion
// - Smooth scroll

(function () {
  function qs(selector, scope) { return (scope || document).querySelector(selector); }
  function qsa(selector, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(selector)); }

  function initNav() {
    var toggle = qs('.nav-toggle');
    var nav = qs('#site-nav');
    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        var isOpen = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(isOpen));
      });
      qsa('a', nav).forEach(function (link) {
        link.addEventListener('click', function () {
          if (nav.classList.contains('open')) {
            nav.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
          }
        });
      });
    }
    // Highlight current page in nav
    var path = location.pathname.replace(/\/index\.html$/, '/');
    qsa('#site-nav a').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      var linkPath;
      if (href.startsWith('http')) {
        try { linkPath = new URL(href).pathname; } catch (e) { linkPath = href; }
      } else {
        linkPath = href;
      }
      if (linkPath === path) {
        a.setAttribute('aria-current', 'page');
      } else {
        a.removeAttribute('aria-current');
      }
    });
  }

  function initFAQ() {
    qsa('.faq-question').forEach(function (btn) {
      var answerId = btn.getAttribute('aria-controls');
      var answer = answerId ? document.getElementById(answerId) : null;
      if (!answer) return;
      btn.addEventListener('click', function () {
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
        answer.hidden = expanded;
      });
    });
  }

  function initSmooth() {
    qsa('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var targetId = link.getAttribute('href').slice(1);
        var target = document.getElementById(targetId);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function includeNavbarAndInit() {
    var host = qs('[data-include]');
    if (!host) {
      initNav(); initFAQ(); initSmooth();
      return;
    }
    var src = host.getAttribute('data-include');
    if (!src) { initNav(); initFAQ(); initSmooth(); return; }
    fetch(src, { cache: 'no-cache' })
      .then(function (r) { return r.text(); })
      .then(function (html) { host.innerHTML = html; })
      .catch(function () { /* ignore */ })
      .finally(function () {
        initNav(); initFAQ(); initSmooth();
      });
  }

  includeNavbarAndInit();
})();


