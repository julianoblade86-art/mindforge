// ==========================================
// ESTADO DO JOGO (VARIÁVEIS)
// ==========================================
let linhasDeCodigo = 0;
let dinheiro = 0;
let linhasPorClique = 1;
let linhasPorSegundo = 0;

// Sistema da M.I.N.D. (Diálogos Dinâmicos)
const mindDialogos = {
    inicial: "M.I.N.D. conectada. Olá, Dev. O sistema da garagem está operacional, mas extremamente obsoleto. Recomendo começar a programar imediatamente.",
    poucoCodigo: "Detetei atividade no terminal. Estás a progredir, mas o ritmo atual de linhas de código ainda é insignificante para as grandes corporações.",
    medioCodigo: "Análise quantitativa: A estrutura de dados está a expandir-se. Os teus algoritmos começam a chamar a atenção na rede subterrânea.",
    muitoCodigo: "Alerta de sobreaquecimento lógico! A quantidade de código produzido ultrapassou a barreira local. Estamos prontos para a transição corporativa."
};

// Custo dos Upgrades
let custoSetup = 10;
let custoScript = 50;

// Elementos da Interface (DOM)
const linhasDisplay = document.getElementById('lines-display');
const dinheiroDisplay = document.getElementById('money-display');
const clickBtn = document.getElementById('click-btn');
const sellBtn = document.getElementById('sell-btn');
const characterMessage = document.getElementById('character-message');

// Elementos dos Upgrades
const setupLvlDisplay = document.getElementById('setup-lvl');
const setupCostDisplay = document.getElementById('setup-cost');
const buySetupBtn = document.getElementById('buy-setup');

const scriptLvlDisplay = document.getElementById('script-lvl');
const scriptCostDisplay = document.getElementById('script-cost');
const buyScriptBtn = document.getElementById('buy-shadow-script');

// ==========================================
// FUNÇÕES DE ATUALIZAÇÃO DA INTERFACE
// ==========================================
function atualizarInterface() {
    linhasDisplay.textContent = linhasDeCodigo;
    dinheiroDisplay.textContent = dinheiro.toFixed(2);
    
    // Atualiza estados dos botões de upgrade (bloqueia se não tiver dinheiro)
    buySetupBtn.disabled = dinheiro < custoSetup;
    buyScriptBtn.disabled = dinheiro < custoScript;

    // Atualiza as falas da M.I.N.D. com base no progresso
    atualizarMensagemMind();
}

function atualizarMensagemMind() {
    if (linhasDeCodigo === 0 && dinheiro === 0) {
        characterMessage.textContent = mindDialogos.inicial;
    } else if (linhasDeCodigo > 0 && linhasDeCodigo < 50) {
        characterMessage.textContent = mindDialogos.poucoCodigo;
    } else if (linhasDeCodigo >= 50 && linhasDeCodigo < 200) {
        characterMessage.textContent = mindDialogos.medioCodigo;
    } else if (linhasDeCodigo >= 200) {
        characterMessage.textContent = mindDialogos.muitoCodigo;
    }
}

// ==========================================
// SISTEMA DE FASES (MUDANÇA DE ESTILO)
// ==========================================
function verificarFase() {
    // Se tiver menos de 500 dinheiros, mantém na Garagem Cyberpunk
    if (dinheiro < 500) {
        document.body.className = "fase-garagem";
    } else {
        // Se alcançar 500 ou mais, transiciona para o Escritório Corporativo
        document.body.className = "fase-escritorio";
    }
}

// ==========================================
// AÇÕES DO JOGADOR
// ==========================================

// Clicar para Programar
clickBtn.addEventListener('click', () => {
    linhasDeCodigo += linhasPorClique;
    atualizarInterface();
});

// Vender Código por Dinheiro
sellBtn.addEventListener('click', () => {
    if (linhasDeCodigo > 0) {
        // Cada linha de código vale $0.25 centavos
        dinheiro += linhasDeCodigo * 0.25;
        linhasDeCodigo = 0; // Zera as linhas vendidas
        verificarFase();
        atualizarInterface();
    }
});

// Comprar Upgrade 1: Setup Melhorado (+1 por clique)
buySetupBtn.addEventListener('click', () => {
    if (dinheiro >= custoSetup) {
        dinheiro -= custoSetup;
        linhasPorClique += 1;
        
        // Atualiza nível e inflaciona o custo do próximo upgrade
        let lvl atual = parseInt(setupLvlDisplay.textContent);
        setupLvlDisplay.textContent = lvl atual + 1;
        custoSetup = Math.round(custoSetup * 1.5);
        setupCostDisplay.textContent = custoSetup;
        
        verificarFase();
        atualizarInterface();
    }
});

// Comprar Upgrade 2: Scripts Automatizados (+1 linha por segundo)
buyScriptBtn.addEventListener('click', () => {
    if (dinheiro >= custoScript) {
        dinheiro -= custoScript;
        linhasPorSegundo += 1;
        
        // Atualiza nível e inflaciona o custo do próximo upgrade
        let lvl atual = parseInt(scriptLvlDisplay.textContent);
        scriptLvlDisplay.textContent = lvl atual + 1;
        custoScript = Math.round(custoScript * 1.6);
        scriptCostDisplay.textContent = custoScript;
        
        verificarFase();
        atualizarInterface();
    }
});

// ==========================================
// LOOP AUTOMÁTICO (PASSIVO)
// ==========================================
// Executa a cada 1 segundo (1000 milissegundos)
setInterval(() => {
    if (linhasPorSegundo > 0) {
        linhasDeCodigo += linhasPorSegundo;
        atualizarInterface();
    }
}, 1000);

// ==========================================
// INICIALIZAÇÃO DO JOGO
// ==========================================
verificarFase();
atualizarInterface();
