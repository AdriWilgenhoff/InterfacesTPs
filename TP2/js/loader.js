(() => {
  // ---------- refs ----------
  const $ = id => document.getElementById(id);
  const percentEl = $('percent');
  const percentWrap = $('percentWrap');
  const logoWrap = $('logoWrap');
  const logoImg  = $('logoImg');
  const logoDark = $('logoDark');
  const word     = $('word');
  const srEl     = $('srStatus');
  const stage    = $('loaderStage');
  const overlay  = $('loaderOverlay');

  // ---------- constantes ----------
  const GAP = parseFloat(getComputedStyle(overlay).getPropertyValue('--gap')) || 24;
  const STEP_MS = 50;
  const EXIT_DELAY_MS = 300;
  const T1 = 350;   // 1er movimiento de word
  const T2 = 360;   // delay hacia 2do movimiento
  const T3 = 680;   // delay antes del "bonk"

  // ---------- máscara con la imagen del logo ----------
  const logoURL = logoImg.getAttribute('src');
  const maskValue = `url(${logoURL})`;
  logoDark.style.setProperty('--mask-url', maskValue);
  logoDark.style.webkitMaskImage = maskValue;
  logoDark.style.maskImage = maskValue;

  // ---------- progreso ----------
  let p = 0;
  const render = () => {
    percentEl.textContent = p;
    srEl.textContent = 'Progreso ' + p + '%';
    logoDark.style.setProperty('--left',  p + '%');
    logoDark.style.setProperty('--right', '0%');
  };

  // ---------- secuencia de salida ----------
  async function completeSequence() {
    percentWrap.classList.add('fade-out');

    // calcular desplazamiento final
    word.style.opacity = '0';
    word.style.visibility = 'hidden';
    const w = word.offsetWidth || 0;
    word.style.visibility = '';
    const shift = (w + GAP) / 2;

    // palabra entra desde la derecha
    word.style.setProperty('--tx', '100vw');
    word.style.opacity = '1';
    const mid = Math.max(window.innerWidth * 0.5, 300);

    await new Promise(requestAnimationFrame);
    word.style.transitionDuration = T1 + 'ms';
    word.style.setProperty('--tx', (mid / 2) + 'px');

    await new Promise(r => setTimeout(r, T2));
    word.style.transitionDuration = '650ms';
    word.style.setProperty('--tx',  (+shift) + 'px');
    logoWrap.style.setProperty('--tx', (-shift) + 'px');

    await new Promise(r => setTimeout(r, T3));
    logoWrap.classList.add('bonk');
    word.classList.add('bonk');

    await new Promise(r => setTimeout(r, EXIT_DELAY_MS));
    stage.classList.add('slide-out-fwd-center');

    stage.addEventListener('animationend', () => {
      // liberar blur + scroll
      const appShell = document.querySelector('.app-shell');
      if (appShell) appShell.classList.remove('is-blurred');
      document.documentElement.classList.remove('no-scroll');
      document.body.classList.remove('no-scroll');

      overlay.remove();
    }, { once: true });
  }

  // ---------- timer fijo ----------
  const timer = setInterval(() => {
    p = Math.min(100, p + 1);
    render();
    if (p === 100) {
      clearInterval(timer);
      completeSequence();
    }
  }, STEP_MS);
})();
