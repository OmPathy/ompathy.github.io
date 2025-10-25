// Global variables
let allTickets = [];
let filteredTickets = [];

// API base URL - detect if running from file:// or http://
const API_BASE_URL = window.location.protocol === 'file:' 
    ? 'http://127.0.0.1:5000' 
    : '';

// DOM elements
const ticketsTableBody = document.getElementById('ticketsTableBody');
const searchInput = document.getElementById('searchInput');
const loadingIndicator = document.getElementById('loadingIndicator');
const sortBtn = document.querySelector('.sort-btn');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadTickets();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', handleSearch);
    
    // Sort button (placeholder for future implementation)
    sortBtn.addEventListener('click', handleSort);
}

// Load tickets from API
async function loadTickets() {
    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/tickets`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        allTickets = await response.json();
        filteredTickets = [...allTickets];
        renderTickets(filteredTickets);
        showLoading(false);
    } catch (error) {
        console.error('Error loading tickets:', error);
        showError('Failed to load tickets. Please try again.');
        showLoading(false);
    }
}

// Render tickets in the table
function renderTickets(tickets) {
    if (!tickets || tickets.length === 0) {
        ticketsTableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: #666;">
                    No tickets found
                </td>
            </tr>
        `;
        return;
    }

    ticketsTableBody.innerHTML = tickets.map(ticket => `
        <tr onclick="handleTicketClick('${ticket.id}')" data-ticket-id="${ticket.id}">
            <td>
                <div class="request-id">
                    <svg class="priority-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" fill="currentColor"/>
                    </svg>
                    ${ticket.id}
                </div>
            </td>
            <td>${ticket.date}</td>
            <td>
                <span class="category ${getCategoryClass(ticket.category)}">
                    ${ticket.category}
                </span>
            </td>
            <td>
                <span class="department">${ticket.department}</span>
            </td>
            <td>
                <span class="status ${getStatusClass(ticket.status)}">
                    ${ticket.status}
                </span>
            </td>
            <td>
                <div class="assigned-user">
                    <img src="${ticket.assigned.avatar}" alt="${ticket.assigned.name}" loading="lazy">
                    <span class="name">${ticket.assigned.name}</span>
                </div>
            </td>
        </tr>
    `).join('');
}

// Handle ticket click
function handleTicketClick(ticketId) {
    console.log('Ticket clicked:', ticketId);
    
    // Add visual feedback
    const row = document.querySelector(`tr[data-ticket-id="${ticketId}"]`);
    if (row) {
        row.style.backgroundColor = '#f0f8ff';
        setTimeout(() => {
            row.style.backgroundColor = '';
        }, 200);
    }
    
    // Navigate to ticket detail page
    window.location.href = `details.html?id=${ticketId}`;
}

// Handle search
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredTickets = [...allTickets];
    } else {
        filteredTickets = allTickets.filter(ticket => {
            return (
                ticket.id.toLowerCase().includes(searchTerm) ||
                ticket.category.toLowerCase().includes(searchTerm) ||
                ticket.department.toLowerCase().includes(searchTerm) ||
                ticket.status.toLowerCase().includes(searchTerm) ||
                ticket.assigned.name.toLowerCase().includes(searchTerm)
            );
        });
    }
    
    renderTickets(filteredTickets);
}

// Handle sort (placeholder)
function handleSort() {
    // This is a placeholder for future sort functionality
    console.log('Sort button clicked');
    
    // Example sort by date (newest first)
    filteredTickets.sort((a, b) => {
        const dateA = new Date(a.date.split('-').reverse().join('-'));
        const dateB = new Date(b.date.split('-').reverse().join('-'));
        return dateB - dateA;
    });
    
    renderTickets(filteredTickets);
    
    // Show feedback
    showNotification('Tickets sorted by date (newest first)');
}

// Utility functions
function getCategoryClass(category) {
    return category.toLowerCase().replace(/\s+/g, '-');
}

function getStatusClass(status) {
    return status.toLowerCase().replace(/\s+/g, '-');
}

function showLoading(show) {
    if (show) {
        loadingIndicator.classList.remove('hidden');
        ticketsTableBody.style.display = 'none';
    } else {
        loadingIndicator.classList.add('hidden');
        ticketsTableBody.style.display = '';
    }
}

function showError(message) {
    ticketsTableBody.innerHTML = `
        <tr>
            <td colspan="6" style="text-align: center; padding: 40px; color: #e53e3e;">
                <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
                    </svg>
                    <strong>${message}</strong>
                    <button onclick="loadTickets()" style="margin-top: 10px; padding: 8px 16px; background: #6c5ce7; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Retry
                    </button>
                </div>
            </td>
        </tr>
    `;
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #38a169;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        font-weight: 500;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => {
            document.body.removeChild(notification);
            document.head.removeChild(style);
        }, 300);
    }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + K to focus search
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        searchInput.focus();
        searchInput.select();
    }
    
    // Escape to clear search
    if (event.key === 'Escape' && document.activeElement === searchInput) {
        searchInput.value = '';
        handleSearch({ target: { value: '' } });
        searchInput.blur();
    }
});

// Add loading class initially
document.addEventListener('DOMContentLoaded', function() {
    loadingIndicator.classList.remove('hidden');
});