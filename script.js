// Estado do jogo
let gameData = {
    tokens: 0,
    money: 0.0,
    tokensPerClick: 1,
    autoBots: 0,
    currentPhase: 1 // Começa na Fase 1 (Garagem)
};

// Elementos da tela
const clickBtn = document.getElementById('click-btn');
const sellBtn = document.getElementById('sell-btn');
const buyNotebookBtn = document.getElementById('buy-notebook-btn');
const buyBotBtn = document.getElementById('buy-bot-btn');
const buyOfficeBtn = document.getElementById('buy-office-btn'); // Novo botão da fase 2

const dataCountDisplay = document.getElementById('data-count');
const moneyDisplay = document.getElementById('money-display');
const locationTitle = document.getElementById('location-title');
const narrativeText = document.getElementById('narrative-text');
const phaseUpgradeBox = document.getElementById('phase-upgrade-box');

// Função para aplicar os efeitos visuais e mecânicos das fases
function applyPhaseEffects() {
    if (gameData.currentPhase === 1) {
        document.body.className = "fase-garagem";
        if (locationTitle) locationTitle.textContent = "Garagem Inicial";
        if (phaseUpgradeBox) phaseUpgradeBox.style.display = "block"; // Mostra o upgrade de mudança
    } else if (gameData.currentPhase === 2) {
        document.body.className = "fase-escritorio";
        if (locationTitle) locationTitle.textContent = "Escritório Co-working";
        if (narrativeText) {
            narrativeText.textContent = "Ano 2026. Adeus garagem fria! Agora você opera em uma mesa moderna de vidro, cercado por luzes de LED azuladas e outros tech-founders dedicados. Seus servidores estão refrigerados e sua rede voa. O mercado começou a notar seu império!";
        }
        if (phaseUpgradeBox) phaseUpgradeBox.style.display = "none"; // Esconde o botão após comprar
    }
}

// Função para atualizar os valores na interface de forma segura
function updateDisplay() {
    if (dataCountDisplay) dataCountDisplay.textContent = gameData.tokens;
    if (moneyDisplay) moneyDisplay.textContent = `R$ ${gameData.money.toFixed(2)}`;
}

// Função para Salvar o Progresso com verificação
function saveGame() {
    try {
        localStorage.setItem('mindForgeSaveDataV2', JSON.stringify(gameData));
    } catch (e) {
        console.log("Erro ao salvar progresso:", e);
    }
}

// Função para Carregar o Progresso
function loadGame() {
    try {
        const savedData = localStorage.getItem('mindForgeSaveDataV2');
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

// Comprar Notebook (Custa R$ 15.00)
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

// Comprar Bot (Custa R$ 50.00)
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

// Alugar Escritório Co-working (Custa R$ 200.00) - EVOLUÇÃO DE FASE
if (buyOfficeBtn) {
    buyOfficeBtn.addEventListener('click', () => {
        if (gameData.money >= 200.0) {
            gameData.money -= 200.0;
            gameData.currentPhase = 2; // Passa para a Fase 2!
            applyPhaseEffects();
            updateDisplay();
            saveGame();
            alert('Parabéns! Você evoluiu para a Fase 2: Escritório Co-working! Seus bots agora trabalham com dobro de eficiência!');
        } else {
            alert('Você precisa de R$ 200.00 para alugar o escritório!');
        }
    });
}

// Loop automático (geração por bots)
setInterval(() => {
    if (gameData.autoBots > 0) {
        // Se estiver na fase 2, os bots produzem o DOBRO (autoBots * 2) por segundo!
        let production = gameData.currentPhase === 2 ? gameData.autoBots * 2 : gameData.autoBots;
        gameData.tokens += production;
        updateDisplay();
        saveGame();
    }
}, 1000);

// Executa o carregamento inicial assim que o script rodar
loadGame();
