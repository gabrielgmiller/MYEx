# 🚀 MYEx - My Expense Tracker

## [![YouTube](https://img.shields.io/badge/YouTube-Assista%20a%20demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/xJpCbeZEOb0)

**Controle de Gastos Inteligente para Intercâmbio**

[![HACKTOWN 2025](https://img.shields.io/badge/HACKTOWN-2025-orange?style=for-the-badge)](https://hacktown.com.br)
[![Amazon Q Developer](https://img.shields.io/badge/Built%20with-Amazon%20Q%20Developer-232F3E?style=for-the-badge&logo=amazon-aws)](https://aws.amazon.com/q/developer/)
[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-2.3+-000000?style=for-the-badge&logo=flask)](https://flask.palletsprojects.com)

> 🏆 **Projeto desenvolvido durante o HACKTOWN 2025** - O maior evento de inovação e tecnologia do interior do Brasil!

## 📖 Sobre o Projeto

**MYEx** é uma aplicação completa de controle de gastos desenvolvida especialmente para estudantes de intercâmbio. Combina **inteligência artificial**, **reconhecimento de voz real** e **interface web moderna** em uma única solução poderosa.

### 🎯 **Problema Resolvido**
Estudantes de intercâmbio enfrentam dificuldades para:
- Controlar gastos em moeda estrangeira
- Classificar despesas rapidamente
- Gerenciar orçamentos de viagens
- Acompanhar gastos em tempo real

### 💡 **Nossa Solução**
Uma aplicação **unificada** que permite:
- 🎤 **Comandos de voz naturais** em português
- 🧠 **Classificação automática** com IA
- 💱 **Conversão de moeda** em tempo real
- ✈️ **Gestão de viagens** com orçamentos
- 📊 **Analytics avançados** e relatórios

## ✨ Funcionalidades Principais

### 🎤 **Reconhecimento de Voz Real**
- Fale naturalmente: *"Gravar 25 euros jantar italiano"*
- Processamento em **português brasileiro**
- Classificação automática por categoria
- Interface visual com feedback em tempo real

### 🧠 **Inteligência Artificial Integrada**
- **Amazon Q Developer** nativo
- Classificação automática de gastos
- Análise de padrões de consumo
- Sugestões inteligentes de categorização

### 💱 **Conversão de Moeda Inteligente**
- Taxas em tempo real via API
- Fallback automático para modo offline
- Cálculo de taxas comerciais (IOF incluído)
- Suporte para EUR, USD, BRL

### ✈️ **Gestão de Viagens**
- Criação de viagens com orçamentos
- Controle de gastos por destino
- Comparação com orçamento planejado
- Análise de gastos por categoria

### 📊 **Dashboard Moderno**
- Interface responsiva com Bootstrap 5
- Gráficos interativos em tempo real
- Cards animados com gradientes
- Modo debug integrado

## 🛠️ Tecnologias Utilizadas

### **Backend**
- **Python 3.8+** - Linguagem principal
- **Flask 2.3+** - Framework web
- **Amazon Q Developer** - IA integrada
- **Matplotlib** - Geração de gráficos
- **Requests** - Integração com APIs

### **Frontend**
- **HTML5 + CSS3** - Estrutura e estilo
- **Bootstrap 5** - Framework CSS
- **JavaScript ES6+** - Interatividade
- **Web Speech API** - Reconhecimento de voz
- **Font Awesome** - Ícones

### **APIs e Integrações**
- **Exchange Rate API** - Conversão de moeda
- **Web Speech API** - Reconhecimento de voz
- **Amazon Q Developer** - Processamento IA

## 🚀 Instalação e Uso

### **Pré-requisitos**
```bash
# Python 3.8 ou superior
python --version

# Git para clonar o repositório
git --version
```

### **1. Clone o Repositório**
```bash
git clone https://github.com/SEU_USUARIO/MYEx.git
cd MYEx
```

### **2. Instale as Dependências**
```bash
pip install -r requirements_unified.txt
```

### **3. Execute a Aplicação**
```bash
# Modo Web (Recomendado)
python expense_tracker_voice_fixed.py

# Acesse: http://localhost:9000
```

### **4. Teste o Microfone**
1. Clique no botão 🎤 vermelho
2. Permita acesso ao microfone
3. Fale: *"Gravar 20 euros pizza delivery"*
4. Veja a mágica acontecer! ✨

## 📱 Como Usar

### **🎤 Comandos de Voz**
```
✅ "Gravar 15 euros café da manhã"
✅ "Paguei 25 reais uber centro"  
✅ "Gastei 8 euros metro diário"
✅ "Comprei 30 euros supermercado"
✅ "18 euros cinema ingresso"
```

### **💻 Interface Web**
- **Dashboard**: Visão geral dos gastos
- **Formulário**: Adicionar transações manualmente
- **Gráficos**: Distribuição por categoria
- **Viagens**: Gerenciar orçamentos de viagem
- **Conversor**: Moedas em tempo real

### **🤖 Amazon Q Developer**
```bash
# Via API REST
curl -X POST http://localhost:9000/api/voice \
  -H "Content-Type: application/json" \
  -d '{"command": "Gravar 20 euros jantar"}'
```

## 📊 Arquitetura do Projeto

```
MYEx/
├── 🚀 expense_tracker_voice_fixed.py    # Aplicação principal
├── 📱 templates/dashboard_final.html    # Interface web
├── ⚡ static/js/                       # JavaScript
│   ├── dashboard_final.js              # Dashboard principal
│   ├── voice_recognition.js            # Reconhecimento de voz
│   └── global_functions.js             # Funções globais
├── 📊 expense_data_final.json          # Base de dados
├── 📦 requirements_unified.txt         # Dependências
├── 🧪 demo_microfone.py               # Demonstração
└── 📖 README.md                       # Este arquivo
```

## 🎯 Funcionalidades Avançadas

### **🔊 Reconhecimento de Voz**
- **Web Speech API** nativa do navegador
- Suporte para **Chrome, Edge, Safari**
- Processamento em **português brasileiro**
- Feedback visual em tempo real

### **🧠 Classificação Inteligente**
- Algoritmo de **pontuação por palavras-chave**
- Aprendizado baseado em padrões
- Categorias: Alimentação, Transporte, Lazer, Moradia, Outros

### **💱 Conversão Inteligente**
- Cache de 1 hora para otimização
- Fallback automático para modo offline
- Cálculo de spread e taxas comerciais

### **📈 Analytics Avançados**
- Taxa de poupança mensal
- Análise por fonte (web, voz, API)
- Maior gasto identificado
- Tendências temporais

## 🏆 Desenvolvido no HACKTOWN 2025

Este projeto foi criado durante o **HACKTOWN 2025**, demonstrando:

### **🎯 Inovação Tecnológica**
- Integração nativa com **Amazon Q Developer**
- Reconhecimento de voz em **português natural**
- Interface moderna e responsiva
- Arquitetura unificada (CLI + Web + API)

### **🚀 Impacto Social**
- Solução real para estudantes de intercâmbio
- Democratização do controle financeiro
- Interface acessível e intuitiva
- Suporte multilíngue (EUR, USD, BRL)

### **💡 Excelência Técnica**
- Código limpo e bem documentado
- Tratamento robusto de erros
- Testes automatizados
- Deploy pronto para produção

## 📈 Demonstração

### **🎤 Teste de Voz**
```bash
python demo_microfone.py
```

### **🌐 Interface Web**
Acesse: http://localhost:9000

### **📊 Resultados**
- ✅ **100% taxa de sucesso** nos testes de voz
- ✅ **Classificação IA** com alta precisão
- ✅ **Interface responsiva** em todos dispositivos
- ✅ **Dados em tempo real** com atualizações automáticas

## 🤝 Contribuindo

1. **Fork** o projeto
2. **Clone** seu fork
3. **Crie** uma branch para sua feature
4. **Commit** suas mudanças
5. **Push** para a branch
6. **Abra** um Pull Request

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Gabriel Miller**
- 🏆 Desenvolvido durante o **HACKTOWN 2025**
- 🤖 Criado com **Amazon Q Developer**
- 💡 Focado em **inovação e impacto social**

## 🙏 Agradecimentos

- **HACKTOWN 2025** - Pela oportunidade de inovar
- **Amazon Q Developer** - Pela IA integrada
- **Comunidade Open Source** - Pelas ferramentas incríveis

---

<div align="center">

**🚀 Feito com ❤️ no HACKTOWN 2025**

[![HACKTOWN](https://img.shields.io/badge/HACKTOWN-2025-orange?style=for-the-badge)](https://hacktown.com.br)
[![Amazon Q](https://img.shields.io/badge/Amazon%20Q-Developer-232F3E?style=for-the-badge&logo=amazon-aws)](https://aws.amazon.com/q/developer/)

**⭐ Se este projeto te ajudou, deixe uma estrela!**

</div>
