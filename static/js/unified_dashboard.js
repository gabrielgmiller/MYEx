// 🚀 Unified Dashboard JavaScript
// Sistema Integrado de Controle de Gastos com Amazon Q Developer

class UnifiedExpenseTracker {
    constructor() {
        this.init();
    }

    init() {
        this.updateCurrentDate();
        this.loadDashboard();
        this.loadTrips();
        this.loadPieChart();
        this.setupEventListeners();
        
        // Atualiza dados a cada 30 segundos
        setInterval(() => this.loadDashboard(), 30000);
        
        // Adiciona animações
        this.addAnimations();
    }

    updateCurrentDate() {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        };
        document.getElementById('current-date').textContent = 
            now.toLocaleDateString('pt-BR', options);
    }

    setupEventListeners() {
        // Form de transação
        document.getElementById('transaction-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTransaction();
        });

        // Form de viagem
        document.getElementById('trip-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createTrip();
        });

        // Enter key para comandos de voz e classificação
        document.getElementById('voice-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                processVoiceCommand();
            }
        });

        document.getElementById('classify-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                classifyText();
            }
        });
    }

    addAnimations() {
        // Adiciona animação fade-in aos elementos
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        });

        document.querySelectorAll('.fade-in-up').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease-out';
            observer.observe(el);
        });
    }

    async loadDashboard() {
        try {
            const response = await fetch('/api/dashboard');
            const data = await response.json();
            
            this.updateDashboardCards(data);
            this.updateCategoryDistribution(data.category_distribution);
            this.loadRecentTransactions();
            
        } catch (error) {
            console.error('Erro ao carregar dashboard:', error);
            this.showAlert('Erro ao carregar dados do dashboard', 'danger');
        }
    }

    updateDashboardCards(data) {
        // Atualiza cards principais com animação
        this.animateValue('total-expenses', data.total_expenses, '€');
        this.animateValue('total-income', data.total_income, '€');
        this.animateValue('balance', data.balance, '€');
        
        // Atualiza taxa de poupança
        const savingsRate = data.analytics?.savings_rate || 0;
        this.animateValue('savings-rate', savingsRate, '%');
        
        // Aplica cor baseada no saldo
        const balanceElement = document.getElementById('balance');
        if (data.balance >= 0) {
            balanceElement.style.color = '#fff';
        } else {
            balanceElement.style.color = '#ffebee';
        }
    }

    animateValue(elementId, finalValue, suffix = '') {
        const element = document.getElementById(elementId);
        const startValue = parseFloat(element.textContent.replace(/[€%,]/g, '')) || 0;
        const duration = 1000; // 1 segundo
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = startValue + (finalValue - startValue) * easeOut;
            
            if (suffix === '€') {
                element.textContent = `€${currentValue.toFixed(2)}`;
            } else if (suffix === '%') {
                element.textContent = `${currentValue.toFixed(1)}%`;
            } else {
                element.textContent = currentValue.toFixed(2);
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    updateCategoryDistribution(distribution) {
        const container = document.getElementById('category-distribution');
        
        if (Object.keys(distribution).length === 0) {
            container.innerHTML = '<p class="text-muted">Nenhum gasto registrado</p>';
            return;
        }

        let html = '';
        const categoryIcons = {
            'alimentação': '🍽️',
            'transporte': '🚗',
            'lazer': '🎉',
            'moradia': '🏠',
            'outros': '📦'
        };

        const total = Object.values(distribution).reduce((sum, value) => sum + value, 0);

        for (const [category, amount] of Object.entries(distribution)) {
            const percentage = ((amount / total) * 100).toFixed(1);
            const icon = categoryIcons[category] || '📦';
            
            html += `
                <div class="category-item">
                    <div>
                        <span class="me-2">${icon}</span>
                        <strong>${category.charAt(0).toUpperCase() + category.slice(1)}</strong>
                    </div>
                    <div class="text-end">
                        <div>€${amount.toFixed(2)}</div>
                        <small class="opacity-75">${percentage}%</small>
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;
    }

    async loadRecentTransactions() {
        try {
            const response = await fetch('/api/transactions');
            const transactions = await response.json();
            
            // Pega as 10 mais recentes
            const recent = transactions
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 10);
            
            this.displayRecentTransactions(recent);
            
        } catch (error) {
            console.error('Erro ao carregar transações:', error);
        }
    }

    displayRecentTransactions(transactions) {
        const container = document.getElementById('recent-transactions');
        
        if (transactions.length === 0) {
            container.innerHTML = '<p class="text-muted">Nenhuma transação encontrada</p>';
            return;
        }

        let html = '';
        const typeIcons = {
            'despesa': '💸',
            'ganho': '💰'
        };

        const sourceIcons = {
            'web': '🌐',
            'cli': '🖥️',
            'qdev': '🤖',
            'voice': '🎤',
            'manual': '✋'
        };

        transactions.forEach((transaction, index) => {
            const date = new Date(transaction.date).toLocaleDateString('pt-BR');
            const time = new Date(transaction.date).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            });
            const icon = typeIcons[transaction.type] || '💸';
            const sourceIcon = sourceIcons[transaction.source] || '✋';
            const amountClass = transaction.type === 'despesa' ? 'text-danger' : 'text-success';
            const amountPrefix = transaction.type === 'despesa' ? '-' : '+';

            html += `
                <div class="transaction-item" style="animation-delay: ${index * 0.1}s">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="flex-grow-1">
                            <div class="fw-bold">
                                ${icon} ${transaction.description || transaction.category}
                            </div>
                            <small class="text-muted">
                                ${date} ${time} ${sourceIcon}
                                ${transaction.trip_id ? '✈️' : ''}
                            </small>
                        </div>
                        <div class="text-end">
                            <div class="${amountClass} fw-bold">
                                ${amountPrefix}€${transaction.amount.toFixed(2)}
                            </div>
                            <small class="text-muted">${transaction.category}</small>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    async addTransaction() {
        const formData = {
            amount: parseFloat(document.getElementById('amount').value),
            type: document.getElementById('type').value,
            category: document.getElementById('category').value,
            description: document.getElementById('description').value,
            trip_id: document.getElementById('trip-select').value || null
        };

        try {
            const response = await fetch('/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                this.showAlert('Transação adicionada com sucesso!', 'success');
                document.getElementById('transaction-form').reset();
                this.loadDashboard(); // Recarrega dashboard
                this.loadPieChart(); // Recarrega gráfico
                
                // Efeito visual no botão
                const submitBtn = document.querySelector('#transaction-form button[type="submit"]');
                submitBtn.innerHTML = '<i class="fas fa-check me-1"></i>Adicionado!';
                submitBtn.classList.add('btn-success');
                
                setTimeout(() => {
                    submitBtn.innerHTML = '<i class="fas fa-save me-1"></i>Adicionar';
                    submitBtn.classList.remove('btn-success');
                }, 2000);
                
            } else {
                this.showAlert('Erro ao adicionar transação', 'danger');
            }

        } catch (error) {
            console.error('Erro ao adicionar transação:', error);
            this.showAlert('Erro ao adicionar transação', 'danger');
        }
    }

    async loadTrips() {
        try {
            const response = await fetch('/api/trips');
            const trips = await response.json();
            
            this.displayTrips(trips);
            this.updateTripSelect(trips);
            
        } catch (error) {
            console.error('Erro ao carregar viagens:', error);
        }
    }

    displayTrips(trips) {
        const container = document.getElementById('trips-list');
        
        if (Object.keys(trips).length === 0) {
            container.innerHTML = '<p class="text-muted">Nenhuma viagem criada</p>';
            return;
        }

        let html = '';
        for (const [tripId, trip] of Object.entries(trips)) {
            const startDate = new Date(trip.start_date).toLocaleDateString('pt-BR');
            const endDate = new Date(trip.end_date).toLocaleDateString('pt-BR');
            
            html += `
                <div class="trip-card p-3 mb-2">
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <h6 class="mb-1 fw-bold">${trip.name}</h6>
                            <small class="text-muted">
                                📅 ${startDate} - ${endDate}
                            </small>
                            <br>
                            <small class="text-muted">
                                💰 Orçamento: €${trip.budget.toFixed(2)}
                            </small>
                        </div>
                        <button class="btn btn-sm btn-outline-primary" 
                                onclick="viewTripDetails('${tripId}')">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;
    }

    updateTripSelect(trips) {
        const select = document.getElementById('trip-select');
        
        // Limpa opções existentes (exceto "Nenhuma")
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }

        // Adiciona viagens
        for (const [tripId, trip] of Object.entries(trips)) {
            const option = document.createElement('option');
            option.value = tripId;
            option.textContent = trip.name;
            select.appendChild(option);
        }
    }

    async loadPieChart() {
        try {
            document.querySelector('#pie-chart-container .loading').style.display = 'block';
            
            const response = await fetch('/api/chart/pie');
            const data = await response.json();
            
            document.querySelector('#pie-chart-container .loading').style.display = 'none';
            
            if (data.chart) {
                document.getElementById('pie-chart-container').innerHTML = 
                    `<img src="${data.chart}" class="img-fluid rounded" alt="Gráfico de Distribuição" style="max-height: 400px;">`;
            } else {
                document.getElementById('pie-chart-container').innerHTML = 
                    '<p class="text-muted text-center">Dados insuficientes para gerar gráfico</p>';
            }
            
        } catch (error) {
            console.error('Erro ao carregar gráfico:', error);
            document.querySelector('#pie-chart-container .loading').style.display = 'none';
            document.getElementById('pie-chart-container').innerHTML = 
                '<p class="text-danger text-center">Erro ao carregar gráfico</p>';
        }
    }

    showAlert(message, type = 'info') {
        // Remove alertas existentes
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());

        // Cria novo alerta
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px; border-radius: 15px;';
        
        const icons = {
            'success': 'fas fa-check-circle',
            'danger': 'fas fa-exclamation-triangle',
            'warning': 'fas fa-exclamation-circle',
            'info': 'fas fa-info-circle'
        };
        
        alertDiv.innerHTML = `
            <i class="${icons[type] || icons.info} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(alertDiv);

        // Remove automaticamente após 5 segundos
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
}

// ==================== FUNÇÕES GLOBAIS ====================

function showTripModal() {
    const modal = new bootstrap.Modal(document.getElementById('tripModal'));
    modal.show();
}

async function createTrip() {
    const formData = {
        name: document.getElementById('trip-name').value,
        start_date: document.getElementById('trip-start').value,
        end_date: document.getElementById('trip-end').value,
        budget: parseFloat(document.getElementById('trip-budget').value) || 0
    };

    try {
        const response = await fetch('/api/trips', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            tracker.showAlert('Viagem criada com sucesso!', 'success');
            document.getElementById('trip-form').reset();
            
            // Fecha modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('tripModal'));
            modal.hide();
            
            tracker.loadTrips(); // Recarrega lista de viagens
        } else {
            tracker.showAlert('Erro ao criar viagem', 'danger');
        }

    } catch (error) {
        console.error('Erro ao criar viagem:', error);
        tracker.showAlert('Erro ao criar viagem', 'danger');
    }
}

async function viewTripDetails(tripId) {
    try {
        const response = await fetch(`/api/trips/${tripId}`);
        const data = await response.json();
        
        if (data.error) {
            tracker.showAlert('Viagem não encontrada', 'danger');
            return;
        }

        // Cria modal com detalhes da viagem
        const modalHtml = `
            <div class="modal fade" id="tripDetailsModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header" style="background: var(--primary-gradient); color: white;">
                            <h5 class="modal-title">
                                <i class="fas fa-plane me-2"></i>${data.trip.name}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <strong>📅 Período:</strong><br>
                                    ${new Date(data.trip.start_date).toLocaleDateString('pt-BR')} - 
                                    ${new Date(data.trip.end_date).toLocaleDateString('pt-BR')}
                                    <br><small class="text-muted">${data.duration} dias</small>
                                </div>
                                <div class="col-md-6">
                                    <strong>💰 Orçamento:</strong> €${data.trip.budget.toFixed(2)}<br>
                                    <strong>💸 Gasto:</strong> €${data.total_spent.toFixed(2)}<br>
                                    <strong>📊 Média Diária:</strong> €${data.daily_average.toFixed(2)}
                                </div>
                            </div>
                            
                            <div class="alert ${data.budget_comparison >= 0 ? 'alert-success' : 'alert-danger'}">
                                <strong>Status do Orçamento:</strong> 
                                ${data.budget_comparison >= 0 ? 'Dentro do orçamento' : 'Acima do orçamento'}
                                (€${data.budget_comparison.toFixed(2)})
                            </div>

                            ${Object.keys(data.category_distribution).length > 0 ? `
                                <h6>📈 Gastos por Categoria:</h6>
                                <div class="row">
                                    ${Object.entries(data.category_distribution).map(([category, amount]) => `
                                        <div class="col-md-6 mb-2">
                                            <div class="d-flex justify-content-between">
                                                <span>${category.charAt(0).toUpperCase() + category.slice(1)}:</span>
                                                <strong>€${amount.toFixed(2)}</strong>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : '<p class="text-muted">Nenhum gasto registrado nesta viagem</p>'}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove modal existente se houver
        const existingModal = document.getElementById('tripDetailsModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Adiciona novo modal
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Mostra modal
        const modal = new bootstrap.Modal(document.getElementById('tripDetailsModal'));
        modal.show();

    } catch (error) {
        console.error('Erro ao carregar detalhes da viagem:', error);
        tracker.showAlert('Erro ao carregar detalhes da viagem', 'danger');
    }
}

async function convertCurrency() {
    const amount = parseFloat(document.getElementById('convert-amount').value);
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;

    if (!amount || amount <= 0) {
        tracker.showAlert('Digite um valor válido para conversão', 'warning');
        return;
    }

    try {
        const response = await fetch(`/api/convert?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`);
        const data = await response.json();

        if (data.error) {
            tracker.showAlert('Erro na conversão: ' + data.error, 'danger');
            return;
        }

        const resultHtml = `
            <div class="alert alert-light">
                <div class="text-center">
                    <h5>${amount.toFixed(2)} ${fromCurrency}</h5>
                    <i class="fas fa-arrow-down text-primary"></i>
                    <h4 class="text-primary mt-2">${data.converted_amount.toFixed(2)} ${toCurrency}</h4>
                    <small class="text-muted">
                        Taxa: ${data.rate_used.toFixed(4)}<br>
                        ${new Date(data.timestamp).toLocaleString('pt-BR')}
                    </small>
                </div>
            </div>
        `;

        document.getElementById('conversion-result').innerHTML = resultHtml;

    } catch (error) {
        console.error('Erro na conversão:', error);
        tracker.showAlert('Erro ao converter moeda', 'danger');
    }
}

// ==================== AMAZON Q DEVELOPER FUNCTIONS ====================

async function processVoiceCommand() {
    const command = document.getElementById('voice-input').value.trim();
    
    if (!command) {
        tracker.showAlert('Digite um comando de voz', 'warning');
        return;
    }

    try {
        const response = await fetch('/api/v1/voice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ command: command })
        });

        const result = await response.json();
        
        const resultDiv = document.getElementById('qdev-result');
        
        if (result.success) {
            resultDiv.innerHTML = `
                <div class="alert alert-success">
                    <i class="fas fa-microphone me-2"></i>
                    <strong>Comando processado:</strong> ${result.message}
                </div>
            `;
            
            document.getElementById('voice-input').value = '';
            tracker.loadDashboard(); // Recarrega dashboard
            tracker.loadPieChart(); // Recarrega gráfico
            
        } else {
            resultDiv.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    <strong>Erro:</strong> ${result.error}
                </div>
            `;
        }

    } catch (error) {
        console.error('Erro no comando de voz:', error);
        tracker.showAlert('Erro ao processar comando de voz', 'danger');
    }
}

async function classifyText() {
    const text = document.getElementById('classify-input').value.trim();
    
    if (!text) {
        tracker.showAlert('Digite um texto para classificar', 'warning');
        return;
    }

    try {
        const response = await fetch('/api/v1/classify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text })
        });

        const result = await response.json();
        
        const resultDiv = document.getElementById('qdev-result');
        
        if (result.success) {
            const cls = result.classification;
            resultDiv.innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-brain me-2"></i>
                    <strong>Classificação IA:</strong><br>
                    📂 Categoria: <strong>${cls.category}</strong><br>
                    💰 Valor: <strong>€${cls.amount}</strong><br>
                    📝 Tipo: <strong>${cls.type}</strong>
                    <br><br>
                    <button class="btn btn-sm btn-success" onclick="addClassifiedTransaction('${cls.category}', ${cls.amount}, '${cls.type}', '${cls.original_text}')">
                        <i class="fas fa-plus me-1"></i>Adicionar Transação
                    </button>
                </div>
            `;
            
        } else {
            resultDiv.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    <strong>Erro:</strong> ${result.error}
                </div>
            `;
        }

    } catch (error) {
        console.error('Erro na classificação:', error);
        tracker.showAlert('Erro ao classificar texto', 'danger');
    }
}

async function addClassifiedTransaction(category, amount, type, description) {
    const formData = {
        amount: amount,
        type: type,
        category: category,
        description: description
    };

    try {
        const response = await fetch('/api/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            tracker.showAlert('Transação classificada adicionada com sucesso!', 'success');
            document.getElementById('classify-input').value = '';
            document.getElementById('qdev-result').innerHTML = '';
            tracker.loadDashboard();
            tracker.loadPieChart();
        } else {
            tracker.showAlert('Erro ao adicionar transação classificada', 'danger');
        }

    } catch (error) {
        console.error('Erro ao adicionar transação classificada:', error);
        tracker.showAlert('Erro ao adicionar transação classificada', 'danger');
    }
}

// ==================== INICIALIZAÇÃO ====================

let tracker;
document.addEventListener('DOMContentLoaded', () => {
    tracker = new UnifiedExpenseTracker();
    
    // Easter egg - Konami Code
    let konamiCode = [];
    const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.keyCode);
        if (konamiCode.length > konami.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join(',') === konami.join(',')) {
            tracker.showAlert('🎉 Easter Egg! Unified Expense Tracker ativado com Amazon Q Developer!', 'success');
            document.body.style.animation = 'rainbow 2s infinite';
        }
    });
});
