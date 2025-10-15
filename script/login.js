// login.js - Login functionality
document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('userEmail');
    const passwordInput = document.getElementById('userPassword');
    const loginBtn = document.querySelector('.login-btn');
    const passwordIcons = document.querySelectorAll('.password i'); // Fixed selector
    const rememberCheckbox = document.getElementById('save');
    const forgotPassword = document.querySelector('.forgot p');
    const feedback = document.querySelector('.feedback'); // Fixed selector - single element

    // Only run if we're on the login page
    if (!emailInput || !passwordInput || !loginBtn) {
        console.log('Not on login page, skipping login.js');
        return;
    }

    // Toggle password visibility - with null check
    if (passwordIcons && passwordIcons.length > 0) {
        passwordIcons.forEach(icon => {
            icon.addEventListener('click', function() {
                const passwordField = this.parentElement.querySelector('input');
                if (passwordField) {
                    const isPassword = passwordField.type === 'password';
                    passwordField.type = isPassword ? 'text' : 'password';
                    this.classList.toggle('fa-eye-slash');
                    this.classList.toggle('fa-eye');
                }
            });
        });
    } else {
        console.log('No password icons found');
    }

    // Login button click handler
    loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const rememberMe = rememberCheckbox ? rememberCheckbox.checked : false;

        const latestTrip = JSON.parse(sessionStorage.getItem("latestTrip"));
        console.log(latestTrip);
        

        console.log('All Users:', userManager.getAllUsers());
        console.log('Attempting to login:', { email, password, rememberMe });

        try {
            // Authenticate user
            const result = userManager.authenticateUser(email, password);
            console.log('Login successful:', result);
            
            // If remember me is checked, store flag
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            }
            
            // Check if latestTrip exists and has data
                if (latestTrip && Object.keys(latestTrip).length > 0) {
                    window.location.href = '/views/trips.html';
                    console.log('Current trip found, navigating to trips page');
                } else {
                    window.location.href = '/views/dashboard.html';
                    console.log('No current trip found, navigating to dashboard');
                }
            
            
        } catch (error) {
            console.error('Login error:', error.message);
            
            // Show error message in feedback element
            if (feedback) {
                feedback.textContent = "Login Failed: " + error.message;
                feedback.style.display = 'flex';
            }
            
            // Highlight problematic fields
            if (error.message.includes('User not found') || error.message.includes('email')) {
                emailInput.classList.add('error');
            }
            if (error.message.includes('Invalid password') || error.message.includes('password')) {
                passwordInput.classList.add('error');
            }
        }
    });

    // Forgot password functionality
    if (forgotPassword) {
        forgotPassword.addEventListener('click', function() {
            const overlay = document.querySelector('.overlay-con');
            if (overlay) {
                overlay.classList.remove('overlay-default');
                overlay.classList.add('overlay-active');
            }
        });
    }

    // Back button in forgot password overlay
    const backButton = document.querySelector('.navigation button');
    if (backButton) {
        backButton.addEventListener('click', function() {
            const overlay = document.querySelector('.overlay-con');
            if (overlay) {
                overlay.classList.remove('overlay-active');
                overlay.classList.add('overlay-default');
            }
        });
    }

    // Recover password functionality
    const recoverButton = document.querySelector('.form-con button');

    // Clear error styles when user starts typing
    emailInput.addEventListener('input', function() {
        this.classList.remove('error');
        if (feedback) feedback.style.display = 'none';
    });

    passwordInput.addEventListener('input', function() {
        this.classList.remove('error');
        if (feedback) feedback.style.display = 'none';
    });

    // Enter key support for form submission
    const inputs = [emailInput, passwordInput];
    inputs.forEach(input => {
        if (input) {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    loginBtn.click();
                }
            });
        }
    });

    // Auto-fill if remember me was previously set
    if (rememberCheckbox && localStorage.getItem('rememberMe') === 'true') {
        rememberCheckbox.checked = true;
    }
});