// Funções globais para o Expense Tracker Final

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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            tracker.showAlert('Viagem criada com sucesso!', 'success');
            document.getElementById('trip-form').reset();
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('tripModal'));
            modal.hide();
            
            tracker.loadTrips();
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

        const modalHtml = `
            <div class="modal fade" id="tripDetailsModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header" style="background: var(--primary); color: white;">
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
                                <strong>Status:</strong> 
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
                            ` : '<p class="text-muted">Nenhum gasto registrado</p>'}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const existingModal = document.getElementById('tripDetailsModal');
        if (existingModal) existingModal.remove();

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const modal = new bootstrap.Modal(document.getElementById('tripDetailsModal'));
        modal.show();

    } catch (error) {
        console.error('Erro ao carregar detalhes:', error);
        tracker.showAlert('Erro ao carregar detalhes da viagem', 'danger');
    }
}

async function convertCurrency() {
    const amount = parseFloat(document.getElementById('convert-amount').value);
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;

    if (!amount || amount <= 0) {
        tracker.showAlert('Digite um valor válido', 'warning');
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
                        Fonte: ${data.source}<br>
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

async function processVoiceCommand() {
    const command = document.getElementById('voice-input').value.trim();
    
    if (!command) {
        tracker.showAlert('Digite um comando de voz', 'warning');
        return;
    }

    try {
        const response = await fetch('/api/voice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command: command })
        });

        const result = await response.json();
        const resultDiv = document.getElementById('qdev-result');
        
        if (result.success) {
            resultDiv.innerHTML = `
                <div class="alert alert-success">
                    <i class="fas fa-microphone me-2"></i>
                    <strong>Comando processado:</strong> ${result.message}
                    ${result.classification ? `
                        <br><small class="text-muted">
                            Detectado: €${result.classification.detected_amount} - ${result.classification.detected_category}
                        </small>
                    ` : ''}
                </div>
            `;
            
            document.getElementById('voice-input').value = '';
            tracker.loadDashboard();
            tracker.loadPieChart();
            
        } else {
            resultDiv.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    <strong>Erro:</strong> ${result.error}
                    ${result.examples ? `
                        <br><small>Exemplos: ${result.examples.join(', ')}</small>
                    ` : ''}
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
        const response = await fetch('/api/classify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
                    📝 Tipo: <strong>${cls.type}</strong><br>
                    🎯 Confiança: <strong>${cls.confidence}</strong>
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            tracker.showAlert('Transação classificada adicionada!', 'success');
            document.getElementById('classify-input').value = '';
            document.getElementById('qdev-result').innerHTML = '';
            tracker.loadDashboard();
            tracker.loadPieChart();
        } else {
            tracker.showAlert('Erro ao adicionar transação', 'danger');
        }

    } catch (error) {
        console.error('Erro ao adicionar transação:', error);
        tracker.showAlert('Erro ao adicionar transação', 'danger');
    }
}
