// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeFormHandlers();
});

// Initialize all event listeners
function initializeEventListeners() {
    // Template action buttons
    const templateButtons = document.querySelectorAll('.template-actions .btn');
    templateButtons.forEach(button => {
        button.addEventListener('click', handleTemplateAction);
    });

    // More templates link
    const moreTemplatesLink = document.querySelector('.more-link');
    if (moreTemplatesLink) {
        moreTemplatesLink.addEventListener('click', handleMoreTemplates);
    }

    // Form buttons
    const cancelButton = document.querySelector('.btn-cancel');
    const saveButton = document.querySelector('.btn-save');
    
    if (cancelButton) {
        cancelButton.addEventListener('click', handleCancel);
    }
    
    if (saveButton) {
        saveButton.addEventListener('click', handleSaveTemplate);
    }

    // Checkbox interactions for target options
    const targetCheckboxes = document.querySelectorAll('input[name="target"]');
    targetCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleTargetSelection);
    });

    // Form validation
    const templateTitleInput = document.getElementById('template-title');
    if (templateTitleInput) {
        templateTitleInput.addEventListener('input', validateForm);
    }

    // Keywords input functionality
    const keywordsInput = document.getElementById('keywords-input');
    if (keywordsInput) {
        keywordsInput.addEventListener('keydown', handleKeywordsInput);
        keywordsInput.addEventListener('blur', addKeywordFromInput);
    }
}

// Initialize form handlers
function initializeFormHandlers() {
    const form = document.querySelector('.template-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

// Handle template action buttons (Generate PDF, Excel, Email)
function handleTemplateAction(event) {
    event.preventDefault();
    const button = event.target;
    const action = button.textContent.trim();
    const templateCard = button.closest('.template-card');
    const templateName = templateCard.querySelector('h3').textContent;

    // Show loading state
    const originalText = button.textContent;
    button.textContent = 'Processing...';
    button.disabled = true;

    // Simulate API call
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        
        // Show success message
        showNotification(`${action} for "${templateName}" has been generated successfully!`, 'success');
        
        // Simulate file download for PDF/Excel
        if (action.includes('PDF') || action.includes('Excel')) {
            simulateDownload(templateName, action);
        }
    }, 2000);
}

// Handle more templates link
function handleMoreTemplates(event) {
    event.preventDefault();
    showNotification('Loading more templates...', 'info');
    
    // Simulate loading more templates
    setTimeout(() => {
        showNotification('More templates loaded successfully!', 'success');
    }, 1500);
}

// Handle cancel button
function handleCancel(event) {
    event.preventDefault();
    
    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
        resetForm();
        showNotification('Form has been reset.', 'info');
    }
}

// Handle save template button
function handleSaveTemplate(event) {
    event.preventDefault();
    
    if (validateForm()) {
        const formData = collectFormData();
        
        // Show loading state
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'Saving...';
        button.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
            
            showNotification(`Template "${formData.title}" has been saved successfully!`, 'success');
            resetForm();
        }, 2000);
    }
}

// Handle target selection checkboxes
function handleTargetSelection(event) {
    const checkbox = event.target;
    const targetOption = checkbox.closest('.target-option');
    const select = targetOption.querySelector('.target-select');
    
    if (checkbox.checked) {
        select.disabled = false;
        select.style.opacity = '1';
    } else {
        select.disabled = true;
        select.style.opacity = '0.5';
        select.selectedIndex = 0;
    }
}

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    handleSaveTemplate(event);
}

// Handle keywords input
function handleKeywordsInput(event) {
    if (event.key === 'Enter' || event.key === ',') {
        event.preventDefault();
        addKeywordFromInput();
    }
}

// Add keyword from input
function addKeywordFromInput() {
    const input = document.getElementById('keywords-input');
    const value = input.value.trim();
    
    if (value) {
        // Split by comma and add each keyword
        const keywords = value.split(',').map(k => k.trim()).filter(k => k);
        keywords.forEach(keyword => addKeyword(keyword));
        input.value = '';
    }
}

// Add a single keyword
function addKeyword(keyword) {
    if (!keyword) return;
    
    const keywordsDisplay = document.querySelector('.keywords-display');
    
    // Check if keyword already exists
    const existingKeywords = Array.from(keywordsDisplay.querySelectorAll('.keyword-tag'))
        .map(tag => tag.textContent.replace('×', '').trim());
    
    if (existingKeywords.includes(keyword)) {
        showNotification('Keyword already exists', 'warning');
        return;
    }
    
    // Create keyword tag
    const keywordTag = document.createElement('span');
    keywordTag.className = 'keyword-tag removable';
    keywordTag.innerHTML = `${keyword}<button class="remove-btn" onclick="removeKeyword(this)">×</button>`;
    
    keywordsDisplay.appendChild(keywordTag);
}

// Remove keyword
function removeKeyword(button) {
    const keywordTag = button.parentElement;
    keywordTag.remove();
}

// Validate form
function validateForm() {
    const titleInput = document.getElementById('template-title');
    const title = titleInput.value.trim();
    
    if (!title) {
        showNotification('Please enter a template title.', 'error');
        titleInput.focus();
        return false;
    }
    
    if (title.length < 3) {
        showNotification('Template title must be at least 3 characters long.', 'error');
        titleInput.focus();
        return false;
    }
    
    // Check if at least one category is selected
    const categories = document.querySelectorAll('input[name="category"]:checked');
    if (categories.length === 0) {
        showNotification('Please select at least one report category.', 'error');
        return false;
    }
    
    return true;
}

// Collect form data
function collectFormData() {
    const formData = {
        title: document.getElementById('template-title').value.trim(),
        categories: Array.from(document.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value),
        reportingPeriod: document.getElementById('reporting-period').value,
        targets: [],
        keywords: [],
        visualization: document.querySelector('input[name="visualization"]:checked')?.value,
        exportFormat: document.querySelector('input[name="export-format"]:checked')?.value
    };
    
    // Collect target data
    const targetCheckboxes = document.querySelectorAll('input[name="target"]:checked');
    targetCheckboxes.forEach(checkbox => {
        const targetOption = checkbox.closest('.target-option');
        const select = targetOption.querySelector('.target-select');
        formData.targets.push({
            type: checkbox.value,
            value: select.value
        });
    });
    
    // Collect keywords data
    const keywordTags = document.querySelectorAll('.keywords-display .keyword-tag');
    formData.keywords = Array.from(keywordTags).map(tag => 
        tag.textContent.replace('×', '').trim()
    );
    
    return formData;
}

// Reset form
function resetForm() {
    const form = document.querySelector('.template-form');
    if (form) {
        form.reset();
        
        // Reset target selects
        const targetSelects = document.querySelectorAll('.target-select');
        targetSelects.forEach(select => {
            select.disabled = true;
            select.style.opacity = '0.5';
        });
        
        // Reset auto selection for visualization
        const autoRadio = document.querySelector('input[name="visualization"][value="auto"]');
        if (autoRadio) {
            autoRadio.checked = true;
        }
        
        // Reset PDF selection for export format
        const pdfRadio = document.querySelector('input[name="export-format"][value="pdf"]');
        if (pdfRadio) {
            pdfRadio.checked = true;
        }
        
        // Clear keywords display
        const keywordsDisplay = document.querySelector('.keywords-display');
        if (keywordsDisplay) {
            keywordsDisplay.innerHTML = '';
        }
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '6px',
        color: 'white',
        fontWeight: '500',
        fontSize: '14px',
        zIndex: '1000',
        maxWidth: '400px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#10b981';
            break;
        case 'error':
            notification.style.backgroundColor = '#ef4444';
            break;
        case 'warning':
            notification.style.backgroundColor = '#f59e0b';
            break;
        default:
            notification.style.backgroundColor = '#3b82f6';
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Simulate file download
function simulateDownload(templateName, action) {
    const fileName = `${templateName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`;
    const extension = action.includes('PDF') ? '.pdf' : '.xlsx';
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = '#';
    link.download = fileName + extension;
    
    // Simulate download
    console.log(`Downloading: ${fileName}${extension}`);
}

// Initialize target selects as disabled
document.addEventListener('DOMContentLoaded', function() {
    const targetSelects = document.querySelectorAll('.target-select');
    targetSelects.forEach(select => {
        select.disabled = true;
        select.style.opacity = '0.5';
    });
});