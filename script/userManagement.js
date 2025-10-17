class UserManagement {
    constructor() {
        this.initializeUserData();
        window.userManager = this;
    }

    initializeUserData() {
        // Load users from localStorage or initialize empty array
        const storedUsers = localStorage.getItem('USER_DB');
        try {
            this.USER_DB = storedUsers ? JSON.parse(storedUsers) : [];
            if (!Array.isArray(this.USER_DB)) {
                this.USER_DB = [];
            }
        } catch (error) {
            console.error('Error parsing USER_DB from localStorage:', error);
            this.USER_DB = [];
        } 

        // Load current user
        const storedCurrentUser = localStorage.getItem('currentUser');
        try {
            this.currentUser = storedCurrentUser ? JSON.parse(storedCurrentUser) : null;
        } catch (error) {
            console.error('Error parsing currentUser from localStorage:', error);
            this.currentUser = null;
        }
    }

    // User Validation Methods
    validateUserInput( username,email, password, confirmPassword) {
          // Check each condition separately
    if (!username) {
        console.error('Validation failed: username is empty');
        throw new Error('Username, Email, password, and confirm password are required');
    }
    if (!email) {
        console.error('Validation failed: email is empty');
        throw new Error('Username, Email, password, and confirm password are required');
    }
    if (!password) {
        console.error('Validation failed: password is empty');
        throw new Error('Username, Email, password, and confirm password are required');
    }
    if (!confirmPassword) {
        console.error('Validation failed: confirmPassword is empty');
        throw new Error('Username, Email, password, and confirm password are required');
    }

        const existingUser = this.USER_DB.find(user => user.email === email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Invalid email format');
        }

        if (password !== confirmPassword) {
            throw new Error('Password and confirm password do not match');
        }

        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }
    }

    validateAuthentication(email, password) {
        if (!Array.isArray(this.USER_DB)) {
            this.USER_DB = [];
            this.saveToLocalStorage();
            throw new Error('User database corrupted. Please try again.');
        }

        const user = this.USER_DB.find(user => user.email === email);
        if (!user) {
            throw new Error('User not found');
        }

        if (user.password !== password) {
            throw new Error('Invalid password');
        }

        return user;
    }

    // Core User Operations
    createUser(userName, email, password, confirmPassword) {
        this.validateUserInput(userName, email, password, confirmPassword);

        const user = {
            name: userName,
            email: email,
            password: password,
            trips: [],
            savedTemplates: [],
            createdAt: new Date().toISOString(),
            id: this.generateUserId(),
            isActive: true
        };

        this.USER_DB.push(user);
        this.currentUser = user;
        this.saveToLocalStorage();
        
        return {
            success: true,
            message: 'User created successfully',
            user: this.getSafeUserData(user)
        };
    }

    authenticateUser(email, password) {
        const user = this.validateAuthentication(email, password);
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        return {
            success: true,
            message: 'Authentication successful',
            user: this.getSafeUserData(user)
        };
    }

    // User Data Management
    getSafeUserData(user) {
        return {
            name: user.name,
            email: user.email,
            id: user.id,
            createdAt: user.createdAt,
            isActive: user.isActive,
            trips: user.trips,
            savedTemplates: user.savedTemplates
        };
    }

    updateUser(email, updates) {
        if (!Array.isArray(this.USER_DB)) {
            throw new Error('User database corrupted');
        }

        const userIndex = this.USER_DB.findIndex(user => user.email === email);
        if (userIndex === -1) {
            throw new Error('User not found');
        }

        Object.keys(updates).forEach(key => {
            if (key !== 'email' && key !== 'id' && key !== 'createdAt') {
                this.USER_DB[userIndex][key] = updates[key];
            }
        });

        this.saveToLocalStorage();
        
        if (this.currentUser && this.currentUser.email === email) {
            this.currentUser = this.USER_DB[userIndex];
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }

        return this.USER_DB[userIndex];
    }

    deleteUser(email) {
        if (!Array.isArray(this.USER_DB)) {
            throw new Error('User database corrupted');
        }

        const userIndex = this.USER_DB.findIndex(user => user.email === email);
        if (userIndex === -1) {
            throw new Error('User not found');
        }

        const deletedUser = this.USER_DB.splice(userIndex, 1)[0];
        this.saveToLocalStorage();
        
        if (this.currentUser && this.currentUser.email === email) {
            this.logout();
        }

        return deletedUser;
    }

    // Getters
    getCurrentUser() {
        return this.currentUser;
    }

    getAllUsers() {
        return this.USER_DB;
    }

    getUserByEmail(email) {
        if (!Array.isArray(this.USER_DB)) return null;
        return this.USER_DB.find(user => user.email === email);
    }

    getUserById(id) {
        if (!Array.isArray(this.USER_DB)) return null;
        return this.USER_DB.find(user => user.id === id);
    }

    // Utility Methods
    generateUserId() {
        return 'user_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    saveToLocalStorage() {
        localStorage.setItem('USER_DB', JSON.stringify(this.USER_DB));
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        window.location.href='/index.html'
    }

    resetDatabase() {
        // Reset in-memory data
        this.USER_DB = [];
        this.currentUser = null;

         // Get the latest trip data from sessionStorage
        const latestTrip = JSON.parse(sessionStorage.getItem('latestTrip'));
        const allTripsData = JSON.parse(sessionStorage.getItem('allTripsData')) || [];
    
        
        // Clear localStorage
        localStorage.removeItem('USER_DB');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userPackingList');
        localStorage.removeItem('tripReminders');
        localStorage.removeItem('tripTemplates');
        localStorage.removeItem('userPackingListSelections');
        
        // Clear sessionStorage
        sessionStorage.removeItem('latestTrip');
        sessionStorage.removeItem('allTripsData');
        sessionStorage.removeItem('latestTemplate');
        
        // Clear any other potential storage items
        const storageKeys = Object.keys(localStorage);
        storageKeys.forEach(key => {
            if (key.startsWith('trip') || key.startsWith('user') || key.startsWith('packing')) {
                localStorage.removeItem(key);
            }
        });
        
        console.log('Database reset successfully');

        window.location.href = '/index.html';

    }
}

// Initialize and expose globally
const userManager = new UserManagement();
window.UserManagement = UserManagement;