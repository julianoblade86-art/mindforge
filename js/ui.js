// MindForge: AI Tycoon — UI orchestrator
const UI = (() => {
  let activeTab = 'team';

  function renderAll() {
    UI_HUD.render();
    const map = {
      team: UI_TEAM.render,
      research: UI_RESEARCH.render,
      contracts: UI_CONTRACTS.render,
      world: UI_WORLD.render,
      stats: UI_STATS.render,
    };
    // só renderiza a aba ativa por custo de performance, mas HUD sempre atualiza
    if (map[activeTab]) map[activeTab]();
  }

  function renderStatic() {
    // textos que não mudam a cada tick (labels fixos), atualizados ao trocar idioma
    document.getElementById('app-title').textContent = I18N.t('gameTitle');
    document.getElementById('app-subtitle').textContent = I18N.t('gameSubtitle');
    document.getElementById('label-money').textContent = I18N.t('money');
    document.getElementById('label-clients').textContent = I18N.t('clients');
    document.getElementById('label-reputation').textContent = I18N.t('reputation');

    document.getElementById('tabbtn-team').textContent = '👥 ' + I18N.t('tab_team');
    document.getElementById('tabbtn-research').textContent = '🔬 ' + I18N.t('tab_research');
    document.getElementById('tabbtn-contracts').textContent = '📜 ' + I18N.t('tab_contracts');
    document.getElementById('tabbtn-world').textContent = '🌍 ' + I18N.t('tab_world');
    document.getElementById('tabbtn-stats').textContent = '📊 ' + I18N.t('tab_stats');

    const demoBadge = document.getElementById('demo-badge');
    if (demoBadge) demoBadge.textContent = I18N.t('demoBadge');

    renderAll();
  }

  function setActiveTab(tab) {
    activeTab = tab;
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('tab-panel--active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('tab-btn--active'));
    document.getElementById('panel-' + tab).classList.add('tab-panel--active');
    document.getElementById('tabbtn-' + tab).classList.add('tab-btn--active');
    renderAll();
  }

  function init() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => setActiveTab(btn.dataset.tab));
    });
    setActiveTab('team');
  }

  return { init, renderAll, renderStatic, setActiveTab };
})();
