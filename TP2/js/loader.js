(function () {
  // ------------------ Referencias ------------------
  function $(id) { return document.getElementById(id); }

  var percentEl   = $('percent');        // número 0–100
  var percentWrap = $('percentWrap');    // contenedor del porcentaje
  var logoWrap    = $('logoWrap');       // envoltorio del logo (se mueve y hace "bonk")
  var logoImg     = $('logoImg');        // imagen del logo (visible)
  var logoDark    = $('logoDark');       // capa oscura que se recorta (revela logo)
  var word        = $('word');           // palabra "Uiverse"
  var stage       = $('loaderStage');    // contenedor que sale al final
  var overlay     = $('loaderOverlay');  // overlay entero
  var brandRow    = document.querySelector('#loaderOverlay .brandRow');

  // ------------------ Constantes ------------------
  var gapFromCss = parseFloat(getComputedStyle(overlay).getPropertyValue('--gap'));
  var GAP = isNaN(gapFromCss) ? 24 : gapFromCss;

  var STEP_MS       = 50;   // 1% cada 50ms  => ~5s
  var EXIT_DELAY_MS = 300;  // espera antes de la salida
  var T1 = 350;             // 1er movimiento de palabra
  var T2 = 360;             // pausa entre movs
  var T3 = 680;             // espera para "bonk"

  // ------------------ Máscara del logo ------------------
  var logoURL = logoImg.getAttribute('src');
  var maskValue = 'url(' + logoURL + ')';
  logoDark.style.setProperty('--mask-url', maskValue);
  logoDark.style.webkitMaskImage = maskValue;
  logoDark.style.maskImage = maskValue;

  // ------------------ Progreso y revelado ------------------
  var p = 0; // 0..100

  function renderProgress() {
    // número visible
    percentEl.textContent = p;

    // revelado del logo (clip-path controla --left/--right; --right queda en 0% por CSS)
    logoDark.style.setProperty('--left', p + '%');
  }

  // ------------------ Secuencia final (cuando p = 100) ------------------
  function completeSequence() {
    // 1) Fade del porcentaje
    percentWrap.classList.add('fade-out');

    // 2) Medimos ancho de la palabra y calculamos posiciones/escala
    word.style.opacity = '0';
    word.style.visibility = 'hidden';
    var w = word.offsetWidth || 0;
    word.style.visibility = '';

    var vw    = Math.max(window.innerWidth, 320);
    var logoW = logoWrap.offsetWidth || 0;
    var total = logoW + GAP + w;

    // Escala de seguridad para que entre
    var margen = 24;
    var s = (vw - margen) / total;
    if (s > 1) s = 1;
    if (s < 0) s = 0;
    if (brandRow) {
      brandRow.style.setProperty('--s', String(s));
    }

    var shift = (w + GAP) / 2; // separación final a cada lado

    var mid = Math.max(window.innerWidth * 0.5, 300);
    var midPx = mid / 2;

    // 3) Palabra off-screen → visible
    word.style.setProperty('--tx', '100vw');
    word.style.opacity = '1';

    // 4) Esperar un tick para aplicar transiciones
    setTimeout(function () {
      // 5) 1er movimiento hacia el centro
      word.style.transitionDuration = T1 + 'ms';
      word.style.setProperty('--tx', midPx + 'px');

      // 6) Pausa y 2do movimiento coordinado (palabra + logo al gap final)
      setTimeout(function () {
        word.style.transitionDuration = '650ms';
        word.style.setProperty('--tx', shift + 'px');        // palabra a la derecha
        logoWrap.style.setProperty('--tx', (-shift) + 'px'); // logo a la izquierda

        // 7) Bonk
        setTimeout(function () {
          logoWrap.classList.add('bonk');
          word.classList.add('bonk');

          // 8) Salida
          setTimeout(function () {
            stage.classList.add('slide-out-fwd-center');

            // 9) Limpieza al terminar animación
            stage.addEventListener('animationend', function onEnd() {
              stage.removeEventListener('animationend', onEnd);
              var appShell = document.querySelector('.app-shell');
              if (appShell) { appShell.classList.remove('is-blurred'); }
              document.documentElement.classList.remove('no-scroll');
              document.body.classList.remove('no-scroll');
              overlay.parentNode.removeChild(overlay);
            }, { once: true });

          }, EXIT_DELAY_MS);

        }, T3);

      }, T2);

    }, 0);
  }

  // ------------------ Timer de progreso (simulado) ------------------
  var timer = setInterval(function () {
    p = p + 1;
    if (p > 100) p = 100;

    renderProgress();

    if (p === 100) {
      clearInterval(timer);
      completeSequence();
    }
  }, STEP_MS);
})();
