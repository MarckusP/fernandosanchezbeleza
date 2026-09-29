/* Fernando Sanchez Beleza — scripts próprios do site estático.
   Anima as seções novas (fsb-*) do mesmo jeito que o Elementor anima as demais:
   elementos com .elementor-invisible + data-settings {"_animation": "..."} aparecem ao entrar na tela. */
(function () {
  var sel = '.fsb-section .elementor-invisible, [class*="fsb-"] .elementor-invisible, .elementor-invisible[class*="fsb-"]';
  function show(el) {
    var name = 'fadeInUp';
    try { var s = JSON.parse(el.getAttribute('data-settings') || '{}'); name = s._animation || s.animation || name; } catch (e) {}
    el.classList.remove('elementor-invisible');
    el.classList.add('animated', name);
  }
  function init() {
    var els = document.querySelectorAll(sel);
    if (!('IntersectionObserver' in window)) { els.forEach(show); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

/* Efeitos "luz de salão" nas seções fsb-* (ver brand.css). Só rodam se o movimento for permitido. */
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.classList.add('fsb-fx');

  function init() {
    // etiquetas do visagismo: índice para o atraso em cascata
    document.querySelectorAll('.fsb-visagismo .fsb-chip').forEach(function (c, i) { c.style.setProperty('--i', i); });

    // a seção "acende" uma vez quando entra na tela
    var lit = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('fsb-lit'); lit.unobserve(e.target); } });
    }, { threshold: 0.25 });
    document.querySelectorAll('.fsb-essencia, .fsb-visagismo, .fsb-lumiess').forEach(function (s) { lit.observe(s); });

    // Essência: foco de luz segue o mouse (desktop) ou a rolagem (toque), com suavização
    var sec = document.querySelector('.fsb-essencia');
    if (!sec) return;
    var fine = matchMedia('(pointer: fine)').matches;
    var tx = 50, ty = 32, x = tx, y = ty, running = false, visible = false;
    function frame() {
      x += (tx - x) * 0.08; y += (ty - y) * 0.08;
      sec.style.setProperty('--fx-x', x.toFixed(2) + '%');
      sec.style.setProperty('--fx-y', y.toFixed(2) + '%');
      if (visible && (Math.abs(tx - x) > 0.05 || Math.abs(ty - y) > 0.05)) requestAnimationFrame(frame); else running = false;
    }
    function kick() { if (!running && visible) { running = true; requestAnimationFrame(frame); } }
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; kick(); }).observe(sec);
    if (fine) {
      sec.addEventListener('pointermove', function (e) {
        var r = sec.getBoundingClientRect();
        tx = (e.clientX - r.left) / r.width * 100; ty = (e.clientY - r.top) / r.height * 100; kick();
      });
      sec.addEventListener('pointerleave', function () { tx = 50; ty = 32; kick(); });
    } else {
      window.addEventListener('scroll', function () {
        if (!visible) return;
        var r = sec.getBoundingClientRect(), p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)));
        ty = 10 + p * 80; tx = 50 + Math.sin(p * Math.PI * 2) * 22; kick();
      }, { passive: true });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
