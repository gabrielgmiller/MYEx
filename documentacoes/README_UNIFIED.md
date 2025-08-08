# 🚀 Unified Expense Tracker - APLICAÇÃO INCRÍVEL INTEGRADA

**Controle de Gastos para Intercâmbio - CLI + Web + API + Amazon Q Developer**

Uma aplicação **ÚNICA e INCRÍVEL** que combina o melhor dos dois mundos: interface de linha de comando poderosa E interface web moderna, tudo integrado com inteligência artificial do Amazon Q Developer.

## ✨ **O QUE TORNA ESTA APLICAÇÃO INCRÍVEL?**

### 🎯 **INTEGRAÇÃO TOTAL**
- **UM ÚNICO CÓDIGO** que funciona tanto no terminal quanto no navegador
- **DADOS COMPARTILHADOS** entre CLI e Web em tempo real
- **AMAZON Q DEVELOPER** integrado nativamente
- **INTELIGÊNCIA ARTIFICIAL** para classificação automática

### 🚀 **FUNCIONALIDADES REVOLUCIONÁRIAS**

#### 🖥️ **Modo CLI Avançado**
- Interface colorida e interativa
- Comandos de voz simulados ("Gravar €15 pizza")
- Classificação automática inteligente
- Gráficos salvos automaticamente
- Exportação em múltiplos formatos
- Estatísticas avançadas em tempo real

#### 🌐 **Modo Web Moderno**
- Dashboard responsivo com animações
- API REST completa
- Conversão de moeda em tempo real
- Gráficos interativos
- Interface mobile-friendly
- Handlers Amazon Q Developer integrados

#### 🤖 **Amazon Q Developer Nativo**
- Handlers especializados para automação
- Comandos programáticos via JSON
- Classificação inteligente de texto
- Processamento de comandos de voz
- API REST dedicada para integração

#### 💱 **Conversão de Moeda Inteligente**
- API externa em tempo real
- Fallback automático com taxas fixas
- Taxas comerciais com impostos (IOF)
- Cache inteligente para otimização

## 🛠️ **Instalação Rápida**

```bash
# 1. Instale as dependências
pip install -r requirements_unified.txt

# 2. Execute a aplicação
python unified_app.py --help
```

## 🎮 **Como Usar - Múltiplos Modos**

### 🖥️ **Modo CLI (Terminal)**
```bash
# Modo padrão - interface interativa
python unified_app.py

# Ou explicitamente
python unified_app.py --mode cli
```

**Funcionalidades CLI:**
- Menu interativo colorido
- Comandos: add, dashboard, chart, trip, voice, classify, convert, etc.
- Gráficos salvos em PNG
- Relatórios exportados
- Estatísticas avançadas

### 🌐 **Modo Web (Navegador)**
```bash
# Inicia servidor web
python unified_app.py --mode web

# Porta personalizada
python unified_app.py --mode web --port 8080
```

**Acesse:** http://localhost:5000

**Funcionalidades Web:**
- Dashboard interativo moderno
- Formulários intuitivos
- Gráficos em tempo real
- Conversão de moeda
- API REST completa

### 🧪 **Modo Teste**
```bash
# Testa todas as funcionalidades
python unified_app.py --mode test
```

### 📊 **Status da Aplicação**
```bash
# Verifica dependências e status
python unified_app.py --status
```

## 🤖 **Amazon Q Developer - Comandos**

### **Via CLI:**
```bash
# No menu CLI, digite:
qdev  # Testa handlers do Q Developer
voice # Comando de voz: "Gravar €15 pizza"
classify # Classifica: "Uber centro €12.50"
```

### **Via Web API:**
```bash
# Adicionar despesa
curl -X POST http://localhost:5000/api/v1/qdev/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "action": "add_expense",
    "amount": 25.50,
    "category": "alimentação",
    "description": "Almoço restaurante"
  }'

# Comando de voz
curl -X POST http://localhost:5000/api/v1/voice \
  -H "Content-Type: application/json" \
  -d '{
    "command": "Gravar €15 pizza delivery"
  }'

# Classificação IA
curl -X POST http://localhost:5000/api/v1/classify \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Uber centro €12.50"
  }'
```

### **Handlers Disponíveis:**
- `add_expense` - Adicionar despesa
- `add_income` - Adicionar ganho
- `get_summary` - Resumo mensal
- `create_trip` - Criar viagem
- `get_exchange_rate` - Taxa de câmbio
- `voice_command` - Comando de voz
- `classify_text` - Classificação IA
- `bulk_expenses` - Múltiplas despesas

## 📊 **API REST Completa**

### **Endpoints Principais:**
```bash
# Dashboard
GET /api/dashboard

# Transações
GET /api/transactions
POST /api/transactions

# Viagens
GET /api/trips
POST /api/trips
GET /api/trips/{id}

# Conversão
GET /api/convert?amount=100&from=EUR&to=BRL

# Q Developer
POST /api/v1/qdev/invoke
POST /api/v1/voice
POST /api/v1/classify

# Avançados
POST /api/v1/expenses/bulk
GET /api/v1/analytics/stats
GET /api/v1/health
```

## 🎯 **Funcionalidades Integradas**

### 💸 **Gestão de Transações**
- **CLI:** Formulário interativo passo-a-passo
- **Web:** Interface moderna com validação
- **API:** Endpoints REST para automação
- **IA:** Classificação automática inteligente

### ✈️ **Módulo de Viagens**
- **Criação:** Nome, datas, orçamento
- **Gastos:** Associação automática por viagem
- **Análise:** Comparação com orçamento
- **Relatórios:** Resumo detalhado por viagem

### 📈 **Relatórios e Analytics**
- **Formatos:** JSON, texto, CSV
- **Análises:** Taxa de poupança, tendências
- **Gráficos:** Pizza (categorias), linha (temporal)
- **Exportação:** Múltiplos formatos

### 🎤 **Comandos de Voz (Simulados)**
```bash
# Exemplos de comandos
"Gravar €15 pizza delivery"
"Adicionar €8.50 café starbucks"
"Gasto €25 uber centro"
"Paguei €120 hotel lisboa"
```

### 🧠 **Classificação IA**
```bash
# Exemplos de classificação automática
"Uber centro €12.50" → transporte, €12.50, despesa
"Pizza Hut jantar €18" → alimentação, €18.00, despesa
"Cinema IMAX €9.50" → lazer, €9.50, despesa
"Aluguel apartamento €500" → moradia, €500.00, despesa
```

## 📁 **Estrutura do Projeto Unificado**

```
MYEx/
├── unified_app.py              # 🚀 Aplicação principal
├── unified_expense_tracker.py  # 💰 Core unificado
├── cli_interface.py           # 🖥️ Interface CLI
├── web_interface.py           # 🌐 Interface Web
├── requirements_unified.txt   # 📦 Dependências
├── README_UNIFIED.md         # 📖 Este arquivo
├── templates/
│   └── unified_dashboard.html # 🎨 Template web
├── static/
│   └── js/
│       └── unified_dashboard.js # ⚡ JavaScript
└── unified_expense_data.json  # 💾 Dados (gerado)
```

## 🎨 **Interface Visual**

### **CLI Colorido:**
```
🚀 UNIFIED EXPENSE TRACKER v2.0.0
═══════════════════════════════════════════════════════════════════════════════
💰 Controle de Gastos Integrado para Intercâmbio
🤖 Desenvolvido com Amazon Q Developer
🌐 CLI + Web + API + IA em uma única aplicação INCRÍVEL!
═══════════════════════════════════════════════════════════════════════════════

📋 COMANDOS DISPONÍVEIS:
1.  'add' - Adicionar transação
2.  'dashboard' - Ver painel mensal
3.  'voice' - Comando de voz
4.  'classify' - Classificar descrição
5.  'convert' - Converter moeda
6.  'qdev' - Testar Q Developer
...
```

### **Web Dashboard:**
- Cards animados com gradientes
- Gráficos interativos em tempo real
- Formulários com validação
- Conversão de moeda integrada
- Seção Amazon Q Developer
- Interface responsiva mobile

## 🔧 **Configuração Avançada**

### **Variáveis de Ambiente:**
```bash
# API de câmbio (opcional)
export EXCHANGE_API_KEY=sua_api_key

# Configurações Flask
export FLASK_DEBUG=False
export SECRET_KEY=sua_chave_secreta
```

### **Personalização:**
- **Categorias:** Edite `categories` em `unified_expense_tracker.py`
- **Moeda:** Altere `currency` nas configurações
- **Classificação IA:** Adicione palavras-chave em `category_keywords`

## 🧪 **Testes Automatizados**

```bash
# Executa todos os testes
python unified_app.py --mode test

# Verifica status
python unified_app.py --status
```

**Testes incluem:**
- ✅ Funcionalidades básicas
- ✅ Handlers Q Developer
- ✅ Conversão de moeda
- ✅ Classificação IA
- ✅ Comandos de voz
- ✅ Integridade dos dados

## 🚀 **Deploy e Produção**

### **Docker (Opcional):**
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements_unified.txt .
RUN pip install -r requirements_unified.txt
COPY . .
EXPOSE 5000
CMD ["python", "unified_app.py", "--mode", "web"]
```

### **Heroku:**
```bash
# Procfile
web: python unified_app.py --mode web --port $PORT
```

## 🎉 **Por Que Esta Aplicação é INCRÍVEL?**

### 🏆 **Inovação Técnica:**
- **Arquitetura unificada** - Um código, múltiplas interfaces
- **IA integrada** - Amazon Q Developer nativo
- **Dados compartilhados** - CLI e Web sincronizados
- **API REST completa** - Pronta para integração

### 🎯 **Experiência do Usuário:**
- **Flexibilidade total** - Use CLI ou Web conforme preferir
- **Interface intuitiva** - Tanto terminal quanto navegador
- **Funcionalidades avançadas** - IA, conversão, relatórios
- **Responsividade** - Funciona em qualquer dispositivo

### 🤖 **Inteligência Artificial:**
- **Classificação automática** - IA identifica categoria e valor
- **Comandos de voz** - Processamento natural de linguagem
- **Handlers especializados** - Amazon Q Developer integrado
- **Aprendizado contínuo** - Melhora com o uso

### 💡 **Casos de Uso:**
- **Estudantes de intercâmbio** - Controle completo de gastos
- **Viajantes** - Gestão de orçamento por viagem
- **Desenvolvedores** - API REST para integração
- **Empresas** - Automação via Amazon Q Developer

## 📞 **Suporte e Troubleshooting**

### **Problemas Comuns:**
```bash
# Dependências em falta
python unified_app.py --status

# Testa funcionalidades
python unified_app.py --mode test

# Verifica logs
python unified_app.py --mode web --debug
```

### **Requisitos Mínimos:**
- Python 3.8+
- 50MB espaço em disco
- Conexão internet (para conversão de moeda)

### **Dependências Opcionais:**
- Flask + Flask-CORS (modo web)
- Colorama (cores no CLI)
- python-dotenv (configurações)

## 🎯 **Roadmap Futuro**

- [ ] **Autenticação de usuários**
- [ ] **Backup automático na nuvem**
- [ ] **Notificações push**
- [ ] **App mobile nativo**
- [ ] **Integração bancária**
- [ ] **Machine Learning avançado**
- [ ] **Multi-idiomas**
- [ ] **Relatórios PDF**

---

## 🏆 **CONCLUSÃO**

Esta é uma aplicação **VERDADEIRAMENTE INCRÍVEL** que demonstra o poder do Amazon Q Developer para criar soluções integradas e inteligentes. 

**Características únicas:**
- ✅ **Unificação total** - CLI + Web + API em um só código
- ✅ **IA nativa** - Amazon Q Developer integrado
- ✅ **Flexibilidade máxima** - Use como preferir
- ✅ **Pronta para produção** - Deploy imediato
- ✅ **Extensível** - Fácil de personalizar e expandir

**🚀 Uma aplicação que realmente merece ser chamada de INCRÍVEL!**

---

**Desenvolvido com ❤️ e Amazon Q Developer**
