#!/usr/bin/env python3
"""
HR Analytics API Server
A simple Flask server to handle HR analytics data requests
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import random
from datetime import datetime, timedelta
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Sample data for different departments and periods
SAMPLE_DATA = {
    "Marketing": {
        "workload_sentiment": {
            "very_negative": 25,
            "negative": 45,
            "neutral": 20,
            "positive": 10
        },
        "work_life_balance": {
            "resolved": 25,
            "unresolved": 75
        },
        "feedback_volume": 156,
        "trend": "increasing"
    },
    "Engineering": {
        "workload_sentiment": {
            "very_negative": 30,
            "negative": 40,
            "neutral": 20,
            "positive": 10
        },
        "work_life_balance": {
            "resolved": 20,
            "unresolved": 80
        },
        "feedback_volume": 203,
        "trend": "stable"
    },
    "Sales": {
        "workload_sentiment": {
            "very_negative": 20,
            "negative": 35,
            "neutral": 25,
            "positive": 20
        },
        "work_life_balance": {
            "resolved": 35,
            "unresolved": 65
        },
        "feedback_volume": 134,
        "trend": "decreasing"
    },
    "HR": {
        "workload_sentiment": {
            "very_negative": 15,
            "negative": 30,
            "neutral": 35,
            "positive": 20
        },
        "work_life_balance": {
            "resolved": 45,
            "unresolved": 55
        },
        "feedback_volume": 89,
        "trend": "stable"
    },
    "Finance": {
        "workload_sentiment": {
            "very_negative": 22,
            "negative": 38,
            "neutral": 25,
            "positive": 15
        },
        "work_life_balance": {
            "resolved": 30,
            "unresolved": 70
        },
        "feedback_volume": 112,
        "trend": "increasing"
    }
}

@app.route('/')
def serve_index():
    """Serve the main HTML file"""
    return send_from_directory('.', '6_report_custominsight.html')

@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files (CSS, JS, etc.)"""
    return send_from_directory('.', filename)

@app.route('/api/analysis', methods=['POST'])
def get_analysis():
    """
    Generate analysis data based on the provided parameters
    Expected JSON payload:
    {
        "period": "Q1 2025",
        "department": "Marketing",
        "keywords": "Workload, Work-life balance"
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        period = data.get('period', 'Q1 2025')
        department = data.get('department', 'Marketing')
        keywords = data.get('keywords', 'Workload, Work-life balance')
        
        # Get base data for the department
        dept_data = SAMPLE_DATA.get(department, SAMPLE_DATA['Marketing'])
        
        # Add some randomization based on period and keywords
        sentiment_data = dept_data['workload_sentiment'].copy()
        balance_data = dept_data['work_life_balance'].copy()
        
        # Adjust data based on keywords
        if 'workload' in keywords.lower():
            # Increase negative sentiment for workload issues
            sentiment_data['very_negative'] += random.randint(0, 10)
            sentiment_data['negative'] += random.randint(0, 5)
            sentiment_data['positive'] = max(5, sentiment_data['positive'] - random.randint(0, 5))
        
        if 'work-life balance' in keywords.lower():
            # Increase unresolved issues for work-life balance
            balance_data['unresolved'] += random.randint(0, 10)
            balance_data['resolved'] = max(10, balance_data['resolved'] - random.randint(0, 10))
        
        # Normalize percentages
        total_sentiment = sum(sentiment_data.values())
        for key in sentiment_data:
            sentiment_data[key] = round((sentiment_data[key] / total_sentiment) * 100, 1)
        
        total_balance = sum(balance_data.values())
        for key in balance_data:
            balance_data[key] = round((balance_data[key] / total_balance) * 100, 1)
        
        # Prepare response
        response_data = {
            "success": True,
            "timestamp": datetime.now().isoformat(),
            "parameters": {
                "period": period,
                "department": department,
                "keywords": keywords
            },
            "data": {
                "workload_sentiment": {
                    "labels": ["Very Negative", "Negative", "Neutral", "Positive"],
                    "data": [
                        sentiment_data['very_negative'],
                        sentiment_data['negative'],
                        sentiment_data['neutral'],
                        sentiment_data['positive']
                    ],
                    "colors": ["#dc3545", "#fd7e14", "#6c757d", "#28a745"]
                },
                "work_life_balance": {
                    "resolved": balance_data['resolved'],
                    "unresolved": balance_data['unresolved'],
                    "colors": ["#007bff", "#6c757d"]
                },
                "metadata": {
                    "feedback_volume": dept_data['feedback_volume'],
                    "trend": dept_data['trend'],
                    "analysis_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                }
            }
        }
        
        return jsonify(response_data)
        
    except Exception as e:
        return jsonify({"error": str(e), "success": False}), 500

@app.route('/api/export', methods=['POST'])
def export_data():
    """
    Export analysis data
    """
    try:
        data = request.get_json()
        
        # Generate export filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        department = data.get('department', 'unknown').lower().replace(' ', '_')
        filename = f"hr_analysis_{department}_{timestamp}.json"
        
        # Add export metadata
        export_data = {
            "export_info": {
                "filename": filename,
                "exported_at": datetime.now().isoformat(),
                "exported_by": "HR Analytics System"
            },
            "analysis_data": data
        }
        
        return jsonify({
            "success": True,
            "filename": filename,
            "data": export_data
        })
        
    except Exception as e:
        return jsonify({"error": str(e), "success": False}), 500

@app.route('/api/send', methods=['POST'])
def send_report():
    """
    Simulate sending report via email
    """
    try:
        data = request.get_json()
        
        department = data.get('department', 'Unknown')
        period = data.get('period', 'Unknown')
        
        # Simulate email sending delay
        import time
        time.sleep(1)
        
        return jsonify({
            "success": True,
            "message": f"Report for {department} department ({period}) has been sent successfully!",
            "sent_at": datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({"error": str(e), "success": False}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    print("Starting HR Analytics Server...")
    print("Server will be available at: http://localhost:5000")
    print("API endpoints:")
    print("  POST /api/analysis - Generate analysis data")
    print("  POST /api/export - Export analysis data")
    print("  POST /api/send - Send report")
    print("  GET /api/health - Health check")
    print("\nPress Ctrl+C to stop the server")
    
    app.run(debug=True, host='0.0.0.0', port=5000)