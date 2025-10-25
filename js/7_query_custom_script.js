// DOM Elements
const questionBtns = document.querySelectorAll('.question-btn');
const departmentSelect = document.getElementById('department');
const triggerSelect = document.getElementById('trigger');
const chatInput = document.querySelector('.chat-input');
const sendBtn = document.querySelector('.send-btn');
const addBtn = document.querySelector('.add-btn');
const notificationIcons = document.querySelectorAll('.notification-icon');
const profileAvatar = document.querySelector('.profile-avatar');

// Question type selection functionality
questionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        questionBtns.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Get selected type
        const selectedType = btn.getAttribute('data-type');
        console.log('Selected question type:', selectedType);
        
        // Add visual feedback
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 150);
    });
});

// Dropdown change handlers
departmentSelect.addEventListener('change', (e) => {
    console.log('Department changed to:', e.target.value);
});

triggerSelect.addEventListener('change', (e) => {
    console.log('Trigger condition changed to:', e.target.value);
});

// Chat input functionality
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

sendBtn.addEventListener('click', sendMessage);

function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        console.log('Sending message:', message);
        
        // Add visual feedback
        sendBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            sendBtn.style.transform = 'scale(1)';
        }, 150);
        
        // Simulate message sending
        chatInput.value = '';
    }
}

// Add button functionality
addBtn.addEventListener('click', () => {
    console.log('Add button clicked');
    
    // Add visual feedback
    addBtn.style.transform = 'scale(0.9)';
    setTimeout(() => {
        addBtn.style.transform = 'scale(1)';
    }, 150);
});

// Notification icons functionality
notificationIcons.forEach((icon, index) => {
    icon.addEventListener('click', () => {
        console.log('Notification icon clicked:', index);
        
        // Add visual feedback
        icon.style.transform = 'scale(0.9)';
        setTimeout(() => {
            icon.style.transform = 'scale(1)';
        }, 150);
    });
});

// Profile avatar functionality
profileAvatar.addEventListener('click', () => {
    console.log('Profile avatar clicked');
    
    // Add visual feedback
    profileAvatar.style.transform = 'scale(0.9)';
    setTimeout(() => {
        profileAvatar.style.transform = 'scale(1)';
    }, 150);
});

// Notification system
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'toast-notification';
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #6c5ce7;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        font-size: 14px;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Form validation and data collection
function getFormData() {
    const selectedQuestionType = document.querySelector('.question-btn.active')?.getAttribute('data-type') || 'slider';
    
    return {
        department: departmentSelect.value,
        triggerCondition: triggerSelect.value,
        questionType: selectedQuestionType,
        timestamp: new Date().toISOString()
    };
}

// Initialize default state
document.addEventListener('DOMContentLoaded', () => {
    console.log('Chat Prompt Creator initialized');
    
    // Set default selections if needed
    if (!document.querySelector('.question-btn.active')) {
        const sliderBtn = document.querySelector('[data-type="slider"]');
        if (sliderBtn) {
            sliderBtn.classList.add('active');
        }
    }
    
    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('button, select, .notification-icon, .profile-avatar');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.cursor = 'pointer';
        });
    });
});

// Export form data function for potential backend integration
window.getChatPromptData = getFormData;