// ==========================================
// ESTADO DO JOGO (VARIÁVEIS)
// ==========================================
let gameData = {
    tokens: 0,
    money: 0.0,
    tokensPerClick: 1,
    autoBots: 0,
    currentPhase: 1 // Começa na Fase 1 (Garagem)
};

// Sistema da M.I.N.D. (Diálogos Dinâmicos)
const mindDialogos = {
    inicial: "M.I.N.D. conectada. Olá, Criador. O sistema da garagem está operacional, mas obsoleto. Recomendo começar a devizar imediatamente.",
    poucoCodigo: "Detetei atividade no terminal. Estamos progredindo, mas o ritmo atual de dados ainda é insignificante para as grandes corporações.",
    medioCodigo: "Análise quantitativa: A estrutura de dados está a expandir-se. Seus algoritmos chamam a atenção na rede subterrânea.",
    muitoCodigo: "Alerta de expansão! A quantidade de dados produzidos ultrapassou a barreira local. Estamos prontos para a transição corporativa."
};

// Elementos da Interface (DOM)
const clickBtn = document.getElementById('click-btn');
const sellBtn = document.getElementById('sell-btn');
const buyNotebookBtn = document.getElementById('buy-notebook-btn');
const buyBotBtn = document.getElementById('buy-bot-btn');
const buyOfficeBtn = document.getElementById('buy-office-btn');

const dataCountDisplay = document.getElementById('data-count');
const moneyDisplay = document.getElementById('money-display');
const locationTitle = document.getElementById('location-title');
const narrativeText = document.getElementById('narrative-text');
const phaseUpgradeBox = document.getElementById('phase-upgrade-box');
const characterMessage = document.getElementById('character-message');

// Função para aplicar os efeitos visuais e mecânicos das fases
function applyPhaseEffects() {
    if (gameData.currentPhase === 1) {
        document.body.className = "fase-garagem";
        if (locationTitle) locationTitle.textContent = "Garagem Inicial";
        if (phaseUpgradeBox) phaseUpgradeBox.style.display = "block";
    } else if (gameData.currentPhase === 2) {
        document.body.className = "fase-escritorio";
        if (locationTitle) locationTitle.textContent = "Escritório Co-working";
        if (narrativeText) {
            narrativeText.textContent = "Ano 2026. Adeus garagem fria! Agora você opera em uma mesa moderna de vidro, cercado por luzes de LED azuladas e outros tech-founders dedicados. Seus servidores estão refrigerados e sua rede voa. O mercado começou a notar seu império!";
        }
        if (phaseUpgradeBox) phaseUpgradeBox.style.display = "none";
    }
}

// Função para atualizar as falas da M.I.N.D.
function atualizarMensagemMind() {
    if (!characterMessage) return;
    
    if (gameData.tokens === 0 && gameData.money === 0) {
        characterMessage.textContent = mindDialogos.inicial;
    } else if (gameData.tokens > 0 && gameData.tokens < 50) {
        characterMessage.textContent = mindDialogos.poucoCodigo;
    } else if (gameData.tokens >= 50 && gameData.tokens < 200) {
        characterMessage.textContent = mindDialogos.medioCodigo;
    } else if (gameData.tokens >= 200) {
        characterMessage.textContent = mindDialogos.muitoCodigo;
    }
}

// Função para atualizar os valores na interface de forma segura
function updateDisplay() {
    if (dataCountDisplay) dataCountDisplay.textContent = gameData.tokens;
    if (moneyDisplay) moneyDisplay.textContent = `R$ ${gameData.money.toFixed(2)}`;
    atualizarMensagemMind();
}

// Função para Salvar o Progresso
function saveGame() {
    try {
        localStorage.setItem('mindForgeSaveDataV3', JSON.stringify(gameData));
    } catch (e) {
        console.log("Erro ao salvar progresso:", e);
    }
}

// Função para Carregar o Progresso
function loadGame() {
    try {
        const savedData = localStorage.getItem('mindForgeSaveDataV3');
        if (savedData) {
            const parsed = JSON.parse(savedData);
            if (parsed.tokens !== undefined) gameData.tokens = parsed.tokens;
            if (parsed.money !== undefined) gameData.money = parsed.money;
            if (parsed.tokensPerClick !== undefined) gameData.tokensPerClick = parsed.tokensPerClick;
            if (parsed.autoBots !== undefined) gameData.autoBots = parsed.autoBots;
            if (parsed.currentPhase !== undefined) gameData.currentPhase = parsed.currentPhase;
        }
    } catch (e) {
        console.log("Erro ao carregar progresso:", e);
    }
    applyPhaseEffects();
    updateDisplay();
}

// Botão principal: Gerar Dados
if (clickBtn) {
    clickBtn.addEventListener('click', () => {
        gameData.tokens += gameData.tokensPerClick;
        updateDisplay();
        saveGame();
    });
}

// Botão de Vender Dados
if (sellBtn) {
    sellBtn.addEventListener('click', () => {
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

// Comprar Notebook
if (buyNotebookBtn) {
    buyNotebookBtn.addEventListener('click', () => {
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

// Comprar Bot
if (buyBotBtn) {
    buyBotBtn.addEventListener('click', () => {
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

// Alugar Escritório Co-working (Fase 2)
if (buyOfficeBtn) {
    buyOfficeBtn.addEventListener('click', () => {
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

// Loop automático (geração por bots)
setInterval(() => {
    if (gameData.autoBots > 0) {
        let production = gameData.currentPhase === 2 ? gameData.autoBots * 2 : gameData.autoBots;
        gameData.tokens += production;
        updateDisplay();
        saveGame();
    }
}, 1000);

// Carregamento inicial
loadGame();
