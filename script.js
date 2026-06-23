// Estado do jogo
let gameData = {
    tokens: 0,
    money: 0.0,
    tokensPerClick: 1,
    autoBots: 0
};

// Elementos da tela
const clickBtn = document.getElementById('click-btn');
const sellBtn = document.getElementById('sell-btn');
const buyNotebookBtn = document.getElementById('buy-notebook-btn');
const buyBotBtn = document.getElementById('buy-bot-btn');
const dataCountDisplay = document.getElementById('data-count');
const moneyDisplay = document.getElementById('money-display');

// Função para atualizar os valores na interface de forma segura
function updateDisplay() {
    if (dataCountDisplay) {
        dataCountDisplay.textContent = gameData.tokens;
    }
    if (moneyDisplay) {
        moneyDisplay.textContent = `R$ ${gameData.money.toFixed(2)}`;
    }
}

// Função para Salvar o Progresso com verificação
function saveGame() {
    try {
        localStorage.setItem('mindForgeSaveData', JSON.stringify(gameData));
    } catch (e) {
        console.log("Erro ao salvar progresso:", e);
    }
}

// Função para Carregar o Progresso
function loadGame() {
    try {
        const savedData = localStorage.getItem('mindForgeSaveData');
        if (savedData) {
            const parsed = JSON.parse(savedData);
            // Garante que se faltar alguma variável nova no save antigo, o jogo não quebra
            if (parsed.tokens !== undefined) gameData.tokens = parsed.tokens;
            if (parsed.money !== undefined) gameData.money = parsed.money;
            if (parsed.tokensPerClick !== undefined) gameData.tokensPerClick = parsed.tokensPerClick;
            if (parsed.autoBots !== undefined) gameData.autoBots = parsed.autoBots;
        }
    } catch (e) {
        console.log("Erro ao carregar progresso:", e);
    }
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

// Loop automático (geração por bots a cada 1 segundo)
setInterval(() => {
    if (gameData.autoBots > 0) {
        gameData.tokens += gameData.autoBots;
        updateDisplay();
        saveGame();
    }
}, 1000);

// Executa o carregamento inicial assim que o script rodar
loadGame();
