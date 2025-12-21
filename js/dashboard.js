// Dashboard Logic

let charts = {};

document.addEventListener('DOMContentLoaded', () => {
    // Check if running from file system
    if (window.location.protocol === 'file:') {
        alert('Error: You are opening this file directly. You MUST run the Flask server (python app.py) and access it via http://localhost:5000 for the dashboard to work.');
        return;
    }

    fetchDashboardData();

    // Auto-refresh every 30 seconds
    setInterval(fetchDashboardData, 30000);
});

async function fetchDashboardData() {
    try {
        const response = await fetch('/api/dashboard/data');
        const data = await response.json();
        updateDashboard(data);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
    }
}

function refreshData() {
    fetchDashboardData();
}

function updateDashboard(data) {
    updateDistributionChart(data.sentiment_counts);
    updateTrendChart(data.sentiment_over_time);
    updateEngagementChart(data.sentiment_over_time); // New chart
    updateVolumeChart(data.sentiment_over_time);
    updateLogsTable(data.recent_logs);
}

function updateDistributionChart(counts) {
    const ctx = document.getElementById('sentimentDistributionChart').getContext('2d');

    const labels = Object.keys(counts);
    const values = Object.values(counts);

    const colors = {
        'Positive': '#10B981', // Emerald 500
        'Neutral': '#9CA3AF',  // Gray 400
        'Negative': '#EF4444'  // Red 500
    };

    const backgroundColors = labels.map(l => colors[l] || '#60A5FA');

    if (charts.distribution) {
        charts.distribution.data.labels = labels;
        charts.distribution.data.datasets[0].data = values;
        charts.distribution.data.datasets[0].backgroundColor = backgroundColors;
        charts.distribution.update();
    } else {
        charts.distribution = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: backgroundColors,
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                cutout: '70%',
                plugins: {
                    legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } },
                    title: { display: false }
                }
            }
        });
    }
}

function updateTrendChart(logs) {
    const ctx = document.getElementById('sentimentTrendChart').getContext('2d');

    // Map sentiment to numeric value for trend line
    const dataPoints = logs.map(log => {
        let val = 0;
        if (log.label === 'Positive') val = 1;
        else if (log.label === 'Negative') val = -1;

        return {
            x: new Date(log.timestamp),
            y: val
        };
    });

    if (charts.trend) {
        charts.trend.data.datasets[0].data = dataPoints;
        charts.trend.update();
    } else {
        charts.trend = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Sentiment Trend',
                    data: dataPoints,
                    borderColor: '#8B5CF6', // Violet 500
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 3,
                    pointHoverRadius: 5
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'time',
                        time: { unit: 'minute', displayFormats: { minute: 'HH:mm' } },
                        grid: { display: false }
                    },
                    y: {
                        min: -1.5,
                        max: 1.5,
                        ticks: {
                            callback: function (value) {
                                if (value === 1) return 'Positive';
                                if (value === 0) return 'Neutral';
                                if (value === -1) return 'Negative';
                                return '';
                            }
                        },
                        grid: { borderDash: [5, 5] }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
}

function updateEngagementChart(logs) {
    // Replaces User vs Bot chart with Engagement Level
    const ctx = document.getElementById('userBotSentimentChart').getContext('2d');

    // Aggregate engagement levels
    const engagementCounts = { high: 0, medium: 0, low: 0 };
    logs.forEach(log => {
        if (log.engagement_level) {
            engagementCounts[log.engagement_level]++;
        }
    });

    const data = [engagementCounts.high, engagementCounts.medium, engagementCounts.low];

    if (charts.engagement) {
        charts.engagement.data.datasets[0].data = data;
        charts.engagement.update();
    } else {
        charts.engagement = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['High Engagement', 'Medium', 'Low (Risk)'],
                datasets: [{
                    label: 'Messages',
                    data: data,
                    backgroundColor: ['#10B981', '#FBBF24', '#EF4444'],
                    borderRadius: 6,
                    barThickness: 40
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true, grid: { display: false } },
                    x: { grid: { display: false } }
                },
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Employee Engagement Levels' }
                }
            }
        });
    }
}

function updateVolumeChart(logs) {
    const ctx = document.getElementById('volumeChart').getContext('2d');

    let userCount = 0;
    let botCount = 0;

    logs.forEach(log => {
        if (log.sender === 'user') userCount++;
        else botCount++;
    });

    if (charts.volume) {
        charts.volume.data.datasets[0].data = [userCount, botCount];
        charts.volume.update();
    } else {
        charts.volume = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['User', 'AI Agent'],
                datasets: [{
                    label: 'Message Volume',
                    data: [userCount, botCount],
                    backgroundColor: ['#3B82F6', '#8B5CF6'],
                    borderRadius: 8,
                    barThickness: 50
                }]
            },
            options: {
                indexAxis: 'y', // Horizontal bar
                responsive: true,
                scales: {
                    x: { beginAtZero: true, grid: { display: false } },
                    y: { grid: { display: false } }
                },
                plugins: { legend: { display: false } }
            }
        });
    }
}

function updateLogsTable(logs) {
    const tbody = document.querySelector('#logsTable tbody');
    tbody.innerHTML = '';

    [...logs].reverse().forEach(log => {
        const tr = document.createElement('tr');
        const date = new Date(log.timestamp);
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        let sentimentClass = 'sentiment-neutral';
        let label = 'Neutral';
        let score = '-';
        let engagement = log.sentiment && log.sentiment.engagement_level ? log.sentiment.engagement_level : 'medium';

        if (log.sentiment) {
            label = log.sentiment.sentiment || 'Neutral';
            if (label === 'Positive') sentimentClass = 'sentiment-positive';
            else if (label === 'Negative') sentimentClass = 'sentiment-negative';

            score = (log.sentiment.score * 100).toFixed(0) + '%';
        }

        tr.innerHTML = `
            <td>${timeStr}</td>
            <td>${log.sender === 'user' ? 'User' : 'AI'}</td>
            <td class="message-cell" title="${log.message}">${log.message}</td>
            <td><span class="sentiment-badge ${sentimentClass}">${label}</span></td>
            <td>${score} <span style="font-size:0.8em; color:#6B7280">(${engagement})</span></td>
        `;
        tbody.appendChild(tr);
    });
}
