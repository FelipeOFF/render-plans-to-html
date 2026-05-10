(function () {
  const docs = Array.from(document.querySelectorAll('.doc'));
  const navLinks = Array.from(document.querySelectorAll('.sidebar nav a'));
  const search = document.querySelector('.sidebar input[type=search]');
  const themeBtn = document.querySelector('.theme-toggle');
  const copyBtn = document.querySelector('.copy-prompt');

  function activate(id) {
    docs.forEach(d => d.classList.toggle('active', d.id === id));
    navLinks.forEach(a => a.classList.toggle('active', a.dataset.target === id));
    history.replaceState(null, '', '#' + id);
  }

  navLinks.forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      activate(a.dataset.target);
    });
  });

  const initial = location.hash.slice(1) || (docs[0] && docs[0].id);
  if (initial) activate(initial);

  if (search) {
    search.addEventListener('input', () => {
      const q = search.value.toLowerCase().trim();
      navLinks.forEach(a => {
        const match = !q || a.textContent.toLowerCase().includes(q);
        a.style.display = match ? '' : 'none';
      });
    });
  }

  if (themeBtn) {
    const stored = localStorage.getItem('rph-theme');
    if (stored) document.documentElement.dataset.theme = stored;
    themeBtn.addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      localStorage.setItem('rph-theme', next);
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const active = document.querySelector('.doc.active');
      if (!active) return;
      const text = active.innerText;
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = 'Copied!';
      setTimeout(() => (copyBtn.textContent = 'Copy as prompt'), 1500);
    });
  }

  if (window.mermaid) {
    window.mermaid.initialize({ startOnLoad: true, theme: document.documentElement.dataset.theme === 'dark' ? 'dark' : 'default' });
  }
})();
