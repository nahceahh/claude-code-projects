(() => {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const overview = document.querySelector('.overview');
  const grid = document.getElementById('overviewGrid');

  let i = 0;

  function setActive(next) {
    i = Math.max(0, Math.min(slides.length - 1, next));
    slides.forEach((s, idx) => s.classList.toggle('is-active', idx === i));
    window.location.hash = `#${i + 1}`;
  }

  function openOverview() {
    if (!overview || !grid) return;
    grid.innerHTML = '';
    slides.forEach((s, idx) => {
      const t = document.createElement('div');
      t.className = 'thumb';
      // Clone with scaled content for thumbnail
      const clone = s.cloneNode(true);
      clone.classList.add('is-active');
      clone.style.position = 'absolute';
      clone.style.inset = '0';
      clone.style.transform = 'scale(.28)';
      clone.style.transformOrigin = 'top left';
      clone.style.pointerEvents = 'none';
      clone.style.borderRadius = '0';
      clone.style.boxShadow = 'none';
      t.appendChild(clone);

      const label = document.createElement('div');
      label.className = 'label';
      label.textContent = `${idx + 1} / ${slides.length}`;
      t.appendChild(label);

      t.addEventListener('click', () => {
        closeOverview();
        setActive(idx);
      });
      grid.appendChild(t);
    });
    overview.classList.add('is-open');
    overview.setAttribute('aria-hidden', 'false');
  }

  function closeOverview() {
    overview?.classList.remove('is-open');
    overview?.setAttribute('aria-hidden', 'true');
  }

  function toggleOverview() {
    if (!overview) return;
    overview.classList.contains('is-open') ? closeOverview() : openOverview();
  }

  function onKey(e) {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
      e.preventDefault();
      if (overview?.classList.contains('is-open')) return;
      setActive(i + 1);
    }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      if (overview?.classList.contains('is-open')) return;
      setActive(i - 1);
    }
    if (e.key === 'Home') setActive(0);
    if (e.key === 'End') setActive(slides.length - 1);

    if (e.key === 'Escape') {
      e.preventDefault();
      if (overview?.classList.contains('is-open')) closeOverview();
      else openOverview();
    }

    if (e.key === 'r' || e.key === 'R') {
      setActive(0);
      closeOverview();
    }
  }

  function initFromHash() {
    const m = window.location.hash.match(/#(\d+)/);
    if (m) {
      const n = Number(m[1]);
      if (!Number.isNaN(n)) setActive(n - 1);
      else setActive(0);
    } else {
      setActive(0);
    }
  }

  overview?.addEventListener('click', (e) => {
    if (e.target === overview) closeOverview();
  });

  window.addEventListener('hashchange', initFromHash);
  window.addEventListener('keydown', onKey);

  initFromHash();
})();
