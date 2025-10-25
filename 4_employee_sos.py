from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
import random
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Simulated ticket data
tickets_data = [
    {
        "id": "REQ-1022",
        "date": "03-10-2025",
        "category": "Racial Discrimination",
        "department": "Marketing",
        "status": "Pending",
        "assigned": {
            "name": "John Doe",
            "avatar": "https://i.pravatar.cc/40?img=1"
        },
        "incident_location": "Online Meeting",
        "incident_time": "March 1, 2025, 10:30 AM",
        "evidence_attachments": "N/A",
        "reporter_anonymity": "Full Anonymous",
        "description": "During the meeting, a high-level manager made racially discriminatory comments, which caused discomfort and offense to the attendees.",
        "action_plans": [
            {
                "id": 1,
                "title": "Initiate Immediate Investigation",
                "improvement": "+20%",
                "status": "AES",
                "description": "Conduct thorough investigation of the incident"
            },
            {
                "id": 2,
                "title": "Conduct Diversity & Sensitivity Training",
                "improvement": "+15%",
                "status": "AES",
                "description": "Mandatory training for all management staff"
            },
            {
                "id": 3,
                "title": "Schedule Urgent Leadership Review",
                "improvement": "+18%",
                "status": "AES",
                "description": "Review leadership practices and policies"
            }
        ],
        "comments": [
            {
                "id": 1,
                "author": "System",
                "content": "Ticket created and assigned to John Doe",
                "timestamp": "2025-03-10 09:00:00",
                "type": "system"
            }
        ]
    },
    {
        "id": "REQ-1021",
        "date": "03-02-2025",
        "category": "Harassment",
        "department": "Operations",
        "status": "Unopened",
        "assigned": {
            "name": "Jane Smith",
            "avatar": "https://i.pravatar.cc/40?img=2"
        },
        "incident_location": "Office Floor 3",
        "incident_time": "March 2, 2025, 2:15 PM",
        "evidence_attachments": "Email screenshots",
        "reporter_anonymity": "Partial Anonymous",
        "description": "A supervisor repeatedly made inappropriate comments about an employee's appearance and personal life, creating an uncomfortable work environment. The behavior has been ongoing for several weeks and has affected the employee's productivity and well-being.",
        "action_plans": [
            {
                "id": 1,
                "title": "Immediate Supervisor Interview",
                "improvement": "+25%",
                "status": "AES",
                "description": "Conduct urgent interview with the supervisor to address allegations"
            },
            {
                "id": 2,
                "title": "Victim Support & Documentation",
                "improvement": "+20%",
                "status": "AES",
                "description": "Provide support to affected employee and document all incidents"
            },
            {
                "id": 3,
                "title": "Workplace Harassment Training",
                "improvement": "+22%",
                "status": "AES",
                "description": "Mandatory harassment prevention training for all supervisors"
            }
        ]
    },
    {
        "id": "REQ-1020",
        "date": "02-28-2025",
        "category": "Fraud",
        "department": "Customer Service",
        "status": "Investigating",
        "assigned": {
            "name": "Alice Johnson",
            "avatar": "https://i.pravatar.cc/40?img=3"
        },
        "incident_location": "Customer Service Center",
        "incident_time": "February 28, 2025, 11:45 AM",
        "evidence_attachments": "Transaction records, CCTV footage",
        "reporter_anonymity": "Full Anonymous",
        "description": "An employee was observed manipulating customer refund requests and potentially redirecting funds to personal accounts. Multiple suspicious transactions were identified during a routine audit, showing a pattern of unauthorized financial activities.",
        "action_plans": [
            {
                "id": 1,
                "title": "Forensic Financial Audit",
                "improvement": "+30%",
                "status": "AES",
                "description": "Comprehensive audit of all transactions and financial records"
            },
            {
                "id": 2,
                "title": "Secure Evidence Collection",
                "improvement": "+28%",
                "status": "AES",
                "description": "Preserve CCTV footage and transaction logs for investigation"
            },
            {
                "id": 3,
                "title": "Enhanced Financial Controls",
                "improvement": "+25%",
                "status": "AES",
                "description": "Implement additional oversight for refund processing"
            }
        ]
    },
    {
        "id": "REQ-1019",
        "date": "01-10-2025",
        "category": "Conflict Resolution",
        "department": "IT Support",
        "status": "Investigating",
        "assigned": {
            "name": "Sarah Brown",
            "avatar": "https://i.pravatar.cc/40?img=4"
        },
        "incident_location": "IT Department",
        "incident_time": "January 10, 2025, 9:30 AM",
        "evidence_attachments": "Email chain, meeting notes",
        "reporter_anonymity": "Not Anonymous",
        "description": "Two team members have been engaged in ongoing disputes over project responsibilities and resource allocation. The conflict has escalated to verbal arguments during team meetings and is affecting overall team morale and project deadlines.",
        "action_plans": [
            {
                "id": 1,
                "title": "Mediated Team Discussion",
                "improvement": "+24%",
                "status": "AES",
                "description": "Facilitate structured dialogue between conflicting parties"
            },
            {
                "id": 2,
                "title": "Role Clarification Workshop",
                "improvement": "+26%",
                "status": "AES",
                "description": "Define clear project responsibilities and resource allocation"
            },
            {
                "id": 3,
                "title": "Team Building Activities",
                "improvement": "+18%",
                "status": "AES",
                "description": "Improve collaboration and communication skills"
            }
        ]
    },
    {
        "id": "REQ-1018",
        "date": "12-28-2024",
        "category": "Conflict Resolution",
        "department": "Operations",
        "status": "Investigating",
        "assigned": {
            "name": "Michael Green",
            "avatar": "https://i.pravatar.cc/40?img=5"
        },
        "incident_location": "Operations Floor",
        "incident_time": "December 28, 2024, 3:20 PM",
        "evidence_attachments": "Witness statements",
        "reporter_anonymity": "Partial Anonymous",
        "description": "A disagreement between shift supervisors regarding work scheduling and overtime assignments has created tension among staff. The conflict has resulted in inconsistent work procedures and complaints from team members about unfair treatment.",
        "action_plans": [
            {
                "id": 1,
                "title": "Scheduling Policy Review",
                "improvement": "+23%",
                "status": "AES",
                "description": "Establish clear and fair scheduling procedures"
            },
            {
                "id": 2,
                "title": "Supervisor Alignment Meeting",
                "improvement": "+21%",
                "status": "AES",
                "description": "Align supervisors on consistent work procedures"
            },
            {
                "id": 3,
                "title": "Staff Feedback Session",
                "improvement": "+19%",
                "status": "AES",
                "description": "Gather input from team members on scheduling concerns"
            }
        ]
    },
    {
        "id": "REQ-1017",
        "date": "12-21-2024",
        "category": "Policy Violation",
        "department": "IT Support",
        "status": "Resolved",
        "assigned": {
            "name": "Michael Green",
            "avatar": "https://i.pravatar.cc/40?img=5"
        },
        "incident_location": "Server Room",
        "incident_time": "December 21, 2024, 6:45 PM",
        "evidence_attachments": "Access logs, security footage",
        "reporter_anonymity": "Not Anonymous",
        "description": "An IT technician was found accessing the server room outside of authorized hours without proper approval. Security logs revealed unauthorized access to sensitive systems and potential data security violations that required immediate investigation.",
        "comments": [
            {
                "author": "Michael Green",
                "role": "HR Investigator",
                "date": "12-22-2024",
                "time": "9:00 AM",
                "content": "Case opened. Initial review of access logs confirms unauthorized entry at 6:45 PM on 12-21-2024. Scheduling interview with the technician for tomorrow."
            },
            {
                "author": "Michael Green",
                "role": "HR Investigator",
                "date": "12-23-2024",
                "time": "2:30 PM",
                "content": "Conducted interview with the technician. Employee admitted to accessing server room to retrieve personal laptop left behind. Claims no malicious intent. Reviewing security footage to verify."
            },
            {
                "author": "Sarah Wilson",
                "role": "IT Security Manager",
                "date": "12-24-2024",
                "time": "10:15 AM",
                "content": "Security audit completed. No evidence of data breach or system compromise. However, proper protocols were not followed. Recommend disciplinary action and mandatory security training."
            },
            {
                "author": "Michael Green",
                "role": "HR Investigator",
                "date": "12-26-2024",
                "time": "11:00 AM",
                "content": "Final decision: Written warning issued. Employee must complete security protocol training within 30 days. Access privileges temporarily restricted. Case resolved."
            }
        ],
        "resolution": "Written warning issued with mandatory security training. No evidence of malicious intent found, but proper protocols must be followed."
    },
    {
        "id": "REQ-1016",
        "date": "11-19-2024",
        "category": "Policy Violation",
        "department": "Marketing",
        "status": "Resolved",
        "assigned": {
            "name": "John Doe",
            "avatar": "https://i.pravatar.cc/40?img=1"
        },
        "incident_location": "Marketing Office",
        "incident_time": "November 19, 2024, 1:30 PM",
        "evidence_attachments": "Social media posts, screenshots",
        "reporter_anonymity": "Not Anonymous",
        "description": "A marketing employee posted confidential company information and upcoming product details on personal social media accounts, violating the company's social media policy and potentially compromising competitive advantages.",
        "comments": [
            {
                "author": "John Doe",
                "role": "HR Manager",
                "date": "11-20-2024",
                "time": "8:30 AM",
                "content": "Incident reported. Screenshots of social media posts collected as evidence. Immediate action required to minimize potential damage to company interests."
            },
            {
                "author": "Lisa Chen",
                "role": "Legal Counsel",
                "date": "11-20-2024",
                "time": "11:00 AM",
                "content": "Reviewed posted content. Confirmed violation of confidentiality agreement and social media policy. Recommend immediate post removal and employee disciplinary action."
            },
            {
                "author": "John Doe",
                "role": "HR Manager",
                "date": "11-21-2024",
                "time": "2:00 PM",
                "content": "Met with employee. Posts have been removed. Employee acknowledged mistake and expressed remorse. Reviewing appropriate disciplinary measures with management."
            },
            {
                "author": "Mark Thompson",
                "role": "Marketing Director",
                "date": "11-22-2024",
                "time": "10:30 AM",
                "content": "Damage assessment completed. Minimal impact on product launch timeline. Employee has been a valuable team member. Support progressive discipline approach."
            },
            {
                "author": "John Doe",
                "role": "HR Manager",
                "date": "11-25-2024",
                "time": "9:15 AM",
                "content": "Final resolution: Formal written warning issued. Employee must complete social media training and confidentiality refresher course. Case closed."
            }
        ],
        "resolution": "Formal written warning with mandatory training on social media policy and confidentiality agreements. Employee showed genuine remorse and cooperation."
    },
    {
        "id": "REQ-1015",
        "date": "11-01-2024",
        "category": "Racial Discrimination",
        "department": "Operations",
        "status": "Resolved",
        "assigned": {
            "name": "Michael Green",
            "avatar": "https://i.pravatar.cc/40?img=5"
        },
        "incident_location": "Break Room",
        "incident_time": "November 1, 2024, 12:15 PM",
        "evidence_attachments": "Witness statements, audio recording",
        "reporter_anonymity": "Full Anonymous",
        "description": "During lunch break, a senior employee made racially insensitive jokes and comments directed at colleagues from minority backgrounds. Multiple witnesses reported feeling uncomfortable and discriminated against due to these inappropriate remarks.",
        "comments": [
            {
                "author": "Michael Green",
                "role": "HR Investigator",
                "date": "11-02-2024",
                "time": "9:00 AM",
                "content": "Anonymous complaint received regarding racial discrimination. Multiple witnesses mentioned. This is a serious allegation requiring immediate and thorough investigation."
            },
            {
                "author": "Dr. Patricia Williams",
                "role": "Diversity & Inclusion Officer",
                "date": "11-03-2024",
                "time": "10:30 AM",
                "content": "Interviewed three witnesses separately. All confirmed inappropriate racial comments were made. Audio recording provided supports the allegations. This behavior is unacceptable and violates our zero-tolerance policy."
            },
            {
                "author": "Michael Green",
                "role": "HR Investigator",
                "date": "11-04-2024",
                "time": "2:15 PM",
                "content": "Conducted formal interview with the accused employee. Initially denied allegations but when presented with evidence, admitted to making 'jokes' but claimed no malicious intent. Intent is irrelevant - impact on colleagues is what matters."
            },
            {
                "author": "Robert Martinez",
                "role": "Operations Director",
                "date": "11-05-2024",
                "time": "11:00 AM",
                "content": "Reviewed case details. This employee has been with us for 8 years with no prior incidents, but this behavior is completely unacceptable. Support strong disciplinary action to send clear message about our values."
            },
            {
                "author": "Michael Green",
                "role": "HR Investigator",
                "date": "11-08-2024",
                "time": "3:30 PM",
                "content": "Final decision reached: Employee suspended without pay for 2 weeks. Must complete mandatory diversity training and sensitivity counseling. Final written warning issued. Any future incidents will result in termination."
            }
        ],
        "resolution": "2-week unpaid suspension with mandatory diversity training and sensitivity counseling. Final written warning issued with zero tolerance for future incidents."
    },
    {
        "id": "REQ-1014",
        "date": "10-17-2024",
        "category": "Harassment",
        "department": "Sales",
        "status": "Resolved",
        "assigned": {
            "name": "Alice Johnson",
            "avatar": "https://i.pravatar.cc/40?img=3"
        },
        "incident_location": "Sales Floor",
        "incident_time": "October 17, 2024, 4:00 PM",
        "evidence_attachments": "Text messages, email records",
        "reporter_anonymity": "Partial Anonymous",
        "description": "A sales manager was reported for sending inappropriate text messages and emails to junior staff members outside of work hours. The messages contained personal comments and requests that made employees feel uncomfortable and pressured.",
        "comments": [
            {
                "author": "Alice Johnson",
                "role": "HR Specialist",
                "date": "10-18-2024",
                "time": "8:00 AM",
                "content": "Harassment complaint filed. Multiple employees affected. Text messages and emails provided as evidence. This appears to be a pattern of inappropriate behavior requiring immediate investigation."
            },
            {
                "author": "Jennifer Lee",
                "role": "Employee Relations Manager",
                "date": "10-19-2024",
                "time": "1:30 PM",
                "content": "Interviewed affected employees. All confirmed receiving inappropriate messages outside work hours. Content was personal in nature and made them uncomfortable. Clear violation of harassment policy."
            },
            {
                "author": "Alice Johnson",
                "role": "HR Specialist",
                "date": "10-21-2024",
                "time": "10:00 AM",
                "content": "Confronted manager with evidence. Initially defensive but eventually acknowledged inappropriate behavior. Claims it was 'friendly' communication but admits it crossed professional boundaries."
            },
            {
                "author": "David Kim",
                "role": "Sales Director",
                "date": "10-22-2024",
                "time": "3:45 PM",
                "content": "This manager has strong sales performance but this behavior is unacceptable. Team morale has been affected. Support disciplinary action and mandatory training on professional boundaries."
            },
            {
                "author": "Alice Johnson",
                "role": "HR Specialist",
                "date": "10-24-2024",
                "time": "11:30 AM",
                "content": "Resolution: Manager demoted from supervisory role and transferred to individual contributor position. Must complete harassment prevention training. Final written warning issued."
            }
        ],
        "resolution": "Manager demoted and transferred to non-supervisory role. Mandatory harassment prevention training completed. Final written warning with clear expectations for professional conduct."
    },
    {
        "id": "REQ-1013",
        "date": "10-06-2024",
        "category": "Conflict Resolution",
        "department": "Finance",
        "status": "Resolved",
        "assigned": {
            "name": "John Doe",
            "avatar": "https://i.pravatar.cc/40?img=1"
        },
        "incident_location": "Finance Department",
        "incident_time": "October 6, 2024, 10:45 AM",
        "evidence_attachments": "Meeting recordings, email correspondence",
        "reporter_anonymity": "Not Anonymous",
        "description": "A dispute arose between the finance team and accounting department regarding budget allocation procedures and reporting responsibilities. The disagreement led to delays in financial reporting and created confusion about departmental roles.",
        "comments": [
            {
                "author": "John Doe",
                "role": "HR Manager",
                "date": "10-07-2024",
                "time": "9:30 AM",
                "content": "Conflict escalation reported by department heads. Both teams claiming the other is not following proper procedures. This is affecting monthly reporting deadlines. Need immediate mediation."
            },
            {
                "author": "Susan Rodriguez",
                "role": "Organizational Development Specialist",
                "date": "10-08-2024",
                "time": "2:00 PM",
                "content": "Facilitated joint meeting between both departments. Root cause identified: unclear role definitions after recent organizational restructure. Both teams have valid concerns about overlapping responsibilities."
            },
            {
                "author": "John Doe",
                "role": "HR Manager",
                "date": "10-10-2024",
                "time": "11:15 AM",
                "content": "Working with department heads to clarify roles and responsibilities. Reviewing current job descriptions and process documentation to eliminate ambiguity."
            },
            {
                "author": "Carol Zhang",
                "role": "CFO",
                "date": "10-12-2024",
                "time": "4:30 PM",
                "content": "Approved revised process framework. Clear delineation of responsibilities established. Both departments agree to new procedures. Implementing trial period with weekly check-ins."
            },
            {
                "author": "John Doe",
                "role": "HR Manager",
                "date": "10-20-2024",
                "time": "10:00 AM",
                "content": "Two-week trial period successful. Both teams working collaboratively under new framework. Monthly reporting back on schedule. Conflict resolved through process improvement."
            }
        ],
        "resolution": "Organizational restructure clarified roles and responsibilities. New process framework implemented successfully. Both departments now working collaboratively with clear boundaries."
    },
    {
        "id": "REQ-1012",
        "date": "09-05-2024",
        "category": "Fraud",
        "department": "Operations",
        "status": "Resolved",
        "assigned": {
            "name": "Jane Smith",
            "avatar": "https://i.pravatar.cc/40?img=2"
        },
        "incident_location": "Warehouse",
        "incident_time": "September 5, 2024, 7:30 AM",
        "evidence_attachments": "Inventory records, surveillance video",
        "reporter_anonymity": "Full Anonymous",
        "description": "Inventory discrepancies were discovered during a routine audit, suggesting potential theft or fraudulent activity. Missing items and altered inventory records indicated systematic manipulation of stock levels over several months.",
        "comments": [
            {
                "author": "Jane Smith",
                "role": "HR Business Partner",
                "date": "09-06-2024",
                "time": "8:00 AM",
                "content": "Anonymous tip received about inventory irregularities. Audit team confirms significant discrepancies. This appears to be systematic fraud requiring immediate investigation and potential law enforcement involvement."
            },
            {
                "author": "Detective Mike Torres",
                "role": "Corporate Security",
                "date": "09-08-2024",
                "time": "1:00 PM",
                "content": "Surveillance footage review completed. Identified employee manipulating inventory counts and removing items after hours. Pattern of behavior over 4-month period. Criminal activity confirmed."
            },
            {
                "author": "Jane Smith",
                "role": "HR Business Partner",
                "date": "09-10-2024",
                "time": "10:30 AM",
                "content": "Employee confronted with evidence. Initially denied but when shown surveillance footage, confessed to theft. Claims financial hardship as motivation. Immediate termination recommended."
            },
            {
                "author": "Legal Department",
                "role": "Corporate Counsel",
                "date": "09-11-2024",
                "time": "3:15 PM",
                "content": "Criminal charges filed with local authorities. Employee terminated for cause. Implementing enhanced security measures and inventory controls to prevent future incidents."
            },
            {
                "author": "Jane Smith",
                "role": "HR Business Partner",
                "date": "09-15-2024",
                "time": "11:00 AM",
                "content": "Case closed. Employee terminated and criminal charges filed. Recovery of stolen items ongoing. New security protocols implemented in warehouse operations."
            }
        ],
        "resolution": "Employee terminated for theft and fraud. Criminal charges filed. Enhanced security measures and inventory controls implemented to prevent future incidents."
    },
    {
        "id": "REQ-1011",
        "date": "07-01-2024",
        "category": "Conflict Resolution",
        "department": "Finance",
        "status": "Resolved",
        "assigned": {
            "name": "Sarah Brown",
            "avatar": "https://i.pravatar.cc/40?img=4"
        },
        "incident_location": "Conference Room B",
        "incident_time": "July 1, 2024, 2:00 PM",
        "evidence_attachments": "Meeting minutes, performance reviews",
        "reporter_anonymity": "Not Anonymous",
        "description": "A conflict between team members regarding performance evaluation criteria and promotion opportunities escalated during a team meeting. The disagreement highlighted concerns about fairness in the evaluation process and career advancement policies.",
        "comments": [
            {
                "author": "Sarah Brown",
                "role": "HR Generalist",
                "date": "07-02-2024",
                "time": "9:15 AM",
                "content": "Team conflict reported following heated discussion about promotion criteria. Multiple team members feel evaluation process is unfair. Need to review current performance management system."
            },
            {
                "author": "Dr. Amanda Foster",
                "role": "Organizational Psychologist",
                "date": "07-05-2024",
                "time": "2:30 PM",
                "content": "Conducted individual interviews with all team members. Common concerns about transparency in promotion process and unclear advancement criteria. Recommend comprehensive review of performance evaluation system."
            },
            {
                "author": "Sarah Brown",
                "role": "HR Generalist",
                "date": "07-08-2024",
                "time": "11:00 AM",
                "content": "Working with management to revise performance evaluation criteria. Creating clear, measurable standards for promotion consideration. Implementing 360-degree feedback process for fairness."
            },
            {
                "author": "Thomas Wilson",
                "role": "Finance Director",
                "date": "07-12-2024",
                "time": "4:00 PM",
                "content": "New evaluation framework approved. Clear promotion criteria established with input from team members. Implementing quarterly review process with transparent feedback mechanisms."
            },
            {
                "author": "Sarah Brown",
                "role": "HR Generalist",
                "date": "07-20-2024",
                "time": "10:30 AM",
                "content": "New performance management system implemented successfully. Team members express satisfaction with transparent criteria. Conflict resolved through systemic improvement."
            }
        ],
        "resolution": "Performance evaluation system revised with transparent criteria and 360-degree feedback process. Team conflict resolved through systematic improvements to promotion policies."
    }
]

# Simulated staff data
staff_data = [
    {"id": 1, "name": "John Doe", "department": "Marketing", "avatar": "https://i.pravatar.cc/40?img=1"},
    {"id": 2, "name": "Jane Smith", "department": "Operations", "avatar": "https://i.pravatar.cc/40?img=2"},
    {"id": 3, "name": "Alice Johnson", "department": "Customer Service", "avatar": "https://i.pravatar.cc/40?img=3"},
    {"id": 4, "name": "Sarah Brown", "department": "IT Support", "avatar": "https://i.pravatar.cc/40?img=4"},
    {"id": 5, "name": "Michael Green", "department": "Operations", "avatar": "https://i.pravatar.cc/40?img=5"},
    {"id": 6, "name": "David Wilson", "department": "Finance", "avatar": "https://i.pravatar.cc/40?img=6"},
    {"id": 7, "name": "Emma Davis", "department": "HR", "avatar": "https://i.pravatar.cc/40?img=7"},
    {"id": 8, "name": "Robert Taylor", "department": "Sales", "avatar": "https://i.pravatar.cc/40?img=8"}
]

@app.route('/')
def index():
    return send_from_directory('.', '4_employee_sos.html')

@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('.', filename)

@app.route('/api/tickets')
def get_tickets():
    return jsonify(tickets_data)

@app.route('/api/tickets/<ticket_id>')
def get_ticket(ticket_id):
    ticket = next((t for t in tickets_data if t['id'] == ticket_id), None)
    if ticket:
        return jsonify(ticket)
    return jsonify({'error': 'Ticket not found'}), 404

@app.route('/api/staff')
def get_staff():
    return jsonify(staff_data)

@app.route('/api/tickets/<ticket_id>/assign', methods=['POST'])
def assign_ticket(ticket_id):
    data = request.get_json()
    staff_id = data.get('staff_id')
    
    ticket = next((t for t in tickets_data if t['id'] == ticket_id), None)
    staff = next((s for s in staff_data if s['id'] == staff_id), None)
    
    if not ticket:
        return jsonify({'error': 'Ticket not found'}), 404
    if not staff:
        return jsonify({'error': 'Staff not found'}), 404
    
    ticket['assigned'] = {
        'name': staff['name'],
        'avatar': staff['avatar']
    }
    
    # Add system comment
    comment = {
        'id': len(ticket['comments']) + 1,
        'author': 'System',
        'content': f'Ticket reassigned to {staff["name"]}',
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'type': 'system'
    }
    ticket['comments'].append(comment)
    
    return jsonify({'success': True, 'ticket': ticket})

@app.route('/api/tickets/<ticket_id>/status', methods=['POST'])
def update_status(ticket_id):
    data = request.get_json()
    new_status = data.get('status')
    
    ticket = next((t for t in tickets_data if t['id'] == ticket_id), None)
    if not ticket:
        return jsonify({'error': 'Ticket not found'}), 404
    
    old_status = ticket['status']
    ticket['status'] = new_status
    
    # Add system comment
    comment = {
        'id': len(ticket['comments']) + 1,
        'author': 'System',
        'content': f'Status updated from {old_status} to {new_status}',
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'type': 'system'
    }
    ticket['comments'].append(comment)
    
    return jsonify({'success': True, 'ticket': ticket})

@app.route('/api/tickets/<ticket_id>/comments', methods=['POST'])
def add_comment(ticket_id):
    data = request.get_json()
    content = data.get('content')
    author = data.get('author', 'Anonymous')
    
    ticket = next((t for t in tickets_data if t['id'] == ticket_id), None)
    if not ticket:
        return jsonify({'error': 'Ticket not found'}), 404
    
    # Initialize comments array if it doesn't exist
    if 'comments' not in ticket:
        ticket['comments'] = []
    
    comment = {
        'id': len(ticket['comments']) + 1,
        'author': author,
        'content': content,
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'type': 'user'
    }
    ticket['comments'].append(comment)
    
    return jsonify({'success': True, 'comment': comment})

@app.route('/api/tickets/<ticket_id>/evidence', methods=['POST'])
def request_evidence(ticket_id):
    ticket = next((t for t in tickets_data if t['id'] == ticket_id), None)
    if not ticket:
        return jsonify({'error': 'Ticket not found'}), 404
    
    # Initialize comments array if it doesn't exist
    if 'comments' not in ticket:
        ticket['comments'] = []
    
    comment = {
        'id': len(ticket['comments']) + 1,
        'author': 'System',
        'content': 'Additional evidence has been requested from the reporter',
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'type': 'system'
    }
    ticket['comments'].append(comment)
    
    return jsonify({'success': True, 'message': 'Evidence request sent'})

@app.route('/api/tickets/<ticket_id>/escalate', methods=['POST'])
def escalate_ticket(ticket_id):
    ticket = next((t for t in tickets_data if t['id'] == ticket_id), None)
    if not ticket:
        return jsonify({'error': 'Ticket not found'}), 404
    
    # Initialize comments array if it doesn't exist
    if 'comments' not in ticket:
        ticket['comments'] = []
    
    ticket['status'] = 'Escalated'
    
    comment = {
        'id': len(ticket['comments']) + 1,
        'author': 'System',
        'content': 'Ticket has been escalated to C-level management',
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'type': 'system'
    }
    ticket['comments'].append(comment)
    
    return jsonify({'success': True, 'ticket': ticket})

@app.route('/api/tickets/<ticket_id>/close', methods=['POST'])
def close_ticket(ticket_id):
    ticket = next((t for t in tickets_data if t['id'] == ticket_id), None)
    if not ticket:
        return jsonify({'error': 'Ticket not found'}), 404
    
    ticket['status'] = 'Resolved'
    
    # Initialize comments array if it doesn't exist
    if 'comments' not in ticket:
        ticket['comments'] = []
    
    comment = {
        'id': len(ticket['comments']) + 1,
        'author': 'System',
        'content': 'Ticket has been closed and marked as resolved',
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'type': 'system'
    }
    ticket['comments'].append(comment)
    
    return jsonify({'success': True, 'ticket': ticket})

@app.route('/api/tickets/<ticket_id>/action-plan/<int:plan_id>/execute', methods=['POST'])
def execute_action_plan(ticket_id, plan_id):
    ticket = next((t for t in tickets_data if t['id'] == ticket_id), None)
    if not ticket:
        return jsonify({'error': 'Ticket not found'}), 404
    
    plan = next((p for p in ticket['action_plans'] if p['id'] == plan_id), None)
    if not plan:
        return jsonify({'error': 'Action plan not found'}), 404
    
    plan['status'] = 'Executed'
    
    comment = {
        'id': len(ticket['comments']) + 1,
        'author': 'System',
        'content': f'Action plan "{plan["title"]}" has been executed',
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'type': 'system'
    }
    ticket['comments'].append(comment)
    
    return jsonify({'success': True, 'plan': plan})

if __name__ == '__main__':
    app.run(debug=True, port=5000)