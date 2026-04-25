// Wait for the page to load
document.addEventListener('DOMContentLoaded', function() {
    // Load cart items in the form
    loadCartItemsForForm();
    
    // Check if we're on the confirmation page (after form submission)
    checkForConfirmationPage();
    
    // Initialize payment method toggle
    initPaymentMethods();
});

// Delivery charge constant
const DELIVERY_CHARGE = 100;

function initPaymentMethods() {
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            // Hide all payment details
            document.getElementById('cardDetails').style.display = 'none';
            document.getElementById('upiDetails').style.display = 'none';
            document.getElementById('netbankingDetails').style.display = 'none';
            document.getElementById('codDetails').style.display = 'none';
            
            // Show selected payment details
            if (this.value === 'card') {
                document.getElementById('cardDetails').style.display = 'block';
            } else if (this.value === 'upi') {
                document.getElementById('upiDetails').style.display = 'block';
            } else if (this.value === 'netbanking') {
                document.getElementById('netbankingDetails').style.display = 'block';
            } else if (this.value === 'cod') {
                document.getElementById('codDetails').style.display = 'block';
            }
        });
    });
    
    // Format card number input
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formattedValue += ' ';
                }
                formattedValue += value[i];
            }
            e.target.value = formattedValue;
        });
    }
    
    // Format expiry date
    const expiryDate = document.getElementById('expiryDate');
    if (expiryDate) {
        expiryDate.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }
    
    // Format CVV
    const cvv = document.getElementById('cvv');
    if (cvv) {
        cvv.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
        });
    }
}

function loadCartItemsForForm() {
    const cartItemsContainer = document.getElementById('cartItems');
    if (!cartItemsContainer) return;
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let subtotal = 0;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        document.getElementById('formSubtotal').innerHTML = '₹0.00';
        document.getElementById('formDeliveryCharge').innerHTML = `₹${DELIVERY_CHARGE}.00`;
        document.getElementById('formTotalPrice').innerHTML = `₹${DELIVERY_CHARGE}.00`;
        return;
    }
    
    let html = '';
    cart.forEach((item, index) => {
        const price = parseFloat(item.price) || 
                     parseFloat(item.productPrice) || 
                     parseFloat(item.discountedPrice) || 
                     0;
        const quantity = parseInt(item.quantity) || 
                        parseInt(item.qty) || 
                        1;
        const itemTotal = price * quantity;
        subtotal += itemTotal;
        
        html += `
            <div class="cart-item">
                <span class="item-name">${item.name || item.productName || 'Product'}</span>
                <span class="item-quantity">x${quantity}</span>
                <span class="item-price">₹${price.toFixed(2)}</span>
                <span class="item-total">₹${itemTotal.toFixed(2)}</span>
            </div>
        `;
    });
    
    // Calculate total with delivery charge
    const total = subtotal + DELIVERY_CHARGE;
    
    cartItemsContainer.innerHTML = html;
    document.getElementById('formSubtotal').innerHTML = `₹${subtotal.toFixed(2)}`;
    document.getElementById('formDeliveryCharge').innerHTML = `₹${DELIVERY_CHARGE}.00`;
    document.getElementById('formTotalPrice').innerHTML = `₹${total.toFixed(2)}`;
    
    // Store subtotal and total in localStorage
    localStorage.setItem('subtotal', subtotal.toString());
    localStorage.setItem('delivery_charge', DELIVERY_CHARGE.toString());
    localStorage.setItem('total price', total.toString());
}

function validatePaymentDetails(paymentMethod) {
    if (paymentMethod === 'card') {
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;
        const cardName = document.getElementById('cardName').value;
        
        if (!cardNumber || cardNumber.length < 16) {
            alert('Please enter a valid 16-digit card number');
            return false;
        }
        
        if (!expiryDate || !expiryDate.match(/^\d{2}\/\d{2}$/)) {
            alert('Please enter a valid expiry date (MM/YY)');
            return false;
        }
        
        if (!cvv || cvv.length < 3) {
            alert('Please enter a valid CVV');
            return false;
        }
        
        if (!cardName) {
            alert('Please enter the name on card');
            return false;
        }
    }
    
    if (paymentMethod === 'upi') {
        const upiId = document.getElementById('upiId').value;
        if (!upiId || !upiId.includes('@')) {
            alert('Please enter a valid UPI ID');
            return false;
        }
    }
    
    if (paymentMethod === 'netbanking') {
        const bank = document.getElementById('bankSelect').value;
        if (!bank) {
            alert('Please select a bank');
            return false;
        }
    }
    
    return true;
}

function submitCustomerDetails(event) {
    event.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const address2 = document.getElementById('address2').value.trim();
    const city = document.getElementById('city').value.trim();
    const state = document.getElementById('state').value.trim();
    const pincode = document.getElementById('pincode').value.trim();
    
    // Get payment method
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    // Validate
    if (!name || !email || !phone || !address || !city || !state || !pincode) {
        alert('Please fill in all required fields');
        return false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return false;
    }
    
    // Validate phone (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
        alert('Please enter a valid 10-digit phone number');
        return false;
    }
    
    // Validate pincode (6 digits)
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(pincode)) {
        alert('Please enter a valid 6-digit pincode');
        return false;
    }
    
    // Validate payment details
    if (!validatePaymentDetails(paymentMethod)) {
        return false;
    }
    
    // Combine address
    const fullAddress = `${address}${address2 ? ', ' + address2 : ''}, ${city}, ${state} - ${pincode}`;
    
    // Save to localStorage
    localStorage.setItem('customer_name', name);
    localStorage.setItem('customer_email', email);
    localStorage.setItem('customer_phone', phone);
    localStorage.setItem('customer_address', fullAddress);
    
    // Save payment method
    localStorage.setItem('payment_method', paymentMethod);
    
    // Generate order ID
    const orderId = 'ORD-' + Date.now().toString().slice(-8);
    localStorage.setItem('order_id', orderId);
    
    // Calculate and save totals (subtotal already saved in loadCartItemsForForm)
    const subtotal = parseFloat(localStorage.getItem('subtotal')) || 0;
    const total = subtotal + DELIVERY_CHARGE;
    localStorage.setItem('total price', total.toString());
    
    // Show processing message for online payments
    if (paymentMethod !== 'cod') {
        alert('Processing payment...');
        // Simulate payment processing
        setTimeout(() => {
            localStorage.setItem('payment_status', 'Completed');
            // Hide form and show confirmation
            showConfirmationPage();
        }, 2000);
    } else {
        localStorage.setItem('payment_status', 'Pending (COD)');
        // Hide form and show confirmation
        showConfirmationPage();
    }
    
    return false;
}

function calculateTotalFromCart() {
    try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        let subtotal = 0;
        
        cart.forEach(item => {
            const price = parseFloat(item.price) || 
                         parseFloat(item.productPrice) || 
                         parseFloat(item.discountedPrice) || 
                         0;
            
            const quantity = parseInt(item.quantity) || 
                            parseInt(item.qty) || 
                            1;
            
            subtotal += price * quantity;
        });
        
        // Add delivery charge
        const total = subtotal + DELIVERY_CHARGE;
        
        // Store in localStorage
        localStorage.setItem('subtotal', subtotal.toString());
        localStorage.setItem('delivery_charge', DELIVERY_CHARGE.toString());
        localStorage.setItem('total price', total.toString());
        
        return total;
    } catch (error) {
        console.error('Error calculating cart total:', error);
        return DELIVERY_CHARGE; // Return at least delivery charge if error
    }
}

function showConfirmationPage() {
    // Hide customer form
    const formContainer = document.getElementById('customerForm');
    if (formContainer) {
        formContainer.style.display = 'none';
    }
    
    // Show checkout confirmation
    const checkoutOverlay = document.getElementById('checkout-overlay');
    if (checkoutOverlay) {
        checkoutOverlay.style.display = 'block';
    }
    
    // Load all data for confirmation page
    loadConfirmationPageData();
}

function checkForConfirmationPage() {
    // Check if we have customer data (meaning form was submitted)
    if (localStorage.getItem('customer_name')) {
        showConfirmationPage();
    }
}

function loadConfirmationPageData() {
    // Show animation
    showCheckAnimation();
    
    // Add date
    addDate();
    
    // Display customer details
    displayCustomerDetails();
    
    // Display payment details
    displayPaymentDetails();
    
    // Display order details with delivery charge breakdown
    displayOrderDetails();
    
    // Save order to history
    saveOrderToHistory();
}

function showCheckAnimation(){
    const checkIconContainer = document.getElementById('checkoutIcon');
    if (!checkIconContainer) return;
    
    checkIconContainer.innerHTML = '';
    const newCheckIcon = document.createElement('div');
    newCheckIcon.style.width = '200px';
    newCheckIcon.style.height = '200px';
    checkIconContainer.appendChild(newCheckIcon);

    lottie.loadAnimation({
        container: newCheckIcon,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        path: 'json/AnimationCheckoutPage.json' 
    });
}

function addDate(){
    let date = document.getElementById("order_date");
    if (!date) return;
    
    const now = new Date();
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const day = now.getDate(); 
    const month = months[now.getMonth()]; 
    const year = now.getFullYear();
    date.innerHTML = `${month} ${day}, ${year}`;
}

function displayCustomerDetails() {
    // Get customer details from localStorage
    const customerName = localStorage.getItem('customer_name') || 'N/A';
    const customerEmail = localStorage.getItem('customer_email') || 'N/A';
    const customerPhone = localStorage.getItem('customer_phone') || 'N/A';
    const customerAddress = localStorage.getItem('customer_address') || 'N/A';
    
    // Display customer details
    const nameEl = document.getElementById('customer_name');
    const emailEl = document.getElementById('customer_email');
    const phoneEl = document.getElementById('customer_phone');
    const addressEl = document.getElementById('customer_address');
    
    if (nameEl) nameEl.textContent = customerName;
    if (emailEl) emailEl.textContent = customerEmail;
    if (phoneEl) phoneEl.textContent = customerPhone;
    if (addressEl) addressEl.textContent = customerAddress;
}

function displayPaymentDetails() {
    const paymentMethod = localStorage.getItem('payment_method') || 'N/A';
    const paymentStatus = localStorage.getItem('payment_status') || 'Pending';
    
    // Format payment method name for display
    let displayMethod = paymentMethod;
    if (paymentMethod === 'card') displayMethod = 'Credit/Debit Card';
    else if (paymentMethod === 'upi') displayMethod = 'UPI';
    else if (paymentMethod === 'netbanking') displayMethod = 'Net Banking';
    else if (paymentMethod === 'cod') displayMethod = 'Cash on Delivery';
    
    const methodEl = document.getElementById('payment_method');
    const statusEl = document.getElementById('payment_status');
    
    if (methodEl) methodEl.textContent = displayMethod;
    if (statusEl) {
        statusEl.textContent = paymentStatus;
        // Add class based on status
        if (paymentStatus.includes('Completed')) {
            statusEl.className = 'status-completed';
        } else {
            statusEl.className = 'status-pending';
        }
    }
}

function displayOrderDetails() {
    // Display subtotal
    let subtotal = localStorage.getItem('subtotal') || '0';
    subtotal = parseFloat(subtotal) || 0;
    
    // Display delivery charge
    let deliveryCharge = localStorage.getItem('delivery_charge') || DELIVERY_CHARGE.toString();
    deliveryCharge = parseFloat(deliveryCharge) || DELIVERY_CHARGE;
    
    // Display total price
    let total = localStorage.getItem('total price') || (subtotal + deliveryCharge).toString();
    total = parseFloat(total) || (subtotal + deliveryCharge);
    
    // Update the order details section with breakdown
    const orderDetailsEl = document.querySelector('.order-details');
    if (orderDetailsEl) {
        // Create price breakdown HTML
        const priceBreakdown = `
            <div class="price-breakdown">
                <p><strong>Subtotal:</strong> <span>₹${subtotal.toFixed(2)}</span></p>
                <p><strong>Delivery Charge:</strong> <span>₹${deliveryCharge.toFixed(2)}</span></p>
                <p class="total-row"><strong>Total Amount:</strong> <span>₹${total.toFixed(2)}</span></p>
            </div>
        `;
        
        // Insert after existing content or replace the total price span
        const existingTotal = document.getElementById('total_price');
        if (existingTotal) {
            existingTotal.innerHTML = `₹${total.toFixed(2)}`;
        }
        
        // Add price breakdown if not already present
        if (!document.querySelector('.price-breakdown')) {
            const orderDetailsP = orderDetailsEl.querySelectorAll('p');
            if (orderDetailsP.length > 0) {
                // Insert before the last paragraph or after order ID and date
                const lastP = orderDetailsP[orderDetailsP.length - 1];
                lastP.insertAdjacentHTML('beforebegin', priceBreakdown);
            } else {
                orderDetailsEl.insertAdjacentHTML('beforeend', priceBreakdown);
            }
        }
    }
    
    // Display order ID
    let orderId = localStorage.getItem('order_id');
    if (!orderId) {
        orderId = 'ORD-' + Math.floor(Math.random() * 1000000);
        localStorage.setItem('order_id', orderId);
    }
    
    const idOrder = document.getElementById('id_order');
    if (idOrder) {
        idOrder.textContent = orderId;
    }
}

function saveOrderToHistory() {
    // Get cart items
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Get totals
    const subtotal = parseFloat(localStorage.getItem('subtotal')) || 0;
    const deliveryCharge = parseFloat(localStorage.getItem('delivery_charge')) || DELIVERY_CHARGE;
    const total = parseFloat(localStorage.getItem('total price')) || (subtotal + deliveryCharge);
    
    // Get order details
    const orderDetails = {
        orderId: localStorage.getItem('order_id') || 'ORD-' + Date.now(),
        customerName: localStorage.getItem('customer_name') || 'N/A',
        customerEmail: localStorage.getItem('customer_email') || 'N/A',
        customerPhone: localStorage.getItem('customer_phone') || 'N/A',
        customerAddress: localStorage.getItem('customer_address') || 'N/A',
        paymentMethod: localStorage.getItem('payment_method') || 'N/A',
        paymentStatus: localStorage.getItem('payment_status') || 'Pending',
        subtotal: subtotal,
        deliveryCharge: deliveryCharge,
        totalAmount: total,
        orderDate: new Date().toISOString(),
        items: cartItems.map(item => ({
            name: item.name || item.productName || 'Product',
            price: parseFloat(item.price) || parseFloat(item.productPrice) || 0,
            quantity: parseInt(item.quantity) || parseInt(item.qty) || 1
        }))
    };
    
    // Get existing order history or create new array
    let orderHistory = JSON.parse(localStorage.getItem('order_history')) || [];
    
    // Add new order to history
    orderHistory.push(orderDetails);
    
    // Save back to localStorage
    localStorage.setItem('order_history', JSON.stringify(orderHistory));
}

function backHome() {
    // Clear all order-related data when going back home
    localStorage.removeItem('customer_name');
    localStorage.removeItem('customer_email');
    localStorage.removeItem('customer_phone');
    localStorage.removeItem('customer_address');
    localStorage.removeItem('payment_method');
    localStorage.removeItem('payment_status');
    localStorage.removeItem('subtotal');
    localStorage.removeItem('delivery_charge');
    localStorage.removeItem('total price');
    localStorage.removeItem('order_id');
    localStorage.removeItem('cart');
    
    window.location.href = "index.html"; 
}