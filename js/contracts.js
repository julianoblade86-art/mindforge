// MindForge: AI Tycoon — Contracts system
const CONTRACTS = (() => {
  let nextSpawnAt = 0;

  function scheduleNextSpawn() {
    const min = GAME_DATA.config.contractSpawnMinMs;
    const max = GAME_DATA.config.contractSpawnMaxMs;
    nextSpawnAt = Date.now() + min + Math.random() * (max - min);
  }

  function pickTemplate() {
    const templates = GAME_DATA.contractTemplates;
    return templates[Math.floor(Math.random() * templates.length)];
  }

  function spawnContract() {
    const s = STATE.get();
    if (s.offeredContracts.length >= 3) return; // limite de ofertas simultâneas
    const tpl = pickTemplate();
    const variance = 0.85 + Math.random() * 0.3; // ±15-30%
    const stageMult = 1 + ECONOMY.getCurrentStage().id * 0.5;

    const contract = {
      uid: 'c_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      templateId: tpl.id,
      key: tpl.key,
      value: Math.ceil(tpl.baseValue * variance * stageMult),
      duration: tpl.baseDuration,
      difficulty: tpl.difficulty,
      successRate: GAME_DATA.difficultySuccessRate[tpl.difficulty],
      repReward: GAME_DATA.difficultyRepReward[tpl.difficulty],
      offeredAt: Date.now(),
    };
    s.offeredContracts.push(contract);
  }

  function canAccept(contract) {
    const s = STATE.get();
    return s.clientsAvailable >= 1; // custo simples: consome 1 "lote" de clientes
  }

  function accept(uid) {
    const s = STATE.get();
    const idx = s.offeredContracts.findIndex(c => c.uid === uid);
    if (idx === -1) return false;
    const contract = s.offeredContracts[idx];
    if (!canAccept(contract)) return false;

    s.clientsAvailable = Math.max(0, s.clientsAvailable - 1);
    s.offeredContracts.splice(idx, 1);
    contract.startedAt = Date.now();
    contract.endsAt = Date.now() + contract.duration * 1000;
    s.activeContracts.push(contract);
    return true;
  }

  function decline(uid) {
    const s = STATE.get();
    s.offeredContracts = s.offeredContracts.filter(c => c.uid !== uid);
  }

  // Retorna lista de resultados resolvidos neste tick: { contract, success }
  function resolveFinished() {
    const s = STATE.get();
    const now = Date.now();
    const finished = s.activeContracts.filter(c => c.endsAt <= now);
    if (finished.length === 0) return [];

    const results = [];
    finished.forEach(contract => {
      const repMult = ECONOMY.getReputationMultiplier();
      const success = Math.random() < contract.successRate;
      if (success) {
        const earned = Math.ceil(contract.value * repMult);
        s.money += earned;
        s.totalEarned += earned;
        s.reputation += contract.repReward;
        s.stats.contractsCompleted++;
        results.push({ contract, success: true, earned });
      } else {
        s.reputation = Math.max(0, s.reputation - Math.ceil(contract.repReward / 2));
        s.stats.contractsFailed++;
        results.push({ contract, success: false, earned: 0 });
      }
    });

    s.activeContracts = s.activeContracts.filter(c => c.endsAt > now);
    return results;
  }

  function tick() {
    if (Date.now() >= nextSpawnAt) {
      spawnContract();
      scheduleNextSpawn();
    }
    return resolveFinished();
  }

  function init() {
    scheduleNextSpawn();
  }

  return { init, tick, accept, decline, canAccept, spawnContract };
})();
