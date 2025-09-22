// Modern Financial Education Platform - Interactive Features

class ModernFinancialPlatform {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupSearch();
        this.setupScrollEffects();
        this.setupInteractiveElements();
        this.setupPerformanceOptimizations();
        this.setupAccessibility();
        this.initializeNews();
    }

    // Navigation System
    setupNavigation() {
        const navbar = document.getElementById('navbar');
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');

        // Sticky navigation with scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Mobile menu toggle
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Active navigation highlighting
        this.setupActiveNavigation();
    }

    setupActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    // Advanced Search System
    setupSearch() {
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.querySelector('.search-btn');

        if (searchInput) {
            // Search with debouncing
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.performSearch(e.target.value);
                }, 300);
            });

            // Search button click
            if (searchBtn) {
                searchBtn.addEventListener('click', () => {
                    this.performSearch(searchInput.value);
                });
            }

            // Enter key search
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(searchInput.value);
                }
            });
        }
    }

    performSearch(query) {
        if (query.length < 2) return;

        // Simulate search functionality
        console.log(`Searching for: ${query}`);
        
        // In a real implementation, this would:
        // 1. Search through articles, tools, and resources
        // 2. Display results in a dropdown
        // 3. Highlight matching content
        // 4. Track search analytics
        
        this.showSearchResults(query);
    }

    showSearchResults(query) {
        // Create search results dropdown
        let resultsDropdown = document.querySelector('.search-results');
        if (!resultsDropdown) {
            resultsDropdown = document.createElement('div');
            resultsDropdown.className = 'search-results';
            document.querySelector('.search-container').appendChild(resultsDropdown);
        }

        // Simulate search results
        const mockResults = [
            { title: 'Value Investing Fundamentals', type: 'Article', url: '#' },
            { title: 'Portfolio Risk Calculator', type: 'Tool', url: '#' },
            { title: 'Benjamin Graham Analysis', type: 'Resource', url: '#' }
        ].filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase())
        );

        if (mockResults.length > 0) {
            resultsDropdown.innerHTML = mockResults.map(result => `
                <div class="search-result-item">
                    <div class="result-title">${result.title}</div>
                    <div class="result-type">${result.type}</div>
                </div>
            `).join('');
            resultsDropdown.style.display = 'block';
        } else {
            resultsDropdown.style.display = 'none';
        }
    }

    // Scroll Effects and Animations
    setupScrollEffects() {
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.tool-card, .learning-card, .expert-card, .news-card').forEach(el => {
            observer.observe(el);
        });

        // Parallax effect for hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });
    }

    // Interactive Elements
    setupInteractiveElements() {
        // Tool card interactions
        document.querySelectorAll('.tool-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const toolName = card.querySelector('h3').textContent;
                this.launchTool(toolName);
            });
        });

        // Learning card interactions
        document.querySelectorAll('.learning-card').forEach(card => {
            const button = card.querySelector('.btn');
            if (button) {
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const level = card.querySelector('.learning-level').textContent;
                    this.startLearning(level);
                });
            }
        });

        // Market data updates
        this.setupMarketDataUpdates();
    }

    launchTool(toolName) {
        console.log(`Launching tool: ${toolName}`);
        
        // Create modal for tool
        const modal = document.createElement('div');
        modal.className = 'tool-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${toolName}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="tool-placeholder">
                        <i class="fas fa-cog fa-spin"></i>
                        <p>Loading ${toolName}...</p>
                        <p class="tool-description">This interactive tool will help you analyze and make informed investment decisions.</p>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'flex';

        // Close modal functionality
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    startLearning(level) {
        console.log(`Starting learning path: ${level}`);
        
        // Simulate learning path start
        const notification = this.createNotification(
            `Starting ${level} learning path...`,
            'success'
        );
        
        // In a real implementation, this would:
        // 1. Redirect to learning platform
        // 2. Track user progress
        // 3. Personalize content
        // 4. Set up learning reminders
    }

    setupMarketDataUpdates() {
        // Simulate live market data updates
        setInterval(() => {
            this.updateMarketData();
        }, 5000);
    }

    updateMarketData() {
        const marketCards = document.querySelectorAll('.market-card');
        marketCards.forEach(card => {
            const priceElement = card.querySelector('.market-price');
            const changeElement = card.querySelector('.market-change');
            
            if (priceElement && changeElement) {
                // Simulate price changes
                const currentPrice = parseFloat(priceElement.textContent.replace(/[^\d.-]/g, ''));
                const change = (Math.random() - 0.5) * 0.02; // ±1% change
                const newPrice = currentPrice * (1 + change);
                
                priceElement.textContent = newPrice.toFixed(2);
                
                // Update change indicator
                const changeValue = (newPrice - currentPrice) / currentPrice * 100;
                const isPositive = changeValue >= 0;
                
                changeElement.textContent = `${isPositive ? '+' : ''}${changeValue.toFixed(2)}%`;
                changeElement.className = `market-change ${isPositive ? 'positive' : 'negative'}`;
            }
        });
    }

    // Performance Optimizations
    setupPerformanceOptimizations() {
        // Lazy loading for images
        this.setupLazyLoading();
        
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Service Worker registration
        this.registerServiceWorker();
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    preloadCriticalResources() {
        // Preload critical CSS and fonts
        const criticalResources = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
            'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = resource;
            document.head.appendChild(link);
        });
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator && location.protocol === 'https:') {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        }
    }

    // Accessibility Features
    setupAccessibility() {
        // Keyboard navigation
        this.setupKeyboardNavigation();
        
        // Screen reader announcements
        this.setupScreenReaderSupport();
        
        // High contrast mode detection
        this.setupHighContrastMode();
    }

    setupKeyboardNavigation() {
        // Tab navigation improvements
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modals = document.querySelectorAll('.tool-modal');
                modals.forEach(modal => modal.remove());
            }
        });
    }

    setupScreenReaderSupport() {
        // Add ARIA labels to interactive elements
        document.querySelectorAll('.btn').forEach(btn => {
            if (!btn.getAttribute('aria-label')) {
                btn.setAttribute('aria-label', btn.textContent.trim());
            }
        });

        // Announce dynamic content changes
        this.announceContentChanges();
    }

    announceContentChanges() {
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        document.body.appendChild(announcer);

        this.announcer = announcer;
    }

    announce(message) {
        if (this.announcer) {
            this.announcer.textContent = message;
        }
    }

    setupHighContrastMode() {
        // Detect high contrast mode preference
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            document.body.classList.add('high-contrast');
        }

        // Listen for changes
        window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
            if (e.matches) {
                document.body.classList.add('high-contrast');
            } else {
                document.body.classList.remove('high-contrast');
            }
        });
    }

    // News Integration
    initializeNews() {
        // Initialize news display if available
        if (typeof NewsDisplayManager !== 'undefined') {
            const newsDisplay = new NewsDisplayManager();
            newsDisplay.initialize();
        }
    }

    // Utility Methods
    createNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);

        // Auto remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);

        return notification;
    }

    // Analytics and Tracking
    trackEvent(category, action, label) {
        // Google Analytics 4 event tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }

        console.log(`Analytics: ${category} - ${action} - ${label}`);
    }
}

// Initialize the platform when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.financialPlatform = new ModernFinancialPlatform();
});

// Additional CSS for interactive elements
const additionalStyles = `
    .tool-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        backdrop-filter: blur(5px);
    }

    .modal-content {
        background: white;
        border-radius: 1rem;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow: hidden;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid #e5e7eb;
    }

    .modal-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #6b7280;
    }

    .modal-body {
        padding: 2rem;
    }

    .tool-placeholder {
        text-align: center;
        padding: 3rem;
    }

    .tool-placeholder i {
        font-size: 3rem;
        color: #3b82f6;
        margin-bottom: 1rem;
    }

    .notification {
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: white;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        padding: 1rem;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        z-index: 1500;
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification-success {
        border-left: 4px solid #10b981;
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .search-results {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        border: 1px solid #e5e7eb;
        max-height: 300px;
        overflow-y: auto;
        z-index: 100;
        display: none;
    }

    .search-result-item {
        padding: 0.75rem 1rem;
        border-bottom: 1px solid #f3f4f6;
        cursor: pointer;
        transition: background-color 0.15s ease;
    }

    .search-result-item:hover {
        background-color: #f9fafb;
    }

    .result-title {
        font-weight: 600;
        color: #111827;
        margin-bottom: 0.25rem;
    }

    .result-type {
        font-size: 0.875rem;
        color: #6b7280;
    }

    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }

    .keyboard-navigation *:focus {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
    }

    .high-contrast {
        filter: contrast(1.5);
    }

    @media (prefers-reduced-motion: reduce) {
        .tool-modal,
        .notification,
        .search-results {
            transition: none;
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
