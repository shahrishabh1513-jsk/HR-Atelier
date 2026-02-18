// ===== USER AUTHENTICATION =====
class AuthSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.init();
    }
    
    init() {
        // Check current page and initialize appropriate handlers
        if (document.getElementById('signup-form')) {
            this.initSignup();
        } else if (document.getElementById('login-form')) {
            this.initLogin();
        }
        
        this.initPasswordToggle();
        this.initPasswordStrength();
        
        // Check if user is already logged in
        if (this.currentUser && window.location.pathname.includes('login.html')) {
            window.location.href = 'index.html';
        }
    }
    
    initSignup() {
        const form = document.getElementById('signup-form');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateSignup()) {
                this.registerUser();
            }
        });
        
        // Real-time validation
        this.initSignupValidation();
    }
    
    initLogin() {
        const form = document.getElementById('login-form');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateLogin()) {
                this.loginUser();
            }
        });
        
        // Auto-login demo button (for testing)
        const demoBtn = document.getElementById('demo-login');
        if (demoBtn) {
            demoBtn.addEventListener('click', () => {
                this.demoLogin();
            });
        }
    }
    
    initSignupValidation() {
        const inputs = {
            firstName: document.getElementById('firstName'),
            lastName: document.getElementById('lastName'),
            email: document.getElementById('signupEmail'),
            password: document.getElementById('signupPassword'),
            confirmPassword: document.getElementById('confirmPassword')
        };
        
        // Real-time email validation
        if (inputs.email) {
            inputs.email.addEventListener('input', () => {
                this.validateEmail(inputs.email.value, 'emailError');
            });
        }
        
        // Real-time password strength
        if (inputs.password) {
            inputs.password.addEventListener('input', () => {
                this.updatePasswordStrength(inputs.password.value);
                this.validatePassword(inputs.password.value, 'passwordError');
                
                // Check password match in real-time
                if (inputs.confirmPassword && inputs.confirmPassword.value) {
                    this.validatePasswordMatch(inputs.password.value, inputs.confirmPassword.value, 'confirmPasswordError');
                }
            });
        }
        
        // Real-time confirm password validation
        if (inputs.confirmPassword && inputs.password) {
            inputs.confirmPassword.addEventListener('input', () => {
                this.validatePasswordMatch(inputs.password.value, inputs.confirmPassword.value, 'confirmPasswordError');
            });
        }
    }
    
    validateSignup() {
        let isValid = true;
        
        // Get form values
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;
        
        // Validate first name
        if (!firstName) {
            this.showError('firstNameError', 'First name is required');
            isValid = false;
        } else {
            this.hideError('firstNameError');
        }
        
        // Validate last name
        if (!lastName) {
            this.showError('lastNameError', 'Last name is required');
            isValid = false;
        } else {
            this.hideError('lastNameError');
        }
        
        // Validate email
        if (!this.validateEmail(email, 'emailError')) {
            isValid = false;
        }
        
        // Check if email already exists
        if (this.emailExists(email)) {
            this.showError('emailError', 'Email already registered');
            isValid = false;
        }
        
        // Validate password
        if (!this.validatePassword(password, 'passwordError')) {
            isValid = false;
        }
        
        // Validate password match
        if (!this.validatePasswordMatch(password, confirmPassword, 'confirmPasswordError')) {
            isValid = false;
        }
        
        // Validate terms
        if (!terms) {
            this.showError('termsError', 'You must agree to the terms');
            isValid = false;
        } else {
            this.hideError('termsError');
        }
        
        return isValid;
    }
    
    validateLogin() {
        let isValid = true;
        
        const email = document.getElementById('email')?.value.trim() || 
                     document.getElementById('loginEmail')?.value.trim();
        const password = document.getElementById('password')?.value || 
                        document.getElementById('loginPassword')?.value;
        
        // Validate email
        if (!email) {
            this.showError('loginEmailError', 'Email is required');
            isValid = false;
        } else if (!this.validateEmail(email, 'loginEmailError')) {
            isValid = false;
        } else {
            this.hideError('loginEmailError');
        }
        
        // Validate password
        if (!password) {
            this.showError('loginPasswordError', 'Password is required');
            isValid = false;
        } else {
            this.hideError('loginPasswordError');
        }
        
        return isValid;
    }
    
    validateEmail(email, errorId) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            this.showError(errorId, 'Email is required');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            this.showError(errorId, 'Please enter a valid email address');
            return false;
        }
        
        this.hideError(errorId);
        return true;
    }
    
    validatePassword(password, errorId) {
        if (!password) {
            this.showError(errorId, 'Password is required');
            return false;
        }
        
        if (password.length < 8) {
            this.showError(errorId, 'Password must be at least 8 characters');
            return false;
        }
        
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            this.showError(errorId, 'Password must contain uppercase, lowercase, and numbers');
            return false;
        }
        
        this.hideError(errorId);
        return true;
    }
    
    validatePasswordMatch(password, confirmPassword, errorId) {
        if (!confirmPassword) {
            this.showError(errorId, 'Please confirm your password');
            return false;
        }
        
        if (password !== confirmPassword) {
            this.showError(errorId, 'Passwords do not match');
            return false;
        }
        
        this.hideError(errorId);
        return true;
    }
    
    emailExists(email) {
        return this.users.some(user => user.email === email);
    }
    
    registerUser() {
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        const newsletter = document.getElementById('newsletter').checked;
        
        const user = {
            id: Date.now().toString(),
            firstName,
            lastName,
            email,
            password: this.hashPassword(password),
            newsletter,
            createdAt: new Date().toISOString(),
            orders: [],
            wishlist: [],
            address: null,
            phone: null
        };
        
        // Add user to users array
        this.users.push(user);
        localStorage.setItem('users', JSON.stringify(this.users));
        
        // Set as current user
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Show success message
        this.showSuccess('Account created successfully! Redirecting...');
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
    
    loginUser() {
        const email = document.getElementById('email')?.value.trim() || 
                     document.getElementById('loginEmail')?.value.trim();
        const password = document.getElementById('password')?.value || 
                        document.getElementById('loginPassword')?.value;
        
        // Find user
        const user = this.users.find(u => u.email === email);
        
        if (!user) {
            this.showError('loginEmailError', 'No account found with this email');
            return;
        }
        
        // Verify password (in real app, this would be hashed comparison)
        if (user.password !== this.hashPassword(password)) {
            this.showError('loginPasswordError', 'Incorrect password');
            return;
        }
        
        // Set as current user
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Show success message
        this.showSuccess('Login successful! Redirecting...');
        
        // Redirect to home page
        setTimeout(() => {
            // Check if there's a redirect URL in query params
            const urlParams = new URLSearchParams(window.location.search);
            const redirect = urlParams.get('redirect');
            window.location.href = redirect || 'index.html';
        }, 1500);
    }
    
    demoLogin() {
        // Create demo user if not exists
        const demoUser = {
            id: 'demo123',
            firstName: 'Demo',
            lastName: 'User',
            email: 'demo@example.com',
            password: this.hashPassword('Demo@123'),
            newsletter: true,
            createdAt: new Date().toISOString(),
            orders: [
                {
                    id: 'ORD-001',
                    date: '2024-01-15',
                    items: [
                        { id: '1', name: 'Elegant Blue Evening Dress', price: 129.99, quantity: 1 }
                    ],
                    total: 129.99,
                    status: 'delivered',
                    tracking: 'TRK-789456123'
                },
                {
                    id: 'ORD-002',
                    date: '2024-02-01',
                    items: [
                        { id: '3', name: 'Luxury Designer Handbag', price: 249.99, quantity: 1 },
                        { id: '5', name: 'Minimalist Gold Jewelry Set', price: 54.99, quantity: 1 }
                    ],
                    total: 304.98,
                    status: 'processing',
                    tracking: 'TRK-123456789'
                }
            ],
            wishlist: ['2', '4', '7'],
            address: {
                street: '123 Fashion Street',
                city: 'New York',
                state: 'NY',
                zip: '10001',
                country: 'USA'
            },
            phone: '+1 (555) 123-4567'
        };
        
        // Add demo user if not exists
        if (!this.users.some(u => u.email === demoUser.email)) {
            this.users.push(demoUser);
            localStorage.setItem('users', JSON.stringify(this.users));
        }
        
        // Auto-fill form
        const emailInput = document.getElementById('email') || document.getElementById('loginEmail');
        const passwordInput = document.getElementById('password') || document.getElementById('loginPassword');
        
        if (emailInput) emailInput.value = demoUser.email;
        if (passwordInput) passwordInput.value = 'Demo@123';
        
        // Show hint
        this.showHint('Demo credentials filled. Click Login to continue.');
    }
    
    hashPassword(password) {
        // In a real app, use proper hashing like bcrypt
        // This is just for demo purposes
        return btoa(password);
    }
    
    initPasswordToggle() {
        document.querySelectorAll('.toggle-password').forEach(button => {
            button.addEventListener('click', (e) => {
                const button = e.currentTarget;
                const input = button.previousElementSibling;
                const icon = button.querySelector('ion-icon');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.name = 'eye-off-outline';
                } else {
                    input.type = 'password';
                    icon.name = 'eye-outline';
                }
            });
        });
    }
    
    initPasswordStrength() {
        const passwordInput = document.getElementById('signupPassword');
        if (!passwordInput) return;
        
        passwordInput.addEventListener('input', () => {
            this.updatePasswordStrength(passwordInput.value);
        });
    }
    
    updatePasswordStrength(password) {
        const segments = document.querySelectorAll('.strength-segment');
        const strengthText = document.querySelector('.strength-text');
        
        if (!segments.length || !strengthText) return;
        
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength++;
        
        // Lowercase check
        if (/[a-z]/.test(password)) strength++;
        
        // Uppercase check
        if (/[A-Z]/.test(password)) strength++;
        
        // Number/special char check
        if (/[0-9]/.test(password)) strength++;
        
        // Update visual indicators
        segments.forEach((segment, index) => {
            segment.classList.toggle('active', index < strength);
        });
        
        // Update text
        const texts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
        strengthText.textContent = texts[strength] || 'Password strength';
    }
    
    showError(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
            
            // Add error class to input
            const input = element.previousElementSibling || 
                         document.getElementById(elementId.replace('Error', ''));
            if (input && input.tagName === 'INPUT') {
                input.classList.add('error');
            }
        }
    }
    
    hideError(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = '';
            element.style.display = 'none';
            
            // Remove error class from input
            const input = element.previousElementSibling || 
                         document.getElementById(elementId.replace('Error', ''));
            if (input && input.tagName === 'INPUT') {
                input.classList.remove('error');
            }
        }
    }
    
    showSuccess(message) {
        // Create success message element
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <ion-icon name="checkmark-circle-outline" class="success-icon"></ion-icon>
            <h3>Success!</h3>
            <p>${message}</p>
        `;
        
        // Replace form with success message
        const form = document.querySelector('.auth-form-container') || 
                    document.querySelector('.auth-form');
        if (form) {
            form.innerHTML = '';
            form.appendChild(successDiv);
        }
    }
    
    showHint(message) {
        // Create hint element
        const hintDiv = document.createElement('div');
        hintDiv.className = 'hint-message';
        hintDiv.style.cssText = `
            background-color: var(--primary-light);
            color: var(--primary-dark);
            padding: 1rem;
            border-radius: var(--radius-md);
            margin-bottom: 1rem;
            text-align: center;
            font-size: 0.875rem;
        `;
        hintDiv.textContent = message;
        
        // Insert before form
        const form = document.querySelector('form');
        if (form) {
            form.parentNode.insertBefore(hintDiv, form);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                hintDiv.remove();
            }, 5000);
        }
    }
}

// Initialize auth system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const authSystem = new AuthSystem();
    
    // Initialize animations from main.js if available
    if (typeof initAnimations === 'function') {
        initAnimations();
    }
    
    // Initialize loading screen
    if (typeof initLoadingScreen === 'function') {
        initLoadingScreen();
    }
    
    // Initialize back to top
    if (typeof initBackToTop === 'function') {
        initBackToTop();
    }
    
    // Initialize cart
    if (typeof initCart === 'function') {
        initCart();
    }
    
    // Check if user is already logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && window.location.pathname.includes('login.html')) {
        window.location.href = 'index.html';
    }
});