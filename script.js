// Estado do jogo (Fase 3: Adicionados Upgrades e Sistema Automático)
let gameData = {
    tokens: 0,
    money: 0.0,
    tokensPerClick: 1,  // Quantos tokens ganhas por clique
    autoBots: 0         // Quantidade de bots automáticos comprados
};

// Elementos da tela
const clickBtn = document.getElementById('click-btn');
const sellBtn = document.getElementById('sell-btn');
const buyNotebookBtn = document.getElementById('buy-notebook-btn');
const buyBotBtn = document.getElementById('buy-bot-btn');

const dataCountDisplay = document.getElementById('data-count');
const moneyDisplay = document.getElementById('money-display');

// Função para atualizar os valores na interface
function updateDisplay() {
    dataCountDisplay.textContent = gameData.tokens;
    moneyDisplay.textContent = `R$ ${gameData.money.toFixed(2)}`;
}

// Botão principal: Gerar Dados por Clique
clickBtn.addEventListener('click', () => {
    gameData.tokens += gameData.tokensPerClick; // Soma com base no multiplicador de clique
    updateDisplay();
});

// Botão de Vender Dados (10 Tokens = R$ 5)
sellBtn.addEventListener('click', () => {
    if (gameData.tokens >= 10) {
        gameData.tokens -= 10;
        gameData.money += 5.0;
        updateDisplay();
    } else {
        alert('Você precisa de pelo menos 10 Tokens para vender dados!');
    }
});

// COMPRAR UPGRADE: Notebook Avançado (Custa R$ 15.00)
buyNotebookBtn.addEventListener('click', () => {
    if (gameData.money >= 15.0) {
        gameData.money -= 15.0;            // Deduz o dinheiro
        gameData.tokensPerClick += 1;      // Cada clique agora gera +1 token
        alert('Upgrade comprado! Seus cliques agora geram mais dados.');
        updateDisplay();
    } else {
        alert('Saldo insuficiente para comprar o Notebook Avançado!');
    }
});

// COMPRAR UPGRADE: Bot Otimizador (Custa R$ 50.00)
buyBotBtn.addEventListener('click', () => {
    if (gameData.money >= 50.0) {
        gameData.money -= 50.0;            // Deduz o dinheiro
        gameData.autoBots += 1;            // Adiciona um bot à tua frota
        alert('Bot comprado! Ele está gerando dados para você automaticamente.');
        updateDisplay();
    } else {
        alert('Saldo insuficiente para comprar o Bot Otimizador!');
    }
});

// RECONHECIMENTO AUTOMÁTICO (Loop que roda a cada 1 segundo)
setInterval(() => {
    if (gameData.autoBots > 0) {
        gameData.tokens += gameData.autoBots; // Adiciona tokens gerados pelos bots
        updateDisplay();
    }
}, 1000); // 1000 milissegundos = 1 segundo
