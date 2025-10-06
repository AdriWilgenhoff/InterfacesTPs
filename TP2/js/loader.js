(function () {
  var percentEl = document.getElementById('percent');
  var percentWrap = document.getElementById('percentWrap');
  var logoImg = document.getElementById('logoImg');
  var logoDark = document.getElementById('logoDark');
  var overlay = document.getElementById('loaderOverlay');

  var STEP_MS = 10;
  var p = 0;

  // Configura la máscara del logo
  var logoURL = logoImg.getAttribute('src');
  logoDark.style.maskImage = 'url(' + logoURL + ')';

  // Timer de carga
  var timer = setInterval(function () {
    p = Math.min(p + 1, 100);
    percentEl.textContent = p;
    
    // Mueve el clip-path de izquierda a derecha
    logoDark.style.clipPath = 'inset(0 0% 0 ' + p + '%)';

    if (p === 100) {
      clearInterval(timer);
      
      // Desvanece el porcentaje
      percentWrap.style.opacity = '0';
      
      // Dispara la animación después de 400ms
      setTimeout(function () {
        overlay.classList.add('go');
      }, 400);

      // Remueve el overlay después de todas las animaciones
      // 2830ms (animaciones) + 400ms (fade porcentaje) = 3230ms
      setTimeout(function () {
        overlay.remove();
        document.documentElement.classList.remove('no-scroll');
        document.body.classList.remove('no-scroll');
      }, 3230);
    }
  }, STEP_MS);
})();