// Template Library JavaScript Functionality

class TemplateLibrary {
    constructor() {
        this.templates = [];
        this.filteredTemplates = [];
        this.currentCategory = 'all';
        this.currentSort = 'popular';
        this.searchTerm = '';
        
        this.init();
    }

    init() {
        this.loadTemplates();
        this.setupEventListeners();
        this.renderTemplates();
    }

    loadTemplates() {
        // Mock template data - in a real app, this would come from an API
        this.templates = [
            {
                id: 1,
                name: 'Emotion Selection Templates',
                category: 'emotion',
                popularity: 95,
                dateCreated: new Date('2024-01-15'),
                description: 'Interactive emoji-based emotion selection templates'
            },
            {
                id: 2,
                name: 'Simple Response Templates',
                category: 'response',
                popularity: 88,
                dateCreated: new Date('2024-01-10'),
                description: 'Yes/No and simple binary response templates'
            },
            {
                id: 3,
                name: 'Scale-Based Response Templates',
                category: 'scale',
                popularity: 92,
                dateCreated: new Date('2024-01-20'),
                description: 'Rating scales and gradient response templates'
            },
            {
                id: 4,
                name: 'Descriptive Response Templates',
                category: 'descriptive',
                popularity: 78,
                dateCreated: new Date('2024-01-05'),
                description: 'Word cloud and text-based response templates'
            },
            {
                id: 5,
                name: 'Follow-Up Templates',
                category: 'followup',
                popularity: 85,
                dateCreated: new Date('2024-01-12'),
                description: 'Follow-up and reminder templates'
            },
            {
                id: 6,
                name: 'Contextual Response Templates',
                category: 'contextual',
                popularity: 90,
                dateCreated: new Date('2024-01-18'),
                description: 'Context-aware and dynamic response templates'
            }
        ];
        
        this.filteredTemplates = [...this.templates];
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.filterAndSort();
        });

        // Category dropdown
        const categoryBtn = document.getElementById('categoryBtn');
        const categoryDropdown = document.getElementById('categoryDropdown');
        
        categoryBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown(categoryDropdown);
        });

        categoryDropdown.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                e.preventDefault();
                const value = e.target.getAttribute('data-value');
                this.currentCategory = value;
                categoryBtn.innerHTML = `Category: ${this.getCategoryDisplayName(value)} <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M7 10L12 15L17 10H7Z" fill="#666"/></svg>`;
                this.hideDropdown(categoryDropdown);
                this.filterAndSort();
            }
        });

        // Sort dropdown
        const sortBtn = document.getElementById('sortBtn');
        const sortDropdown = document.getElementById('sortDropdown');
        
        sortBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown(sortDropdown);
        });

        sortDropdown.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                e.preventDefault();
                const value = e.target.getAttribute('data-value');
                this.currentSort = value;
                sortBtn.innerHTML = `Sort: ${this.getSortDisplayName(value)} <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M7 10L12 15L17 10H7Z" fill="#666"/></svg>`;
                this.hideDropdown(sortDropdown);
                this.filterAndSort();
            }
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', () => {
            this.hideDropdown(categoryDropdown);
            this.hideDropdown(sortDropdown);
        });

        // Template card clicks
        document.addEventListener('click', (e) => {
            const templateCard = e.target.closest('.template-card');
            if (templateCard) {
                this.handleTemplateClick(templateCard);
            }
        });

        // Template button clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('template-btn')) {
                e.stopPropagation();
                this.handleTemplateButtonClick(e.target);
            }
        });

        // More templates button
        const moreBtn = document.getElementById('moreBtn');
        moreBtn.addEventListener('click', () => {
            this.loadMoreTemplates();
        });

        // Interactive elements within templates
        this.setupTemplateInteractions();
    }

    setupTemplateInteractions() {
        // Emoji interactions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('emoji')) {
                e.stopPropagation();
                this.handleEmojiClick(e.target);
            }
        });

        // Scale segment interactions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('scale-segment')) {
                e.stopPropagation();
                this.handleScaleClick(e.target);
            }
        });

        // Response sign interactions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('sign')) {
                e.stopPropagation();
                this.handleResponseClick(e.target);
            }
        });

        // Word cloud interactions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('word')) {
                e.stopPropagation();
                this.handleWordClick(e.target);
            }
        });
    }

    toggleDropdown(dropdown) {
        dropdown.classList.toggle('show');
    }

    hideDropdown(dropdown) {
        dropdown.classList.remove('show');
    }

    getCategoryDisplayName(value) {
        const names = {
            'all': 'All',
            'emotion': 'Emotion Selection',
            'response': 'Simple Response',
            'scale': 'Scale-Based Response',
            'descriptive': 'Descriptive Response',
            'followup': 'Follow-Up',
            'contextual': 'Contextual Response'
        };
        return names[value] || value;
    }

    getSortDisplayName(value) {
        const names = {
            'popular': 'Popular',
            'newest': 'Newest',
            'oldest': 'Oldest',
            'name': 'Name A-Z'
        };
        return names[value] || value;
    }

    filterAndSort() {
        // Filter by category
        let filtered = this.templates;
        if (this.currentCategory !== 'all') {
            filtered = filtered.filter(template => template.category === this.currentCategory);
        }

        // Filter by search term
        if (this.searchTerm) {
            filtered = filtered.filter(template => 
                template.name.toLowerCase().includes(this.searchTerm) ||
                template.description.toLowerCase().includes(this.searchTerm)
            );
        }

        // Sort
        switch (this.currentSort) {
            case 'popular':
                filtered.sort((a, b) => b.popularity - a.popularity);
                break;
            case 'newest':
                filtered.sort((a, b) => b.dateCreated - a.dateCreated);
                break;
            case 'oldest':
                filtered.sort((a, b) => a.dateCreated - b.dateCreated);
                break;
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }

        this.filteredTemplates = filtered;
        this.renderTemplates();
    }

    renderTemplates() {
        const grid = document.getElementById('templateGrid');
        const existingCards = grid.querySelectorAll('.template-card');
        
        // Show/hide existing cards based on filter
        existingCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const shouldShow = this.filteredTemplates.some(template => template.category === category);
            
            if (shouldShow && (this.currentCategory === 'all' || this.currentCategory === category)) {
                card.style.display = 'block';
                
                // Add search highlighting if needed
                if (this.searchTerm) {
                    this.highlightSearchTerm(card);
                } else {
                    this.removeHighlighting(card);
                }
            } else {
                card.style.display = 'none';
            }
        });

        // Add animation for filtered results
        this.animateFilteredResults();
    }

    highlightSearchTerm(card) {
        const button = card.querySelector('.template-btn');
        const text = button.textContent;
        const regex = new RegExp(`(${this.searchTerm})`, 'gi');
        const highlightedText = text.replace(regex, '<mark>$1</mark>');
        button.innerHTML = highlightedText;
    }

    removeHighlighting(card) {
        const button = card.querySelector('.template-btn');
        button.innerHTML = button.textContent;
    }

    animateFilteredResults() {
        const visibleCards = document.querySelectorAll('.template-card[style*="block"], .template-card:not([style*="none"])');
        visibleCards.forEach((card, index) => {
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.animation = `fadeInUp 0.3s ease-out ${index * 0.1}s both`;
            }, 10);
        });
    }

    handleTemplateClick(card) {
        // Add selection effect
        document.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        
        // Add some visual feedback
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);

        console.log('Template card clicked:', card.getAttribute('data-category'));
    }

    handleTemplateButtonClick(button) {
        const templateName = button.textContent;
        
        // Show loading state
        const originalText = button.textContent;
        button.textContent = 'Loading...';
        button.disabled = true;
        
        // Simulate template loading
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
            this.showTemplateModal(templateName);
        }, 1000);
    }

    handleEmojiClick(emoji) {
        // Add selection effect to emoji
        document.querySelectorAll('.emoji').forEach(e => e.classList.remove('selected'));
        emoji.classList.add('selected');
        
        // Add bounce animation
        emoji.style.animation = 'bounce 0.5s ease-out';
        setTimeout(() => {
            emoji.style.animation = '';
        }, 500);

        console.log('Emoji selected:', emoji.textContent);
    }

    handleScaleClick(segment) {
        // Highlight selected segment and all previous ones
        const segments = segment.parentElement.querySelectorAll('.scale-segment');
        const segmentIndex = Array.from(segments).indexOf(segment);
        
        segments.forEach((seg, index) => {
            if (index <= segmentIndex) {
                seg.classList.add('selected');
            } else {
                seg.classList.remove('selected');
            }
        });

        console.log('Scale rating selected:', segmentIndex + 1);
    }

    handleResponseClick(sign) {
        // Add selection effect
        document.querySelectorAll('.sign').forEach(s => s.classList.remove('selected'));
        sign.classList.add('selected');
        
        // Add pulse animation
        sign.style.animation = 'pulse 0.3s ease-out';
        setTimeout(() => {
            sign.style.animation = '';
        }, 300);

        console.log('Response selected:', sign.textContent);
    }

    handleWordClick(word) {
        // Add selection effect
        document.querySelectorAll('.word').forEach(w => w.classList.remove('selected'));
        word.classList.add('selected');
        
        console.log('Word selected:', word.textContent);
    }

    loadMoreTemplates() {
        const moreBtn = document.getElementById('moreBtn');
        const originalText = moreBtn.innerHTML;
        
        // Show loading state
        moreBtn.innerHTML = 'Loading More Templates... <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#666" stroke-width="2" fill="none" stroke-dasharray="31.416" stroke-dashoffset="31.416"><animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/><animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/></circle></svg>';
        moreBtn.disabled = true;
        
        // Simulate loading more templates
        setTimeout(() => {
            moreBtn.innerHTML = originalText;
            moreBtn.disabled = false;
            this.showMoreTemplatesMessage();
        }, 2000);
    }

    showMoreTemplatesMessage() {
        // Create a temporary message
        const message = document.createElement('div');
        message.className = 'load-more-message';
        message.textContent = 'More templates coming soon!';
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #6c5ce7;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: fadeInOut 3s ease-out;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            document.body.removeChild(message);
        }, 3000);
    }

    showTemplateModal(templateName) {
        // Create a simple modal for template preview
        const modal = document.createElement('div');
        modal.className = 'template-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${templateName}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>This is a preview of the ${templateName}. In a real application, this would show the actual template interface and configuration options.</p>
                    <div class="modal-actions">
                        <button class="btn-primary">Use Template</button>
                        <button class="btn-secondary">Customize</button>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease-out;
        `;
        
        document.body.appendChild(modal);
        
        // Close modal functionality
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes bounce {
        0%, 20%, 60%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-10px);
        }
        80% {
            transform: translateY(-5px);
        }
    }
    
    @keyframes pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
        100% {
            transform: scale(1);
        }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeInOut {
        0%, 100% { opacity: 0; }
        20%, 80% { opacity: 1; }
    }
    
    .template-card.selected {
        border: 2px solid #6c5ce7;
        box-shadow: 0 4px 16px rgba(108, 92, 231, 0.3);
    }
    
    .emoji.selected {
        background-color: #6c5ce7;
        border-radius: 50%;
        padding: 2px;
    }
    
    .scale-segment.selected {
        box-shadow: inset 0 0 0 2px #333;
    }
    
    .sign.selected {
        transform: scale(1.1);
        box-shadow: 0 0 0 2px #fff, 0 0 0 4px #6c5ce7;
    }
    
    .word.selected {
        background-color: #6c5ce7;
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
    }
    
    mark {
        background-color: #ffeb3b;
        padding: 1px 2px;
        border-radius: 2px;
    }
    
    .modal-content {
        background: white;
        border-radius: 12px;
        padding: 0;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow: hidden;
    }
    
    .modal-header {
        padding: 20px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .modal-header h3 {
        margin: 0;
        color: #333;
    }
    
    .modal-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #999;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s;
    }
    
    .modal-close:hover {
        background-color: #f0f0f0;
        color: #333;
    }
    
    .modal-body {
        padding: 20px;
    }
    
    .modal-actions {
        margin-top: 20px;
        display: flex;
        gap: 10px;
    }
    
    .btn-primary, .btn-secondary {
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s;
    }
    
    .btn-primary {
        background-color: #6c5ce7;
        color: white;
    }
    
    .btn-primary:hover {
        background-color: #5a4fcf;
    }
    
    .btn-secondary {
        background-color: #f8f9fa;
        color: #333;
        border: 1px solid #ddd;
    }
    
    .btn-secondary:hover {
        background-color: #e9ecef;
    }
`;
document.head.appendChild(style);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TemplateLibrary();
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TemplateLibrary;
}