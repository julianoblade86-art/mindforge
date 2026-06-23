// Estado do jogo (Fase 1: Apenas o contador de dados)
let gameData = {
    tokens: 0
};

// Elementos da tela
const clickBtn = document.getElementById('click-btn');
const dataCountDisplay = document.getElementById('data-count');

// Função que roda quando você clica no botão
clickBtn.addEventListener('click', () => {
    // Aumenta o número de dados em 1
    gameData.tokens += 1;
    
    // Mostra o novo número na tela
    dataCountDisplay.textContent = gameData.tokens;
});
