// ===== GLOBAL VARIABLES =====
let currentSlide = 0;
let sliderInterval;
let isAnimating = false;
const ANIMATION_DURATION = 800; // milliseconds
const SLIDE_INTERVAL = 5000; // 5 seconds

// ===== CUSTOM ANIMATION SYSTEM =====
function initAnimations() {
    // Create Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add delay for staggered animations
                setTimeout(() => {
                    entry.target.classList.add('animated');
                    
                    // If parent has stagger-children class, set stagger index
                    if (entry.target.parentElement.classList.contains('stagger-children')) {
                        const children = Array.from(entry.target.parentElement.children);
                        const childIndex = children.indexOf(entry.target);
                        entry.target.style.setProperty('--stagger-index', childIndex);
                    }
                }, entry.target.dataset.delay || 0);
            }
        });
    }, observerOptions);
    
    // Observe all elements with data-animate attribute
    document.querySelectorAll('[data-animate]').forEach(el => {
        observer.observe(el);
    });
    
    // Initialize stagger animations
    document.querySelectorAll('.stagger-children').forEach(container => {
        const children = container.children;
        Array.from(children).forEach((child, index) => {
            if (child.hasAttribute('data-animate')) {
                child.dataset.delay = index * 100;
            }
        });
    });
}

// ===== LOADING SCREEN =====
function initLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    
    window.addEventListener('load', () => {
        // Add a small delay for better UX
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            
            // Remove from DOM after animation completes
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1000);
    });
}

// ===== SLIDER FUNCTIONALITY =====
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    
    if (slides.length === 0) return;
    
    // Set initial state
    slides[0].classList.add('active');
    dots[0].classList.add('active');
    
    // Initialize auto-slide
    startAutoSlide();
    
    // Add click events to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Add click events to navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            restartAutoSlide();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            restartAutoSlide();
        });
    }
    
    // Pause auto-slide on hover
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => {
            clearInterval(sliderInterval);
        });
        
        sliderContainer.addEventListener('mouseleave', () => {
            startAutoSlide();
        });
    }
    
    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    sliderContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(sliderInterval);
    });
    
    sliderContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoSlide();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - next slide
            nextSlide();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - previous slide
            prevSlide();
        }
    }
}

// Start auto-slide
function startAutoSlide() {
    sliderInterval = setInterval(nextSlide, SLIDE_INTERVAL);
}

// Restart auto-slide
function restartAutoSlide() {
    clearInterval(sliderInterval);
    startAutoSlide();
}

// Next slide
function nextSlide() {
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    
    if (isAnimating) return;
    
    isAnimating = true;
    goToSlide((currentSlide + 1) % totalSlides);
    
    // Reset animation lock after animation duration
    setTimeout(() => {
        isAnimating = false;
    }, ANIMATION_DURATION);
}

// Previous slide
function prevSlide() {
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    
    if (isAnimating) return;
    
    isAnimating = true;
    goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
    
    setTimeout(() => {
        isAnimating = false;
    }, ANIMATION_DURATION);
}

// Go to specific slide with animation
function goToSlide(n) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const totalSlides = slides.length;
    
    // Remove active class from current slide
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    // Update current slide
    currentSlide = n;
    
    // Add active class to new slide
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    
    // Trigger slide content animations
    animateSlideContent();
}

// Animate slide content elements
function animateSlideContent() {
    const activeSlide = document.querySelector('.slide.active');
    const contentElements = activeSlide.querySelectorAll('.slide-subtitle, .slide-title, .slide-description, .btn-primary');
    
    contentElements.forEach((element, index) => {
        // Reset animation
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        // Trigger animation after a delay
        setTimeout(() => {
            element.style.transition = `all 0.8s ease ${index * 0.2}s`;
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100);
    });
}

// ===== HEADER FUNCTIONALITY =====
function initHeader() {
    const header = document.querySelector('.main-header');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const searchToggle = document.querySelector('.search-toggle');
    const searchBox = document.querySelector('.search-box');
    const dropdowns = document.querySelectorAll('.dropdown');
    
    // Header scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class when not at top
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
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
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Search toggle
    if (searchToggle && searchBox) {
        searchToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            searchBox.classList.toggle('active');
            
            if (searchBox.classList.contains('active')) {
                searchBox.querySelector('.search-input').focus();
            }
        });
        
        // Close search when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchToggle.contains(e.target) && !searchBox.contains(e.target)) {
                searchBox.classList.remove('active');
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchBox.classList.contains('active')) {
                searchBox.classList.remove('active');
            }
        });
    }
    
    // Dropdown functionality for mobile
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.nav-link');
        const icon = dropdown.querySelector('ion-icon');
        
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 991) {
                e.preventDefault();
                dropdown.classList.toggle('active');
                
                if (icon) {
                    icon.style.transition = 'transform 0.3s ease';
                    if (dropdown.classList.contains('active')) {
                        icon.style.transform = 'rotate(180deg)';
                    } else {
                        icon.style.transform = 'rotate(0deg)';
                    }
                }
            }
        });
    });
    
    // Close menu when clicking on link (mobile)
    document.querySelectorAll('.nav-link:not(.dropdown > .nav-link)').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 991) {
                mobileToggle.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Close dropdowns when clicking outside (desktop)
    if (window.innerWidth > 991) {
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown')) {
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
    }
}

// ===== BACK TO TOP FUNCTIONALITY =====
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    if (!backToTop) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== CART FUNCTIONALITY =====
function initCart() {
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCart = document.getElementById('closeCart');
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.querySelector('.cart-count');
    const cartTotal = document.getElementById('cartTotal');
    
    // Open cart
    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            cartSidebar.classList.add('active');
            document.body.style.overflow = 'hidden';
            updateCartDisplay();
        });
    }
    
    // Close cart
    if (closeCart) {
        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close cart when clicking outside
    document.addEventListener('click', (e) => {
        if (!cartIcon.contains(e.target) && 
            !cartSidebar.contains(e.target) && 
            cartSidebar.classList.contains('active')) {
            cartSidebar.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && cartSidebar.classList.contains('active')) {
            cartSidebar.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Update cart display
    function updateCartDisplay() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let total = 0;
        let count = 0;
        
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <ion-icon name="bag-outline"></ion-icon>
                    <p>Your cart is empty</p>
                    <a href="products.html" class="btn-primary" style="margin-top: 1rem;">Start Shopping</a>
                </div>
            `;
        } else {
            let itemsHTML = '';
            cart.forEach(item => {
                const price = parseFloat(item.price.replace('$', '')) || 0;
                const itemTotal = price * (item.quantity || 1);
                total += itemTotal;
                count += item.quantity || 1;
                
                itemsHTML += `
                    <div class="cart-item" data-id="${item.id}">
                        <img src="${item.images?.[0] || 'images/placeholder.jpg'}" 
                             alt="${item.name || 'Product'}" 
                             width="60" 
                             height="60">
                        <div class="cart-item-info">
                            <h4>${item.name || 'Product'}</h4>
                            <p>${item.price || '$0.00'} × ${item.quantity || 1}</p>
                        </div>
                        <button class="remove-item" data-id="${item.id}">
                            <ion-icon name="close-outline"></ion-icon>
                        </button>
                    </div>
                `;
            });
            
            cartItems.innerHTML = itemsHTML;
            
            // Add event listeners to remove buttons
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.currentTarget.dataset.id;
                    removeFromCart(id);
                    updateCartDisplay();
                    showNotification('Item removed from cart', 'success');
                });
            });
        }
        
        // Update count and total
        if (cartCount) {
            cartCount.textContent = count;
            cartCount.style.display = count > 0 ? 'flex' : 'none';
        }
        
        if (cartTotal) {
            cartTotal.textContent = `$${total.toFixed(2)}`;
        }
    }
    
    // Remove from cart function
    function removeFromCart(id) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id != id);
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    }
    
    // Initial cart update
    updateCartDisplay();
    
    // Listen for cart updates from other components
    window.addEventListener('cartUpdated', updateCartDisplay);
}

// ===== PRODUCT FUNCTIONALITY =====
function initProducts() {
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            const productId = e.currentTarget.dataset.id;
            
            try {
                await addToCart(productId);
                showNotification('Product added to cart!', 'success');
                
                // Add visual feedback
                button.classList.add('added');
                setTimeout(() => {
                    button.classList.remove('added');
                }, 1000);
            } catch (error) {
                console.error('Error adding to cart:', error);
                showNotification('Failed to add product to cart', 'error');
            }
        });
    });
    
    // Quick view buttons
    document.querySelectorAll('.quick-view').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.currentTarget.dataset.id;
            window.location.href = `ProductDetails.html?productId=${productId}`;
        });
    });
    
    // Product card hover effects
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('hover');
        });
        
        card.addEventListener('mouseleave', () => {
            card.classList.remove('hover');
        });
    });
}

// Add to cart function
async function addToCart(productId, quantity = 1) {
    try {
        // For demo purposes, create a mock product
        const product = {
            id: productId,
            name: document.querySelector(`[data-id="${productId}"]`).closest('.product-card').querySelector('.product-name').textContent,
            price: document.querySelector(`[data-id="${productId}"]`).closest('.product-card').querySelector('.product-price').textContent,
            images: [document.querySelector(`[data-id="${productId}"]`).closest('.product-card').querySelector('img').src],
            category: document.querySelector(`[data-id="${productId}"]`).closest('.product-card').querySelector('.product-category').textContent
        };
        
        // Get existing cart
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Check if product already exists in cart
        const existingIndex = cart.findIndex(item => item.id == productId);
        
        if (existingIndex > -1) {
            // Update quantity
            cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + quantity;
        } else {
            // Add new product
            cart.push({
                ...product,
                quantity: quantity
            });
        }
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Trigger cart update event
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        
        return true;
    } catch (error) {
        console.error('Error in addToCart:', error);
        throw error;
    }
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Set icon based on type
    const icon = type === 'success' ? 'checkmark-circle' : 'alert-circle';
    
    notification.innerHTML = `
        <ion-icon name="${icon}-outline"></ion-icon>
        <span>${message}</span>
        <button class="close-notification">
            <ion-icon name="close-outline"></ion-icon>
        </button>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        background: type === 'success' ? '#10b981' : '#ef4444',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        boxShadow: 'var(--shadow-lg)',
        zIndex: '1003',
        animation: 'slideInRight 0.3s ease',
        minWidth: '300px',
        maxWidth: '400px',
        fontFamily: 'var(--font-primary)'
    });
    
    // Close button styles
    const closeBtn = notification.querySelector('.close-notification');
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
    
    // Close button event
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 3 seconds
    const autoRemove = setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
    
    // Pause auto-remove on hover
    notification.addEventListener('mouseenter', () => {
        clearTimeout(autoRemove);
    });
    
    notification.addEventListener('mouseleave', () => {
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
    });
    
    document.body.appendChild(notification);
}

// ===== NEWSLETTER FORM =====
function initNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            showNotification('Please enter your email address', 'error');
            emailInput.focus();
            return;
        }
        
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            emailInput.focus();
            return;
        }
        
        // Simulate API call
        try {
            // Show loading state
            const submitBtn = newsletterForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Subscribing...';
            submitBtn.disabled = true;
            
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            showNotification('Thank you for subscribing to our newsletter!', 'success');
            
            // Reset form
            newsletterForm.reset();
            
        } catch (error) {
            showNotification('Subscription failed. Please try again.', 'error');
        } finally {
            // Reset button state
            const submitBtn = newsletterForm.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Subscribe';
            submitBtn.disabled = false;
        }
    });
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initLoadingScreen();
    initAnimations();
    initSlider();
    initHeader();
    initBackToTop();
    initCart();
    initProducts();
    initNewsletter();
    
    // Add loaded class for CSS animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 1000);
    
    // Update cart count on page load
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    // Initialize features grid with staggered animation
    const featuresGrid = document.querySelector('.features-grid');
    if (featuresGrid) {
        featuresGrid.classList.add('stagger-children');
    }
});

// ===== WINDOW RESIZE HANDLER =====
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Reinitialize components that need it
        if (window.innerWidth > 991) {
            // Close mobile menu on resize to desktop
            const mobileToggle = document.querySelector('.mobile-menu-toggle');
            const mainNav = document.querySelector('.main-nav');
            
            if (mobileToggle && mainNav) {
                mobileToggle.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    }, 250);
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

// ===== OFFLINE SUPPORT =====
window.addEventListener('online', () => {
    showNotification('You are back online!', 'success');
});

window.addEventListener('offline', () => {
    showNotification('You are offline. Some features may not work.', 'error');
});

// ===== PERFORMANCE OPTIMIZATION =====
// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.1
    });
    
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        if (!img.src) {
            const dataSrc = img.getAttribute('data-src');
            if (dataSrc) {
                img.src = dataSrc;
            }
        }
        imageObserver.observe(img);
    });
}

// ===== USER AUTHENTICATION SYSTEM =====
function initAuth() {
    // Check if user is logged in
    checkLoginStatus();
    
    // Setup logout functionality
    setupLogout();
    
    // Protect checkout page if not logged in
    protectCheckout();
}

function checkLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loginBtn = document.querySelector('a[href="login.html"]');
    const userIcon = document.querySelector('.user-icon');
    const userDropdown = document.querySelector('.user-dropdown');
    
    if (currentUser) {
        // Update UI for logged in user
        if (loginBtn) {
            const userActions = loginBtn.closest('.user-actions');
            if (userActions) {
                const welcomeMsg = document.createElement('div');
                welcomeMsg.className = 'user-welcome';
                welcomeMsg.innerHTML = `
                    <span class="welcome-text">Hi, ${currentUser.firstName}</span>
                    <div class="user-dropdown">
                        <a href="account.html">My Account</a>
                        <a href="account.html?tab=orders">My Orders</a>
                        <a href="account.html?tab=wishlist">Wishlist</a>
                        <a href="#" class="logout-btn">Logout</a>
                    </div>
                `;
                userActions.innerHTML = '';
                userActions.appendChild(welcomeMsg);
                
                // Add logout event listener
                const logoutBtn = welcomeMsg.querySelector('.logout-btn');
                if (logoutBtn) {
                    logoutBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        logout();
                    });
                }
            }
        }
    }
}

function setupLogout() {
    // This will be handled by event delegation
    document.addEventListener('click', (e) => {
        if (e.target.closest('.logout-btn')) {
            e.preventDefault();
            logout();
        }
    });
}

function logout() {
    // Clear current user
    localStorage.removeItem('currentUser');
    
    // Clear cart if you want user-specific carts
    // localStorage.removeItem('cart');
    
    // Show notification
    showNotification('Successfully logged out', 'success');
    
    // Redirect to home page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

function protectCheckout() {
    if (window.location.pathname.includes('checkout.html')) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            showNotification('Please login to checkout', 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        }
    }
}

// Add this to the DOMContentLoaded event listener in index.js:
// Add initAuth() to the initialization sequence
document.addEventListener('DOMContentLoaded', () => {
    // Existing initialization...
    initLoadingScreen();
    initAnimations();
    initSlider();
    initHeader();
    initBackToTop();
    initCart();
    initProducts();
    initNewsletter();
    initAuth(); // Add this line
    
    // Rest of the code...
});

// Add this function to index.js to handle logout from any page

// Check login status on page load
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
});

function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    const userActions = document.querySelector('.user-actions');
    
    if (!userActions) return;
    
    const userIcon = userActions.querySelector('.user-icon');
    const userDropdown = userActions.querySelector('.user-dropdown');
    
    if (isLoggedIn && currentUser) {
        // Update for logged in user
        if (userIcon) {
            userIcon.innerHTML = '<ion-icon name="person-circle-outline"></ion-icon>';
        }
        
        if (userDropdown) {
            userDropdown.innerHTML = `
                <a href="#" class="user-welcome">Welcome, ${currentUser.firstName || currentUser.email.split('@')[0]}</a>
                <a href="#">My Orders</a>
                <a href="#">Wishlist</a>
                <a href="#" onclick="logout()" class="logout-link">Logout</a>
            `;
        }
    } else {
        // Update for logged out user
        if (userIcon) {
            userIcon.innerHTML = '<ion-icon name="person-outline"></ion-icon>';
        }
        
        if (userDropdown) {
            userDropdown.innerHTML = `
                <a href="login.html">Sign In</a>
                <a href="#">My Orders</a>
                <a href="#">Wishlist</a>
            `;
        }
    }
}

// Global logout function
window.logout = function() {
    // Clear user data
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    
    // Show notification if function exists
    if (typeof showNotification === 'function') {
        showNotification('Logged out successfully', 'success');
    }
    
    // Reload the page to update UI
    setTimeout(() => {
        window.location.reload();
    }, 1000);
};