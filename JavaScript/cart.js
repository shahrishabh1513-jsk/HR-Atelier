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
        console.log('Sample product price formats:', products.slice(0, 3).map(p => ({
            name: p.name,
            price: p.price,
            priceType: typeof p.price
        })));
    } catch (error) {
        console.error('Error loading products:', error);
        // Use hardcoded products as fallback
        products = getFallbackProducts();
    }
}

// Fallback products if JSON fails (with INR prices)
function getFallbackProducts() {
    return [
        {
            id: 1,
            name: "Elegant Blue Evening Dress",
            price: "₹899",
            images: ["https://i.pinimg.com/736x/94/5b/79/945b7931fbb9f8922102ac0566e02060.jpg"],
            category: "Women's Evening Wear"
        },
        {
            id: 2,
            name: "Designer Handbag",
            price: "₹3299",
            images: ["images/bag1.jpg"],
            category: "Bags"
        },
        {
            id: 3,
            name: "Gold Plated Necklace",
            price: "₹2199",
            images: ["images/jewelry1.jpg"],
            category: "Jewelry"
        },
        {
            id: 4,
            name: "Men's Formal Shirt",
            price: "₹1899",
            images: ["images/shirt1.jpg"],
            category: "Men's Fashion"
        },
        {
            id: 5,
            name: "Leather Wallet",
            price: "₹1299",
            images: ["images/wallet1.jpg"],
            category: "Accessories"
        }
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
        // Update cart page if we're on it
        if (window.location.pathname.includes('cartPage.html')) {
            updateCartPage();
        }
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

    // Ensure price is stored as a number without any currency symbol
    let productPrice = product.price;
    if (typeof productPrice === 'string') {
        // Remove ₹ symbol and any other non-numeric characters
        productPrice = parseFloat(productPrice.replace(/[^0-9.-]+/g, '')) || 0;
    }
    
    // Create a clean product object with numeric price
    const cleanProduct = {
        ...product,
        price: productPrice, // Store as number
        originalPrice: product.originalPrice ? parseFloat(product.originalPrice.replace(/[^0-9.-]+/g, '')) || 0 : null
    };

    const existingItem = cart.find(item => item.id == productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...cleanProduct,
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
        const price = typeof item.price === 'number' ? item.price : 
                     (parseFloat(item.price?.replace(/[^0-9.-]+/g, '')) || 0);
        return total + (price * (item.quantity || 1));
    }, 0);
}

// Update cart count in header
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    // Update all cart count elements
    document.querySelectorAll('.cart-count, #cart-counter').forEach(element => {
        element.textContent = totalItems;
        element.style.display = totalItems > 0 ? 'flex' : 'block';
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
        cartTotalElement.textContent = '₹0.00';
    } else {
        let itemsHTML = '';
        let subtotal = 0;
        
        cart.forEach(item => {
            const price = typeof item.price === 'number' ? item.price : 
                         (parseFloat(item.price?.replace(/[^0-9.-]+/g, '')) || 0);
            const itemTotal = price * (item.quantity || 1);
            subtotal += itemTotal;
            
            itemsHTML += `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.images?.[0] || 'images/placeholder.jpg'}" 
                         alt="${item.name || 'Product'}" 
                         width="60" 
                         height="60"
                         onerror="this.src='images/placeholder.jpg'">
                    <div class="cart-item-info">
                        <h4>${item.name || 'Product'}</h4>
                        <p>₹${price.toFixed(2)} × ${item.quantity || 1}</p>
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
        cartTotalElement.textContent = `₹${subtotal.toFixed(2)}`;
        
        // Add event listeners to cart item buttons
        setupCartItemEventListeners();
    }
}

// Setup cart item event listeners
function setupCartItemEventListeners() {
    // Quantity minus buttons
    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.removeEventListener('click', handleMinusClick);
        button.addEventListener('click', handleMinusClick);
    });
    
    // Quantity plus buttons
    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.removeEventListener('click', handlePlusClick);
        button.addEventListener('click', handlePlusClick);
    });
    
    // Remove item buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.removeEventListener('click', handleRemoveClick);
        button.addEventListener('click', handleRemoveClick);
    });
}

// Handler functions for cart item events
function handleMinusClick(e) {
    e.preventDefault();
    const productId = e.currentTarget.dataset.id;
    const item = cart.find(item => item.id == productId);
    if (item && item.quantity > 1) {
        item.quantity--;
        saveCart();
        updateCartDisplay();
        if (window.location.pathname.includes('cartPage.html')) {
            updateCartPage();
        }
    }
}

function handlePlusClick(e) {
    e.preventDefault();
    const productId = e.currentTarget.dataset.id;
    const item = cart.find(item => item.id == productId);
    if (item) {
        item.quantity++;
        saveCart();
        updateCartDisplay();
        if (window.location.pathname.includes('cartPage.html')) {
            updateCartPage();
        }
    }
}

function handleRemoveClick(e) {
    e.preventDefault();
    const productId = e.currentTarget.dataset.id;
    if (removeFromCart(productId)) {
        updateCartDisplay();
        if (window.location.pathname.includes('cartPage.html')) {
            updateCartPage();
        }
    }
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
            !cartIcon?.contains(e.target)) {
            cartSidebar.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Promo code apply button
    const applyBtn = document.querySelector('.apply-btn');
    if (applyBtn) {
        applyBtn.addEventListener('click', applyPromoCode);
    }

    // Checkout buttons
    document.querySelectorAll('.checkout-btn').forEach(btn => {
        btn.removeEventListener('click', checkout);
        btn.addEventListener('click', checkout);
    });
}

// Apply promo code
function applyPromoCode() {
    const codeInput = document.getElementById('code');
    if (!codeInput) return;
    
    const code = codeInput.value.trim().toUpperCase();
    
    // Example promo codes
    const promoCodes = {
        'SAVE10': 0.1, // 10% off
        'SAVE20': 0.2, // 20% off
        'SAVE50': 0.5, // 50% off
        'FREESHIP': 0 // Free shipping (handled separately)
    };
    
    if (promoCodes.hasOwnProperty(code)) {
        if (code === 'FREESHIP') {
            // Apply free shipping
            localStorage.setItem('promoCode', JSON.stringify({
                code: code,
                type: 'freeshipping'
            }));
            showNotification('Free shipping applied!', 'success');
        } else {
            // Apply discount
            localStorage.setItem('promoCode', JSON.stringify({
                code: code,
                type: 'discount',
                value: promoCodes[code]
            }));
            showNotification(`${code} applied! ${promoCodes[code] * 100}% discount`, 'success');
        }
        updateCartPage();
    } else {
        showNotification('Invalid promo code', 'error');
    }
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
    const cartProductsContainer = document.querySelector('.cart_products');
    const cartCountsSpan = document.getElementById('cart_counts');
    const subtotalSpan = document.getElementById('Subtotal');
    const deliverySpan = document.getElementById('Delivery');
    const totalOrderSpan = document.getElementById('total_order');
    
    if (!cartProductsContainer) return;
    
    if (cart.length === 0) {
        cartProductsContainer.innerHTML = `
            <div class="empty-cart-message">
                <ion-icon name="bag-outline"></ion-icon>
                <p>Your shopping bag is empty</p>
                <a href="products.html" class="btn-primary">Continue Shopping</a>
            </div>
        `;
        
        if (cartCountsSpan) cartCountsSpan.textContent = '(0 items)';
        if (subtotalSpan) subtotalSpan.textContent = '₹0.00';
        if (deliverySpan) deliverySpan.textContent = '₹100.00';
        if (totalOrderSpan) totalOrderSpan.textContent = '₹100.00';
        
    } else {
        let productsHTML = '';
        let subtotal = 0;
        
        cart.forEach(item => {
            // Get price (already stored as number from addToCart)
            const price = typeof item.price === 'number' ? item.price : 
                         (parseFloat(item.price?.replace(/[^0-9.-]+/g, '')) || 0);
            
            // Calculate item total
            const itemTotal = price * (item.quantity || 1);
            subtotal += itemTotal;
            
            // Format the price for display
            const formattedPrice = `₹${itemTotal.toFixed(2)}`;
            
            productsHTML += `
                <div class="cart-product-item" data-id="${item.id}">
                    <div class="product-image">
                        <img src="${item.images?.[0] || 'images/placeholder.jpg'}" 
                             alt="${item.name || 'Product'}"
                             onerror="this.src='images/placeholder.jpg'">
                    </div>
                    <div class="product-details">
                        <h3>${item.name || 'Product'}</h3>
                        <p class="product-category">${item.category || 'Fashion'}</p>
                        <div class="product-price">
                            <span class="current-price">${formattedPrice}</span>
                        </div>
                        <div class="product-actions">
                            <div class="quantity-controls">
                                <button class="quantity-btn minus" data-id="${item.id}">-</button>
                                <span class="quantity">${item.quantity || 1}</span>
                                <button class="quantity-btn plus" data-id="${item.id}">+</button>
                            </div>
                            <button class="remove-btn" data-id="${item.id}">
                                <ion-icon name="trash-outline"></ion-icon>
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        // Calculate delivery (free over ₹3000)
        const delivery = subtotal > 3000 ? 0 : 100;
        const total = subtotal + delivery;
        
        // Update UI with formatted prices
        if (cartCountsSpan) cartCountsSpan.textContent = `(${cart.length} items)`;
        if (subtotalSpan) subtotalSpan.textContent = `₹${subtotal.toFixed(2)}`;
        if (deliverySpan) deliverySpan.textContent = delivery === 0 ? 'Free' : `₹${delivery.toFixed(2)}`;
        if (totalOrderSpan) totalOrderSpan.textContent = `₹${total.toFixed(2)}`;
        
        // Set the products HTML
        cartProductsContainer.innerHTML = productsHTML;
        
        // Add event listeners for cart page items
        setupCartPageEventListeners();
    }
}

// Setup cart page event listeners
function setupCartPageEventListeners() {
    // Quantity minus buttons
    document.querySelectorAll('.cart-product-item .quantity-btn.minus').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = e.currentTarget.dataset.id;
            const item = cart.find(item => item.id == productId);
            if (item && item.quantity > 1) {
                item.quantity--;
                saveCart();
                updateCartPage();
            }
        });
    });
    
    // Quantity plus buttons
    document.querySelectorAll('.cart-product-item .quantity-btn.plus').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = e.currentTarget.dataset.id;
            const item = cart.find(item => item.id == productId);
            if (item) {
                item.quantity++;
                saveCart();
                updateCartPage();
            }
        });
    });
    
    // Remove buttons
    document.querySelectorAll('.cart-product-item .remove-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = e.currentTarget.dataset.id;
            if (removeFromCart(productId)) {
                updateCartPage();
            }
        });
    });
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
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Dispatch cart updated event
function dispatchCartUpdatedEvent() {
    window.dispatchEvent(new CustomEvent('cartUpdated', {
        detail: { cart: cart, total: calculateCartTotal() }
    }));
}

// Debug function to check cart items
function debugCart() {
    console.log('Current cart contents:', cart);
    cart.forEach((item, index) => {
        console.log(`Item ${index + 1}:`, {
            name: item.name,
            price: item.price,
            priceType: typeof item.price,
            quantity: item.quantity,
            total: (typeof item.price === 'number' ? item.price : 0) * (item.quantity || 1)
        });
    });
}

// Calculate cart total in INR
function getCartTotalINR() {
    const total = calculateCartTotal();
    return `₹${total.toFixed(2)}`;
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
window.getCartTotalINR = getCartTotalINR;
window.debugCart = debugCart;