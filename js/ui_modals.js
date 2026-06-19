// MindForge: AI Tycoon — Demo cap modal & welcome screen
const UI_MODALS = (() => {

  function showDemoCapModal() {
    const modal = document.getElementById('modal-democap');
    if (!modal) return;
    document.getElementById('democap-title').textContent = I18N.t('demoLimitTitle');
    document.getElementById('democap-desc').textContent = I18N.t('demoLimitDesc');
    document.getElementById('democap-buy').textContent = I18N.t('buyFullVersion');
    document.getElementById('democap-continue').textContent = I18N.t('continueDemo');
    modal.classList.add('modal--visible');
  }

  function hideDemoCapModal() {
    const modal = document.getElementById('modal-democap');
    if (modal) modal.classList.remove('modal--visible');
  }

  function showWelcomeModal() {
    const modal = document.getElementById('modal-welcome');
    if (!modal) return;
    document.getElementById('welcome-title').textContent = I18N.t('welcomeTitle');
    document.getElementById('welcome-desc').textContent = I18N.t('welcomeDesc');
    document.getElementById('welcome-start').textContent = I18N.t('startGame');
    modal.classList.add('modal--visible');
  }

  function hideWelcomeModal() {
    const modal = document.getElementById('modal-welcome');
    if (modal) modal.classList.remove('modal--visible');
  }

  return { showDemoCapModal, hideDemoCapModal, showWelcomeModal, hideWelcomeModal };
})();
