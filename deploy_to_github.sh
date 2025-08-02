#!/bin/bash

# 🚀 MYEx - Deploy to GitHub Script
# HACKTOWN 2025 Project by Gabriel Miller

echo "🚀 MYEx - Deploy to GitHub"
echo "HACKTOWN 2025 Project"
echo "=========================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir com cores
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️ $1${NC}"
}

# Verifica se git está instalado
if ! command -v git &> /dev/null; then
    print_error "Git não está instalado!"
    exit 1
fi

print_status "Git encontrado"

# Verifica se já é um repositório git
if [ ! -d ".git" ]; then
    print_info "Inicializando repositório Git..."
    git init
    print_status "Repositório Git inicializado"
else
    print_status "Repositório Git já existe"
fi

# Adiciona todos os arquivos
print_info "Adicionando arquivos ao Git..."
git add .

# Verifica se há mudanças para commit
if git diff --staged --quiet; then
    print_warning "Nenhuma mudança para commit"
else
    print_status "Arquivos adicionados ao staging"
fi

# Faz o commit
print_info "Fazendo commit..."
git commit -m "🏆 HACKTOWN 2025: MYEx - My Expense Tracker

🚀 Aplicação completa de controle de gastos para intercâmbio
🎤 Reconhecimento de voz real em português
🧠 IA integrada com Amazon Q Developer
💱 Conversão de moeda em tempo real
✈️ Gestão de viagens com orçamentos
📊 Dashboard moderno e responsivo

Desenvolvido durante o HACKTOWN 2025 - O maior evento de inovação 
e tecnologia do interior do Brasil!

Features:
- Voice recognition com Web Speech API
- Classificação automática inteligente
- Interface web moderna com Bootstrap 5
- API REST completa
- Gráficos interativos
- Analytics avançados

Tech Stack:
- Python 3.8+ / Flask 2.3+
- Amazon Q Developer
- Web Speech API
- Bootstrap 5
- JavaScript ES6+
- Matplotlib

#HACKTOWN2025 #AmazonQDeveloper #VoiceRecognition #ExpenseTracker"

print_status "Commit realizado"

# Pergunta sobre o repositório remoto
echo ""
print_info "Configuração do repositório remoto:"
echo "1. Se você JÁ criou o repositório no GitHub:"
echo "   - Vá para: https://github.com/SEU_USUARIO/MYEx"
echo "   - Copie a URL do repositório"
echo ""
echo "2. Se você AINDA NÃO criou:"
echo "   - Vá para: https://github.com/new"
echo "   - Nome do repositório: MYEx"
echo "   - Descrição: 🚀 HACKTOWN 2025: Controle de Gastos Inteligente com IA e Reconhecimento de Voz"
echo "   - Marque como público"
echo "   - NÃO adicione README, .gitignore ou LICENSE (já temos)"
echo "   - Clique em 'Create repository'"
echo ""

read -p "Digite a URL do seu repositório GitHub (ex: https://github.com/SEU_USUARIO/MYEx.git): " REPO_URL

if [ -z "$REPO_URL" ]; then
    print_error "URL do repositório é obrigatória!"
    exit 1
fi

# Adiciona o remote origin
print_info "Configurando repositório remoto..."
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"
print_status "Repositório remoto configurado"

# Renomeia branch para main se necessário
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    print_info "Renomeando branch para 'main'..."
    git branch -M main
    print_status "Branch renomeada para 'main'"
fi

# Faz o push
print_info "Enviando código para o GitHub..."
if git push -u origin main; then
    print_status "Código enviado com sucesso!"
    echo ""
    echo "🎉 PARABÉNS! Seu projeto MYEx foi enviado para o GitHub!"
    echo ""
    echo "🔗 Acesse seu repositório em:"
    echo "   $REPO_URL"
    echo ""
    echo "📋 Próximos passos:"
    echo "   1. Verifique se todos os arquivos foram enviados"
    echo "   2. Edite o README.md para adicionar seu usuário GitHub"
    echo "   3. Configure GitHub Pages se desejar (Settings > Pages)"
    echo "   4. Adicione topics: hacktown-2025, amazon-q-developer, voice-recognition"
    echo ""
    echo "🏆 Projeto HACKTOWN 2025 publicado com sucesso!"
else
    print_error "Erro ao enviar código para o GitHub!"
    echo ""
    echo "Possíveis soluções:"
    echo "1. Verifique se a URL do repositório está correta"
    echo "2. Verifique suas credenciais do GitHub"
    echo "3. Certifique-se de que o repositório existe e você tem permissão"
    echo ""
    echo "Para configurar credenciais:"
    echo "git config --global user.name 'Seu Nome'"
    echo "git config --global user.email 'seu.email@exemplo.com'"
    exit 1
fi

echo ""
print_info "🚀 Deploy concluído! Seu projeto MYEx está no GitHub!"
print_info "🏆 HACKTOWN 2025 - Inovação e Tecnologia!"
