import os
import json
from flask import Flask, request, jsonify, send_from_directory
from transformers import pipeline
from datetime import datetime

from sentiment_analyzer import SentimentAnalyzer

app = Flask(__name__, static_url_path='', static_folder='../frontend')

# Initialize Sentiment Analyzer
print("Initializing Sentiment Analyzer...")
analyzer = SentimentAnalyzer()

from datetime import datetime, timedelta
import random

# Generate sample data for the last 2 weeks
def generate_sample_data():
    logs = []
    departments = ['Marketing', 'Sales', 'DevOps', 'HR', 'Engineering']
    sentiments = [
        {"sentiment": "Positive", "score": 0.9, "engagement_level": "high"},
        {"sentiment": "Neutral", "score": 0.5, "engagement_level": "medium"},
        {"sentiment": "Negative", "score": 0.8, "engagement_level": "low"},
        {"sentiment": "Positive", "score": 0.7, "engagement_level": "medium"}
    ]
    
    base_time = datetime.now()
    
    for i in range(50): # Generate 50 random past conversations
        days_ago = random.randint(0, 14)
        hours_ago = random.randint(0, 23)
        timestamp = (base_time - timedelta(days=days_ago, hours=hours_ago)).isoformat()
        
        dept = random.choice(departments)
        sent = random.choice(sentiments)
        
        logs.append({
            "conversation_id": f"hist-{i}",
            "timestamp": timestamp,
            "sender": "user",
            "message": f"Sample message from {dept}",
            "department": dept,
            "sentiment": sent
        })
        
    # Sort by timestamp
    logs.sort(key=lambda x: x['timestamp'])
    return logs

chat_logs = generate_sample_data()

@app.route('/')
def index():
    return send_from_directory(app.static_folder, '9_chatbot_test.html')

@app.route('/dashboard')
def dashboard():
    return send_from_directory(app.static_folder, 'dashboard.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

@app.route('/api/chat/log', methods=['POST'])
def log_chat():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    # Data expected: { "conversation_id": "...", "sender": "user/bot", "message": "...", "timestamp": "..." }
    
    message = data.get('message', '')
    sender = data.get('sender', 'unknown')
    
    # Perform sentiment analysis
    sentiment_result = None
    if message:
        sentiment_result = analyzer.analyze_message(message)

    log_entry = {
        "conversation_id": data.get("conversation_id", "default"),
        "timestamp": data.get("timestamp", datetime.now().isoformat()),
        "sender": sender,
        "message": message,
        "sentiment": sentiment_result
    }
    
    chat_logs.append(log_entry)
    return jsonify({"status": "success", "log_entry": log_entry})

@app.route('/api/analyze', methods=['POST'])
def analyze_bulk():
    """
    Bulk analysis endpoint for the Empathy Data Intelligence Agent.
    Input: { "logs": [ { "user_id": "...", "timestamp": "...", "message_content": "..." } ] }
    Output: { "analysis_result": [ ... ] }
    """
    data = request.json
    if not data or 'logs' not in data:
        return jsonify({"error": "Invalid input. 'logs' list required."}), 400
        
    logs = data['logs']
    result = analyzer.analyze_logs(logs)
    
    return jsonify(result)

@app.route('/api/dashboard/data', methods=['GET'])
def get_dashboard_data():
    # Aggregate data for the dashboard
    
    # 1. Overall Sentiment Distribution
    sentiment_counts = {}
    
    # 2. Sentiment Over Time (group by minute/hour for demo?)
    sentiment_over_time = []
    
    # 3. Department Volume
    department_counts = {}
    
    for log in chat_logs:
        if log.get('sentiment'):
            # SentimentAnalyzer returns 'sentiment' key (Positive/Neutral/Negative)
            label = log['sentiment'].get('sentiment', 'Neutral')
            engagement = log['sentiment'].get('engagement_level', 'medium')
            
            sentiment_counts[label] = sentiment_counts.get(label, 0) + 1
            
            # Department aggregation
            dept = log.get('department', 'General')
            department_counts[dept] = department_counts.get(dept, 0) + 1
            
            entry = {
                "timestamp": log['timestamp'],
                "label": label,
                "score": log['sentiment'].get('score', 0),
                "engagement_level": engagement,
                "sender": log['sender'],
                "department": dept
            }
            sentiment_over_time.append(entry)
            
            if log['sender'] == 'user':
                user_sentiments.append(label)
            else:
                bot_sentiments.append(label)
                
    return jsonify({
        "total_messages": len(chat_logs),
        "sentiment_counts": sentiment_counts,
        "sentiment_over_time": sentiment_over_time,
        "department_counts": department_counts,
        "recent_logs": chat_logs[-20:] # Return last 20 messages
    })

if __name__ == '__main__':
    print("Starting Flask server on http://localhost:5000")
    app.run(debug=True, port=5000)
