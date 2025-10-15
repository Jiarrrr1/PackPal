// navigation.js - Handle trip navigation across all pages
document.addEventListener('DOMContentLoaded', function() {
    const latestTrip = JSON.parse(sessionStorage.getItem("latestTrip"));
    const tripNavBtn = document.getElementById('tripsBtn');
    console.log('latest:', latestTrip);
    
    function setupTripNavigation() {
        if (tripNavBtn) {
            tripNavBtn.addEventListener('click', function(e) {
                e.preventDefault(); // Prevent default behavior
                
                // Check if latestTrip exists and has data
                if (latestTrip && Object.keys(latestTrip).length > 0) {
                    window.location.href = '/views/trips.html';
                    console.log('Current trip found, navigating to trips page');
                } else {
                    window.location.href = '/views/dashboard.html';
                    console.log('No current trip found, navigating to dashboard');
                }
            });
        } else {
            console.log('Trips navigation button not found on this page');
        }
    }

    setupTripNavigation();
}); 