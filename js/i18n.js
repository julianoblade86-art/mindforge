// MindForge: AI Tycoon — i18n system
const I18N = (() => {
  const LANGS = { pt: LANG_PT, en: LANG_EN, es: LANG_ES };
  let current = 'pt';

  function detectInitialLang() {
    const saved = localStorage.getItem('mindforge_lang');
    if (saved && LANGS[saved]) return saved;
    const nav = (navigator.language || 'pt').slice(0, 2).toLowerCase();
    if (LANGS[nav]) return nav;
    return 'pt';
  }

  function setLang(code) {
    if (!LANGS[code]) return;
    current = code;
    localStorage.setItem('mindforge_lang', code);
    document.documentElement.lang = code === 'pt' ? 'pt-BR' : code;
  }

  function getLang() {
    return current;
  }

  // t('key', { value: 'X' }) -> substitui {value} no texto
  function t(key, params) {
    const dict = LANGS[current] || LANGS.pt;
    let str = dict[key];
    if (str === undefined) {
      console.warn(`[i18n] Missing key "${key}" for lang "${current}"`);
      return key;
    }
    if (params) {
      Object.keys(params).forEach(p => {
        str = str.replace(`{${p}}`, params[p]);
      });
    }
    return str;
  }

  function availableLangs() {
    return Object.values(LANGS).map(l => l.meta);
  }

  current = detectInitialLang();

  return { t, setLang, getLang, availableLangs };
})();
