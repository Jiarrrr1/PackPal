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
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');

        [emailInput, passwordInput, confirmPasswordInput].forEach(input => {
            if (input) {
                input.addEventListener('input', () => this.clearErrorStyles());
            }
        });
    }

    setupEnterKeySupport() {
        const inputs = [
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

    async handleSignup(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        console.log('Attempting to create user:', { email, password });

        try {
            const result = userManager.createUser(email, password, confirmPassword);
            this.showSuccess(result);
        } catch (error) {
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
            'Email, password, and confirm password are required': 'All inputs are required',
            'User already exists': 'User already exists',
            'Invalid email format': 'Invalid email format',
            'Password and confirm password do not match': 'Passwords do not match',
            'Password must be at least 6 characters long': 'Password must be at least 6 characters'
        };

        overlayText.textContent = errorMessages[errorMessage] || `Error: ${errorMessage}`;
    }

    highlightErrorFields(errorMessage) {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');

        if (errorMessage.includes('Email') && emailInput) {
            emailInput.classList.add('error');
        }
        if (errorMessage.includes('password')) {
            if (passwordInput) passwordInput.classList.add('error');
            if (confirmPasswordInput) confirmPasswordInput.classList.add('error');
        }
    }

    clearErrorStyles() {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');

        [emailInput, passwordInput, confirmPasswordInput].forEach(input => {
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