// Graham and Doddsville Website - Interactive Features
// Modern JavaScript with ES6+ features

class GrahamDoddsvilleApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeComponents();
        this.setupSmoothScrolling();
        this.setupIntersectionObserver();
        this.setupFormHandlers();
        this.setupMarketData();
        this.setupVideoFilters();
        this.setupEventFilters();
    }

    setupEventListeners() {
        // Mobile navigation toggle
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
                document.body.classList.toggle('nav-open');
            });

            // Close mobile menu when clicking on a link
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    document.body.classList.remove('nav-open');
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    document.body.classList.remove('nav-open');
                }
            });
        }

        // Header scroll effect
        window.addEventListener('scroll', this.handleHeaderScroll.bind(this));

        // Window resize handler
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    initializeComponents() {
        // Initialize tooltips for interactive elements
        this.initializeTooltips();
        
        // Initialize lazy loading for images
        this.initializeLazyLoading();
        
        // Initialize animations
        this.initializeAnimations();
    }

    setupSmoothScrolling() {
        // Smooth scrolling for anchor links
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupIntersectionObserver() {
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
        const animateElements = document.querySelectorAll('.market-card, .news-item, .reading-item, .video-card, .event-card');
        animateElements.forEach(el => {
            observer.observe(el);
        });
    }

    setupFormHandlers() {
        // Newsletter form handler
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', this.handleNewsletterSubmit.bind(this));
        }

        // Search functionality (if implemented)
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', this.handleSearch.bind(this));
        }
    }

    setupMarketData() {
        // Simulate real-time market data updates
        this.updateMarketData();
        setInterval(() => {
            this.updateMarketData();
        }, 30000); // Update every 30 seconds
    }

    setupVideoFilters() {
        const videoFilters = document.querySelectorAll('.video-filters .filter-select');
        videoFilters.forEach(filter => {
            filter.addEventListener('change', this.filterVideos.bind(this));
        });
    }

    setupEventFilters() {
        const eventFilters = document.querySelectorAll('.event-filters .filter-select');
        eventFilters.forEach(filter => {
            filter.addEventListener('change', this.filterEvents.bind(this));
        });
    }

    handleHeaderScroll() {
        const header = document.querySelector('.header');
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    handleResize() {
        // Handle responsive adjustments
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    }

    initializeTooltips() {
        // Simple tooltip implementation
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', this.showTooltip.bind(this));
            element.addEventListener('mouseleave', this.hideTooltip.bind(this));
        });
    }

    initializeLazyLoading() {
        // Lazy loading for images
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

    initializeAnimations() {
        // Add CSS classes for animations
        const style = document.createElement('style');
        style.textContent = `
            .market-card, .news-item, .reading-item, .video-card, .event-card {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            
            .header.scrolled {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            
            .lazy {
                opacity: 0;
                transition: opacity 0.3s;
            }
            
            .lazy.loaded {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }

    handleNewsletterSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const email = form.querySelector('input[type="email"]').value;
        const button = form.querySelector('button');
        
        // Simulate form submission
        button.textContent = 'Subscribing...';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = 'Subscribed!';
            button.style.background = '#38a169';
            
            setTimeout(() => {
                button.textContent = 'Subscribe';
                button.disabled = false;
                button.style.background = '';
                form.reset();
            }, 2000);
        }, 1000);
        
        // In a real application, you would send the data to your server
        console.log('Newsletter subscription:', email);
    }

    handleSearch(e) {
        const query = e.target.value.toLowerCase();
        const searchableElements = document.querySelectorAll('.news-item, .reading-item, .video-card, .event-card');
        
        searchableElements.forEach(element => {
            const text = element.textContent.toLowerCase();
            if (text.includes(query)) {
                element.style.display = 'block';
            } else {
                element.style.display = 'none';
            }
        });
    }

    updateMarketData() {
        // Simulate market data updates
        const marketCards = document.querySelectorAll('.market-card');
        
        marketCards.forEach(card => {
            const changeElement = card.querySelector('.market-change');
            const valueElement = card.querySelector('.market-value');
            
            if (changeElement && valueElement) {
                // Generate random changes
                const change = (Math.random() - 0.5) * 4; // -2% to +2%
                const isPositive = change >= 0;
                
                changeElement.textContent = `${isPositive ? '+' : ''}${change.toFixed(1)}%`;
                changeElement.className = `market-change ${isPositive ? 'positive' : 'negative'}`;
                
                // Add subtle animation
                changeElement.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    changeElement.style.transform = 'scale(1)';
                }, 200);
            }
        });
    }

    filterVideos() {
        const investorFilter = document.querySelector('.video-filters select:first-child').value;
        const topicFilter = document.querySelector('.video-filters select:last-child').value;
        const videoCards = document.querySelectorAll('.video-card');
        
        videoCards.forEach(card => {
            const shouldShow = this.shouldShowVideo(card, investorFilter, topicFilter);
            card.style.display = shouldShow ? 'block' : 'none';
        });
    }

    filterEvents() {
        const stateFilter = document.querySelector('.event-filters select:first-child').value;
        const formatFilter = document.querySelector('.event-filters select:nth-child(2)').value;
        const costFilter = document.querySelector('.event-filters select:last-child').value;
        const eventCards = document.querySelectorAll('.event-card');
        
        eventCards.forEach(card => {
            const shouldShow = this.shouldShowEvent(card, stateFilter, formatFilter, costFilter);
            card.style.display = shouldShow ? 'block' : 'none';
        });
    }

    shouldShowVideo(card, investorFilter, topicFilter) {
        // Simple filtering logic - in a real app, this would use data attributes
        const title = card.querySelector('h3').textContent.toLowerCase();
        
        if (investorFilter !== 'all') {
            if (investorFilter === 'buffett' && !title.includes('buffett')) return false;
            if (investorFilter === 'graham' && !title.includes('graham')) return false;
            if (investorFilter === 'munger' && !title.includes('munger')) return false;
        }
        
        if (topicFilter !== 'all') {
            if (topicFilter === 'value-investing' && !title.includes('value')) return false;
            if (topicFilter === 'market-analysis' && !title.includes('analysis')) return false;
            if (topicFilter === 'portfolio-management' && !title.includes('portfolio')) return false;
        }
        
        return true;
    }

    shouldShowEvent(card, stateFilter, formatFilter, costFilter) {
        const location = card.querySelector('.event-location').textContent.toLowerCase();
        const format = card.querySelector('.event-format').textContent.toLowerCase();
        const cost = card.querySelector('.event-cost').textContent.toLowerCase();
        
        if (stateFilter !== 'all' && !location.includes(stateFilter)) return false;
        if (formatFilter !== 'all' && format !== formatFilter) return false;
        if (costFilter !== 'all') {
            if (costFilter === 'free' && cost !== 'free') return false;
            if (costFilter === 'paid' && cost === 'free') return false;
        }
        
        return true;
    }

    showTooltip(e) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = e.target.dataset.tooltip;
        document.body.appendChild(tooltip);
        
        const rect = e.target.getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    }

    hideTooltip() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }
}

// Utility functions
const utils = {
    // Debounce function for performance optimization
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Format currency
    formatCurrency(amount, currency = 'AUD') {
        return new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },

    // Format percentage
    formatPercentage(value, decimals = 2) {
        return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
    },

    // Get current date in Australian format
    getCurrentDate() {
        return new Date().toLocaleDateString('en-AU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
};

// Performance monitoring
const performanceMonitor = {
    init() {
        this.measurePageLoad();
        this.measureUserInteractions();
    },

    measurePageLoad() {
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
            
            // Send to analytics in production
            if (typeof gtag !== 'undefined') {
                gtag('event', 'page_load_time', {
                    value: Math.round(loadTime)
                });
            }
        });
    },

    measureUserInteractions() {
        // Track button clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn, .nav-link, .social-link')) {
                const element = e.target;
                const action = element.textContent.trim() || element.getAttribute('href') || 'unknown';
                
                console.log(`User clicked: ${action}`);
                
                // Send to analytics in production
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'click', {
                        event_category: 'engagement',
                        event_label: action
                    });
                }
            }
        });
    }
};

// Accessibility enhancements
const accessibility = {
    init() {
        this.setupKeyboardNavigation();
        this.setupScreenReaderSupport();
        this.setupFocusManagement();
    },

    setupKeyboardNavigation() {
        // Enhanced keyboard navigation for dropdowns
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            const trigger = dropdown.querySelector('.nav-link');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            trigger.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    menu.classList.toggle('active');
                }
            });
        });
    },

    setupScreenReaderSupport() {
        // Add ARIA labels and roles
        const nav = document.querySelector('.nav-menu');
        if (nav) {
            nav.setAttribute('role', 'navigation');
            nav.setAttribute('aria-label', 'Main navigation');
        }

        const main = document.querySelector('main') || document.querySelector('.hero');
        if (main) {
            main.setAttribute('role', 'main');
        }
    },

    setupFocusManagement() {
        // Manage focus for mobile menu
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    // Focus first menu item when opening
                    const firstLink = navMenu.querySelector('.nav-link');
                    if (firstLink) {
                        setTimeout(() => firstLink.focus(), 100);
                    }
                }
            });
        }
    }
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main application
    const app = new GrahamDoddsvilleApp();
    
    // Initialize performance monitoring
    performanceMonitor.init();
    
    // Initialize accessibility features
    accessibility.init();
    
    // Add loading complete class
    document.body.classList.add('loaded');
    
    console.log('Graham and Doddsville website initialized successfully');
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GrahamDoddsvilleApp, utils, performanceMonitor, accessibility };
}
