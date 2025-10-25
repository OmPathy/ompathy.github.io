// DOM elements
const dropZone = document.getElementById('dropZone');
const selectedTeam = document.getElementById('selectedTeam');
const dropPlaceholder = document.querySelector('.drop-placeholder');
const teamsGrid = document.getElementById('teamsGrid');
const traitsGrid = document.getElementById('traitsGrid');
const tabBtns = document.querySelectorAll('.tab-btn');
const analyzeBtn = document.getElementById('analyzeBtn');
const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');

// Currently selected team
let currentSelectedTeam = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeDragAndDrop();
    initializeDatePickers();
    initializeAnalyzeButton();
    initializeBackButton();
});

// Initialize tab functionality
function initializeTabs() {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', handleTabSwitch);
    });
}

// Handle tab switching
function handleTabSwitch(e) {
    const clickedTab = e.target;
    const tabType = clickedTab.textContent.trim();
    
    // Check if we're currently in the results view
    const analysisResults = document.getElementById('analysisResults');
    const isInResultsView = analysisResults && analysisResults.style.display === 'block';
    
    // If in results view, don't allow tab switching
    if (isInResultsView) {
        return;
    }
    
    // Update active tab
    tabBtns.forEach(btn => btn.classList.remove('active'));
    clickedTab.classList.add('active');
    
    // Clear drop zone
    clearDropZone();
    
    // Update title based on selected tab
    const titleElement = document.querySelector('.analysis-section h2');
    
    // Add fade out effect to current grid
    const currentGrid = teamsGrid.style.display !== 'none' ? teamsGrid : traitsGrid;
    currentGrid.style.opacity = '0';
    
    setTimeout(() => {
        // Switch between grids
        if (tabType === 'BY TEAM') {
            teamsGrid.style.display = 'grid';
            traitsGrid.style.display = 'none';
            titleElement.textContent = 'Find the most effective action plan for the selected team';
            // Update drop zone placeholder text
            updateDropZonePlaceholder('team');
            // Fade in teams grid
            setTimeout(() => {
                teamsGrid.style.opacity = '1';
            }, 50);
        } else if (tabType === 'BY PERSONAL TRAIT') {
            teamsGrid.style.display = 'none';
            traitsGrid.style.display = 'grid';
            titleElement.textContent = 'Analyze employee sentiment based on personal traits';
            // Update drop zone placeholder text
            updateDropZonePlaceholder('trait');
            // Fade in traits grid
            setTimeout(() => {
                traitsGrid.style.opacity = '1';
            }, 50);
        }
        
        // Update drag events for new cards
        updateDragEvents();
    }, 150);
}

// Clear drop zone
function clearDropZone() {
    selectedTeam.textContent = '';
    dropPlaceholder.style.display = 'block';
    dropZone.classList.remove('has-team');
    
    // Remove dimmed effect from all cards
    removeDimmedEffect();
    
    // Reset current selected team
    currentSelectedTeam = null;
    
    // Disable analyze button
    analyzeBtn.disabled = true;
    analyzeBtn.style.opacity = '0.5';
}

// Remove dimmed effect from all cards
function removeDimmedEffect() {
    const allTeamCards = teamsGrid.querySelectorAll('.team-card');
    const allTraitCards = traitsGrid.querySelectorAll('.team-card');
    
    [...allTeamCards, ...allTraitCards].forEach(card => {
        card.classList.remove('dimmed');
    });
}

// Update drop zone placeholder text
function updateDropZonePlaceholder(mode) {
    const placeholderSpans = dropPlaceholder.querySelectorAll('span');
    if (mode === 'team') {
        placeholderSpans[0].textContent = 'Drag & Drop';
        placeholderSpans[1].textContent = 'the Team';
    } else if (mode === 'trait') {
        placeholderSpans[0].textContent = 'Drag & Drop';
        placeholderSpans[1].textContent = 'the Trait';
    }
}

// Initialize drag and drop functionality
function initializeDragAndDrop() {
    // Add events to drop zone
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragenter', handleDragEnter);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);
    
    // Initialize drag events for current cards
    updateDragEvents();
}

// Update drag events for current visible cards
function updateDragEvents() {
    const currentCards = document.querySelectorAll('.team-card');
    currentCards.forEach(card => {
        card.removeEventListener('dragstart', handleDragStart);
        card.removeEventListener('dragend', handleDragEnd);
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
    });
}

// Drag start
function handleDragStart(e) {
    this.classList.add('dragging');
    // Support both team and trait cards
    const dataValue = this.dataset.team || this.dataset.trait;
    const dataType = this.dataset.team ? 'team' : 'trait';
    e.dataTransfer.setData('text/plain', dataValue);
    e.dataTransfer.setData('application/x-card-type', dataType);
    e.dataTransfer.effectAllowed = 'move';
}

// Drag end
function handleDragEnd(e) {
    this.classList.remove('dragging');
}

// Drag over
function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

// Drag enter
function handleDragEnter(e) {
    e.preventDefault();
    dropZone.classList.add('drag-over');
}

// Drag leave
function handleDragLeave(e) {
    if (!dropZone.contains(e.relatedTarget)) {
        dropZone.classList.remove('drag-over');
    }
}

// Drag drop
function handleDrop(e) {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    
    const cardValue = e.dataTransfer.getData('text/plain');
    const cardType = e.dataTransfer.getData('application/x-card-type');
    
    let card;
    if (cardType === 'team') {
        card = document.querySelector(`[data-team="${cardValue}"]`);
    } else if (cardType === 'trait') {
        card = document.querySelector(`[data-trait="${cardValue}"]`);
    }
    
    if (card) {
        selectCard(card, cardType);
    }
}

// Select card (team or trait)
function selectCard(card, cardType) {
    const cardName = card.querySelector('h3').textContent;
    const cardImage = card.querySelector('img').src;
    
    // Update selected item
    currentSelectedTeam = {
        name: cardName,
        image: cardImage,
        type: cardType === 'team' ? card.dataset.team : card.dataset.trait,
        cardType: cardType
    };
    
    // Hide placeholder, show selected item
    dropPlaceholder.style.display = 'none';
    selectedTeam.style.display = 'block';
    selectedTeam.innerHTML = `
        <img src="${cardImage}" alt="${cardName}">
        <div class="team-name">${cardName}</div>
    `;
    
    // Add success animation
    selectedTeam.style.animation = 'fadeInScale 0.5s ease-out';
    
    // Apply dimmed effect to other cards
    applyDimmedEffect(card, cardType);
    
    // Enable analyze button
    analyzeBtn.disabled = false;
    analyzeBtn.style.opacity = '1';
}

// Apply dimmed effect to non-selected cards
function applyDimmedEffect(selectedCard, cardType) {
    const currentGrid = cardType === 'team' ? teamsGrid : traitsGrid;
    const allCards = currentGrid.querySelectorAll('.team-card');
    
    allCards.forEach(card => {
        if (card !== selectedCard) {
            card.classList.add('dimmed');
        } else {
            card.classList.remove('dimmed');
        }
    });
}



// Initialize date pickers
function initializeDatePickers() {
    // Set default dates
    const today = new Date();
    const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
    const currentYear = today.getFullYear();
    
    startDate.value = `01 / ${currentYear}`;
    endDate.value = `12 / ${currentYear}`;
    
    // Add input formatting
    startDate.addEventListener('input', () => formatDateInput(startDate));
    endDate.addEventListener('input', () => formatDateInput(endDate));
    
    // Add validation
    startDate.addEventListener('blur', () => validateDateFormat(startDate));
    endDate.addEventListener('blur', () => validateDateFormat(endDate));
}

// Format date input
function formatDateInput(input) {
    let value = input.value.replace(/\D/g, ''); // Keep only numbers
    
    if (value.length >= 2) {
        value = value.substring(0, 2) + ' / ' + value.substring(2, 6);
    }
    
    input.value = value;
}

// Validate date format
function validateDateFormat(input) {
    const datePattern = /^\d{2}\s\/\s\d{4}$/;
    if (!datePattern.test(input.value) && input.value !== '') {
        input.style.borderBottom = '2px solid #ff4757';
        setTimeout(() => {
            input.style.borderBottom = 'none';
        }, 2000);
    }
}

// Initialize analyze button
function initializeAnalyzeButton() {
    analyzeBtn.disabled = true;
    analyzeBtn.style.opacity = '0.6';
    
    analyzeBtn.addEventListener('click', function() {
        if (currentSelectedTeam && startDate.value && endDate.value) {
            performAnalysis();
        }
    });
}

// Perform analysis
function performAnalysis() {
    // Show loading state
    const originalText = analyzeBtn.textContent;
    analyzeBtn.textContent = 'ANALYZING...';
    analyzeBtn.disabled = true;
    
    // Simulate analysis process
    setTimeout(() => {
        showAnalysisResult();
        analyzeBtn.textContent = originalText;
        analyzeBtn.disabled = false;
    }, 2000);
}

// Show analysis result
function showAnalysisResult() {
    // Hide the main analysis section
    const analysisSection = document.querySelector('.analysis-section');
    const teamsGridSection = document.getElementById('teamsGrid');
    const traitsGridSection = document.getElementById('traitsGrid');
    
    analysisSection.style.display = 'none';
    teamsGridSection.style.display = 'none';
    traitsGridSection.style.display = 'none';
    
    // Show analysis results
    const analysisResults = document.getElementById('analysisResults');
    analysisResults.style.display = 'block';
    
    // Update team info in results
    const resultTeamImage = document.getElementById('resultTeamImage');
    const resultTeamName = document.getElementById('resultTeamName');
    const positivityScore = document.getElementById('positivityScore');
    
    resultTeamImage.src = currentSelectedTeam.image;
    resultTeamImage.alt = currentSelectedTeam.name;
    resultTeamName.textContent = currentSelectedTeam.name;
    
    // Generate random positivity score for demo
    const randomScore = Math.floor(Math.random() * 20) + 80; // 80-99%
    positivityScore.textContent = `${randomScore}%`;
    
    // Add show animation
    setTimeout(() => {
        analysisResults.classList.add('show');
    }, 100);
    
    // Draw the effectiveness chart
    drawEffectivenessChart();
    
    // Initialize Plan it! buttons
    initializePlanItButtons();
    
    // Apply dimmed effect to teams overview
    applyTeamsOverviewEffect();
}

// Draw effectiveness chart
function drawEffectivenessChart() {
    const canvas = document.getElementById('effectivenessChart');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Chart dimensions
    const padding = 20;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    
    // Four effectiveness lines data (representing different metrics/teams)
    // Lines start from inside the bar and extend to the right
    const line1Data = [  // High effectiveness (Purple) - starts from bar at 100
        { x: -0.3, y: 100 },  // Starts inside bar at 100
        { x: 0, y: 95 },      // 2024.01
        { x: 0.2, y: 85 },    
        { x: 0.4, y: 90 },    
        { x: 0.6, y: 95 },    // 2024.06
        { x: 0.8, y: 98 },    
        { x: 1, y: 100 }      // 2025.01
    ];
    
    const line2Data = [  // Medium-High effectiveness (Purple) - starts from bar at 75
        { x: -0.3, y: 75 },   // Starts inside bar at 75
        { x: 0, y: 70 },
        { x: 0.2, y: 65 },
        { x: 0.4, y: 68 },
        { x: 0.6, y: 72 },
        { x: 0.8, y: 74 },
        { x: 1, y: 75 }
    ];
    
    const line3Data = [  // Medium effectiveness (Yellow) - starts from bar at 50
        { x: -0.3, y: 50 },   // Starts inside bar at 50
        { x: 0, y: 48 },
        { x: 0.2, y: 45 },
        { x: 0.4, y: 47 },
        { x: 0.6, y: 49 },
        { x: 0.8, y: 50 },
        { x: 1, y: 50 }
    ];
    
    const line4Data = [  // Low effectiveness (Red) - starts from bar at 25
        { x: -0.3, y: 25 },   // Starts inside bar at 25
        { x: 0, y: 28 },
        { x: 0.2, y: 30 },
        { x: 0.4, y: 28 },
        { x: 0.6, y: 26 },
        { x: 0.8, y: 24 },
        { x: 1, y: 25 }
    ];
    
    // Helper function to draw smooth curves with better curvature
    function drawSmoothCurve(data, color, lineWidth = 3) {
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        
        // Convert data points to canvas coordinates
        // Allow negative x values to start from inside the bar
        const barWidth = 90; // Width of the effectiveness bar
        const points = data.map(point => ({
            x: padding + barWidth * 0.7 + point.x * (chartWidth - barWidth * 0.3),
            y: padding + chartHeight - (point.y / 100) * chartHeight
        }));
        
        if (points.length < 2) return;
        
        // Start the path
        ctx.moveTo(points[0].x, points[0].y);
        
        // Draw smooth curves using bezier curves
        for (let i = 1; i < points.length; i++) {
            const current = points[i];
            const previous = points[i - 1];
            
            if (i === 1) {
                // First curve - use quadratic
                const cpX = previous.x + (current.x - previous.x) * 0.5;
                const cpY = previous.y + (current.y - previous.y) * 0.3;
                ctx.quadraticCurveTo(cpX, cpY, current.x, current.y);
            } else {
                // Use cubic bezier for smoother curves
                const prev2 = points[i - 2];
                const next = points[i + 1] || current;
                
                // Calculate control points for smooth curves
                const cp1X = previous.x + (current.x - prev2.x) * 0.2;
                const cp1Y = previous.y + (current.y - prev2.y) * 0.2;
                const cp2X = current.x - (next.x - previous.x) * 0.2;
                const cp2Y = current.y - (next.y - previous.y) * 0.2;
                
                ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, current.x, current.y);
            }
        }
        ctx.stroke();
    }
    
    // Draw the four effectiveness lines
    drawSmoothCurve(line1Data, '#6c5ce7', 4);  // High - Purple
    drawSmoothCurve(line2Data, '#6c5ce7', 3);  // Medium-High - Purple
    drawSmoothCurve(line3Data, '#ffd700', 3);  // Medium - Yellow
    drawSmoothCurve(line4Data, '#ff6b6b', 3);  // Low - Red
}

// Initialize Plan it! buttons
function initializePlanItButtons() {
    const planItButtons = document.querySelectorAll('.plan-it-btn');
    
    planItButtons.forEach(button => {
        button.addEventListener('click', function() {
            const planItem = this.closest('.action-plan-item');
            const planTitle = planItem.querySelector('h3').textContent;
            
            // Show success feedback
            const originalText = this.textContent;
            this.textContent = 'Planned!';
            this.style.background = '#27ae60';
            this.disabled = true;
            
            // Reset after 2 seconds
            setTimeout(() => {
                this.textContent = originalText;
                this.style.background = '#6c5ce7';
                this.disabled = false;
            }, 2000);
            
            // You can add actual planning logic here
            console.log(`Planning action: ${planTitle}`);
        });
    });
}


// Add CSS animations
const animationStyle = document.createElement('style');
animationStyle.textContent = `
    @keyframes fadeInScale {
        from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(animationStyle);

// Apply teams overview effect based on selected team
function applyTeamsOverviewEffect() {
    const teamCards = document.querySelectorAll('.team-card-result');
    
    if (!currentSelectedTeam) {
        // If no team is selected, show all teams normally
        teamCards.forEach(card => {
            card.classList.remove('dimmed', 'selected');
        });
        return;
    }
    
    teamCards.forEach(card => {
        const teamName = card.querySelector('h4').textContent;
        
        if (teamName === currentSelectedTeam.name) {
            // Selected team: remove dimmed effect and add selected class
            card.classList.remove('dimmed');
            card.classList.add('selected');
        } else {
            // Non-selected teams: add dimmed effect and remove selected class
            card.classList.add('dimmed');
            card.classList.remove('selected');
        }
    });
}

// Initialize back button
function initializeBackButton() {
    const backBtn = document.getElementById('backBtn');
    
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            // Hide analysis results
            const analysisResults = document.getElementById('analysisResults');
            analysisResults.style.display = 'none';
            analysisResults.classList.remove('show');
            
            // Show main analysis section
            const analysisSection = document.querySelector('.analysis-section');
            analysisSection.style.display = 'block';
            
            // Show the appropriate grid based on active tab
            const activeTab = document.querySelector('.tab-btn.active');
            const tabType = activeTab.textContent.trim();
            
            if (tabType === 'BY TEAM') {
                document.getElementById('teamsGrid').style.display = 'grid';
                document.getElementById('traitsGrid').style.display = 'none';
            } else if (tabType === 'BY PERSONAL TRAIT') {
                document.getElementById('teamsGrid').style.display = 'none';
                document.getElementById('traitsGrid').style.display = 'grid';
            }
            
            // Reset analyze button state
            analyzeBtn.disabled = false;
            analyzeBtn.style.opacity = '1';
        });
    }
}