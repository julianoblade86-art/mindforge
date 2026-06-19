// MindForge: AI Tycoon — UI rendering: Contracts & World tabs
const UI_CONTRACTS = (() => {

  function renderOffered(contract) {
    const s = STATE.get();
    const canAccept = CONTRACTS.canAccept(contract);
    return `
      <div class="card contract-card contract-card--${contract.difficulty}">
        <div class="contract-card__header">
          <span class="contract-card__title">${I18N.t(contract.key)}</span>
          <span class="badge badge--difficulty badge--${contract.difficulty}">${I18N.t('difficulty_' + contract.difficulty)}</span>
        </div>
        <div class="contract-card__stats">
          <span>💰 ${I18N.t('contractValue')}: ${ECONOMY.formatMoneyFull(contract.value)}</span>
          <span>⏱️ ${I18N.t('contractDuration')}: ${contract.duration}s</span>
          <span>🎯 ${Math.round(contract.successRate * 100)}%</span>
        </div>
        <button class="btn btn--accept ${canAccept ? '' : 'btn--disabled'}" data-action="acceptContract" data-uid="${contract.uid}" ${canAccept ? '' : 'disabled'}>
          ${I18N.t('contractAccept')}
        </button>
      </div>
    `;
  }

  function renderActive(contract) {
    const now = Date.now();
    const total = contract.endsAt - contract.startedAt;
    const elapsed = now - contract.startedAt;
    const pct = Math.min(100, (elapsed / total) * 100);
    return `
      <div class="card contract-card contract-card--active">
        <div class="contract-card__header">
          <span class="contract-card__title">${I18N.t(contract.key)}</span>
          <span class="badge">${I18N.t('contractInProgress')}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-bar__fill progress-bar__fill--active" style="width:${pct}%"></div>
        </div>
      </div>
    `;
  }

  function render() {
    const container = document.getElementById('panel-contracts');
    if (!container) return;
    const s = STATE.get();

    let html = `<h3 class="panel-subtitle">${I18N.t('contractsTitle')}</h3>`;

    if (s.offeredContracts.length === 0 && s.activeContracts.length === 0) {
      html += `<div class="card empty-card">${I18N.t('noContracts')}</div>`;
    } else {
      s.offeredContracts.forEach(c => { html += renderOffered(c); });
      s.activeContracts.forEach(c => { html += renderActive(c); });
    }

    container.innerHTML = html;
  }

  return { render };
})();


const UI_WORLD = (() => {

  function renderCountry(def) {
    const s = STATE.get();
    const active = !!s.countries[def.id];
    const locked = s.isDemo && !def.demoAvailable;
    const affordable = s.money >= def.cost;

    let actionHtml;
    if (active) {
      actionHtml = `<span class="badge badge--active">✅ ${I18N.t('expanded')}</span>`;
    } else if (locked) {
      actionHtml = `<button class="btn btn--locked" disabled>🔒 ${I18N.t('locked')}</button>`;
    } else {
      actionHtml = `<button class="btn btn--expand ${affordable ? '' : 'btn--disabled'}" data-action="expand" data-id="${def.id}" ${affordable ? '' : 'disabled'}>
        ${I18N.t('expand')} <span class="btn__cost">${ECONOMY.formatMoneyFull(def.cost)}</span>
      </button>`;
    }

    return `
      <div class="card country-card ${active ? 'country-card--active' : ''} ${locked ? 'card--locked' : ''}">
        <div class="country-card__name">${I18N.t(def.key)}</div>
        <div class="country-card__mult">${I18N.t('marketMultiplier')}: x${def.multiplier}</div>
        <div class="country-card__action">${actionHtml}</div>
      </div>
    `;
  }

  function renderMarketShare() {
    const s = STATE.get();
    const ms = s.marketShare;
    return `
      <div class="card market-share-card">
        <div class="panel-subtitle">${I18N.t('marketShare')}</div>
        <div class="market-share-bar">
          <div class="market-share-bar__player" style="width:${ms.player}%">${ms.player.toFixed(1)}%</div>
          <div class="market-share-bar__rival" style="width:${ms.rival}%">${ms.rival.toFixed(1)}%</div>
        </div>
        <div class="market-share-labels">
          <span class="text-accent-blue">${I18N.t('you')}</span>
          <span class="text-accent-red">${I18N.t('rival')}</span>
        </div>
      </div>
    `;
  }

  function render() {
    const container = document.getElementById('panel-world');
    if (!container) return;
    let html = renderMarketShare();
    html += `<h3 class="panel-subtitle">${I18N.t('worldTitle')}</h3>`;
    html += '<div class="country-grid">';
    GAME_DATA.countries.forEach(def => { html += renderCountry(def); });
    html += '</div>';
    container.innerHTML = html;
  }

  return { render };
})();
