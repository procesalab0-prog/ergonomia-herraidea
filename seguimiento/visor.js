/* Amplía el mismo canvas: no reinicia la cámara ni el modelo. */
(() => {
  const stage = document.getElementById('stage');
  const button = document.getElementById('expandViewer');
  let fallback = false;
  let busy = false;
  let scrollY = 0;
  const nativeElement = () => document.fullscreenElement || document.webkitFullscreenElement;
  function sync() {
    const expanded = fallback || nativeElement() === stage;
    button.textContent = expanded ? '✕ Salir del visor' : '⛶ Pantalla completa';
    button.setAttribute('aria-expanded', String(expanded));
  }
  function closeFallback() {
    fallback = false;
    stage.classList.remove('viewer-expanded');
    document.body.classList.remove('viewer-open');
    window.scrollTo(0, scrollY);
    sync();
    button.focus({ preventScroll: true });
  }
  button.addEventListener('click', async () => {
    if (busy) return;
    if (fallback) { closeFallback(); return; }
    busy = true;
    try {
      if (nativeElement() === stage) {
        const exit = document.exitFullscreen || document.webkitExitFullscreen;
        if (exit) await exit.call(document);
      } else {
        const request = stage.requestFullscreen || stage.webkitRequestFullscreen;
        let opened = false;
        if (request) {
          try { await request.call(stage); opened = nativeElement() === stage; }
          catch (_) { /* Safari puede no permitir fullscreen en elementos HTML. */ }
        }
        if (!opened) {
          scrollY = window.scrollY;
          fallback = true;
          stage.classList.add('viewer-expanded');
          document.body.classList.add('viewer-open');
        }
      }
    } finally { busy = false; sync(); }
  });
  document.addEventListener('fullscreenchange', sync);
  document.addEventListener('webkitfullscreenchange', sync);
  document.addEventListener('keydown', event => {
    if (!fallback) return;
    if (event.key === 'Escape') { event.preventDefault(); closeFallback(); }
    if (event.key === 'Tab') { event.preventDefault(); button.focus(); }
  });
})();
