import os
import json
from flask import Flask, request, jsonify, send_from_directory
from transformers import pipeline
from datetime import datetime

app = Flask(__name__, static_url_path='', static_folder='.')

# Load Sentiment Analysis Model
# Using a smaller, faster model for demo purposes if the requested one is too heavy, 
# but the user specifically asked for "tabularisai/multilingual-sentiment-analysis".
# We will try to load it. If it fails or takes too long, we might need a fallback or async loading.
print("Loading sentiment analysis model...")
try:
    sentiment_pipeline = pipeline("sentiment-analysis", model="tabularisai/multilingual-sentiment-analysis")
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    sentiment_pipeline = None

# In-memory storage for chat logs (for simplicity in this demo)
# Structure: [ { "conversation_id": "...", "timestamp": "...", "sender": "user/bot", "message": "...", "sentiment": {...} } ]
chat_logs = []

@app.route('/')
def index():
    return send_from_directory('.', '9_chatbot_test.html')

@app.route('/dashboard')
def dashboard():
    return send_from_directory('.', 'dashboard.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/api/chat/log', methods=['POST'])
def log_chat():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    # Data expected: { "conversation_id": "...", "sender": "user/bot", "message": "...", "timestamp": "..." }
    
    # Perform sentiment analysis if it's a user message (or both? usually user sentiment is more interesting)
    # Let's analyze all messages to show flow.
    sentiment_result = None
    if sentiment_pipeline and data.get('message'):
        try:
            # The model returns a list of dicts: [{'label': '5 stars', 'score': 0.9}] or similar depending on model
            # tabularisai/multilingual-sentiment-analysis labels are often 'Very Positive', 'Positive', 'Neutral', 'Negative', 'Very Negative'
            result = sentiment_pipeline(data['message'][:512]) # Truncate to 512 tokens approx
            sentiment_result = result[0]
        except Exception as e:
            print(f"Sentiment analysis failed: {e}")

    log_entry = {
        "conversation_id": data.get("conversation_id", "default"),
        "timestamp": data.get("timestamp", datetime.now().isoformat()),
        "sender": data.get("sender"),
        "message": data.get("message"),
        "sentiment": sentiment_result
    }
    
    chat_logs.append(log_entry)
    return jsonify({"status": "success", "log_entry": log_entry})

@app.route('/api/dashboard/data', methods=['GET'])
def get_dashboard_data():
    # Aggregate data for the dashboard
    
    # 1. Overall Sentiment Distribution
    sentiment_counts = {}
    
    # 2. Sentiment Over Time (group by minute/hour for demo?)
    sentiment_over_time = []
    
    # 3. User vs Bot Sentiment
    user_sentiments = []
    bot_sentiments = []
    
    for log in chat_logs:
        if log.get('sentiment'):
            label = log['sentiment']['label']
            sentiment_counts[label] = sentiment_counts.get(label, 0) + 1
            
            entry = {
                "timestamp": log['timestamp'],
                "label": label,
                "score": log['sentiment']['score'],
                "sender": log['sender']
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
        "recent_logs": chat_logs[-20:] # Return last 20 messages
    })

if __name__ == '__main__':
    print("Starting Flask server on http://localhost:5000")
    app.run(debug=True, port=5000)
