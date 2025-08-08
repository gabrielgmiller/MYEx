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
        
        // Carrega dados iniciais imediatamente
        this.loadDashboard();
        this.loadTrips();
        this.loadPieChart();
        
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
                            <div class="transaction-item ${itemClass}" style="animation-delay: ${index * 0.1}s" data-transaction-index="${index}">
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
                                    <div class="text-end d-flex align-items-center">
                                        <div class="me-3">
                                            <div class="${amountClass} fw-bold">
                                                ${amountPrefix}€${(transaction.amount || 0).toFixed(2)}
                                            </div>
                                            <small class="text-muted">${transaction.category || 'outros'}</small>
                                        </div>
                                        <button class="btn btn-sm btn-outline-danger" onclick="deleteTransaction(${index})" title="Deletar transação">
                                            <i class="fas fa-trash"></i>
                                        </button>
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
                <div class="trip-card p-3 mb-2" data-trip-id="${tripId}">
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
                        <div class="d-flex gap-2">
                            <button class="btn btn-sm btn-outline-primary" 
                                    onclick="viewTripDetails('${tripId}')" title="Ver detalhes">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" 
                                    onclick="deleteTrip('${tripId}')" title="Deletar viagem">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
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

// 🔧 Função para deletar transação com retry e melhor feedback
async function deleteTransaction(transactionIndex, retryCount = 0) {
    const MAX_RETRIES = 2;
    const RETRY_DELAY = 1000; // 1 segundo
    
    if (!confirm('Tem certeza que deseja deletar esta transação?')) {
        return;
    }
    
    // Mostra loading visual
    const loadingToast = showLoadingToast('Deletando transação...');
    
    try {
        console.log(`🗑️ Deletando transação no índice: ${transactionIndex} (tentativa ${retryCount + 1})`);
        updateDebugStatus('Processando', `Deletando transação (${retryCount + 1}/${MAX_RETRIES + 1})`);
        
        // Verifica se o servidor está respondendo primeiro
        try {
            const healthCheck = await fetch('/api/dashboard', {
                method: 'GET'
            });
            
            if (!healthCheck.ok) {
                throw new Error('Servidor não está respondendo');
            }
        } catch (healthError) {
            throw new Error('Servidor não está rodando. Inicie a aplicação com: python3 expense_tracker_voice_fixed.py');
        }
        
        const response = await fetch('/api/transaction/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ transaction_index: transactionIndex })
        });
        
        // Verifica se a resposta é válida
        if (!response.ok) {
            throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Transação deletada com sucesso');
            updateDebugStatus('Sucesso', 'Transação deletada');
            hideLoadingToast(loadingToast);
            showSuccessToast(`Transação deletada: ${result.removed_transaction?.description || 'N/A'}`);
            
            // Remove o elemento da interface com animação
            const transactionElement = document.querySelector(`[data-transaction-index="${transactionIndex}"]`);
            if (transactionElement) {
                transactionElement.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => {
                    transactionElement.remove();
                }, 300);
            }
            
            // Recarrega o dashboard para atualizar os totais
            setTimeout(() => {
                if (tracker) {
                    tracker.loadDashboard();
                    tracker.loadPieChart();
                }
            }, 500);
            
        } else {
            throw new Error(result.error || 'Erro desconhecido do servidor');
        }
        
    } catch (error) {
        console.error(`❌ Erro na tentativa ${retryCount + 1}:`, error);
        hideLoadingToast(loadingToast);
        
        // Determina o tipo de erro
        let errorMessage = '';
        let shouldRetry = false;
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            errorMessage = 'Servidor não está rodando. Inicie a aplicação com: python3 expense_tracker_voice_fixed.py';
            shouldRetry = retryCount < MAX_RETRIES;
        } else if (error.message.includes('Servidor não está rodando')) {
            errorMessage = error.message;
            shouldRetry = retryCount < MAX_RETRIES;
        } else if (error.message.includes('timeout') || error.message.includes('network')) {
            errorMessage = 'Timeout de rede. Verifique sua conexão.';
            shouldRetry = retryCount < MAX_RETRIES;
        } else if (error.message.includes('HTTP 500')) {
            errorMessage = 'Erro interno do servidor. Verifique os logs.';
            shouldRetry = retryCount < MAX_RETRIES;
        } else {
            errorMessage = error.message;
            shouldRetry = false;
        }
        
        updateDebugStatus('Erro', `Delete: ${errorMessage}`);
        
        // Tenta novamente se apropriado
        if (shouldRetry) {
            console.log(`🔄 Tentando novamente em ${RETRY_DELAY}ms...`);
            showWarningToast(`Erro: ${errorMessage}. Tentando novamente...`);
            
            setTimeout(() => {
                deleteTransaction(transactionIndex, retryCount + 1);
            }, RETRY_DELAY);
        } else {
            // Mostra erro final
            showErrorToast(`Erro ao deletar transação: ${errorMessage}`);
            
            // Se for erro de servidor não rodando, oferece ajuda
            if (errorMessage.includes('Servidor não está rodando')) {
                setTimeout(() => {
                    if (confirm('O servidor não está rodando. Deseja ver as instruções para iniciá-lo?')) {
                        showInfoToast('Execute: python3 expense_tracker_voice_fixed.py na pasta do projeto');
                    }
                }, 2000);
            }
        }
    }
}

// Função para deletar viagem
async function deleteTrip(tripId) {
    if (!confirm('Tem certeza que deseja deletar esta viagem? Todas as transações associadas serão mantidas, mas perderão a associação com a viagem.')) {
        return;
    }
    
    try {
        console.log('🗑️ Deletando viagem:', tripId);
        updateDebugStatus('Processando', 'Deletando viagem');
        
        const response = await fetch('/api/trip/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ trip_id: tripId })
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Viagem deletada com sucesso');
            updateDebugStatus('Sucesso', 'Viagem deletada');
            
            // Remove o elemento da interface
            const tripElement = document.querySelector(`[data-trip-id="${tripId}"]`);
            if (tripElement) {
                tripElement.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => {
                    tripElement.remove();
                }, 300);
            }
            
            // Recarrega as viagens e o dashboard
            setTimeout(() => {
                if (tracker) {
                    tracker.loadTrips();
                    tracker.loadDashboard();
                }
            }, 500);
            
        } else {
            console.error('❌ Erro ao deletar viagem:', result.error);
            updateDebugStatus('Erro', `Delete: ${result.error}`);
            alert('Erro ao deletar viagem: ' + result.error);
        }
        
    } catch (error) {
        console.error('❌ Erro na requisição de delete:', error);
        updateDebugStatus('Erro', `Delete: ${error.message}`);
        alert('Erro ao deletar viagem: ' + error.message);
    }
}

// Funções de debug
function updateDebugStatus(status, action) {
    const statusEl = document.getElementById('debug-status');
    const actionEl = document.getElementById('debug-action');
    if (statusEl) statusEl.textContent = status;
    if (actionEl) actionEl.textContent = action;
}

// 🎨 FUNÇÕES AUXILIARES PARA TOASTS (NOTIFICAÇÕES VISUAIS)
function showLoadingToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-loading';
    toast.innerHTML = `
        <div class="d-flex align-items-center">
            <div class="spinner-border spinner-border-sm me-2" role="status"></div>
            <span>${message}</span>
        </div>
    `;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #007bff;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
    `;
    document.body.appendChild(toast);
    return toast;
}

function hideLoadingToast(toast) {
    if (toast && toast.parentNode) {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }
}

function showSuccessToast(message) {
    showToast(message, 'success', '#28a745');
}

function showErrorToast(message) {
    showToast(message, 'error', '#dc3545');
}

function showWarningToast(message) {
    showToast(message, 'warning', '#ffc107');
}

function showInfoToast(message) {
    showToast(message, 'info', '#17a2b8');
}

function showToast(message, type, color) {
    const toast = document.createElement('div');
    toast.className = `toast-${type}`;
    
    const icon = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    }[type] || '📢';
    
    toast.innerHTML = `
        <div class="d-flex align-items-center">
            <span class="me-2">${icon}</span>
            <span>${message}</span>
        </div>
    `;
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${color};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
        max-width: 400px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(toast);
    
    // Remove automaticamente após 5 segundos
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }
    }, 5000);
}

// Adiciona CSS para animações se não existir
if (!document.querySelector('#toast-animations')) {
    const style = document.createElement('style');
    style.id = 'toast-animations';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(0.8); }
        }
    `;
    document.head.appendChild(style);
}

// Inicialização
let tracker;
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM carregado, inicializando tracker v2...');
    updateDebugStatus('Inicializando', 'DOM Loaded');
    tracker = new ExpenseTrackerFinal();
});
