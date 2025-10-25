// API base URL
const API_BASE = window.location.origin;

// Global data storage
let employeesData = [];
let dashboardStats = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData();
    loadEmployeesData();
    setupEventListeners();
});

// Load dashboard statistics
async function loadDashboardData() {
    try {
        const response = await fetch(`${API_BASE}/api/dashboard-stats`);
        dashboardStats = await response.json();
        updateDashboardUI();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Use fallback data if API fails
        dashboardStats = getFallbackDashboardData();
        updateDashboardUI();
    }
}

// Load employees data
async function loadEmployeesData() {
    try {
        const response = await fetch(`${API_BASE}/api/employees`);
        employeesData = await response.json();
        renderEmployeeTable();
    } catch (error) {
        console.error('Error loading employees data:', error);
        // Use fallback data if API fails
        employeesData = getFallbackEmployeesData();
        renderEmployeeTable();
    }
}

// Update dashboard UI with loaded data
function updateDashboardUI() {
    // Update status cards
    updateStatusCards();
    // Update progress bar
    updateProgressBar();
    // Update feedback section
    updateFeedbackSection();
    // Update SOS section
    updateSOSSection();
    // Update needs attention list
    updateNeedsAttentionList();
}

// Update status cards
function updateStatusCards() {
    const statusCounts = dashboardStats.statusCounts;
    
    document.querySelector('.satisfied .status-number').textContent = statusCounts.satisfied;
    document.querySelector('.stable .status-number').textContent = statusCounts.stable;
    document.querySelector('.nurture .status-number').textContent = statusCounts.nurture;
    document.querySelector('.action-required .status-number').textContent = statusCounts.actionRequired;
}

// Update progress bar
function updateProgressBar() {
    const percentages = dashboardStats.statusPercentages;
    const progressLabels = document.querySelector('.progress-labels');
    
    progressLabels.innerHTML = `
        <span>${percentages.satisfied}%</span>
        <span>${percentages.stable}%</span>
        <span>${percentages.nurture}%</span>
        <span>${percentages.actionRequired}%</span>
    `;
}

// Update feedback section
function updateFeedbackSection() {
    const feedback = dashboardStats.totalFeedback;
    
    document.querySelector('.feedback-total').textContent = feedback.total;
    document.querySelector('.feedback-item.low .feedback-count').textContent = feedback.low;
    document.querySelector('.feedback-item.medium .feedback-count').textContent = feedback.medium;
    document.querySelector('.feedback-item.high .feedback-count').textContent = feedback.high;
}

// Update SOS section
function updateSOSSection() {
    const sos = dashboardStats.sosRequests;
    
    document.querySelector('.sos-total').textContent = sos.total;
    document.querySelector('.sos-item.resolved .sos-count').textContent = sos.resolved;
    document.querySelector('.sos-item.investigating .sos-count').textContent = sos.investigating;
    document.querySelector('.sos-item.unopened .sos-count').textContent = sos.unopened;
}

// Update needs attention list
function updateNeedsAttentionList() {
    const needsAttention = dashboardStats.needsAttention;
    const attentionList = document.querySelector('.attention-list');
    
    attentionList.innerHTML = needsAttention.map(employee => `
        <div class="attention-item">
            <div class="employee-info">
                <div class="employee-avatar">
                    <img src="${employee.avatar}" alt="${employee.name}">
                </div>
                <div class="employee-details">
                    <span class="employee-name">${employee.name}</span>
                    <span class="employee-dept">${employee.department}</span>
                </div>
            </div>
            <div class="action-plan">Action Plan</div>
        </div>
    `).join('');
}

// Render employee table
function renderEmployeeTable() {
    const tableBody = document.getElementById('employeeTableBody');
    
    tableBody.innerHTML = employeesData.map(employee => `
        <tr>
            <td>
                <div class="employee-cell">
                    <img src="${employee.avatar}" alt="${employee.name}">
                    <span class="employee-name">${employee.name}</span>
                </div>
            </td>
            <td>${employee.department}</td>
            <td>${employee.title}</td>
            <td>${employee.yearOfService}</td>
            <td>
                <span class="sentiment-score ${getSentimentClass(employee.sentimentScore)}">
                    ${employee.sentimentScore}
                </span>
            </td>
            <td>
                <span class="br-score">${employee.brScore}</span>
            </td>
            <td>
                <span class="response-rate">${employee.responseRate}</span>
            </td>
            <td>
                <button class="risk-badge ${getRiskClass(employee.riskLevel)} clickable-risk-badge" 
                        data-employee-id="${employee.id}" 
                        data-employee-name="${employee.name}"
                        data-risk-level="${employee.riskLevel}">
                    ${employee.riskLevel}
                </button>
            </td>
        </tr>
    `).join('');
    
    // Add event listeners to all risk badges
    setupRiskBadgeEventListeners();
}

// Get sentiment score class for color coding
function getSentimentClass(score) {
    if (score >= 70) return 'high';
    if (score >= 50) return 'medium';
    return 'low';
}

// Get risk level class for badge styling
function getRiskClass(riskLevel) {
    return riskLevel.toLowerCase().replace(' ', '-');
}

// Setup event listeners
function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Time selector
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Chart bar hover effects
    document.querySelectorAll('.chart-bar').forEach(bar => {
        bar.addEventListener('mouseenter', function() {
            const dept = this.getAttribute('data-dept');
            showTooltip(this, dept);
        });
        
        bar.addEventListener('mouseleave', function() {
            hideTooltip();
        });
     });
 }

// Show employee modal with dynamic data
function showEmployeeModal(employee) {
    const modal = document.getElementById('employeeModal');
    
    // Update modal content with employee data
    document.getElementById('modalEmployeeName').textContent = employee.name;
    document.getElementById('modalEmployeeDepartment').textContent = employee.department;
    document.getElementById('modalEmployeeTitle').textContent = employee.title;
    document.getElementById('modalEmployeeService').textContent = employee.yearOfService;
    document.getElementById('modalSentimentScore').textContent = employee.sentimentScore;
    document.getElementById('modalBRScore').textContent = employee.brScore;
    document.getElementById('modalResponseRate').textContent = employee.responseRate + '%';
    
    // Update risk level badge
    const riskBadge = document.getElementById('modalRiskLevel');
    riskBadge.textContent = employee.riskLevel;
    riskBadge.className = `risk-badge ${getRiskClass(employee.riskLevel)}`;
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Hide employee modal
function hideEmployeeModal() {
    const modal = document.getElementById('employeeModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Handle modal actions
function handleModalAction(action) {
    console.log('Modal action:', action);
    // You can implement specific actions here
    // For now, just close the modal
    hideEmployeeModal();
}

// Show tooltip for chart bars
function showTooltip(element, department) {
    const tooltip = document.createElement('div');
    tooltip.className = 'chart-tooltip';
    tooltip.textContent = department;
    tooltip.style.position = 'absolute';
    tooltip.style.background = '#1e293b';
    tooltip.style.color = 'white';
    tooltip.style.padding = '8px 12px';
    tooltip.style.borderRadius = '6px';
    tooltip.style.fontSize = '12px';
    tooltip.style.zIndex = '1000';
    tooltip.style.pointerEvents = 'none';
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = (rect.top - 40) + 'px';
    
    document.body.appendChild(tooltip);
}

// Hide tooltip
function hideTooltip() {
    const tooltip = document.querySelector('.chart-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Fallback data in case API is not available
function getFallbackDashboardData() {
    return {
        statusCounts: {
            satisfied: 78,
            stable: 152,
            nurture: 36,
            actionRequired: 14
        },
        statusPercentages: {
            satisfied: 27.9,
            stable: 54.3,
            nurture: 12.9,
            actionRequired: 5.0
        },
        totalFeedback: {
            total: 150,
            low: 45,
            medium: 67,
            high: 38
        },
        sosRequests: {
            total: 32,
            resolved: 2,
            investigating: 105,
            unopened: 7
        },
        needsAttention: [
            {
                name: "Mason Harris",
                department: "Finance",
                avatar: "https://via.placeholder.com/40x40/8B5CF6/FFFFFF?text=MH"
            },
            {
                name: "Olivia Mitchell",
                department: "Sales",
                avatar: "https://via.placeholder.com/40x40/8B5CF6/FFFFFF?text=OM"
            },
            {
                name: "Sophia Taylor",
                department: "Sales",
                avatar: "https://via.placeholder.com/40x40/8B5CF6/FFFFFF?text=ST"
            }
        ]
    };
}

function getFallbackEmployeesData() {
    return [
        {
            id: 1,
            name: "Ethan Carter",
            department: "Marketing",
            title: "Sr. Marketing Specialist",
            yearOfService: "2 yr 3 months",
            sentimentScore: 89,
            brScore: 40.6,
            responseRate: 92.3,
            riskLevel: "Satisfied",
            avatar: "https://via.placeholder.com/32x32/8B5CF6/FFFFFF?text=EC"
        },
        {
            id: 2,
            name: "Mason Harris",
            department: "Finance",
            title: "Financial Planner",
            yearOfService: "3 years",
            sentimentScore: 39,
            brScore: 69.5,
            responseRate: 65.7,
            riskLevel: "Action Required",
            avatar: "https://via.placeholder.com/32x32/8B5CF6/FFFFFF?text=MH"
        },
        {
            id: 3,
            name: "Chloe Bennett",
            department: "Data Science",
            title: "Data Scientist",
            yearOfService: "3 years 7 months",
            sentimentScore: 52,
            brScore: 71.5,
            responseRate: 90.2,
            riskLevel: "Nurture",
            avatar: "https://via.placeholder.com/32x32/8B5CF6/FFFFFF?text=CB"
        },
        {
            id: 4,
            name: "Sophie Turner",
            department: "Customer Service",
            title: "CE Manager",
            yearOfService: "1 year 10 months",
            sentimentScore: 40,
            brScore: 65.1,
            responseRate: 50.2,
            riskLevel: "Nurture",
            avatar: "https://via.placeholder.com/32x32/8B5CF6/FFFFFF?text=ST"
        },
        {
            id: 5,
            name: "James Anderson",
            department: "Dev Team",
            title: "Backend Developer",
            yearOfService: "3 years 2 months",
            sentimentScore: 81,
            brScore: 39.0,
            responseRate: 40.7,
            riskLevel: "Satisfied",
            avatar: "https://via.placeholder.com/32x32/8B5CF6/FFFFFF?text=JA"
        },
        {
            id: 6,
            name: "Olivia Mitchell",
            department: "Sales",
            title: "Sales Strategy Analyst",
            yearOfService: "2 years 5 months",
            sentimentScore: 32,
            brScore: 92.6,
            responseRate: 76.8,
            riskLevel: "Action Required",
            avatar: "https://via.placeholder.com/32x32/8B5CF6/FFFFFF?text=OM"
        },
        {
            id: 7,
            name: "William Scott",
            department: "R&D",
            title: "Innovation Manager",
            yearOfService: "1 year 7 months",
            sentimentScore: 70,
            brScore: 47.6,
            responseRate: 91.0,
            riskLevel: "Stable",
            avatar: "https://via.placeholder.com/32x32/8B5CF6/FFFFFF?text=WS"
        },
        {
            id: 8,
            name: "Mia Thompson",
            department: "Operations",
            title: "Supply Chain Coordinator",
            yearOfService: "2 years",
            sentimentScore: 82,
            brScore: 32.7,
            responseRate: 65.7,
            riskLevel: "Satisfied",
            avatar: "https://via.placeholder.com/32x32/8B5CF6/FFFFFF?text=MT"
        }
    ];
}

// Setup event listeners for risk badge buttons
function setupRiskBadgeEventListeners() {
    const riskBadges = document.querySelectorAll('.clickable-risk-badge');
    
    riskBadges.forEach(badge => {
        badge.addEventListener('click', function() {
            const employeeId = this.getAttribute('data-employee-id');
            const employeeName = this.getAttribute('data-employee-name');
            const riskLevel = this.getAttribute('data-risk-level');
            
            // Find the employee data
            const employee = employeesData.find(emp => emp.id == employeeId);
            
            if (employee) {
                // Show appropriate modal based on risk level
                switch (riskLevel) {
                    case "Action Required":
                        showActionRequiredModal(employee);
                        break;
                    case "Satisfied":
                        showSatisfiedModal(employee);
                        break;
                    case "Nurture":
                        showNurtureModal(employee);
                        break;
                    case "Stable":
                        showStableModal(employee);
                        break;
                    default:
                        // Fallback to regular employee modal
                        showEmployeeModal(employee);
                }
            }
        });
    });
}

// Show Action Required modal with employee data
function showActionRequiredModal(employee) {
    const modal = document.getElementById('actionRequiredModal');
    
    // Update modal content with employee data
    document.getElementById('actionModalEmployeeName').textContent = employee.name;
    
    // Calculate sentiment data (example calculation)
    const sentimentPercentage = Math.abs(100 - employee.sentimentScore);
    document.getElementById('actionModalSentiment').textContent = `${sentimentPercentage}% over past 7 days`;
    
    // Calculate SOS requests (example calculation based on employee data)
    const sosRequests = employee.brScore < 50 ? 1 : 0;
    document.getElementById('actionModalSOS').textContent = `${sosRequests} in last 7 days`;
    
    // Show modal
    modal.style.display = 'block';
    
    // Add event listeners for modal buttons
    setupActionModalEventListeners();
}

// Hide Action Required modal
function hideActionRequiredModal() {
    const modal = document.getElementById('actionRequiredModal');
    modal.style.display = 'none';
}

// Setup event listeners for Action Required modal buttons
function setupActionModalEventListeners() {
    const modal = document.getElementById('actionRequiredModal');
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            hideActionRequiredModal();
        }
    });
    
    // Handle button clicks
    const viewDetailsBtn = modal.querySelector('.view-details-btn');
    const assignActionBtn = modal.querySelector('.assign-action-btn');
    const markReviewedBtn = modal.querySelector('.mark-reviewed-btn');
    
    viewDetailsBtn.addEventListener('click', function() {
        console.log('View Details clicked');
        hideActionRequiredModal();
    });
    
    assignActionBtn.addEventListener('click', function() {
        console.log('Assign Action clicked');
        hideActionRequiredModal();
    });
    
    markReviewedBtn.addEventListener('click', function() {
        console.log('Mark as Reviewed clicked');
        hideActionRequiredModal();
    });
}

// Show Satisfied modal with employee data
function showSatisfiedModal(employee) {
    const modal = document.getElementById('satisfiedModal');
    
    // Update modal content with employee data
    document.getElementById('satisfiedModalEmployeeName').textContent = employee.name;
    document.getElementById('satisfiedModalSentiment').textContent = employee.sentimentScore;
    document.getElementById('satisfiedModalResponse').textContent = employee.responseRate + '%';
    document.getElementById('satisfiedModalBurnout').textContent = employee.brScore < 50 ? 'Low' : 'Moderate';
    
    // Show modal
    modal.style.display = 'block';
    
    // Add event listeners for modal buttons
    setupSatisfiedModalEventListeners();
}

// Hide Satisfied modal
function hideSatisfiedModal() {
    const modal = document.getElementById('satisfiedModal');
    modal.style.display = 'none';
}

// Setup event listeners for Satisfied modal buttons
function setupSatisfiedModalEventListeners() {
    const modal = document.getElementById('satisfiedModal');
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            hideSatisfiedModal();
        }
    });
    
    // Handle button clicks
    const viewDetailsBtn = modal.querySelector('.view-details-btn');
    const scheduleCheckinBtn = modal.querySelector('.schedule-checkin-btn');
    const closeModalBtn = modal.querySelector('.close-modal-btn');
    
    if (viewDetailsBtn) {
        viewDetailsBtn.addEventListener('click', function() {
            console.log('View Details clicked for Satisfied employee');
            hideSatisfiedModal();
        });
    }
    
    if (scheduleCheckinBtn) {
        scheduleCheckinBtn.addEventListener('click', function() {
            console.log('Schedule Check-in clicked');
            hideSatisfiedModal();
        });
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            hideSatisfiedModal();
        });
    }
}

// Show Nurture modal with employee data
function showNurtureModal(employee) {
    const modal = document.getElementById('nurtureModal');
    
    // Update modal content with employee data
    document.getElementById('nurtureModalEmployeeName').textContent = employee.name;
    document.getElementById('nurtureModalSentiment').textContent = employee.sentimentScore;
    document.getElementById('nurtureModalPotential').textContent = employee.sentimentScore < 60 ? 'High' : 'Moderate';
    document.getElementById('nurtureModalSupport').textContent = employee.brScore > 60 ? 'High' : 'Moderate';
    
    // Show modal
    modal.style.display = 'block';
    
    // Add event listeners for modal buttons
    setupNurtureModalEventListeners();
}

// Hide Nurture modal
function hideNurtureModal() {
    const modal = document.getElementById('nurtureModal');
    modal.style.display = 'none';
}

// Setup event listeners for Nurture modal buttons
function setupNurtureModalEventListeners() {
    const modal = document.getElementById('nurtureModal');
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            hideNurtureModal();
        }
    });
    
    // Handle button clicks
    const viewDetailsBtn = modal.querySelector('.view-details-btn');
    const assignMentorBtn = modal.querySelector('.assign-mentor-btn');
    const createPlanBtn = modal.querySelector('.create-plan-btn');
    
    if (viewDetailsBtn) {
        viewDetailsBtn.addEventListener('click', function() {
            console.log('View Details clicked for Nurture employee');
            hideNurtureModal();
        });
    }
    
    if (assignMentorBtn) {
        assignMentorBtn.addEventListener('click', function() {
            console.log('Assign Mentor clicked');
            hideNurtureModal();
        });
    }
    
    if (createPlanBtn) {
        createPlanBtn.addEventListener('click', function() {
            console.log('Create Development Plan clicked');
            hideNurtureModal();
        });
    }
}

// Show Stable modal with employee data
function showStableModal(employee) {
    const modal = document.getElementById('stableModal');
    
    // Update modal content with employee data
    document.getElementById('stableModalEmployeeName').textContent = employee.name;
    document.getElementById('stableModalSentiment').textContent = employee.sentimentScore;
    document.getElementById('stableModalConsistency').textContent = employee.responseRate > 80 ? 'Good' : 'Fair';
    document.getElementById('stableModalRisk').textContent = employee.brScore < 50 ? 'Low' : 'Moderate';
    
    // Show modal
    modal.style.display = 'block';
    
    // Add event listeners for modal buttons
    setupStableModalEventListeners();
}

// Hide Stable modal
function hideStableModal() {
    const modal = document.getElementById('stableModal');
    modal.style.display = 'none';
}

// Setup event listeners for Stable modal buttons
function setupStableModalEventListeners() {
    const modal = document.getElementById('stableModal');
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            hideStableModal();
        }
    });
    
    // Handle button clicks
    const viewDetailsBtn = modal.querySelector('.view-details-btn');
    const monitorBtn = modal.querySelector('.monitor-btn');
    const closeModalBtn = modal.querySelector('.close-modal-btn');
    
    if (viewDetailsBtn) {
        viewDetailsBtn.addEventListener('click', function() {
            console.log('View Details clicked for Stable employee');
            hideStableModal();
        });
    }
    
    if (monitorBtn) {
        monitorBtn.addEventListener('click', function() {
            console.log('Set Monitoring clicked');
            hideStableModal();
        });
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            hideStableModal();
        });
    }
}