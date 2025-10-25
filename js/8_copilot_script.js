// Global variables
let chatMessages = [];
let isTyping = false;

// DOM elements
const chatMessagesContainer = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const reportModal = document.getElementById('reportModal');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeChat();
    setupEventListeners();
    createSentimentChart();
});

// Setup event listeners
function setupEventListeners() {
    // Auto-resize textarea
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 128) + 'px';
        
        // Enable/disable send button
        sendBtn.disabled = this.value.trim() === '';
    });

    // New chat button
    document.getElementById('newChatBtn').addEventListener('click', startNewChat);

    // Modal close events
    window.addEventListener('click', function(event) {
        if (event.target === reportModal) {
            closeModal();
        }
    });
}

// Initialize chat with example messages
function initializeChat() {
    // The example messages are already in HTML, so we don't need to add them programmatically
    scrollToBottom();
}

// Handle keyboard shortcuts
function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// Send message function
async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message || isTyping) return;

    // Add user message to chat
    addMessage(message, 'user');
    messageInput.value = '';
    messageInput.style.height = 'auto';
    sendBtn.disabled = true;

    // Show typing indicator
    showTypingIndicator();

    try {
        // Send message to backend
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                conversation_id: getCurrentConversationId()
            })
        });

        const data = await response.json();
        
        // Hide typing indicator
        hideTypingIndicator();

        if (data.success) {
            // Add assistant response
            addMessage(data.response, 'assistant', data.has_report ? data.report_data : null);
        } else {
            addMessage('Sorry, I cannot process your request right now. Please try again later.', 'assistant');
        }
    } catch (error) {
        console.error('Error sending message:', error);
        hideTypingIndicator();
        addMessage('Connection error, please check your network connection and try again.', 'assistant');
    }
}

// Add message to chat
function addMessage(content, sender, reportData = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<img src="static/images/jack-avatar.svg" alt="Jack" class="avatar-image">';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // Add assistant name header for assistant messages
    if (sender === 'assistant') {
        const headerDiv = document.createElement('div');
        headerDiv.className = 'message-header';
        headerDiv.innerHTML = '<span class="assistant-name">Jack (HR Copilot)</span>';
        contentDiv.appendChild(headerDiv);
    }
    
    const textP = document.createElement('p');
    textP.textContent = content;
    contentDiv.appendChild(textP);
    
    // Add report card if present
    if (reportData) {
        const reportCard = createReportCard(reportData);
        contentDiv.appendChild(reportCard);
    }
    
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    
    chatMessagesContainer.appendChild(messageDiv);
    scrollToBottom();
    
    // Add to messages array
    chatMessages.push({
        content: content,
        sender: sender,
        timestamp: new Date(),
        reportData: reportData
    });
}

// Create report card element
function createReportCard(reportData) {
    const reportCard = document.createElement('div');
    reportCard.className = 'report-card';
    reportCard.style.marginTop = '1rem';
    
    reportCard.innerHTML = `
        <div class="report-header">
            <h3>${reportData.title || 'Dynamic Report Viewer'}</h3>
            <div class="report-actions">
                <button class="btn-purple btn-small" onclick="previewReport()">
                    <i class="fas fa-eye"></i> Preview
                </button>
                <button class="btn-purple btn-small" onclick="downloadReport()">
                    <i class="fas fa-download"></i> Download
                </button>
                <button class="btn-purple btn-small" onclick="sendReport()">
                    <i class="fas fa-paper-plane"></i> Send
                </button>
            </div>
        </div>
        <div class="report-content">
            <div class="chart-placeholder">
                <i class="fas fa-chart-line"></i>
                <p>${reportData.description || 'Real-time charts and graphs showing overall and departmental sentiment data.'}</p>
            </div>
            <div class="insights">
                <h4>Actionable Insights</h4>
                <p>${reportData.insights || 'The Marketing department\'s average negative sentiment over the past month is 35%, with notable spikes on the 12th and 26th.'}</p>
            </div>
        </div>
    `;
    
    return reportCard;
}

// Show typing indicator
function showTypingIndicator() {
    if (isTyping) return;
    
    isTyping = true;
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message assistant-message';
    typingDiv.id = 'typing-indicator';
    
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <img src="static/images/jack-avatar.svg" alt="Jack" class="avatar-image">
        </div>
        <div class="message-content">
            <div class="message-header">
                <span class="assistant-name">Jack (HR Copilot)</span>
            </div>
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    
    chatMessagesContainer.appendChild(typingDiv);
    scrollToBottom();
}

// Hide typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
    isTyping = false;
}

// Scroll to bottom of chat
function scrollToBottom() {
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

// Start new chat
function startNewChat() {
    chatMessages = [];
    chatMessagesContainer.innerHTML = '';
    messageInput.value = '';
    messageInput.style.height = 'auto';
    sendBtn.disabled = true;
    
    // Add welcome message
    setTimeout(() => {
        addMessage('Hello! I am your AI assistant. I can help you generate reports, analyze data, or answer questions. What can I help you with?', 'assistant');
    }, 500);
}

// Get current conversation ID
function getCurrentConversationId() {
    // Generate or retrieve conversation ID
    let conversationId = sessionStorage.getItem('conversationId');
    if (!conversationId) {
        conversationId = 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('conversationId', conversationId);
    }
    return conversationId;
}

// Report functions
function previewReport() {
    reportModal.style.display = 'block';
    // Update chart if needed
    updateSentimentChart();
}

function downloadReport() {
    // Create a downloadable report
    const reportContent = generateReportContent();
    const blob = new Blob([reportContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentiment_report_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show success message
    showNotification('Report downloaded successfully!', 'success');
}

async function sendReport() {
    try {
        const response = await fetch('/api/send-report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                report_type: 'sentiment_analysis',
                conversation_id: getCurrentConversationId()
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('Report sent successfully!', 'success');
        } else {
            showNotification('Send failed, please try again.', 'error');
        }
    } catch (error) {
        console.error('Error sending report:', error);
        showNotification('Send failed, please check your network connection.', 'error');
    }
}

function viewEmployeeSentiment() {
    // This would typically navigate to another page or open a modal
    showNotification('Employee sentiment page feature is under development...', 'info');
}

function closeModal() {
    reportModal.style.display = 'none';
}

// Generate report content for download
function generateReportContent() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sentiment Analysis Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 25px; }
        .highlight { background: #8b5cf6; color: white; padding: 2px 6px; border-radius: 3px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Marketing Department Sentiment Analysis Report</h1>
        <p>Generated Date: ${new Date().toLocaleDateString('en-US')}</p>
    </div>
    
    <div class="section">
        <h2>Executive Summary</h2>
        <p>The Marketing department's average negative sentiment over the past month is 35%, with notable spikes on the 12th and 26th. Key issues include workload overload and communication delays.</p>
    </div>
    
    <div class="section">
        <h2>Key Findings</h2>
        <ul>
            <li>Average negative sentiment: 35%</li>
            <li>Peak dates: 12th and 26th</li>
            <li>Main issues: Workload overload, communication delays</li>
        </ul>
    </div>
    
    <div class="section">
        <h2>Recommended Actions</h2>
        <ul>
            <li>Increase <span class="highlight">Team Meetings</span> frequency</li>
            <li>Conduct in-depth <span class="highlight">Feedback Survey</span></li>
            <li>Improve internal communication processes</li>
        </ul>
    </div>
</body>
</html>
    `;
}

// Create sentiment chart
function createSentimentChart() {
    const ctx = document.getElementById('sentimentChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Day 1', 'Day 5', 'Day 10', 'Day 12', 'Day 15', 'Day 20', 'Day 26', 'Day 30'],
            datasets: [{
                label: 'Negative Sentiment (%)',
                data: [25, 30, 28, 45, 32, 29, 42, 35],
                borderColor: '#8B5CF6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                tension: 0.4
            }, {
                label: 'Positive Sentiment (%)',
                data: [65, 60, 68, 45, 58, 62, 48, 55],
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Update sentiment chart
function updateSentimentChart() {
    // This would update the chart with new data
    createSentimentChart();
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 6px;
        color: white;
        font-weight: 500;
        z-index: 1001;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    switch(type) {
        case 'success':
            notification.style.background = '#10b981';
            break;
        case 'error':
            notification.style.background = '#ef4444';
            break;
        default:
            notification.style.background = '#8b5cf6';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for notifications
const notificationCSS = `
@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}
`;

const style = document.createElement('style');
style.textContent = notificationCSS;
document.head.appendChild(style);