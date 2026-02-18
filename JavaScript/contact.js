// contact.js - Short & Clean Contact Page

document.addEventListener('DOMContentLoaded', function() {
    console.log('Contact.js loaded');
    
    contactInitLoadingScreen();
    contactInitHeader();
    contactInitBackToTop();
    contactInitCart();
    contactInitForm();
    contactInitSearch();
});

// Loading Screen
function contactInitLoadingScreen() {
    const loader = document.querySelector('.contact-loading-screen');
    if (!loader) return;
    
    window.addEventListener('load', function() {
        setTimeout(function() {
            loader.classList.add('contact-hidden');
            setTimeout(() => loader.style.display = 'none', 500);
        }, 500);
    });
}

// Header
function contactInitHeader() {
    const header = document.querySelector('.contact-header');
    const mobileToggle = document.querySelector('.contact-mobile-menu-toggle');
    const nav = document.querySelector('.contact-nav');
    
    if (!header) return;
    
    // Scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('contact-scrolled');
        } else {
            header.classList.remove('contact-scrolled');
        }
    });
    
    // Mobile menu
    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', function() {
            mobileToggle.classList.toggle('contact-active');
            nav.classList.toggle('contact-active');
            document.body.style.overflow = nav.classList.contains('contact-active') ? 'hidden' : '';
        });
        
        // Close on link click
        document.querySelectorAll('.contact-nav-link').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 991) {
                    mobileToggle.classList.remove('contact-active');
                    nav.classList.remove('contact-active');
                    document.body.style.overflow = '';
                }
            });
        });
    }
}

// Search
function contactInitSearch() {
    const searchToggle = document.querySelector('.contact-search-toggle');
    const searchBox = document.querySelector('.contact-search-box');
    
    if (!searchToggle || !searchBox) return;
    
    searchToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        searchBox.classList.toggle('contact-active');
        if (searchBox.classList.contains('contact-active')) {
            searchBox.querySelector('input').focus();
        }
    });
    
    document.addEventListener('click', function(e) {
        if (!searchToggle.contains(e.target) && !searchBox.contains(e.target)) {
            searchBox.classList.remove('contact-active');
        }
    });
}

// Back to Top
function contactInitBackToTop() {
    const btn = document.getElementById('contactBackToTop');
    if (!btn) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            btn.classList.add('contact-visible');
        } else {
            btn.classList.remove('contact-visible');
        }
    });
    
    btn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Cart
function contactInitCart() {
    const cartIcon = document.querySelector('.contact-cart-icon');
    const sidebar = document.getElementById('contactCartSidebar');
    const closeBtn = document.getElementById('contactCloseCart');
    const cartItems = document.getElementById('contactCartItems');
    const cartTotal = document.getElementById('contactCartTotal');
    const cartCount = document.querySelector('.contact-cart-count');
    
    if (!sidebar) return;
    
    let cart = JSON.parse(localStorage.getItem('contactCart')) || [];
    
    function updateCart() {
        const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
        const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        
        if (cartCount) {
            cartCount.textContent = count;
            cartCount.style.display = count > 0 ? 'flex' : 'none';
        }
        
        if (cartTotal) cartTotal.textContent = '$' + total.toFixed(2);
        
        if (cartItems) {
            if (cart.length === 0) {
                cartItems.innerHTML = '<div class="contact-empty-cart"><ion-icon name="bag-outline"></ion-icon><p>Your cart is empty</p></div>';
            } else {
                let html = '';
                cart.forEach(item => {
                    html += `
                        <div style="display:flex; align-items:center; gap:1rem; padding:1rem; border-bottom:1px solid #dfe6e9;">
                            <div style="flex:1"><h4 style="margin:0; font-size:0.9rem;">${item.name}</h4><p style="margin:0; font-size:0.8rem; color:#7f8c8d;">$${item.price} x ${item.quantity}</p></div>
                            <button class="contact-remove-item" data-id="${item.id}" style="background:none; border:none; color:#ff6b6b; cursor:pointer;">✕</button>
                        </div>
                    `;
                });
                cartItems.innerHTML = html;
                
                document.querySelectorAll('.contact-remove-item').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const id = this.dataset.id;
                        cart = cart.filter(item => item.id != id);
                        localStorage.setItem('contactCart', JSON.stringify(cart));
                        updateCart();
                    });
                });
            }
        }
    }
    
    cartIcon?.addEventListener('click', function(e) {
        e.preventDefault();
        sidebar.classList.add('contact-active');
        document.body.style.overflow = 'hidden';
        updateCart();
    });
    
    closeBtn?.addEventListener('click', function() {
        sidebar.classList.remove('contact-active');
        document.body.style.overflow = '';
    });
    
    updateCart();
}

// Contact Form
function contactInitForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const subject = document.getElementById('contactSubject').value.trim();
        const message = document.getElementById('contactMessage').value.trim();
        
        if (!name || !email || !subject || !message) {
            alert('Please fill all fields');
            return;
        }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('Please enter a valid email');
            return;
        }
        
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;
        
        setTimeout(() => {
            alert('Message sent successfully! We\'ll get back to you soon.');
            form.reset();
            btn.textContent = originalText;
            btn.disabled = false;
        }, 1000);
    });
}

// Notification
function contactShowNotification(msg, type) {
    const notif = document.createElement('div');
    notif.textContent = msg;
    notif.style.cssText = `
        position: fixed; top: 100px; right: 20px; background: ${type === 'success' ? '#10b981' : '#ef4444'}; 
        color: white; padding: 1rem; border-radius: 10px; z-index: 1003; animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
}