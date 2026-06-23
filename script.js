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

// Sistema da M.I.N.D. (Diálogos Dinâmicos Fixos)
const mindDialogos = {
    inicial: "M.I.N.D. conectada. Olá, Criador. O sistema da garagem está operacional, mas obsoleto. Recomendo começar a devizar imediatamente.",
    poucoCodigo: "Detetei atividade no terminal. Estamos progredindo, mas o ritmo atual de dados ainda é insignificante para as grandes corporações.",
    medioCodigo: "Análise quantitativa: A estrutura de dados está a expandir-se. Seus algoritmos chamam a atenção na rede subterrânea.",
    muitoCodigo: "Alerta de expansão! A quantidade de dados produzidos ultrapassou a barreira local. Estamos prontos para a transição corporativa."
};

// Variavel de controle para não sobrepor diálogos de eventos com os normais
let emEvento = false;

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

// Função para atualizar as falas padrão da M.I.N.D.
function atualizarMensagemMind() {
    if (!characterMessage || emEvento) return; // Se estiver rolando um evento, não muda o texto
    
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
        localStorage.setItem('mindForgeSaveDataV4', JSON.stringify(gameData));
    } catch (e) {
        console.log("Erro ao salvar progresso:", e);
    }
}

// Função para Carregar o Progresso
function loadGame() {
    try {
        const savedData = localStorage.getItem('mindForgeSaveDataV4');
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

// ==========================================
// SISTEMA DE EVENTOS ALEATÓRIOS (NOVO!)
// ==========================================
function rodarEventoAleatorio() {
    if (!characterMessage) return;

    // Sorteia um número de 1 a 3
    let chance = Math.floor(Math.random() * 3) + 1;

    if (chance === 1) {
        // EVENTO RUIM: Ataque Hacker (Só acontece se tiver tokens)
        if (gameData.tokens >= 15) {
            emEvento = true;
            gameData.tokens -= 15;
            characterMessage.textContent = "⚠️ ALERTA: Um grupo de script-kiddies invadiu nossa rede! Eles roubaram 15 Tokens de dados antes que eu pudesse bloqueá-los.";
            updateDisplay();
            saveGame();
            
            // Depois de 7 segundos, o aviso some e a M.I.N.D. volta ao normal
            setTimeout(() => { emEvento = false; atualizarMensagemMind(); }, 7000);
        }
    } else if (chance === 2) {
        // EVENTO BOM: Contrato Freelance
        emEvento = true;
        let bonus = 25.0;
        gameData.money += bonus;
        characterMessage.textContent = "💎 BÔNUS: Um fórum underground comprou nossa API de criptografia. Recebemos um bônus anônimo de R$ 25.00!";
        updateDisplay();
        saveGame();

        setTimeout(() => { emEvento = false; atualizarMensagemMind(); }, 7000);
    }
    // Se sair o número 3, nada acontece (sistema está estável)
}

// Executa a tentativa de evento a cada 30 segundos (30000 milissegundos)
setInterval(rodarEventoAleatorio, 30000);


// ==========================================
// GATILHOS DOS BOTÕES
// ==========================================
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

// Loop automático dos bots
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
