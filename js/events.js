// MindForge: AI Tycoon — Random events system
const EVENTS = (() => {
  let nextEventAt = 0;

  function scheduleNext() {
    const min = GAME_DATA.config.eventIntervalMinMs;
    const max = GAME_DATA.config.eventIntervalMaxMs;
    nextEventAt = Date.now() + min + Math.random() * (max - min);
  }

  function pickWeighted() {
    const events = GAME_DATA.events;
    const totalWeight = events.reduce((sum, e) => sum + e.weight, 0);
    let roll = Math.random() * totalWeight;
    for (const e of events) {
      if (roll < e.weight) return e;
      roll -= e.weight;
    }
    return events[0];
  }

  function applyEffect(event) {
    const s = STATE.get();
    const now = Date.now();
    let payload = {};

    switch (event.effect) {
      case 'clientBoost':
        s.activeModifiers.push({ kind: 'clients', value: 1.5, expiresAt: now + 60000 });
        break;

      case 'flatMoney': {
        const stage = ECONOMY.getCurrentStage();
        const amount = Math.ceil(200 * Math.pow(3, stage.id) * (0.8 + Math.random() * 0.4));
        s.money += amount;
        s.totalEarned += amount;
        payload.value = ECONOMY.formatMoneyFull(amount);
        break;
      }

      case 'megaContract': {
        const stage = ECONOMY.getCurrentStage();
        const value = Math.ceil(1000 * Math.pow(2.5, stage.id));
        const contract = {
          uid: 'c_mega_' + now,
          templateId: 'finance',
          key: 'contract_finance',
          value,
          duration: 20,
          difficulty: 'medium',
          successRate: GAME_DATA.difficultySuccessRate.medium + 0.1,
          repReward: 10,
          offeredAt: now,
        };
        s.offeredContracts.push(contract);
        break;
      }

      case 'productionPenalty':
        s.activeModifiers.push({ kind: 'earnings', value: 0.6, expiresAt: now + 30000 });
        break;

      case 'loseEmployee': {
        const owned = GAME_DATA.employees.filter(e => (s.employees[e.id] || 0) > 0);
        if (owned.length > 0) {
          const victim = owned[Math.floor(Math.random() * owned.length)];
          s.employees[victim.id] = Math.max(0, s.employees[victim.id] - 1);
        }
        break;
      }

      case 'earningsPenalty':
        s.activeModifiers.push({ kind: 'earnings', value: 0.8, expiresAt: now + 60000 });
        break;
    }
    return payload;
  }

  // retorna o evento disparado neste tick (ou null)
  function tick() {
    if (Date.now() < nextEventAt) return null;
    scheduleNext();
    const event = pickWeighted();
    const payload = applyEffect(event);
    return { event, payload };
  }

  function init() {
    scheduleNext();
  }

  return { init, tick };
})();
