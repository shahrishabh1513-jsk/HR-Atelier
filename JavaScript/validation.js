// Enhanced validation.js - Complete fix for login/signup

// Global variables
let isLoggedIn = false;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Validation.js loaded - Version 2.0');
    
    // Initialize login form
    initLoginForm();
    
    // Initialize signup form
    initSignupForm();
    
    // Check login status on page load
    checkLoginStatus();
    
    // Setup password toggle
    setupPasswordToggle();
    
    // Setup form validation
    setupFormValidation();
});

// ===== LOGIN FORM INITIALIZATION =====
function initLoginForm() {
    const loginBtn = document.getElementById('btn-login');
    
    if (loginBtn) {
        console.log('Login button found - attaching event listener');
        
        // Remove any existing event listeners
        loginBtn.replaceWith(loginBtn.cloneNode(true));
        
        // Get the fresh button reference
        const freshLoginBtn = document.getElementById('btn-login');
        
        freshLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogin();
        });
    } else {
        console.log('Login button NOT found - user might be on different page');
    }
}

// ===== SIGNUP FORM INITIALIZATION =====
function initSignupForm() {
    const signupBtn = document.getElementById('btn-signup');
    
    if (signupBtn) {
        console.log('Signup button found - attaching event listener');
        
        // Remove any existing event listeners
        signupBtn.replaceWith(signupBtn.cloneNode(true));
        
        // Get the fresh button reference
        const freshSignupBtn = document.getElementById('btn-signup');
        
        freshSignupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleSignup();
        });
    } else {
        console.log('Signup button NOT found');
    }
}

// ===== HANDLE LOGIN =====
function handleLogin() {
    console.log('Login handler triggered');
    
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const remember = document.getElementById('remember');
    
    // Reset error states
    clearErrors();
    
    let isValid = true;
    
    // Validate email
    if (!email || !email.value.trim()) {
        showFieldError('email', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email.value.trim())) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    } else {
        markFieldSuccess('email');
    }
    
    // Validate password
    if (!password || !password.value) {
        showFieldError('password', 'Password is required');
        isValid = false;
    } else if (password.value.length < 8) {
        showFieldError('password', 'Password must be at least 8 characters');
        isValid = false;
    } else {
        markFieldSuccess('password');
    }
    
    if (!isValid) {
        showNotification('Please fix the errors in the form', 'error');
        return;
    }
    
    // Show loading state
    const loginBtn = document.getElementById('btn-login');
    const originalText = loginBtn.innerHTML;
    loginBtn.innerHTML = '<span class="loading-dots">Signing In</span>';
    loginBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // For demo: accept any valid credentials
        const userData = {
            email: email.value.trim(),
            firstName: email.value.trim().split('@')[0],
            lastName: 'User',
            isLoggedIn: true,
            loginTime: new Date().toISOString()
        };
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email.value.trim());
        localStorage.setItem('userName', email.value.trim().split('@')[0]);
        
        if (remember && remember.checked) {
            localStorage.setItem('rememberMe', 'true');
        }
        
        console.log('Login successful - user data saved');
        
        showNotification('Login successful! Redirecting...', 'success');
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }, 1500);
}

// ===== HANDLE SIGNUP =====
function handleSignup() {
    console.log('Signup handler triggered');
    
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('signupEmail');
    const password = document.getElementById('signupPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const terms = document.getElementById('terms');
    
    // Reset error states
    clearErrors();
    
    let isValid = true;
    
    // Validate first name
    if (!firstName || !firstName.value.trim()) {
        showFieldError('firstName', 'First name is required');
        isValid = false;
    } else {
        markFieldSuccess('firstName');
    }
    
    // Validate last name
    if (!lastName || !lastName.value.trim()) {
        showFieldError('lastName', 'Last name is required');
        isValid = false;
    } else {
        markFieldSuccess('lastName');
    }
    
    // Validate email
    if (!email || !email.value.trim()) {
        showFieldError('email', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email.value.trim())) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    } else {
        markFieldSuccess('email');
    }
    
    // Validate password
    if (!password || !password.value) {
        showFieldError('password', 'Password is required');
        isValid = false;
    } else if (password.value.length < 8) {
        showFieldError('password', 'Password must be at least 8 characters');
        isValid = false;
    } else {
        // Check password strength
        const strength = checkPasswordStrength(password.value);
        updatePasswordStrength(strength);
        markFieldSuccess('password');
    }
    
    // Validate confirm password
    if (!confirmPassword || !confirmPassword.value) {
        showFieldError('confirmPassword', 'Please confirm your password');
        isValid = false;
    } else if (password && password.value !== confirmPassword.value) {
        showFieldError('confirmPassword', 'Passwords do not match');
        isValid = false;
    } else {
        markFieldSuccess('confirmPassword');
    }
    
    // Validate terms
    if (!terms || !terms.checked) {
        showFieldError('terms', 'You must agree to the terms and conditions');
        isValid = false;
    }
    
    if (!isValid) {
        showNotification('Please fix the errors in the form', 'error');
        return;
    }
    
    // Show loading state
    const signupBtn = document.getElementById('btn-signup');
    const originalText = signupBtn.innerHTML;
    signupBtn.innerHTML = '<span class="loading-dots">Creating Account</span>';
    signupBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Create user data
        const userData = {
            firstName: firstName.value.trim(),
            lastName: lastName.value.trim(),
            email: email.value.trim(),
            fullName: `${firstName.value.trim()} ${lastName.value.trim()}`,
            isLoggedIn: true,
            signupTime: new Date().toISOString()
        };
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email.value.trim());
        localStorage.setItem('userName', firstName.value.trim());
        localStorage.setItem('userPassword', password.value); // In real app, NEVER store plain password
        
        console.log('Signup successful - user data saved');
        
        showNotification('Account created successfully! Redirecting...', 'success');
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }, 1500);
}

// ===== HELPER FUNCTIONS =====

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Check password strength
function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]+/)) strength++;
    if (password.match(/[A-Z]+/)) strength++;
    if (password.match(/[0-9]+/)) strength++;
    if (password.match(/[$@#&!]+/)) strength++;
    
    return strength;
}

// Update password strength indicator
function updatePasswordStrength(strength) {
    const segments = document.querySelectorAll('.strength-segment');
    const strengthText = document.querySelector('.strength-text');
    
    if (!segments.length) return;
    
    segments.forEach((segment, index) => {
        if (index < strength) {
            segment.classList.add('active');
            if (strength <= 2) {
                segment.style.backgroundColor = '#ef4444';
            } else if (strength <= 4) {
                segment.style.backgroundColor = '#f59e0b';
            } else {
                segment.style.backgroundColor = '#10b981';
            }
        } else {
            segment.classList.remove('active');
            segment.style.backgroundColor = '';
        }
    });
    
    if (strengthText) {
        if (strength <= 2) {
            strengthText.textContent = 'Weak password';
            strengthText.style.color = '#ef4444';
        } else if (strength <= 4) {
            strengthText.textContent = 'Medium password';
            strengthText.style.color = '#f59e0b';
        } else {
            strengthText.textContent = 'Strong password';
            strengthText.style.color = '#10b981';
        }
    }
}

// Show field error
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorSpan = document.getElementById(fieldId + 'Error');
    
    if (field) {
        field.classList.add('error');
        field.classList.remove('success');
    }
    
    if (errorSpan) {
        errorSpan.textContent = message;
        errorSpan.style.display = 'block';
    }
}

// Mark field as success
function markFieldSuccess(fieldId) {
    const field = document.getElementById(fieldId);
    const errorSpan = document.getElementById(fieldId + 'Error');
    
    if (field) {
        field.classList.remove('error');
        field.classList.add('success');
    }
    
    if (errorSpan) {
        errorSpan.style.display = 'none';
    }
}

// Clear all errors
function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.style.display = 'none';
    });
    
    document.querySelectorAll('.form-group input').forEach(el => {
        el.classList.remove('error', 'success');
    });
}

// Check login status
function checkLoginStatus() {
    console.log('Checking login status...');
    
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (isLoggedIn && currentUser) {
        console.log('User is logged in:', currentUser.email);
        updateUIForLoggedInUser(currentUser);
    } else {
        console.log('User is not logged in');
        updateUIForLoggedOutUser();
    }
}

// Update UI for logged in user
function updateUIForLoggedInUser(user) {
    const userActions = document.querySelector('.user-actions');
    
    if (!userActions) return;
    
    const userIcon = userActions.querySelector('.user-icon');
    const userDropdown = userActions.querySelector('.user-dropdown');
    
    if (userIcon) {
        userIcon.innerHTML = '<ion-icon name="person-circle-outline"></ion-icon>';
        userIcon.setAttribute('title', `Logged in as ${user.firstName || user.email}`);
    }
    
    if (userDropdown) {
        userDropdown.innerHTML = `
            <a href="#" class="user-welcome">Welcome, ${user.firstName || user.email.split('@')[0]}</a>
            <a href="#">My Orders</a>
            <a href="#">Wishlist</a>
            <a href="#" onclick="logout()" class="logout-link">Logout</a>
        `;
    }
}

// Update UI for logged out user
function updateUIForLoggedOutUser() {
    const userActions = document.querySelector('.user-actions');
    
    if (!userActions) return;
    
    const userIcon = userActions.querySelector('.user-icon');
    const userDropdown = userActions.querySelector('.user-dropdown');
    
    if (userIcon) {
        userIcon.innerHTML = '<ion-icon name="person-outline"></ion-icon>';
        userIcon.setAttribute('title', 'Account');
    }
    
    if (userDropdown) {
        userDropdown.innerHTML = `
            <a href="login.html">Sign In</a>
            <a href="#">My Orders</a>
            <a href="#">Wishlist</a>
        `;
    }
}

// Logout function
function logout() {
    console.log('Logging out...');
    
    // Clear user data
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('rememberMe');
    
    showNotification('Logged out successfully', 'success');
    
    // Update UI
    updateUIForLoggedOutUser();
    
    // Redirect to home page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Setup password toggle
function setupPasswordToggle() {
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('ion-icon');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.setAttribute('name', 'eye-off-outline');
            } else {
                input.type = 'password';
                icon.setAttribute('name', 'eye-outline');
            }
        });
    });
}

// Setup form validation
function setupFormValidation() {
    // Real-time validation for signup password
    const passwordInput = document.getElementById('signupPassword');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const strength = checkPasswordStrength(this.value);
            updatePasswordStrength(strength);
        });
    }
    
    // Real-time validation for confirm password
    const confirmInput = document.getElementById('confirmPassword');
    const passwordInputRef = document.getElementById('signupPassword');
    
    if (confirmInput && passwordInputRef) {
        confirmInput.addEventListener('input', function() {
            if (this.value !== passwordInputRef.value) {
                showFieldError('confirmPassword', 'Passwords do not match');
            } else {
                markFieldSuccess('confirmPassword');
            }
        });
    }
    
    // Real-time email validation
    const emailInput = document.getElementById('signupEmail');
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            if (this.value && !isValidEmail(this.value)) {
                showFieldError('email', 'Please enter a valid email address');
            } else if (this.value) {
                markFieldSuccess('email');
            }
        });
    }
}

// Show notification
function showNotification(message, type = 'success') {
    console.log(`${type.toUpperCase()}: ${message}`);
    
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <ion-icon name="${type === 'success' ? 'checkmark-circle' : 'alert-circle'}-outline"></ion-icon>
        <span>${message}</span>
        <button class="close-notification">
            <ion-icon name="close-outline"></ion-icon>
        </button>
    `;
    
    // Style notification
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
        gap: '0.75rem',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        zIndex: '1003',
        animation: 'slideInRight 0.3s ease',
        minWidth: '300px',
        maxWidth: '400px',
        fontFamily: "'Poppins', sans-serif"
    });
    
    // Close button
    const closeBtn = notification.querySelector('.close-notification');
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.color = 'white';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.fontSize = '1.25rem';
    closeBtn.style.display = 'flex';
    closeBtn.style.alignItems = 'center';
    closeBtn.style.justifyContent = 'center';
    
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
    
    document.body.appendChild(notification);
}

// Add animation styles if not present
if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .loading-dots::after {
            content: '';
            animation: dots 1.5s steps(4, end) infinite;
        }
        
        @keyframes dots {
            0%, 20% { content: ''; }
            40% { content: '.'; }
            60% { content: '..'; }
            80%, 100% { content: '...'; }
        }
        
        .form-group input.success {
            border-color: #10b981 !important;
            background-color: #f0fdf4 !important;
        }
        
        .form-group input.error {
            border-color: #ef4444 !important;
            background-color: #fef2f2 !important;
        }
        
        .logout-link {
            color: #ef4444 !important;
            border-top: 1px solid var(--border-color) !important;
            margin-top: 0.5rem !important;
            padding-top: 0.75rem !important;
        }
        
        .logout-link:hover {
            background-color: #fee2e2 !important;
        }
        
        .user-welcome {
            color: var(--primary-color) !important;
            font-weight: 600 !important;
            border-bottom: 1px solid var(--border-color) !important;
            padding-bottom: 0.75rem !important;
            margin-bottom: 0.5rem !important;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);
}

// Make functions globally available
window.logout = logout;
window.checkLoginStatus = checkLoginStatus;
window.showNotification = showNotification;