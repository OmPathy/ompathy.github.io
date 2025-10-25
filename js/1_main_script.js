// Global variables
let currentCalendarIndex = 0;

// 2025 holiday and event data
const events2025 = [
    { date: '2025-01-01', title: 'New Year\'s Day', type: 'holiday', department: null },
    { date: '2025-01-15', title: 'Quarterly Review', type: 'event', department: 'HR' },
    { date: '2025-01-20', title: 'Martin Luther King Jr. Day', type: 'holiday', department: null },
    { date: '2025-02-14', title: 'Valentine\'s Day Event', type: 'event', department: 'Marketing' },
    { date: '2025-02-17', title: 'Presidents\' Day', type: 'holiday', department: null },
    { date: '2025-03-08', title: 'Women\'s Day Celebration', type: 'event', department: 'HR' },
    { date: '2025-03-15', title: 'Team Building', type: 'event', department: 'Marketing' },
    { date: '2025-03-20', title: 'Spring Training', type: 'event', department: 'Sales' },
    { date: '2025-04-01', title: 'Q1 Results Meeting', type: 'event', department: 'Finance' },
    { date: '2025-04-15', title: 'Performance Review', type: 'event', department: 'Sales' },
    { date: '2025-04-22', title: 'Earth Day Initiative', type: 'event', department: 'Operations' },
    { date: '2025-05-01', title: 'May Day Celebration', type: 'event', department: 'HR' },
    { date: '2025-05-15', title: 'Customer Appreciation', type: 'event', department: 'Customer Support' },
    { date: '2025-05-26', title: 'Memorial Day', type: 'holiday', department: null },
    { date: '2025-06-15', title: 'Mid-Year Review', type: 'event', department: 'HR' },
    { date: '2025-06-21', title: 'Summer Kickoff', type: 'event', department: 'Marketing' },
    { date: '2025-07-04', title: 'Independence Day', type: 'holiday', department: null },
    { date: '2025-07-15', title: 'Q2 Results Meeting', type: 'event', department: 'Finance' },
    { date: '2025-08-15', title: 'Back to School Drive', type: 'event', department: 'HR' },
    { date: '2025-09-01', title: 'Labor Day', type: 'holiday', department: null },
    { date: '2025-09-15', title: 'Fall Planning Session', type: 'event', department: 'Operations' },
    { date: '2025-09-23', title: 'Team Building', type: 'event', department: 'Marketing' },
    { date: '2025-09-24', title: 'Performance Review', type: 'event', department: 'Sales' },
    { date: '2025-09-24', title: 'Performance Review', type: 'event', department: 'Finance' },
    { date: '2025-10-13', title: 'Columbus Day', type: 'holiday', department: null },
    { date: '2025-10-31', title: 'Halloween Party', type: 'event', department: 'HR' },
    { date: '2025-11-11', title: 'Veterans Day', type: 'holiday', department: null },
    { date: '2025-11-15', title: 'Q3 Results Meeting', type: 'event', department: 'Finance' },
    { date: '2025-11-27', title: 'Thanksgiving', type: 'holiday', department: null },
    { date: '2025-12-15', title: 'Holiday Party', type: 'event', department: 'HR' },
    { date: '2025-12-20', title: 'Year-End Review', type: 'event', department: 'Operations' },
    { date: '2025-12-25', title: 'Christmas Day', type: 'holiday', department: null },
    { date: '2025-12-31', title: 'New Year\'s Eve Party', type: 'event', department: 'HR' }
];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    initializeInteractions();
    initializeCalendar();
});

// Initialize charts
function initializeCharts() {
    drawMoodChart();
    drawAgeChart();
    drawTenureChart();
    drawDistributionChart();
}

// Draw emotion trend chart
function drawMoodChart() {
    const canvas = document.getElementById('moodChart');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 400;
    canvas.height = 200;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Data points
    const dataPoints = [
        { x: 50, y: 120, value: 65 },
        { x: 100, y: 100, value: 70 },
        { x: 150, y: 80, value: 75 },
        { x: 200, y: 60, value: 80 },
        { x: 250, y: 70, value: 78 },
        { x: 300, y: 50, value: 85 },
        { x: 350, y: 40, value: 89 }
    ];
    
    // Draw grid lines
    ctx.strokeStyle = '#f1f2f6';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = (canvas.height / 5) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    
    // Draw line chart
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(dataPoints[0].x, dataPoints[0].y);
    
    for (let i = 1; i < dataPoints.length; i++) {
        ctx.lineTo(dataPoints[i].x, dataPoints[i].y);
    }
    ctx.stroke();
    
    // Draw data points
    dataPoints.forEach(point => {
        ctx.fillStyle = '#667eea';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    // Draw bar chart (response rate)
    const barData = [0.8, 0.6, 0.7, 0.9, 0.8, 0.95, 0.85];
    ctx.fillStyle = '#a8edea';
    
    barData.forEach((height, index) => {
        const x = 50 + index * 50;
        const barHeight = height * 60;
        const y = canvas.height - barHeight - 20;
        ctx.fillRect(x - 10, y, 20, barHeight);
    });
}

// Draw age distribution pie chart
function drawAgeChart() {
    const canvas = document.getElementById('ageChart');
    const ctx = canvas.getContext('2d');
    
    // Set high resolution
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = 200 * dpr;
    canvas.height = 200 * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = '200px';
    canvas.style.height = '200px';
    
    const centerX = 100;
    const centerY = 100;
    const outerRadius = 90;
    const innerRadius = 30;
    
    const data = [
        { label: '20-35', value: 30, color: '#c7b3ff' },
        { label: '36-45', value: 40, color: '#9c88ff' },
        { label: '46+', value: 30, color: '#6c5ce7' }
    ];
    
    let currentAngle = 0;
    
    data.forEach((segment, index) => {
        const sliceAngle = (segment.value / 100) * 2 * Math.PI;
        
        ctx.fillStyle = segment.color;
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, currentAngle, currentAngle + sliceAngle);
        ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
        ctx.closePath();
        ctx.fill();
        
        // Add special indicator line and label for Over 8 yrs
        if (segment.label === '8+ yrs') {
            const labelAngle = currentAngle + sliceAngle / 2;
            const startX = centerX + Math.cos(labelAngle) * outerRadius;
            const startY = centerY + Math.sin(labelAngle) * outerRadius;
            const endX = centerX + Math.cos(labelAngle) * (outerRadius + 30);
            const endY = centerY + Math.sin(labelAngle) * (outerRadius + 30);
            
            // Draw indicator line
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            
            // Draw external label
            ctx.fillStyle = '#333';
            ctx.font = 'bold 14px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Over 8 yrs', endX, endY - 8);
            ctx.font = '12px Arial, sans-serif';
            ctx.fillText('(20%)', endX, endY + 6);
        } else {
            // Other labels display normally within sectors
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelRadius = (outerRadius + innerRadius) / 2;
            const labelX = centerX + Math.cos(labelAngle) * labelRadius;
            const labelY = centerY + Math.sin(labelAngle) * labelRadius;
            
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 14px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(segment.label, labelX, labelY - 6);
            ctx.font = '12px Arial, sans-serif';
            ctx.fillText(`(${segment.value}%)`, labelX, labelY + 8);
        }
        
        currentAngle += sliceAngle;
    });
    
    // Add total employee count text in center
    ctx.fillStyle = '#333';
    ctx.font = 'bold 12px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('1,459', centerX, centerY - 4);
    
    ctx.font = '10px Arial, sans-serif';
    ctx.fillText('Employees', centerX, centerY + 6);
    
    // Add click event with sector detection
    canvas.addEventListener('click', function(e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate distance from center and angle
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Check if click is within the donut area
        if (distance >= innerRadius && distance <= outerRadius) {
            let angle = Math.atan2(dy, dx);
            if (angle < 0) angle += 2 * Math.PI;
            
            // Determine which sector was clicked
            let currentAngle = 0;
            for (let i = 0; i < data.length; i++) {
                const sliceAngle = (data[i].value / 100) * 2 * Math.PI;
                if (angle >= currentAngle && angle < currentAngle + sliceAngle) {
                    showAgeSegmentDetails(data[i].label);
                    return;
                }
                currentAngle += sliceAngle;
            }
        }
    });
}

// Draw tenure distribution pie chart
function drawTenureChart() {
    const canvas = document.getElementById('tenureChart');
    const ctx = canvas.getContext('2d');
    
    // Set high resolution
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const outerRadius = 90;
    const innerRadius = 30;
    
    const data = [
        { label: '1-3 yrs', value: 40, color: '#c7b3ff' },
        { label: '4-7 yrs', value: 40, color: '#9c88ff' },
        { label: '8+ yrs', value: 20, color: '#6c5ce7' }
    ];
    
    let currentAngle = 0;
    
    data.forEach(segment => {
        const sliceAngle = (segment.value / 100) * 2 * Math.PI;
        
        ctx.fillStyle = segment.color;
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, currentAngle, currentAngle + sliceAngle);
        ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
        ctx.closePath();
        ctx.fill();
        
        // All labels display normally within sectors
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelRadius = (outerRadius + innerRadius) / 2;
        const labelX = centerX + Math.cos(labelAngle) * labelRadius;
        const labelY = centerY + Math.sin(labelAngle) * labelRadius;
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(segment.label, labelX, labelY - 6);
        ctx.font = '12px Arial, sans-serif';
        ctx.fillText(`(${segment.value}%)`, labelX, labelY + 8);
        
        currentAngle += sliceAngle;
    });
    
    // Add total employee count text in center
    ctx.fillStyle = '#333';
    ctx.font = 'bold 12px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('1,459', centerX, centerY - 4);
    
    ctx.font = '10px Arial, sans-serif';
    ctx.fillText('Employees', centerX, centerY + 6);
    
    // Add click event with sector detection
    canvas.addEventListener('click', function(e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate distance from center and angle
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Check if click is within the donut area
        if (distance >= innerRadius && distance <= outerRadius) {
            let angle = Math.atan2(dy, dx);
            if (angle < 0) angle += 2 * Math.PI;
            
            // Determine which sector was clicked
            let currentAngle = 0;
            for (let i = 0; i < data.length; i++) {
                const sliceAngle = (data[i].value / 100) * 2 * Math.PI;
                if (angle >= currentAngle && angle < currentAngle + sliceAngle) {
                    showTenureSegmentDetails(data[i].label);
                    return;
                }
                currentAngle += sliceAngle;
            }
        }
    });
}

// Draw emotion distribution chart
function drawDistributionChart() {
    const canvas = document.getElementById('distributionChart');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 300;
    canvas.height = 150;
    
    // Draw normal distribution curve
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const mean = canvas.width * 0.79; // 79% position
    const stdDev = 40;
    
    for (let x = 0; x < canvas.width; x++) {
        const y = normalDistribution(x, mean, stdDev) * canvas.height * 0.8;
        if (x === 0) {
            ctx.moveTo(x, canvas.height - y);
        } else {
            ctx.lineTo(x, canvas.height - y);
        }
    }
    ctx.stroke();
    
    // Draw average line
    ctx.strokeStyle = '#ff4757';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(mean, 0);
    ctx.lineTo(mean, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

// Normal distribution function
function normalDistribution(x, mean, stdDev) {
    return Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2)) / (stdDev * Math.sqrt(2 * Math.PI));
}

// Initialize interactive features
function initializeInteractions() {
    // Emotion emoji interaction
    const emojiItems = document.querySelectorAll('.emoji-item');
    emojiItems.forEach(emoji => {
        emoji.addEventListener('click', function() {
            const mood = this.dataset.mood;
            showMoodDetails(mood);
        });
    });
    
    // Key Insights click events
    const insightItems = document.querySelectorAll('.insight-item.clickable');
    insightItems.forEach(item => {
        item.addEventListener('click', function() {
            const insightType = this.dataset.insight;
            showInsightDetails(insightType);
        });
    });
    
    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            updateDistributionChart(this.textContent);
        });
    });
    

}

// Show emotion details
function showMoodDetails(mood) {
    const moodMessages = {
        angry: 'Show detailed analysis and recommendations for angry emotions',
        sad: 'Show detailed analysis and recommendations for sad emotions',
        neutral: 'Show detailed analysis for neutral emotions',
        happy: 'Show detailed analysis for happy emotions',
        excited: 'Show detailed analysis for excited emotions'
    };
    
    showCustomModal(`Emotion Analysis - ${mood.toUpperCase()}`, moodMessages[mood]);
}

// Show insight details
function showInsightDetails(insightType) {
    const insightDetails = {
        overall: 'Overall emotion trend detailed report:\n- Employee satisfaction continues to rise\n- Work environment improvement shows significant results\n- Recommend continuing current strategy',
        departmental: 'Department insight detailed report:\n- Marketing team building activities show significant results\n- Sales department needs attention to work pressure\n- Customer service department performance is stable',
        challenges: 'Key challenges detailed analysis:\n- IT department workload is excessive\n- Need to increase staffing\n- Recommend implementing workflow optimization'
    };
    
    showCustomModal('Insight Details', insightDetails[insightType]);
}

// Show age details
function showAgeDetails() {
    const content = `20-35 years: 1,459 employees (30%)
- Mainly concentrated in technology and marketing departments
- Strong learning ability and good adaptability

36-45 years: 1,946 employees (40%)
- Experienced backbone force
- High proportion in management positions

46+ years: 1,459 employees (30%)
- Senior experts and consultants
- Important role in knowledge transfer`;
    
    showCustomModal('Age Distribution Details', content);
}

// Show detailed information for specific age segments
function showAgeSegmentDetails(segment) {
    let title = '';
    let content = '';
    
    switch(segment) {
        case '20-35':
            title = 'Young Professionals (20-35 years)';
            content = `Employee Count: 438 employees (30%)

Key Characteristics:
• Digital natives with strong tech adaptation skills
• High energy and enthusiasm for innovation
• Concentrated in Technology, Marketing, and Design departments
• Strong learning curve and quick skill acquisition

Performance Metrics:
• Average productivity score: 85/100
• Training completion rate: 94%
• Career advancement rate: 78% within 2 years
• Employee satisfaction: 4.2/5.0

Development Focus:
• Leadership development programs
• Cross-functional project assignments
• Mentorship opportunities with senior staff
• Professional certification support`;
            break;
            
        case '36-45':
            title = 'Mid-Career Professionals (36-45 years)';
            content = `Employee Count: 583 employees (40%)

Key Characteristics:
• Experienced backbone of the organization
• Strong balance of technical skills and business acumen
• High representation in management and senior roles
• Excellent mentoring capabilities for junior staff

Performance Metrics:
• Average productivity score: 92/100
• Management effectiveness rating: 4.5/5.0
• Project success rate: 89%
• Employee retention rate: 96%

Leadership Roles:
• 65% hold team lead or management positions
• Key decision makers in strategic initiatives
• Primary drivers of organizational culture
• Champions of process improvement initiatives`;
            break;
            
        case '46+':
            title = 'Senior Experts (46+ years)';
            content = `Employee Count: 438 employees (30%)

Key Characteristics:
• Deep industry expertise and institutional knowledge
• Strategic thinking and long-term planning capabilities
• Excellent problem-solving skills from extensive experience
• Key role in knowledge transfer and succession planning

Performance Metrics:
• Average productivity score: 88/100
• Knowledge sharing index: 95/100
• Strategic project success rate: 94%
• Mentorship effectiveness: 4.7/5.0

Strategic Value:
• Subject matter experts in specialized domains
• Critical for complex problem resolution
• Key advisors for major business decisions
• Essential for maintaining organizational continuity`;
            break;
    }
    
    // Create and show custom modal
    showCustomModal(title, content);
}

// Custom modal function for better presentation
function showCustomModal(title, content) {
    // Remove existing modal if any
    const existingModal = document.getElementById('customModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal HTML
    const modal = document.createElement('div');
    modal.id = 'customModal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="closeCustomModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <pre>${content}</pre>
                </div>
                <div class="modal-footer">
                    <button class="modal-btn" onclick="closeCustomModal()">OK</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Close modal function
function closeCustomModal() {
    const modal = document.getElementById('customModal');
    if (modal) {
        modal.remove();
    }
}

// Show detailed information for specific tenure segments
function showTenureSegmentDetails(segment) {
    let title = '';
    let content = '';
    
    switch(segment) {
        case '1-3 yrs':
            title = 'New Employees (1-3 years)';
            content = `Employee Count: 584 employees (40%)

Key Characteristics:
• Fresh perspectives and innovative thinking
• High motivation and eagerness to learn
• Strong adaptability to company culture and processes
• Active participation in training and development programs

Performance Metrics:
• Average productivity score: 78/100
• Training completion rate: 96%
• Goal achievement rate: 82%
• Employee satisfaction: 4.1/5.0

Development Areas:
• Skill building and competency development
• Integration into team dynamics
• Understanding of company processes and systems
• Building professional networks within the organization

Growth Opportunities:
• Mentorship programs with senior colleagues
• Cross-departmental project assignments
• Professional development workshops
• Career path planning sessions`;
            break;
            
        case '4-7 yrs':
            title = 'Experienced Professionals (4-7 years)';
            content = `Employee Count: 583 employees (40%)

Key Characteristics:
• Solid understanding of company operations and culture
• Proven track record of successful project delivery
• Strong technical and professional competencies
• Emerging leadership capabilities and team collaboration skills

Performance Metrics:
• Average productivity score: 89/100
• Project success rate: 91%
• Leadership potential score: 4.3/5.0
• Employee retention rate: 94%

Leadership Development:
• 45% are in senior individual contributor roles
• 25% have moved into team lead positions
• Key contributors to process improvement initiatives
• Mentors for newer employees

Strategic Value:
• Bridge between junior staff and senior management
• Subject matter experts in their respective domains
• Champions of organizational change and innovation
• Critical for knowledge transfer and continuity`;
            break;
            
        case '8+ yrs':
            title = 'Veteran Employees (8+ years)';
            content = `Employee Count: 292 employees (20%)

Key Characteristics:
• Deep institutional knowledge and company expertise
• Strong leadership and strategic thinking capabilities
• Extensive professional networks and industry connections
• Key decision makers and organizational culture carriers

Performance Metrics:
• Average productivity score: 93/100
• Strategic initiative success rate: 96%
• Leadership effectiveness rating: 4.6/5.0
• Knowledge sharing index: 98/100

Leadership Roles:
• 70% hold management or senior leadership positions
• Primary drivers of long-term strategic planning
• Key stakeholders in major organizational decisions
• Champions of company values and culture

Organizational Impact:
• Critical for maintaining institutional memory
• Essential for complex problem-solving and crisis management
• Key advisors for business strategy and direction
• Instrumental in succession planning and talent development`;
            break;
    }
    
    // Create and show custom modal
    showCustomModal(title, content);
}

// Update distribution charts
function updateDistributionChart(chartType) {
    const canvas = document.getElementById('distributionChart');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let mean, color;
    switch(chartType) {
        case 'Sentiment Score':
            mean = canvas.width * 0.79;
            color = '#667eea';
            break;
        case 'Burnout Risk Score':
            mean = canvas.width * 0.35;
            color = '#ff4757';
            break;
        case 'Response Rate':
            mean = canvas.width * 0.85;
            color = '#10ac84';
            break;
    }
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const stdDev = 40;
    
    for (let x = 0; x < canvas.width; x++) {
        const y = normalDistribution(x, mean, stdDev) * canvas.height * 0.8;
        if (x === 0) {
            ctx.moveTo(x, canvas.height - y);
        } else {
            ctx.lineTo(x, canvas.height - y);
        }
    }
    ctx.stroke();
}



// Toggle Marketing Department detailed action plan
function toggleMarketingPlan() {
    const detailsElement = document.getElementById('marketing-details');
    const arrowElement = document.getElementById('marketing-arrow');
    
    if (detailsElement.classList.contains('show')) {
        // Hide the details
        detailsElement.classList.remove('show');
        arrowElement.classList.remove('rotated');
        arrowElement.textContent = '▼';
    } else {
        // Show the details
        detailsElement.classList.add('show');
        arrowElement.classList.add('rotated');
        arrowElement.textContent = '▲';
    }
}

// Toggle Sales Department detailed action plan
function toggleSalesPlan() {
    const detailsElement = document.getElementById('sales-details');
    const arrowElement = document.getElementById('sales-arrow');
    
    if (detailsElement.classList.contains('show')) {
        // Hide the details
        detailsElement.classList.remove('show');
        arrowElement.classList.remove('rotated');
        arrowElement.textContent = '▼';
    } else {
        // Show the details
        detailsElement.classList.add('show');
        arrowElement.classList.add('rotated');
        arrowElement.textContent = '▲';
    }
}

// Toggle Customer Support Department detailed action plan
function toggleSupportPlan() {
    const detailsElement = document.getElementById('support-details');
    const arrowElement = document.getElementById('support-arrow');
    
    if (detailsElement.classList.contains('show')) {
        // Hide the details
        detailsElement.classList.remove('show');
        arrowElement.classList.remove('rotated');
        arrowElement.textContent = '▼';
    } else {
        // Show the details
        detailsElement.classList.add('show');
        arrowElement.classList.add('rotated');
        arrowElement.textContent = '▲';
    }
}

// Initialize calendar
function initializeCalendar() {
    updateCalendarDisplay();
    
    // Add navigation button events
    document.getElementById('prevBtn').addEventListener('click', function() {
        currentCalendarIndex = Math.max(0, currentCalendarIndex - 1);
        updateCalendarDisplay();
    });
    
    document.getElementById('nextBtn').addEventListener('click', function() {
        const maxIndex = Math.max(0, events2025.length - 5);
        currentCalendarIndex = Math.min(maxIndex, currentCalendarIndex + 1);
        updateCalendarDisplay();
    });
}

// Update calendar display
function updateCalendarDisplay() {
    const calendarEvents = document.querySelector('.calendar-events');
    calendarEvents.innerHTML = '';
    
    // Show 5 events
    for (let i = 0; i < 5; i++) {
        const eventIndex = currentCalendarIndex + i;
        if (eventIndex < events2025.length) {
            const event = events2025[eventIndex];
            const eventCard = createEventCard(event, eventIndex);
            calendarEvents.appendChild(eventCard);
        }
    }
}

// Create event card
function createEventCard(event, index) {
    const card = document.createElement('div');
    card.className = 'event-card';
    
    // Add department type attribute to apply different colors
    if (event.department) {
        card.setAttribute('data-type', event.department);
    }
    
    // Determine if it's a past event
    const eventDate = new Date(event.date);
    const today = new Date();
    if (eventDate < today) {
        card.classList.add('past');
    }
    
    // Highlight special events
    if (event.title === 'Thanksgiving' || event.title === 'Christmas Day') {
        card.classList.add('highlighted');
    }
    
    const formattedDate = formatEventDate(event.date);
    const daysUntil = calculateDaysUntil(event.date);
    
    card.innerHTML = `
        <div class="event-date">${formattedDate}</div>
        <div class="event-title">${event.title}</div>
        ${event.department ? `<div class="event-subtitle">(${event.department})</div>` : ''}
        <div class="event-type">(${daysUntil})</div>
        ${event.title === 'Thanksgiving' ? '<button class="plan-btn">Plan it!</button>' : ''}
    `;
    
    // Add click event
    card.addEventListener('click', function() {
        showEventDetails(event);
    });
    
    return card;
}

// Format event date
function formatEventDate(dateString) {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// Calculate days until event
function calculateDaysUntil(dateString) {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
        return `H${Math.abs(diffDays)}`;
    } else {
        return `D-${diffDays}`;
    }
}

// Show event details
function showEventDetails(event) {
    let details = `Date: ${formatEventDate(event.date)}
Title: ${event.title}
Type: ${event.type === 'holiday' ? 'Holiday' : 'Event'}`;
    
    if (event.department) {
        details += `\nDepartment: ${event.department}`;
    }
    
    const daysUntil = calculateDaysUntil(event.date);
    details += `\nDays until: ${daysUntil}`;
    
    if (event.type === 'holiday') {
        details += `\n\nThis is a public holiday, all employees can rest.`;
    } else {
        details += `\n\nThis is a department event, please prepare accordingly.`;
    }
    
    showCustomModal('Event Details', details);
}

// Add some additional interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects
    const cards = document.querySelectorAll('.card, .event-card, .insight-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        });
    });
    
    // Add loading animation
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.5s ease-in-out';
    }, 100);
});