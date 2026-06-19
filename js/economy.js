// MindForge: AI Tycoon — Economy calculations
const ECONOMY = (() => {

  function getEmployeeDef(id) {
    return GAME_DATA.employees.find(e => e.id === id);
  }

  function getEmployeeCost(id) {
    const def = getEmployeeDef(id);
    const owned = STATE.get().employees[id] || 0;
    return Math.ceil(def.baseCost * Math.pow(def.costGrowth, owned));
  }

  function getServerCapacity() {
    const s = STATE.get();
    return GAME_DATA.config.baseServerCapacity + s.serverUpgrades * GAME_DATA.config.serverUpgradeCapacityGain;
  }

  function getServerUpgradeCost() {
    const s = STATE.get();
    return Math.ceil(GAME_DATA.config.serverUpgradeBaseCost * Math.pow(GAME_DATA.config.serverUpgradeCostGrowth, s.serverUpgrades));
  }

  function getCurrentLoad() {
    const s = STATE.get();
    let load = 0;
    GAME_DATA.employees.forEach(def => {
      load += (s.employees[def.id] || 0) * def.load;
    });
    return load;
  }

  function isOverloaded() {
    return getCurrentLoad() > getServerCapacity();
  }

  function getAiModelBonusMultiplier() {
    const s = STATE.get();
    let mult = 1;
    for (let i = 1; i <= s.aiModelLevel; i++) {
      const model = GAME_DATA.aiModels.find(m => m.id === i);
      if (model) mult += model.bonusPercent / 100;
    }
    return mult;
  }

  function getStageMultiplier() {
    const stage = getCurrentStage();
    return 1 + stage.id * 0.10;
  }

  function getMarketCountryMultiplier() {
    const s = STATE.get();
    let mult = 0;
    let count = 0;
    GAME_DATA.countries.forEach(c => {
      if (s.countries[c.id]) { mult += c.multiplier; count++; }
    });
    return count > 0 ? mult / count : 1;
  }

  function getReputationMultiplier() {
    const s = STATE.get();
    return 1 + s.reputation * GAME_DATA.config.repBonusPerPoint;
  }

  function getPrestigeMultiplier() {
    const s = STATE.get();
    return 1 + s.prestigePoints * 0.02;
  }

  function getActiveModifierMultiplier(kind) {
    const s = STATE.get();
    const now = Date.now();
    let mult = 1;
    s.activeModifiers
      .filter(m => m.expiresAt > now && m.kind === kind)
      .forEach(m => { mult *= m.value; });
    return mult;
  }

  function cleanExpiredModifiers() {
    const s = STATE.get();
    const now = Date.now();
    s.activeModifiers = s.activeModifiers.filter(m => m.expiresAt > now);
  }

  // Produção total em $/s, considerando todos os multiplicadores
  function getMoneyProductionPerSecond() {
    const s = STATE.get();
    let base = 0;
    GAME_DATA.employees.forEach(def => {
      if (def.type === 'money') {
        base += (s.employees[def.id] || 0) * def.baseProduction;
      }
    });

    let total = base
      * getAiModelBonusMultiplier()
      * getStageMultiplier()
      * getMarketCountryMultiplier()
      * getPrestigeMultiplier()
      * getActiveModifierMultiplier('earnings');

    if (isOverloaded()) {
      total *= (1 - GAME_DATA.config.overloadPenalty);
    }
    return total;
  }

  function getClientProductionPerSecond() {
    const s = STATE.get();
    let base = 0;
    GAME_DATA.employees.forEach(def => {
      if (def.type === 'clients') {
        base += (s.employees[def.id] || 0) * def.baseProduction;
      }
    });
    return base * getActiveModifierMultiplier('clients');
  }

  function getCurrentStage() {
    const s = STATE.get();
    let current = GAME_DATA.stages[0];
    GAME_DATA.stages.forEach(st => {
      if (s.totalEarned >= st.threshold) current = st;
    });
    return current;
  }

  function getNextStage() {
    const current = getCurrentStage();
    return GAME_DATA.stages.find(st => st.id === current.id + 1) || null;
  }

  function getResearchCost() {
    const s = STATE.get();
    const next = GAME_DATA.aiModels.find(m => m.id === s.aiModelLevel + 1);
    return next ? next.researchCost : null;
  }

  function formatMoney(value) {
    const abs = Math.abs(value);
    if (abs >= 1e12) return (value / 1e12).toFixed(2) + 'T';
    if (abs >= 1e9) return (value / 1e9).toFixed(2) + 'B';
    if (abs >= 1e6) return (value / 1e6).toFixed(2) + 'M';
    if (abs >= 1e3) return (value / 1e3).toFixed(2) + 'K';
    return value.toFixed(2);
  }

  function formatMoneyFull(value) {
    return '$' + value.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }

  return {
    getEmployeeDef, getEmployeeCost,
    getServerCapacity, getServerUpgradeCost, getCurrentLoad, isOverloaded,
    getAiModelBonusMultiplier, getStageMultiplier, getMarketCountryMultiplier,
    getReputationMultiplier, getPrestigeMultiplier,
    getActiveModifierMultiplier, cleanExpiredModifiers,
    getMoneyProductionPerSecond, getClientProductionPerSecond,
    getCurrentStage, getNextStage, getResearchCost,
    formatMoney, formatMoneyFull,
  };
})();
