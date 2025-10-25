// Global state management
let templateData = {
    eventTrigger: 'calendar-deadline',
    questions: [
        {
            id: 1,
            text: 'How did the project timeline work out—did it feel rushed or balanced?',
            answerFormat: 'multiple-choice'
        },
        {
            id: 2,
            text: "What's one thing about the schedule you'd change now that the project is done?",
            answerFormat: 'descriptive'
        },
        {
            id: 3,
            text: 'How would you rate your overall job satisfaction? (1-5)',
            answerFormat: 'slider'
        }
    ],
    triggerEnabled: true,
    triggerDays: 1
};

// DOM elements
const eventTriggerSelect = document.getElementById('eventTrigger');
const addQuestionBtn = document.querySelector('.add-question-btn');
const saveBtn = document.querySelector('.save-btn');
const triggerCheckbox = document.getElementById('triggerTemplate');
const daysInput = document.querySelector('.days-input');
const previewList = document.querySelector('.preview-list');
const sidebarItems = document.querySelectorAll('.sidebar-item');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updatePreview();
    setupSidebarInteraction();
    setupNotificationInteraction();
    
    // Check backend availability
    checkBackendHealth().then(isAvailable => {
        if (isAvailable) {
            console.log('Backend is available');
        } else {
            console.log('Backend not available, using local storage fallback');
        }
    });
});

// Event listeners setup
function initializeEventListeners() {
    // Event trigger selector
    eventTriggerSelect.addEventListener('change', function() {
        templateData.eventTrigger = this.value;
        console.log('Event trigger changed to:', this.value);
    });

    // Add question button
    addQuestionBtn.addEventListener('click', addNewQuestion);

    // Save template button
    saveBtn.addEventListener('click', saveTemplate);

    // Trigger settings
    triggerCheckbox.addEventListener('change', function() {
        templateData.triggerEnabled = this.checked;
        console.log('Trigger enabled:', this.checked);
    });

    daysInput.addEventListener('change', function() {
        templateData.triggerDays = parseInt(this.value);
        console.log('Trigger days changed to:', this.value);
    });

    // Setup existing question interactions
    setupQuestionInteractions();
}

// Setup interactions for existing questions
function setupQuestionInteractions() {
    const questionItems = document.querySelectorAll('.question-item');
    
    questionItems.forEach((item, index) => {
        const input = item.querySelector('.question-input');
        const select = item.querySelector('.answer-format select');
        const deleteBtn = item.querySelector('.delete-btn');

        // Question text input
        input.addEventListener('input', function() {
            if (templateData.questions[index]) {
                templateData.questions[index].text = this.value;
                updatePreview();
            }
            // Remove example styling when user starts typing
            this.style.color = '#333';
            this.style.fontStyle = 'normal';
        });

        // Handle focus to show this is editable
        input.addEventListener('focus', function() {
            this.style.color = '#333';
            this.style.fontStyle = 'normal';
        });

        // Handle blur to restore example styling if empty
        input.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.style.color = '#999';
                this.style.fontStyle = 'italic';
            }
        });

        // Answer format select
        select.addEventListener('change', function() {
            if (templateData.questions[index]) {
                templateData.questions[index].answerFormat = this.value;
                console.log(`Question ${index + 1} answer format changed to:`, this.value);
            }
        });

        // Delete button
        deleteBtn.addEventListener('click', function() {
            deleteQuestion(index);
        });
    });
}

// Add new question
function addNewQuestion() {
    const newQuestion = {
        id: Date.now(),
        text: 'New question',
        answerFormat: 'multiple-choice'
    };

    templateData.questions.push(newQuestion);
    
    // Create new question HTML
    const questionHTML = createQuestionHTML(newQuestion, templateData.questions.length - 1);
    
    // Insert before the add button
    addQuestionBtn.parentNode.insertBefore(questionHTML, addQuestionBtn);
    
    // Setup interactions for the new question
    setupQuestionInteractions();
    
    // Update preview
    updatePreview();
    
    console.log('New question added:', newQuestion);
}

// Create question HTML element
function createQuestionHTML(question, index) {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-item';
    
    questionDiv.innerHTML = `
        <div class="question-content">
            <input type="text" class="question-input" value="${question.text}" placeholder="Enter question">
            <button class="delete-btn">🗑️</button>
        </div>
        <div class="answer-format">
            <label>Answer Format</label>
            <select>
                <option value="multiple-choice" ${question.answerFormat === 'multiple-choice' ? 'selected' : ''}>Multiple-Choice Questions</option>
                <option value="descriptive" ${question.answerFormat === 'descriptive' ? 'selected' : ''}>Descriptive Form Answers</option>
                <option value="slider" ${question.answerFormat === 'slider' ? 'selected' : ''}>Slider Scale Questions</option>
                <option value="text" ${question.answerFormat === 'text' ? 'selected' : ''}>Text Response</option>
                <option value="rating" ${question.answerFormat === 'rating' ? 'selected' : ''}>Rating Scale</option>
            </select>
        </div>
    `;
    
    return questionDiv;
}

// Delete question
function deleteQuestion(index) {
    if (templateData.questions.length <= 1) {
        alert('You must have at least one question.');
        return;
    }

    // Remove from data
    templateData.questions.splice(index, 1);
    
    // Remove from DOM
    const questionItems = document.querySelectorAll('.question-item');
    if (questionItems[index]) {
        questionItems[index].remove();
    }
    
    // Re-setup interactions for remaining questions
    setTimeout(() => {
        setupQuestionInteractions();
        updatePreview();
    }, 100);
    
    console.log('Question deleted at index:', index);
}

// Update preview pane
function updatePreview() {
    previewList.innerHTML = '';
    
    templateData.questions.forEach((question, index) => {
        const li = document.createElement('li');
        li.textContent = question.text;
        previewList.appendChild(li);
    });
}

// Setup sidebar interaction
function setupSidebarInteraction() {
    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            sidebarItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get the text content for logging
            const itemText = this.querySelector('span:last-child').textContent;
            console.log('Sidebar item selected:', itemText);
            
            // You could implement different template loading here
            // For now, we'll just log the selection
        });
    });
}

// Setup notification interaction
function setupNotificationInteraction() {
    const notificationIcons = document.querySelectorAll('.notification-icon');
    
    notificationIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const badge = this.querySelector('.badge');
            const count = badge ? badge.textContent : '0';
            alert(`You have ${count} notifications`);
        });
    });

    // User avatar click
    const userAvatar = document.querySelector('.user-avatar');
    userAvatar.addEventListener('click', function() {
        alert('User menu clicked');
    });
}

// Save template
async function saveTemplate() {
    // Validate template data
    if (templateData.questions.length === 0) {
        alert('Please add at least one question before saving.');
        return;
    }

    // Check if all questions have text
    const emptyQuestions = templateData.questions.filter(q => !q.text.trim());
    if (emptyQuestions.length > 0) {
        alert('Please fill in all question fields before saving.');
        return;
    }

    console.log('Saving template:', templateData);
    
    // Show saving state
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Saving...';
    saveBtn.disabled = true;
    
    try {
        // Send data to backend
        const savedTemplate = await sendToBackend(templateData);
        
        // Show success message
        saveBtn.textContent = 'Saved!';
        
        // Update template data with server response
        if (savedTemplate && savedTemplate.id) {
            templateData.id = savedTemplate.id;
        }
        
        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.disabled = false;
        }, 1500);
        
    } catch (error) {
        // Show error message
        saveBtn.textContent = 'Error!';
        alert('Failed to save template. Please try again.');
        
        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.disabled = false;
        }, 2000);
    }
}

// Backend API communication
const API_BASE_URL = 'http://localhost:3000/api';

async function sendToBackend(data) {
    try {
        console.log('Sending template data to backend:', JSON.stringify(data, null, 2));
        
        const response = await fetch(`${API_BASE_URL}/templates`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('Backend response: Template saved successfully with ID:', result.data.id);
            return result.data;
        } else {
            console.error('Backend error:', result.error);
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Failed to save template:', error);
        // Fallback to local storage if backend is not available
        localStorage.setItem('templateData', JSON.stringify(data));
        console.log('Template saved to local storage as fallback');
        throw error;
    }
}

// Load templates from backend
async function loadTemplates() {
    try {
        const response = await fetch(`${API_BASE_URL}/templates`);
        const result = await response.json();
        
        if (result.success) {
            console.log('Templates loaded from backend:', result.data);
            return result.data;
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Failed to load templates from backend:', error);
        // Fallback to local storage
        const localData = localStorage.getItem('templateData');
        if (localData) {
            console.log('Loading template from local storage as fallback');
            return [JSON.parse(localData)];
        }
        return [];
    }
}

// Check backend health
async function checkBackendHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const result = await response.json();
        return result.success;
    } catch (error) {
        console.warn('Backend is not available, using local storage fallback');
        return false;
    }
}

// Utility functions
function formatAnswerType(type) {
    const typeMap = {
        'multiple-choice': 'Multiple-Choice Questions',
        'descriptive': 'Descriptive Form Answers',
        'slider': 'Slider Scale Questions',
        'text': 'Text Response',
        'rating': 'Rating Scale'
    };
    return typeMap[type] || type;
}

// Export functions for potential external use
window.TemplateBuilder = {
    getTemplateData: () => templateData,
    setTemplateData: (data) => {
        templateData = data;
        updatePreview();
    },
    addQuestion: addNewQuestion,
    saveTemplate: saveTemplate
};

// Handle form submission prevention
document.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('Form submission prevented - using custom save logic');
});

// Handle keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+S to save
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveTemplate();
    }
    
    // Ctrl+N to add new question
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        addNewQuestion();
    }
});

console.log('Template Builder initialized successfully');