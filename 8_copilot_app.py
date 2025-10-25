from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import json
import uuid
import datetime
import os
import requests
from typing import Dict, List, Optional

app = Flask(__name__, static_folder='static', template_folder='.')
CORS(app)

# Configuration
CHATBOT_API_URL = "https://api.openai.com/v1/chat/completions"  # Replace with your chatbot API
CHATBOT_API_KEY = "your-api-key-here"  # Replace with your API key

# In-memory storage for conversations (should use database in production)
conversations: Dict[str, List[Dict]] = {}
reports_data: Dict[str, Dict] = {}

class ChatbotService:
    """Handle communication with external chatbot API"""
    
    @staticmethod
    def send_message(message: str, conversation_id: str) -> Dict:
        """Send message to chatbot API and return response"""
        try:
            # Get conversation history
            conversation_history = conversations.get(conversation_id, [])
            
            # Build message history
            messages = [
                {"role": "system", "content": "You are a professional AI assistant specialized in helping users analyze data and generate reports. When users ask about reports, data analysis, or sentiment analysis, you should provide detailed answers and suggest generating relevant reports."}
            ]
            
            # Add conversation history
            for msg in conversation_history[-10:]:  # Keep only the last 10 messages
                messages.append({
                    "role": msg["sender"],
                    "content": msg["content"]
                })
            
            # Add current message
            messages.append({"role": "user", "content": message})
            
            # Check if report generation is needed
            needs_report = ChatbotService.check_if_needs_report(message)
            
            # Simulate API call (in actual use, uncomment the code below and comment out the mock response)
            """
            headers = {
                "Authorization": f"Bearer {CHATBOT_API_KEY}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "model": "gpt-3.5-turbo",
                "messages": messages,
                "max_tokens": 1000,
                "temperature": 0.7
            }
            
            response = requests.post(CHATBOT_API_URL, headers=headers, json=payload)
            response.raise_for_status()
            
            data = response.json()
            assistant_message = data["choices"][0]["message"]["content"]
            """
            
            # Mock response (remove this part in actual use)
            assistant_message = ChatbotService.generate_mock_response(message, needs_report)
            
            # Save conversation
            if conversation_id not in conversations:
                conversations[conversation_id] = []
            
            conversations[conversation_id].extend([
                {
                    "sender": "user",
                    "content": message,
                    "timestamp": datetime.datetime.now().isoformat()
                },
                {
                    "sender": "assistant",
                    "content": assistant_message,
                    "timestamp": datetime.datetime.now().isoformat()
                }
            ])
            
            result = {
                "success": True,
                "response": assistant_message,
                "has_report": needs_report
            }
            
            # If report is needed, add report data
            if needs_report:
                report_data = ChatbotService.generate_report_data(message)
                result["report_data"] = report_data
                reports_data[conversation_id] = report_data
            
            return result
            
        except Exception as e:
            print(f"Error in chatbot service: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "response": "Sorry, I cannot process your request right now. Please try again later."
            }
    
    @staticmethod
    def check_if_needs_report(message: str) -> bool:
        """Check if message needs report generation"""
        report_keywords = [
            "report", "analysis", "data", "chart", "sentiment", "statistics", "trends",
            "analyze", "generate", "dashboard", "insights", "metrics"
        ]
        return any(keyword in message.lower() for keyword in report_keywords)
    
    @staticmethod
    def generate_mock_response(message: str, needs_report: bool) -> str:
        """Generate mock response"""
        if needs_report:
            return f"I have analyzed the relevant data and generated a report for you. Based on your request '{message}', I have discovered some important insights. You can view detailed information through the report card below, or download the complete report. If you need more information or have other questions, please feel free to let me know!"
        else:
            responses = [
                "I understand your question. Let me provide you with a detailed answer.",
                "This is a great question. Based on my analysis...",
                "I'm happy to help you solve this problem.",
                "Based on the information you provided, I recommend..."
            ]
            import random
            return random.choice(responses) + f" Regarding '{message}', I suggest you could consider further data analysis to gain deeper insights."
    
    @staticmethod
    def generate_report_data(message: str) -> Dict:
        """Generate report data"""
        return {
            "title": "Data Analysis Report",
            "description": f"Real-time data analysis report generated based on your query '{message}'",
            "insights": "Through in-depth analysis, we have discovered several key trends and patterns that can help you make better decisions.",
            "generated_at": datetime.datetime.now().isoformat(),
            "type": "sentiment_analysis" if "sentiment" in message.lower() else "general_analysis"
        }

@app.route('/')
def index():
    """Main page route"""
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    """API endpoint for handling chat messages"""
    try:
        data = request.get_json()
        message = data.get('message', '').strip()
        conversation_id = data.get('conversation_id', str(uuid.uuid4()))
        
        if not message:
            return jsonify({
                "success": False,
                "error": "Message cannot be empty"
            }), 400
        
        # Call chatbot service
        result = ChatbotService.send_message(message, conversation_id)
        
        return jsonify(result)
        
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        return jsonify({
            "success": False,
            "error": "Internal server error",
            "response": "Sorry, the server encountered a problem. Please try again later."
        }), 500

@app.route('/api/send-report', methods=['POST'])
def send_report():
    """API endpoint for sending reports"""
    try:
        data = request.get_json()
        report_type = data.get('report_type', 'general')
        conversation_id = data.get('conversation_id')
        
        # Simulate sending report
        # In a real application, this would send email or save to database
        
        return jsonify({
            "success": True,
            "message": "Report sent successfully"
        })
        
    except Exception as e:
        print(f"Error in send-report endpoint: {str(e)}")
        return jsonify({
            "success": False,
            "error": "Failed to send report"
        }), 500

@app.route('/api/conversations/<conversation_id>')
def get_conversation(conversation_id):
    """API endpoint for getting conversation history"""
    try:
        conversation = conversations.get(conversation_id, [])
        return jsonify({
            "success": True,
            "conversation": conversation
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/reports/<conversation_id>')
def get_report(conversation_id):
    """API endpoint for getting specific report"""
    try:
        report = reports_data.get(conversation_id)
        if report:
            return jsonify({
                "success": True,
                "report": report
            })
        else:
            return jsonify({
                "success": False,
                "error": "Report not found"
            }), 404
    except Exception as e:
        print(f"Error in get_report endpoint: {str(e)}")
        return jsonify({
            "success": False,
            "error": "Internal server error"
        }), 500

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.datetime.now().isoformat(),
        "version": "1.0.0"
    })

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        "success": False,
        "error": "Endpoint not found"
    }), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({
        "success": False,
        "error": "Internal server error"
    }), 500

if __name__ == '__main__':
    print("Starting Flask server...")
    print("Visit http://localhost:5000 to view the application")
    print("API documentation: http://localhost:5000/api/chat (POST)")
    app.run(debug=True, host='0.0.0.0', port=5000)