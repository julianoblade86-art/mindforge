// MindForge: AI Tycoon — Game State
const STATE = (() => {
  const SAVE_KEY = 'mindforge_save_v1';
  const IS_DEMO = true; // build da demo. Trocar para false na versão completa.

  function freshState() {
    const countries = {};
    GAME_DATA.countries.forEach(c => { countries[c.id] = !!c.startActive; });

    const employees = {};
    GAME_DATA.employees.forEach(e => { employees[e.id] = 0; });

    return {
      version: 1,
      isDemo: IS_DEMO,
      money: 15,
      totalEarned: 15,
      clientsAvailable: 0,
      reputation: 0,
      aiModelLevel: 0,
      serverUpgrades: 0,
      employees,
      countries,
      marketShare: { player: 8, rival: 92 }, // % — jogador começa pequeno
      activeContracts: [],     // contratos em andamento
      offeredContracts: [],    // contratos esperando aceite
      stats: {
        totalEmployeesHired: 0,
        contractsCompleted: 0,
        contractsFailed: 0,
        timePlayedSec: 0,
        prestigeCount: 0,
      },
      prestigePoints: 0,
      activeModifiers: [],     // { type, value, expiresAt } — efeitos temporários de eventos
      lastSaveAt: Date.now(),
      createdAt: Date.now(),
      hasSeenWelcome: false,
      demoCapReached: false,
    };
  }

  let data = freshState();

  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) { data = freshState(); return false; }
      const parsed = JSON.parse(raw);
      // merge simples para tolerar novos campos em versões futuras
      data = Object.assign(freshState(), parsed);
      // garante que sub-objetos novos não fiquem undefined
      data.employees = Object.assign({}, freshState().employees, parsed.employees);
      data.countries = Object.assign({}, freshState().countries, parsed.countries);
      data.stats = Object.assign({}, freshState().stats, parsed.stats);
      return true;
    } catch (e) {
      console.error('[state] Falha ao carregar save:', e);
      data = freshState();
      return false;
    }
  }

  function save() {
    try {
      data.lastSaveAt = Date.now();
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('[state] Falha ao salvar:', e);
    }
  }

  function reset() {
    localStorage.removeItem(SAVE_KEY);
    data = freshState();
  }

  function get() {
    return data;
  }

  return { load, save, reset, get, SAVE_KEY };
})();
