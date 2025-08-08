# 🚀 MYEx - My Expense Tracker (ATUALIZADO)

**Controle de Gastos Inteligente para Intercâmbio - Versão com Páginas Separadas**

[![HACKTOWN 2025](https://img.shields.io/badge/HACKTOWN-2025-orange?style=for-the-badge)](https://hacktown.com.br)
[![Amazon Q Developer](https://img.shields.io/badge/Built%20with-Amazon%20Q%20Developer-232F3E?style=for-the-badge&logo=amazon-aws)](https://aws.amazon.com/q/developer/)
[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-2.3+-000000?style=for-the-badge&logo=flask)](https://flask.palletsprojects.com)

> 🏆 **Projeto desenvolvido durante o HACKTOWN 2025** - Agora com navegação aprimorada!

## 🆕 **NOVIDADES - Versão Atualizada**

### 📱 **Navegação Separada**
- **Dashboard Principal** (`/`) - Visão geral e navegação
- **Controle Mensal** (`/monthly`) - Gastos do dia a dia
- **Viagens** (`/trips`) - Página dedicada para viagens

### 🧳 **Funcionalidades de Viagens Aprimoradas**
- ✅ Página dedicada exclusivamente para viagens
- ✅ Criação de viagens com orçamento e duração
- ✅ Edição completa de viagens existentes
- ✅ Controle de gastos por viagem
- ✅ Alertas visuais (80% e 100% do orçamento)
- ✅ Estatísticas em tempo real
- ✅ Separação total dos gastos mensais

### 📅 **Controle Mensal Dedicado**
- ✅ Página focada apenas em gastos mensais
- ✅ Reconhecimento de voz integrado
- ✅ Formulário manual para adição rápida
- ✅ Estatísticas mensais separadas
- ✅ Gráficos por categoria

## 🚀 **Como Usar - Versão Atualizada**

### **Inicialização Rápida**
```bash
# Clone o repositório
git clone https://github.com/SEU_USUARIO/MYEx.git
cd MYEx

# Execute o script de inicialização
./start_myex_new.sh

# Ou execute manualmente
python3 expense_tracker_voice_fixed.py
```

### **Navegação**
- **Dashboard Principal**: http://localhost:9000/
- **Controle Mensal**: http://localhost:9000/monthly
- **Viagens**: http://localhost:9000/trips

## 📊 **Estrutura das Páginas**

### 🏠 **Dashboard Principal** (`/`)
- Visão geral das estatísticas
- Links rápidos para outras páginas
- Informações sobre tecnologias utilizadas
- Ações rápidas (adicionar gasto, criar viagem)

### 📅 **Controle Mensal** (`/monthly`)
- **Reconhecimento de voz** em português
- **Formulário manual** para gastos
- **Estatísticas mensais** (total, média, contagem)
- **Lista de transações** recentes
- **Gráfico por categoria**
- **Separação total** dos gastos de viagem

### 🧳 **Viagens** (`/trips`)
- **Lista de viagens** com estatísticas
- **Criação de viagens** (nome, duração, orçamento)
- **Edição completa** de viagens existentes
- **Adição de gastos** específicos por viagem
- **Alertas visuais** de orçamento
- **Detalhes completos** com gráficos
- **Exclusão segura** de viagens

## 🎯 **Funcionalidades Detalhadas**

### 🧳 **Sistema de Viagens**

#### **Criar Nova Viagem**
```
✅ Nome da viagem (ex: "Itália")
✅ Duração em dias (ex: 7 dias)
✅ Data de início e fim
✅ Orçamento total (ex: €1500)
```

#### **Gestão de Gastos por Viagem**
```
✅ Adicionar gastos específicos
✅ Categorização automática
✅ Controle por data
✅ Descrições opcionais
✅ SEM reconhecimento de voz (conforme solicitado)
```

#### **Monitoramento de Orçamento**
```
✅ Barra de progresso visual
✅ Alerta aos 80% do orçamento
✅ Alerta quando ultrapassar 100%
✅ Cálculo de média diária
✅ Valor restante/excedido
```

#### **Edição de Viagens**
```
✅ Modificar nome da viagem
✅ Alterar duração (dias)
✅ Ajustar orçamento total
✅ Atualização em tempo real
```

### 📅 **Sistema Mensal**

#### **Reconhecimento de Voz**
```
🎤 "Gravar 25 euros jantar italiano"
🎤 "Paguei 15 reais uber centro"
🎤 "Gastei 8 euros metro diário"
```

#### **Formulário Manual**
```
💰 Valor em euros
🏷️ Categoria (alimentação, transporte, lazer, moradia, outros)
📝 Descrição opcional
```

#### **Estatísticas Mensais**
```
📊 Total gasto no mês
📈 Número de transações
📉 Média por dia
📋 Lista de transações recentes
🥧 Gráfico por categoria
```

## 🔧 **Arquitetura Técnica**

### **Backend (Python + Flask)**
```python
# Rotas principais
@app.route('/')                    # Dashboard principal
@app.route('/monthly')             # Controle mensal
@app.route('/trips')               # Viagens

# APIs
/api/dashboard/stats               # Estatísticas gerais
/api/transactions                  # Transações (GET/POST)
/api/trips                         # Viagens (GET/POST)
/api/trips/<id>                    # Viagem específica (GET/PUT)
/api/voice                         # Reconhecimento de voz
```

### **Frontend (HTML + CSS + JavaScript)**
```
templates/
├── dashboard_main.html            # Dashboard principal
├── monthly.html                   # Controle mensal
├── trips.html                     # Viagens
└── dashboard_final.html           # Dashboard antigo (compatibilidade)

static/js/
├── trips.js                       # Funcionalidades de viagens
├── monthly.js                     # Controle mensal + voz
└── dashboard_final.js             # Dashboard antigo
```

### **Separação de Dados**
```json
{
  "transactions": [
    {
      "id": "...",
      "amount": 25.50,
      "category": "alimentacao",
      "trip_id": null,              // Gasto mensal
      "date": "2025-08-07"
    },
    {
      "id": "...",
      "amount": 45.00,
      "category": "transporte",
      "trip_id": "trip_1",          // Gasto de viagem
      "date": "2025-08-07"
    }
  ],
  "trips": {
    "trip_1": {
      "name": "Itália",
      "budget": 1500,
      "start_date": "2025-08-10",
      "end_date": "2025-08-17"
    }
  }
}
```

## 🎨 **Interface Visual**

### **Design Responsivo**
- **Bootstrap 5** para layout responsivo
- **Gradientes modernos** e efeitos de blur
- **Animações suaves** em hover e transições
- **Cards flutuantes** com sombras
- **Ícones Font Awesome** para melhor UX

### **Alertas Visuais**
- **Verde**: Orçamento saudável (< 60%)
- **Azul**: Atenção moderada (60-80%)
- **Amarelo**: Atenção alta (80-100%)
- **Vermelho**: Orçamento ultrapassado (> 100%)

### **Feedback de Voz**
- **Azul**: Escutando comando
- **Amarelo**: Processando comando
- **Verde**: Comando executado com sucesso
- **Vermelho**: Erro no comando

## 🚀 **Comandos de Voz Suportados**

### **Padrões Reconhecidos**
```
✅ "Gravar [valor] [moeda] [descrição]"
✅ "Paguei [valor] [moeda] [descrição]"
✅ "Gastei [valor] [moeda] [descrição]"
✅ "Comprei [valor] [moeda] [descrição]"
✅ "[valor] [moeda] [descrição]"
```

### **Exemplos Práticos**
```
🎤 "Gravar 25 euros jantar restaurante italiano"
🎤 "Paguei 15 reais uber para o centro"
🎤 "Gastei 8 euros passagem de metro"
🎤 "Comprei 30 euros supermercado compras"
🎤 "18 euros cinema ingresso filme"
```

## 📱 **Compatibilidade**

### **Navegadores Suportados**
- ✅ **Chrome** (recomendado para voz)
- ✅ **Edge** (suporte completo)
- ✅ **Safari** (suporte parcial para voz)
- ⚠️ **Firefox** (sem reconhecimento de voz)

### **Dispositivos**
- ✅ **Desktop** (experiência completa)
- ✅ **Tablet** (layout responsivo)
- ✅ **Mobile** (funcionalidades adaptadas)

## 🔒 **Segurança e Privacidade**

- **Dados locais**: Armazenamento em arquivo JSON local
- **Sem envio de dados**: Reconhecimento de voz processado localmente
- **Backup automático**: Salvamento automático das transações
- **Validação de entrada**: Sanitização de todos os inputs

## 🛠️ **Desenvolvimento e Contribuição**

### **Estrutura do Projeto**
```
MYEx/
├── 🚀 expense_tracker_voice_fixed.py    # Backend principal
├── 📱 templates/                        # Templates HTML
│   ├── dashboard_main.html              # Dashboard principal
│   ├── monthly.html                     # Controle mensal
│   ├── trips.html                       # Viagens
│   └── dashboard_final.html             # Compatibilidade
├── ⚡ static/js/                        # JavaScript
│   ├── trips.js                         # Funcionalidades viagens
│   ├── monthly.js                       # Controle mensal
│   └── dashboard_final.js               # Dashboard antigo
├── 📊 expense_data_final.json           # Base de dados
├── 📦 requirements_unified.txt          # Dependências
├── 🚀 start_myex_new.sh                # Script inicialização
└── 📖 README_UPDATED.md                # Esta documentação
```

### **Como Contribuir**
1. **Fork** o projeto
2. **Clone** seu fork
3. **Crie** uma branch para sua feature
4. **Implemente** as mudanças
5. **Teste** todas as funcionalidades
6. **Commit** com mensagens descritivas
7. **Push** para sua branch
8. **Abra** um Pull Request

## 🎯 **Roadmap Futuro**

### **Próximas Funcionalidades**
- [ ] **Exportação de dados** (CSV, PDF)
- [ ] **Gráficos avançados** (tendências, comparações)
- [ ] **Categorias customizáveis**
- [ ] **Multi-moeda avançada**
- [ ] **Sincronização em nuvem**
- [ ] **App mobile nativo**
- [ ] **Integração bancária**
- [ ] **Relatórios automáticos**

### **Melhorias Técnicas**
- [ ] **Testes automatizados**
- [ ] **Docker containerization**
- [ ] **CI/CD pipeline**
- [ ] **Performance optimization**
- [ ] **PWA support**
- [ ] **Offline functionality**

## 🏆 **Créditos HACKTOWN 2025**

### **Tecnologias Utilizadas**
- **Amazon Q Developer** - IA integrada para desenvolvimento
- **Python + Flask** - Backend robusto e escalável
- **Bootstrap 5** - Interface moderna e responsiva
- **Web Speech API** - Reconhecimento de voz nativo
- **Matplotlib** - Geração de gráficos
- **Font Awesome** - Ícones profissionais

### **Inovações Implementadas**
- ✅ **Separação inteligente** entre gastos mensais e viagens
- ✅ **Navegação intuitiva** com páginas dedicadas
- ✅ **Reconhecimento de voz** em português brasileiro
- ✅ **Alertas visuais** para controle de orçamento
- ✅ **Interface responsiva** para todos dispositivos
- ✅ **Edição completa** de viagens e transações

## 📞 **Suporte e Contato**

- **GitHub Issues**: Para reportar bugs ou sugerir features
- **Email**: Para suporte técnico
- **HACKTOWN 2025**: Evento que inspirou este projeto

---

<div align="center">

**🚀 Desenvolvido com ❤️ no HACKTOWN 2025**

[![HACKTOWN](https://img.shields.io/badge/HACKTOWN-2025-orange?style=for-the-badge)](https://hacktown.com.br)
[![Amazon Q](https://img.shields.io/badge/Amazon%20Q-Developer-232F3E?style=for-the-badge&logo=amazon-aws)](https://aws.amazon.com/q/developer/)

**⭐ Se este projeto te ajudou, deixe uma estrela no GitHub!**

**🎯 Controle seus gastos de intercâmbio de forma inteligente e organizada!**

</div>
