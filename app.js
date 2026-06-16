/* ============================================================
   Christmas in July — interactions
   ============================================================ */
(function () {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SITE_URL = 'https://robinadalesgroves-christmasinjuly.netlify.app';

  /* ---------- reveal on scroll (arm-only-when-foreground) ----------
     Content is visible by DEFAULT. We only "arm" (hide) elements when the
     tab is foregrounded and animations will actually run. The instant the
     tab is hidden, everything un-arms → nothing can be stuck invisible. */
  const reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  let armed = false;

  function revealEl(el) { el.classList.add('in'); el.__done = true; }

  function unarmAll() {
    reveals.forEach(function (el) { el.classList.remove('armed'); el.classList.add('in'); el.__done = true; });
  }

  function checkReveals() {
    if (!armed) return;
    const vh = window.innerHeight || document.documentElement.clientHeight;
    let remaining = 0;
    reveals.forEach(function (el) {
      if (el.__done) return;
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.9 && r.bottom > 0) revealEl(el);
      else remaining++;
    });
    return remaining;
  }

  function startReveal() {
    if (armed || reduce || document.hidden) return;
    armed = true;
    reveals.forEach(function (el) { if (!el.__done) el.classList.add('armed'); });
    requestAnimationFrame(function () {
      requestAnimationFrame(checkReveals);
    });
    const poll = setInterval(function () {
      if (document.hidden) { unarmAll(); clearInterval(poll); return; }
      const left = checkReveals();
      if (left === 0) clearInterval(poll);
    }, 200);
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) unarmAll();
    else startReveal();
  });

  if (reduce || document.hidden) {
    /* leave everything visible */
  } else {
    startReveal();
  }

  /* ---------- scroll progress ---------- */
  const bar = document.getElementById('scrollProgress');
  const wm = document.getElementById('wordmark');
  const greenSecs = ['about', 'plan', 'closing'].map(id => document.getElementById(id)).filter(Boolean);

  function onScroll() {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const p = max > 0 ? (h.scrollTop || document.body.scrollTop) / max : 0;
    if (bar) bar.style.width = (p * 100).toFixed(2) + '%';

    const y = window.scrollY;
    // wordmark appears after hero
    if (wm) {
      if (y > window.innerHeight * 0.72) wm.classList.add('show');
      else wm.classList.remove('show');
      // green vs cream context
      const probe = wm.getBoundingClientRect().top + 14;
      let onGreen = false;
      greenSecs.forEach(s => {
        const r = s.getBoundingClientRect();
        if (r.top <= probe && r.bottom >= probe) onGreen = true;
      });
      wm.classList.toggle('on-green', onGreen);
      wm.classList.toggle('on-cream', !onGreen);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('scroll', () => { if (!reduce) checkReveals(); }, { passive: true });
  window.addEventListener('resize', () => { if (!reduce) checkReveals(); });
  onScroll();

  /* ---------- scroll cue ---------- */
  const cue = document.getElementById('scrollCue');
  if (cue) cue.addEventListener('click', () => {
    const t = document.getElementById('about');
    if (t) t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  });

  /* ---------- QR code ---------- */
  function makeQR() {
    const node = document.getElementById('qrcode');
    if (!node || typeof QRCode === 'undefined') return;
    node.innerHTML = '';
    new QRCode(node, {
      text: SITE_URL,
      width: 172,
      height: 172,
      colorDark: '#0b2e22',
      colorLight: '#f6f1e4',
      correctLevel: QRCode.CorrectLevel.M
    });
  }
  if (typeof QRCode !== 'undefined') makeQR();
  else window.addEventListener('load', makeQR);

  /* ============================================================
     SNOW
     ============================================================ */
  function snow(canvas, opts) {
    if (!canvas || reduce) return;
    const ctx = canvas.getContext('2d');
    const cfg = Object.assign({ count: 70, color: 'rgba(11,46,34,', maxR: 3.2, speed: 0.5 }, opts);
    let w, h, flakes, raf, running = true;
    const host = canvas.parentElement;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = host.clientWidth; h = host.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function make() {
      flakes = [];
      const n = Math.round(cfg.count * Math.min(1.4, Math.max(0.5, w / 1100)));
      for (let i = 0; i < n; i++) {
        flakes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * cfg.maxR + 0.6,
          d: Math.random() * 1 + 0.4,
          sway: Math.random() * Math.PI * 2,
          o: Math.random() * 0.5 + 0.25
        });
      }
    }
    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (const f of flakes) {
        f.y += f.d * cfg.speed;
        f.sway += 0.01;
        f.x += Math.sin(f.sway) * 0.4;
        if (f.y > h + 5) { f.y = -5; f.x = Math.random() * w; }
        if (f.x > w + 5) f.x = -5; if (f.x < -5) f.x = w + 5;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = cfg.color + f.o + ')';
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }
    resize(); make(); draw();
    window.addEventListener('resize', () => { resize(); make(); });

    // pause when offscreen
    const vis = new IntersectionObserver((e) => {
      e.forEach(en => {
        if (en.isIntersecting) { if (!running) { running = true; draw(); } }
        else { running = false; cancelAnimationFrame(raf); }
      });
    }, { threshold: 0 });
    vis.observe(host);
  }

  snow(document.getElementById('snow'), { count: 80, color: 'rgba(11,46,34,', maxR: 3, speed: 0.55 });
  snow(document.getElementById('snow2'), { count: 55, color: 'rgba(246,241,228,', maxR: 2.4, speed: 0.4 });
})();
