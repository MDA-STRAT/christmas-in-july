/* ============================================================
   Christmas in July — RSVP form handling
   POSTs to the Netlify function at /api/rsvp
   ============================================================ */
(function () {
  'use strict';
  const form = document.getElementById('rsvpForm');
  if (!form) return;

  const btn = document.getElementById('rsvpBtn');
  const btnText = btn ? btn.querySelector('.btn-text') : null;
  const status = document.getElementById('rsvpStatus');

  const ENDPOINT = '/api/rsvp';

  function setStatus(msg, kind) {
    if (!status) return;
    status.textContent = msg;
    status.classList.remove('ok', 'bad');
    if (kind) status.classList.add(kind);
    status.classList.toggle('show', !!msg);
  }

  function fieldEl(input) { return input.closest('.field'); }

  function validate() {
    let firstBad = null;
    const required = form.querySelectorAll('[required]');
    required.forEach(function (input) {
      const wrap = fieldEl(input);
      const ok = input.value.trim().length > 0;
      if (wrap) wrap.classList.toggle('error', !ok);
      if (!ok && !firstBad) firstBad = input;
    });
    return firstBad;
  }

  // clear error state as the user types
  form.addEventListener('input', function (e) {
    const wrap = fieldEl(e.target);
    if (wrap && wrap.classList.contains('error') && e.target.value.trim()) {
      wrap.classList.remove('error');
    }
  });

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    setStatus('', null);

    const bad = validate();
    if (bad) {
      setStatus('Just a couple of blanks to fill in first.', 'bad');
      bad.focus();
      return;
    }

    const data = {
      first_name: form.first_name.value.trim(),
      last_name: form.last_name.value.trim(),
      address: form.address.value.trim(),
      bringing: form.bringing.value.trim(),
      notes: form.notes.value.trim()
    };

    if (btn) { btn.disabled = true; }
    if (btnText) btnText.textContent = 'Sending…';
    setStatus('Popping you on the list…', 'ok');

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      let payload = {};
      try { payload = await res.json(); } catch (err) { /* non-JSON */ }

      if (!res.ok) {
        throw new Error(payload.error || ('Server responded ' + res.status));
      }

      showSuccess(data.first_name);
    } catch (err) {
      if (btn) btn.disabled = false;
      if (btnText) btnText.textContent = 'Lock me in';
      setStatus('Something went sideways — give it another go, or text Greg and we’ll add you by hand.', 'bad');
      // surface in console for debugging during setup
      if (window.console) console.error('[RSVP]', err);
    }
  });

  function showSuccess(name) {
    const card = document.createElement('div');
    card.className = 'rsvp-done';
    const hi = name ? (', ' + name) : '';
    card.innerHTML =
      '<p class="t-script">You\u2019re on the list' + escapeHtml(hi) + '</p>' +
      '<p>Santa &mdash; and the esky &mdash; thank you. We\u2019ll see you at Lancewood Circuit Reserve on Sunday 26 July. Come hungry.</p>';
    form.replaceWith(card);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
})();
