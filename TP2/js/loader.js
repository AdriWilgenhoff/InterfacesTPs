(function () {
  /* =========================
     REFERENCIAS (por ID)
     ========================= */
  var percentEl = document.getElementById('percent');       // número 0–100
  var percentWrap = document.getElementById('percentWrap');   // contenedor del porcentaje
  var logoWrap = document.getElementById('logoWrap');      // envoltorio del logo (se mueve y hace “bonk”)
  var logoImg = document.getElementById('logoImg');       // imagen del logo (visible)
  var logoDark = document.getElementById('logoDark');      // capa oscura recortada por máscara (revela logo)
  var word = document.getElementById('word');          // palabra del sitio
  var stage = document.getElementById('loaderStage');   // contenedor del contenido que sale al final
  var overlay = document.getElementById('loaderOverlay'); // overlay de pantalla completa
  var brandRow = document.getElementById('brandRow');      // fila (logo + palabra)

  /* =========================
     CONSTANTES
     ========================= */
  var GAP = (window.innerWidth <= 480) ? 14 : 24;
  var STEP_MS = 50;         // % sube 1 cada 50ms => ~5s total
  var EXIT_DELAY_MS = 300;  // pausa corta antes de la salida final
  var T1 = 350;             // duración del 1er movimiento de la palabra (entrada parcial)
  var T2 = 360;             // pausa entre el 1er y 2do movimiento
  var T3 = 680;             // espera antes del “bonk” (rebote sutil)

  /* ======================================================
     FASE 1: CONFIGURAR LA MÁSCARA CON LA MISMA IMAGEN
     (para que la capa oscura tenga la forma exacta del logo)
     ====================================================== */
  var logoURL = logoImg.getAttribute('src');
  var maskValue = 'url(' + logoURL + ')';
  logoDark.style.setProperty('--mask-url', maskValue); // CSS usa var(--mask-url)
  logoDark.style.maskImage = maskValue;

  /* ======================================================
     FASE 2: “CARGA” VISUAL (barra de revelado sobre el logo)
     Mientras sube el %, movemos el recorte de la capa oscura
     de IZQ→DER con clip-path para simular la barra.
     ====================================================== */
  var p = 0; // 0..100

  function renderProgress() {
    percentEl.textContent = p;               // número visible
    logoDark.style.setProperty('--left', p + '%'); // mueve el recorte según %
  }

  /* ======================================================
     FASE 3: ANIMACIÓN FINAL CUANDO LLEGA A 100%
     1) Se desvanece el %.
     2) Se calcula distancia final y, si hace falta, se escala todo para que entre en pantallas chicas.
     3) PALABRA entra desde la derecha (off-screen) → paso intermedio.
     4) 2do movimiento: PALABRA (derecha del centro) + LOGO (izquierda),
        dejando un GAP; como conjunto quedan centrados.
     5) “BONK”: pequeño rebote (scale + micro vaivén).
     6) SALIDA: zoom (translateZ con perspectiva) + fade; se remueve overlay.
     ====================================================== */
  function completeSequence() {
    /* (3.1) Desvanecer el porcentaje */
    percentWrap.classList.add('fade-out');

    /* (3.2) Medir palabra y preparar posiciones/escala */
    word.style.opacity = '0';
    word.style.visibility = 'hidden';
    var w = word.offsetWidth || 0;  // ancho real del texto
    word.style.visibility = '';

    var vw = Math.max(window.innerWidth, 320);
    var logoW = logoWrap.offsetWidth || 0;
    var total = logoW + GAP + w;

    // Auto-escala para que logo + palabra + gap entren
    var margen = 24;
    var s = (vw - margen) / total;
    if (s > 1) s = 1;
    if (s < 0) s = 0;
    if (brandRow) {
      brandRow.style.setProperty('--s', String(s)); // CSS: transform: scale(var(--s,1));
    }

    // Distancia final simétrica desde el centro
    var shift = (w + GAP) / 2;

    // Punto intermedio para el 1er movimiento de la palabra
    var mid = Math.max(window.innerWidth * 0.5, 300);
    var midPx = mid / 2;

    /* (3.3) La palabra aparece desde fuera de pantalla (DER) */
    word.style.setProperty('--tx', '100vw'); // off-screen derecha
    word.style.opacity = '1';

    // Dejar un “tick” para que el navegador registre estado inicial
    setTimeout(function () {

      /* (3.3 → 3.4) 1er movimiento corto hacia el centro */
      word.style.transitionDuration = T1 + 'ms';
      word.style.setProperty('--tx', midPx + 'px');

      /* (3.4) Pausa y 2do movimiento coordinado (palabra + logo al gap final) */
      setTimeout(function () {
        word.style.transitionDuration = '650ms';
        word.style.setProperty('--tx', shift + 'px');        // palabra a la derecha
        logoWrap.style.setProperty('--tx', (-shift) + 'px'); // logo a la izquierda

        /* (3.5) “BONK”: rebote sutil (NO es skew; es scale + micro sacudida) */
        setTimeout(function () {
          logoWrap.classList.add('bonk');
          word.classList.add('bonk');

          /* (3.6) SALIDA: zoom (translateZ) + fade, luego limpiar */
          setTimeout(function () {
            stage.classList.add('slide-out-fwd-center');

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

  /* =========================
     TIMER DE “CARGA” SIMULADA
     ========================= */
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



/*Mientras sube el %: hay una capa oscura encima del logo que se va corriendo de izquierda→derecha (con un recorte/clip). Visualmente parece una barra de carga que va revelando el logo. ✅

Al llegar a 100%: el % se desvanece y aparece la palabra desde fuera de pantalla (a la derecha). Primero hace un salto corto hacia una posición intermedia y luego va a su posición final. ✅

Posicionamiento final: no es que la palabra “vuelva a la izquierda”. Lo que pasa es:

la palabra se acomoda a la derecha del centro,

el logo se mueve un poco a la izquierda,

y entre ambos queda un gap. Como conjunto quedan centrados. (Se logra moviendo translateX en ambos). ⚠️ (aclaración hecha)

“Choque”: no es un skew. Es un mini “squash & stretch” (ligeros scale y micro sacudidas en X) para dar sensación de choque suave. ❌ skew / ✅ scale+sacudida

Salida: el contenedor hace un translateZ con perspectiva y baja la opacidad. Se percibe como que se agranda y se esfuma. ✅

mini línea de tiempo

% sube → capa se corre → logo se revela.

% se apaga → palabra entra desde la derecha (paso intermedio → posición final).

“Bonk” (pequeño rebote con scale).

Zoom hacia cámara + fade → desaparece.*/