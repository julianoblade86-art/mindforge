// MindForge: AI Tycoon — Toast notifications
const TOAST = (() => {
  let container = null;

  function init() {
    container = document.getElementById('toast-container');
  }

  function show(title, desc, type = 'info') {
    if (!container) return;
    const el = document.createElement('div');
    el.className = `toast toast--${type}`;
    el.innerHTML = `
      <div class="toast__title">${title}</div>
      ${desc ? `<div class="toast__desc">${desc}</div>` : ''}
    `;
    container.appendChild(el);
    requestAnimationFrame(() => el.classList.add('toast--visible'));

    setTimeout(() => {
      el.classList.remove('toast--visible');
      setTimeout(() => el.remove(), 350);
    }, 4500);
  }

  return { init, show };
})();
