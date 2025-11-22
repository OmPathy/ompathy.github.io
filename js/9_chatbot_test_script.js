// Global variables
let currentChat = null;
const API_BASE_URL = 'YOUR_API_ENDPOINT_HERE'; // Legacy demo endpoint, not used now

// Coze API Config
const COZE_API_KEY = 'pat_PnBc5GldcFkUsQAoREIIu3eUd8lUvQuTgphV7ZTa9ZuFHrdWb7HcgxkV5SSItbQU';
const COZE_JENNIE_BOT_ID = '7558009309167599633';
const COZE_JACK_BOT_ID = '7539058866902810641';
const COZE_API_URL = 'https://api.coze.com/v1/';

// Notification states for each chat
let notificationStates = {
    jennie: true,  // true = on (🔔), false = off (🔕)
    jack: true
};

// Chat selection functionality
function selectChat(chatType) {
    currentChat = chatType;
    document.getElementById('selection-screen').style.display = 'none';
    document.getElementById(`${chatType}-chat`).style.display = 'flex';
}

// Go back to selection screen
function goBack() {
    document.getElementById('selection-screen').style.display = 'block';
    if (currentChat) {
        document.getElementById(`${currentChat}-chat`).style.display = 'none';
    }
    currentChat = null;
}

// Toggle notification state
function toggleNotification(chatType) {
    // Toggle the state
    notificationStates[chatType] = !notificationStates[chatType];
    
    // Get the button element
    const button = document.getElementById(`${chatType}-notification-btn`);
    
    // Update the button icon based on the new state
    if (notificationStates[chatType]) {
        button.textContent = '🔔';  // Notification on
        console.log(`${chatType} notifications turned ON`);
    } else {
        button.textContent = '🔕';  // Notification off
        console.log(`${chatType} notifications turned OFF`);
    }
    
    // Optional: Save to localStorage for persistence
    localStorage.setItem('notificationStates', JSON.stringify(notificationStates));
}

// Send message functionality
function sendMessage(chatType) {
    const inputId = `${chatType}-input`;
    const messagesId = `${chatType}-messages`;
    const input = document.getElementById(inputId);
    const messagesContainer = document.getElementById(messagesId);
    
    const messageText = input.value.trim();
    if (!messageText) return;
    
    // Add user message to chat
    addMessage(messagesContainer, messageText, 'user');
    
    // Clear input
    input.value = '';
    
    // Show typing indicator (optional)
    showTypingIndicator(messagesContainer, chatType);
    
    // Send to API and get response
    sendToAPI(messageText, chatType, messagesContainer);
}

// Add message to chat
function addMessage(container, text, sender, isTyping = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender === 'user' ? 'user-message' : `${currentChat}-message`}`;
    
    if (isTyping) {
        messageDiv.classList.add('typing-indicator');
    }
    
    const avatarSvg = getAvatarSvg(sender);
    
    messageDiv.innerHTML = `
        <div class="avatar ${sender === 'user' ? 'user-avatar' : `${currentChat}-avatar`}">
            ${avatarSvg}
        </div>
        <div class="message-content">
            ${isTyping ? 'Typing...' : text}
        </div>
    `;
    
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
    
    return messageDiv;
}

// Get avatar image based on sender
function getAvatarSvg(sender) {
    if (sender === 'user') {
        return `
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="15" cy="15" r="15" fill="#6B7280"/>
                <circle cx="15" cy="11" r="4" fill="white"/>
                <path d="M7 22c0-4.418 3.582-8 8-8s8 3.582 8 8" fill="white"/>
            </svg>
        `;
    } else if (currentChat === 'jennie') {
        return `<img src="images/jennie.png" alt="Jennie Avatar" width="30" height="30">`;
    } else if (currentChat === 'jack') {
        return `<img src="images/jack.png" alt="Jack Avatar" width="30" height="30">`;
    } else {
        return `
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="15" cy="15" r="15" fill="#8B5CF6"/>
                <circle cx="15" cy="11" r="4" fill="white"/>
                <path d="M7 22c0-4.418 3.582-8 8-8s8 3.582 8 8" fill="white"/>
            </svg>
        `;
    }
}

// Show typing indicator
function showTypingIndicator(container, chatType) {
    const typingMessage = addMessage(container, '', chatType, true);
    return typingMessage;
}

// Remove typing indicator
function removeTypingIndicator(container) {
    const typingIndicator = container.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Coze API call helper
async function callCozeAPI(message, chatType, userId = 'demo-user') {
    const botId = chatType === 'jack' ? COZE_JACK_BOT_ID : COZE_JENNIE_BOT_ID;

    const payload = {
        bot_id: botId,
        user_id: userId,
        query: message
        // 필요하다면 여기 stream 옵션이나 기타 옵션 추가
    };

    const res = await fetch(COZE_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${COZE_API_KEY}`
        },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        console.error('Coze API error status:', res.status);
        const text = await res.text().catch(() => '');
        console.error('Coze API error body:', text);
        throw new Error(`Coze API request failed: ${res.status}`);
    }

    const data = await res.json();

    // TODO: 여기 부분은 실제 Coze 응답 구조에 맞게 수정 필요
    // 아래는 안전한 기본 파싱 패턴
    let reply = '';

    // 예시 형태 1: data.answer
    if (typeof data.answer === 'string') {
        reply = data.answer;
    }
    // 예시 형태 2: data.data[0].content 또는 messages 배열 등
    else if (Array.isArray(data.data) && data.data.length > 0) {
        const first = data.data[0];
        if (typeof first.content === 'string') {
            reply = first.content;
        } else if (Array.isArray(first.content) && first.content.length > 0) {
            const textItem = first.content.find(c => c.type === 'text' && c.text);
            if (textItem) {
                reply = textItem.text;
            }
        }
    }
    // 예시 형태 3: messages 배열에서 assistant 역할 찾기
    else if (Array.isArray(data.messages)) {
        const assistantMsg = data.messages.find(m => m.role === 'assistant' && typeof m.content === 'string');
        if (assistantMsg) {
            reply = assistantMsg.content;
        }
    }

    if (!reply) {
        reply = 'Sorry, I could not understand the response from the server.';
        console.warn('Coze API response format not fully handled:', data);
    }

    return reply;
}

// Send message to API
async function sendToAPI(message, chatType, messagesContainer, uploadData = null) {
    try {
        // Show typing indicator
        const typingIndicator = showTypingIndicator(messagesContainer, chatType);
        
        // 실제 Coze API 호출
        const response = await getAPIResponse(message, chatType, uploadData);
        
        // Remove typing indicator
        removeTypingIndicator(messagesContainer);
        
        // Add bot response
        addMessage(messagesContainer, response, chatType);
        
    } catch (error) {
        console.error('Error sending message to API:', error);
        removeTypingIndicator(messagesContainer);
        addMessage(messagesContainer, 'Sorry, I encountered an error. Please try again.', chatType);
    }
}

// Get API response (Coze 연동 버전)
async function getAPIResponse(message, chatType, uploadData = null) {
    // 현재는 텍스트만 Coze에 전달
    const userId = 'demo-user'; // 나중에 로그인 사용자 기준으로 바꿀 수 있음
    const reply = await callCozeAPI(message, chatType, userId);
    return reply;
}

// Generate report functionality (for Jack/HR)
function generateReport() {
    if (currentChat === 'jack') {
        const messagesContainer = document.getElementById('jack-messages');
        const reportText = `
📊 Employee Sentiment Report - IT Department

Current Status:
• Positive: 60%
• Neutral: 25% 
• Negative: 15%

Key Insights:
• Slight increase in negative sentiment over past 2 days
• Main concerns: workload management, project deadlines
• Recommendation: Schedule one-on-one meetings with team members

Generated on: ${new Date().toLocaleDateString()}
        `;
        
        addMessage(messagesContainer, reportText.trim(), 'jack');
    }
}

// Handle Enter key press in input fields and initialize notification states
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.chat-input input');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const chatType = this.id.replace('-input', '');
                sendMessage(chatType);
            }
        });
    });
    
    // Initialize notification states from localStorage
    initializeNotificationStates();
    
    // Initialize settings when page loads
    loadSettings();
});

// Initialize notification states from localStorage
function initializeNotificationStates() {
    const savedStates = localStorage.getItem('notificationStates');
    if (savedStates) {
        try {
            notificationStates = JSON.parse(savedStates);
        } catch (e) {
            console.log('Error parsing saved notification states, using defaults');
        }
    }
    
    // Update button icons based on current states
    Object.keys(notificationStates).forEach(chatType => {
        const button = document.getElementById(`${chatType}-notification-btn`);
        if (button) {
            button.textContent = notificationStates[chatType] ? '🔔' : '🔕';
        }
    });
}

// Settings Modal Functions
function openSettings() {
    const modal = document.getElementById('settings-modal');
    if (modal) {
        modal.style.display = 'flex';
        loadSettings();
    }
}

function closeSettings() {
    const modal = document.getElementById('settings-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('settings-modal');
    if (event.target === modal) {
        closeSettings();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeSettings();
    }
});

// Default settings
const defaultSettings = {
    responseSpeed: 'normal',
    messageLength: 'medium',
    conversationTone: 'professional',
    themeMode: 'light',
    fontSize: 'medium',
    typingIndicator: true,
    soundEffects: true,
    saveConversations: true,
    analytics: true
};

// Load settings from localStorage
function loadSettings() {
    try {
        const savedSettings = localStorage.getItem('chatbotSettings');
        const settings = savedSettings ? JSON.parse(savedSettings) : defaultSettings;
        
        // Apply settings to form elements
        document.getElementById('response-speed').value = settings.responseSpeed;
        document.getElementById('message-length').value = settings.messageLength;
        document.getElementById('conversation-tone').value = settings.conversationTone;
        document.getElementById('theme-mode').value = settings.themeMode;
        document.getElementById('font-size').value = settings.fontSize;
        document.getElementById('typing-indicator').checked = settings.typingIndicator;
        document.getElementById('sound-effects').checked = settings.soundEffects;
        document.getElementById('save-conversations').checked = settings.saveConversations;
        document.getElementById('analytics').checked = settings.analytics;
        
        // Apply theme and font size immediately
        applyTheme(settings.themeMode);
        applyFontSize(settings.fontSize);
        
    } catch (error) {
        console.error('Error loading settings:', error);
        // 오류 시 기본값 적용
        const settings = defaultSettings;
        document.getElementById('response-speed').value = settings.responseSpeed;
        document.getElementById('message-length').value = settings.messageLength;
        document.getElementById('conversation-tone').value = settings.conversationTone;
        document.getElementById('theme-mode').value = settings.themeMode;
        document.getElementById('font-size').value = settings.fontSize;
        document.getElementById('typing-indicator').checked = settings.typingIndicator;
        document.getElementById('sound-effects').checked = settings.soundEffects;
        document.getElementById('save-conversations').checked = settings.saveConversations;
        document.getElementById('analytics').checked = settings.analytics;
        applyTheme(settings.themeMode);
        applyFontSize(settings.fontSize);
    }
}

// Save settings to localStorage
function saveSettings() {
    try {
        const settings = {
            responseSpeed: document.getElementById('response-speed').value,
            messageLength: document.getElementById('message-length').value,
            conversationTone: document.getElementById('conversation-tone').value,
            themeMode: document.getElementById('theme-mode').value,
            fontSize: document.getElementById('font-size').value,
            typingIndicator: document.getElementById('typing-indicator').checked,
            soundEffects: document.getElementById('sound-effects').checked,
            saveConversations: document.getElementById('save-conversations').checked,
            analytics: document.getElementById('analytics').checked
        };
        
        localStorage.setItem('chatbotSettings', JSON.stringify(settings));
        
        // Apply settings immediately
        applyTheme(settings.themeMode);
        applyFontSize(settings.fontSize);
        
        // Show success feedback
        showSettingsSaved();
        
        // Close modal after saving
        setTimeout(() => {
            closeSettings();
        }, 1000);
        
    } catch (error) {
        console.error('Error saving settings:', error);
        alert('Error saving settings. Please try again.');
    }
}

// Reset settings to default
function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default?')) {
        localStorage.removeItem('chatbotSettings');
        loadSettings();
    }
}

// Clear chat history
function clearChatHistory() {
    if (confirm('Are you sure you want to clear all chat history? This action cannot be undone.')) {
        // Clear all chat containers
        const jennieMessages = document.querySelector('#jennie-chat .chat-messages');
        const jackMessages = document.querySelector('#jack-chat .chat-messages');
        
        if (jennieMessages) jennieMessages.innerHTML = '';
        if (jackMessages) jackMessages.innerHTML = '';
        
        // Clear any stored conversation data
        localStorage.removeItem('chatHistory');
        
        alert('Chat history has been cleared.');
    }
}

// Apply theme
function applyTheme(theme) {
    const body = document.body;
    body.classList.remove('light-theme', 'dark-theme');
    
    if (theme === 'dark') {
        body.classList.add('dark-theme');
    } else if (theme === 'light') {
        body.classList.add('light-theme');
    } else if (theme === 'auto') {
        // Use system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        body.classList.add(prefersDark ? 'dark-theme' : 'light-theme');
    }
}

// Apply font size
function applyFontSize(size) {
    const body = document.body;
    body.classList.remove('font-small', 'font-medium', 'font-large');
    body.classList.add(`font-${size}`);
}

// Show settings saved feedback
function showSettingsSaved() {
    const saveBtn = document.querySelector('.primary-btn');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Saved!';
    saveBtn.style.background = '#10B981';
    
    setTimeout(() => {
        saveBtn.textContent = originalText;
        saveBtn.style.background = '#8B5CF6';
    }, 1000);
}

// API Integration Helper Functions (legacy, not required for Coze but 남겨둠)
/**
 * Initialize API connection
 * @param {string} apiKey - Your API key
 * @param {string} baseUrl - Your API base URL
 */
function initializeAPI(apiKey, baseUrl) {
    // Set up API configuration
    window.API_CONFIG = {
        key: apiKey,
        baseUrl: baseUrl,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        }
    };
}

/**
 * Send message to your chatbot API (legacy helper)
 */
async function callChatbotAPI(message, chatType, userId = 'demo-user') {
    if (!window.API_CONFIG) {
        throw new Error('API not initialized. Call initializeAPI() first.');
    }
    
    const response = await fetch(`${window.API_CONFIG.baseUrl}/chat`, {
        method: 'POST',
        headers: window.API_CONFIG.headers,
        body: JSON.stringify({
            message: message,
            bot_type: chatType,
            user_id: userId,
            timestamp: new Date().toISOString()
        })
    });
    
    if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data.response || data.message || 'Sorry, I did not understand that.';
}

// File Upload Functions
function triggerImageUpload(chatType) {
    const imageInput = document.getElementById(`${chatType}-image-upload`);
    imageInput.click();
}

function triggerFileUpload(chatType) {
    const fileInput = document.getElementById(`${chatType}-file-upload`);
    fileInput.click();
}

function handleImageUpload(chatType, input) {
    const file = input.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('Image file size cannot exceed 5MB');
        return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = function(e) {
        showImagePreview(chatType, e.target.result, file.name);
    };
    reader.readAsDataURL(file);
    
    // Clear the input
    input.value = '';
}

function handleFileUpload(chatType, input) {
    const file = input.files[0];
    if (!file) return;
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        alert('File size cannot exceed 10MB');
        return;
    }
    
    // Show file preview
    showFilePreview(chatType, file);
    
    // Clear the input
    input.value = '';
}

function showImagePreview(chatType, imageSrc, fileName) {
    const chatInput = document.querySelector(`#${chatType}-chat .chat-input`);
    
    // Remove existing preview
    removeExistingPreview(chatType);
    
    // Create simple attachment indicator
    const previewDiv = document.createElement('div');
    previewDiv.className = 'attachment-indicator';
    previewDiv.innerHTML = `
        <div class="attachment-content">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
            </svg>
            <span class="attachment-text">Image attached</span>
        </div>
        <button class="remove-attachment" onclick="removeImagePreview('${chatType}')" title="Remove attachment">×</button>
    `;
    
    // Insert before input container
    const inputContainer = chatInput.querySelector('.input-container');
    chatInput.insertBefore(previewDiv, inputContainer);
    
    // Store image data for sending
    window.pendingUploads = window.pendingUploads || {};
    window.pendingUploads[chatType] = {
        type: 'image',
        data: imageSrc,
        name: fileName
    };
}

function showFilePreview(chatType, file) {
    const chatInput = document.querySelector(`#${chatType}-chat .chat-input`);
    
    // Remove existing preview
    removeExistingPreview(chatType);
    
    // Create simple attachment indicator
    const previewDiv = document.createElement('div');
    previewDiv.className = 'attachment-indicator';
    previewDiv.innerHTML = `
        <div class="attachment-content">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
            </svg>
            <span class="attachment-text">File attached</span>
        </div>
        <button class="remove-attachment" onclick="removeFilePreview('${chatType}')" title="Remove attachment">×</button>
    `;
    
    // Insert before input container
    const inputContainer = chatInput.querySelector('.input-container');
    chatInput.insertBefore(previewDiv, inputContainer);
    
    // Store file data for sending
    const reader = new FileReader();
    reader.onload = function(e) {
        window.pendingUploads = window.pendingUploads || {};
        window.pendingUploads[chatType] = {
            type: 'file',
            data: e.target.result,
            name: file.name,
            mimeType: file.type
        };
    };
    reader.readAsDataURL(file);
}

function removeExistingPreview(chatType) {
    const chatInput = document.querySelector(`#${chatType}-chat .chat-input`);
    const existingPreview = chatInput.querySelector('.image-preview, .file-preview, .attachment-indicator');
    if (existingPreview) {
        existingPreview.remove();
    }
    
    // Clear pending upload
    if (window.pendingUploads && window.pendingUploads[chatType]) {
        delete window.pendingUploads[chatType];
    }
}

function removeImagePreview(chatType) {
    removeExistingPreview(chatType);
}

function removeFilePreview(chatType) {
    removeExistingPreview(chatType);
}

function getFileIcon(mimeType) {
    if (mimeType.startsWith('image/')) return 'IMG';
    if (mimeType.startsWith('video/')) return 'VID';
    if (mimeType.startsWith('audio/')) return 'AUD';
    if (mimeType.includes('pdf')) return 'PDF';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'DOC';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'XLS';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'PPT';
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('archive')) return 'ZIP';
    return 'FILE';
}

// Modify sendMessage function to handle uploads
const originalSendMessage = sendMessage;
function sendMessage(chatType) {
    const input = document.getElementById(`${chatType}-input`);
    const message = input.value.trim();
    const pendingUpload = window.pendingUploads && window.pendingUploads[chatType];
    
    // Check if there is a message or upload
    if (!message && !pendingUpload) {
        return;
    }
    
    const messagesContainer = document.getElementById(`${chatType}-messages`);
    
    // Add user message with upload if present
    if (pendingUpload) {
        addMessageWithUpload(messagesContainer, message, 'user', pendingUpload);
        // Clear the upload
        removeExistingPreview(chatType);
    } else if (message) {
        addMessage(messagesContainer, message, 'user');
    }
    
    // Clear input
    input.value = '';
    
    // Send to API (현재는 uploadData는 Coze에 전달하지 않고 무시)
    if (message || pendingUpload) {
        sendToAPI(message, chatType, messagesContainer, pendingUpload);
    }
}

function addMessageWithUpload(container, text, sender, uploadData) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    let uploadHtml = '';
    if (uploadData.type === 'image') {
        uploadHtml = `<div class="message-upload"><img src="${uploadData.data}" alt="${uploadData.name}" style="max-width: 200px; max-height: 150px; border-radius: 8px; margin-bottom: 8px;"></div>`;
    } else if (uploadData.type === 'file') {
        const fileIcon = getFileIcon(uploadData.mimeType);
        uploadHtml = `<div class="message-upload"><span style="margin-right: 8px;">${fileIcon}</span><span>${uploadData.name}</span></div>`;
    }
    
    messageDiv.innerHTML = `
        <div class="avatar">${getAvatarSvg(sender)}</div>
        <div class="message-content">
            ${uploadHtml}
            ${text ? `<div class="message-text">${text}</div>` : ''}
        </div>
    `;
    
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

// Export functions for external use
window.ChatbotUI = {
    selectChat,
    goBack,
    sendMessage,
    toggleNotification,
    generateReport,
    initializeAPI,
    callChatbotAPI,
    openSettings,
    closeSettings,
    saveSettings,
    resetSettings,
    clearChatHistory,
    triggerImageUpload,
    triggerFileUpload,
    handleImageUpload,
    handleFileUpload,
    removeImagePreview,
    removeFilePreview
};
