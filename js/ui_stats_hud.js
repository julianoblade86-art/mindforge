// MindForge: AI Tycoon — UI rendering: Stats tab & main HUD
const UI_STATS = (() => {

  function formatTime(totalSec) {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const sec = Math.floor(totalSec % 60);
    return `${h}h ${m}m ${sec}s`;
  }

  function render() {
    const container = document.getElementById('panel-stats');
    if (!container) return;
    const s = STATE.get();

    container.innerHTML = `
      <h3 class="panel-subtitle">${I18N.t('statsTitle')}</h3>
      <div class="card stats-card">
        <div class="stat-row"><span>${I18N.t('stat_totalEarned')}</span><span>${ECONOMY.formatMoneyFull(s.totalEarned)}</span></div>
        <div class="stat-row"><span>${I18N.t('stat_totalEmployees')}</span><span>${s.stats.totalEmployeesHired}</span></div>
        <div class="stat-row"><span>${I18N.t('stat_contractsCompleted')}</span><span>${s.stats.contractsCompleted}</span></div>
        <div class="stat-row"><span>${I18N.t('stat_timePlayed')}</span><span>${formatTime(s.stats.timePlayedSec)}</span></div>
        <div class="stat-row"><span>${I18N.t('stat_prestigeCount')}</span><span>${s.stats.prestigeCount}</span></div>
      </div>
    `;
  }

  return { render };
})();


const UI_HUD = (() => {

  function render() {
    const s = STATE.get();
    const stage = ECONOMY.getCurrentStage();

    document.getElementById('hud-stage').textContent = I18N.t(stage.key);
    document.getElementById('hud-money').textContent = ECONOMY.formatMoneyFull(s.money);
    document.getElementById('hud-production').textContent = '$' + ECONOMY.formatMoney(ECONOMY.getMoneyProductionPerSecond()) + I18N.t('perSecond');
    document.getElementById('hud-clients').textContent = Math.floor(s.clientsAvailable);
    document.getElementById('hud-reputation').textContent = s.reputation;

    // progresso para próxima fase
    const nextStage = ECONOMY.getNextStage();
    const stageBar = document.getElementById('hud-stage-progress');
    if (nextStage && stageBar) {
      const pct = Math.min(100, (s.totalEarned / nextStage.threshold) * 100);
      stageBar.style.width = pct + '%';
      stageBar.parentElement.title = `${ECONOMY.formatMoney(s.totalEarned)} / ${ECONOMY.formatMoney(nextStage.threshold)}`;
    } else if (stageBar) {
      stageBar.style.width = '100%';
    }

    // demo badge / cap warning
    const moneyDisplay = document.getElementById('hud-money-wrapper');
    if (s.isDemo && moneyDisplay) {
      const nearCap = s.money >= GAME_DATA.config.demoMoneyCap * 0.9;
      moneyDisplay.classList.toggle('hud__money--warning', nearCap);
    }
  }

  return { render };
})();
