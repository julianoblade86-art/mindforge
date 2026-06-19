// MindForge: AI Tycoon — Rival / market share system
const RIVAL = (() => {

  // Chamado a cada tick com deltaSeconds
  function update(deltaSeconds) {
    const s = STATE.get();
    const ms = s.marketShare;

    // Rival cresce devagar organicamente
    const rivalGrowth = 0.05 * deltaSeconds;

    // Jogador ganha share proporcional à sua produção (normalizada) — cresce mais rápido quanto mais a empresa produz
    const production = ECONOMY.getMoneyProductionPerSecond();
    const playerGrowth = Math.min(0.4, production / 2000) * deltaSeconds;

    ms.player = Math.min(95, ms.player + playerGrowth);
    ms.rival = Math.max(5, 100 - ms.player);

    // leve correção: se rival "deveria" crescer mas jogador está estagnado
    if (playerGrowth < rivalGrowth * 0.1) {
      ms.player = Math.max(2, ms.player - rivalGrowth * 0.2);
      ms.rival = Math.min(98, 100 - ms.player);
    }
  }

  // Chamado quando jogador fecha contrato grande/evento positivo — "rouba" market share
  function stealShare(amount) {
    const s = STATE.get();
    const ms = s.marketShare;
    ms.player = Math.min(95, ms.player + amount);
    ms.rival = Math.max(5, 100 - ms.player);
  }

  return { update, stealShare };
})();
