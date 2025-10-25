from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Employee data matching the UI exactly
employees_data = [
    {
        "id": 1,
        "name": "Ethan Carter",
        "department": "Marketing",
        "title": "Sr. Marketing Specialist",
        "yearOfService": "2 yr 3 months",
        "sentimentScore": 89,
        "brScore": 40.6,
        "responseRate": 92.3,
        "riskLevel": "Satisfied",
        "avatar": "https://via.placeholder.com/32x32/8B5CF6/FFFFFF?text=EC"
    },
    {
        "id": 2,
        "name": "Mason Harris",
        "department": "Finance",
        "title": "Financial Planner",
        "yearOfService": "3 years",
        "sentimentScore": 39,
        "brScore": 69.5,
        "responseRate": 65.7,
        "riskLevel": "Action Required",
        "avatar": "https://via.placeholder.com/32x32/8B5CF6/FFFFFF?text=MH"
    },
    {
        "id": 3,
        "name": "Chloe Bennett",
        "department": "Data Science",
        "title": "Data Scientist",
        "yearOfService": "3 years 7 months",
        "sentimentScore": 52,
        "brScore": 71.5,
        "responseRate": 90.2,
        "riskLevel": "Nurture",
        "avatar": "https://via.placeholder.com/32x32/8B5CF6/FFFFFF?text=CB"
    },
    {
        "id": 4,
        "name": "Sophie Turner",
        "department": "Customer Service",
        "title": "CE Manager",
        "yearOfService": "1 year 10 months",
        "sentimentScore": 40,
        "brScore": 65.1,
        "responseRate": 50.2,
        "riskLevel": "Nurture",
        "avatar": "https://via.placeholder.com/32x32/8B5CF6/FFFFFF?text=ST"
    },
    {
        "id": 5,
        "name": "James Anderson",
        "department": "Dev Team",
        "title": "Backend Developer",
        "yearOfService": "3 years 2 months",
        "sentimentScore": 81,
        "brScore": 39.0,
        "responseRate": 40.7,
        "riskLevel": "Satisfied",
        "avatar": "https://via.placeholder.com/32x32/8B5CF6/FFFFFF?text=JA"
    },
    {
        "id": 6,
        "name": "Olivia Mitchell",
        "department": "Sales",
        "title": "Sales Strategy Analyst",
        "yearOfService": "2 years 5 months",
        "sentimentScore": 32,
        "brScore": 92.6,
        "responseRate": 76.8,
        "riskLevel": "Action Required",
        "avatar": "https://via.placeholder.com/32x32/8B5CF6/FFFFFF?text=OM"
    },
    {
        "id": 7,
        "name": "William Scott",
        "department": "R&D",
        "title": "Innovation Manager",
        "yearOfService": "1 year 7 months",
        "sentimentScore": 70,
        "brScore": 47.6,
        "responseRate": 91.0,
        "riskLevel": "Stable",
        "avatar": "https://via.placeholder.com/32x32/8B5CF6/FFFFFF?text=WS"
    },
    {
        "id": 8,
        "name": "Mia Thompson",
        "department": "Operations",
        "title": "Supply Chain Coordinator",
        "yearOfService": "2 years",
        "sentimentScore": 82,
        "brScore": 32.7,
        "responseRate": 65.7,
        "riskLevel": "Satisfied",
        "avatar": "https://via.placeholder.com/32x32/8B5CF6/FFFFFF?text=MT"
    }
]

# Dashboard statistics
dashboard_stats = {
    "statusCounts": {
        "satisfied": 78,
        "stable": 152,
        "nurture": 36,
        "actionRequired": 14
    },
    "statusPercentages": {
        "satisfied": 27.9,
        "stable": 54.3,
        "nurture": 12.9,
        "actionRequired": 5.0
    },
    "totalFeedback": {
        "total": 150,
        "low": 45,
        "medium": 67,
        "high": 38
    },
    "sosRequests": {
        "total": 32,
        "resolved": 2,
        "investigating": 105,
        "unopened": 7
    },
    "departmentBurnout": {
        "Marketing": 80,
        "Finance": 45,
        "Data Science": 60,
        "Customer Service": 75,
        "Dev Team": 55,
        "Sales Ops": 40,
        "R&D": 70,
        "Operations": 65
    },
    "needsAttention": [
        {
            "name": "Mason Harris",
            "department": "Finance",
            "avatar": "https://via.placeholder.com/40x40/8B5CF6/FFFFFF?text=MH"
        },
        {
            "name": "Olivia Mitchell",
            "department": "Sales",
            "avatar": "https://via.placeholder.com/40x40/8B5CF6/FFFFFF?text=OM"
        },
        {
            "name": "Sophia Taylor",
            "department": "Sales",
            "avatar": "https://via.placeholder.com/40x40/8B5CF6/FFFFFF?text=ST"
        }
    ]
}

@app.route('/')
def serve_index():
    return send_from_directory('.', '2_employees.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)

@app.route('/api/employees')
def get_employees():
    """Get all employee data"""
    return jsonify(employees_data)

@app.route('/api/dashboard-stats')
def get_dashboard_stats():
    """Get dashboard statistics"""
    return jsonify(dashboard_stats)

@app.route('/api/employees/<int:employee_id>')
def get_employee(employee_id):
    """Get specific employee data"""
    employee = next((emp for emp in employees_data if emp['id'] == employee_id), None)
    if employee:
        return jsonify(employee)
    return jsonify({"error": "Employee not found"}), 404

@app.route('/api/departments')
def get_departments():
    """Get list of all departments"""
    departments = list(set(emp['department'] for emp in employees_data))
    return jsonify(departments)

@app.route('/api/employees/department/<department>')
def get_employees_by_department(department):
    """Get employees by department"""
    filtered_employees = [emp for emp in employees_data if emp['department'].lower() == department.lower()]
    return jsonify(filtered_employees)

@app.route('/api/employees/risk-level/<risk_level>')
def get_employees_by_risk(risk_level):
    """Get employees by risk level"""
    filtered_employees = [emp for emp in employees_data if emp['riskLevel'].lower().replace(' ', '') == risk_level.lower().replace(' ', '')]
    return jsonify(filtered_employees)

if __name__ == '__main__':
    print("Starting Employee Summary Dashboard Server...")
    print("Access the dashboard at: http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)