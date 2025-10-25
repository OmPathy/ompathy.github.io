// Global variables
let currentTicket = null;
let staffMembers = [];

// API base URL
const API_BASE_URL = window.location.protocol === 'file:' 
    ? 'http://127.0.0.1:5000' 
    : '';

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

// Initialize page functionality
async function initializePage() {
    try {
        showLoading(true);
        
        // Get ticket ID from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const ticketId = urlParams.get('id');
        
        if (!ticketId) {
            showError('No ticket ID provided');
            return;
        }
        
        // Load ticket data and staff members
        await Promise.all([
            loadTicketData(ticketId),
            loadStaffMembers()
        ]);
        
        // Setup event listeners
        setupEventListeners();
        
        showLoading(false);
    } catch (error) {
        console.error('Error initializing page:', error);
        showError('Failed to load ticket details');
        showLoading(false);
    }
}

// Load ticket data from API
async function loadTicketData(ticketId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/tickets/${ticketId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        currentTicket = await response.json();
        displayTicketData(currentTicket);
        loadComments(ticketId);
    } catch (error) {
        console.error('Error loading ticket data:', error);
        throw error;
    }
}

// Load staff members for assignment dropdown
async function loadStaffMembers() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/staff`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        staffMembers = await response.json();
        populateAssigneeDropdown();
    } catch (error) {
        console.error('Error loading staff members:', error);
        // Use fallback data if API fails
        staffMembers = [
            { id: 1, name: 'John Doe', department: 'HR' },
            { id: 2, name: 'Jane Smith', department: 'Legal' },
            { id: 3, name: 'Mike Johnson', department: 'Management' },
            { id: 4, name: 'Sarah Wilson', department: 'IT' }
        ];
        populateAssigneeDropdown();
    }
}

// Display ticket data in the UI
function displayTicketData(ticket) {
    // Update basic details
    document.getElementById('request-id').textContent = ticket.id || 'N/A';
    document.getElementById('incident-location').textContent = ticket.location || 'N/A';
    document.getElementById('category').textContent = ticket.category || 'N/A';
    document.getElementById('incident-time').textContent = ticket.incident_time || 'N/A';
    document.getElementById('date-time').textContent = ticket.date || 'N/A';
    document.getElementById('evidence-attachments').textContent = ticket.evidence_attachments || 'N/A';
    document.getElementById('department').textContent = ticket.department || 'N/A';
    document.getElementById('reporter-anonymity').textContent = ticket.reporter_anonymity || 'N/A';
    document.getElementById('assigned-to').textContent = ticket.assigned?.name || 'Unassigned';
    
    // Update status with appropriate class
    const statusElement = document.getElementById('status');
    statusElement.textContent = ticket.status || 'Pending';
    statusElement.className = `status-badge ${getStatusClass(ticket.status)}`;
    
    // Update description
    document.getElementById('description').textContent = ticket.description || 'No description available';
    
    // Display resolution if ticket is resolved
    displayResolution(ticket);
    
    // Display action plans
    displayActionPlans(ticket.action_plans || []);
}

// Display resolution for resolved tickets
function displayResolution(ticket) {
    const resolutionSection = document.getElementById('resolution-section');
    const resolutionText = document.getElementById('resolution-text');
    
    if (ticket.status === 'Resolved' && ticket.resolution) {
        resolutionText.textContent = ticket.resolution;
        resolutionSection.style.display = 'block';
    } else {
        resolutionSection.style.display = 'none';
    }
}

// Display action plans
function displayActionPlans(actionPlans) {
    const container = document.getElementById('action-plans-list');
    
    if (!actionPlans || actionPlans.length === 0) {
        container.innerHTML = '<p class="text-center">No action plans available</p>';
        return;
    }
    
    container.innerHTML = actionPlans.map((plan, index) => `
        <div class="action-plan-item">
            <div class="plan-content">
                <span class="plan-text">
                    ${plan.title} - Expected Improvement: 
                    <span class="improvement-rate positive">${plan.improvement}</span> 
                    <span class="aes-tag">(AES)</span>
                </span>
                <button class="plan-btn" onclick="executePlan(${index})" ${plan.status === 'executed' ? 'disabled' : ''}>
                    ${plan.status === 'executed' ? 'Executed' : 'Plan It!'}
                </button>
            </div>
        </div>
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
    // Modal close events
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target.id);
        }
    });
    
    // Escape key to close modals
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal('assignModal');
            closeModal('statusModal');
            closeModal('escalateModal');
            closeModal('closeTicketModal');
            closeModal('executePlanModal');
        }
    });
}

// Populate assignee dropdown
function populateAssigneeDropdown() {
    const select = document.getElementById('assignee-select');
    select.innerHTML = '<option value="">Select an assignee...</option>';
    
    staffMembers.forEach(member => {
        const option = document.createElement('option');
        option.value = member.name;
        option.textContent = `${member.name} (${member.department})`;
        select.appendChild(option);
    });
}

// Load and display comments
async function loadComments(ticketId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/tickets/${ticketId}/comments`);
        
        if (response.ok) {
            const comments = await response.json();
            displayComments(comments);
        }
    } catch (error) {
        console.error('Error loading comments:', error);
    }
}

// Display comments
function displayComments(comments) {
    const container = document.getElementById('comments-list');
    
    if (!comments || comments.length === 0) {
        container.innerHTML = '<p class="text-center" style="color: #64748b; font-style: italic;">No comments yet</p>';
        return;
    }
    
    container.innerHTML = comments.map(comment => {
        // Handle different comment formats
        const timestamp = comment.timestamp || `${comment.date} ${comment.time}`;
        const role = comment.role ? ` (${comment.role})` : '';
        
        return `
            <div class="comment-item">
                <div class="comment-header">
                    <span class="comment-author">${comment.author}${role}</span>
                    <span class="comment-time">${formatDate(timestamp)}</span>
                </div>
                <div class="comment-content">${comment.content}</div>
            </div>
        `;
    }).join('');
}

// Add comment function
async function addComment() {
    const input = document.getElementById('comment-input');
    const content = input.value.trim();
    
    if (!content) {
        showError('Please enter a comment');
        return;
    }
    
    if (!currentTicket) {
        showError('No ticket loaded');
        return;
    }
    
    try {
        showLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/api/tickets/${currentTicket.id}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: content,
                author: 'Current User' // In a real app, this would come from authentication
            })
        });
        
        if (response.ok) {
            input.value = '';
            await loadComments(currentTicket.id);
            showNotification('Comment added successfully');
        } else {
            throw new Error('Failed to add comment');
        }
    } catch (error) {
        console.error('Error adding comment:', error);
        showError('Failed to add comment');
    } finally {
        showLoading(false);
    }
}

// Modal functions
function openAssignModal() {
    document.getElementById('assignModal').style.display = 'block';
}

function openStatusModal() {
    const select = document.getElementById('status-select');
    if (currentTicket) {
        select.value = currentTicket.status;
    }
    document.getElementById('statusModal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Confirm assignment
async function confirmAssignment() {
    const select = document.getElementById('assignee-select');
    const assignee = select.value;
    
    if (!assignee) {
        showError('Please select an assignee');
        return;
    }
    
    if (!currentTicket) {
        showError('No ticket loaded');
        return;
    }
    
    try {
        showLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/api/tickets/${currentTicket.id}/assign`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                assigned_to: assignee
            })
        });
        
        if (response.ok) {
            currentTicket.assigned = { name: assignee };
            document.getElementById('assigned-to').textContent = assignee;
            closeModal('assignModal');
            showNotification('Ticket assigned successfully');
            addSystemComment(`Ticket assigned to ${assignee}`);
        } else {
            throw new Error('Failed to assign ticket');
        }
    } catch (error) {
        console.error('Error assigning ticket:', error);
        showError('Failed to assign ticket');
    } finally {
        showLoading(false);
    }
}

// Confirm status update
async function confirmStatusUpdate() {
    const select = document.getElementById('status-select');
    const newStatus = select.value;
    
    if (!newStatus) {
        showError('Please select a status');
        return;
    }
    
    if (!currentTicket) {
        showError('No ticket loaded');
        return;
    }
    
    try {
        showLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/api/tickets/${currentTicket.id}/status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: newStatus
            })
        });
        
        if (response.ok) {
            currentTicket.status = newStatus;
            const statusElement = document.getElementById('status');
            statusElement.textContent = newStatus;
            statusElement.className = `status-badge ${getStatusClass(newStatus)}`;
            closeModal('statusModal');
            showNotification('Status updated successfully');
            addSystemComment(`Status updated to ${newStatus}`);
        } else {
            throw new Error('Failed to update status');
        }
    } catch (error) {
        console.error('Error updating status:', error);
        showError('Failed to update status');
    } finally {
        showLoading(false);
    }
}

// Request evidence
async function requestEvidence() {
    if (!currentTicket) {
        showError('No ticket loaded');
        return;
    }
    
    try {
        showLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/api/tickets/${currentTicket.id}/evidence`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            showNotification('Evidence request sent successfully');
            addSystemComment('Additional evidence requested');
        } else {
            throw new Error('Failed to request evidence');
        }
    } catch (error) {
        console.error('Error requesting evidence:', error);
        showError('Failed to request evidence');
    } finally {
        showLoading(false);
    }
}

// Escalate ticket
function escalateTicket() {
    if (!currentTicket) {
        showError('No ticket loaded');
        return;
    }
    
    // Open escalate confirmation modal
    document.getElementById('escalateModal').style.display = 'block';
}

async function confirmEscalate() {
    // Close the modal
    closeModal('escalateModal');
    
    try {
        showLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/api/tickets/${currentTicket.id}/escalate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            showNotification('Ticket escalated to C-level management');
            addSystemComment('Ticket escalated to C-level management');
        } else {
            throw new Error('Failed to escalate ticket');
        }
    } catch (error) {
        console.error('Error escalating ticket:', error);
        showError('Failed to escalate ticket');
    } finally {
        showLoading(false);
    }
}

// Close ticket
async function closeTicket() {
    if (!currentTicket) {
        showError('No ticket loaded');
        return;
    }
    
    // Open close ticket confirmation modal
    document.getElementById('closeTicketModal').style.display = 'block';
}

async function confirmCloseTicket() {
    // Close the modal
    closeModal('closeTicketModal');
    
    try {
        showLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/api/tickets/${currentTicket.id}/close`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            currentTicket.status = 'Closed';
            const statusElement = document.getElementById('status');
            statusElement.textContent = 'Closed';
            statusElement.className = 'status-badge closed';
            showNotification('Ticket closed successfully');
            addSystemComment('Ticket closed');
        } else {
            throw new Error('Failed to close ticket');
        }
    } catch (error) {
        console.error('Error closing ticket:', error);
        showError('Failed to close ticket');
    } finally {
        showLoading(false);
    }
}

// Execute action plan
async function executePlan(planIndex) {
    if (!currentTicket || !currentTicket.action_plans || !currentTicket.action_plans[planIndex]) {
        showError('Action plan not found');
        return;
    }
    
    const plan = currentTicket.action_plans[planIndex];
    
    // Set the plan title in the modal and open it
    document.getElementById('executePlanMessage').textContent = `Are you sure you want to execute: ${plan.title}?`;
    document.getElementById('executePlanModal').style.display = 'block';
    
    // Store the plan index for later use
    window.currentPlanIndex = planIndex;
}

async function confirmExecutePlan() {
    // Close the modal
    closeModal('executePlanModal');
    
    const planIndex = window.currentPlanIndex;
    if (planIndex === undefined) {
        showError('Plan index not found');
        return;
    }
    
    try {
        showLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/api/tickets/${currentTicket.id}/action-plans/${planIndex}/execute`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            plan.status = 'executed';
            displayActionPlans(currentTicket.action_plans);
            showNotification('Action plan executed successfully');
            addSystemComment(`Action plan executed: ${plan.title}`);
        } else {
            throw new Error('Failed to execute action plan');
        }
    } catch (error) {
        console.error('Error executing action plan:', error);
        showError('Failed to execute action plan');
    } finally {
        showLoading(false);
    }
}

// Add system comment
async function addSystemComment(message) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/tickets/${currentTicket.id}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: message,
                author: 'System'
            })
        });
        
        if (response.ok) {
            await loadComments(currentTicket.id);
        }
    } catch (error) {
        console.error('Error adding system comment:', error);
    }
}

// Utility functions
function getStatusClass(status) {
    if (!status) return 'pending';
    
    const statusLower = status.toLowerCase();
    if (statusLower.includes('unopened')) return 'unopened';
    if (statusLower.includes('pending')) return 'pending';
    if (statusLower.includes('investigating')) return 'investigating';
    if (statusLower.includes('progress')) return 'in-progress';
    if (statusLower.includes('resolved')) return 'resolved';
    if (statusLower.includes('closed')) return 'closed';
    return 'pending';
}

function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleString();
    } catch (error) {
        return dateString;
    }
}

function showLoading(show) {
    const loading = document.getElementById('loading');
    loading.style.display = show ? 'flex' : 'none';
}

function showError(message) {
    // Create a custom error notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        border-left: 4px solid #dc2626;
    `;
    notification.textContent = `Error: ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000); // Show error messages longer than success messages
}

function showNotification(message) {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function goBack() {
    window.history.back();
}