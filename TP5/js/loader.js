(function () {
  var percentEl = document.getElementById('percent');
  var percentWrap = document.getElementById('percentWrap');
  var logoImg = document.getElementById('logoImg');
  var logoDark = document.getElementById('logoDark');
  var overlay = document.getElementById('loaderOverlay');

  var STEP_MS = 50;
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
    
      percentWrap.style.opacity = '0';
      
      setTimeout(function () {
        overlay.classList.add('go');
      }, 400);

      setTimeout(function () {
        overlay.remove();
        document.documentElement.classList.remove('no-scroll');
        document.body.classList.remove('no-scroll');
      }, 3230);
    }
  }, STEP_MS);
})();