/* Página de links — efeito magnético suave nos botões.
   Baseado no "Magnetic Hover Button": o botão é levemente atraído pelo cursor
   quando ele chega perto, e o preenchimento azul varre a partir do ponto de entrada.
   Só roda com mouse e sem "reduzir movimento"; no celular o CSS cuida do toque. */
/* --- Mensagem pré-preenchida do WhatsApp acompanha o idioma escolhido (PT/EN/ES) --- */
(function () {
  'use strict';

  var MSG = {
    agendar: {
      pt: 'Olá! Vim pelo site e gostaria de agendar um horário.',
      en: 'Hello! I found you through your website and would like to book an appointment.',
      es: '¡Hola! Vine por el sitio web y me gustaría agendar una cita.'
    },
    cursos: {
      pt: 'Olá! Gostaria de informações sobre os cursos do Fernando Sanchez.',
      en: "Hello! I'd like information about Fernando Sanchez's courses.",
      es: '¡Hola! Me gustaría recibir información sobre los cursos de Fernando Sanchez.'
    }
  };

  function currentLang() {
    var m = document.cookie.match('(^|;) ?googtrans=([^;]*)(;|$)');
    var l = m && m[2].split('/')[2];
    return (l && /^(en|es)$/.test(l)) ? l : 'pt';
  }

  function apply(lang) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-wa]'), function (a) {
      var text = MSG[a.getAttribute('data-wa')];
      if (text) a.href = 'https://wa.me/14076868511?text=' + encodeURIComponent(text[lang] || text.pt);
    });
  }

  apply(currentLang());
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('a[data-gt-lang]');
    if (t) apply(t.getAttribute('data-gt-lang'));
  });
})();

/* --- Efeito magnético --- */
(function () {
  'use strict';

  var fine = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || calm) return;

  var REACH = 90;      // distância (px) a partir da borda em que o botão começa a sentir o cursor
  var PULL = 0.16;     // fração da distância até o cursor (quanto menor, mais sutil)
  var MAX_X = 12;      // deslocamento máximo (px)
  var MAX_Y = 7;
  var EASE = 0.16;     // suavização por quadro

  var btns = Array.prototype.map.call(document.querySelectorAll('.lk-btn'), function (el) {
    return { el: el, x: 0, y: 0, tx: 0, ty: 0, hover: false };
  });
  if (!btns.length) return;

  var pointer = null;  // {x, y} última posição do cursor
  var raf = 0;

  function clamp(v, m) { return Math.max(-m, Math.min(m, v)); }

  function sweepOrigin(b, rect) {
    var lx = Math.max(0, Math.min(rect.width, pointer.x - rect.left));
    var ly = Math.max(0, Math.min(rect.height, pointer.y - rect.top));
    b.el.style.setProperty('--sx', lx + 'px');
    b.el.style.setProperty('--sy', ly + 'px');
    b.el.style.setProperty('--d', (2 * Math.hypot(rect.width, rect.height)) + 'px');
  }

  function update() {
    raf = 0;
    var moving = false;

    btns.forEach(function (b) {
      if (pointer) {
        var r = b.el.getBoundingClientRect();
        // centro "de repouso" (descontando o deslocamento atual)
        var cx = r.left + r.width / 2 - b.x;
        var cy = r.top + r.height / 2 - b.y;
        var dx = pointer.x - cx;
        var dy = pointer.y - cy;

        var inside = pointer.x >= r.left && pointer.x <= r.right &&
                     pointer.y >= r.top && pointer.y <= r.bottom;
        if (inside !== b.hover) {
          sweepOrigin(b, r);
          b.hover = inside;
          b.el.classList.toggle('is-hover', inside);
        }

        var gap = Math.hypot(
          Math.max(0, Math.abs(dx) - r.width / 2),
          Math.max(0, Math.abs(dy) - r.height / 2)
        );
        if (gap > REACH) {
          b.tx = 0; b.ty = 0;
        } else {
          var f = 1 - gap / REACH;
          b.tx = clamp(dx * PULL * f, MAX_X);
          b.ty = clamp(dy * PULL * f, MAX_Y);
        }
      } else {
        b.tx = 0; b.ty = 0;
      }

      b.x += (b.tx - b.x) * EASE;
      b.y += (b.ty - b.y) * EASE;
      if (Math.abs(b.tx - b.x) < 0.05 && Math.abs(b.ty - b.y) < 0.05) {
        b.x = b.tx; b.y = b.ty;
      } else {
        moving = true;
      }
      b.el.style.setProperty('--mx', b.x.toFixed(2) + 'px');
      b.el.style.setProperty('--my', b.y.toFixed(2) + 'px');
    });

    if (moving) schedule();
  }

  function schedule() { if (!raf) raf = requestAnimationFrame(update); }

  window.addEventListener('pointermove', function (e) {
    if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    pointer = { x: e.clientX, y: e.clientY };
    schedule();
  }, { passive: true });

  // a página rolou: as posições mudaram mesmo com o mouse parado
  window.addEventListener('scroll', function () { if (pointer) schedule(); }, { passive: true });

  function release() {
    pointer = null;
    btns.forEach(function (b) {
      if (b.hover) { b.hover = false; b.el.classList.remove('is-hover'); }
    });
    schedule();
  }
  document.addEventListener('pointerleave', release);
  window.addEventListener('blur', release);
})();
