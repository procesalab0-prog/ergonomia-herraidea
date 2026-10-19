(() => {
  'use strict';
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  function select(tab, focus = false) {
    tabs.forEach(t => {
      const active = t === tab;
      t.setAttribute('aria-selected', String(active)); t.tabIndex = active ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !active;
    });
    if (focus) tab.focus();
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', e => {
      const next = { ArrowRight:(i+1)%tabs.length, ArrowLeft:(i-1+tabs.length)%tabs.length, Home:0, End:tabs.length-1 }[e.key];
      if (next !== undefined) { e.preventDefault(); select(tabs[next], true); }
    });
  });
  select(tabs[0]);
  const header = document.querySelector('.navigation'), progress = document.querySelector('.progress');
  let ticking = false;
  function update() {
    const height = document.documentElement.scrollHeight - innerHeight;
    header.classList.toggle('scrolled', scrollY > 45);
    progress.style.width = `${height > 0 ? Math.min(100, scrollY / height * 100) : 0}%`; ticking = false;
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, {passive:true});
  addEventListener('resize', update); update();
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    }), {threshold:0.04});
    document.documentElement.classList.add('motion');
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }
  // Local previews never upload or persist a file.
  const urls = new Set();
  document.querySelectorAll('[data-preview-input]').forEach(input => {
    const card = input.closest('[data-video-slot]'), placeholder = card.querySelector('.video-placeholder'), status = card.querySelector('.preview-status');
    const initial = status.textContent;
    let url, video, reset;
    function clear() {
      if (video) { video.pause(); video.removeAttribute('src'); video.load(); video.remove(); }
      if (url) { URL.revokeObjectURL(url); urls.delete(url); }
      reset?.remove(); url = video = reset = null; placeholder.hidden = false; input.value = ''; status.textContent = initial;
    }
    input.addEventListener('change', () => {
      const file = input.files?.[0]; if (!file) return; clear();
      if (!file.type.startsWith('video/')) { status.textContent = 'Selecciona un archivo de video.'; return; }
      url = URL.createObjectURL(file); urls.add(url);
      video = document.createElement('video'); video.controls = true; video.playsInline = true; video.preload = 'metadata'; video.src = url;
      video.setAttribute('aria-label', `Previsualización local: ${file.name}`);
      video.addEventListener('error', () => { status.textContent = 'Formato no compatible con este dispositivo. Prueba un MP4 compatible.'; });
      placeholder.before(video); placeholder.hidden = true;
      reset = document.createElement('button'); reset.type = 'button'; reset.className = 'reset-video'; reset.textContent = 'Quitar vista local'; reset.addEventListener('click', clear);
      input.closest('label').after(reset); status.textContent = `${file.name} · Vista local, no publicada. Se elimina al recargar.`;
    });
  });
  addEventListener('pagehide', () => { urls.forEach(url => URL.revokeObjectURL(url)); urls.clear(); });
  const state = new Map();
  addEventListener('beforeprint', () => document.querySelectorAll('details').forEach(el => { state.set(el, el.open); el.open = true; }));
  addEventListener('afterprint', () => { state.forEach((open, el) => { el.open = open; }); state.clear(); });
  document.getElementById('print-report').addEventListener('click', () => window.print());
})();
