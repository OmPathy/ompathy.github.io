// 全局变量
let feedbackData = {};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    loadFeedbackData();
    setupEventListeners();
});

// 加载反馈数据
async function loadFeedbackData() {
    try {
        const response = await fetch('/api/feedback-data');
        feedbackData = await response.json();
        
        // 初始化表格
        populateFeedbackTable();
        
    } catch (error) {
        console.error('Error loading feedback data:', error);
    }
}

// 设置事件监听器
function setupEventListeners() {
    // Product Management 部门悬停事件
    const productManagementItem = document.querySelector('[data-department="Product Management"]');
    const categoriesSection = document.getElementById('categoriesList');
    
    if (productManagementItem && categoriesSection) {
        productManagementItem.addEventListener('mouseenter', function() {
            categoriesSection.style.display = 'flex';
            categoriesSection.style.flexDirection = 'column';
            categoriesSection.style.gap = '15px';
            
            // 添加动画效果
            categoriesSection.style.opacity = '0';
            categoriesSection.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                categoriesSection.style.transition = 'all 0.3s ease';
                categoriesSection.style.opacity = '1';
                categoriesSection.style.transform = 'translateY(0)';
            }, 10);
        });
        
        // 当鼠标离开整个categories-section区域时隐藏
        const categoriesContainer = document.querySelector('.categories-section');
        if (categoriesContainer) {
            categoriesContainer.addEventListener('mouseleave', function() {
                categoriesSection.style.transition = 'all 0.3s ease';
                categoriesSection.style.opacity = '0';
                categoriesSection.style.transform = 'translateY(-10px)';
                
                setTimeout(() => {
                    categoriesSection.style.display = 'none';
                }, 300);
            });
        }
    }
    
    // 其他部门项的悬停效果
    const departmentItems = document.querySelectorAll('.department-item');
    departmentItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f8f9fa';
            this.style.padding = '8px';
            this.style.borderRadius = '6px';
            this.style.transition = 'all 0.2s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
            this.style.padding = '';
            this.style.borderRadius = '';
        });
    });
}

// 填充反馈表格
function populateFeedbackTable() {
    const tableBody = document.getElementById('feedbackTableBody');
    if (!tableBody || !feedbackData.feedback_tickets) return;
    
    tableBody.innerHTML = '';
    
    feedbackData.feedback_tickets.forEach(ticket => {
        const row = document.createElement('tr');
        
        // 获取优先级样式类
        const priorityClass = ticket.priority_level.toLowerCase();
        
        row.innerHTML = `
            <td>${ticket.ticket_id}</td>
            <td>${ticket.employee}</td>
            <td>${ticket.category}</td>
            <td>${ticket.title}</td>
            <td><span class="sentiment-score">${ticket.sentiment_score}</span></td>
            <td><span class="priority-badge ${priorityClass}">${ticket.priority_level}</span></td>
        `;
        
        tableBody.appendChild(row);
    });
}

// 部门数据更新函数
function updateDepartmentBars() {
    if (!feedbackData.department_feedback) return;
    
    Object.entries(feedbackData.department_feedback).forEach(([department, value]) => {
        const departmentItem = document.querySelector(`[data-department="${department}"]`);
        if (departmentItem) {
            const fill = departmentItem.querySelector('.department-fill');
            if (fill) {
                fill.style.width = `${value}%`;
            }
        }
    });
}

// 优先级数据更新函数
function updatePriorityAnalysis() {
    if (!feedbackData.priority_analysis) return;
    
    const priorityData = feedbackData.priority_analysis;
    
    // 更新计数
    document.querySelector('.priority-item.low .priority-count').textContent = priorityData.low.count;
    document.querySelector('.priority-item.medium .priority-count').textContent = priorityData.medium.count;
    document.querySelector('.priority-item.high .priority-count').textContent = priorityData.high.count;
    
    // 更新百分比条
    document.querySelector('.priority-segment.low').style.width = `${priorityData.low.percentage}%`;
    document.querySelector('.priority-segment.medium').style.width = `${priorityData.medium.percentage}%`;
    document.querySelector('.priority-segment.high').style.width = `${priorityData.high.percentage}%`;
}

// 筛选和排序功能
function setupTableControls() {
    // 这里可以添加表格的排序和筛选功能
    const sortBtn = document.querySelector('.control-btn');
    if (sortBtn) {
        sortBtn.addEventListener('click', function() {
            // 实现排序逻辑
            console.log('Sort functionality to be implemented');
        });
    }
}

// 响应式处理
function handleResize() {
    const width = window.innerWidth;
    const mainContent = document.querySelector('.main-content');
    
    if (width <= 768) {
        mainContent.style.gridTemplateColumns = '1fr';
    } else {
        mainContent.style.gridTemplateColumns = '1fr 1fr';
    }
}

// 监听窗口大小变化
window.addEventListener('resize', handleResize);

// 初始化时调用一次
handleResize();