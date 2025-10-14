// profile.js

document.addEventListener('DOMContentLoaded', function() {
    // Debug: Check if userManager is available
    console.log('userManager available:', typeof window.userManager !== 'undefined');
    console.log('Current userManager:', window.userManager);
    
    displayCurrentUser();
    setupProfileEventListeners();
    setupBackdrop();
});

function displayCurrentUser() {
    // Get current user from global userManager
    const currentUser = window.userManager.getCurrentUser();
    
    // Get DOM elements
    const userNameElement = document.querySelector('.user-name');
    const userEmailElement = document.querySelector('.user-email');
    const mainElement = document.querySelector('.main');
    
    console.log('Current user from userManager:', currentUser); // Debug log
    
    if (currentUser && userNameElement && userEmailElement) {
        // Remove inactive class to show the profile content
        if (mainElement) {
            mainElement.classList.remove('inactive');
        }
        
        // Display user name and email
        userNameElement.textContent = currentUser.name || 'Anonymous';
        userEmailElement.textContent = currentUser.email || 'No email provided';
        
        console.log('User displayed successfully:', currentUser.name, currentUser.email);
    } else {
        console.log('No user logged in or elements not found');
        console.log('Current user:', currentUser);
        console.log('User name element found:', !!userNameElement);
        console.log('User email element found:', !!userEmailElement);
        
        // Show default message if no user
        if (userNameElement && userEmailElement) {
            userNameElement.textContent = 'Not Logged In';
            userEmailElement.textContent = 'Please login to view your profile';
            
            // Still show the content even if not logged in
            if (mainElement) {
                mainElement.classList.remove('inactive');
            }
        }
    }
}

function setupBackdrop() {
    const backdrop = document.querySelector('.backdrop');
    const backdropText = document.querySelector('.backdrop-text');
    const confirmBtn = document.querySelector('.confirm-btn');
    const cancelBtn = document.querySelector('.cancel-btn');

    // Hide backdrop initially
    if (backdrop) {
        backdrop.classList.add('inactive');
    }

    // Confirm button handler
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            if (this.actionCallback) {
                this.actionCallback();
            }
            hideBackdrop();
        });
    }

    // Cancel button handler
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            hideBackdrop();
        });
    }

    // Close backdrop when clicking outside
    if (backdrop) {
        backdrop.addEventListener('click', function(e) {
            if (e.target === this) {
                hideBackdrop();
            }
        });
    }

    // Close backdrop with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && backdrop && !backdrop.classList.contains('inactive')) {
            hideBackdrop();
        }
    });
}

function showBackdrop(message, confirmCallback) {
    const backdrop = document.querySelector('.backdrop');
    const backdropText = document.querySelector('.backdrop-text');
    const confirmBtn = document.querySelector('.confirm-btn');

    if (backdrop && backdropText && confirmBtn) {
        backdropText.textContent = message;
        confirmBtn.actionCallback = confirmCallback; // Store the callback
        backdrop.classList.remove('inactive');
        backdrop.classList.add('active');
    } else {
        // Fallback to alert if backdrop elements not found
        if (confirm(message)) {
            confirmCallback();
        }
    }
}

function hideBackdrop() {
    const backdrop = document.querySelector('.backdrop');
    const confirmBtn = document.querySelector('.confirm-btn');
    
    if (backdrop) {
        backdrop.classList.remove('active');
        backdrop.classList.add('inactive');
    }
    
    if (confirmBtn) {
        confirmBtn.actionCallback = null; // Clear the callback
    }
}

function setupProfileEventListeners() {
    // Logout functionality
    const logoutButton = document.querySelector('.item-menu p:nth-child(2)'); // Second p in first item-menu (Logout)
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            const currentUser = window.userManager.getCurrentUser();
            const userName = currentUser ? currentUser.name : 'User';
            
            showBackdrop(
                `Are you sure you want to logout?`,
                function() {
                    window.userManager.logout();
                    window.location.href = '/index.html';
                }
            );
        });
    }
    
    // Delete Account functionality
    const deleteAccountButton = document.querySelector('.item-menu p:nth-child(3)'); // Third p in first item-menu (Delete Account)
    if (deleteAccountButton) {
        deleteAccountButton.addEventListener('click', function(e) {
            e.preventDefault();
            const currentUser = window.userManager.getCurrentUser();
            
            if (currentUser) {
                showBackdrop(
                    `Are you sure you want to delete your account`,
                    function() {
                        try {
                            window.userManager.deleteUser(currentUser.email);
                            showBackdrop(
                                'Account deleted successfully!',
                                function() {
                                    window.location.href = '/index.html';
                                }
                            );
                        } catch (error) {
                            showBackdrop(
                                'Error deleting account: ' + error.message,
                                function() {
                                    // Just close the backdrop
                                }
                            );
                        }
                    }
                );
            } else {
                showBackdrop(
                    'No user logged in',
                    function() {
                        // Just close the backdrop
                    }
                );
            }
        });
    }
    
    // Settings menu items (placeholder functionality)
    const settingsItems = document.querySelectorAll('.item-menu:nth-child(2) p');
    settingsItems.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const settings = ['Theme', 'Language', 'Weather Unit'];
            showBackdrop(
                `${settings[index]} settings would be implemented here`,
                function() {
                    // Just close the backdrop
                }
            );
        });
    });
    
    // Support menu items (placeholder functionality)
    const supportItems = document.querySelectorAll('.item-menu:nth-child(3) p');
    supportItems.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const supportOptions = ['Contact Us', 'Report Bug'];
            showBackdrop(
                `${supportOptions[index]} functionality would be implemented here`,
                function() {
                    // Just close the backdrop
                }
            );
        });
    });
    
}

// Add this function to update user profile if needed
function updateUserProfile(updates) {
    const currentUser = window.userManager.getCurrentUser();
    if (currentUser) {
        try {
            const updatedUser = window.userManager.updateUser(currentUser.email, updates);
            console.log('Profile updated:', updatedUser);
            displayCurrentUser(); // Refresh the display
            return updatedUser;
        } catch (error) {
            console.error('Error updating profile:', error);
            return null;
        }
    }
    return null;
}