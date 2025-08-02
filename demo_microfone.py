#!/usr/bin/env python3
"""
🎤 Demonstração do Microfone Real Funcionando
Teste completo da funcionalidade de voz
"""

import requests
import json
import time

def test_voice_command(command):
    """Testa um comando de voz"""
    print(f"🎤 Testando comando: '{command}'")
    
    try:
        response = requests.post('http://localhost:9000/api/voice', 
                               json={'command': command},
                               headers={'Content-Type': 'application/json'})
        
        result = response.json()
        
        if result.get('success'):
            print(f"✅ Sucesso: {result['message']}")
            if 'transaction' in result:
                t = result['transaction']
                print(f"   💰 Transação: ID {t['id']} - €{t['amount']} - {t['category']}")
                print(f"   📝 Descrição: {t['description']}")
                print(f"   🔗 Fonte: {t['source']}")
            return True
        else:
            print(f"❌ Erro: {result.get('error')}")
            return False
            
    except Exception as e:
        print(f"❌ Erro na requisição: {e}")
        return False

def get_dashboard_summary():
    """Obtém resumo do dashboard"""
    try:
        response = requests.get('http://localhost:9000/api/dashboard')
        data = response.json()
        
        print(f"\n📊 RESUMO DO DASHBOARD:")
        print(f"   📋 Total transações: {len(data['transactions'])}")
        print(f"   💸 Total gastos: €{data['total_expenses']:.2f}")
        print(f"   💰 Total ganhos: €{data['total_income']:.2f}")
        print(f"   📈 Saldo: €{data['balance']:.2f}")
        
        # Últimas transações de voz
        voice_transactions = [t for t in data['transactions'] if t.get('source') == 'voice']
        if voice_transactions:
            print(f"\n🎤 ÚLTIMAS TRANSAÇÕES DE VOZ:")
            for t in voice_transactions[-5:]:
                date = t['date'][:19].replace('T', ' ')
                print(f"   🎤 {date} - €{t['amount']} - {t['category']} - {t['description']}")
        
        return data
        
    except Exception as e:
        print(f"❌ Erro ao obter dashboard: {e}")
        return None

def main():
    print("🚀 DEMONSTRAÇÃO DO MICROFONE REAL")
    print("=" * 50)
    
    # Verifica se servidor está rodando
    try:
        response = requests.get('http://localhost:9000/api/health')
        health = response.json()
        print(f"✅ Servidor: {health['service']} v{health['version']}")
        print(f"✅ Status: {health['status']}")
        print(f"✅ Transações: {health['total_transactions']}")
    except:
        print("❌ Servidor não está rodando!")
        print("   Execute: python3 expense_tracker_final_fixed.py")
        return
    
    print("\n" + "=" * 50)
    print("🎤 TESTANDO COMANDOS DE VOZ")
    print("=" * 50)
    
    # Lista de comandos para testar
    test_commands = [
        "Gravar 12 euros café starbucks",
        "Paguei 25 euros jantar restaurante",
        "Gastei 8 euros metro diário",
        "Comprei 35 euros supermercado",
        "Gravar 15 euros cinema ingresso"
    ]
    
    successful_tests = 0
    
    for i, command in enumerate(test_commands, 1):
        print(f"\n🧪 TESTE {i}/5:")
        if test_voice_command(command):
            successful_tests += 1
        
        # Pausa entre testes
        time.sleep(1)
    
    print("\n" + "=" * 50)
    print("📊 RESULTADO DOS TESTES")
    print("=" * 50)
    print(f"✅ Testes bem-sucedidos: {successful_tests}/{len(test_commands)}")
    print(f"📈 Taxa de sucesso: {(successful_tests/len(test_commands))*100:.1f}%")
    
    # Mostra resumo final
    get_dashboard_summary()
    
    print("\n" + "=" * 50)
    print("🎉 DEMONSTRAÇÃO CONCLUÍDA!")
    print("=" * 50)
    print("🌐 Acesse: http://localhost:9000")
    print("🎤 Use o microfone real na interface web")
    print("📱 Teste os comandos de voz diretamente")
    print("✅ Todas as transações são salvas automaticamente")
    print("🔄 Interface atualiza em tempo real")

if __name__ == "__main__":
    main()
