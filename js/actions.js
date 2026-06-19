// MindForge: AI Tycoon — Action handlers (cliques do jogador)
const ACTIONS = (() => {

  function hireEmployee(id) {
    const s = STATE.get();
    const def = ECONOMY.getEmployeeDef(id);
    if (!def) return;
    if (s.isDemo && !def.demoAvailable) return;
    const cost = ECONOMY.getEmployeeCost(id);
    if (s.money < cost) {
      TOAST.show(I18N.t('notEnoughMoney'), '', 'error');
      return;
    }
    s.money -= cost;
    s.employees[id] = (s.employees[id] || 0) + 1;
    s.stats.totalEmployeesHired++;
    UI.renderAll();
  }

  function upgradeServer() {
    const s = STATE.get();
    const cost = ECONOMY.getServerUpgradeCost();
    if (s.money < cost) {
      TOAST.show(I18N.t('notEnoughMoney'), '', 'error');
      return;
    }
    s.money -= cost;
    s.serverUpgrades++;
    UI.renderAll();
  }

  function research() {
    const s = STATE.get();
    const next = GAME_DATA.aiModels.find(m => m.id === s.aiModelLevel + 1);
    if (!next) return;
    if (s.isDemo && !next.demoAvailable) return;
    if (s.money < next.researchCost) {
      TOAST.show(I18N.t('notEnoughMoney'), '', 'error');
      return;
    }
    s.money -= next.researchCost;
    s.aiModelLevel = next.id;
    TOAST.show(I18N.t('researchToast', { model: I18N.t(next.key), bonus: next.bonusPercent }), '', 'success');
    UI.renderAll();
  }

  function acceptContract(uid) {
    const success = CONTRACTS.accept(uid);
    if (!success) {
      TOAST.show(I18N.t('notEnoughCapacity') || 'Sem clientes suficientes', '', 'error');
    }
    UI.renderAll();
  }

  function declineContract(uid) {
    CONTRACTS.decline(uid);
    UI.renderAll();
  }

  function expandCountry(id) {
    const s = STATE.get();
    const def = GAME_DATA.countries.find(c => c.id === id);
    if (!def) return;
    if (s.isDemo && !def.demoAvailable) return;
    if (s.countries[id]) return;
    if (s.money < def.cost) {
      TOAST.show(I18N.t('notEnoughMoney'), '', 'error');
      return;
    }
    s.money -= def.cost;
    s.countries[id] = true;
    RIVAL.stealShare(5);
    UI.renderAll();
  }

  function bindGlobalClicks() {
    document.body.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (!target) return;
      const action = target.dataset.action;

      switch (action) {
        case 'hire': hireEmployee(target.dataset.id); break;
        case 'upgradeServer': upgradeServer(); break;
        case 'research': research(); break;
        case 'acceptContract': acceptContract(target.dataset.uid); break;
        case 'declineContract': declineContract(target.dataset.uid); break;
        case 'expand': expandCountry(target.dataset.id); break;
      }
    });
  }

  return { bindGlobalClicks, hireEmployee, upgradeServer, research, acceptContract, expandCountry };
})();

// Clique manual — função global para o botão de trabalhar
function bindClickWork() {
  const btn = document.getElementById('click-work-btn');
  if (!btn) return;

  // Calcula o valor do clique: escala com produção/s para ser relevante mas não OP
  function getClickValue() {
    const prod = ECONOMY.getMoneyProductionPerSecond();
    const base = 3;
    // depois de ter produção, clique vale ~5s de produção (mantém relevância no early)
    return Math.max(base, Math.ceil(prod * 5));
  }

  function updateClickLabel() {
    const val = getClickValue();
    const label = document.getElementById('click-btn-value');
    if (label) label.textContent = '+$' + ECONOMY.formatMoney(val);
  }

  btn.addEventListener('click', (e) => {
    const s = STATE.get();
    if (s.isDemo && s.demoCapReached) return;

    const val = getClickValue();
    s.money += val;
    s.totalEarned += val;

    // animação de +$ flutuante
    const float = document.createElement('div');
    float.className = 'click-float';
    float.textContent = '+$' + ECONOMY.formatMoney(val);
    float.style.left = (e.clientX - 20) + 'px';
    float.style.top = (e.clientY - 10) + 'px';
    document.body.appendChild(float);
    setTimeout(() => float.remove(), 950);

    updateClickLabel();
    UI.renderAll();
  });

  // atualiza label do clique a cada 2s (valor muda conforme produção cresce)
  setInterval(updateClickLabel, 2000);
  updateClickLabel();
}

ACTIONS.bindClickWork = bindClickWork;
