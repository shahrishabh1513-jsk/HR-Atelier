// Enhanced cart.js - Integrated with main design system

let cart = [];
let products = [];
let isCartInitialized = false;

// Initialize cart system
function initCartSystem() {
    loadCart();
    getProductsData();
    checkCart();
    setupCartEventListeners();
}

// Load products data
async function getProductsData() {
    try {
        const response = await fetch('json/products.json');
        products = await response.json();
        console.log('Products loaded:', products.length);
    } catch (error) {
        console.error('Error loading products:', error);
        // Use hardcoded products as fallback
        products = getFallbackProducts();
    }
}

// Fallback products if JSON fails
function getFallbackProducts() {
    return [
        {
            id: 1,
            name: "Elegant Blue Evening Dress",
            price: "$129.99",
            images: ["https://i.pinimg.com/736x/94/5b/79/945b7931fbb9f8922102ac0566e02060.jpg"],
            category: "Women's Evening Wear"
        },
        // Add more fallback products as needed
    ];
}

// Load cart from localStorage
function loadCart() {
    try {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            cart = JSON.parse(storedCart);
            console.log('Cart loaded:', cart.length, 'items');
        }
    } catch (error) {
        console.error('Error loading cart:', error);
        cart = [];
    }
}

// Save cart to localStorage
function saveCart() {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        dispatchCartUpdatedEvent();
    } catch (error) {
        console.error('Error saving cart:', error);
    }
}

// Add product to cart
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id == productId);
    if (!product) {
        console.error('Product not found:', productId);
        showNotification('Product not found', 'error');
        return false;
    }

    const existingItem = cart.find(item => item.id == productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity,
            addedAt: new Date().toISOString()
        });
    }
    
    saveCart();
    showNotification(`${product.name} added to cart!`, 'success');
    
    // Update cart display if cart sidebar is open
    if (document.querySelector('.cart-sidebar.active')) {
        updateCartDisplay();
    }
    
    return true;
}

// Remove product from cart
function removeFromCart(productId) {
    const initialLength = cart.length;
    cart = cart.filter(item => item.id != productId);
    
    if (cart.length < initialLength) {
        saveCart();
        showNotification('Item removed from cart', 'success');
        return true;
    }
    return false;
}

// Update product quantity
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        return removeFromCart(productId);
    }
    
    const item = cart.find(item => item.id == productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        return true;
    }
    return false;
}

// Calculate cart total
function calculateCartTotal() {
    return cart.reduce((total, item) => {
        const price = parseFloat(item.price.replace('$', '')) || 0;
        return total + (price * (item.quantity || 1));
    }, 0);
}

// Update cart count in header
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    // Update all cart count elements
    document.querySelectorAll('.cart-count, #cart-counter').forEach(element => {
        element.textContent = totalItems;
        element.style.display = totalItems > 0 ? 'flex' : 'none';
    });
    
    return totalItems;
}

// Update cart display in sidebar
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    
    if (!cartItemsContainer || !cartTotalElement) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <ion-icon name="bag-outline"></ion-icon>
                <p>Your cart is empty</p>
                <a href="products.html" class="btn-primary" style="margin-top: 1rem;">Start Shopping</a>
            </div>
        `;
        cartTotalElement.textContent = '$0.00';
    } else {
        let itemsHTML = '';
        let subtotal = 0;
        
        cart.forEach(item => {
            const price = parseFloat(item.price.replace('$', '')) || 0;
            const itemTotal = price * (item.quantity || 1);
            subtotal += itemTotal;
            
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
                    <div class="cart-item-actions">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span class="quantity">${item.quantity || 1}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                        <button class="remove-item" data-id="${item.id}" title="Remove">
                            <ion-icon name="close-outline"></ion-icon>
                        </button>
                    </div>
                </div>
            `;
        });
        
        cartItemsContainer.innerHTML = itemsHTML;
        cartTotalElement.textContent = `$${subtotal.toFixed(2)}`;
        
        // Add event listeners to cart item buttons
        setupCartItemEventListeners();
    }
}

// Setup cart item event listeners
function setupCartItemEventListeners() {
    // Quantity minus buttons
    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.currentTarget.dataset.id;
            const item = cart.find(item => item.id == productId);
            if (item && item.quantity > 1) {
                item.quantity--;
                saveCart();
                updateCartDisplay();
            }
        });
    });
    
    // Quantity plus buttons
    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.currentTarget.dataset.id;
            const item = cart.find(item => item.id == productId);
            if (item) {
                item.quantity++;
                saveCart();
                updateCartDisplay();
            }
        });
    });
    
    // Remove item buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.currentTarget.dataset.id;
            if (removeFromCart(productId)) {
                updateCartDisplay();
            }
        });
    });
}

// Setup cart event listeners
function setupCartEventListeners() {
    // Cart icon click
    const cartIcon = document.querySelector('.cart-icon, .icon-cart');
    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            const cartSidebar = document.getElementById('cartSidebar');
            if (cartSidebar) {
                cartSidebar.classList.add('active');
                document.body.style.overflow = 'hidden';
                updateCartDisplay();
            }
        });
    }
    
    // Close cart button
    const closeCartBtn = document.getElementById('closeCart');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            const cartSidebar = document.getElementById('cartSidebar');
            if (cartSidebar) {
                cartSidebar.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Close cart when clicking outside
    document.addEventListener('click', (e) => {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartIcon = document.querySelector('.cart-icon, .icon-cart');
        
        if (cartSidebar && cartSidebar.classList.contains('active') &&
            !cartSidebar.contains(e.target) &&
            !cartIcon.contains(e.target)) {
            cartSidebar.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Check cart and update UI
function checkCart() {
    updateCartCount();
    
    // If on cart page, update cart page display
    if (window.location.pathname.includes('cartPage.html')) {
        updateCartPage();
    }
}

// Update cart page
function updateCartPage() {
    if (cart.length === 0) {
        document.querySelector('.cart-items-container')?.innerHTML = `
            <div class="empty-cart-message">
                <ion-icon name="bag-outline"></ion-icon>
                <h3>Your cart is empty</h3>
                <p>Add some products to your cart to continue shopping</p>
                <a href="products.html" class="btn-primary">Browse Products</a>
            </div>
        `;
    } else {
        // Update cart page items and totals
        const subtotal = calculateCartTotal();
        const shipping = 10.00; // Example shipping cost
        const total = subtotal + shipping;
        
        document.getElementById('cartSubtotal')?.textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('cartShipping')?.textContent = `$${shipping.toFixed(2)}`;
        document.getElementById('cartTotal')?.textContent = `$${total.toFixed(2)}`;
    }
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn) {
        window.location.href = 'checkout.html';
    } else {
        showNotification('Please login to proceed to checkout', 'error');
        setTimeout(() => {
            window.location.href = 'login.html?redirect=checkout';
        }, 1500);
    }
}

// Show notification
function showNotification(message, type = 'success') {
    // Use existing notification system if available
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
        return;
    }
    
    // Fallback notification
    console.log(`${type.toUpperCase()}: ${message}`);
}

// Dispatch cart updated event
function dispatchCartUpdatedEvent() {
    window.dispatchEvent(new CustomEvent('cartUpdated', {
        detail: { cart: cart, total: calculateCartTotal() }
    }));
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initCartSystem);

// Export functions for use in other files
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.checkout = checkout;
window.getCart = () => cart;
window.getCartTotal = calculateCartTotal;

