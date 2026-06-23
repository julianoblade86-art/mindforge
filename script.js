// ==========================================
// CENTRAL DE SPREAD DO JOGO (ESTADO ESTÁVEL)
// ==========================================
// ==========================================
// CENTRAL DE SPREAD DO JOGO (ESTADO ESTÁVEL)
// ==========================================
let gameData = {
    tokens: 0,
    money: 0.0,
    tokensPerClick: 1,
    autoBots: 0,
    currentPhase: 1
};


// Banco de Dados da M.I.N.D. (Diálogos Imersivos)
const mindDialogos = {
    inicial: "M.I.N.D. conectada. Olá, Criador. O sistema da garagem está operacional, mas obsoleto. Recomendo começar a devizar imediatamente.",
    poucoCodigo: "Detetei atividade no terminal. Estamos progredindo, mas o ritmo atual de dados ainda é insignificante para as grandes corporações.",
    medioCodigo: "Análise quantitativa: A estrutura de dados está a expandir-se. Seus algoritmos chamam a atenção na rede subterrânea.",
    muitoCodigo: "Alerta de expansão! A quantidade de dados produzidos ultrapassou a barreira local. Estamos prontos para a transição corporativa.",
    fase3Global: "Status Global: Nossos servidores quânticos foram interligados. Controlamos o fluxo de dados mundial. O mercado se curva ao nosso código."
};

let emEvento = false;

// Mapeamento Seguro do DOM
const DOM = {
    clickBtn: document.getElementById('click-btn'),
    sellBtn: document.getElementById('sell-btn'),
    buyNotebookBtn: document.getElementById('buy-notebook-btn'),
    buyBotBtn: document.getElementById('buy-bot-btn'),
    buyOfficeBtn: document.getElementById('buy-office-btn'),
    buyCorporateBtn: document.getElementById('buy-corporate-btn'),
    dataCount: document.getElementById('data-count'),
    moneyDisplay: document.getElementById('money-display'),
    locationTitle: document.getElementById('location-title'),
    narrativeText: document.getElementById('narrative-text'),
    phaseUpgradeBox: document.getElementById('phase-upgrade-box'),
    corporateUpgradeBox: document.getElementById('corporate-upgrade-box'),
    characterMessage: document.getElementById('character-message')
};

// Renderizador de Fases e Ambientes
function applyPhaseEffects() {
    if (gameData.currentPhase === 1) {
        document.body.className = "fase-garagem";
        if (DOM.locationTitle) DOM.locationTitle.textContent = "Garagem Inicial";
        if (DOM.phaseUpgradeBox) DOM.phaseUpgradeBox.style.display = "block";
        if (DOM.corporateUpgradeBox) DOM.corporateUpgradeBox.style.display = "none";
    } else if (gameData.currentPhase === 2) {
        document.body.className = "fase-escritorio";
        if (DOM.locationTitle) DOM.locationTitle.textContent = "Escritório Co-working";
        if (DOM.narrativeText) {
            DOM.narrativeText.textContent = "Ano 2026. Adeus garagem fria! Agora você opera em uma mesa moderna de vidro, cercado por luzes de LED azuladas e outros tech-founders dedicados. Seus servidores estão refrigerados e sua rede voa. O mercado começou a notar seu império!";
        }
        if (DOM.phaseUpgradeBox) DOM.phaseUpgradeBox.style.display = "none";
        if (DOM.corporateUpgradeBox) DOM.corporateUpgradeBox.style.display = "block";
    } else if (gameData.currentPhase === 3) {
        document.body.className = "fase-corporativa";
        if (DOM.locationTitle) DOM.locationTitle.textContent = "Sede Corporativa Mundial";
        if (DOM.narrativeText) {
            DOM.narrativeText.textContent = "Império Consolidado. Você comanda o mercado tecnológico direto do topo de um arranha-céu luxuoso em Tóquio. Paredes de grafite escuro, detalhes em ouro quântico e supercomputadores que processam exabytes de informação por segundo.";
        }
        if (DOM.phaseUpgradeBox) DOM.phaseUpgradeBox.style.display = "none";
        if (DOM.corporateUpgradeBox) DOM.corporateUpgradeBox.style.display = "none";
    }
}

// Gerenciador de Inteligência da IA
function atualizarMensagemMind() {
    if (!DOM.characterMessage || emEvento) return;
    
    if (gameData.currentPhase === 3) {
        DOM.characterMessage.textContent = mindDialogos.fase3Global;
    } else if (gameData.tokens === 0 && gameData.money === 0) {
        DOM.characterMessage.textContent = mindDialogos.inicial;
    } else if (gameData.tokens > 0 && gameData.tokens < 50) {
        DOM.characterMessage.textContent = mindDialogos.poucoCodigo;
    } else if (gameData.tokens >= 50 && gameData.tokens < 200) {
        DOM.characterMessage.textContent = mindDialogos.medioCodigo;
    } else if (gameData.tokens >= 200) {
        DOM.characterMessage.textContent = mindDialogos.muitoCodigo;
    }
}

function updateDisplay() {
    if (DOM.dataCount) DOM.dataCount.textContent = gameData.tokens;
    if (DOM.moneyDisplay) DOM.moneyDisplay.textContent = `R$ ${gameData.money.toFixed(2)}`;
    atualizarMensagemMind();
}

// Módulo de Armazenamento Seguro (Anti-Bug)
function saveGame() {
    try {
        localStorage.setItem('mindForgeCoreSave_v5', JSON.stringify(gameData));
    } catch (e) {
        console.error("Falha no barramento do LocalStorage:", e);
    }
}

function loadGame() {
    try {
        const savedData = localStorage.getItem('mindForgeCoreSave_v5');
        if (savedData) {
            const parsed = JSON.parse(savedData);
            Object.assign(gameData, parsed);
        }
    } catch (e) {
        console.error("Falha ao descriptografar registros locais:", e);
    }
    applyPhaseEffects();
    updateDisplay();
}

// Algoritmo de Eventos Dinâmicos
function rodarEventoAleatorio() {
    if (!DOM.characterMessage || gameData.currentPhase === 3) return;

    const chance = Math.floor(Math.random() * 3) + 1;

    if (chance === 1 && gameData.tokens >= 15) {
        emEvento = true;
        gameData.tokens -= 15;
        DOM.characterMessage.textContent = "⚠️ ALERTA: Um grupo de script-kiddies invadiu nossa rede! Eles roubaram 15 Tokens de dados.";
        updateDisplay();
        saveGame();
        setTimeout(() => { emEvento = false; atualizarMensagemMind(); }, 6000);
    } else if (chance === 2) {
        emEvento = true;
        gameData.money += 25.0;
        DOM.characterMessage.textContent = "💎 BÔNUS: Um fórum underground comprou nossa API. Recebemos um bônus anônimo de R$ 25.00!";
        updateDisplay();
        saveGame();
        setTimeout(() => { emEvento = false; atualizarMensagemMind(); }, 6000);
    }
}
setInterval(rodarEventoAleatorio, 30000);

// Core de Escuta dos Inputs (Event Listeners)
if (DOM.clickBtn) {
    DOM.clickBtn.addEventListener('click', () => {
        gameData.tokens += gameData.tokensPerClick;
        updateDisplay();
        saveGame();
    });
}

if (DOM.sellBtn) {
    DOM.sellBtn.addEventListener('click', () => {
        if (gameData.tokens >= 10) {
            gameData.tokens -= 10;
            gameData.money += 5.0;
            updateDisplay();
            saveGame();
        } else {
            alert('Você precisa de pelo menos 10 Tokens para vender dados!');
        }
    });
}

if (DOM.buyNotebookBtn) {
    DOM.buyNotebookBtn.addEventListener('click', () => {
        if (gameData.money >= 15.0) {
            gameData.money -= 15.0;
            gameData.tokensPerClick += 1;
            updateDisplay();
            saveGame();
            alert('Notebook Avançado comprado!');
        } else {
            alert('Saldo insuficiente!');
        }
    });
}

if (DOM.buyBotBtn) {
    DOM.buyBotBtn.addEventListener('click', () => {
        if (gameData.money >= 50.0) {
            gameData.money -= 50.0;
            gameData.autoBots += 1;
            updateDisplay();
            saveGame();
            alert('Bot Otimizador comprado!');
        } else {
            alert('Saldo insuficiente!');
        }
    });
}

if (DOM.buyOfficeBtn) {
    DOM.buyOfficeBtn.addEventListener('click', () => {
        if (gameData.money >= 200.0) {
            gameData.money -= 200.0;
            gameData.currentPhase = 2;
            applyPhaseEffects();
            updateDisplay();
            saveGame();
            alert('Parabéns! Você evoluiu para a Fase 2: Escritório Co-working!');
        } else {
            alert('Você precisa de R$ 200.00 para alugar o escritório!');
        }
    });
}

if (DOM.buyCorporateBtn) {
    DOM.buyCorporateBtn.addEventListener('click', () => {
        if (gameData.money >= 1000.0) {
            gameData.money -= 1000.0;
            gameData.currentPhase = 3;
            applyPhaseEffects();
            updateDisplay();
            saveGame();
            alert('Épico! Seu império se tornou global. Bem-vindo à Sede Corporativa Mundial!');
        } else {
            alert('Você precisa de R$ 1000.00 para construir a Sede!');
        }
    });
}

// Loop Síncrono de Automação
setInterval(() => {
    if (gameData.autoBots > 0) {
        let multiplier = 1;
        if (gameData.currentPhase === 2) multiplier = 2;
        if (gameData.currentPhase === 3) multiplier = 4;
        
        gameData.tokens += (gameData.autoBots * multiplier);
        updateDisplay();
        saveGame();
    }
}, 1000);

// Ignição do Sistema
loadGame();
