/**
 * 📅 MONTHLY.JS - Funcionalidades da Página de Controle Mensal
 * Reconhecimento de voz e gestão de gastos mensais (sem viagens)
 * NOVO: Navegação por meses e anos (a partir de 2025) + Sistema dual de moedas
 */

let isRecording = false;
let recognition = null;
let monthlyTransactions = [];
let currentViewMonth = new Date().getMonth(); // 0-11
let currentViewYear = new Date().getFullYear();
let currentCurrency = 'EUR'; // Moeda atual selecionada
let exchangeRate = 5.5; // Taxa de câmbio atual

// Configurações de restrição de ano
const MAX_YEAR = new Date().getFullYear() + 10; // Permitir até 10 anos no futuro

// ========================================
// 🚀 INICIALIZAÇÃO
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('📅 Inicializando página de controle mensal...');
    
    initializeVoiceRecognition();
    loadExchangeRate();
    updateMonthDisplay();
    updateYearDisplay();
    updateNavigationButtons();
    loadMonthlyTransactions();
    setupEventListeners();
});

function setupEventListeners() {
    // Form manual
    document.getElementById('manual-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveManualTransaction();
    });
}

// ========================================
// 💱 SISTEMA DE MOEDAS
// ========================================

async function loadExchangeRate() {
    try {
        const response = await fetch('/api/exchange-rate');
        const data = await response.json();
        
        if (data.success) {
            exchangeRate = data.rate;
            document.getElementById('exchange-rate').textContent = data.formatted;
            console.log(`💱 Taxa de câmbio carregada: ${data.formatted}`);
        }
    } catch (error) {
        console.error('❌ Erro ao carregar taxa de câmbio:', error);
        document.getElementById('exchange-rate').textContent = '1 EUR = 5.50 BRL (offline)';
    }
}

function toggleCurrency() {
    const eurOption = document.getElementById('currency-eur');
    const brlOption = document.getElementById('currency-brl');
    const slider = document.getElementById('currency-slider');
    
    if (currentCurrency === 'EUR') {
        // Mudar para BRL
        currentCurrency = 'BRL';
        eurOption.classList.remove('active');
        brlOption.classList.add('active');
        slider.classList.add('brl');
    } else {
        // Mudar para EUR
        currentCurrency = 'EUR';
        brlOption.classList.remove('active');
        eurOption.classList.add('active');
        slider.classList.remove('brl');
    }
    
    console.log(`💱 Moeda alterada para: ${currentCurrency}`);
    
    // Atualizar interface
    updateCurrencyDisplay();
    updateMonthlyStats();
    renderMonthlyTransactions();
    updateCategoryChart();
}

function updateCurrencyDisplay() {
    // Atualizar símbolos de moeda na interface
    const currencySymbols = document.querySelectorAll('.currency-symbol');
    const newSymbol = currentCurrency === 'EUR' ? '€' : 'R$';
    
    currencySymbols.forEach(symbol => {
        symbol.textContent = newSymbol;
    });
    
    // Atualizar placeholder do formulário
    const amountInput = document.getElementById('manual-amount');
    if (amountInput) {
        amountInput.placeholder = currentCurrency === 'EUR' ? '0.00' : '0,00';
    }
    
    // Atualizar input group text
    const inputGroupText = document.querySelector('.input-group-text');
    if (inputGroupText) {
        inputGroupText.textContent = newSymbol;
    }
}

function formatCurrency(amount, currency = null) {
    if (!currency) currency = currentCurrency;
    
    if (currency === 'EUR') {
        return `€${amount.toFixed(2)}`;
    } else {
        return `R$${amount.toFixed(2).replace('.', ',')}`;
    }
}

function getAmountInCurrentCurrency(transaction) {
    if (currentCurrency === 'EUR') {
        return transaction.amount_eur || transaction.amount || 0;
    } else {
        return transaction.amount_brl || (transaction.amount * exchangeRate) || 0;
    }
}

// ========================================
// 📅 NAVEGAÇÃO POR ANOS
// ========================================

function updateYearDisplay() {
    const currentDate = new Date();
    const isCurrentYear = currentViewYear === currentDate.getFullYear();
    
    document.getElementById('year-text').textContent = currentViewYear;
    
    // Adicionar indicador se for ano atual
    const yearElement = document.getElementById('year-text');
    if (isCurrentYear) {
        yearElement.style.color = '#fbbf24'; // Cor dourada para ano atual
    } else {
        yearElement.style.color = 'rgba(255, 255, 255, 0.8)';
    }
    
    console.log(`📅 Ano selecionado: ${currentViewYear} ${isCurrentYear ? '(atual)' : ''}`);
}

function changeYear(direction) {
    const newYear = currentViewYear + direction;
    
    // Validar restrições de ano
    if (newYear > MAX_YEAR) {
        showError(`Navegação limitada até ${MAX_YEAR}`);
        return;
    }
    
    currentViewYear = newYear;
    
    // Se mudou para um ano diferente do atual, ir para janeiro
    const currentDate = new Date();
    if (currentViewYear !== currentDate.getFullYear()) {
        currentViewMonth = 0; // Janeiro
    }
    
    updateYearDisplay();
    updateMonthDisplay();
    updateNavigationButtons();
    loadMonthlyTransactions();
}

function updateNavigationButtons() {
    const prevYearBtn = document.getElementById('prev-year-btn');
    const nextYearBtn = document.getElementById('next-year-btn');
    
    // Desabilitar botão próximo se estiver no ano máximo
    if (currentViewYear >= MAX_YEAR) {
        nextYearBtn.disabled = true;
        nextYearBtn.classList.add('btn-month-nav');
        nextYearBtn.title = `Navegação limitada até ${MAX_YEAR}`;
    } else {
        nextYearBtn.disabled = false;
        nextYearBtn.classList.remove('btn-month-nav');
        nextYearBtn.title = '';
    }
}

// ========================================
// 📅 NAVEGAÇÃO POR MESES (ATUALIZADA)
// ========================================

function updateMonthDisplay() {
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    const currentDate = new Date();
    const isCurrentMonth = currentViewMonth === currentDate.getMonth() && 
                          currentViewYear === currentDate.getFullYear();
    
    // Atualizar display compacto
    document.getElementById('month-display').textContent = monthNames[currentViewMonth];
    
    // Adicionar indicador se for mês atual
    const monthElement = document.getElementById('month-display');
    if (isCurrentMonth) {
        monthElement.style.color = '#fbbf24'; // Cor dourada para mês atual
    } else {
        monthElement.style.color = 'white';
    }
    
    console.log(`📅 Visualizando: ${monthNames[currentViewMonth]} ${currentViewYear} ${isCurrentMonth ? '(atual)' : ''}`);
}

function changeMonth(direction) {
    currentViewMonth += direction;
    
    if (currentViewMonth > 11) {
        // Tentar ir para o próximo ano
        if (currentViewYear + 1 <= MAX_YEAR) {
            currentViewMonth = 0;
            currentViewYear++;
            updateYearDisplay();
            updateNavigationButtons();
        } else {
            currentViewMonth = 11; // Voltar para dezembro
            showError(`Navegação limitada até ${MAX_YEAR}`);
            return;
        }
    } else if (currentViewMonth < 0) {
        // Ir para o ano anterior
        currentViewMonth = 11;
        currentViewYear--;
        updateYearDisplay();
        updateNavigationButtons();
    }
    
    updateMonthDisplay();
    loadMonthlyTransactions();
}

function goToCurrentMonth() {
    const currentDate = new Date();
    const targetYear = currentDate.getFullYear();
    
    currentViewYear = targetYear;
    currentViewMonth = currentDate.getMonth();
    
    updateYearDisplay();
    updateMonthDisplay();
    updateNavigationButtons();
    loadMonthlyTransactions();
}

// ========================================
// 🎤 RECONHECIMENTO DE VOZ
// ========================================

function initializeVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.warn('⚠️ Reconhecimento de voz não suportado neste navegador');
        document.getElementById('voice-feedback').innerHTML = 
            '<span class="text-warning">Reconhecimento de voz não suportado neste navegador</span>';
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'pt-BR';
    recognition.maxAlternatives = 1;

    recognition.onstart = function() {
        console.log('🎤 Reconhecimento de voz iniciado');
        updateVoiceFeedback('Escutando... Fale agora!', 'info');
    };

    recognition.onresult = function(event) {
        const command = event.results[0][0].transcript;
        console.log('🎤 Comando capturado:', command);
        updateVoiceFeedback(`Processando: "${command}"`, 'processing');
        processVoiceCommand(command);
    };

    recognition.onerror = function(event) {
        console.error('❌ Erro no reconhecimento:', event.error);
        let errorMessage = 'Erro no reconhecimento de voz';
        
        switch(event.error) {
            case 'no-speech':
                errorMessage = 'Nenhuma fala detectada. Tente novamente.';
                break;
            case 'audio-capture':
                errorMessage = 'Microfone não encontrado ou sem permissão.';
                break;
            case 'not-allowed':
                errorMessage = 'Permissão para microfone negada.';
                break;
        }
        
        updateVoiceFeedback(errorMessage, 'error');
        stopVoiceRecording();
    };

    recognition.onend = function() {
        console.log('🎤 Reconhecimento de voz finalizado');
        stopVoiceRecording();
    };
}

function toggleVoiceRecording() {
    if (!recognition) {
        alert('Reconhecimento de voz não disponível neste navegador');
        return;
    }

    if (isRecording) {
        stopVoiceRecording();
    } else {
        startVoiceRecording();
    }
}

function startVoiceRecording() {
    isRecording = true;
    
    const button = document.getElementById('voice-button');
    const icon = document.getElementById('voice-icon');
    
    button.classList.add('recording');
    icon.className = 'fas fa-stop';
    
    updateVoiceFeedback('Preparando microfone...', 'info');
    
    try {
        recognition.start();
    } catch (error) {
        console.error('❌ Erro ao iniciar reconhecimento:', error);
        updateVoiceFeedback('Erro ao iniciar microfone', 'error');
        stopVoiceRecording();
    }
}

function stopVoiceRecording() {
    isRecording = false;
    
    const button = document.getElementById('voice-button');
    const icon = document.getElementById('voice-icon');
    
    button.classList.remove('recording');
    icon.className = 'fas fa-microphone';
    
    if (recognition) {
        recognition.stop();
    }
    
    setTimeout(() => {
        updateVoiceFeedback('Clique no microfone para começar', 'default');
    }, 2000);
}

function updateVoiceFeedback(message, type = 'default') {
    const feedback = document.getElementById('voice-feedback');
    
    let className = 'text-white-75';
    let icon = '';
    
    switch(type) {
        case 'info':
            className = 'text-info';
            icon = '<i class="fas fa-microphone me-2"></i>';
            break;
        case 'processing':
            className = 'text-warning';
            icon = '<i class="fas fa-cog fa-spin me-2"></i>';
            break;
        case 'success':
            className = 'text-success';
            icon = '<i class="fas fa-check me-2"></i>';
            break;
        case 'error':
            className = 'text-danger';
            icon = '<i class="fas fa-exclamation-triangle me-2"></i>';
            break;
    }
    
    feedback.innerHTML = `<span class="${className}">${icon}${message}</span>`;
}

// ========================================
// 🧠 PROCESSAMENTO DE COMANDOS DE VOZ
// ========================================

async function processVoiceCommand(command) {
    try {
        // CORREÇÃO: Criar data específica para o mês/ano selecionado
        const transactionDate = new Date(currentViewYear, currentViewMonth, new Date().getDate());
        
        const response = await fetch('/api/voice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                command: command,
                date: transactionDate.toISOString() // NOVO: Enviar data específica
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            updateVoiceFeedback(`✅ ${result.message}`, 'success');
            loadMonthlyTransactions(); // Recarregar transações
        } else {
            updateVoiceFeedback(`❌ ${result.error}`, 'error');
        }
    } catch (error) {
        console.error('❌ Erro ao processar comando:', error);
        updateVoiceFeedback('Erro ao processar comando', 'error');
    }
}

// ========================================
// 📊 CARREGAMENTO DE DADOS
// ========================================

async function loadMonthlyTransactions() {
    try {
        console.log('📊 Carregando transações mensais...');
        const response = await fetch('/api/transactions');
        const data = await response.json();
        
        // Filtrar apenas transações sem trip_id (gastos mensais)
        monthlyTransactions = data.filter(t => !t.trip_id);
        
        console.log('✅ Transações mensais carregadas:', monthlyTransactions.length);
        
        renderMonthlyTransactions();
        updateMonthlyStats();
        updateCategoryChart();
    } catch (error) {
        console.error('❌ Erro ao carregar transações:', error);
        showError('Erro ao carregar transações');
    }
}

function renderMonthlyTransactions() {
    const container = document.getElementById('transactions-container');
    
    if (monthlyTransactions.length === 0) {
        container.innerHTML = `
            <div class="text-center text-muted py-4">
                <i class="fas fa-inbox fa-3x mb-3 opacity-50"></i>
                <p>Nenhuma transação mensal encontrada</p>
                <p class="small">Use o microfone ou o formulário para adicionar gastos</p>
            </div>
        `;
        return;
    }
    
    // Ordenar por data (mais recente primeiro)
    const sortedTransactions = monthlyTransactions.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );
    
    container.innerHTML = sortedTransactions.map(transaction => 
        renderTransactionItem(transaction)
    ).join('');
}

function renderTransactionItem(transaction) {
    const date = new Date(transaction.date).toLocaleDateString('pt-BR');
    const categoryIcon = getCategoryIcon(transaction.category);
    
    return `
        <div class="transaction-item">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <div class="fw-bold text-danger">-€${transaction.amount.toFixed(2)}</div>
                    <div class="text-muted small">${transaction.description || 'Sem descrição'}</div>
                </div>
                <div class="text-end">
                    <span class="category-badge category-${transaction.category}">
                        ${categoryIcon} ${transaction.category}
                    </span>
                    <div class="text-muted small">${date}</div>
                    <div class="text-muted small">
                        <i class="fas fa-${getSourceIcon(transaction.source)} me-1"></i>
                        ${getSourceLabel(transaction.source)}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function updateMonthlyStats() {
    // Usar mês e ano da visualização atual
    const viewMonth = currentViewMonth;
    const viewYear = currentViewYear;
    
    // Filtrar transações do mês selecionado
    const selectedMonthTransactions = monthlyTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === viewMonth && 
               transactionDate.getFullYear() === viewYear &&
               t.type === 'despesa';
    });
    
    // Calcular totais na moeda selecionada
    const totalSpent = selectedMonthTransactions.reduce((sum, t) => {
        return sum + getAmountInCurrentCurrency(t);
    }, 0);
    
    const transactionCount = selectedMonthTransactions.length;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const averagePerDay = totalSpent / daysInMonth;
    
    // Atualizar display com formatação de moeda
    document.getElementById('monthly-total').innerHTML = formatCurrency(totalSpent);
    document.getElementById('monthly-count').textContent = transactionCount;
    document.getElementById('monthly-average').innerHTML = formatCurrency(averagePerDay);
    
    // Adicionar animação de mudança
    ['monthly-total', 'monthly-count', 'monthly-average'].forEach(id => {
        const element = document.getElementById(id);
        element.classList.add('value-changing');
        setTimeout(() => element.classList.remove('value-changing'), 500);
    });
    
    console.log(`📊 Stats do mês ${viewMonth + 1}/${viewYear}: ${formatCurrency(totalSpent)} em ${transactionCount} transações`);
}

function renderTransactionItem(transaction) {
    const date = new Date(transaction.date).toLocaleDateString('pt-BR');
    const categoryIcon = getCategoryIcon(transaction.category);
    const amount = getAmountInCurrentCurrency(transaction);
    
    // Mostrar moeda original se diferente da atual
    let originalCurrencyInfo = '';
    if (transaction.currency && transaction.currency !== currentCurrency) {
        const originalAmount = transaction.currency === 'EUR' ? 
            (transaction.amount_eur || transaction.amount) : 
            (transaction.amount_brl || transaction.amount * exchangeRate);
        const originalSymbol = transaction.currency === 'EUR' ? '€' : 'R$';
        originalCurrencyInfo = `<div class="text-muted small">Original: ${originalSymbol}${originalAmount.toFixed(2)}</div>`;
    }
    
    return `
        <div class="transaction-item">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <div class="fw-bold text-danger">-${formatCurrency(amount)}</div>
                    <div class="text-muted small">${transaction.description || 'Sem descrição'}</div>
                    ${originalCurrencyInfo}
                </div>
                <div class="text-end">
                    <span class="category-badge category-${transaction.category}">
                        ${categoryIcon} ${transaction.category}
                    </span>
                    <div class="text-muted small">${date}</div>
                    <div class="text-muted small">
                        <i class="fas fa-${getSourceIcon(transaction.source)} me-1"></i>
                        ${getSourceLabel(transaction.source)}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function updateCategoryChart() {
    // Filtrar transações do mês selecionado
    const selectedMonthTransactions = monthlyTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === currentViewMonth && 
               transactionDate.getFullYear() === currentViewYear &&
               t.type === 'despesa';
    });
    
    const container = document.getElementById('category-chart-container');
    
    if (selectedMonthTransactions.length === 0) {
        container.innerHTML = `
            <div class="text-center text-muted">
                <i class="fas fa-chart-pie fa-3x mb-3 opacity-50"></i>
                <p>Nenhum gasto para exibir gráfico</p>
            </div>
        `;
        return;
    }
    
    // Agrupar por categoria na moeda atual
    const categoryTotals = {};
    selectedMonthTransactions.forEach(t => {
        const amount = getAmountInCurrentCurrency(t);
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + amount;
    });
    
    const totalAmount = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
    
    container.innerHTML = Object.entries(categoryTotals)
        .sort(([,a], [,b]) => b - a)
        .map(([category, amount]) => {
            const percentage = (amount / totalAmount) * 100;
            return `
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div class="d-flex align-items-center">
                        <span class="category-badge category-${category} me-3">
                            ${getCategoryIcon(category)} ${category.charAt(0).toUpperCase() + category.slice(1)}
                        </span>
                    </div>
                    <div class="text-end">
                        <div class="fw-bold">${formatCurrency(amount)}</div>
                        <div class="text-muted small">${percentage.toFixed(1)}%</div>
                    </div>
                </div>
                <div class="progress mb-3" style="height: 8px;">
                    <div class="progress-bar bg-primary" style="width: ${percentage}%"></div>
                </div>
            `;
        }).join('');
}

function renderMonthlyTransactions() {
    const container = document.getElementById('transactions-container');
    
    // Filtrar transações do mês selecionado
    const selectedMonthTransactions = monthlyTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === currentViewMonth && 
               transactionDate.getFullYear() === currentViewYear;
    });
    
    if (selectedMonthTransactions.length === 0) {
        const monthNames = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        
        container.innerHTML = `
            <div class="text-center text-muted py-4">
                <i class="fas fa-calendar-times fa-3x mb-3 opacity-50"></i>
                <h5>Nenhuma transação em ${monthNames[currentViewMonth]} ${currentViewYear}</h5>
                <p class="small">Use o microfone ou o formulário para adicionar gastos</p>
            </div>
        `;
        return;
    }
    
    // Ordenar por data (mais recente primeiro)
    const sortedTransactions = selectedMonthTransactions.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );
    
    container.innerHTML = sortedTransactions.map(transaction => 
        renderTransactionItem(transaction)
    ).join('');
    
    console.log(`📋 Exibindo ${selectedMonthTransactions.length} transações do mês selecionado`);
}

// Atualizar função de feedback de voz para o novo elemento
function updateVoiceStatus(message, isRecording = false) {
    const statusElement = document.getElementById('voice-status');
    const buttonElement = document.getElementById('voice-button');
    
    if (statusElement) {
        statusElement.textContent = message;
    }
    
    if (buttonElement) {
        if (isRecording) {
            buttonElement.classList.add('recording');
        } else {
            buttonElement.classList.remove('recording');
        }
    }
}

function updateCategoryChart() {
    // Filtrar transações do mês selecionado
    const selectedMonthTransactions = monthlyTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === currentViewMonth && 
               transactionDate.getFullYear() === currentViewYear &&
               t.type === 'despesa';
    });
    
    const container = document.getElementById('category-chart-container');
    
    if (selectedMonthTransactions.length === 0) {
        container.innerHTML = `
            <div class="text-center text-muted">
                <i class="fas fa-chart-pie fa-3x mb-3 opacity-50"></i>
                <p>Nenhum gasto para exibir gráfico</p>
            </div>
        `;
        return;
    }
    
    // Agrupar por categoria
    const categoryTotals = {};
    selectedMonthTransactions.forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });
    
    container.innerHTML = Object.entries(categoryTotals)
        .sort(([,a], [,b]) => b - a)
        .map(([category, amount]) => {
            const percentage = (amount / Object.values(categoryTotals).reduce((a, b) => a + b, 0)) * 100;
            return `
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div class="d-flex align-items-center">
                        <span class="category-badge category-${category} me-3">
                            ${getCategoryIcon(category)} ${category.charAt(0).toUpperCase() + category.slice(1)}
                        </span>
                    </div>
                    <div class="text-end">
                        <div class="fw-bold">€${amount.toFixed(2)}</div>
                        <div class="text-muted small">${percentage.toFixed(1)}%</div>
                    </div>
                </div>
                <div class="progress mb-3" style="height: 8px;">
                    <div class="progress-bar bg-primary" style="width: ${percentage}%"></div>
                </div>
            `;
        }).join('');
}

// ========================================
// 📝 FORMULÁRIO MANUAL
// ========================================

async function saveManualTransaction() {
    const amount = parseFloat(document.getElementById('manual-amount').value);
    const category = document.getElementById('manual-category').value;
    const description = document.getElementById('manual-description').value;
    
    // Validações
    if (!amount || amount <= 0) {
        showError('Valor deve ser maior que zero');
        return;
    }
    
    if (!category) {
        showError('Categoria é obrigatória');
        return;
    }
    
    // CORREÇÃO: Criar data específica para o mês/ano selecionado
    const transactionDate = new Date(currentViewYear, currentViewMonth, new Date().getDate());
    
    const transactionData = {
        amount: amount,
        type: 'despesa',
        category: category,
        description: description,
        currency: currentCurrency, // Usar moeda selecionada
        source: 'web',
        date: transactionDate.toISOString() // NOVO: Enviar data específica
    };
    
    try {
        const response = await fetch('/api/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transactionData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            const currencySymbol = currentCurrency === 'EUR' ? '€' : 'R$';
            const monthName = getMonthName(currentViewMonth);
            showSuccess(`Transação adicionada em ${monthName}/${currentViewYear}: ${currencySymbol}${amount.toFixed(2)}`);
            document.getElementById('manual-form').reset();
            loadMonthlyTransactions(); // Recarregar dados
        } else {
            showError(result.error || 'Erro ao adicionar transação');
        }
    } catch (error) {
        console.error('❌ Erro ao salvar transação:', error);
        showError('Erro ao salvar transação');
    }
}

// ========================================
// 🛠️ FUNÇÕES UTILITÁRIAS
// ========================================

function getCategoryIcon(category) {
    const icons = {
        'alimentacao': '🍽️',
        'transporte': '🚗',
        'lazer': '🎭',
        'moradia': '🏠',
        'outros': '📦'
    };
    return icons[category] || '📦';
}

function getSourceIcon(source) {
    const icons = {
        'voice': 'microphone',
        'web': 'keyboard',
        'api': 'code'
    };
    return icons[source] || 'question';
}

function getSourceLabel(source) {
    const labels = {
        'voice': 'Voz',
        'web': 'Manual',
        'api': 'API'
    };
    return labels[source] || 'Desconhecido';
}

function showSuccess(message) {
    // Implementar notificação de sucesso
    alert('✅ ' + message);
}

function showError(message) {
    // Implementar notificação de erro
    alert('❌ ' + message);
}
