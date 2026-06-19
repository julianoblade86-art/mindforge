// MindForge: AI Tycoon — UI rendering: Team & Research tabs
const UI_TEAM = (() => {

  function renderEmployeeCard(def) {
    const s = STATE.get();
    const owned = s.employees[def.id] || 0;
    const cost = ECONOMY.getEmployeeCost(def.id);
    const affordable = s.money >= cost;
    const locked = s.isDemo && !def.demoAvailable;
    const productionLabel = def.type === 'money'
      ? `$${def.baseProduction}${I18N.t('perSecond')}`
      : `+${def.baseProduction} ${I18N.t('clients').toLowerCase()}${I18N.t('perSecond')}`;

    return `
      <div class="card employee-card ${locked ? 'card--locked' : ''}" data-employee="${def.id}">
        <div class="employee-card__icon">${def.icon}</div>
        <div class="employee-card__info">
          <div class="employee-card__name">${I18N.t(def.nameKey)}</div>
          <div class="employee-card__desc">${I18N.t(def.descKey)}</div>
          <div class="employee-card__stats">
            <span class="badge badge--owned">${I18N.t('owned')}: ${owned}</span>
            <span class="badge badge--prod">${productionLabel}</span>
            <span class="badge badge--load">⚡ ${def.load}</span>
          </div>
        </div>
        <div class="employee-card__action">
          ${locked
            ? `<button class="btn btn--locked" disabled>🔒 ${I18N.t('locked')}</button>`
            : `<button class="btn btn--hire ${affordable ? '' : 'btn--disabled'}" data-action="hire" data-id="${def.id}" ${affordable ? '' : 'disabled'}>
                 ${I18N.t('hire')}<br><span class="btn__cost">${ECONOMY.formatMoneyFull(cost)}</span>
               </button>`
          }
        </div>
      </div>
    `;
  }

  function renderServerCard() {
    const capacity = ECONOMY.getServerCapacity();
    const load = ECONOMY.getCurrentLoad();
    const cost = ECONOMY.getServerUpgradeCost();
    const s = STATE.get();
    const affordable = s.money >= cost;
    const pct = Math.min(100, (load / capacity) * 100);
    const overloaded = ECONOMY.isOverloaded();

    return `
      <div class="card server-card">
        <div class="server-card__header">
          <span>🖥️ ${I18N.t('serverCapacityLabel')}</span>
          <span class="${overloaded ? 'text-danger' : ''}">${load} / ${capacity}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-bar__fill ${overloaded ? 'progress-bar__fill--danger' : ''}" style="width:${pct}%"></div>
        </div>
        ${overloaded ? `<div class="warning-text">${I18N.t('overloadWarning')}</div>` : ''}
        <button class="btn btn--secondary ${affordable ? '' : 'btn--disabled'}" data-action="upgradeServer" ${affordable ? '' : 'disabled'}>
          ${I18N.t('serverUpgrade')} <span class="btn__cost">${ECONOMY.formatMoneyFull(cost)}</span>
        </button>
      </div>
    `;
  }

  function render() {
    const container = document.getElementById('panel-team');
    if (!container) return;
    const s = STATE.get();
    let html = renderServerCard();
    GAME_DATA.employees.forEach(def => {
      if (s.isDemo && !def.demoAvailable) return; // esconde totalmente o que é exclusivo da versão completa
      html += renderEmployeeCard(def);
    });
    container.innerHTML = html;
  }

  return { render };
})();


const UI_RESEARCH = (() => {

  function render() {
    const container = document.getElementById('panel-research');
    if (!container) return;
    const s = STATE.get();
    const currentModel = GAME_DATA.aiModels.find(m => m.id === s.aiModelLevel);
    const nextModel = GAME_DATA.aiModels.find(m => m.id === s.aiModelLevel + 1);

    let html = `
      <div class="card research-card">
        <div class="research-card__current">
          <div class="research-card__label">${I18N.t('aiModelLabel')}</div>
          <div class="research-card__value">${I18N.t(currentModel.key)}</div>
        </div>
      </div>
    `;

    if (!nextModel) {
      html += `<div class="card empty-card">🏆 ${I18N.t(currentModel.key)} — MAX</div>`;
    } else if (s.isDemo && !nextModel.demoAvailable) {
      html += `
        <div class="card research-card research-card--locked">
          <div class="research-card__next">${I18N.t(nextModel.key)}</div>
          <div class="locked-text">🔒 ${I18N.t('researchLocked')}</div>
        </div>
      `;
    } else {
      const cost = nextModel.researchCost;
      const affordable = s.money >= cost;
      html += `
        <div class="card research-card">
          <div class="research-card__next">
            <span>${I18N.t(currentModel.key)}</span>
            <span class="arrow">→</span>
            <span class="highlight">${I18N.t(nextModel.key)}</span>
          </div>
          <div class="research-card__bonus">+${nextModel.bonusPercent}% ${I18N.t('production').toLowerCase()}</div>
          <button class="btn btn--research ${affordable ? '' : 'btn--disabled'}" data-action="research" ${affordable ? '' : 'disabled'}>
            ${I18N.t('researchButton')} <span class="btn__cost">${ECONOMY.formatMoneyFull(cost)}</span>
          </button>
        </div>
      `;
    }

    container.innerHTML = html;
  }

  return { render };
})();
