# 🤝 Contribuindo para o MYEx

Obrigado por seu interesse em contribuir para o **MYEx - My Expense Tracker**! Este projeto foi desenvolvido durante o **HACKTOWN 2025** e estamos sempre abertos a melhorias.

## 🚀 Como Contribuir

### 1. **Fork o Projeto**
```bash
# Clique em "Fork" no GitHub ou use:
gh repo fork SEU_USUARIO/MYEx
```

### 2. **Clone seu Fork**
```bash
git clone https://github.com/SEU_USUARIO/MYEx.git
cd MYEx
```

### 3. **Crie uma Branch**
```bash
git checkout -b feature/nova-funcionalidade
# ou
git checkout -b fix/correcao-bug
```

### 4. **Configure o Ambiente**
```bash
# Instale as dependências
pip install -r requirements.txt

# Execute a aplicação
python expense_tracker_voice_fixed.py
```

### 5. **Faça suas Alterações**
- Mantenha o código limpo e bem documentado
- Siga as convenções existentes
- Adicione comentários quando necessário
- Teste suas alterações

### 6. **Teste suas Alterações**
```bash
# Teste a aplicação web
python expense_tracker_voice_fixed.py

# Teste o microfone
python demo_microfone.py

# Acesse: http://localhost:9000
```

### 7. **Commit suas Alterações**
```bash
git add .
git commit -m "feat: adiciona nova funcionalidade X

- Implementa funcionalidade Y
- Corrige problema Z
- Melhora performance de W

Relacionado ao issue #123"
```

### 8. **Push para seu Fork**
```bash
git push origin feature/nova-funcionalidade
```

### 9. **Abra um Pull Request**
- Vá para o repositório original no GitHub
- Clique em "New Pull Request"
- Descreva suas alterações detalhadamente
- Referencie issues relacionados

## 📋 Tipos de Contribuição

### 🐛 **Correção de Bugs**
- Identifique e corrija bugs existentes
- Adicione testes para evitar regressões
- Documente a correção

### ✨ **Novas Funcionalidades**
- Implemente funcionalidades solicitadas
- Mantenha compatibilidade com código existente
- Adicione documentação

### 📚 **Documentação**
- Melhore o README.md
- Adicione comentários no código
- Crie tutoriais e guias

### 🎨 **Interface**
- Melhore o design da interface web
- Adicione responsividade
- Otimize a experiência do usuário

### 🔧 **Refatoração**
- Melhore a estrutura do código
- Otimize performance
- Adicione testes

## 🎯 Áreas Prioritárias

### **1. Reconhecimento de Voz**
- Melhorar precisão do reconhecimento
- Adicionar suporte para mais idiomas
- Otimizar para diferentes sotaques

### **2. Inteligência Artificial**
- Melhorar classificação automática
- Adicionar aprendizado de padrões
- Implementar sugestões inteligentes

### **3. Interface Web**
- Adicionar modo escuro
- Melhorar responsividade mobile
- Implementar PWA (Progressive Web App)

### **4. APIs e Integrações**
- Adicionar mais APIs de conversão
- Integrar com bancos digitais
- Implementar sincronização na nuvem

### **5. Analytics**
- Adicionar mais tipos de gráficos
- Implementar relatórios avançados
- Criar dashboards personalizáveis

## 📝 Padrões de Código

### **Python**
```python
# Use docstrings para funções
def process_voice_command(command: str) -> Dict:
    """
    Processa comando de voz e retorna resultado.
    
    Args:
        command: Comando de voz em texto
        
    Returns:
        Dict com resultado do processamento
    """
    pass

# Use type hints
def calculate_total(amounts: List[float]) -> float:
    return sum(amounts)
```

### **JavaScript**
```javascript
// Use comentários descritivos
function updateDashboard() {
    // Atualiza cards do dashboard
    updateCards();
    
    // Atualiza gráficos
    updateCharts();
}

// Use async/await para operações assíncronas
async function loadData() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}
```

### **HTML/CSS**
```html
<!-- Use classes semânticas -->
<div class="expense-card">
    <h3 class="expense-title">Título</h3>
    <p class="expense-description">Descrição</p>
</div>
```

## 🧪 Testes

### **Testes Manuais**
1. **Interface Web**: Teste todas as funcionalidades
2. **Microfone**: Teste comandos de voz
3. **API**: Teste endpoints com curl
4. **Responsividade**: Teste em diferentes dispositivos

### **Testes Automatizados** (futuro)
```bash
# Quando implementados
pytest tests/
pytest --cov=. tests/
```

## 📋 Checklist do Pull Request

- [ ] Código testado localmente
- [ ] Documentação atualizada
- [ ] Comentários adicionados onde necessário
- [ ] Sem conflitos com branch main
- [ ] Descrição clara do que foi alterado
- [ ] Issues relacionados referenciados

## 🏆 Reconhecimento

Todos os contribuidores serão reconhecidos no README.md e terão seus nomes associados ao projeto HACKTOWN 2025.

### **Contribuidores Atuais**
- **Gabriel Miller** - Desenvolvedor original (HACKTOWN 2025)
- **Amazon Q Developer** - IA Assistant

## 📞 Contato

- **Issues**: Use o sistema de issues do GitHub
- **Discussões**: Use as discussões do GitHub
- **Email**: Para questões específicas do HACKTOWN 2025

## 📄 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença MIT do projeto.

---

<div align="center">

**🏆 Obrigado por contribuir com o projeto HACKTOWN 2025!**

**🚀 Juntos, vamos tornar o MYEx ainda melhor!**

</div>
