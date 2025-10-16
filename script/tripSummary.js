// trips-summary.js
document.addEventListener('DOMContentLoaded', function() {
    // Get the latest trip data from sessionStorage
    const latestTrip = JSON.parse(sessionStorage.getItem('latestTrip'));
    const allTripsData = JSON.parse(sessionStorage.getItem('allTripsData')) || [];
    
    // If we have trip data, display the summary
    if (latestTrip) {
        displayTripSummary(latestTrip);
    } else if (allTripsData.length > 0) {
        // If no latest trip but we have trips, show the most recent one
        displayTripSummary(allTripsData[allTripsData.length - 1]);
    } else {
        // No trip data available
        displayNoTripMessage();
    }

    // Setup event listeners for buttons
    setupEventListeners();
});

function displayTripSummary(trip) {
    // Update the main trip information
    document.querySelector('.destination').textContent = trip.destination || 'Unknown Destination';
    document.querySelector('.date').textContent = trip.duration || 'No dates specified';
    
    // Update button hrefs with trip data
    updateButtonLinks(trip);
}

function updateButtonLinks(trip) {
    // Update View Packing List button
    const viewPackingBtn = document.querySelector('.action-btn a[href=""]');
    if (viewPackingBtn) {
        viewPackingBtn.href = "#";
        viewPackingBtn.addEventListener('click', function(e) {
            e.preventDefault();
            viewPackingList(trip);
        });
    }

    // Update Save as Template button
    const saveTemplateBtn = document.querySelector('.save-template');
    if (saveTemplateBtn) {
        saveTemplateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            saveAsTemplate(trip);
        });
    }

    // Update Share List button
    const shareBtn = document.querySelector('.share');
    if (shareBtn) {
        shareBtn.addEventListener('click', function(e) {
            e.preventDefault();
            shareTrip(trip);
        });
    }

    // Update Delete button
    const deleteBtn = document.querySelector('.delete');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function(e) {
            e.preventDefault();
            deleteCurrentTrip(trip);
        });
    }
}




function saveAsTemplate(trip) {
    // Get existing templates or initialize empty array
    const templates = JSON.parse(sessionStorage.getItem('tripTemplates')) || [];
    
    // Create template object
    const template = {
        ...trip,
        templateName: `${trip.destination} Template`,
        createdAt: new Date().toISOString(),
        id: Date.now().toString() // Unique ID for each template
    };
    
    // Add current trip as template
    templates.push(template);
    
    // Save back to sessionStorage
    sessionStorage.setItem('tripTemplates', JSON.stringify(templates));
    
    // Set the latest template for the templates page
    sessionStorage.setItem('latestTemplate', JSON.stringify(template));
    console.log('Templates:', sessionStorage);
    
    
    // Redirect to templates page
    window.location.href = '/views/templates.html';
}

function shareTrip(trip) {
    // Create shareable text
    const shareText = `Check out my trip to ${trip.destination} from ${trip.duration}! 
Weather: ${trip.weather.join(', ')}
Purpose: ${trip.travelReason.join(', ')}`;
    
    // Use Web Share API if available
    if (navigator.share) {
        navigator.share({
            title: `My Trip to ${trip.destination}`,
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Trip details copied to clipboard!');
        });
    }
}

function deleteCurrentTrip(trip) {
    console.log('Deleting trip:', trip);
    
    // Show the delete backdrop
    const backdrop = document.querySelector('#deleteOverlay');
    if (!backdrop) {
        console.error('Delete overlay not found');
        return;
    }
    
    const deletionOverlay = backdrop.querySelector('.deletion-overlay');
    if (!deletionOverlay) {
        console.error('Deletion overlay content not found');
        return;
    }
    
    // Show the backdrop
    backdrop.classList.remove('inactive');
    backdrop.classList.add('active');
    
    // Remove any existing event listeners first by cloning elements
    const confirmBtn = deletionOverlay.querySelector('.confirm-btn');
    const cancelBtn = deletionOverlay.querySelector('.cancel-btn');
    
    // Clone and replace buttons to remove existing event listeners
    const newConfirmBtn = confirmBtn.cloneNode(true);
    const newCancelBtn = cancelBtn.cloneNode(true);
    
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
    
    // Add event listener for confirm button
    newConfirmBtn.addEventListener('click', function confirmDelete() {
        console.log('Confirming deletion of trip:', trip);
        
        try {
            // Get all trips data
            const allTripsData = JSON.parse(sessionStorage.getItem('allTripsData')) || [];
            console.log('All trips before deletion:', allTripsData);
            
            // Better trip identification - use multiple properties to find the exact trip
            const updatedTrips = allTripsData.filter(existingTrip => {
                // Check multiple properties to ensure we're deleting the correct trip
                const isSameTrip = 
                    existingTrip.destination === trip.destination &&
                    existingTrip.duration === trip.duration &&
                    JSON.stringify(existingTrip.weather) === JSON.stringify(trip.weather) &&
                    JSON.stringify(existingTrip.travelReason) === JSON.stringify(trip.travelReason);
                
                console.log('Comparing trips:', { existingTrip, trip, isSameTrip });
                return !isSameTrip;
            });
            
            console.log('Trips after deletion:', updatedTrips);
            
            // Save updated data
            sessionStorage.setItem('allTripsData', JSON.stringify(updatedTrips));
            
            // Also remove latestTrip if it's the one being deleted
            const latestTrip = JSON.parse(sessionStorage.getItem('latestTrip') || 'null');
            if (latestTrip && 
                latestTrip.destination === trip.destination && 
                latestTrip.duration === trip.duration) {
                sessionStorage.removeItem('latestTrip');
                console.log('Removed latestTrip from sessionStorage');
            }
            
            // Hide backdrop
            backdrop.classList.remove('active');
            backdrop.classList.add('inactive');
            
            
            // Redirect to dashboard
            window.location.href = '/views/dashboard.html';
            
        } catch (error) {
            console.error('Error deleting trip:', error);
            alert('Error deleting trip. Please try again.');
        }
    });
    
    // Add event listener for cancel button
    newCancelBtn.addEventListener('click', function cancelDelete() {
        console.log('Deletion cancelled');
        // Hide backdrop
        backdrop.classList.remove('active');
        backdrop.classList.add('inactive');
    });
    
    // Also close backdrop when clicking outside the content
    backdrop.addEventListener('click', function backdropClick(e) {
        if (e.target === backdrop) {
            backdrop.classList.remove('active');
            backdrop.classList.add('inactive');
            backdrop.removeEventListener('click', backdropClick);
        }
    });
}



// Function to show reminder overlay
function showReminderOverlay() {
    const reminderBackdrop = document.querySelector('#reminderOverlay');
    const reminderOverlay = reminderBackdrop.querySelector('.backdrop-content');
    
    // Show the backdrop
    reminderBackdrop.classList.remove('inactive');
    reminderBackdrop.classList.add('active');
    
    // Remove any existing event listeners first
    const submitBtn = reminderOverlay.querySelector('.submit');
    
    // Clone and replace button to remove existing event listeners
    const newSubmitBtn = submitBtn.cloneNode(true);
    submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);
    
    // Add event listener for submit button
    newSubmitBtn.addEventListener('click', function handleReminderSubmit() {
        const titleInput = reminderOverlay.querySelector('input[placeholder="Title"]');
        const timeInput = reminderOverlay.querySelector('input[placeholder="Time"]');
        
        const title = titleInput.value.trim();
        const time = timeInput.value.trim();
        
        if (title && time) {
            // Save reminder data
            const reminder = {
                id: Date.now().toString(), // Unique ID for each reminder
                title: title,
                time: time,
                createdAt: new Date().toISOString()
            };
            
            // Save to localStorage
            const existingReminders = JSON.parse(localStorage.getItem('tripReminders') || '[]');
            existingReminders.push(reminder);
            localStorage.setItem('tripReminders', JSON.stringify(existingReminders));
            
            console.log('Reminder saved:', reminder);
            
            // Hide backdrop
            reminderBackdrop.classList.remove('active');
            reminderBackdrop.classList.add('inactive');
            
            // Clear inputs
            titleInput.value = '';
            timeInput.value = '';
            
            // Display the new reminder
            displayReminders();
            
            // Remove event listener
            newSubmitBtn.removeEventListener('click', handleReminderSubmit);
        } else {
            alert('Please fill out both title and time fields.');
        }
    });
    
    // Also close backdrop when clicking outside the content
    reminderBackdrop.addEventListener('click', function reminderBackdropClick(e) {
        if (e.target === reminderBackdrop) {
            reminderBackdrop.classList.remove('active');
            reminderBackdrop.classList.add('inactive');
            
            // Clear inputs
            const titleInput = reminderOverlay.querySelector('input[placeholder="Title"]');
            const timeInput = reminderOverlay.querySelector('input[placeholder="Time"]');
            titleInput.value = '';
            timeInput.value = '';
            
            // Remove event listeners
            newSubmitBtn.removeEventListener('click', handleReminderSubmit);
            reminderBackdrop.removeEventListener('click', reminderBackdropClick);
        }
    });
}

// Function to display all reminders
function displayReminders() {
    const reminderItems = document.querySelector('.reminder-items');
    const reminderContainer = document.querySelector('.trip-reminders');
    
    // Get reminders from localStorage
    const reminders = JSON.parse(localStorage.getItem('tripReminders') || '[]');
    
    // Clear existing reminder items (except the first one if it's a template)
    reminderItems.innerHTML = '';
    
    if (reminders.length === 0) {
        // Show empty state
        reminderItems.innerHTML = `
            <div class="reminder-empty">
                <p>No reminders set</p>
            </div>
        `;
        return;
    }
    
    // Display each reminder
    reminders.forEach(reminder => {
        const reminderElement = createReminderElement(reminder);
        reminderItems.appendChild(reminderElement);
    });
}

// Function to create reminder HTML element
function createReminderElement(reminder) {
    const reminderDiv = document.createElement('div');
    reminderDiv.className = 'reminder-item';
    reminderDiv.setAttribute('data-reminder-id', reminder.id);
    
    reminderDiv.innerHTML = `
        <div class="reminder-left">
            <img src="/images/SVGs/ReminderIcon.svg" alt="Reminder">
            <p class="reminder-title">${reminder.title}</p>
        </div>
        <div class="reminder-right">
            <img src="/images/SVGs/ReminderTimeIcon.svg" alt="Time">
            <p class="reminder-time">${reminder.time}</p>
            <li class="delete-reminder" data-reminder-id="${reminder.id}">
                <i class="fas fa-trash"></i>
            </li>
        </div>
    `;
    
    return reminderDiv;
}

// Function to delete a reminder
function deleteReminder(reminderId) {
    const reminders = JSON.parse(localStorage.getItem('tripReminders') || '[]');
    const updatedReminders = reminders.filter(reminder => reminder.id !== reminderId);
    localStorage.setItem('tripReminders', JSON.stringify(updatedReminders));
    displayReminders(); // Refresh the display
}

// Initialize reminders when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Set up click event for the add reminder button
    const addReminderBtn = document.querySelector('.add-reminder');
    if (addReminderBtn) {
        addReminderBtn.addEventListener('click', showReminderOverlay);
    }
    
    // Set up event delegation for delete buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.delete-reminder')) {
            const deleteBtn = e.target.closest('.delete-reminder');
            const reminderId = deleteBtn.getAttribute('data-reminder-id');
            deleteReminder(reminderId);
        }
    });
    
    // Display existing reminders
    displayReminders();
});

function displayNoTripMessage() {
    const summaryContainer = document.querySelector('.trip-summary-con');
    summaryContainer.innerHTML = `
        <div class="trip-con">
            <h1 class="destination">No Trip Found</h1>
            <span class="divider"></span>
            <div class="date">Create a new trip to see it here</div>
            <div class="action-btn">
                <a href="index.html">Create New Trip</a>
            </div>
        </div>
    `;
}

function setupEventListeners() {
    // Additional event listeners can be added here
}