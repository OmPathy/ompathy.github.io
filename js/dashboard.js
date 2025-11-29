// Dashboard Logic

let charts = {};

document.addEventListener('DOMContentLoaded', () => {
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
    updateUserBotChart(data.sentiment_over_time);
    updateVolumeChart(data.sentiment_over_time);
    updateLogsTable(data.recent_logs);
}

function updateDistributionChart(counts) {
    const ctx = document.getElementById('sentimentDistributionChart').getContext('2d');

    // Prepare data
    const labels = Object.keys(counts);
    const values = Object.values(counts);

    // Colors mapping (approximate for common labels)
    const backgroundColors = labels.map(label => {
        const l = label.toLowerCase();
        if (l.includes('very positive')) return '#059669';
        if (l.includes('positive')) return '#34D399';
        if (l.includes('neutral')) return '#9CA3AF';
        if (l.includes('negative')) return '#F87171';
        if (l.includes('very negative')) return '#DC2626';
        return '#60A5FA'; // Default blue
    });

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
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }
}

function updateTrendChart(logs) {
    const ctx = document.getElementById('sentimentTrendChart').getContext('2d');

    // Process logs to get sentiment score over time
    // Assuming score is 0-1. We might want to map labels to -1 to 1 for better trend line?
    // For now let's just plot the raw score, maybe color coded by label?
    // Actually, a line chart of "Average Sentiment Score" per bucket would be good, 
    // but let's keep it simple: Plot each message's score.
    // To make it meaningful, let's map labels to a numeric value:
    // Very Positive: 1, Positive: 0.5, Neutral: 0, Negative: -0.5, Very Negative: -1

    const dataPoints = logs.map(log => {
        let val = 0;
        const l = log.label.toLowerCase();
        if (l.includes('very positive')) val = 1;
        else if (l.includes('positive')) val = 0.5;
        else if (l.includes('neutral')) val = 0;
        else if (l.includes('negative')) val = -0.5;
        else if (l.includes('very negative')) val = -1;

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
                    label: 'Sentiment Score',
                    data: dataPoints,
                    borderColor: '#8B5CF6',
                    tension: 0.4,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'time',
                        time: { unit: 'minute' },
                        display: true
                    },
                    y: {
                        min: -1.2,
                        max: 1.2,
                        ticks: {
                            callback: function (value) {
                                if (value === 1) return 'Very Pos';
                                if (value === 0.5) return 'Pos';
                                if (value === 0) return 'Neu';
                                if (value === -0.5) return 'Neg';
                                if (value === -1) return 'Very Neg';
                                return '';
                            }
                        }
                    }
                }
            }
        });
    }
}

function updateUserBotChart(logs) {
    const ctx = document.getElementById('userBotSentimentChart').getContext('2d');

    // Count sentiment types for User vs Bot
    const userCounts = { pos: 0, neu: 0, neg: 0 };
    const botCounts = { pos: 0, neu: 0, neg: 0 };

    logs.forEach(log => {
        const l = log.label.toLowerCase();
        const isPos = l.includes('positive');
        const isNeg = l.includes('negative');
        const isNeu = !isPos && !isNeg;

        const target = log.sender === 'user' ? userCounts : botCounts;

        if (isPos) target.pos++;
        else if (isNeg) target.neg++;
        else target.neu++;
    });

    if (charts.userBot) {
        charts.userBot.data.datasets[0].data = [userCounts.pos, userCounts.neu, userCounts.neg];
        charts.userBot.data.datasets[1].data = [botCounts.pos, botCounts.neu, botCounts.neg];
        charts.userBot.update();
    } else {
        charts.userBot = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Positive', 'Neutral', 'Negative'],
                datasets: [
                    {
                        label: 'User',
                        data: [userCounts.pos, userCounts.neu, userCounts.neg],
                        backgroundColor: '#60A5FA'
                    },
                    {
                        label: 'Bot',
                        data: [botCounts.pos, botCounts.neu, botCounts.neg],
                        backgroundColor: '#34D399'
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
}

function updateVolumeChart(logs) {
    // Simple bar chart of message counts per sender
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
                labels: ['User Messages', 'Bot Messages'],
                datasets: [{
                    label: 'Message Count',
                    data: [userCount, botCount],
                    backgroundColor: ['#60A5FA', '#34D399']
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }
}

function updateLogsTable(logs) {
    const tbody = document.querySelector('#logsTable tbody');
    tbody.innerHTML = '';

    // Show newest first
    [...logs].reverse().forEach(log => {
        const tr = document.createElement('tr');

        const date = new Date(log.timestamp);
        const timeStr = date.toLocaleTimeString();

        let sentimentClass = 'sentiment-neutral';
        let label = 'N/A';
        let score = '-';

        if (log.sentiment) {
            label = log.sentiment.label;
            const l = label.toLowerCase();
            if (l.includes('positive')) sentimentClass = 'sentiment-positive';
            else if (l.includes('negative')) sentimentClass = 'sentiment-negative';

            score = (log.sentiment.score * 100).toFixed(1) + '%';
        }

        tr.innerHTML = `
            <td>${timeStr}</td>
            <td>${log.sender}</td>
            <td style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${log.message}">${log.message}</td>
            <td><span class="sentiment-badge ${sentimentClass}">${label}</span></td>
            <td>${score}</td>
        `;
        tbody.appendChild(tr);
    });
}
