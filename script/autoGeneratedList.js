// packingListDisplay.js

// autoPackingList.js
class AutoPackingList {
    constructor() {
        this.itemTemplates = {
            personalItems: {
                // Basic hygiene
                basicHygiene: ["Toothbrush", "Toothpaste", "Mouthwash", "Floss"],
                // Bath & body
                bathBody: ["Shampoo", "Conditioner", "Body Wash", "Soap", "Loofah"],
                // Hair care
                hairCare: ["Hairbrush", "Comb", "Hair Ties", "Hair Gel", "Hair Spray"],
                // Skincare
                skincare: ["Moisturizer", "Sunscreen", "Lip Balm", "Face Wash"],
                // Shaving
                shaving: ["Razor", "Shaving Cream", "Aftershave"],
                // Personal care
                personalCare: ["Deodorant", "Perfume/Cologne", "Nail Clipper", "Tweezers"],
                // First aid
                firstAid: ["Band-Aids", "Pain Relievers", "Antiseptic", "Prescription Medications"],
                // Weather specific
                hotWeather: ["Sunscreen SPF 50+", "Aloe Vera", "Sun Hat", "Sunglasses"],
                coldWeather: ["Lip Balm", "Hand Cream", "Body Lotion", "Chapstick"],
                rainyWeather: ["Umbrella", "Waterproof Jacket", "Quick-dry Towel"],
                // Activity specific
                swimming: ["Swimsuit", "Beach Towel", "Flip Flops", "Goggles"],
                sports: ["Sports Towel", "Athletic Wear", "Sports Shoes", "Water Bottle"],
                business: ["Business Cards", "Notebook", "Pens", "Portfolio"],
                wedding: ["Formal Wear", "Jewelry", "Dress Shoes", "Accessories"],
                festival: ["Ear Protection", "Small Backpack", "Comfortable Shoes", "Portable Charger"]
            },
            electronics: {
                // Essential electronics
                essential: ["Phone", "Phone Charger", "Headphones", "Earphones"],
                // Power & charging
                power: ["Power Bank", "Portable Charger", "Car Charger"],
                // Computer & work
                computer: ["Laptop", "Laptop Charger", "Mouse", "Laptop Stand"],
                tablet: ["Tablet", "Tablet Charger", "Tablet Case", "Stylus"],
                // Photography
                photography: ["Camera", "Camera Charger", "Memory Cards", "Tripod"],
                // Entertainment
                entertainment: ["E-reader", "Portable Speaker", "Gaming Device"],
                // Travel accessories
                travel: ["Travel Adapter", "Power Strip", "Cable Organizer"],
                // Smart devices
                smart: ["Smartwatch", "Smartwatch Charger", "Fitness Tracker"]
            }
        };
    }

    generatePackingList(tripData) {
        const packingList = {
            personalItems: [],
            electronics: []
        };

        // Generate personal items
        packingList.personalItems = this.generatePersonalItems(tripData);
        
        // Generate electronics
        packingList.electronics = this.generateElectronics(tripData);

        console.log('Packing List:', packingList );
        
        
        return packingList;
    }

    generatePersonalItems(tripData) {
        let items = new Set();

        // Add basic hygiene (always included)
        this.addItemsFromTemplate(items, this.itemTemplates.personalItems.basicHygiene);
        
        // Add bath & body based on trip duration
        const duration = this.getTripDuration(tripData.duration);
        if (duration >= 3) {
            this.addItemsFromTemplate(items, this.itemTemplates.personalItems.bathBody);
            this.addItemsFromTemplate(items, this.itemTemplates.personalItems.hairCare);
        }
        
        // Add skincare based on duration and weather
        if (duration >= 2) {
            this.addItemsFromTemplate(items, this.itemTemplates.personalItems.skincare);
        }

        // Add weather-specific items
        if (tripData.weather && tripData.weather.length > 0) {
            tripData.weather.forEach(weather => {
                if (weather.includes("Hot") || weather.includes("Warm")) {
                    this.addItemsFromTemplate(items, this.itemTemplates.personalItems.hotWeather);
                }
                if (weather.includes("Cold") || weather.includes("Freezing")) {
                    this.addItemsFromTemplate(items, this.itemTemplates.personalItems.coldWeather);
                }
                if (weather.includes("Rainy")) {
                    this.addItemsFromTemplate(items, this.itemTemplates.personalItems.rainyWeather);
                }
            });
        }

        // Add activity-specific items
        if (tripData.swimming === "Yes") {
            this.addItemsFromTemplate(items, this.itemTemplates.personalItems.swimming);
        }
        
        if (tripData.sports === "Yes") {
            this.addItemsFromTemplate(items, this.itemTemplates.personalItems.sports);
        }

        // Add travel reason specific items
        if (tripData.travelReason && tripData.travelReason.length > 0) {
            tripData.travelReason.forEach(reason => {
                if (reason.includes("Business") || reason.includes("Study")) {
                    this.addItemsFromTemplate(items, this.itemTemplates.personalItems.business);
                }
                if (reason.includes("Wedding")) {
                    this.addItemsFromTemplate(items, this.itemTemplates.personalItems.wedding);
                }
                if (reason.includes("Concert") || reason.includes("Festival")) {
                    this.addItemsFromTemplate(items, this.itemTemplates.personalItems.festival);
                }
            });
        }

        // Add vision items
        if (tripData.vision && tripData.vision.length > 0) {
            if (tripData.vision.includes("Glasses")) {
                items.add("Glasses");
                items.add("Glasses Case");
                items.add("Lens Cleaner");
            }
            if (tripData.vision.includes("Contact Lenses")) {
                items.add("Contact Lenses");
                items.add("Contact Solution");
                items.add("Lens Case");
            }
        }

        // Add packing for specific items
        if (tripData.packingFor && tripData.packingFor.length > 0) {
            if (tripData.packingFor.includes("Baby")) {
                items.add("Diapers");
                items.add("Baby Wipes");
                items.add("Baby Powder");
                items.add("Baby Clothes");
            }
        }

        return Array.from(items);
    }

    generateElectronics(tripData) {
        let items = new Set();

        // Always include essential electronics
        this.addItemsFromTemplate(items, this.itemTemplates.electronics.essential);
        this.addItemsFromTemplate(items, this.itemTemplates.electronics.power);

        // Add electronics based on user selection
        if (tripData.electronics && tripData.electronics.length > 0) {
            tripData.electronics.forEach(electronics => {
                if (electronics.includes("Laptop")) {
                    this.addItemsFromTemplate(items, this.itemTemplates.electronics.computer);
                }
                if (electronics.includes("Tablet")) {
                    this.addItemsFromTemplate(items, this.itemTemplates.electronics.tablet);
                }
                if (electronics.includes("Camera")) {
                    this.addItemsFromTemplate(items, this.itemTemplates.electronics.photography);
                }
                if (electronics.includes("E-reader")) {
                    this.addItemsFromTemplate(items, this.itemTemplates.electronics.entertainment);
                }
                if (electronics.includes("Smart watch")) {
                    this.addItemsFromTemplate(items, this.itemTemplates.electronics.smart);
                }
            });
        }

        // Add travel-specific electronics for longer trips
        const duration = this.getTripDuration(tripData.duration);
        if (duration >= 5) {
            this.addItemsFromTemplate(items, this.itemTemplates.electronics.travel);
        }

        // Add additional electronics based on travel reason
        if (tripData.travelReason && tripData.travelReason.length > 0) {
            tripData.travelReason.forEach(reason => {
                if (reason.includes("Business") || reason.includes("Study")) {
                    items.add("Laptop");
                    items.add("Laptop Charger");
                    items.add("Notebook");
                }
                if (reason.includes("Concert") || reason.includes("Festival")) {
                    items.add("Portable Charger");
                    items.add("Power Bank");
                }
            });
        }

        return Array.from(items);
    }

    addItemsFromTemplate(itemSet, templateItems) {
        templateItems.forEach(item => itemSet.add(item));
    }

    getTripDuration(durationString) {
        if (!durationString) return 3;
        
        try {
            // Try to parse date format like "Jan 1 - Jan 7"
            const parts = durationString.split('-');
            if (parts.length === 2) {
                // Simple calculation - count the number of days mentioned
                return Math.max(3, parts.length * 3); // Estimate 3 days per part
            }
            
            // Try to parse numeric duration
            const numericMatch = durationString.match(/\d+/);
            if (numericMatch) {
                return Math.max(1, parseInt(numericMatch[0]));
            }
        } catch (error) {
            console.error('Error parsing duration:', error);
        }
        
        return 3; // Default fallback
    }

    // Method to get suggested items for a specific category
    getSuggestedItems(category, tripData) {
        switch(category) {
            case 'Personal Items':
                return this.generatePersonalItems(tripData);
            case 'Electronics':
                return this.generateElectronics(tripData);
            default:
                return [];
        }
    }
}

// Initialize and make globally available
window.AutoPackingList = AutoPackingList;
window.autoPackingList = new AutoPackingList();

// packingListDisplay.js
document.addEventListener('DOMContentLoaded', function() {
    displayAutoGeneratedPackingList();
    setupPackingListInteractions();
});

function displayAutoGeneratedPackingList() {
    const latestTrip = JSON.parse(sessionStorage.getItem('latestTrip'));
    
    if (latestTrip && latestTrip.packingList) {
        const packingList = latestTrip.packingList;
        
        // Display personal items
        const personalContainer = document.querySelector('.category:first-child .item-list');
        if (personalContainer && packingList.personalItems) {
            personalContainer.innerHTML = '';
            packingList.personalItems.forEach(item => {
                const itemElement = createPackingItemElement(item, 'personal');
                personalContainer.appendChild(itemElement);
            });
        }
        
        // Display electronics
        const electronicsContainer = document.querySelector('.category:nth-child(2) .item-list');
        if (electronicsContainer && packingList.electronics) {
            electronicsContainer.innerHTML = '';
            packingList.electronics.forEach(item => {
                const itemElement = createPackingItemElement(item, 'electronics');
                electronicsContainer.appendChild(itemElement);
            });
        }
        
        console.log('Auto-generated packing list displayed');
    } else {
        console.log('No auto-generated packing list found');
    }
}

function createPackingItemElement(itemName, category) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'packing-items';
    itemDiv.setAttribute('data-item-name', itemName);
    itemDiv.setAttribute('data-category', category);
    itemDiv.innerHTML = `
        <div class="item">
            <input type="checkbox" name="${itemName}" id="${category}-${itemName.replace(/\s+/g, '-')}" checked>
            <label for="${category}-${itemName.replace(/\s+/g, '-')}">${itemName}</label>
        </div>
        <div class="item-btn">
            <a href="">Edit</a>
            <span></span>
            <a href="">Delete</a>
        </div>
    `;
    return itemDiv;
}

function setupPackingListInteractions() {
    // Add new item functionality
    document.querySelectorAll('.add-item-con').forEach(button => {
        button.addEventListener('click', function() {
            const category = this.closest('.category').querySelector('h3').textContent;
            const newItem = prompt(`Add new ${category} item:`);
            if (newItem && newItem.trim()) {
                const container = this.previousElementSibling;
                const categoryType = category === 'Personal Items' ? 'personal' : 'electronics';
                const itemElement = createPackingItemElement(newItem.trim(), categoryType);
                container.appendChild(itemElement);
                
                // Add to session storage
                addItemToSessionStorage(newItem.trim(), categoryType);
            }
        });
    });

    // Edit item functionality
    document.addEventListener('click', function(e) {
        if (e.target.textContent === 'Edit') {
            e.preventDefault();
            const itemElement = e.target.closest('.packing-items');
            const oldName = itemElement.getAttribute('data-item-name');
            const category = itemElement.getAttribute('data-category');
            const label = itemElement.querySelector('label');
            const newName = prompt('Edit item name:', label.textContent);
            if (newName && newName.trim()) {
                // Update in session storage
                updateItemInSessionStorage(oldName, newName.trim(), category);
                
                // Update DOM
                label.textContent = newName.trim();
                const input = itemElement.querySelector('input');
                input.name = newName.trim();
                input.id = input.id.split('-')[0] + '-' + newName.trim().replace(/\s+/g, '-');
                label.setAttribute('for', input.id);
                itemElement.setAttribute('data-item-name', newName.trim());
            }
        }
    });

    // Delete item functionality
    document.addEventListener('click', function(e) {
        if (e.target.textContent === 'Delete') {
            e.preventDefault();
            const itemElement = e.target.closest('.packing-items');
            const itemName = itemElement.getAttribute('data-item-name');
            const category = itemElement.getAttribute('data-category');
                // Remove from session storage
                removeItemFromSessionStorage(itemName, category);
                itemElement.remove();

                // Add fade out animation
                itemElement.style.opacity = '0.5';
                itemElement.style.textDecoration = 'line-through';
                
                // Optional: Remove after delay
                setTimeout(() => {
                    itemElement.remove();
                }, 500);

        }
    });

    // Checkbox change handler - remove item when unchecked
    document.addEventListener('change', function(e) {
        if (e.target.type === 'checkbox') {
            const checkbox = e.target;
            const itemElement = checkbox.closest('.packing-items');
            const itemName = itemElement.getAttribute('data-item-name');
            const category = itemElement.getAttribute('data-category');
            
            if (!checkbox.checked) {
                // Remove from session storage and fade out
                removeItemFromSessionStorage(itemName, category);
                
                // Add fade out animation
                itemElement.style.opacity = '0.5';
                itemElement.style.textDecoration = 'line-through';
                
                // Optional: Remove after delay
                setTimeout(() => {
                    itemElement.remove();
                }, 500);
            } else {
                // Add back to session storage if rechecked
                addItemToSessionStorage(itemName, category);
                itemElement.style.opacity = '1';
                itemElement.style.textDecoration = 'none';
            }
            
            // Save checkbox state
            saveCheckboxState();
        }
    });

    // Load saved checkbox states
    loadCheckboxStates();
}

// Session Storage Management
function addItemToSessionStorage(itemName, category) {
    const latestTrip = JSON.parse(sessionStorage.getItem('latestTrip'));
    if (latestTrip && latestTrip.packingList) {
        const categoryKey = category === 'personal' ? 'personalItems' : 'electronics';
        if (!latestTrip.packingList[categoryKey].includes(itemName)) {
            latestTrip.packingList[categoryKey].push(itemName);
            sessionStorage.setItem('latestTrip', JSON.stringify(latestTrip));
        }
    }
}

function removeItemFromSessionStorage(itemName, category) {
    const latestTrip = JSON.parse(sessionStorage.getItem('latestTrip'));
    if (latestTrip && latestTrip.packingList) {
        const categoryKey = category === 'personal' ? 'personalItems' : 'electronics';
        latestTrip.packingList[categoryKey] = latestTrip.packingList[categoryKey].filter(item => item !== itemName);
        sessionStorage.setItem('latestTrip', JSON.stringify(latestTrip));
    }
}

function updateItemInSessionStorage(oldName, newName, category) {
    const latestTrip = JSON.parse(sessionStorage.getItem('latestTrip'));
    if (latestTrip && latestTrip.packingList) {
        const categoryKey = category === 'personal' ? 'personalItems' : 'electronics';
        const index = latestTrip.packingList[categoryKey].indexOf(oldName);
        if (index !== -1) {
            latestTrip.packingList[categoryKey][index] = newName;
            sessionStorage.setItem('latestTrip', JSON.stringify(latestTrip));
        }
    }
}

function saveCheckboxState() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const checkboxStates = {};
    
    checkboxes.forEach(checkbox => {
        checkboxStates[checkbox.name] = checkbox.checked;
    });
    
    localStorage.setItem('packingListCheckboxStates', JSON.stringify(checkboxStates));
}

function loadCheckboxStates() {
    const savedStates = localStorage.getItem('packingListCheckboxStates');
    if (savedStates) {
        const checkboxStates = JSON.parse(savedStates);
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        
        checkboxes.forEach(checkbox => {
            if (checkboxStates.hasOwnProperty(checkbox.name)) {
                checkbox.checked = checkboxStates[checkbox.name];
            }
        });
    }
}