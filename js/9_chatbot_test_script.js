// =======================
// Global variables & Coze Config
// =======================

let currentChat = null;

// Coze API Config
const COZE_API_KEY = 'pat_PnBc5GldcFkUsQAoREIIu3eUd8lUvQuTgphV7ZTa9ZuFHrdWb7HcgxkV5SSItbQU';
const COZE_JENNIE_BOT_ID = '7558009309167599633';
const COZE_JACK_BOT_ID = '7539058866902810641';
const COZE_API_URL = 'https://api.coze.com/v1/chat';

// Notification states for each chat
let notificationStates = {
    jennie: true,
    jack: true
};

// =======================
// Chat UI Core
// =======================

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
    notificationStates[chatType] = !notificationStates[chatType];
    const button = document.getElementById(`${chatType}-notification-btn`);
    if (notificationStates[chatType]) {
        button.textContent = '🔔';
    } else {
        button.textContent = '🔕';
    }
    localStorage.setItem('notificationStates', JSON.stringify(notificationStates));
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

// =======================
// Coze API 연동
// =======================

async function callCozeAPI(message, chatType, userId = 'demo-user') {
    const botId = chatType === 'jack' ? COZE_JACK_BOT_ID : COZE_JENNIE_BOT_ID;

    const payload = {
        bot_id: botId,
        user_id: userId,
        query: message,
        stream: false
    };

    const res = await fetch(COZE_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${COZE_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const text = await res.text().catch(() => '');
        console.error('Coze API error status:', res.status);
        console.error('Coze API error body:', text);
        throw new Error(`Coze API request failed: ${res.status}`);
    }

    const data = await res.json();
    console.log('Coze API raw response:', data);

    // 응답 파싱 (Coze 구조에 따라 조정 필요)
    // 아래는 대표적인 패턴들을 방어적으로 처리한 예시
    let reply = '';

    // 1) data.answer 형태
    if (typeof data.answer === 'string') {
        reply = data.answer;
    }
    // 2) data.messages 배열에 assistant 역할 메시지
    else if (Array.isArray(data.messages)) {
        const assistantMsg = [...data.messages].reverse().find(m => m.role === 'assistant' && typeof m.content === 'string');
        if (assistantMsg) {
            reply = assistantMsg.content;
        }
    }
    // 3) data.data[0].content 또는 content 배열
    else if (Array.isArray(data.data) && data.data.length > 0) {
        const first = data.data[0];
        if (typeof first.content === 'string') {
            reply = first.content;
        } else if (Array.isArray(first.content)) {
            const textItem = first.content.find(c => c.type === 'text' && typeof c.text === 'string');
            if (textItem) reply = textItem.text;
        }
    }

    if (!reply) {
        reply = '죄송합니다. 서버 응답을 해석하지 못했습니다.';
        console.warn('Coze response format not fully handled:', data);
    }

    return reply;
}

// Coze를 사용하는 API Response 함수
async function getAPIResponse(message, chatType, uploadData = null) {
    // 현재는 텍스트만 Coze에 보냄
    const userId = 'demo-user'; // 나중에 실제 로그인 유저 키로 교체 가능
    const reply = await callCozeAPI(message, chatType, userId);
    return reply;
}

// Send message to API (Jennie / Jack 공통)
async function sendToAPI(message, chatType, messagesContainer, uploadData = null) {
    try {
        const typingIndicator = showTypingIndicator(messagesContainer, chatType);
        
        const response = await getAPIResponse(message, chatType, uploadData);
        
        removeTypingIndicator(messagesContainer);
        addMessage(messagesContainer, response, chatType);
        
    } catch (error) {
        console.error('Error sending message to API:', error);
        removeTypingIndicator(messagesContainer);
        addMessage(messagesContainer, 'Sorry, I encountered an error. Please try again.', chatType);
    }
}

// =======================
// Send Message (텍스트 + 업로드 포함 버전)
// =======================

// 기존 sendMessage가 아래쪽에서 재정의되므로, 여기서는 마지막 정의만 사용됨
function sendMessage(chatType) {
    const input = document.getElementById(`${chatType}-input`);
    const message = input.value.trim();
    const pendingUpload = window.pendingUploads && window.pendingUploads[chatType];
    
    if (!message && !pendingUpload) {
        return;
    }
    
    const messagesContainer = document.getElementById(`${chatType}-messages`);
    
    if (pendingUpload) {
        addMessageWithUpload(messagesContainer, message, 'user', pendingUpload);
        removeExistingPreview(chatType);
    } else if (message) {
        addMessage(messagesContainer, message, 'user');
    }
    
    input.value = '';
    
    if (message || pendingUpload) {
        // 현재는 uploadData는 Coze로 안 보내고, 텍스트만 보냄
        sendToAPI(message, chatType, messagesContainer, pendingUpload);
    }
}

function addMessageWithUpload(container, text, sender, uploadData) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    let uploadHtml = '';
    if (uploadData.type === 'image') {
        uploadHtml = `
            <div class="message-upload">
                <img src="${uploadData.data}" alt="${uploadData.name}"
                     style="max-width: 200px; max-height: 150px; border-radius: 8px; margin-bottom: 8px;">
            </div>`;
    } else if (uploadData.type === 'file') {
        const fileIcon = getFileIcon(uploadData.mimeType);
        uploadHtml = `
            <div class="message-upload">
                <span style="margin-right: 8px;">${fileIcon}</span>
                <span>${uploadData.name}</span>
            </div>`;
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

// =======================
// Generate Report (Jack 전용, 아직은 데모 텍스트 그대로 사용)
// =======================

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

// =======================
// DOMContentLoaded 초기화
// =======================

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
    
    initializeNotificationStates();
    loadSettings();
});

// =======================
// Notification State Init
// =======================

function initializeNotificationStates() {
    const savedStates = localStorage.getItem('notificationStates');
    if (savedStates) {
        try {
            notificationStates = JSON.parse(savedStates);
        } catch (e) {
            console.log('Error parsing saved notification states, using defaults');
        }
    }
    
    Object.keys(notificationStates).forEach(chatType => {
        const button = document.getElementById(`${chatType}-notification-btn`);
        if (button) {
            button.textContent = notificationStates[chatType] ? '🔔' : '🔕';
        }
    });
}

// =======================
// Settings Modal Functions
// =======================

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

document.addEventListener('click', function(event) {
    const modal = document.getElementById('settings-modal');
    if (event.target === modal) {
        closeSettings();
    }
});

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

function loadSettings() {
    try {
        const savedSettings = localStorage.getItem('chatbotSettings');
        const settings = savedSettings ? JSON.parse(savedSettings) : defaultSettings;
        
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
    } catch (error) {
        console.error('Error loading settings:', error);
        const settings = defaultSettings;
        applyTheme(settings.themeMode);
        applyFontSize(settings.fontSize);
    }
}

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
        
        applyTheme(settings.themeMode);
        applyFontSize(settings.fontSize);
        
        showSettingsSaved();
        
        setTimeout(() => {
            closeSettings();
        }, 1000);
        
    } catch (error) {
        console.error('Error saving settings:', error);
        alert('Error saving settings. Please try again.');
    }
}

function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default?')) {
        localStorage.removeItem('chatbotSettings');
        loadSettings();
    }
}

function clearChatHistory() {
    if (confirm('Are you sure you want to clear all chat history? This action cannot be undone.')) {
        const jennieMessages = document.querySelector('#jennie-chat .chat-messages');
        const jackMessages = document.querySelector('#jack-chat .chat-messages');
        
        if (jennieMessages) jennieMessages.innerHTML = '';
        if (jackMessages) jackMessages.innerHTML = '';
        
        localStorage.removeItem('chatHistory');
        alert('Chat history has been cleared.');
    }
}

function applyTheme(theme) {
    const body = document.body;
    body.classList.remove('light-theme', 'dark-theme');
    
    if (theme === 'dark') {
        body.classList.add('dark-theme');
    } else if (theme === 'light') {
        body.classList.add('light-theme');
    } else if (theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        body.classList.add(prefersDark ? 'dark-theme' : 'light-theme');
    }
}

function applyFontSize(size) {
    const body = document.body;
    body.classList.remove('font-small', 'font-medium', 'font-large');
    body.classList.add(`font-${size}`);
}

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

// =======================
// File Upload (프론트 UI만, Coze 연동은 추후)
// =======================

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
    
    if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
    }
    if (file.size > 5 * 1024 * 1024) {
        alert('Image file size cannot exceed 5MB');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        showImagePreview(chatType, e.target.result, file.name);
    };
    reader.readAsDataURL(file);
    input.value = '';
}

function handleFileUpload(chatType, input) {
    const file = input.files[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
        alert('File size cannot exceed 10MB');
        return;
    }
    
    showFilePreview(chatType, file);
    input.value = '';
}

function showImagePreview(chatType, imageSrc, fileName) {
    const chatInput = document.querySelector(`#${chatType}-chat .chat-input`);
    removeExistingPreview(chatType);
    
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
    
    const inputContainer = chatInput.querySelector('.input-container');
    chatInput.insertBefore(previewDiv, inputContainer);
    
    window.pendingUploads = window.pendingUploads || {};
    window.pendingUploads[chatType] = {
        type: 'image',
        data: imageSrc,
        name: fileName
    };
}

function showFilePreview(chatType, file) {
    const chatInput = document.querySelector(`#${chatType}-chat .chat-input`);
    removeExistingPreview(chatType);
    
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
    
    const inputContainer = chatInput.querySelector('.input-container');
    chatInput.insertBefore(previewDiv, inputContainer);
    
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

// =======================
// Export to window
// =======================

window.ChatbotUI = {
    selectChat,
    goBack,
    sendMessage,
    toggleNotification,
    generateReport,
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

