class SignupManager {
    constructor() {
        this.initializeSignupForm();
    }

    initializeSignupForm() {
        // Only run if we're on the signup page
        if (!this.isSignupPage()) {
            console.log('Not on signup page, skipping signup initialization');
            return;
        }

        this.setupEventListeners();
    }

    isSignupPage() {
        const emailInput = document.getElementById('email');
        const signupBtn = document.querySelector('.signup-btn');
        return !!(emailInput && signupBtn);
    }

    setupEventListeners() {
        this.setupPasswordToggle();
        this.setupOverlayHandler();
        this.setupSignupHandler();
        this.setupInputValidation();
        this.setupEnterKeySupport();
    }

    setupPasswordToggle() {
        const passwordIcons = document.querySelectorAll('.password i');
        passwordIcons.forEach(icon => {
            icon.addEventListener('click', () => this.togglePasswordVisibility(icon));
        });
    }

    togglePasswordVisibility(icon) {
        const passwordField = icon.parentElement.querySelector('input');
        if (!passwordField) return;

        const isPassword = passwordField.type === 'password';
        passwordField.type = isPassword ? 'text' : 'password';
        icon.classList.toggle('fa-eye-slash');
        icon.classList.toggle('fa-eye');
    }

    setupOverlayHandler() {
        const confirmBtn = document.querySelector('.confirm-btn');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => this.hideOverlay());
        }
    }

    setupSignupHandler() {
        const signupBtn = document.querySelector('.signup-btn');
        if (signupBtn) {
            signupBtn.addEventListener('click', (e) => this.handleSignup(e));
        }
    }

    setupInputValidation() {
        const userNameInput = document.getElementById('username')
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');

        [userNameInput, emailInput, passwordInput, confirmPasswordInput].forEach(input => {
            if (input) {
                input.addEventListener('input', () => this.clearErrorStyles());
            }
        });
    }

    setupEnterKeySupport() {
        const inputs = [
            document.getElementById('username'),
            document.getElementById('email'),
            document.getElementById('password'),
            document.getElementById('confirmPassword')
        ].filter(input => input !== null);

        const signupBtn = document.querySelector('.signup-btn');
        
        inputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && signupBtn) {
                    signupBtn.click();
                }
            });
        });
    }

    handleSignup(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Detailed debugging
    console.log('=== SIGNUP DEBUG INFO ===');
    console.log('Raw field values:', {
        username: `"${username}"`,
        email: `"${email}"`,
        password: `"${password}"`,
        confirmPassword: `"${confirmPassword}"`
    });
    
    console.log('Field lengths:', {
        username: username.length,
        email: email.length,
        password: password.length,
        confirmPassword: confirmPassword.length
    });
    
    console.log('Are fields empty?', {
        username: !username,
        email: !email,
        password: !password,
        confirmPassword: !confirmPassword
    });
    console.log('========================');

    try {
        // Check if userManager exists
        if (typeof userManager === 'undefined') {
            throw new Error('User management system is not available');
        }

        console.log('Calling userManager.createUser with:', {
            username: username,
            email: email,
            password: password ,
            confirmPassword: confirmPassword
        });

        const result = userManager.createUser(username, email, password, confirmPassword);
        this.showSuccess(result);
    } catch (error) {
        console.error('Signup error details:', {
            message: error.message,
            stack: error.stack
        });
        this.showError(error);
    }
}
    showSuccess(result) {
        console.log('User created successfully:', result);
        
        const overlay = document.querySelector('.backdrop');
        const overlayText = document.querySelector('.confirmation-text');
        const overlayIcon = document.querySelector('.deletion-overlay i');
        const confirmBtn = document.querySelector('.confirm-btn');

        if (overlay && overlayText && overlayIcon) {
            // Show success overlay
            overlay.classList.add('active');
            overlay.classList.remove('inactive');
            overlayText.textContent = 'Account created successfully!';
            overlayIcon.className = 'fas fa-check';
            overlayIcon.style.color = '#00C851';

            // Set up redirect on confirm
            if (confirmBtn) {
                confirmBtn.onclick = () => {
                    this.hideOverlay();
                    window.location.href = '/index.html';
                };
            }
        } else {
            // Fallback to alert
            alert('Account created successfully!');
            window.location.href = '/index.html';
        }
    }

    showError(error) {
        console.error('Error creating user:', error.message);
        // Temporary debug - add this at the top of handleSignup
console.log('All form elements:', {
    username: document.getElementById('username'),
    email: document.getElementById('email'), 
    password: document.getElementById('password'),
    confirmPassword: document.getElementById('confirmPassword')
});
        
        const overlay = document.querySelector('.backdrop');
        const overlayText = document.querySelector('.confirmation-text');
        const overlayIcon = document.querySelector('.deletion-overlay i');
        const confirmBtn = document.querySelector('.confirm-btn');

        if (overlay && overlayText && overlayIcon) {
            overlay.classList.add('active');
            overlay.classList.remove('inactive');
            overlayIcon.className = 'fas fa-times';
            overlayIcon.style.color = '#ff4444';

            this.setErrorMessage(overlayText, error.message);
            this.highlightErrorFields(error.message);

            if (confirmBtn) {
                confirmBtn.onclick = () => this.hideOverlay();
            }
        } else {
            alert('Error: ' + error.message);
            this.highlightErrorFields(error.message);
        }
    }

    setErrorMessage(overlayText, errorMessage) {
        const errorMessages = {
            'Username, Email, password, and confirm password are required': 'All inputs are required',
            'Username is required': 'Username is required',
            'Email is required': 'Email is required',
            'Password is required': 'Password is required',
            'Confirm password is required': 'Confirm password is required',
            'User already exists': 'User already exists',
            'Invalid email format': 'Invalid email format',
            'Password and confirm password do not match': 'Passwords do not match',
            'Password must be at least 6 characters long': 'Password must be at least 6 characters',
            'Username must be at least 3 characters long': 'Username must be at least 3 characters'
        };

        overlayText.textContent = errorMessages[errorMessage] || `Error: ${errorMessage}`;
    }

    highlightErrorFields(errorMessage) {
        const userNameInput = document.getElementById('username');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');

        if (errorMessage.includes('Username') && userNameInput) {
            userNameInput.classList.add('error');
        }
        if (errorMessage.includes('Email') && emailInput) {
            emailInput.classList.add('error');
        }
        if (errorMessage.includes('Password') || errorMessage.includes('password')) {
            if (passwordInput) passwordInput.classList.add('error');
            if (confirmPasswordInput) confirmPasswordInput.classList.add('error');
        }
    }

    clearErrorStyles() {
        const userNameInput = document.getElementById('username');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');

        [userNameInput, emailInput, passwordInput, confirmPasswordInput].forEach(input => {
            if (input) input.classList.remove('error');
        });
    }

    hideOverlay() {
        const overlay = document.querySelector('.backdrop');
        if (overlay) {
            overlay.classList.remove('active');
            overlay.classList.add('inactive');
        }
    }
}

// Initialize signup manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SignupManager();
});