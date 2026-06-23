// Estado do jogo (Fase 2: Contador de dados e Sistema de Dinheiro)
let gameData = {
    tokens: 0,
    money: 0.0
};

// Elementos da tela
const clickBtn = document.getElementById('click-btn');
const sellBtn = document.getElementById('sell-btn');
const dataCountDisplay = document.getElementById('data-count');
const moneyCountDisplay = document.getElementById('money-count');

// Função para atualizar os valores no ecrã
function updateDisplay() {
    dataCountDisplay.textContent = gameData.tokens;
    moneyCountDisplay.textContent = `R$ ${gameData.money.toFixed(2)}`;
}

// Função que roda quando clicas no botão de gerar dados
clickBtn.addEventListener('click', () => {
    gameData.tokens += 1;
    updateDisplay();
});

// Função que roda quando clicas no botão de vender dados
sellBtn.addEventListener('click', () => {
    // Verifica se tens pelo menos 10 tokens para vender
    if (gameData.tokens >= 10) {
        gameData.tokens -= 10; // Remove 10 tokens
        gameData.money += 5.0;  // Adiciona R$ 5,00
        updateDisplay();        // Atualiza os valores no ecrã
    } else {
        alert('Você precisa de pelo menos 10 Tokens para vender dados!');
    }
});
