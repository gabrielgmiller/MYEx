// 🚀 Expense Tracker Final - JavaScript v2 - Corrigido
// Versão com correções para transações recentes e categorias

class ExpenseTrackerFinal {
    constructor() {
        this.init();
    }

    init() {
        console.log('🚀 Inicializando Expense Tracker Final v2...');
        this.updateCurrentDate();
        this.setupEventListeners();
        this.addAnimations();
        
        // Carrega dados iniciais
        setTimeout(() => {
            this.loadDashboard();
            this.loadTrips();
            this.loadPieChart();
        }, 500);
        
        // Auto-refresh a cada 30 segundos
        setInterval(() => this.loadDashboard(), 30000);
        console.log('✅ Expense Tracker Final v2 inicializado!');
    }

    updateCurrentDate() {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        };
        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            dateElement.textContent = now.toLocaleDateString('pt-BR', options);
        }
    }

    setupEventListeners() {
        console.log('🔧 Configurando event listeners...');
        
        // Form de transação
        const transactionForm = document.getElementById('transaction-form');
        if (transactionForm) {
            transactionForm.addEventListener('submit', (e) => {
                console.log('📝 Formulário de transação submetido');
                e.preventDefault();
                this.addTransaction();
            });
            console.log('✅ Event listener do formulário configurado');
        } else {
            console.error('❌ Formulário de transação não encontrado!');
        }

        // Form de viagem
        const tripForm = document.getElementById('trip-form');
        if (tripForm) {
            tripForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createTrip();
            });
        }

        // Enter key para comandos
        const voiceInput = document.getElementById('voice-input');
        if (voiceInput) {
            voiceInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') processVoiceCommand();
            });
        }

        const classifyInput = document.getElementById('classify-input');
        if (classifyInput) {
            classifyInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') classifyText();
            });
        }
    }

    addAnimations() {
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
            console.log('📊 Carregando dashboard...');
            updateDebugStatus('Carregando', 'Dashboard');
            
            const response = await fetch('/api/dashboard');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('📊 Dados do dashboard:', data);
            
            // Atualiza componentes em sequência
            this.updateDashboardCards(data);
            await this.updateCategoryDistribution(data.category_distribution);
            await this.loadRecentTransactions();
            
            updateDebugStatus('Sucesso', 'Dashboard carregado');
            console.log('✅ Dashboard carregado com sucesso');
            
        } catch (error) {
            console.error('❌ Erro ao carregar dashboard:', error);
            updateDebugStatus('Erro', `Dashboard: ${error.message}`);
            this.showAlert('Erro ao carregar dados do dashboard: ' + error.message, 'danger');
        }
    }

    updateDashboardCards(data) {
        console.log('🔄 Atualizando cards do dashboard...');
        
        try {
            // Atualiza cards com animação
            this.animateValue('total-expenses', data.total_expenses || 0, '€');
            this.animateValue('total-income', data.total_income || 0, '€');
            this.animateValue('balance', data.balance || 0, '€');
            
            // Analytics avançados
            if (data.analytics) {
                this.animateValue('avg-daily', data.analytics.avg_daily_expense || 0, '€');
                this.animateValue('savings-rate', data.analytics.savings_rate || 0, '%');
            }
            
            // Cor do saldo
            const balanceElement = document.getElementById('balance');
            if (balanceElement) {
                balanceElement.className = (data.balance || 0) >= 0 ? 'text-success' : 'text-danger';
            }
            
            console.log('✅ Cards atualizados');
        } catch (error) {
            console.error('❌ Erro ao atualizar cards:', error);
        }
    }

    animateValue(elementId, finalValue, suffix = '') {
        const element = document.getElementById(elementId);
        if (!element) {
            console.warn(`⚠️ Elemento ${elementId} não encontrado`);
            return;
        }
        
        try {
            const startValue = parseFloat(element.textContent.replace(/[€%,]/g, '')) || 0;
            const duration = 1000;
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
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
        } catch (error) {
            console.error(`❌ Erro ao animar ${elementId}:`, error);
        }
    }

    async updateCategoryDistribution(distribution) {
        return new Promise((resolve) => {
            try {
                console.log('📊 Atualizando distribuição por categoria...', distribution);
                
                const container = document.getElementById('category-distribution');
                if (!container) {
                    console.warn('⚠️ Container de distribuição por categoria não encontrado');
                    resolve();
                    return;
                }
                
                if (!distribution || Object.keys(distribution).length === 0) {
                    container.innerHTML = '<p class="text-muted">Nenhum gasto registrado</p>';
                    console.log('ℹ️ Nenhuma categoria encontrada');
                    resolve();
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
                console.log(`📊 Total para distribuição: €${total}`);

                for (const [category, amount] of Object.entries(distribution)) {
                    const percentage = total > 0 ? ((amount / total) * 100).toFixed(1) : '0.0';
                    const icon = categoryIcons[category] || '📦';
                    
                    html += `
                        <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
                            <div>
                                <span class="me-2">${icon}</span>
                                <strong>${category.charAt(0).toUpperCase() + category.slice(1)}</strong>
                            </div>
                            <div class="text-end">
                                <div class="fw-bold">€${amount.toFixed(2)}</div>
                                <small class="text-muted">${percentage}%</small>
                            </div>
                        </div>
                    `;
                }

                container.innerHTML = html;
                console.log('✅ Distribuição por categoria atualizada');
                resolve();
                
            } catch (error) {
                console.error('❌ Erro ao atualizar distribuição:', error);
                resolve();
            }
        });
    }

    async loadRecentTransactions() {
        return new Promise(async (resolve) => {
            try {
                console.log('📋 Carregando transações recentes...');
                updateDebugStatus('Carregando', 'Transações');
                
                const response = await fetch('/api/transactions');
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const transactions = await response.json();
                console.log(`📋 ${transactions.length} transações carregadas:`, transactions);
                
                if (!Array.isArray(transactions)) {
                    throw new Error('Resposta não é um array');
                }
                
                const recent = transactions
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 10);
                
                console.log(`📋 ${recent.length} transações recentes selecionadas`);
                
                await this.displayRecentTransactions(recent);
                updateDebugStatus('Sucesso', `${recent.length} transações`);
                resolve();
                
            } catch (error) {
                console.error('❌ Erro ao carregar transações:', error);
                updateDebugStatus('Erro', `Transações: ${error.message}`);
                
                // Mostra erro na interface
                const container = document.getElementById('recent-transactions');
                if (container) {
                    container.innerHTML = `
                        <div class="alert alert-danger">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            Erro ao carregar transações: ${error.message}
                        </div>
                    `;
                }
                resolve();
            }
        });
    }

    async displayRecentTransactions(transactions) {
        return new Promise((resolve) => {
            try {
                console.log('🖼️ Exibindo transações recentes...', transactions);
                
                const container = document.getElementById('recent-transactions');
                if (!container) {
                    console.warn('⚠️ Container de transações recentes não encontrado');
                    resolve();
                    return;
                }
                
                // Remove loading
                const loading = container.querySelector('.loading');
                if (loading) {
                    loading.style.display = 'none';
                }
                
                if (!transactions || transactions.length === 0) {
                    container.innerHTML = '<p class="text-muted">Nenhuma transação encontrada</p>';
                    console.log('ℹ️ Nenhuma transação para exibir');
                    resolve();
                    return;
                }

                let html = '';
                const typeIcons = { 'despesa': '💸', 'ganho': '💰' };
                const sourceIcons = { 'web': '🌐', 'qdev': '🤖', 'voice': '🎤', 'manual': '✋' };

                transactions.forEach((transaction, index) => {
                    try {
                        const date = new Date(transaction.date).toLocaleDateString('pt-BR');
                        const time = new Date(transaction.date).toLocaleTimeString('pt-BR', {
                            hour: '2-digit', minute: '2-digit'
                        });
                        const icon = typeIcons[transaction.type] || '💸';
                        const sourceIcon = sourceIcons[transaction.source] || '✋';
                        const itemClass = transaction.type === 'despesa' ? 'expense' : 'income';
                        const amountClass = transaction.type === 'despesa' ? 'text-danger' : 'text-success';
                        const amountPrefix = transaction.type === 'despesa' ? '-' : '+';

                        html += `
                            <div class="transaction-item ${itemClass}" style="animation-delay: ${index * 0.1}s">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div class="flex-grow-1">
                                        <div class="fw-bold">
                                            ${icon} ${transaction.description || transaction.category || 'Sem descrição'}
                                        </div>
                                        <small class="text-muted">
                                            ${date} ${time} ${sourceIcon}
                                            ${transaction.trip_id ? '✈️' : ''}
                                        </small>
                                    </div>
                                    <div class="text-end">
                                        <div class="${amountClass} fw-bold">
                                            ${amountPrefix}€${(transaction.amount || 0).toFixed(2)}
                                        </div>
                                        <small class="text-muted">${transaction.category || 'outros'}</small>
                                    </div>
                                </div>
                            </div>
                        `;
                    } catch (itemError) {
                        console.error('❌ Erro ao processar transação:', itemError, transaction);
                    }
                });

                container.innerHTML = html;
                console.log('✅ Transações recentes exibidas');
                resolve();
                
            } catch (error) {
                console.error('❌ Erro ao exibir transações:', error);
                resolve();
            }
        });
    }

    async addTransaction() {
        console.log('💰 Iniciando adição de transação...');
        updateDebugStatus('Processando', 'Adicionando transação');
        
        try {
            // Validação dos elementos do formulário
            const amountElement = document.getElementById('amount');
            const typeElement = document.getElementById('type');
            const categoryElement = document.getElementById('category');
            const descriptionElement = document.getElementById('description');
            const tripSelectElement = document.getElementById('trip-select');
            
            if (!amountElement || !typeElement || !categoryElement) {
                throw new Error('Elementos do formulário não encontrados');
            }
            
            // Validação dos valores
            const amount = parseFloat(amountElement.value);
            if (isNaN(amount) || amount <= 0) {
                throw new Error('Valor inválido');
            }
            
            const formData = {
                amount: amount,
                type: typeElement.value,
                category: categoryElement.value,
                description: descriptionElement ? descriptionElement.value : '',
                trip_id: tripSelectElement && tripSelectElement.value ? tripSelectElement.value : null
            };
            
            console.log('📝 Dados do formulário:', formData);

            const response = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            console.log('✅ Resultado:', result);

            if (result.success) {
                console.log('🎉 Transação adicionada com sucesso!');
                this.showAlert('Transação adicionada com sucesso!', 'success');
                updateDebugStatus('Sucesso', 'Transação adicionada');
                
                // Reset do formulário
                const form = document.getElementById('transaction-form');
                if (form) {
                    form.reset();
                }
                
                // Recarrega dados
                setTimeout(() => {
                    this.loadDashboard();
                    this.loadPieChart();
                }, 500);
                
                // Efeito visual no botão
                const submitBtn = document.querySelector('#transaction-form button[type="submit"]');
                if (submitBtn) {
                    const originalHTML = submitBtn.innerHTML;
                    submitBtn.innerHTML = '<i class="fas fa-check me-1"></i>Adicionado!';
                    submitBtn.classList.add('btn-success');
                    
                    setTimeout(() => {
                        submitBtn.innerHTML = originalHTML;
                        submitBtn.classList.remove('btn-success');
                    }, 2000);
                }
                
            } else {
                throw new Error(result.error || 'Erro desconhecido');
            }

        } catch (error) {
            console.error('❌ Erro ao adicionar transação:', error);
            updateDebugStatus('Erro', `Transação: ${error.message}`);
            this.showAlert(`Erro ao adicionar transação: ${error.message}`, 'danger');
        }
    }

    showAlert(message, type = 'info') {
        console.log(`🔔 Mostrando alerta: ${type} - ${message}`);
        
        // Remove alertas existentes
        document.querySelectorAll('.alert').forEach(alert => {
            if (alert.classList.contains('position-fixed')) {
                alert.remove();
            }
        });

        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        
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

        setTimeout(() => {
            if (alertDiv.parentNode) alertDiv.remove();
        }, 5000);
    }

    // Resto das funções mantidas iguais...
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
        if (!container) return;
        
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
        if (!select) return;
        
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }

        for (const [tripId, trip] of Object.entries(trips)) {
            const option = document.createElement('option');
            option.value = tripId;
            option.textContent = trip.name;
            select.appendChild(option);
        }
    }

    async loadPieChart() {
        try {
            const loadingElement = document.querySelector('#pie-chart-container .loading');
            if (loadingElement) {
                loadingElement.style.display = 'block';
            }
            
            const response = await fetch('/api/chart/pie');
            const data = await response.json();
            
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            
            const container = document.getElementById('pie-chart-container');
            if (!container) return;
            
            if (data.chart) {
                container.innerHTML = 
                    `<img src="${data.chart}" class="img-fluid rounded" alt="Gráfico de Distribuição" style="max-height: 400px;">`;
            } else {
                container.innerHTML = 
                    '<p class="text-muted text-center">Dados insuficientes para gerar gráfico</p>';
            }
            
        } catch (error) {
            console.error('Erro ao carregar gráfico:', error);
            const loadingElement = document.querySelector('#pie-chart-container .loading');
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            const container = document.getElementById('pie-chart-container');
            if (container) {
                container.innerHTML = '<p class="text-danger text-center">Erro ao carregar gráfico</p>';
            }
        }
    }
}

// Funções de debug
function updateDebugStatus(status, action) {
    const statusEl = document.getElementById('debug-status');
    const actionEl = document.getElementById('debug-action');
    if (statusEl) statusEl.textContent = status;
    if (actionEl) actionEl.textContent = action;
}

// Inicialização
let tracker;
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM carregado, inicializando tracker v2...');
    updateDebugStatus('Inicializando', 'DOM Loaded');
    tracker = new ExpenseTrackerFinal();
});
