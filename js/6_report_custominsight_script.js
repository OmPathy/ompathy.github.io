// Global variables
let barChart = null;
let pieChart = null;

// DOM elements
const generateBtn = document.getElementById('generateBtn');
const resultsSection = document.getElementById('resultsSection');
const exportBtn = document.getElementById('exportBtn');
const sendBtn = document.getElementById('sendBtn');
const periodSelect = document.getElementById('period');
const departmentSelect = document.getElementById('department');
const keywordsSelect = document.getElementById('keywords');

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    generateBtn.addEventListener('click', handleGenerate);
    exportBtn.addEventListener('click', handleExport);
    sendBtn.addEventListener('click', handleSend);
});

// Generate button handler
async function handleGenerate() {
    const period = periodSelect.value;
    const department = departmentSelect.value;
    const keywords = keywordsSelect.value;
    
    // Show loading state
    generateBtn.innerHTML = '<span class="loading"></span> Generating...';
    generateBtn.disabled = true;
    
    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Get analysis data
        const analysisData = await getAnalysisData(period, department, keywords);
        
        // Show results section
        resultsSection.style.display = 'block';
        resultsSection.classList.add('fade-in');
        
        // Generate charts
        generateCharts(analysisData);
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Error generating analysis:', error);
        alert('Error generating analysis. Please try again.');
    } finally {
        // Reset button state
        generateBtn.innerHTML = 'Generate';
        generateBtn.disabled = false;
    }
}

// Mock API function to get analysis data
async function getAnalysisData(period, department, keywords) {
    // Simulate different data based on selections
    const baseData = {
        workloadSentiment: {
            labels: ['Very Negative', 'Negative', 'Neutral', 'Positive'],
            data: [25, 45, 20, 10],
            colors: ['#dc3545', '#fd7e14', '#6c757d', '#28a745']
        },
        workLifeBalance: {
            resolved: 25,
            unresolved: 75,
            colors: ['#007bff', '#6c757d']
        }
    };
    
    // Modify data based on department
    if (department === 'Engineering') {
        baseData.workloadSentiment.data = [30, 40, 20, 10];
        baseData.workLifeBalance.resolved = 20;
        baseData.workLifeBalance.unresolved = 80;
    } else if (department === 'Sales') {
        baseData.workloadSentiment.data = [20, 35, 25, 20];
        baseData.workLifeBalance.resolved = 35;
        baseData.workLifeBalance.unresolved = 65;
    }
    
    return baseData;
}

// Generate charts
function generateCharts(data) {
    // Destroy existing charts
    if (barChart) {
        barChart.destroy();
    }
    if (pieChart) {
        pieChart.destroy();
    }
    
    // Generate bar chart
    generateBarChart(data.workloadSentiment);
    
    // Generate pie chart
    generatePieChart(data.workLifeBalance);
}

// Generate bar chart for workload sentiment
function generateBarChart(data) {
    const ctx = document.getElementById('barChart').getContext('2d');
    
    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.data,
                backgroundColor: data.colors,
                borderWidth: 0,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    cornerRadius: 6,
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed.y}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#6c757d',
                        font: {
                            size: 12
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 50,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: '#6c757d',
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    });
}

// Generate pie chart for work-life balance
function generatePieChart(data) {
    const ctx = document.getElementById('pieChart').getContext('2d');
    
    pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Resolved', 'Unresolved'],
            datasets: [{
                data: [data.resolved, data.unresolved],
                backgroundColor: data.colors,
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12
                        },
                        color: '#6c757d'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    cornerRadius: 6,
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed}%`;
                        }
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        }
    });
}

// Export button handler
function handleExport() {
    const period = periodSelect.value;
    const department = departmentSelect.value;
    const keywords = keywordsSelect.value;
    
    // Create export data
    const exportData = {
        period: period,
        department: department,
        keywords: keywords,
        timestamp: new Date().toISOString(),
        charts: {
            workloadSentiment: barChart ? barChart.data : null,
            workLifeBalance: pieChart ? pieChart.data : null
        }
    };
    
    // Create and download file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `hr-analysis-${period.replace(' ', '-').toLowerCase()}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Show success message
    showNotification('Report exported successfully!', 'success');
}

// Send button handler
function handleSend() {
    const period = periodSelect.value;
    const department = departmentSelect.value;
    
    // Simulate sending email
    sendBtn.innerHTML = '<span class="loading"></span> Sending...';
    sendBtn.disabled = true;
    
    setTimeout(() => {
        sendBtn.innerHTML = 'Send';
        sendBtn.disabled = false;
        showNotification(`Report sent for ${department} department (${period})!`, 'success');
    }, 2000);
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification-toast ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✅' : 'ℹ️'}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#d4edda' : '#d1ecf1'};
        color: ${type === 'success' ? '#155724' : '#0c5460'};
        padding: 15px 20px;
        border-radius: 8px;
        border: 1px solid ${type === 'success' ? '#c3e6cb' : '#bee5eb'};
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add notification animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-icon {
        font-size: 16px;
    }
    
    .notification-message {
        font-size: 14px;
        font-weight: 500;
    }
`;
document.head.appendChild(style);

// Form validation
function validateForm() {
    const period = periodSelect.value;
    const department = departmentSelect.value;
    const keywords = keywordsSelect.value;
    
    if (!period || !department || !keywords) {
        showNotification('Please fill in all fields before generating the report.', 'error');
        return false;
    }
    
    return true;
}

// Update generate handler to include validation
const originalHandleGenerate = handleGenerate;
handleGenerate = function() {
    if (validateForm()) {
        originalHandleGenerate();
    }
};