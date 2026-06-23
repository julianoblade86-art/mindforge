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

// Função para Salvar o Progresso
function saveGame() {
    localStorage.setItem('mindForgeSave', JSON.stringify(gameData));
}

// Função para Carregar o Progresso
function loadGame() {
    const savedData = localStorage.getItem('mindForgeSave');
    if (savedData) {
        gameData = JSON.parse(savedData);
        updateDisplay();
    }
}

// Função para atualizar os valores na interface
function updateDisplay() {
    dataCountDisplay.textContent = gameData.tokens;
    moneyDisplay.textContent = `R$ ${gameData.money.toFixed(2)}`;
}

// Botão principal: Gerar Dados
clickBtn.addEventListener('click', () => {
    gameData.tokens += gameData.tokensPerClick;
    updateDisplay();
    saveGame(); // Salva após clicar
});

// Botão de Vender Dados
sellBtn.addEventListener('click', () => {
    if (gameData.tokens >= 10) {
        gameData.tokens -= 10;
        gameData.money += 5.0;
        updateDisplay();
        saveGame(); // Salva após vender
    } else {
        alert('Você precisa de pelo menos 10 Tokens para vender dados!');
    }
});

// Comprar Notebook (Custa R$ 15.00)
buyNotebookBtn.addEventListener('click', () => {
    if (gameData.money >= 15.0) {
        gameData.money -= 15.0;
        gameData.tokensPerClick += 1;
        updateDisplay();
        saveGame(); // Salva após comprar
    } else {
        alert('Saldo insuficiente!');
    }
});

// Comprar Bot (Custa R$ 50.00)
buyBotBtn.addEventListener('click', () => {
    if (gameData.money >= 50.0) {
        gameData.money -= 50.0;
        gameData.autoBots += 1;
        updateDisplay();
        saveGame(); // Salva após comprar
    } else {
        alert('Saldo insuficiente!');
    }
});

// Loop automático (geração por bots)
setInterval(() => {
    if (gameData.autoBots > 0) {
        gameData.tokens += gameData.autoBots;
        updateDisplay();
        saveGame(); // Salva automaticamente a cada segundo de geração
    }
}, 1000);

// Ao carregar a página, busca o save
loadGame();
