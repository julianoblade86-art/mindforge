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
    muitoCodigo: "Alerta de expansão! A quantidade de dados produzidos ultrapassou a barreira local. Estamos prontos para a transição corporativa.",
    fase3Global: "Status Global: Nossos servidores quânticos foram interligados. Controlamos o fluxo de dados mundial. O mercado se curva ao nosso código."
};

let emEvento = false;

// Elementos da Interface (DOM)
const clickBtn = document.getElementById('click-btn');
const sellBtn = document.getElementById('sell-btn');
const buyNotebookBtn = document.getElementById('buy-notebook-btn');
const buyBotBtn = document.getElementById('buy-bot-btn');
const buyOfficeBtn = document.getElementById('buy-office-btn');
const buyCorporateBtn = document.getElementById('buy-corporate-btn'); // Novo!

const dataCountDisplay = document.getElementById('data-count');
const moneyDisplay = document.getElementById('money-display');
const locationTitle = document.getElementById('location-title');
const narrativeText = document.getElementById('narrative-text');
const phaseUpgradeBox = document.getElementById('phase-upgrade-box');
const corporateUpgradeBox = document.getElementById('corporate-upgrade-box'); // Novo!
const characterMessage = document.getElementById('character-message');

// Função para aplicar os efeitos visuais e mecânicos das fases
function applyPhaseEffects() {
    if (gameData.currentPhase === 1) {
        document.body.className = "fase-garagem";
        if (locationTitle) locationTitle.textContent = "Garagem Inicial";
        if (phaseUpgradeBox) phaseUpgradeBox.style.display = "block";
        if (corporateUpgradeBox) corporateUpgradeBox.style.display = "none";
    } else if (gameData.currentPhase === 2) {
        document.body.className = "fase-escritorio";
        if (locationTitle) locationTitle.textContent = "Escritório Co-working";
        if (narrativeText) {
            narrativeText.textContent = "Ano 2026. Adeus garagem fria! Agora você opera em uma mesa moderna de vidro, cercado por luzes de LED azuladas e outros tech-founders dedicados. Seus servidores estão refrigerados e sua rede voa. O mercado começou a notar seu império!";
        }
        if (phaseUpgradeBox) phaseUpgradeBox.style.display = "none";
        if (corporateUpgradeBox) corporateUpgradeBox.style.display = "block"; // Libera botão da Fase 3
    } else if (gameData.currentPhase === 3) {
        document.body.className = "fase-corporativa";
        if (locationTitle) locationTitle.textContent = "Sede Corporativa Mundial";
        if (narrativeText) {
            narrativeText.textContent = "Império Consolidado. Você comanda o mercado tecnológico direto do topo de um arranha-céu luxuoso em Tóquio. Paredes de grafite escuro, detalhes em ouro quântico e supercomputadores que processam exabytes de informação por segundo.";
        }
        if (phaseUpgradeBox) phaseUpgradeBox.style.display = "none";
        if (corporateUpgradeBox) corporateUpgradeBox.style.display = "none"; // Some com o botão comprado
    }
}

// Função para atualizar as falas da M.I.N.D.
function atualizarMensagemMind() {
    if (!characterMessage || emEvento) return;
    
    if (gameData.currentPhase === 3) {
        characterMessage.textContent = mindDialogos.fase3Global;
    } else if (gameData.tokens === 0 && gameData.money === 0) {
        characterMessage.textContent = mindDialogos.inicial;
    } else if (gameData.tokens > 0 && gameData.tokens < 50) {
        characterMessage.textContent = mindDialogos.poucoCodigo;
    } else if (gameData.tokens >= 50 && gameData.tokens < 200) {
        characterMessage.textContent = mindDialogos.medioCodigo;
    } else if (gameData.tokens >= 200) {
        characterMessage.textContent = mindDialogos.muitoCodigo;
    }
}

// Função para atualizar os valores na interface
function updateDisplay() {
    if (dataCountDisplay) dataCountDisplay.textContent = gameData.tokens;
    if (moneyDisplay) moneyDisplay.textContent = `R$ ${gameData.money.toFixed(2)}`;
    atualizarMensagemMind();
}

// Salvar e Carregar
function saveGame() {
    try {
        localStorage.setItem('mindForgeSaveDataV5', JSON.stringify(gameData));
    } catch (e) {
        console.log("Erro ao salvar:", e);
    }
}

function loadGame() {
    try {
        const savedData = localStorage.getItem('mindForgeSaveDataV5');
        if (savedData) {
            const parsed = JSON.parse(savedData);
            if (parsed.tokens !== undefined) gameData.tokens = parsed.tokens;
            if (parsed.money !== undefined) gameData.money = parsed.money;
            if (parsed.tokensPerClick !== undefined) gameData.tokensPerClick = parsed.tokensPerClick;
            if (parsed.autoBots !== undefined) gameData.autoBots = parsed.autoBots;
            if (parsed.currentPhase !== undefined) gameData.currentPhase = parsed.currentPhase;
        }
    } catch (e) {
        console.log("Erro ao carregar:", e);
    }
    applyPhaseEffects();
    updateDisplay();
}

// Eventos Aleatórios (Mantenha o sistema divertido ativo)
function rodarEventoAleatorio() {
    if (!characterMessage || gameData.currentPhase === 3) return; // Na fase corporativa os hackers locais não incomodam

    let chance = Math.floor(Math.random() * 3) + 1;

    if (chance === 1) {
        if (gameData.tokens >= 15) {
            emEvento = true;
            gameData.tokens -= 15;
            characterMessage.textContent = "⚠️ ALERTA: Um grupo de script-kiddies invadiu nossa rede! Eles roubaram 15 Tokens de dados.";
            updateDisplay();
            saveGame();
            setTimeout(() => { emEvento = false; atualizarMensagemMind(); }, 6000);
        }
    } else if (chance === 2) {
        emEvento = true;
        gameData.money += 25.0;
        characterMessage.textContent = "💎 BÔNUS: Um fórum underground comprou nossa API. Recebemos um bônus anônimo de R$ 25.00!";
        updateDisplay();
        saveGame();
        setTimeout(() => { emEvento = false; atualizarMensagemMind(); }, 6000);
    }
}
setInterval(rodarEventoAleatorio, 30000);

// Botões Principais
if (clickBtn) {
    clickBtn.addEventListener('click', () => {
        gameData.tokens += gameData.tokensPerClick;
        updateDisplay();
        saveGame();
    });
}

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

// Comprar Notebook e Bots
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

// Evolução de Fases
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

if (buyCorporateBtn) {
    buyCorporateBtn.addEventListener('click', () => {
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

// Loop de Produção dos Bots (Fase 2 duplica, Fase 3 quadriplica!)
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

// Inicialização
loadGame();
