// ===== SLIDER FUNCTIONALITY =====
let currentSlide = 0;
let sliderInterval;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const totalSlides = slides.length;

// Initialize slider
function initSlider() {
    if (slides.length === 0) return;
    
    // Set first slide as active
    slides[0].classList.add('active');
    dots[0].classList.add('active');
    
    // Start auto-play
    startSlider();
}

// Next slide
function nextSlide() {
    goToSlide((currentSlide + 1) % totalSlides);
}

// Previous slide
function prevSlide() {
    goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
}

// Go to specific slide
function goToSlide(n) {
    // Remove active class from current slide
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    // Update current slide
    currentSlide = n;
    
    // Add active class to new slide
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    
    // Restart auto-play
    restartSlider();
}

// Start auto-play
function startSlider() {
    sliderInterval = setInterval(nextSlide, 5000);
}

// Restart auto-play
function restartSlider() {
    clearInterval(sliderInterval);
    startSlider();
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
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Search toggle
    if (searchToggle && searchBox) {
        searchToggle.addEventListener('click', () => {
            searchBox.classList.toggle('active');
            if (searchBox.classList.contains('active')) {
                searchBox.querySelector('input').focus();
            }
        });
        
        // Close search when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchToggle.contains(e.target) && !searchBox.contains(e.target)) {
                searchBox.classList.remove('active');
            }
        });
    }
    
    // Dropdown functionality for mobile
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.nav-link');
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });
    
    // Close menu when clicking on link (mobile)
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                mainNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
}

// ===== BACK TO TOP FUNCTIONALITY =====
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
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
        if (!cartIcon.contains(e.target) && !cartSidebar.contains(e.target)) {
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
                </div>
            `;
        } else {
            let itemsHTML = '';
            cart.forEach(item => {
                const itemTotal = parseFloat(item.price.replace('$', '')) * item.quantity;
                total += itemTotal;
                count += item.quantity;
                
                itemsHTML += `
                    <div class="cart-item">
                        <img src="${item.images[0]}" alt="${item.name}" width="60">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <p>${item.price} × ${item.quantity}</p>
                        </div>
                        <button class="remove-item" data-id="${item.id}">×</button>
                    </div>
                `;
            });
            
            cartItems.innerHTML = itemsHTML;
            
            // Add event listeners to remove buttons
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.dataset.id;
                    removeFromCart(id);
                    updateCartDisplay();
                });
            });
        }
        
        // Update count and total
        cartCount.textContent = count;
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }
    
    // Remove from cart function
    function removeFromCart(id) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id != id);
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // Initial cart update
    updateCartDisplay();
}

// ===== TRENDING PRODUCTS =====
async function loadTrendingProducts() {
    try {
        const response = await fetch('json/products.json');
        const products = await response.json();
        const trendingProducts = products.filter(product => product.isTrending);
        
        displayTrendingProducts(trendingProducts);
    } catch (error) {
        console.error('Error loading trending products:', error);
        document.getElementById('trending-products').innerHTML = `
            <div class="error">Unable to load products. Please try again later.</div>
        `;
    }
}

function displayTrendingProducts(products) {
    const container = document.getElementById('trending-products');
    
    if (products.length === 0) {
        container.innerHTML = '<div class="empty">No trending products found.</div>';
        return;
    }
    
    const productsHTML = products.slice(0, 8).map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
                <div class="product-overlay">
                    <button class="quick-view" data-id="${product.id}">Quick View</button>
                    <button class="add-to-cart" data-id="${product.id}">
                        <ion-icon name="cart-outline"></ion-icon>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <span class="product-category">${product.category}</span>
                <div class="product-price">${product.price}</div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = productsHTML;
    
    // Add event listeners
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = e.target.closest('.add-to-cart').dataset.id;
            addToCart(productId);
        });
    });
    
    document.querySelectorAll('.quick-view').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.closest('.quick-view').dataset.id;
            window.location.href = `ProductDetails.html?productId=${productId}`;
        });
    });
}

// Add to cart function
function addToCart(productId, quantity = 1) {
    // This function should be implemented in cart.js
    // For now, we'll update the cart display
    console.log(`Adding product ${productId} to cart`);
    
    // Show notification
    showNotification('Product added to cart!');
    
    // Update cart display
    initCart();
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
    notification.innerHTML = `
        <span>${message}</span>
        <button class="close-notification">×</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        box-shadow: var(--shadow-lg);
        z-index: 1003;
        animation: slideIn 0.3s ease;
        min-width: 300px;
        max-width: 400px;
    `;
    
    // Close button
    const closeBtn = notification.querySelector('.close-notification');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;
    
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initSlider();
    initHeader();
    initBackToTop();
    initCart();
    loadTrendingProducts();
    
    // Slider controls
    document.querySelector('.slider-prev')?.addEventListener('click', prevSlide);
    document.querySelector('.slider-next')?.addEventListener('click', nextSlide);
    
    // Slider dots
    document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Pause slider on hover
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => {
            clearInterval(sliderInterval);
        });
        
        sliderContainer.addEventListener('mouseleave', () => {
            startSlider();
        });
    }
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            // Simple email validation
            if (email && email.includes('@')) {
                showNotification('Thank you for subscribing!');
                newsletterForm.reset();
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }
    
    // Product card hover effects
    document.addEventListener('mouseover', (e) => {
        const productCard = e.target.closest('.product-card');
        if (productCard) {
            productCard.classList.add('hover');
        }
    });
    
    document.addEventListener('mouseout', (e) => {
        const productCard = e.target.closest('.product-card');
        if (productCard) {
            productCard.classList.remove('hover');
        }
    });
});

// ===== WINDOW LOAD =====
window.addEventListener('load', () => {
    // Add loaded class for animations
    document.body.classList.add('loaded');
    
    // Update cart on page load
    initCart();
});

// Add this to the DOMContentLoaded event in main.js
document.addEventListener('DOMContentLoaded', () => {
    // Existing initializations...
    initSlider();
    initHeader();
    initBackToTop();
    initCart();
    
    // Only load trending products on index page
    if (document.getElementById('trending-products')) {
        loadTrendingProducts();
    }
    
    // Check login status
    if (typeof checkLoginStatus === 'function') {
        checkLoginStatus();
    }
    
    // Slider controls (only if on index page)
    if (document.querySelector('.slider-prev')) {
        document.querySelector('.slider-prev')?.addEventListener('click', prevSlide);
        document.querySelector('.slider-next')?.addEventListener('click', nextSlide);
        
        // Slider dots
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.addEventListener('click', () => goToSlide(index));
        });
        
        // Pause slider on hover
        const sliderContainer = document.querySelector('.slider-container');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', () => {
                clearInterval(sliderInterval);
            });
            
            sliderContainer.addEventListener('mouseleave', () => {
                startSlider();
            });
        }
    }
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            if (email && email.includes('@')) {
                showNotification('Thank you for subscribing!');
                newsletterForm.reset();
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }
});