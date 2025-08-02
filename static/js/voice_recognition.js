// 🎤 Voice Recognition - Funcionalidade Real de Microfone - CORRIGIDA
// Integração com Web Speech API para captura de voz real

class VoiceRecognition {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.isSupported = false;
        this.init();
    }

    init() {
        // Verifica suporte do navegador
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            this.isSupported = true;
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.setupRecognition();
            console.log('🎤 Web Speech API disponível');
        } else {
            console.warn('⚠️ Web Speech API não suportada neste navegador');
            this.showUnsupportedMessage();
        }
    }

    setupRecognition() {
        // Configurações do reconhecimento
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'pt-BR'; // Português brasileiro
        this.recognition.maxAlternatives = 1;

        // Event listeners
        this.recognition.onstart = () => {
            console.log('🎤 Microfone ativado');
            this.onStart();
        };

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            const confidence = event.results[0][0].confidence;
            console.log('🎤 Texto reconhecido:', transcript, 'Confiança:', confidence);
            this.onResult(transcript, confidence);
        };

        this.recognition.onerror = (event) => {
            console.error('❌ Erro no reconhecimento:', event.error);
            this.onError(event.error);
        };

        this.recognition.onend = () => {
            console.log('🎤 Microfone desativado');
            this.onEnd();
        };
    }

    startListening() {
        if (!this.isSupported) {
            this.showUnsupportedMessage();
            return;
        }

        if (this.isListening) {
            this.stopListening();
            return;
        }

        try {
            this.recognition.start();
        } catch (error) {
            console.error('❌ Erro ao iniciar reconhecimento:', error);
            this.showError('Erro ao acessar microfone. Verifique as permissões.');
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }

    onStart() {
        this.isListening = true;
        this.updateUI('listening');
        this.showStatus('🎤 Escutando... Fale agora!', 'info');
    }

    onResult(transcript, confidence) {
        console.log('📝 Processando comando de voz:', transcript);
        
        // Coloca o texto reconhecido no campo
        const voiceInput = document.getElementById('voice-input');
        if (voiceInput) {
            voiceInput.value = transcript;
        }

        // Processa automaticamente se a confiança for alta
        if (confidence > 0.7) {
            this.showStatus(`✅ Reconhecido: "${transcript}"`, 'success');
            setTimeout(() => {
                this.processVoiceCommand(transcript);
            }, 1000);
        } else {
            this.showStatus(`⚠️ Reconhecido com baixa confiança: "${transcript}" - Clique para processar`, 'warning');
        }
    }

    onError(error) {
        this.isListening = false;
        this.updateUI('idle');
        
        let errorMessage = 'Erro no reconhecimento de voz';
        
        switch (error) {
            case 'no-speech':
                errorMessage = 'Nenhuma fala detectada. Tente novamente.';
                break;
            case 'audio-capture':
                errorMessage = 'Microfone não encontrado ou sem permissão.';
                break;
            case 'not-allowed':
                errorMessage = 'Permissão de microfone negada. Ative nas configurações do navegador.';
                break;
            case 'network':
                errorMessage = 'Erro de rede. Verifique sua conexão.';
                break;
            case 'service-not-allowed':
                errorMessage = 'Serviço de reconhecimento não permitido.';
                break;
        }
        
        this.showStatus(`❌ ${errorMessage}`, 'danger');
    }

    onEnd() {
        this.isListening = false;
        this.updateUI('idle');
    }

    updateUI(state) {
        const voiceBtn = document.querySelector('.voice-btn');
        const voiceIcon = voiceBtn?.querySelector('i');
        
        if (!voiceBtn || !voiceIcon) return;

        switch (state) {
            case 'listening':
                voiceBtn.style.background = 'linear-gradient(135deg, #ff4757 0%, #ff3742 100%)';
                voiceBtn.style.animation = 'pulse 1s infinite';
                voiceIcon.className = 'fas fa-stop';
                voiceBtn.title = 'Clique para parar';
                break;
            case 'processing':
                voiceBtn.style.background = 'linear-gradient(135deg, #ffa502 0%, #ff6348 100%)';
                voiceBtn.style.animation = 'none';
                voiceIcon.className = 'fas fa-spinner fa-spin';
                voiceBtn.title = 'Processando...';
                break;
            case 'idle':
            default:
                voiceBtn.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)';
                voiceBtn.style.animation = 'none';
                voiceIcon.className = 'fas fa-microphone';
                voiceBtn.title = 'Clique para falar';
                break;
        }
    }

    showStatus(message, type) {
        const resultDiv = document.getElementById('qdev-result');
        if (!resultDiv) return;

        const alertClass = {
            'info': 'alert-info',
            'success': 'alert-success',
            'warning': 'alert-warning',
            'danger': 'alert-danger'
        }[type] || 'alert-info';

        const icon = {
            'info': 'fas fa-microphone',
            'success': 'fas fa-check-circle',
            'warning': 'fas fa-exclamation-triangle',
            'danger': 'fas fa-exclamation-circle'
        }[type] || 'fas fa-info-circle';

        resultDiv.innerHTML = `
            <div class="alert ${alertClass}">
                <i class="${icon} me-2"></i>
                ${message}
            </div>
        `;

        // Remove após 5 segundos se não for erro
        if (type !== 'danger') {
            setTimeout(() => {
                if (resultDiv.innerHTML.includes(message)) {
                    resultDiv.innerHTML = '';
                }
            }, 5000);
        }
    }

    showUnsupportedMessage() {
        const resultDiv = document.getElementById('qdev-result');
        if (!resultDiv) return;

        resultDiv.innerHTML = `
            <div class="alert alert-warning">
                <i class="fas fa-exclamation-triangle me-2"></i>
                <strong>Microfone não suportado</strong><br>
                Seu navegador não suporta reconhecimento de voz.<br>
                <small>Recomendamos usar Chrome, Edge ou Safari mais recentes.</small>
            </div>
        `;

        // Desabilita botão de microfone
        const voiceBtn = document.querySelector('.voice-btn');
        if (voiceBtn) {
            voiceBtn.disabled = true;
            voiceBtn.style.opacity = '0.5';
            voiceBtn.title = 'Reconhecimento de voz não suportado';
        }
    }

    showError(message) {
        this.showStatus(`❌ ${message}`, 'danger');
    }

    async processVoiceCommand(transcript) {
        console.log('🔄 Processando comando de voz:', transcript);
        this.updateUI('processing');
        
        try {
            const response = await fetch('/api/voice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command: transcript })
            });

            const result = await response.json();
            console.log('📥 Resposta do servidor:', result);
            
            if (result.success) {
                this.showStatus(`🎉 ${result.message}`, 'success');
                
                // CORREÇÃO: Força atualização da interface
                console.log('🔄 Atualizando interface...');
                await this.forceUpdateInterface();
                
                // Limpa campo de entrada
                const voiceInput = document.getElementById('voice-input');
                if (voiceInput) {
                    setTimeout(() => {
                        voiceInput.value = '';
                    }, 2000);
                }
                
            } else {
                this.showStatus(`❌ ${result.error}`, 'danger');
            }
            
        } catch (error) {
            console.error('❌ Erro ao processar comando:', error);
            this.showStatus('❌ Erro ao processar comando de voz', 'danger');
        } finally {
            this.updateUI('idle');
        }
    }

    async forceUpdateInterface() {
        console.log('🔄 Forçando atualização da interface...');
        
        try {
            // Atualiza dashboard
            await this.updateDashboard();
            
            // Atualiza transações recentes
            await this.updateRecentTransactions();
            
            // Atualiza gráfico
            await this.updatePieChart();
            
            console.log('✅ Interface atualizada com sucesso');
            
        } catch (error) {
            console.error('❌ Erro ao atualizar interface:', error);
        }
    }

    async updateDashboard() {
        try {
            const response = await fetch('/api/dashboard');
            const data = await response.json();
            
            // Atualiza cards
            this.animateValue('total-expenses', data.total_expenses, '€');
            this.animateValue('total-income', data.total_income, '€');
            this.animateValue('balance', data.balance, '€');
            
            if (data.analytics) {
                this.animateValue('avg-daily', data.analytics.avg_daily_expense, '€');
                this.animateValue('savings-rate', data.analytics.savings_rate, '%');
            }
            
            // Atualiza distribuição por categoria
            this.updateCategoryDistribution(data.category_distribution);
            
        } catch (error) {
            console.error('❌ Erro ao atualizar dashboard:', error);
        }
    }

    async updateRecentTransactions() {
        try {
            const response = await fetch('/api/transactions');
            const transactions = await response.json();
            
            const recent = transactions
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 10);
            
            this.displayRecentTransactions(recent);
            
        } catch (error) {
            console.error('❌ Erro ao atualizar transações:', error);
        }
    }

    async updatePieChart() {
        try {
            const response = await fetch('/api/chart/pie');
            const data = await response.json();
            
            const container = document.getElementById('pie-chart-container');
            if (container && data.chart) {
                container.innerHTML = 
                    `<img src="${data.chart}" class="img-fluid rounded" alt="Gráfico Atualizado" style="max-height: 400px;">`;
            }
            
        } catch (error) {
            console.error('❌ Erro ao atualizar gráfico:', error);
        }
    }

    animateValue(elementId, finalValue, suffix = '') {
        const element = document.getElementById(elementId);
        if (!element) return;
        
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
    }

    updateCategoryDistribution(distribution) {
        const container = document.getElementById('category-distribution');
        if (!container) return;
        
        if (!distribution || Object.keys(distribution).length === 0) {
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
    }

    displayRecentTransactions(transactions) {
        const container = document.getElementById('recent-transactions');
        if (!container) return;
        
        if (!transactions || transactions.length === 0) {
            container.innerHTML = '<p class="text-muted">Nenhuma transação encontrada</p>';
            return;
        }

        let html = '';
        const typeIcons = { 'despesa': '💸', 'ganho': '💰' };
        const sourceIcons = { 'web': '🌐', 'qdev': '🤖', 'voice': '🎤', 'manual': '✋' };

        transactions.forEach((transaction, index) => {
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
        });

        container.innerHTML = html;
    }
}

// Instância global
let voiceRecognition;

// Função global para o botão de microfone
function toggleVoiceRecognition() {
    if (!voiceRecognition) {
        voiceRecognition = new VoiceRecognition();
    }
    
    voiceRecognition.startListening();
}

// Função melhorada para processar comando de texto
async function processVoiceCommand() {
    const command = document.getElementById('voice-input').value.trim();
    
    if (!command) {
        if (voiceRecognition && voiceRecognition.isSupported) {
            // Se não há texto, ativa o microfone
            toggleVoiceRecognition();
        } else {
            // Mostra mensagem para digitar
            alert('Digite um comando de voz ou use o microfone');
        }
        return;
    }

    // Processa comando digitado
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
            
            // CORREÇÃO: Força atualização da interface
            if (voiceRecognition) {
                await voiceRecognition.forceUpdateInterface();
            } else {
                // Fallback se voiceRecognition não existir
                location.reload();
            }
            
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
        alert('Erro ao processar comando de voz');
    }
}

// CSS para animação do botão
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .voice-btn {
        transition: all 0.3s ease;
    }
    
    .voice-btn:disabled {
        cursor: not-allowed;
    }
`;
document.head.appendChild(style);

// Inicializa quando DOM carrega
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎤 Inicializando reconhecimento de voz corrigido...');
    
    // Substitui a função do botão de microfone
    const voiceBtn = document.querySelector('.voice-btn');
    if (voiceBtn) {
        voiceBtn.onclick = toggleVoiceRecognition;
        voiceBtn.title = 'Clique para usar o microfone real';
    }
});
