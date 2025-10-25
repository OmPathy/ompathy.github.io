from flask import Flask, jsonify, render_template, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Feedback data
feedback_data = {
    "1": {
        "id": "1",
        "title": "Doesn't Feel my hard work paid off",
        "employee": {
            "name": "Jacob Leroy",
            "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
            "department": "Marketing"
        },
        "department": "Marketing",
        "assignee": {
            "name": "You",
            "avatar": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
        },
        "category": "Rewards & Recognition",
        "priority": "Medium",
        "submitted_date": "02/09/2025",
        "answer_by": "02/17/2025",
        "feedback": "I've been putting in extra hours, taking on additional responsibilities, and consistently meeting tight deadlines, yet I feel like my efforts are going unnoticed. I rarely receive recognition, and when it comes to promotions or bonuses, it seems like my hard work doesn't pay off. It's really demotivating to see others being acknowledged while my contributions are overlooked. I want to feel valued for what I bring to the team, but right now, it just feels like no matter how much effort I put in, it doesn't make a difference.",
        "action_plan": [
            {
                "title": "Recognition Improvement:",
                "description": "Implement a structured recognition program to ensure employees' contributions are acknowledged regularly."
            },
            {
                "title": "Performance Review Transparency:",
                "description": "Provide clear feedback on career growth opportunities and performance evaluation criteria."
            },
            {
                "title": "One-on-One Discussion:",
                "description": "Encourage managers to have open conversations with employees about their concerns and career progression."
            }
        ]
    },
    "2": {
        "id": "2",
        "title": "Facing challenges in aligning with team goals",
        "employee": {
            "name": "Michael Johnson",
            "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
            "department": "IT"
        },
        "department": "IT",
        "assignee": {
            "name": "You",
            "avatar": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
        },
        "category": "Team Goals & Alignment",
        "priority": "High",
        "submitted_date": "02/07/2025",
        "answer_by": "02/15/2025",
        "feedback": "I'm finding it difficult to understand how my individual tasks contribute to the broader team objectives. The goals seem to change frequently, and communication about priorities isn't always clear. This makes it challenging to prioritize my work effectively and I often feel like I'm working in isolation rather than as part of a cohesive team effort.",
        "action_plan": [
            {
                "title": "Goal Clarity Sessions:",
                "description": "Conduct regular team meetings to clarify objectives and individual contributions to team goals."
            },
            {
                "title": "Communication Framework:",
                "description": "Establish clear communication channels for goal updates and priority changes."
            },
            {
                "title": "Individual Alignment:",
                "description": "Create personalized goal alignment plans for each team member."
            }
        ]
    },
    "3": {
        "id": "3",
        "title": "Seeking clearer feedback on performance metrics",
        "employee": {
            "name": "Emily Davis",
            "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
            "department": "Marketing"
        },
        "department": "Marketing",
        "assignee": {
            "name": "You",
            "avatar": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
        },
        "category": "Performance Feedback & Metrics",
        "priority": "Low",
        "submitted_date": "02/02/2025",
        "answer_by": "02/20/2025",
        "feedback": "I would appreciate more specific and actionable feedback on my performance. Currently, the feedback I receive is quite general, and I'm not sure what specific areas I should focus on for improvement. Having clearer metrics and more frequent check-ins would help me understand my progress better.",
        "action_plan": [
            {
                "title": "Performance Metrics Definition:",
                "description": "Define clear, measurable performance indicators for each role."
            },
            {
                "title": "Regular Check-ins:",
                "description": "Implement bi-weekly performance review sessions with specific feedback."
            },
            {
                "title": "Development Planning:",
                "description": "Create individual development plans with actionable improvement steps."
            }
        ]
    },
    "4": {
        "id": "4",
        "title": "Want more opportunities for skill development",
        "employee": {
            "name": "Ethan Brown",
            "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
            "department": "Operations"
        },
        "department": "Operations",
        "assignee": {
            "name": "You",
            "avatar": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
        },
        "category": "Growth & Development",
        "priority": "Medium",
        "submitted_date": "02/01/2025",
        "answer_by": "02/18/2025",
        "feedback": "I'm eager to expand my skill set and take on new challenges, but I feel like there aren't enough opportunities for professional development in my current role. I'd love to attend training sessions, workshops, or even take on cross-functional projects that would help me grow professionally.",
        "action_plan": [
            {
                "title": "Training Program Access:",
                "description": "Provide access to relevant training programs and professional development courses."
            },
            {
                "title": "Cross-functional Projects:",
                "description": "Create opportunities for employees to work on projects outside their primary role."
            },
            {
                "title": "Mentorship Program:",
                "description": "Establish a mentorship program to support career development."
            }
        ]
    },
    "5": {
        "id": "5",
        "title": "Struggling with team communication issues",
        "employee": {
            "name": "Mia Anderson",
            "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face",
            "department": "Design"
        },
        "department": "Design",
        "assignee": {
            "name": "You",
            "avatar": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
        },
        "category": "Communication & Collaboration",
        "priority": "High",
        "submitted_date": "01/30/2025",
        "answer_by": "02/14/2025",
        "feedback": "There are significant communication gaps within our team that are affecting project delivery and team morale. Information doesn't flow effectively between team members, and there's often confusion about responsibilities and deadlines. We need better communication tools and processes.",
        "action_plan": [
            {
                "title": "Communication Tools:",
                "description": "Implement better communication platforms and establish communication protocols."
            },
            {
                "title": "Team Building:",
                "description": "Organize team building activities to improve interpersonal relationships."
            },
            {
                "title": "Process Improvement:",
                "description": "Review and improve existing communication processes and workflows."
            }
        ]
    },
    "6": {
        "id": "6",
        "title": "Desire for better work-life balance policies",
        "employee": {
            "name": "Daniel Taylor",
            "avatar": "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=40&h=40&fit=crop&crop=face",
            "department": "Finance"
        },
        "department": "Finance",
        "assignee": {
            "name": "You",
            "avatar": "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
        },
        "category": "Work-Life Balance",
        "priority": "Medium",
        "submitted_date": "01/25/2025",
        "answer_by": "02/19/2025",
        "feedback": "The current work-life balance policies don't adequately support employees' personal needs. Long working hours and limited flexibility make it difficult to maintain a healthy balance between work and personal life. More flexible working arrangements would greatly improve job satisfaction.",
        "action_plan": [
            {
                "title": "Flexible Work Arrangements:",
                "description": "Implement flexible working hours and remote work options where possible."
            },
            {
                "title": "Policy Review:",
                "description": "Review and update work-life balance policies to better support employee needs."
            },
            {
                "title": "Wellness Programs:",
                "description": "Introduce wellness programs and mental health support initiatives."
            }
        ]
    }
}

@app.route('/')
def index():
    """Serve the main HTML page"""
    return send_from_directory('.', '3_feedback_details.html')

@app.route('/css/3_feedback_details_style.css')
def styles():
    """Serve the CSS file"""
    return send_from_directory('.', '3_feedback_details_style.css')

@app.route('/js/3_feedback_details_script.js')
def script():
    """Serve the JavaScript file"""
    return send_from_directory('.', '3_feedback_details_script.js')

@app.route('/api/feedback')
def get_all_feedback():
    """Get all feedback items"""
    return jsonify({
        "status": "success",
        "data": list(feedback_data.values())
    })

@app.route('/api/feedback/<feedback_id>')
def get_feedback(feedback_id):
    """Get specific feedback by ID"""
    if feedback_id in feedback_data:
        return jsonify({
            "status": "success",
            "data": feedback_data[feedback_id]
        })
    else:
        return jsonify({
            "status": "error",
            "message": "Feedback not found"
        }), 404

@app.route('/api/feedback/department/<department>')
def get_feedback_by_department(department):
    """Get feedback filtered by department"""
    filtered_feedback = [
        feedback for feedback in feedback_data.values()
        if feedback['department'].lower() == department.lower()
    ]
    return jsonify({
        "status": "success",
        "data": filtered_feedback
    })

@app.route('/api/feedback/priority/<priority>')
def get_feedback_by_priority(priority):
    """Get feedback filtered by priority"""
    filtered_feedback = [
        feedback for feedback in feedback_data.values()
        if feedback['priority'].lower() == priority.lower()
    ]
    return jsonify({
        "status": "success",
        "data": filtered_feedback
    })

@app.route('/api/feedback/category/<category>')
def get_feedback_by_category(category):
    """Get feedback filtered by category"""
    filtered_feedback = [
        feedback for feedback in feedback_data.values()
        if category.lower() in feedback['category'].lower()
    ]
    return jsonify({
        "status": "success",
        "data": filtered_feedback
    })

if __name__ == '__main__':
    print("Starting Feedback Management System...")
    print("Access the application at: http://localhost:5000")
    print("API endpoints available:")
    print("  - GET /api/feedback - Get all feedback")
    print("  - GET /api/feedback/<id> - Get specific feedback")
    print("  - GET /api/feedback/department/<dept> - Filter by department")
    print("  - GET /api/feedback/priority/<priority> - Filter by priority")
    print("  - GET /api/feedback/category/<category> - Filter by category")
    app.run(debug=True, host='0.0.0.0', port=5000)