// ===================================
// MAIN JAVASCRIPT FILE
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initNavigation();
    initDrawer();
    initScrollAnimations();
    initCounterAnimation();
    initFormValidation();
    initSmoothScroll();
});

// ===================================
// DRAWER FUNCTIONALITY
// ===================================

function initDrawer() {
    const navToggler = document.querySelector('.navbar-toggler');
    const drawer = document.getElementById('mobileDrawer');
    const drawerLinks = document.querySelectorAll('.drawer-link');
    const drawerCloseBtn = document.querySelector('.drawer-close');
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'drawer-overlay';
    document.body.appendChild(overlay);
    
    // Open drawer on hamburger click
    if (navToggler) {
        navToggler.addEventListener('click', function(e) {
            e.stopPropagation();
            drawer.classList.add('show');
            overlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Close drawer functions
    function closeDrawerMenu() {
        drawer.classList.remove('show');
        overlay.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
    
    // Make closeDrawer available globally
    window.closeDrawer = closeDrawerMenu;
    
    // Close on X button click
    if (drawerCloseBtn) {
        drawerCloseBtn.addEventListener('click', closeDrawerMenu);
    }
    
    // Close on link click
    drawerLinks.forEach(link => {
        link.addEventListener('click', closeDrawerMenu);
    });
    
    // Close on overlay click
    overlay.addEventListener('click', closeDrawerMenu);
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && drawer.classList.contains('show')) {
            closeDrawerMenu();
        }
    });
}

// ===================================
// NAVIGATION
// ===================================
function initNavigation() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const currentLocation = location.pathname;

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Mark current page as active
        if (currentLocation === '/' && href === 'index.html' || 
            currentLocation.endsWith(href)) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ===================================
// SCROLL ANIMATIONS
// ===================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.service-card, .stat-card, .project-card, .contact-card, .feature-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ===================================
// COUNTER ANIMATION
// ===================================
function initCounterAnimation() {
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '-50px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                animateCounter(entry.target);
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Find all stat-number elements and observe them
    document.querySelectorAll('.stat-number').forEach(el => {
        observer.observe(el);
    });
}

function animateCounter(element) {
    const finalValue = parseInt(element.textContent);
    const suffix = element.querySelector('.stat-suffix')?.textContent || '';
    const duration = 2000; // 2 seconds
    const increment = finalValue / (duration / 50);
    
    let currentValue = 0;

    const counter = setInterval(() => {
        currentValue += increment;
        
        if (currentValue >= finalValue) {
            currentValue = finalValue;
            clearInterval(counter);
        }

        // Update the number while preserving the suffix
        const numberText = Math.floor(currentValue).toString();
        element.innerHTML = numberText + `<span class="stat-suffix">${suffix}</span>`;
    }, 50);
}

// ===================================
// FORM VALIDATION
// ===================================
function initFormValidation() {
    const forms = document.querySelectorAll('form.needs-validation');

    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });

    // Custom validation for contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }
}

function handleContactFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    // Get form values
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const projectName = formData.get('projectName');
    const message = formData.get('message');

    // Validate
    if (!name || !email || !phone || !projectName || !message) {
        showAlert('Please fill in all fields', 'danger');
        return;
    }

    if (!isValidEmail(email)) {
        showAlert('Please enter a valid email address', 'danger');
        return;
    }

    if (!isValidPhone(phone)) {
        showAlert('Please enter a valid phone number', 'danger');
        return;
    }

    // Send email via mailto
    const subject = `New Project Inquiry: ${projectName}`;
    const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0APhone: ${phone}%0D%0AProject Name: ${projectName}%0D%0A%0D%0AMessage:%0D%0A${message}`;
    
    window.location.href = `mailto:mubinshaikh2013@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;

    showAlert('Opening Email Client... Please send the pre-filled email to submit your inquiry.', 'success');
    form.reset();
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function showAlert(message, type = 'info') {
    // Create alert element
    const alertHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    // Find where to inject the alert
    const container = document.querySelector('main') || document.querySelector('.container-fluid');
    
    if (container) {
        const alertDiv = document.createElement('div');
        alertDiv.innerHTML = alertHTML;
        container.insertBefore(alertDiv.firstElementChild, container.firstChild);

        // Auto dismiss after 5 seconds
        setTimeout(() => {
            const alert = container.querySelector('.alert');
            if (alert) {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }
        }, 5000);
    }
}

// ===================================
// SMOOTH SCROLLING
// ===================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ===================================
// RESPONSIVE NAVBAR
// ===================================
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===================================
// MOBILE MENU TOGGLE
// ===================================
const navbarToggler = document.querySelector('.navbar-toggler');
if (navbarToggler) {
    navbarToggler.addEventListener('click', function() {
        this.classList.toggle('collapsed');
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const navbar = document.querySelector('.navbar');
    const navbarToggler = document.querySelector('.navbar-toggler');
    
    if (navbar && navbarToggler && !navbarToggler.classList.contains('collapsed')) {
        if (!navbar.contains(event.target)) {
            navbarToggler.click();
        }
    }
});

// ===================================
// BACK TO TOP BUTTON (if added)
// ===================================
function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.style.display = 'block';
            } else {
                backToTopButton.style.display = 'none';
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

initBackToTop();

// ===================================
// PROJECT FILTER (for projects page)
// ===================================
function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter projects
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.classList.add('show');
                    }, 10);
                } else {
                    card.classList.remove('show');
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

initProjectFilter();

// ===================================
// LAZY LOADING IMAGES
// ===================================
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

initLazyLoading();

// ===================================
// CONSOLE MESSAGE
// ===================================
console.log('%cTechnoSoftware', 'font-size: 24px; font-weight: bold; color: #06b6d4;');
console.log('%cNext-Gen IT Solutions', 'font-size: 14px; color: #a855f7;');
console.log('%cWebsite built with HTML, CSS, and JavaScript', 'font-size: 12px; color: #9ca3af;');
