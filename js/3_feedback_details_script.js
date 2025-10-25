// Feedback data with fixed avatar URLs
const feedbackData = {
    1: {
        title: "Doesn't Feel my hard work paid off",
        employee: {
            name: "Jacob Leroy",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=24&h=24&fit=crop&crop=face"
        },
        department: "Marketing",
        assignee: {
            name: "You",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=24&h=24&fit=crop&crop=face"
        },
        category: "Rewards & Recognition",
        priority: "Medium",
        answerBy: "02/17/2025",
        feedback: "I've been putting in extra hours, taking on additional responsibilities, and consistently meeting tight deadlines, yet I feel like my efforts are going unnoticed. I rarely receive recognition, and when it comes to promotions or bonuses, it seems like my hard work doesn't pay off. It's really demotivating to see others being acknowledged while my contributions are overlooked. I want to feel valued for what I bring to the team, but right now, it just feels like no matter how much effort I put in, it doesn't make a difference.",
        actionPlan: [
            {
                title: "Recognition Improvement:",
                description: "Implement a structured recognition program to ensure employees' contributions are acknowledged regularly."
            },
            {
                title: "Performance Review Transparency:",
                description: "Provide clear feedback on career growth opportunities and performance evaluation criteria."
            },
            {
                title: "One-on-One Discussion:",
                description: "Encourage managers to have open conversations with employees about their concerns and career progression."
            }
        ]
    },
    2: {
        title: "Facing challenges in aligning with team goals",
        employee: {
            name: "Michael Johnson",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=24&h=24&fit=crop&crop=face"
        },
        department: "IT",
        assignee: {
            name: "You",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=24&h=24&fit=crop&crop=face"
        },
        category: "Team Goals & Alignment",
        priority: "High",
        answerBy: "02/15/2025",
        feedback: "I'm finding it difficult to understand how my individual tasks contribute to the broader team objectives. The goals seem to change frequently, and communication about priorities isn't always clear. This makes it challenging to prioritize my work effectively and I often feel like I'm working in isolation rather than as part of a cohesive team effort.",
        actionPlan: [
            {
                title: "Goal Clarity Sessions:",
                description: "Conduct regular team meetings to clarify objectives and individual contributions to team goals."
            },
            {
                title: "Communication Framework:",
                description: "Establish clear communication channels for goal updates and priority changes."
            },
            {
                title: "Individual Alignment:",
                description: "Create personalized goal alignment plans for each team member."
            }
        ]
    },
    3: {
        title: "Seeking clearer feedback on performance metrics",
        employee: {
            name: "Emily Davis",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=24&h=24&fit=crop&crop=face"
        },
        department: "Marketing",
        assignee: {
            name: "You",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=24&h=24&fit=crop&crop=face"
        },
        category: "Performance Feedback & Metrics",
        priority: "Low",
        answerBy: "02/20/2025",
        feedback: "I would appreciate more specific and actionable feedback on my performance. Currently, the feedback I receive is quite general, and I'm not sure what specific areas I should focus on for improvement. Having clearer metrics and more frequent check-ins would help me understand my progress better.",
        actionPlan: [
            {
                title: "Performance Metrics Definition:",
                description: "Define clear, measurable performance indicators for each role."
            },
            {
                title: "Regular Check-ins:",
                description: "Implement bi-weekly performance review sessions with specific feedback."
            },
            {
                title: "Development Planning:",
                description: "Create individual development plans with actionable improvement steps."
            }
        ]
    },
    4: {
        title: "Want more opportunities for skill development",
        employee: {
            name: "Ethan Brown",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=24&h=24&fit=crop&crop=face"
        },
        department: "Operations",
        assignee: {
            name: "You",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=24&h=24&fit=crop&crop=face"
        },
        category: "Growth & Development",
        priority: "Medium",
        answerBy: "02/18/2025",
        feedback: "I'm eager to expand my skill set and take on new challenges, but I feel like there aren't enough opportunities for professional development in my current role. I'd love to attend training sessions, workshops, or even take on cross-functional projects that would help me grow professionally.",
        actionPlan: [
            {
                title: "Training Program Access:",
                description: "Provide access to relevant training programs and professional development courses."
            },
            {
                title: "Cross-functional Projects:",
                description: "Create opportunities for employees to work on projects outside their primary role."
            },
            {
                title: "Mentorship Program:",
                description: "Establish a mentorship program to support career development."
            }
        ]
    },
    5: {
        title: "Struggling with team communication issues",
        employee: {
            name: "Mia Anderson",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=24&h=24&fit=crop&crop=face"
        },
        department: "Design",
        assignee: {
            name: "You",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=24&h=24&fit=crop&crop=face"
        },
        category: "Communication & Collaboration",
        priority: "High",
        answerBy: "02/14/2025",
        feedback: "There are significant communication gaps within our team that are affecting project delivery and team morale. Information doesn't flow effectively between team members, and there's often confusion about responsibilities and deadlines. We need better communication tools and processes.",
        actionPlan: [
            {
                title: "Communication Tools:",
                description: "Implement better communication platforms and establish communication protocols."
            },
            {
                title: "Team Building:",
                description: "Organize team building activities to improve interpersonal relationships."
            },
            {
                title: "Process Improvement:",
                description: "Review and improve existing communication processes and workflows."
            }
        ]
    },
    6: {
        title: "Desire for better work-life balance policies",
        employee: {
            name: "Daniel Taylor",
            avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=24&h=24&fit=crop&crop=face"
        },
        department: "Finance",
        assignee: {
            name: "You",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=24&h=24&fit=crop&crop=face"
        },
        category: "Work-Life Balance",
        priority: "Medium",
        answerBy: "02/19/2025",
        feedback: "The current work-life balance policies don't adequately support employees' personal needs. Long working hours and limited flexibility make it difficult to maintain a healthy balance between work and personal life. More flexible working arrangements would greatly improve job satisfaction.",
        actionPlan: [
            {
                title: "Flexible Work Arrangements:",
                description: "Implement flexible working hours and remote work options where possible."
            },
            {
                title: "Policy Review:",
                description: "Review and update work-life balance policies to better support employee needs."
            },
            {
                title: "Wellness Programs:",
                description: "Introduce wellness programs and mental health support initiatives."
            }
        ]
    }
};

// DOM elements
const feedbackItems = document.querySelectorAll('.feedback-item');
const feedbackDetail = document.getElementById('feedback-detail');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Add click event listeners to feedback items
    feedbackItems.forEach(item => {
        item.addEventListener('click', function() {
            const feedbackId = this.getAttribute('data-id');
            selectFeedback(feedbackId);
        });
    });
    
    // Load the first feedback by default
    selectFeedback('1');
});

// Function to select a feedback item
function selectFeedback(feedbackId) {
    // Remove active class from all items and add dimmed class
    feedbackItems.forEach(item => {
        item.classList.remove('active');
        item.classList.add('dimmed');
    });
    
    // Add active class to selected item and remove dimmed class
    const selectedItem = document.querySelector(`[data-id="${feedbackId}"]`);
    if (selectedItem) {
        selectedItem.classList.add('active');
        selectedItem.classList.remove('dimmed');
    }
    
    // Update the detail view
    updateDetailView(feedbackId);
}

// Function to update the detail view
function updateDetailView(feedbackId) {
    const feedback = feedbackData[feedbackId];
    if (!feedback) return;
    
    const priorityClass = feedback.priority.toLowerCase();
    
    feedbackDetail.innerHTML = `
        <h2 class="detail-title">${feedback.title}</h2>
        
        <div class="detail-info">
            <div class="info-row">
                <span class="label">Employee</span>
                <div class="employee-info">
                    <img src="${feedback.employee.avatar}" alt="${feedback.employee.name}" class="employee-avatar">
                    <span>${feedback.employee.name}</span>
                </div>
            </div>
            <div class="info-row">
                <span class="label">Department</span>
                <span class="value">${feedback.department}</span>
            </div>
            <div class="info-row">
                <span class="label">Assignee</span>
                <div class="assignee-info">
                    <img src="${feedback.assignee.avatar}" alt="${feedback.assignee.name}" class="assignee-avatar">
                    <span>${feedback.assignee.name}</span>
                </div>
            </div>
            <div class="info-row">
                <span class="label">Category</span>
                <span class="value">${feedback.category}</span>
            </div>
            <div class="info-row">
                <span class="label">Priority Level</span>
                <span class="priority-badge ${priorityClass}">${feedback.priority}</span>
            </div>
            <div class="info-row">
                <span class="label">Answer by</span>
                <span class="value">${feedback.answerBy}</span>
            </div>
        </div>

        <div class="feedback-content">
            <h3>Feedback:</h3>
            <p class="feedback-text">${feedback.feedback}</p>
        </div>

        <div class="action-plan">
            <h3>👍 AI-Recommended Action Plan:</h3>
            ${feedback.actionPlan.map(action => `
                <div class="action-item">
                    <h4>${action.title}</h4>
                    <p>${action.description}</p>
                </div>
            `).join('')}
        </div>
    `;
}

// Add smooth scrolling for better UX
function smoothScrollToTop() {
    feedbackDetail.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Call smooth scroll when feedback changes
const originalSelectFeedback = selectFeedback;
selectFeedback = function(feedbackId) {
    originalSelectFeedback(feedbackId);
    smoothScrollToTop();
};