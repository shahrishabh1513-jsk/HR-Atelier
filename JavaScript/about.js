// about.js - Complete standalone About page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('About.js loaded - Standalone version');
    
    // Initialize all about page components
    aboutInitLoadingScreen();
    aboutInitHeader();
    aboutInitBackToTop();
    aboutInitCart();
    aboutInitCounterAnimation();
    aboutInitTimelineEffects();
    aboutInitTeamEffects();
    aboutInitNewsletter();
    aboutInitSearch();
    
    // Initialize AOS if available
    aboutInitAOS();
});

// ===== AOS INITIALIZATION =====
function aboutInitAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
            offset: 100,
            delay: 0,
            disable: window.innerWidth < 768
        });
        console.log('AOS initialized');
    }
}

// ===== LOADING SCREEN =====
function aboutInitLoadingScreen() {
    const loadingScreen = document.querySelector('.about-loading-screen');
    if (!loadingScreen) return;
    
    window.addEventListener('load', function() {
        setTimeout(function() {
            loadingScreen.classList.add('about-hidden');
            
            setTimeout(function() {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1000);
    });
}

// ===== HEADER FUNCTIONALITY =====
function aboutInitHeader() {
    const header = document.querySelector('.about-header');
    const mobileToggle = document.querySelector('.about-mobile-menu-toggle');
    const mainNav = document.querySelector('.about-nav');
    
    if (!header) return;
    
    // Header scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('about-scrolled');
        } else {
            header.classList.remove('about-scrolled');
        }
        
        // Hide/show header on scroll
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
    
    // Mobile menu toggle
    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', function() {
            mobileToggle.classList.toggle('about-active');
            mainNav.classList.toggle('about-active');
            document.body.style.overflow = mainNav.classList.contains('about-active') ? 'hidden' : '';
        });
    }
    
    // Close menu when clicking on link (mobile)
    document.querySelectorAll('.about-nav-link').forEach(function(link) {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 991) {
                if (mobileToggle) mobileToggle.classList.remove('about-active');
                if (mainNav) mainNav.classList.remove('about-active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 991 && mainNav && mainNav.classList.contains('about-active')) {
            if (!mainNav.contains(e.target) && !mobileToggle.contains(e.target)) {
                mainNav.classList.remove('about-active');
                if (mobileToggle) mobileToggle.classList.remove('about-active');
                document.body.style.overflow = '';
            }
        }
    });
}

// ===== SEARCH FUNCTIONALITY =====
function aboutInitSearch() {
    const searchToggle = document.querySelector('.about-search-toggle');
    const searchBox = document.querySelector('.about-search-box');
    
    if (!searchToggle || !searchBox) return;
    
    searchToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        searchBox.classList.toggle('about-active');
        
        if (searchBox.classList.contains('about-active')) {
            const input = searchBox.querySelector('.about-search-input');
            if (input) input.focus();
        }
    });
    
    // Close search when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchToggle.contains(e.target) && !searchBox.contains(e.target)) {
            searchBox.classList.remove('about-active');
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchBox.classList.contains('about-active')) {
            searchBox.classList.remove('about-active');
        }
    });
}

// ===== BACK TO TOP =====
function aboutInitBackToTop() {
    const backToTop = document.getElementById('aboutBackToTop');
    if (!backToTop) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.classList.add('about-visible');
        } else {
            backToTop.classList.remove('about-visible');
        }
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== CART FUNCTIONALITY =====
function aboutInitCart() {
    const cartIcon = document.querySelector('.about-cart-icon');
    const cartSidebar = document.getElementById('aboutCartSidebar');
    const closeCart = document.getElementById('aboutCloseCart');
    const cartItems = document.getElementById('aboutCartItems');
    const cartCount = document.querySelector('.about-cart-count');
    const cartTotal = document.getElementById('aboutCartTotal');
    
    if (!cartSidebar) return;
    
    // Load cart from localStorage
    let cart = JSON.parse(localStorage.getItem('aboutCart')) || [];
    
    // Update cart count
    function aboutUpdateCartCount() {
        const totalItems = cart.reduce(function(sum, item) {
            return sum + (item.quantity || 1);
        }, 0);
        
        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }
    
    // Update cart display
    function aboutUpdateCartDisplay() {
        if (!cartItems) return;
        
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="about-empty-cart">
                    <ion-icon name="bag-outline"></ion-icon>
                    <p>Your cart is empty</p>
                    <a href="products.html" class="about-btn-primary" style="margin-top: 1rem;">Start Shopping</a>
                </div>
            `;
            if (cartTotal) cartTotal.textContent = '$0.00';
        } else {
            let itemsHTML = '';
            let subtotal = 0;
            
            cart.forEach(function(item) {
                const price = parseFloat(item.price) || 0;
                const itemTotal = price * (item.quantity || 1);
                subtotal += itemTotal;
                
                itemsHTML += `
                    <div class="about-cart-item" style="display: flex; align-items: center; gap: 1rem; padding: 1rem; border-bottom: 1px solid #dfe6e9;">
                        <img src="${item.image || 'images/placeholder.jpg'}" alt="${item.name}" width="60" height="60" style="border-radius: 6px; object-fit: cover;">
                        <div style="flex: 1;">
                            <h4 style="font-size: 0.95rem; margin-bottom: 0.25rem; color: #2c3e50;">${item.name}</h4>
                            <p style="font-size: 0.875rem; color: #7f8c8d;">$${price.toFixed(2)} × ${item.quantity}</p>
                        </div>
                        <button class="about-remove-item" data-id="${item.id}" style="background: none; border: none; color: #7f8c8d; cursor: pointer; font-size: 1.25rem;">
                            <ion-icon name="close-outline"></ion-icon>
                        </button>
                    </div>
                `;
            });
            
            cartItems.innerHTML = itemsHTML;
            if (cartTotal) cartTotal.textContent = '$' + subtotal.toFixed(2);
            
            // Add remove event listeners
            document.querySelectorAll('.about-remove-item').forEach(function(button) {
                button.addEventListener('click', function() {
                    const id = this.dataset.id;
                    cart = cart.filter(function(item) {
                        return item.id != id;
                    });
                    localStorage.setItem('aboutCart', JSON.stringify(cart));
                    aboutUpdateCartDisplay();
                    aboutUpdateCartCount();
                    aboutShowNotification('Item removed from cart', 'success');
                });
            });
        }
    }
    
    // Open cart
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            cartSidebar.classList.add('about-active');
            document.body.style.overflow = 'hidden';
            aboutUpdateCartDisplay();
        });
    }
    
    // Close cart
    if (closeCart) {
        closeCart.addEventListener('click', function() {
            cartSidebar.classList.remove('about-active');
            document.body.style.overflow = '';
        });
    }
    
    // Close cart when clicking outside
    document.addEventListener('click', function(e) {
        if (cartSidebar.classList.contains('about-active') && 
            !cartSidebar.contains(e.target) && 
            cartIcon && !cartIcon.contains(e.target)) {
            cartSidebar.classList.remove('about-active');
            document.body.style.overflow = '';
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && cartSidebar.classList.contains('about-active')) {
            cartSidebar.classList.remove('about-active');
            document.body.style.overflow = '';
        }
    });
    
    // Initial update
    aboutUpdateCartCount();
}

// ===== COUNTER ANIMATION =====
function aboutInitCounterAnimation() {
    const statNumbers = document.querySelectorAll('.about-stat-number');
    if (statNumbers.length === 0) return;
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const element = entry.target;
                const targetValue = element.textContent;
                const target = parseFloat(targetValue.replace(/[^0-9.]/g, ''));
                const suffix = targetValue.replace(/[0-9.]/g, '');
                
                if (!isNaN(target)) {
                    aboutAnimateCounter(element, target, suffix);
                }
                
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(function(element) {
        observer.observe(element);
    });
}

function aboutAnimateCounter(element, target, suffix) {
    let current = 0;
    const increment = target / 50;
    const stepTime = 1500 / 50;
    
    const timer = setInterval(function() {
        current += increment;
        
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, stepTime);
}

// ===== TIMELINE EFFECTS =====
function aboutInitTimelineEffects() {
    const timelineItems = document.querySelectorAll('.about-timeline-item');
    
    timelineItems.forEach(function(item) {
        item.addEventListener('mouseenter', function() {
            const dot = this.querySelector('.about-timeline-dot');
            if (dot) {
                dot.style.transform = 'translateX(-50%) scale(1.5)';
                dot.style.backgroundColor = '#097a6e';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const dot = this.querySelector('.about-timeline-dot');
            if (dot) {
                dot.style.transform = 'translateX(-50%) scale(1)';
                dot.style.backgroundColor = '#0ec1ae';
            }
        });
    });
}

// ===== TEAM CARD EFFECTS =====
function aboutInitTeamEffects() {
    const teamCards = document.querySelectorAll('.about-team-card');
    
    teamCards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            const socialLinks = this.querySelectorAll('.about-team-social a');
            socialLinks.forEach(function(link, index) {
                link.style.transitionDelay = (index * 0.1) + 's';
            });
        });
        
        card.addEventListener('mouseleave', function() {
            const socialLinks = this.querySelectorAll('.about-team-social a');
            socialLinks.forEach(function(link) {
                link.style.transitionDelay = '0s';
            });
        });
    });
}

// ===== NEWSLETTER FORM =====
function aboutInitNewsletter() {
    const newsletterForm = document.querySelector('.about-newsletter-form');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            aboutShowNotification('Please enter your email address', 'error');
            emailInput.focus();
            return;
        }
        
        if (!emailRegex.test(email)) {
            aboutShowNotification('Please enter a valid email address', 'error');
            emailInput.focus();
            return;
        }
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Subscribing...';
        submitBtn.disabled = true;
        
        setTimeout(function() {
            aboutShowNotification('Thank you for subscribing to our newsletter!', 'success');
            newsletterForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// ===== NOTIFICATION SYSTEM =====
function aboutShowNotification(message, type) {
    const existingNotification = document.querySelector('.about-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'about-notification';
    
    const icon = type === 'success' ? 'checkmark-circle' : 'alert-circle';
    
    notification.innerHTML = `
        <ion-icon name="${icon}-outline"></ion-icon>
        <span>${message}</span>
        <button class="about-close-notification">
            <ion-icon name="close-outline"></ion-icon>
        </button>
    `;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        background: type === 'success' ? '#10b981' : '#ef4444',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        zIndex: '1003',
        animation: 'about-slideInRight 0.3s ease',
        minWidth: '300px',
        maxWidth: '400px',
        fontFamily: 'Poppins, sans-serif'
    });
    
    const closeBtn = notification.querySelector('.about-close-notification');
    Object.assign(closeBtn.style, {
        background: 'none',
        border: 'none',
        color: 'white',
        fontSize: '1.25rem',
        cursor: 'pointer',
        padding: '0',
        lineHeight: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    });
    
    closeBtn.addEventListener('click', function() {
        notification.style.animation = 'about-slideOutRight 0.3s ease';
        setTimeout(function() {
            notification.remove();
        }, 300);
    });
    
    setTimeout(function() {
        if (document.body.contains(notification)) {
            notification.style.animation = 'about-slideOutRight 0.3s ease';
            setTimeout(function() {
                notification.remove();
            }, 300);
        }
    }, 3000);
    
    document.body.appendChild(notification);
}

// ===== ADD ANIMATION STYLES =====
(function aboutAddAnimationStyles() {
    if (document.getElementById('about-animation-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'about-animation-styles';
    style.textContent = `
        @keyframes about-slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes about-slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .about-notification {
            animation: about-slideInRight 0.3s ease;
        }
    `;
    
    document.head.appendChild(style);
})();

// ===== WINDOW RESIZE HANDLER =====
let aboutResizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(aboutResizeTimeout);
    
    aboutResizeTimeout = setTimeout(function() {
        if (window.innerWidth > 991) {
            const mainNav = document.querySelector('.about-nav');
            const mobileToggle = document.querySelector('.about-mobile-menu-toggle');
            
            if (mainNav && mainNav.classList.contains('about-active')) {
                mainNav.classList.remove('about-active');
                if (mobileToggle) mobileToggle.classList.remove('about-active');
                document.body.style.overflow = '';
            }
        }
    }, 250);
});