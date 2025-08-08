/**
 * 🧳 TRIPS.JS - Funcionalidades da Página de Viagens
 * Controle completo de viagens com orçamentos e gastos
 */

let currentTripId = null;
let trips = {};

// ========================================
// 🚀 INICIALIZAÇÃO
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🧳 Inicializando página de viagens...');
    loadTrips();
    setupEventListeners();
});

function setupEventListeners() {
    // Auto-calcular data de fim baseada na duração
    document.getElementById('trip-duration').addEventListener('input', function() {
        const startDate = document.getElementById('trip-start-date').value;
        const duration = parseInt(this.value);
        
        if (startDate && duration > 0) {
            const start = new Date(startDate);
            const end = new Date(start);
            end.setDate(start.getDate() + duration - 1);
            
            document.getElementById('trip-end-date').value = end.toISOString().split('T')[0];
        }
    });

    // Auto-calcular duração baseada nas datas
    document.getElementById('trip-end-date').addEventListener('change', function() {
        const startDate = document.getElementById('trip-start-date').value;
        const endDate = this.value;
        
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
            
            if (duration > 0) {
                document.getElementById('trip-duration').value = duration;
            }
        }
    });

    // Definir data padrão como hoje
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('expense-date').value = today;
}

// ========================================
// 📊 CARREGAMENTO DE DADOS
// ========================================

async function loadTrips() {
    try {
        console.log('📊 Carregando viagens...');
        const response = await fetch('/api/trips');
        const data = await response.json();
        
        trips = data;
        console.log('✅ Viagens carregadas:', Object.keys(trips).length);
        
        renderTrips();
    } catch (error) {
        console.error('❌ Erro ao carregar viagens:', error);
        showError('Erro ao carregar viagens');
    }
}

function renderTrips() {
    const container = document.getElementById('trips-container');
    const emptyState = document.getElementById('empty-state');
    
    if (Object.keys(trips).length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    const tripsArray = Object.values(trips).sort((a, b) => 
        new Date(b.created_at || 0) - new Date(a.created_at || 0)
    );
    
    // Renderizar cada viagem de forma assíncrona para carregar estatísticas
    container.innerHTML = '<div class="text-center"><i class="fas fa-spinner fa-spin fa-2x"></i><p>Carregando viagens...</p></div>';
    
    Promise.all(tripsArray.map(trip => renderTripCardWithStats(trip)))
        .then(cards => {
            container.innerHTML = cards.join('');
        })
        .catch(error => {
            console.error('❌ Erro ao renderizar viagens:', error);
            container.innerHTML = '<div class="alert alert-danger">Erro ao carregar viagens</div>';
        });
}

async function renderTripCardWithStats(trip) {
    // Calcular estatísticas da viagem
    const stats = await calculateTripStatsAsync(trip);
    const progressClass = getProgressClass(stats.budgetPercentage);
    const alertClass = stats.budgetPercentage >= 80 ? 'budget-alert' : '';
    
    return `
        <div class="trip-card ${alertClass}">
            <div class="trip-header">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h4 class="mb-2">
                            <i class="fas fa-map-marker-alt me-2"></i>${trip.name}
                        </h4>
                        <div class="row text-white-75">
                            <div class="col-md-4">
                                <small><i class="fas fa-calendar me-1"></i>${stats.duration} dias</small>
                            </div>
                            <div class="col-md-4">
                                <small><i class="fas fa-calendar-alt me-1"></i>${formatDate(trip.start_date)}</small>
                            </div>
                            <div class="col-md-4">
                                <small><i class="fas fa-calendar-check me-1"></i>${formatDate(trip.end_date)}</small>
                            </div>
                        </div>
                    </div>
                    <div class="dropdown">
                        <button class="btn btn-light btn-sm dropdown-toggle" data-bs-toggle="dropdown">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#" onclick="editTrip('${trip.id}')">
                                <i class="fas fa-edit me-2"></i>Editar
                            </a></li>
                            <li><a class="dropdown-item text-danger" href="#" onclick="deleteTrip('${trip.id}')">
                                <i class="fas fa-trash me-2"></i>Excluir
                            </a></li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="card-body">
                <!-- Estatísticas -->
                <div class="row mb-4">
                    <div class="col-md-3">
                        <div class="stats-card">
                            <div class="stats-value text-primary">€${stats.totalSpent.toFixed(2)}</div>
                            <div class="stats-label">Total Gasto</div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stats-card">
                            <div class="stats-value text-success">€${stats.budget.toFixed(2)}</div>
                            <div class="stats-label">Orçamento</div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stats-card">
                            <div class="stats-value ${stats.remaining >= 0 ? 'text-success' : 'text-danger'}">
                                €${Math.abs(stats.remaining).toFixed(2)}
                            </div>
                            <div class="stats-label">${stats.remaining >= 0 ? 'Restante' : 'Excedido'}</div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stats-card">
                            <div class="stats-value text-info">€${stats.dailyAverage.toFixed(2)}</div>
                            <div class="stats-label">Média/Dia</div>
                        </div>
                    </div>
                </div>
                
                <!-- Barra de Progresso -->
                <div class="mb-4">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="fw-bold">Progresso do Orçamento</span>
                        <span class="badge ${progressClass} fs-6">${stats.budgetPercentage.toFixed(1)}%</span>
                    </div>
                    <div class="progress progress-custom">
                        <div class="progress-bar progress-bar-custom ${progressClass}" 
                             style="width: ${Math.min(stats.budgetPercentage, 100)}%"></div>
                    </div>
                    ${stats.budgetPercentage >= 80 ? `
                        <div class="alert alert-warning mt-2 mb-0">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            ${stats.budgetPercentage >= 100 ? 'Orçamento ultrapassado!' : 'Atenção: 80% do orçamento atingido!'}
                        </div>
                    ` : ''}
                </div>
                
                <!-- Ações -->
                <div class="d-flex gap-2 flex-wrap">
                    <button class="btn btn-primary-custom btn-custom" onclick="addExpenseToTrip('${trip.id}')">
                        <i class="fas fa-plus me-2"></i>Adicionar Gasto
                    </button>
                    <button class="btn btn-outline-primary btn-custom" onclick="viewTripDetails('${trip.id}')">
                        <i class="fas fa-chart-line me-2"></i>Ver Detalhes
                    </button>
                    <button class="btn btn-outline-secondary btn-custom" onclick="editTrip('${trip.id}')">
                        <i class="fas fa-edit me-2"></i>Editar
                    </button>
                </div>
            </div>
        </div>
    `;
}

async function calculateTripStatsAsync(trip) {
    try {
        // Buscar dados detalhados da viagem
        const response = await fetch(`/api/trips/${trip.id}`);
        const data = await response.json();
        
        if (data.error) {
            // Se não conseguir buscar dados, retornar valores padrão
            return {
                totalSpent: 0,
                budget: trip.budget || 0,
                remaining: trip.budget || 0,
                budgetPercentage: 0,
                dailyAverage: 0,
                duration: calculateDuration(trip.start_date, trip.end_date)
            };
        }
        
        return {
            totalSpent: data.total_spent || 0,
            budget: trip.budget || 0,
            remaining: data.budget_comparison || 0,
            budgetPercentage: data.budget_percentage || 0,
            dailyAverage: data.daily_average || 0,
            duration: data.duration || calculateDuration(trip.start_date, trip.end_date)
        };
    } catch (error) {
        console.error('❌ Erro ao calcular estatísticas da viagem:', error);
        return {
            totalSpent: 0,
            budget: trip.budget || 0,
            remaining: trip.budget || 0,
            budgetPercentage: 0,
            dailyAverage: 0,
            duration: calculateDuration(trip.start_date, trip.end_date)
        };
    }
}

function calculateDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
}

function getProgressClass(percentage) {
    if (percentage >= 100) return 'bg-danger';
    if (percentage >= 80) return 'bg-warning';
    if (percentage >= 60) return 'bg-info';
    return 'bg-success';
}

// ========================================
// 🆕 CRIAR/EDITAR VIAGEM
// ========================================

function showCreateTripModal() {
    document.getElementById('modal-title').textContent = 'Nova Viagem';
    document.getElementById('trip-form').reset();
    document.getElementById('trip-id').value = '';
    
    // Definir data padrão como hoje
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('trip-start-date').value = today;
    
    new bootstrap.Modal(document.getElementById('tripModal')).show();
}

function editTrip(tripId) {
    const trip = trips[tripId];
    if (!trip) return;
    
    document.getElementById('modal-title').textContent = 'Editar Viagem';
    document.getElementById('trip-id').value = trip.id;
    document.getElementById('trip-name').value = trip.name;
    document.getElementById('trip-start-date').value = trip.start_date;
    document.getElementById('trip-end-date').value = trip.end_date;
    document.getElementById('trip-budget').value = trip.budget;
    
    const duration = calculateDuration(trip.start_date, trip.end_date);
    document.getElementById('trip-duration').value = duration;
    
    new bootstrap.Modal(document.getElementById('tripModal')).show();
}

async function saveTripForm() {
    const form = document.getElementById('trip-form');
    const formData = new FormData(form);
    const tripId = formData.get('trip_id');
    
    const tripData = {
        name: formData.get('name'),
        start_date: formData.get('start_date'),
        end_date: formData.get('end_date'),
        budget: parseFloat(formData.get('budget')) || 0
    };
    
    // Validações
    if (!tripData.name.trim()) {
        showError('Nome da viagem é obrigatório');
        return;
    }
    
    if (!tripData.start_date || !tripData.end_date) {
        showError('Datas de início e fim são obrigatórias');
        return;
    }
    
    if (new Date(tripData.start_date) > new Date(tripData.end_date)) {
        showError('Data de início deve ser anterior à data de fim');
        return;
    }
    
    if (tripData.budget < 0) {
        showError('Orçamento deve ser um valor positivo');
        return;
    }
    
    try {
        let response;
        
        if (tripId) {
            // Editar viagem existente
            response = await fetch(`/api/trips/${tripId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tripData)
            });
        } else {
            // Criar nova viagem
            response = await fetch('/api/trips', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tripData)
            });
        }
        
        const result = await response.json();
        
        if (result.success) {
            showSuccess(tripId ? 'Viagem atualizada com sucesso!' : 'Viagem criada com sucesso!');
            bootstrap.Modal.getInstance(document.getElementById('tripModal')).hide();
            loadTrips(); // Recarregar lista
        } else {
            showError(result.error || 'Erro ao salvar viagem');
        }
    } catch (error) {
        console.error('❌ Erro ao salvar viagem:', error);
        showError('Erro ao salvar viagem');
    }
}

// ========================================
// 💰 ADICIONAR GASTOS
// ========================================

function addExpenseToTrip(tripId) {
    currentTripId = tripId;
    const trip = trips[tripId];
    
    document.getElementById('expense-form').reset();
    document.getElementById('expense-trip-id').value = tripId;
    
    // Definir data padrão como hoje
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('expense-date').value = today;
    
    new bootstrap.Modal(document.getElementById('expenseModal')).show();
}

async function saveExpenseForm() {
    const form = document.getElementById('expense-form');
    const formData = new FormData(form);
    
    const expenseData = {
        amount: parseFloat(formData.get('amount')),
        type: 'despesa',
        category: formData.get('category'),
        description: formData.get('description') || '',
        trip_id: formData.get('trip_id'),
        currency: 'EUR',
        date: formData.get('date')
    };
    
    // Validações
    if (!expenseData.amount || expenseData.amount <= 0) {
        showError('Valor deve ser maior que zero');
        return;
    }
    
    if (!expenseData.category) {
        showError('Categoria é obrigatória');
        return;
    }
    
    if (!expenseData.date) {
        showError('Data é obrigatória');
        return;
    }
    
    try {
        const response = await fetch('/api/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(expenseData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccess('Gasto adicionado com sucesso!');
            bootstrap.Modal.getInstance(document.getElementById('expenseModal')).hide();
            loadTrips(); // Recarregar para atualizar estatísticas
        } else {
            showError(result.error || 'Erro ao adicionar gasto');
        }
    } catch (error) {
        console.error('❌ Erro ao adicionar gasto:', error);
        showError('Erro ao adicionar gasto');
    }
}

// ========================================
// 📊 DETALHES DA VIAGEM
// ========================================

async function viewTripDetails(tripId) {
    try {
        const response = await fetch(`/api/trips/${tripId}`);
        const data = await response.json();
        
        if (data.error) {
            showError('Erro ao carregar detalhes da viagem');
            return;
        }
        
        document.getElementById('details-trip-name').textContent = data.trip.name;
        document.getElementById('trip-details-content').innerHTML = renderTripDetails(data);
        
        new bootstrap.Modal(document.getElementById('tripDetailsModal')).show();
    } catch (error) {
        console.error('❌ Erro ao carregar detalhes:', error);
        showError('Erro ao carregar detalhes da viagem');
    }
}

function renderTripDetails(data) {
    const trip = data.trip;
    const transactions = data.transactions || [];
    const categoryDistribution = data.category_distribution || {};
    
    return `
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="stats-card">
                    <div class="stats-value text-primary">€${data.total_spent.toFixed(2)}</div>
                    <div class="stats-label">Total Gasto</div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stats-card">
                    <div class="stats-value text-success">€${trip.budget.toFixed(2)}</div>
                    <div class="stats-label">Orçamento</div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stats-card">
                    <div class="stats-value ${data.budget_comparison >= 0 ? 'text-success' : 'text-danger'}">
                        €${Math.abs(data.budget_comparison).toFixed(2)}
                    </div>
                    <div class="stats-label">${data.budget_comparison >= 0 ? 'Restante' : 'Excedido'}</div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stats-card">
                    <div class="stats-value text-info">€${data.daily_average.toFixed(2)}</div>
                    <div class="stats-label">Média/Dia</div>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-8">
                <h5><i class="fas fa-list me-2"></i>Gastos da Viagem</h5>
                <div class="expense-list" style="max-height: 400px; overflow-y: auto;">
                    ${transactions.length > 0 ? 
                        transactions.map(t => renderExpenseItem(t)).join('') :
                        '<p class="text-muted text-center py-4">Nenhum gasto registrado ainda</p>'
                    }
                </div>
            </div>
            <div class="col-md-4">
                <h5><i class="fas fa-chart-pie me-2"></i>Por Categoria</h5>
                <div class="category-breakdown">
                    ${Object.entries(categoryDistribution).map(([category, amount]) => `
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="category-badge category-${category}">
                                ${getCategoryIcon(category)} ${category.charAt(0).toUpperCase() + category.slice(1)}
                            </span>
                            <strong>€${amount.toFixed(2)}</strong>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function renderExpenseItem(transaction) {
    return `
        <div class="expense-item">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <div class="fw-bold">€${transaction.amount.toFixed(2)}</div>
                    <div class="text-muted small">${transaction.description || 'Sem descrição'}</div>
                </div>
                <div class="text-end">
                    <span class="category-badge category-${transaction.category}">
                        ${getCategoryIcon(transaction.category)} ${transaction.category}
                    </span>
                    <div class="text-muted small">${formatDate(transaction.date)}</div>
                </div>
            </div>
        </div>
    `;
}

// ========================================
// 🗑️ EXCLUIR VIAGEM
// ========================================

async function deleteTrip(tripId) {
    const trip = trips[tripId];
    if (!trip) return;
    
    if (!confirm(`Tem certeza que deseja excluir a viagem "${trip.name}"?\n\nEsta ação não pode ser desfeita.`)) {
        return;
    }
    
    try {
        const response = await fetch('/api/trip/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ trip_id: tripId })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccess('Viagem excluída com sucesso!');
            loadTrips(); // Recarregar lista
        } else {
            showError(result.error || 'Erro ao excluir viagem');
        }
    } catch (error) {
        console.error('❌ Erro ao excluir viagem:', error);
        showError('Erro ao excluir viagem');
    }
}

// ========================================
// 🛠️ FUNÇÕES UTILITÁRIAS
// ========================================

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

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

function showSuccess(message) {
    // Implementar notificação de sucesso
    alert('✅ ' + message);
}

function showError(message) {
    // Implementar notificação de erro
    alert('❌ ' + message);
}

// ========================================
// 📱 MODAL DETALHES (será implementado)
// ========================================

// Adicionar modal de detalhes ao HTML se necessário
if (!document.getElementById('tripDetailsModal')) {
    const modalHTML = `
        <div class="modal fade" id="tripDetailsModal" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-chart-line me-2"></i>
                            <span id="details-trip-name">Detalhes da Viagem</span>
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div id="trip-details-content">
                            <!-- Trip details will be loaded here -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}
