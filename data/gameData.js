// MindForge: AI Tycoon — Game Data (definições estáticas)
// Todos os valores numéricos de balanceamento vivem aqui.

const GAME_DATA = {

  // ---------- FUNCIONÁRIOS ----------
  // type: 'money' = produção direta em $/s | 'clients' = gera clientes/s
  employees: [
    {
      id: 'intern',
      nameKey: 'employee_intern_name',
      descKey: 'employee_intern_desc',
      baseCost: 10,
      costGrowth: 1.15,
      baseProduction: 1,
      type: 'money',
      load: 1,
      icon: '🧑‍🎓',
      unlockStage: 0,
      demoAvailable: true,
    },
    {
      id: 'developer',
      nameKey: 'employee_dev_name',
      descKey: 'employee_dev_desc',
      baseCost: 100,
      costGrowth: 1.15,
      baseProduction: 8,
      type: 'money',
      load: 2,
      icon: '👨‍💻',
      unlockStage: 0,
      demoAvailable: true,
    },
    {
      id: 'sales',
      nameKey: 'employee_sales_name',
      descKey: 'employee_sales_desc',
      baseCost: 80,
      costGrowth: 1.15,
      baseProduction: 0.3,
      type: 'clients',
      load: 1,
      icon: '🧑‍💼',
      unlockStage: 0,
      demoAvailable: true,
    },
    {
      id: 'specialist',
      nameKey: 'employee_specialist_name',
      descKey: 'employee_specialist_desc',
      baseCost: 1200,
      costGrowth: 1.16,
      baseProduction: 35,
      type: 'money',
      load: 4,
      icon: '🧠',
      unlockStage: 1,
      demoAvailable: false, // só na versão completa
    },
  ],

  // ---------- MODELOS DE IA (pesquisa) ----------
  aiModels: [
    { id: 0, key: 'model_0', researchCost: 0,      bonusPercent: 0,  demoAvailable: true },
    { id: 1, key: 'model_1', researchCost: 500,    bonusPercent: 25, demoAvailable: true },
    { id: 2, key: 'model_2', researchCost: 8000,   bonusPercent: 25, demoAvailable: true },
    { id: 3, key: 'model_3', researchCost: 150000, bonusPercent: 25, demoAvailable: false },
    { id: 4, key: 'model_4', researchCost: 2500000,bonusPercent: 25, demoAvailable: false },
    { id: 5, key: 'model_5', researchCost: 50000000,bonusPercent: 25, demoAvailable: false },
  ],

  // ---------- FASES DA EMPRESA ----------
  stages: [
    { id: 0, key: 'stage_0', threshold: 0 },
    { id: 1, key: 'stage_1', threshold: 1000 },
    { id: 2, key: 'stage_2', threshold: 25000 },
    { id: 3, key: 'stage_3', threshold: 250000 },
    { id: 4, key: 'stage_4', threshold: 5000000 },
  ],

  // ---------- PAÍSES ----------
  countries: [
    { id: 'br', key: 'country_br', cost: 0,      multiplier: 1.0, demoAvailable: true,  startActive: true },
    { id: 'us', key: 'country_us', cost: 5000,   multiplier: 1.8, demoAvailable: true,  startActive: false },
    { id: 'es', key: 'country_es', cost: 15000,  multiplier: 1.4, demoAvailable: true,  startActive: false },
    { id: 'jp', key: 'country_jp', cost: 50000,  multiplier: 2.2, demoAvailable: false, startActive: false },
    { id: 'de', key: 'country_de', cost: 120000, multiplier: 2.0, demoAvailable: false, startActive: false },
    { id: 'fr', key: 'country_fr', cost: 200000, multiplier: 1.9, demoAvailable: false, startActive: false },
    { id: 'kr', key: 'country_kr', cost: 500000, multiplier: 2.6, demoAvailable: false, startActive: false },
    { id: 'cn', key: 'country_cn', cost: 2000000,multiplier: 3.5, demoAvailable: false, startActive: false },
  ],

  // ---------- CONTRATOS (templates) ----------
  contractTemplates: [
    { id: 'chatbot',    key: 'contract_chatbot',    baseValue: 50,   baseDuration: 12, difficulty: 'easy' },
    { id: 'automation', key: 'contract_automation', baseValue: 150,  baseDuration: 18, difficulty: 'medium' },
    { id: 'support',    key: 'contract_support',    baseValue: 90,   baseDuration: 14, difficulty: 'easy' },
    { id: 'finance',    key: 'contract_finance',    baseValue: 400,  baseDuration: 25, difficulty: 'hard' },
    { id: 'medical',    key: 'contract_medical',    baseValue: 700,  baseDuration: 30, difficulty: 'hard' },
  ],

  difficultySuccessRate: {
    easy: 0.92,
    medium: 0.78,
    hard: 0.60,
  },

  difficultyRepReward: {
    easy: 1,
    medium: 3,
    hard: 7,
  },

  // ---------- EVENTOS ALEATÓRIOS ----------
  events: [
    { id: 'viral',        titleKey: 'event_viral_title',        descKey: 'event_viral_desc',        positive: true,  weight: 20, effect: 'clientBoost' },
    { id: 'investment',   titleKey: 'event_investment_title',   descKey: 'event_investment_desc',   positive: true,  weight: 18, effect: 'flatMoney' },
    { id: 'megacontract', titleKey: 'event_megacontract_title', descKey: 'event_megacontract_desc', positive: true,  weight: 10, effect: 'megaContract' },
    { id: 'serverdown',   titleKey: 'event_serverdown_title',   descKey: 'event_serverdown_desc',   positive: false, weight: 18, effect: 'productionPenalty' },
    { id: 'employeeleft', titleKey: 'event_employeeleft_title', descKey: 'event_employeeleft_desc', positive: false, weight: 14, effect: 'loseEmployee' },
    { id: 'crisis',       titleKey: 'event_crisis_title',       descKey: 'event_crisis_desc',       positive: false, weight: 12, effect: 'earningsPenalty' },
  ],

  // ---------- CONFIG GERAL ----------
  config: {
    demoMoneyCap: 1000000,
    tickIntervalMs: 100,
    autosaveIntervalMs: 30000,
    contractSpawnMinMs: 15000,
    contractSpawnMaxMs: 25000,
    eventIntervalMinMs: 45000,
    eventIntervalMaxMs: 90000,
    baseServerCapacity: 100,
    serverUpgradeBaseCost: 200,
    serverUpgradeCostGrowth: 1.4,
    serverUpgradeCapacityGain: 50,
    overloadPenalty: 0.30, // -30% produção quando sobrecarregado
    prestigeMinMoney: 5000000,
    repBonusPerPoint: 0.01, // +1% $ por contrato por ponto de reputação
  },
};
