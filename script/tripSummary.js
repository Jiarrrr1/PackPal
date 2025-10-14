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
    // Show the backdrop
    const backdrop = document.querySelector('.backdrop');
    const deletionOverlay = document.querySelector('.deletion-overlay');
    
  
    
    // Show the backdrop
    backdrop.classList.remove('inactive');
    backdrop.classList.add('active');
    
    // Remove any existing event listeners first
    const confirmBtn = deletionOverlay.querySelector('.confirm-btn');
    const cancelBtn = deletionOverlay.querySelector('.cancel-btn');
    
    // Clone and replace buttons to remove existing event listeners
    const newConfirmBtn = confirmBtn.cloneNode(true);
    const newCancelBtn = cancelBtn.cloneNode(true);
    
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
    
    // Add event listener for confirm button
    newConfirmBtn.addEventListener('click', function confirmDelete() {
        // Remove from all trips data
        const allTripsData = JSON.parse(sessionStorage.getItem('allTripsData')) || [];
        const updatedTrips = allTripsData.filter(t => 
            t.destination !== trip.destination || t.duration !== trip.duration
        );
        
        // Save updated data
        sessionStorage.setItem('allTripsData', JSON.stringify(updatedTrips));
        sessionStorage.removeItem('latestTrip');
        
        // Hide backdrop
        backdrop.classList.remove('active');
        backdrop.classList.add('inactive');
        
        // Remove event listeners
        newConfirmBtn.removeEventListener('click', confirmDelete);
        
        // Redirect to trips list
        window.location.href = '/views/dashboard.html';
    });
    
    // Add event listener for cancel button
    newCancelBtn.addEventListener('click', function cancelDelete() {
        // Hide backdrop
        backdrop.classList.remove('active');
        backdrop.classList.add('inactive');
        
        // Remove event listeners
        newConfirmBtn.removeEventListener('click', cancelDelete);
    });
    
    // Also close backdrop when clicking outside the content
    backdrop.addEventListener('click', function backdropClick(e) {
        if (e.target === backdrop) {
            backdrop.classList.remove('active');
            backdrop.classList.add('inactive');
            
            // Remove event listeners
            newConfirmBtn.removeEventListener('click', confirmDelete);
            newCancelBtn.removeEventListener('click', cancelDelete);
            backdrop.removeEventListener('click', backdropClick);
        }
    });
}

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