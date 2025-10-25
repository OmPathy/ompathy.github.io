// AI Response Rules Management System
class RuleManager {
    constructor() {
        this.rules = this.loadRules();
        this.initializeEventListeners();
    }

    // Load rules from localStorage or use default data
    loadRules() {
        const savedRules = localStorage.getItem('aiResponseRules');
        if (savedRules) {
            return JSON.parse(savedRules);
        }
        
        // Default rules data matching the screenshot
        return [
            {
                id: 1,
                name: "Salary Inquiry Rule",
                keywords: '"salary"',
                response: '"Salary-related queries should be directed to HR."',
                created: "Feb 15, 2025, 10:00 AM",
                status: true,
                tone: "formal"
            },
            {
                id: 2,
                name: "Work Hours Rule",
                keywords: '"overtime, working hours"',
                response: '"Please refer to the overtime policy in the employee handbook."',
                created: "Jan 16, 2025, 09:30 AM",
                status: true,
                tone: "professional"
            },
            {
                id: 3,
                name: "Benefits Rule",
                keywords: '"benefits"',
                response: '"For benefits inquiries, please contact the HR department."',
                created: "Dec 21, 2024, 11:15 AM",
                status: true,
                tone: "friendly"
            },
            {
                id: 4,
                name: "Promotion Inquiry Rule",
                keywords: '"promotion"',
                response: '"Promotion questions should be discussed with your direct manager."',
                created: "Aug 10, 2024, 02:45 PM",
                status: true,
                tone: "professional"
            },
            {
                id: 5,
                name: "Performance Review Rule",
                keywords: '"performance"',
                response: '"Performance reviews are held quarterly. Please check with your manager for your next review date."',
                created: "Jul 11, 2024, 10:20 AM",
                status: false,
                tone: "formal"
            },
            {
                id: 6,
                name: "Leave Policy Rule",
                keywords: '"vacation"',
                response: '"Please refer to the employee handbook for vacation policy details."',
                created: "Apr 16, 2024, 08:00 AM",
                status: false,
                tone: "friendly"
            },
            {
                id: 7,
                name: "Expense Reimbursement Rule",
                keywords: '"expense"',
                response: '"Expense claims should be submitted through the company portal within 30 days."',
                created: "Feb 21, 2024, 01:30 PM",
                status: false,
                tone: "professional"
            },
            {
                id: 8,
                name: "Training Session Rule",
                keywords: '"Training, Workshop"',
                response: '"Please sign up for training sessions through the learning management system."',
                created: "Jan 26, 2024, 01:30 PM",
                status: false,
                tone: "casual"
            }
        ];
    }

    // Save rules to localStorage
    saveRules() {
        localStorage.setItem('aiResponseRules', JSON.stringify(this.rules));
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Toggle switch event listeners
        document.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox' && e.target.closest('.toggle-switch')) {
                this.handleToggleChange(e.target);
            }
        });

        // Notification icon click handlers
        document.querySelectorAll('.notification-icon').forEach(icon => {
            icon.addEventListener('click', () => {
                // Icon clicked - no notification needed
            });
        });

        // User avatar click handler
        document.querySelector('.user-avatar').addEventListener('click', () => {
            // User avatar clicked - no notification needed
        });
    }

    // Handle toggle switch changes
    handleToggleChange(toggleInput) {
        const row = toggleInput.closest('tr');
        const ruleNameCell = row.querySelector('td:first-child');
        const ruleName = ruleNameCell.textContent.trim();
        
        // Find the rule and update its status
        const rule = this.rules.find(r => r.name === ruleName);
        if (rule) {
            rule.status = toggleInput.checked;
            this.saveRules();
            
            // Add visual feedback to the row
            row.style.transition = 'background-color 0.3s ease';
            row.style.backgroundColor = toggleInput.checked ? '#e8f5e8' : '#ffe8e8';
            setTimeout(() => {
                row.style.backgroundColor = '';
            }, 1000);
        }
    }

    // Show notification message
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification-popup';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #4CAF50;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            font-size: 14px;
            font-weight: 500;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Add new rule
    addRule(ruleData) {
        const newRule = {
            id: Math.max(...this.rules.map(r => r.id)) + 1,
            ...ruleData,
            created: new Date().toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }),
            status: true
        };
        
        this.rules.unshift(newRule);
        this.saveRules();
        this.refreshTable();
    }

    // Refresh the table display
    refreshTable() {
        const tbody = document.querySelector('.rules-table tbody');
        tbody.innerHTML = '';
        
        this.rules.forEach(rule => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${rule.name}</td>
                <td>${rule.keywords}</td>
                <td>${rule.response}</td>
                <td>${rule.created}</td>
                <td>
                    <label class="toggle-switch">
                        <input type="checkbox" ${rule.status ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
}

// Modal control functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    // Clear form fields when closing add rule modal
    if (modalId === 'addRuleModal') {
        document.getElementById('ruleName').value = '';
        document.getElementById('ruleKeywords').value = '';
        document.getElementById('ruleResponse').value = '';
    }
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Global functions for button clicks
function addNewRule() {
    openModal('addRuleModal');
}

function saveNewRule() {
    const ruleName = document.getElementById('ruleName').value.trim();
    const keywords = document.getElementById('ruleKeywords').value.trim();
    const response = document.getElementById('ruleResponse').value.trim();
    
    if (!ruleName) {
        alert('Please enter a rule name');
        return;
    }
    
    if (!keywords) {
        alert('Please enter keywords');
        return;
    }
    
    if (!response) {
        alert('Please enter a predefined response');
        return;
    }
    
    ruleManager.addRule({
        name: ruleName,
        keywords: `"${keywords}"`,
        response: `"${response}"`
    });
    
    closeModal('addRuleModal');
}

function showRuleList() {
    const activeRules = ruleManager.rules.filter(rule => rule.status);
    const inactiveRules = ruleManager.rules.filter(rule => !rule.status);
    
    // Create the content for the modal
    let content = `
        <div class="rule-stats">
            <div class="stat-item">
                <span class="stat-number">${activeRules.length}</span>
                <span class="stat-label">Active Rules</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${inactiveRules.length}</span>
                <span class="stat-label">Inactive Rules</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${activeRules.length + inactiveRules.length}</span>
                <span class="stat-label">Total Rules</span>
            </div>
        </div>
    `;
    
    if (activeRules.length > 0) {
        content += `
            <div class="rule-section">
                <h4>Active Rules</h4>
        `;
        activeRules.forEach(rule => {
            content += `<div class="rule-item">${rule.name}</div>`;
        });
        content += `</div>`;
    }
    
    if (inactiveRules.length > 0) {
        content += `
            <div class="rule-section">
                <h4>Inactive Rules</h4>
        `;
        inactiveRules.forEach(rule => {
            content += `<div class="rule-item">${rule.name}</div>`;
        });
        content += `</div>`;
    }
    
    if (activeRules.length === 0 && inactiveRules.length === 0) {
        content += `
            <div class="rule-section">
                <p style="text-align: center; color: #666; font-style: italic;">No rules found. Click "Add New Rule" to create your first rule.</p>
            </div>
        `;
    }
    
    // Set the content and open the modal
    document.getElementById('ruleListContent').innerHTML = content;
    openModal('ruleListModal');
}

// Initialize the rule manager when the page loads
let ruleManager;
document.addEventListener('DOMContentLoaded', () => {
    ruleManager = new RuleManager();
    
    // Add some interactive effects
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0)';
        });
    });
    
    // Add click effects to table rows and edit functionality
    addTableRowClickHandlers();
});

// Add some keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        addNewRule();
    }
    
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        showRuleList();
    }
});

// Global variable to store the currently editing rule index
let currentEditingRuleIndex = -1;

// Function to add click handlers to table rows for editing
function addTableRowClickHandlers() {
    document.querySelectorAll('.rules-table tbody tr').forEach((row, index) => {
        row.addEventListener('click', (e) => {
            if (!e.target.closest('.toggle-switch')) {
                // Visual feedback
                row.style.backgroundColor = '#f0f8ff';
                setTimeout(() => {
                    row.style.backgroundColor = '';
                }, 200);
                
                // Open edit modal
                editRule(index);
            }
        });
    });
}

// Function to open edit rule modal with existing rule data
function editRule(ruleIndex) {
    const rules = ruleManager.rules;
    if (ruleIndex < 0 || ruleIndex >= rules.length) {
        console.error('Invalid rule index');
        return;
    }
    
    currentEditingRuleIndex = ruleIndex;
    const rule = rules[ruleIndex];
    
    // Populate form fields with existing rule data
    document.getElementById('editRuleTitle').value = rule.name || '';
    document.getElementById('editRuleKeywords').value = rule.keywords.replace(/"/g, '') || '';
    document.getElementById('editRuleResponse').value = rule.response.replace(/"/g, '') || '';
    document.getElementById('editResponseTone').value = rule.tone || 'formal';
    
    // Update preview
    updateRulePreview();
    
    // Open the modal
    openModal('editRuleModal');
}

// Function to update the rule preview
function updateRulePreview() {
    const keywords = document.getElementById('editRuleKeywords').value;
    const response = document.getElementById('editRuleResponse').value;
    const tone = document.getElementById('editResponseTone').value;
    
    let previewText = '';
    if (keywords && response) {
        previewText = `If an employee asks, "${keywords}", then AI responds: "${response}"`;
        if (tone !== 'formal') {
            previewText += ` (${tone} tone)`;
        }
    } else {
        previewText = 'Enter keywords and response to see preview...';
    }
    
    document.getElementById('previewText').textContent = previewText;
}

// Function to save edited rule
function saveEditedRule() {
    const title = document.getElementById('editRuleTitle').value.trim();
    const keywords = document.getElementById('editRuleKeywords').value.trim();
    const response = document.getElementById('editRuleResponse').value.trim();
    const tone = document.getElementById('editResponseTone').value;
    
    // Validation
    if (!title) {
        alert('Please enter a rule title.');
        return;
    }
    
    if (!keywords) {
        alert('Please enter keywords/conditions.');
        return;
    }
    
    if (!response) {
        alert('Please enter a predefined response.');
        return;
    }
    
    // Update the rule
    if (currentEditingRuleIndex >= 0 && currentEditingRuleIndex < ruleManager.rules.length) {
        const updatedRule = {
            ...ruleManager.rules[currentEditingRuleIndex],
            name: title,
            keywords: `"${keywords}"`,
            response: `"${response}"`,
            tone: tone,
            lastModified: new Date().toISOString()
        };
        
        ruleManager.rules[currentEditingRuleIndex] = updatedRule;
        ruleManager.saveRules();
        ruleManager.refreshTable();
        
        // Re-add click handlers after table refresh
        setTimeout(addTableRowClickHandlers, 100);
        
        // Show success notification
        ruleManager.showNotification('Rule updated successfully!');
        
        // Close modal and reset
        closeModal('editRuleModal');
        currentEditingRuleIndex = -1;
        clearEditForm();
    }
}

// Function to clear edit form
function clearEditForm() {
    document.getElementById('editRuleTitle').value = '';
    document.getElementById('editRuleKeywords').value = '';
    document.getElementById('editRuleResponse').value = '';
    document.getElementById('editResponseTone').value = 'formal';
    document.getElementById('previewText').textContent = 'Enter keywords and response to see preview...';
}

// Add event listeners for real-time preview updates
document.addEventListener('DOMContentLoaded', () => {
    // Add input event listeners for preview updates
    const editInputs = ['editRuleKeywords', 'editRuleResponse', 'editResponseTone'];
    editInputs.forEach(inputId => {
        const element = document.getElementById(inputId);
        if (element) {
            element.addEventListener('input', updateRulePreview);
            element.addEventListener('change', updateRulePreview);
        }
    });
});