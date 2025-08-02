#!/usr/bin/env python3
"""
🎤 EXPENSE TRACKER - VERSÃO COM MICROFONE CORRIGIDO
Padrões de voz melhorados para português natural
"""

import json
import os
import re
import requests
from datetime import datetime, timedelta
from collections import defaultdict
from typing import Dict, List, Optional, Tuple, Any
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import io
import base64

from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

class ExpenseTracker:
    """Classe principal com reconhecimento de voz melhorado"""
    
    def __init__(self, data_file="expense_data_final.json"):
        self.data_file = data_file
        self.data = self.load_data()
        self.categories = ["alimentação", "transporte", "lazer", "moradia", "outros"]
        
    def load_data(self) -> Dict:
        """Carrega dados do arquivo JSON"""
        if os.path.exists(self.data_file):
            try:
                with open(self.data_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except:
                pass
        
        return {
            "transactions": [],
            "trips": {},
            "settings": {
                "currency": "EUR",
                "currency_symbol": "€",
                "base_currency": "BRL",
                "default_budget": 1000
            },
            "metadata": {
                "created_at": datetime.now().isoformat(),
                "version": "3.0.2 - Voice Fixed",
                "total_sessions": 0
            }
        }
    
    def save_data(self):
        """Salva dados no arquivo JSON"""
        self.data["metadata"]["last_updated"] = datetime.now().isoformat()
        with open(self.data_file, 'w', encoding='utf-8') as f:
            json.dump(self.data, f, indent=2, ensure_ascii=False)
    
    def add_transaction(self, amount: float, transaction_type: str, category: str, 
                       description: str = "", trip_id: str = None, currency: str = None,
                       source: str = "web") -> Dict:
        """Adiciona transação com validação completa"""
        if currency is None:
            currency = self.data["settings"]["currency"]
            
        transaction = {
            "id": len(self.data["transactions"]) + 1,
            "date": datetime.now().isoformat(),
            "amount": float(amount),
            "type": transaction_type.lower(),
            "category": category.lower(),
            "description": description,
            "trip_id": trip_id,
            "currency": currency,
            "source": source
        }
        
        self.data["transactions"].append(transaction)
        self.save_data()
        return transaction
    
    def classify_description(self, description: str) -> Tuple[str, float, str]:
        """IA avançada para classificação automática"""
        description = description.lower()
        
        # Padrões melhorados para extração de valor
        money_patterns = [
            r'€(\d+(?:[.,]\d{1,2})?)',
            r'\$(\d+(?:[.,]\d{1,2})?)',
            r'(\d+(?:[.,]\d{1,2})?)€',
            r'(\d+(?:[.,]\d{1,2})?)(?:\s*euros?)',
            r'(\d+(?:[.,]\d{1,2})?)(?:\s*reais?)',
            r'r\$\s*(\d+(?:[.,]\d{1,2})?)',
            r'(\d+(?:[.,]\d{1,2})?)\s*(?:eur|usd|brl)'
        ]
        
        amount = 0.0
        for pattern in money_patterns:
            match = re.search(pattern, description)
            if match:
                amount_str = match.group(1).replace(',', '.')
                amount = float(amount_str)
                break
        
        # IA melhorada para classificação por categoria
        category_keywords = {
            "alimentação": [
                "café", "restaurante", "comida", "pizza", "burger", "mercado", 
                "supermercado", "padaria", "lanchonete", "delivery", "ifood",
                "mcdonalds", "kfc", "subway", "starbucks", "açaí", "sorvete",
                "jantar", "almoço", "café da manhã", "lanche", "bebida", "bar",
                "cerveja", "vinho", "água", "refrigerante", "suco", "chocolate"
            ],
            "transporte": [
                "uber", "taxi", "metro", "bus", "ônibus", "trem", "avião", 
                "passagem", "combustível", "gasolina", "estacionamento",
                "pedágio", "viagem", "bilhete", "cartão transporte", "99",
                "cabify", "blablacar", "ryanair", "tap", "latam", "azul"
            ],
            "lazer": [
                "cinema", "bar", "festa", "show", "museu", "teatro", "parque",
                "netflix", "spotify", "jogo", "game", "diversão", "balada",
                "praia", "turismo", "passeio", "ingresso", "evento", "concert",
                "festival", "clube", "academia", "gym", "esporte"
            ],
            "moradia": [
                "aluguel", "rent", "casa", "apartamento", "hotel", "hostel",
                "condomínio", "água", "luz", "energia", "gás", "internet",
                "wifi", "limpeza", "manutenção", "móveis", "airbnb", "booking"
            ]
        }
        
        # Algoritmo de pontuação para melhor classificação
        category_scores = {}
        for cat, keywords in category_keywords.items():
            score = sum(2 if keyword in description else 0 for keyword in keywords)
            # Bonus para palavras exatas
            score += sum(5 for keyword in keywords if f" {keyword} " in f" {description} ")
            category_scores[cat] = score
        
        # Seleciona categoria com maior pontuação
        category = max(category_scores.items(), key=lambda x: x[1])[0] if max(category_scores.values()) > 0 else "outros"
        
        return category, amount, "despesa"
    
    def voice_shortcut(self, command: str) -> Dict:
        """Processamento MELHORADO de comandos de voz em português natural"""
        command = command.lower().strip()
        
        print(f"🎤 Processando comando: '{command}'")
        
        # Padrões melhorados para português natural
        patterns = [
            # Formato: "gravar X euros/reais descrição"
            r'gravar\s+(\d+(?:[.,]\d{1,2})?)\s+(?:euros?|reais?)\s+(.+)',
            r'gravar\s+(\d+(?:[.,]\d{1,2})?)\s+(.+)',
            
            # Formato: "paguei X euros/reais descrição"  
            r'paguei\s+(\d+(?:[.,]\d{1,2})?)\s+(?:euros?|reais?)\s+(.+)',
            r'paguei\s+(\d+(?:[.,]\d{1,2})?)\s+(.+)',
            
            # Formato: "gastei X euros/reais descrição"
            r'gastei\s+(\d+(?:[.,]\d{1,2})?)\s+(?:euros?|reais?)\s+(.+)',
            r'gastei\s+(\d+(?:[.,]\d{1,2})?)\s+(.+)',
            
            # Formato: "comprei X euros/reais descrição"
            r'comprei\s+(\d+(?:[.,]\d{1,2})?)\s+(?:euros?|reais?)\s+(.+)',
            r'comprei\s+(\d+(?:[.,]\d{1,2})?)\s+(.+)',
            
            # Formato: "adicionar X euros/reais descrição"
            r'adicionar\s+(\d+(?:[.,]\d{1,2})?)\s+(?:euros?|reais?)\s+(.+)',
            r'adicionar\s+(\d+(?:[.,]\d{1,2})?)\s+(.+)',
            
            # Formato: "gasto X euros/reais descrição"
            r'gasto\s+(\d+(?:[.,]\d{1,2})?)\s+(?:euros?|reais?)\s+(.+)',
            r'gasto\s+(\d+(?:[.,]\d{1,2})?)\s+(.+)',
            
            # Formato com símbolo €
            r'gravar\s+€?(\d+(?:[.,]\d{1,2})?)\s+(.+)',
            r'paguei\s+€?(\d+(?:[.,]\d{1,2})?)\s+(.+)',
            r'gastei\s+€?(\d+(?:[.,]\d{1,2})?)\s+(.+)',
            r'comprei\s+€?(\d+(?:[.,]\d{1,2})?)\s+(.+)',
            
            # Formatos alternativos
            r'registrar\s+(\d+(?:[.,]\d{1,2})?)\s+(?:euros?|reais?)?\s*(.+)',
            r'anotar\s+(\d+(?:[.,]\d{1,2})?)\s+(?:euros?|reais?)?\s*(.+)',
            r'despesa\s+(?:de\s+)?(\d+(?:[.,]\d{1,2})?)\s+(?:euros?|reais?)?\s*(.+)',
            
            # Formato mais flexível - número + descrição
            r'(\d+(?:[.,]\d{1,2})?)\s+(?:euros?|reais?)\s+(.+)',
            r'(\d+(?:[.,]\d{1,2})?)\s+(.+)'
        ]
        
        for i, pattern in enumerate(patterns):
            match = re.search(pattern, command)
            if match:
                try:
                    amount_str = match.group(1).replace(',', '.')
                    amount = float(amount_str)
                    description = match.group(2).strip()
                    
                    print(f"✅ Padrão {i+1} funcionou: valor={amount}, descrição='{description}'")
                    
                    # Valida se é um valor razoável
                    if amount <= 0 or amount > 10000:
                        print(f"⚠️ Valor fora do range: {amount}")
                        continue
                        
                    # Valida se a descrição não é muito curta
                    if len(description) < 2:
                        print(f"⚠️ Descrição muito curta: '{description}'")
                        continue
                    
                    category, _, _ = self.classify_description(description)
                    
                    transaction = self.add_transaction(
                        amount, "despesa", category, description, source="voice"
                    )
                    
                    print(f"🎉 Transação criada: ID {transaction['id']}")
                    
                    return {
                        "success": True,
                        "transaction": transaction,
                        "message": f"🎤 Comando de voz processado: €{amount:.2f} - {category}",
                        "classification": {
                            "original_command": command,
                            "detected_amount": amount,
                            "detected_category": category,
                            "confidence": "high",
                            "pattern_used": f"Padrão {i+1}: {pattern}"
                        }
                    }
                except (ValueError, IndexError) as e:
                    print(f"❌ Erro no padrão {i+1}: {e}")
                    continue
        
        print(f"❌ Nenhum padrão funcionou para: '{command}'")
        
        return {
            "success": False,
            "error": "Formato de comando não reconhecido",
            "examples": [
                "Gravar 15 euros pizza delivery",
                "Paguei 8 reais café da manhã", 
                "Gastei 25 euros uber centro",
                "Comprei 12 euros supermercado",
                "15 euros jantar restaurante"
            ],
            "received_command": command,
            "tip": "Fale de forma natural: 'Gravar [valor] euros [descrição]'",
            "debug": {
                "command_length": len(command),
                "has_numbers": bool(re.search(r'\d+', command)),
                "patterns_tested": len(patterns)
            }
        }
    
    def get_monthly_summary(self, year: int = None, month: int = None) -> Dict:
        """Resumo mensal com analytics avançados - CORRIGIDO"""
        if not year:
            year = datetime.now().year
        if not month:
            month = datetime.now().month
        
        monthly_transactions = []
        for transaction in self.data["transactions"]:
            trans_date = datetime.fromisoformat(transaction["date"])
            if trans_date.year == year and trans_date.month == month:
                monthly_transactions.append(transaction)
        
        total_expenses = sum(t["amount"] for t in monthly_transactions if t["type"] == "despesa")
        total_income = sum(t["amount"] for t in monthly_transactions if t["type"] == "ganho")
        balance = total_income - total_expenses
        
        # Distribuição por categoria
        category_expenses = defaultdict(float)
        for transaction in monthly_transactions:
            if transaction["type"] == "despesa":
                category_expenses[transaction["category"]] += transaction["amount"]
        
        # Analytics avançados - CORRIGIDOS para evitar valores infinitos
        avg_daily_expense = total_expenses / 30 if total_expenses > 0 else 0
        
        # CORREÇÃO: Evita divisão por zero e valores infinitos
        if total_income > 0:
            expense_ratio = total_expenses / total_income
            savings_rate = (balance / total_income) * 100
        else:
            expense_ratio = 0 if total_expenses == 0 else 999  # Valor alto mas finito
            savings_rate = 0
        
        # Análise por fonte
        source_analysis = defaultdict(lambda: {"count": 0, "amount": 0})
        for transaction in monthly_transactions:
            source = transaction.get("source", "manual")
            source_analysis[source]["count"] += 1
            if transaction["type"] == "despesa":
                source_analysis[source]["amount"] += transaction["amount"]
        
        # Maior gasto
        expenses = [t for t in monthly_transactions if t["type"] == "despesa"]
        biggest_expense = max(expenses, key=lambda x: x["amount"]) if expenses else None
        
        return {
            "year": year,
            "month": month,
            "total_expenses": total_expenses,
            "total_income": total_income,
            "balance": balance,
            "category_distribution": dict(category_expenses),
            "transactions": monthly_transactions,
            "analytics": {
                "avg_daily_expense": avg_daily_expense,
                "expense_ratio": expense_ratio,
                "savings_rate": savings_rate,
                "transaction_count": len(monthly_transactions),
                "biggest_expense": biggest_expense,
                "source_analysis": dict(source_analysis)
            }
        }
    
    def create_trip(self, name: str, start_date: str, end_date: str, budget: float = 0) -> Dict:
        """Cria viagem com validação"""
        trip_id = f"trip_{len(self.data['trips']) + 1}"
        
        trip = {
            "id": trip_id,
            "name": name,
            "start_date": start_date,
            "end_date": end_date,
            "budget": float(budget),
            "created_at": datetime.now().isoformat(),
            "status": "planned"
        }
        
        self.data["trips"][trip_id] = trip
        self.save_data()
        return trip
    
    def get_trip_summary(self, trip_id: str) -> Optional[Dict]:
        """Resumo detalhado da viagem"""
        if trip_id not in self.data["trips"]:
            return None
        
        trip = self.data["trips"][trip_id]
        trip_transactions = [
            t for t in self.data["transactions"] 
            if t.get("trip_id") == trip_id
        ]
        
        total_spent = sum(t["amount"] for t in trip_transactions if t["type"] == "despesa")
        
        # Calcula duração
        start_date = datetime.fromisoformat(trip["start_date"])
        end_date = datetime.fromisoformat(trip["end_date"])
        duration = (end_date - start_date).days + 1
        
        daily_average = total_spent / duration if duration > 0 else 0
        budget_comparison = trip["budget"] - total_spent if trip["budget"] > 0 else 0
        budget_percentage = (total_spent / trip["budget"]) * 100 if trip["budget"] > 0 else 0
        
        # Distribuição por categoria
        category_expenses = defaultdict(float)
        for transaction in trip_transactions:
            if transaction["type"] == "despesa":
                category_expenses[transaction["category"]] += transaction["amount"]
        
        return {
            "trip": trip,
            "total_spent": total_spent,
            "daily_average": daily_average,
            "duration": duration,
            "budget_comparison": budget_comparison,
            "budget_percentage": budget_percentage,
            "category_distribution": dict(category_expenses),
            "transactions": trip_transactions,
            "status": "over_budget" if budget_comparison < 0 else "on_track"
        }
    
    def create_pie_chart(self) -> str:
        """Gera gráfico de pizza melhorado"""
        summary = self.get_monthly_summary()
        
        if not summary['category_distribution']:
            return None
        
        categories = list(summary['category_distribution'].keys())
        amounts = list(summary['category_distribution'].values())
        
        # Cores mais bonitas
        colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8']
        
        plt.figure(figsize=(12, 8))
        wedges, texts, autotexts = plt.pie(amounts, labels=categories, autopct='%1.1f%%', 
                                          colors=colors, startangle=90, shadow=True)
        
        # Melhora a aparência
        for autotext in autotexts:
            autotext.set_color('white')
            autotext.set_fontweight('bold')
        
        plt.title(f'💰 Distribuição de Gastos - {summary["month"]:02d}/{summary["year"]}', 
                 fontsize=16, fontweight='bold', pad=20)
        plt.axis('equal')
        
        # Converte para base64
        img_buffer = io.BytesIO()
        plt.savefig(img_buffer, format='png', bbox_inches='tight', dpi=150)
        img_buffer.seek(0)
        img_base64 = base64.b64encode(img_buffer.getvalue()).decode()
        plt.close()
        
        return f"data:image/png;base64,{img_base64}"

class CurrencyConverter:
    """Conversor de moeda avançado"""
    
    def __init__(self):
        self.api_key = os.environ.get('EXCHANGE_API_KEY', 'demo_key')
        self.base_url = "https://api.exchangerate-api.com/v4/latest"
        self.cache = {}
        self.cache_time = {}
        
    def get_exchange_rate(self, from_currency: str, to_currency: str) -> Dict:
        """Obtém taxa com fallback inteligente"""
        cache_key = f"{from_currency}_{to_currency}"
        
        # Verifica cache
        if (cache_key in self.cache and 
            cache_key in self.cache_time and
            datetime.now() - self.cache_time[cache_key] < timedelta(hours=1)):
            return self.cache[cache_key]
        
        try:
            # Tenta API real
            response = requests.get(f"{self.base_url}/{from_currency}", timeout=5)
            data = response.json()
            
            if to_currency in data["rates"]:
                rate = data["rates"][to_currency]
                commercial_rate = rate * 0.9362 if to_currency == "BRL" else rate * 0.98
                
                result = {
                    "rate": rate,
                    "commercial_rate": commercial_rate,
                    "spread": rate - commercial_rate,
                    "timestamp": datetime.now().isoformat(),
                    "from_currency": from_currency,
                    "to_currency": to_currency,
                    "source": "live_api"
                }
                
                self.cache[cache_key] = result
                self.cache_time[cache_key] = datetime.now()
                return result
                
        except Exception:
            pass
        
        # Fallback com taxas atualizadas
        fallback_rates = {
            "EUR_BRL": {"rate": 6.15, "commercial_rate": 5.76},
            "USD_BRL": {"rate": 5.45, "commercial_rate": 5.10},
            "BRL_EUR": {"rate": 0.163, "commercial_rate": 0.152},
            "BRL_USD": {"rate": 0.184, "commercial_rate": 0.172},
            "EUR_USD": {"rate": 1.12, "commercial_rate": 1.10},
            "USD_EUR": {"rate": 0.89, "commercial_rate": 0.87}
        }
        
        fallback_key = f"{from_currency}_{to_currency}"
        if fallback_key in fallback_rates:
            result = fallback_rates[fallback_key].copy()
            result.update({
                "spread": result["rate"] - result["commercial_rate"],
                "timestamp": datetime.now().isoformat(),
                "from_currency": from_currency,
                "to_currency": to_currency,
                "source": "fallback"
            })
            return result
        
        return {"error": f"Taxa não disponível para {from_currency} -> {to_currency}"}

# Instâncias globais
tracker = ExpenseTracker()
converter = CurrencyConverter()

# Aplicação Flask
app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'expense-tracker-voice-fixed')

# ==================== ROUTES PRINCIPAIS ====================

@app.route('/')
def dashboard():
    """Dashboard principal"""
    return render_template('dashboard_final.html')

@app.route('/api/dashboard')
def api_dashboard():
    """API do dashboard"""
    summary = tracker.get_monthly_summary()
    return jsonify(summary)

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    """Lista transações"""
    return jsonify(tracker.data["transactions"])

@app.route('/api/transactions', methods=['POST'])
def add_transaction():
    """Adiciona transação"""
    try:
        data = request.json
        transaction = tracker.add_transaction(
            amount=float(data['amount']),
            transaction_type=data['type'],
            category=data['category'],
            description=data.get('description', ''),
            trip_id=data.get('trip_id'),
            currency=data.get('currency', 'EUR'),
            source='web'
        )
        return jsonify({"success": True, "transaction": transaction})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route('/api/transaction/delete', methods=['POST'])
def delete_transaction():
    """Deleta transação"""
    try:
        data = request.get_json()
        transaction_index = data.get('transaction_index')
        
        if transaction_index is None:
            return jsonify({"success": False, "error": "Índice da transação é obrigatório"}), 400
        
        # Converte para inteiro
        try:
            index = int(transaction_index)
        except (ValueError, TypeError):
            return jsonify({"success": False, "error": "Índice deve ser um número"}), 400
        
        # Verifica se o índice é válido
        transactions = tracker.data["transactions"]
        if index < 0 or index >= len(transactions):
            return jsonify({"success": False, "error": f"Índice inválido. Deve estar entre 0 e {len(transactions)-1}"}), 400
        
        # Remove a transação
        removed_transaction = transactions.pop(index)
        print(f"✅ Transação removida no índice {index}: {removed_transaction.get('description', 'N/A')} - €{removed_transaction.get('amount', 0)}")
        
        # Salva os dados
        tracker.save_data()
        
        return jsonify({
            "success": True, 
            "message": "Transação deletada com sucesso",
            "removed_transaction": {
                "description": removed_transaction.get('description', 'N/A'),
                "amount": removed_transaction.get('amount', 0),
                "category": removed_transaction.get('category', 'outros')
            },
            "remaining_count": len(tracker.data["transactions"])
        })
        
    except Exception as e:
        print(f"❌ Erro ao deletar transação: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/trips', methods=['GET'])
def get_trips():
    """Lista viagens"""
    return jsonify(tracker.data["trips"])

@app.route('/api/trips', methods=['POST'])
def create_trip():
    """Cria viagem"""
    try:
        data = request.json
        trip = tracker.create_trip(
            name=data['name'],
            start_date=data['start_date'],
            end_date=data['end_date'],
            budget=float(data.get('budget', 0))
        )
        return jsonify({"success": True, "trip": trip})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route('/api/trip/delete', methods=['POST'])
def delete_trip():
    """Deleta viagem"""
    try:
        data = request.get_json()
        trip_id = data.get('trip_id')
        
        if not trip_id:
            return jsonify({"success": False, "error": "ID da viagem é obrigatório"}), 400
        
        # Verifica se a viagem existe
        trips = tracker.data["trips"]
        if trip_id not in trips:
            return jsonify({"success": False, "error": "Viagem não encontrada"}), 404
        
        # Guarda informações da viagem antes de deletar
        deleted_trip = trips[trip_id]
        
        # Remove a viagem
        del trips[trip_id]
        
        # Remove a associação trip_id das transações relacionadas
        transactions_updated = 0
        for transaction in tracker.data["transactions"]:
            if transaction.get('trip_id') == trip_id:
                transaction.pop('trip_id', None)
                transactions_updated += 1
        
        # Salva os dados
        tracker.save_data()
        
        print(f"✅ Viagem '{deleted_trip.get('name', 'N/A')}' deletada com sucesso")
        print(f"📝 {transactions_updated} transações tiveram a associação com a viagem removida")
        
        return jsonify({
            "success": True, 
            "message": "Viagem deletada com sucesso",
            "deleted_trip": {
                "name": deleted_trip.get('name', 'N/A'),
                "budget": deleted_trip.get('budget', 0)
            },
            "transactions_updated": transactions_updated,
            "remaining_trips": len(tracker.data["trips"])
        })
        
    except Exception as e:
        print(f"❌ Erro ao deletar viagem: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/trips/<trip_id>')
def get_trip_summary(trip_id):
    """Resumo da viagem"""
    summary = tracker.get_trip_summary(trip_id)
    if summary:
        return jsonify(summary)
    else:
        return jsonify({"error": "Trip not found"}), 404

@app.route('/api/voice', methods=['POST'])
def voice_command():
    """Comando de voz MELHORADO"""
    try:
        data = request.json
        command = data.get('command', '')
        print(f"🎤 Recebido comando de voz: '{command}'")
        result = tracker.voice_shortcut(command)
        print(f"📤 Enviando resposta: {result.get('success')}")
        return jsonify(result)
    except Exception as e:
        print(f"❌ Erro no comando de voz: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/classify', methods=['POST'])
def classify_text():
    """Classificação IA"""
    try:
        data = request.json
        text = data.get('text', '')
        category, amount, trans_type = tracker.classify_description(text)
        
        return jsonify({
            "success": True,
            "classification": {
                "category": category,
                "amount": amount,
                "type": trans_type,
                "original_text": text,
                "confidence": "high" if amount > 0 else "medium"
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/convert')
def convert_currency():
    """Conversão de moeda"""
    try:
        amount = float(request.args.get('amount', 0))
        from_currency = request.args.get('from', 'EUR')
        to_currency = request.args.get('to', 'BRL')
        
        rate_data = converter.get_exchange_rate(from_currency, to_currency)
        
        if 'error' in rate_data:
            return jsonify(rate_data), 400
        
        converted_amount = amount * rate_data['commercial_rate']
        
        return jsonify({
            "original_amount": amount,
            "converted_amount": converted_amount,
            "from_currency": from_currency,
            "to_currency": to_currency,
            "rate_used": rate_data['commercial_rate'],
            "timestamp": rate_data['timestamp'],
            "source": rate_data['source']
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/chart/pie')
def pie_chart():
    """Gráfico de pizza"""
    try:
        chart_base64 = tracker.create_pie_chart()
        if chart_base64:
            return jsonify({"chart": chart_base64})
        else:
            return jsonify({"error": "Dados insuficientes"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/health')
def health_check():
    """Health check"""
    return jsonify({
        "status": "healthy",
        "service": "Expense Tracker - Voice Fixed",
        "version": "3.0.2",
        "timestamp": datetime.now().isoformat(),
        "total_transactions": len(tracker.data["transactions"]),
        "total_trips": len(tracker.data["trips"]),
        "features": [
            "🎤 Microfone Real Corrigido",
            "🧠 Reconhecimento Português Natural",
            "🤖 Amazon Q Developer",
            "💱 Conversão de Moeda",
            "✈️ Gestão de Viagens",
            "📊 Analytics Avançados"
        ]
    })

@app.route('/api/categories')
def get_categories():
    """Lista categorias"""
    return jsonify(tracker.categories)

if __name__ == '__main__':
    print("🎤 EXPENSE TRACKER - MICROFONE CORRIGIDO")
    print("=" * 70)
    print("🌐 Padrões de voz melhorados para português natural")
    print("🗣️ Aceita comandos como: 'Gravar 15 euros pizza'")
    print("🤖 Amazon Q Developer integrado")
    print("=" * 70)
    
    port = int(os.environ.get('PORT', 9000))
    host = os.environ.get('HOST', '0.0.0.0')
    debug = os.environ.get('DEBUG', 'True').lower() == 'true'
    
    print(f"🌐 Servidor: http://localhost:{port}")
    print(f"📊 Dashboard: http://localhost:{port}/")
    print(f"🎤 Teste: Fale 'Gravar 20 euros café'")
    print("=" * 70)
    
    app.run(debug=debug, host=host, port=port)
