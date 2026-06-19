// MindForge: AI Tycoon — Main game loop & bootstrap
const GAME = (() => {
  let lastTick = Date.now();
  let lastStageId = 0;
  let demoCapTriggered = false;

  function processTick() {
    const now = Date.now();
    const deltaSeconds = (now - lastTick) / 1000;
    lastTick = now;
    const s = STATE.get();

    ECONOMY.cleanExpiredModifiers();

    // produção de dinheiro
    const moneyGain = ECONOMY.getMoneyProductionPerSecond() * deltaSeconds;
    s.money += moneyGain;
    s.totalEarned += moneyGain;

    // produção de clientes
    const clientGain = ECONOMY.getClientProductionPerSecond() * deltaSeconds;
    s.clientsAvailable += clientGain;

    // tempo jogado
    s.stats.timePlayedSec += deltaSeconds;

    // rival / market share
    RIVAL.update(deltaSeconds);

    // contratos: spawn + resolução
    const results = CONTRACTS.tick();
    results.forEach(r => {
      if (r.success) {
        TOAST.show(I18N.t('contractSuccess', { value: ECONOMY.formatMoneyFull(r.earned) }), I18N.t(r.contract.key), 'success');
        RIVAL.stealShare(1.5);
      } else {
        TOAST.show(I18N.t('contractFail', { rep: Math.ceil(r.contract.repReward / 2) }), I18N.t(r.contract.key), 'error');
      }
    });

    // eventos aleatórios
    const eventResult = EVENTS.tick();
    if (eventResult) {
      const desc = I18N.t(eventResult.event.descKey, eventResult.payload);
      TOAST.show(I18N.t(eventResult.event.titleKey), desc, eventResult.event.positive ? 'success' : 'error');
    }

    checkStageProgress();
    checkDemoCap();

    UI.renderAll();
  }

  function checkStageProgress() {
    const stage = ECONOMY.getCurrentStage();
    if (stage.id !== lastStageId) {
      lastStageId = stage.id;
      if (stage.id > 0) {
        TOAST.show(I18N.t('stageUnlockToast', { stage: I18N.t(stage.key) }), '', 'success');
      }
    }
  }

  function checkDemoCap() {
    const s = STATE.get();
    if (!s.isDemo || demoCapTriggered) return;
    if (s.money >= GAME_DATA.config.demoMoneyCap) {
      demoCapTriggered = true;
      s.demoCapReached = true;
      s.money = GAME_DATA.config.demoMoneyCap; // trava no teto
      UI_MODALS.showDemoCapModal();
    }
  }

  function bindModals() {
    const buyBtn = document.getElementById('democap-buy');
    const continueBtn = document.getElementById('democap-continue');
    if (buyBtn) {
      buyBtn.addEventListener('click', () => {
        // Placeholder: na versão real do Replit, trocar pelo link de compra real.
        TOAST.show('🚀 Redirecionando para a compra...', '', 'info');
      });
    }
    if (continueBtn) {
      continueBtn.addEventListener('click', () => UI_MODALS.hideDemoCapModal());
    }

    const welcomeStart = document.getElementById('welcome-start');
    if (welcomeStart) {
      welcomeStart.addEventListener('click', () => {
        const s = STATE.get();
        s.hasSeenWelcome = true;
        UI_MODALS.hideWelcomeModal();
        STATE.save();
      });
    }
  }

  function bindLanguageSwitcher() {
    const select = document.getElementById('language-select');
    if (!select) return;
    select.value = I18N.getLang();
    select.addEventListener('change', () => {
      I18N.setLang(select.value);
      UI.renderStatic();
    });
  }

  function bindSettings() {
    const resetBtn = document.getElementById('reset-save-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm(I18N.t('resetConfirm'))) {
          STATE.reset();
          demoCapTriggered = false;
          lastStageId = 0;
          UI.renderStatic();
          UI_MODALS.showWelcomeModal();
        }
      });
    }

    const settingsBtn = document.getElementById('settings-toggle');
    const settingsPanel = document.getElementById('settings-panel');
    if (settingsBtn && settingsPanel) {
      settingsBtn.addEventListener('click', () => {
        settingsPanel.classList.toggle('settings-panel--open');
      });
    }
  }

  function init() {
    STATE.load();
    const s = STATE.get();

    TOAST.init();
    CONTRACTS.init();
    EVENTS.init();
    UI.init();
    ACTIONS.bindGlobalClicks();
    ACTIONS.bindClickWork();
    bindModals();
    bindLanguageSwitcher();
    bindSettings();

    lastStageId = ECONOMY.getCurrentStage().id;
    demoCapTriggered = s.demoCapReached;

    UI.renderStatic();

    if (!s.hasSeenWelcome) {
      UI_MODALS.showWelcomeModal();
    }

    lastTick = Date.now();
    setInterval(processTick, GAME_DATA.config.tickIntervalMs);
    setInterval(() => STATE.save(), GAME_DATA.config.autosaveIntervalMs);

    window.addEventListener('beforeunload', () => STATE.save());
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', GAME.init);
