// DOM Elements
const reportNameInput = document.getElementById('reportName');
const templateSelect = document.getElementById('template');
const frequencyRadios = document.querySelectorAll('input[name="frequency"]');
const timeSelect = document.getElementById('time');
const dateSelect = document.getElementById('date');
const timezoneSelect = document.getElementById('timezone');
const emailSubjectInput = document.getElementById('emailSubject');
const emailBodyTextarea = document.getElementById('emailBody');
const recipientEmailInput = document.querySelector('.recipients-input input');
const calendarIcon = document.getElementById('calendar-icon');
const customDatePicker = document.getElementById('custom-date');

// Preview Elements
const previewReportName = document.querySelector('.preview-section .preview-item:nth-child(1) .value');
const previewTemplate = document.querySelector('.preview-section .preview-item:nth-child(2) .value');
const previewFrequency = document.querySelector('.preview-section .preview-item:nth-child(4) .value');
const previewEmailSubject = document.querySelector('.preview-section .preview-item:nth-child(5) .value');
const previewEmailBody = document.querySelector('.email-body-preview');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updatePreview();
});

function initializeEventListeners() {
    // Form input listeners for real-time preview updates
    reportNameInput.addEventListener('input', updatePreview);
    templateSelect.addEventListener('change', updatePreview);
    frequencyRadios.forEach(radio => {
        radio.addEventListener('change', updatePreview);
    });
    timeSelect.addEventListener('change', updatePreview);
    dateSelect.addEventListener('change', updatePreview);
    timezoneSelect.addEventListener('change', updatePreview);
    emailSubjectInput.addEventListener('input', updatePreview);
    emailBodyTextarea.addEventListener('input', updatePreview);

    // Button event listeners
    document.querySelector('.add-schedule-btn').addEventListener('click', handleAddNewSchedule);
    document.querySelector('.specify-btn').addEventListener('click', handleSpecifyRecipient);
    document.querySelector('.add-group-btn').addEventListener('click', handleAddGroup);
    document.querySelector('.manage-group-btn').addEventListener('click', handleManageGroup);
    document.querySelector('.preview-btn').addEventListener('click', handlePreviewEmail);
    document.querySelector('.save-btn').addEventListener('click', handleSaveSchedule);

    // Report action buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', handleEditReport);
    });
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', handleRemoveReport);
    });
    document.querySelectorAll('.toggle-switch input').forEach(toggle => {
        toggle.addEventListener('change', handleToggleReport);
    });

    // Calendar icon click event
    if (calendarIcon) {
        calendarIcon.addEventListener('click', handleCalendarIconClick);
    }
    
    // Custom date picker change event
    if (customDatePicker) {
        customDatePicker.addEventListener('change', handleCustomDateChange);
    }

    // Notification icon click
    document.querySelector('.notification-icon').addEventListener('click', handleNotificationClick);
}

function updatePreview() {
    // Update report name
    previewReportName.textContent = reportNameInput.value || 'Monthly Employee Sentiment Report';
    
    // Update template
    previewTemplate.textContent = templateSelect.options[templateSelect.selectedIndex].text;
    
    // Update frequency
    const selectedFrequency = document.querySelector('input[name="frequency"]:checked').value;
    const time = timeSelect.value;
    const date = dateSelect.value;
    const timezone = timezoneSelect.options[timezoneSelect.selectedIndex].text.split(' ')[0];
    
    let frequencyText = '';
    switch(selectedFrequency) {
        case 'weekly':
            frequencyText = `Weekly (Every Monday at ${formatTime(time)}, ${timezone})`;
            break;
        case 'monthly':
            frequencyText = `Monthly (${date} at ${formatTime(time)}, ${timezone})`;
            break;
        case 'quarterly':
            frequencyText = `Quarterly (${date} of every quarter at ${formatTime(time)}, ${timezone})`;
            break;
        case 'custom':
            const customDate = customDatePicker.value;
            if (customDate) {
                const formattedDate = new Date(customDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
                frequencyText = `Custom (${formattedDate} at ${formatTime(time)}, ${timezone})`;
            } else {
                frequencyText = `Custom schedule at ${formatTime(time)}, ${timezone}`;
            }
            break;
    }
    previewFrequency.textContent = frequencyText;
    
    // Update email subject
    previewEmailSubject.textContent = emailSubjectInput.value || 'Monthly Sentiment Overview';
    
    // Update email body preview
    const emailBodyText = emailBodyTextarea.value || 'Hello Team,\n\nPlease find the attached Monthly Sentiment...';
    const lines = emailBodyText.split('\n').slice(0, 2); // Show first 2 lines
    previewEmailBody.innerHTML = lines.map(line => `<p>${line}</p>`).join('');
}

function formatTime(time24) {
    const [hours, minutes] = time24.split(':');
    const hour12 = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
}

// Button handlers
function handleAddNewSchedule() {
    showNotification('Add New Schedule clicked', 'info');
    // In a real application, this would open a modal or navigate to a new page
}

function handleSpecifyRecipient() {
    const email = recipientEmailInput.value.trim();
    if (email && isValidEmail(email)) {
        addRecipientToList(email);
        recipientEmailInput.value = '';
        showNotification(`Recipient ${email} added successfully`, 'success');
    } else {
        showNotification('Please enter a valid email address', 'error');
    }
}

function handleAddGroup() {
    showNotification('Add Group functionality would open a group selection dialog', 'info');
    // In a real application, this would open a group selection modal
}

function handleManageGroup() {
    showNotification('Manage Group functionality would open group management interface', 'info');
    // In a real application, this would open group management interface
}

function handlePreviewEmail() {
    const emailData = {
        subject: emailSubjectInput.value,
        body: emailBodyTextarea.value,
        recipients: getRecipientsList()
    };
    
    showEmailPreviewModal(emailData);
}

function handleSaveSchedule() {
    const scheduleData = {
        reportName: reportNameInput.value,
        template: templateSelect.value,
        frequency: document.querySelector('input[name="frequency"]:checked').value,
        time: timeSelect.value,
        date: dateSelect.value,
        timezone: timezoneSelect.value,
        emailSubject: emailSubjectInput.value,
        emailBody: emailBodyTextarea.value,
        recipients: getRecipientsList()
    };
    
    if (validateScheduleData(scheduleData)) {
        saveSchedule(scheduleData);
        showNotification('Schedule saved successfully!', 'success');
    } else {
        showNotification('Please fill in all required fields', 'error');
    }
}

function handleEditReport(event) {
    const reportItem = event.target.closest('.report-item');
    const reportName = reportItem.querySelector('.report-name').textContent;
    showNotification(`Edit functionality for "${reportName}" would load the report data into the form`, 'info');
    // In a real application, this would load the report data into the form
}

function handleRemoveReport(event) {
    const reportItem = event.target.closest('.report-item');
    const reportName = reportItem.querySelector('.report-name').textContent;
    
    if (confirm(`Are you sure you want to remove "${reportName}"?`)) {
        reportItem.remove();
        showNotification(`"${reportName}" has been removed`, 'success');
    }
}

function handleToggleReport(event) {
    const reportItem = event.target.closest('.report-item');
    const reportName = reportItem.querySelector('.report-name').textContent;
    const isEnabled = event.target.checked;
    
    showNotification(`"${reportName}" has been ${isEnabled ? 'enabled' : 'disabled'}`, 'info');
}

function handleNotificationClick() {
    showNotification('You have 3 new notifications', 'info');
    // In a real application, this would show a notifications dropdown
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function addRecipientToList(email) {
    const recipientsList = document.querySelector('.recipients-list');
    const newRecipient = document.createElement('div');
    newRecipient.className = 'recipient';
    newRecipient.innerHTML = `
        <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNGRkY1RjUiLz4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxMyIgcj0iNSIgZmlsbD0iIzk5NzI2MyIvPgo8cGF0aCBkPSJNMjQgMjZjMC01LjMwMi00LjI5OC05LjYtOS42LTkuNlM0LjggMjAuNjk4IDQuOCAyNiIgZmlsbD0iIzk5NzI2MyIvPgo8L3N2Zz4=" alt="${email}">
        <div class="recipient-info">
            <div class="name">${email.split('@')[0]}</div>
            <div class="role">New Recipient</div>
        </div>
    `;
    recipientsList.appendChild(newRecipient);
}

function getRecipientsList() {
    const recipients = [];
    document.querySelectorAll('.recipient').forEach(recipient => {
        const name = recipient.querySelector('.name').textContent;
        const role = recipient.querySelector('.role').textContent;
        recipients.push({ name, role });
    });
    return recipients;
}

function validateScheduleData(data) {
    return data.reportName && data.template && data.frequency && 
           data.time && data.emailSubject && data.emailBody;
}

function saveSchedule(data) {
    // In a real application, this would send data to the server
    console.log('Saving schedule:', data);
    localStorage.setItem('lastSavedSchedule', JSON.stringify(data));
}

function showEmailPreviewModal(emailData) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Email Preview</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="email-preview">
                    <div class="email-field">
                        <strong>Subject:</strong> ${emailData.subject}
                    </div>
                    <div class="email-field">
                        <strong>Recipients:</strong> ${emailData.recipients.map(r => r.name).join(', ')}
                    </div>
                    <div class="email-field">
                        <strong>Body:</strong>
                        <div class="email-body">${emailData.body.replace(/\n/g, '<br>')}</div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-secondary close-modal">Close</button>
                <button class="btn-primary">Send Test Email</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        .modal-content {
            background: white;
            border-radius: 8px;
            width: 90%;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #e9ecef;
        }
        .modal-body {
            padding: 20px;
        }
        .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            padding: 20px;
            border-top: 1px solid #e9ecef;
        }
        .email-field {
            margin-bottom: 15px;
        }
        .email-body {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            margin-top: 8px;
        }
        .close-modal {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
        }
        .btn-secondary {
            background-color: #6c757d;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
        }
        .btn-primary {
            background-color: #6c5ce7;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
        }
    `;
    document.head.appendChild(modalStyles);
    
    // Close modal functionality
    modal.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            document.body.removeChild(modal);
            document.head.removeChild(modalStyles);
        });
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
            document.head.removeChild(modalStyles);
        }
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 6px;
            color: white;
            font-weight: 500;
            z-index: 1001;
            animation: slideIn 0.3s ease-out;
        }
        .notification-success { background-color: #28a745; }
        .notification-error { background-color: #dc3545; }
        .notification-info { background-color: #17a2b8; }
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    
    if (!document.querySelector('style[data-notification-styles]')) {
        notificationStyles.setAttribute('data-notification-styles', 'true');
        document.head.appendChild(notificationStyles);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Load saved data on page load
function loadSavedData() {
    const savedData = localStorage.getItem('lastSavedSchedule');
    if (savedData) {
        const data = JSON.parse(savedData);
        reportNameInput.value = data.reportName || '';
        templateSelect.value = data.template || '';
        document.querySelector(`input[name="frequency"][value="${data.frequency}"]`).checked = true;
        timeSelect.value = data.time || '';
        dateSelect.value = data.date || '';
        timezoneSelect.value = data.timezone || '';
        emailSubjectInput.value = data.emailSubject || '';
        emailBodyTextarea.value = data.emailBody || '';
        updatePreview();
    }
}

// Calendar icon click handler
function handleCalendarIconClick() {
    // Select the custom frequency radio button
    const customRadio = document.querySelector('input[name="frequency"][value="custom"]');
    if (customRadio) {
        customRadio.checked = true;
        updatePreview();
    }
    
    // Trigger the date picker
    if (customDatePicker) {
        customDatePicker.click();
    }
}

// Custom date change handler
function handleCustomDateChange() {
    // Ensure custom frequency is selected
    const customRadio = document.querySelector('input[name="frequency"][value="custom"]');
    if (customRadio) {
        customRadio.checked = true;
    }
    
    // Update preview with selected date
    updatePreview();
    
    // Show notification about selected date
    const selectedDate = customDatePicker.value;
    if (selectedDate) {
        const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        showNotification(`Custom date selected: ${formattedDate}`, 'success');
    }
}

// Load saved data on page load
document.addEventListener('DOMContentLoaded', loadSavedData);