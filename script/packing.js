// packing.js - Packing list generation logic
class AutoPackingList {
    constructor() {
        this.itemTemplates = {
            utilities: {
                // Travel utilities
                travelEssentials: ["Travel Adapter", "Power Bank", "Portable Charger", "Flashlight", "Multi-tool"],
                // Organization
                organization: ["Packing Cubes", "Travel Wallet", "Document Holder", "Luggage Tags", "Ziploc Bags"],
                // Comfort items
                comfort: ["Travel Pillow", "Eye Mask", "Ear Plugs", "Neck Support", "Blanket"],
                // Safety & security
                safety: ["Money Belt", "Luggage Locks", "RFID Blocker", "Whistle", "Personal Alarm"],
                // Miscellaneous
                miscellaneous: ["Umbrella", "Reusable Water Bottle", "Snacks", "Notebook", "Pen"]
            },
            health: {
                // Basic first aid
                firstAid: ["Band-Aids", "Antiseptic Wipes", "Gauze", "Medical Tape", "Scissors"],
                // Medications
                medications: ["Pain Relievers", "Antihistamines", "Motion Sickness Pills", "Prescription Meds", "Vitamins"],
                // Personal care
                personalCare: ["Hand Sanitizer", "Wet Wipes", "Tissues", "Lip Balm", "Sunscreen"],
                // Wellness
                wellness: ["Insect Repellent", "After Bite", "Aloe Vera", "Hydrocortisone Cream", "Cold Medicine"],
                // Emergency
                emergency: ["Emergency Contacts List", "Insurance Card", "Allergy Medication", "Pepto-Bismol", "Imodium"]
            },
            clothes: {
                // Tops
                tops: ["T-shirts", "Long-sleeve Shirts", "Button-down Shirts", "Sweaters", "Jackets"],
                // Bottoms
                bottoms: ["Jeans", "Shorts", "Dress Pants", "Skirts", "Leggings"],
                // Underwear
                underwear: ["Underwear", "Socks", "Bras", "Undershirts", "Pajamas"],
                // Formal wear
                formal: ["Dress Shirt", "Dress Pants", "Blazer", "Dress", "Tie"],
                // Seasonal
                seasonal: ["Rain Jacket", "Winter Coat", "Thermal Underwear", "Swimwear", "Beach Cover-up"]
            },
            accessories: {
                // Jewelry
                jewelry: ["Watch", "Necklace", "Earrings", "Bracelet", "Rings"],
                // Bags
                bags: ["Backpack", "Purse", "Beach Bag", "Evening Bag", "Tote Bag"],
                // Headwear
                headwear: ["Sun Hat", "Beanie", "Baseball Cap", "Visor", "Headband"],
                // Miscellaneous
                miscAccessories: ["Belt", "Scarf", "Gloves", "Sunglasses", "Hair Accessories"],
                // Tech accessories
                techAccessories: ["Phone Case", "Laptop Sleeve", "Tablet Cover", "Cable Organizer", "Headphone Case"]
            },
            footwear: {
                // Casual shoes
                casual: ["Sneakers", "Sandals", "Slip-ons", "Loafers", "Boat Shoes"],
                // Formal shoes
                formal: ["Dress Shoes", "Heels", "Flats", "Oxfords", "Wedges"],
                // Outdoor
                outdoor: ["Hiking Boots", "Water Shoes", "Snow Boots", "Trail Runners", "Waterproof Boots"],
                // Comfort
                comfort: ["Walking Shoes", "Sliders", "Comfortable Sandals", "Athletic Shoes", "Arch Support"],
                // Specialized
                specialized: ["Dance Shoes", "Golf Shoes", "Cycling Shoes", "Climbing Shoes", "Workout Shoes"]
            },
            personalItems: {
                // Basic hygiene
                basicHygiene: ["Toothbrush", "Toothpaste", "Mouthwash", "Floss", "Tongue Cleaner"],
                // Bath & body
                bathBody: ["Shampoo", "Conditioner", "Body Wash", "Soap", "Loofah"],
                // Hair care
                hairCare: ["Hairbrush", "Comb", "Hair Ties", "Hair Gel", "Hair Spray"],
                // Skincare
                skincare: ["Moisturizer", "Sunscreen", "Lip Balm", "Face Wash", "Toner"],
                // Shaving
                shaving: ["Razor", "Shaving Cream", "Aftershave", "Electric Shaver", "Shaving Brush"]
            },
            electronics: {
                // Essential electronics
                essential: ["Phone", "Phone Charger", "Headphones", "Earphones", "Power Bank"],
                // Computer & work
                computer: ["Laptop", "Laptop Charger", "Mouse", "Laptop Stand", "External Hard Drive"],
                // Photography
                photography: ["Camera", "Camera Charger", "Memory Cards", "Tripod", "Lens Cleaner"],
                // Entertainment
                entertainment: ["E-reader", "Portable Speaker", "Gaming Device", "Tablet", "Charging Cables"],
                // Travel accessories
                travel: ["Travel Adapter", "Power Strip", "Cable Organizer", "Portable WiFi", "Bluetooth Tracker"]
            }
        };
    }

    generatePackingList(tripData) {
        const packingList = {
            utilities: [],
            health: [],
            clothes: [],
            accessories: [],
            footwear: [],
            personalItems: [],
            electronics: []
        };

        // Generate all categories
        packingList.utilities = this.generateUtilities(tripData);
        packingList.health = this.generateHealth(tripData);
        packingList.clothes = this.generateClothes(tripData);
        packingList.accessories = this.generateAccessories(tripData);
        packingList.footwear = this.generateFootwear(tripData);
        packingList.personalItems = this.generatePersonalItems(tripData);
        packingList.electronics = this.generateElectronics(tripData);

        console.log('Complete Packing List Generated:', packingList);
        
        return packingList;
    }

    generateUtilities(tripData) {
        let items = new Set();

        // Always include basic utilities
        this.addItemsFromTemplate(items, this.itemTemplates.utilities.travelEssentials);
        
        // Add organization items for longer trips
        const duration = this.getTripDuration(tripData.duration);
        if (duration >= 5) {
            this.addItemsFromTemplate(items, this.itemTemplates.utilities.organization);
        }

        // Add comfort items for flights or long journeys
        if (duration >= 3) {
            this.addItemsFromTemplate(items, this.itemTemplates.utilities.comfort);
        }

        // Add safety items for international travel
        if (tripData.destination && tripData.destination.length > 0) {
            this.addItemsFromTemplate(items, this.itemTemplates.utilities.safety);
        }

        // Add weather-specific utilities
        if (tripData.weather && tripData.weather.length > 0) {
            tripData.weather.forEach(weather => {
                if (weather.includes("Rainy")) {
                    items.add("Umbrella");
                    items.add("Rain Cover");
                }
                if (weather.includes("Hot")) {
                    items.add("Portable Fan");
                }
                if (weather.includes("Cold")) {
                    items.add("Hand Warmers");
                }
            });
        }

        return Array.from(items);
    }

    generateHealth(tripData) {
        let items = new Set();

        // Always include basic first aid
        this.addItemsFromTemplate(items, this.itemTemplates.health.firstAid);
        
        // Add personal care essentials
        this.addItemsFromTemplate(items, this.itemTemplates.health.personalCare);

        // Add medications based on trip duration
        const duration = this.getTripDuration(tripData.duration);
        if (duration >= 3) {
            this.addItemsFromTemplate(items, this.itemTemplates.health.medications);
        }

        // Add wellness items based on activities
        if (tripData.swimming === "Yes") {
            items.add("Aloe Vera");
        }
        if (tripData.sports === "Yes") {
            items.add("Sports Cream");
            items.add("Bandages");
        }

        // Add destination-specific health items
        if (tripData.destination && this.isInternationalTravel(tripData.destination)) {
            this.addItemsFromTemplate(items, this.itemTemplates.health.wellness);
        }

        return Array.from(items);
    }

    generateClothes(tripData) {
        let items = new Set();

        // Add basic tops and bottoms
        this.addItemsFromTemplate(items, this.itemTemplates.clothes.tops);
        this.addItemsFromTemplate(items, this.itemTemplates.clothes.bottoms);
        
        // Always include underwear
        this.addItemsFromTemplate(items, this.itemTemplates.clothes.underwear);

        // Add clothes based on weather
        if (tripData.weather && tripData.weather.length > 0) {
            tripData.weather.forEach(weather => {
                if (weather.includes("Hot") || weather.includes("Warm")) {
                    items.add("Tank Tops");
                    items.add("Shorts");
                    items.add("Sun Dress");
                }
                if (weather.includes("Cold") || weather.includes("Freezing")) {
                    items.add("Thermal Underwear");
                    items.add("Winter Coat");
                    items.add("Warm Sweaters");
                }
                if (weather.includes("Rainy")) {
                    items.add("Rain Jacket");
                    items.add("Quick-dry Clothes");
                }
            });
        }

        // Add formal wear based on travel reason
        if (tripData.travelReason && tripData.travelReason.length > 0) {
            tripData.travelReason.forEach(reason => {
                if (reason.includes("Business") || reason.includes("Wedding")) {
                    this.addItemsFromTemplate(items, this.itemTemplates.clothes.formal);
                }
            });
        }

        return Array.from(items);
    }

    generateAccessories(tripData) {
        let items = new Set();

        // Add basic accessories
        this.addItemsFromTemplate(items, this.itemTemplates.accessories.jewelry);
        this.addItemsFromTemplate(items, this.itemTemplates.accessories.bags);

        // Add weather-specific accessories
        if (tripData.weather && tripData.weather.length > 0) {
            tripData.weather.forEach(weather => {
                if (weather.includes("Hot") || weather.includes("Warm")) {
                    this.addItemsFromTemplate(items, this.itemTemplates.accessories.headwear);
                    items.add("Sunglasses");
                }
                if (weather.includes("Cold") || weather.includes("Freezing")) {
                    items.add("Winter Gloves");
                    items.add("Warm Scarf");
                    items.add("Winter Hat");
                }
            });
        }

        // Add activity-specific accessories
        if (tripData.swimming === "Yes") {
            items.add("Beach Bag");
            items.add("Waterproof Phone Case");
        }

        if (tripData.sports === "Yes") {
            items.add("Sports Bag");
            items.add("Sweatband");
        }

        return Array.from(items);
    }

    generateFootwear(tripData) {
        let items = new Set();

        // Always include casual shoes
        this.addItemsFromTemplate(items, this.itemTemplates.footwear.casual);

        // Add footwear based on activities
        if (tripData.sports === "Yes") {
            this.addItemsFromTemplate(items, this.itemTemplates.footwear.comfort);
        }

        if (tripData.swimming === "Yes") {
            items.add("Water Shoes");
            items.add("Flip Flops");
        }

        // Add formal footwear based on travel reason
        if (tripData.travelReason && tripData.travelReason.length > 0) {
            tripData.travelReason.forEach(reason => {
                if (reason.includes("Business") || reason.includes("Wedding")) {
                    this.addItemsFromTemplate(items, this.itemTemplates.footwear.formal);
                }
            });
        }

        // Add weather-specific footwear
        if (tripData.weather && tripData.weather.length > 0) {
            tripData.weather.forEach(weather => {
                if (weather.includes("Rainy")) {
                    items.add("Waterproof Boots");
                }
                if (weather.includes("Snow") || weather.includes("Freezing")) {
                    items.add("Snow Boots");
                }
            });
        }

        return Array.from(items);
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

        // Add weather-specific personal items
        if (tripData.weather && tripData.weather.length > 0) {
            tripData.weather.forEach(weather => {
                if (weather.includes("Hot") || weather.includes("Warm")) {
                    items.add("Sunscreen SPF 50+");
                    items.add("Aloe Vera");
                    items.add("After-sun Lotion");
                }
                if (weather.includes("Cold") || weather.includes("Freezing")) {
                    items.add("Lip Balm with SPF");
                    items.add("Hand Cream");
                    items.add("Body Lotion");
                }
            });
        }

        // Add activity-specific personal items
        if (tripData.swimming === "Yes") {
            items.add("Swimsuit");
            items.add("Beach Towel");
            items.add("Goggles");
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

        return Array.from(items);
    }

    generateElectronics(tripData) {
        let items = new Set();

        // Always include essential electronics
        this.addItemsFromTemplate(items, this.itemTemplates.electronics.essential);

        // Add electronics based on user selection
        if (tripData.electronics && tripData.electronics.length > 0) {
            tripData.electronics.forEach(electronics => {
                if (electronics.includes("Laptop")) {
                    this.addItemsFromTemplate(items, this.itemTemplates.electronics.computer);
                }
                if (electronics.includes("Tablet")) {
                    items.add("Tablet");
                    items.add("Tablet Charger");
                }
                if (electronics.includes("Camera")) {
                    this.addItemsFromTemplate(items, this.itemTemplates.electronics.photography);
                }
            });
        }

        // Add travel-specific electronics for longer trips
        const duration = this.getTripDuration(tripData.duration);
        if (duration >= 5) {
            this.addItemsFromTemplate(items, this.itemTemplates.electronics.travel);
        }

        return Array.from(items);
    }

    addItemsFromTemplate(itemSet, templateItems) {
        // Take only first 5 items from each template to keep it manageable
        const limitedItems = templateItems.slice(0, 5);
        limitedItems.forEach(item => itemSet.add(item));
    }

    getTripDuration(durationString) {
        if (!durationString) return 3;
        
        try {
            // Try to parse date format like "Jan 1 - Jan 7"
            const parts = durationString.split('-');
            if (parts.length === 2) {
                return Math.max(3, parts.length * 3);
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

    isInternationalTravel(destination) {
        // Simple check for international travel (you can enhance this)
        const internationalKeywords = ['international', 'europe', 'asia', 'africa', 'australia', 'abroad'];
        return internationalKeywords.some(keyword => 
            destination.toLowerCase().includes(keyword)
        );
    }

    // Method to get suggested items for a specific category
    getSuggestedItems(category, tripData) {
        switch(category) {
            case 'Utilities':
                return this.generateUtilities(tripData);
            case 'Health':
                return this.generateHealth(tripData);
            case 'Clothes':
                return this.generateClothes(tripData);
            case 'Accessories':
                return this.generateAccessories(tripData);
            case 'Footwear':
                return this.generateFootwear(tripData);
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
console.log('Initializing AutoPackingList...');
window.AutoPackingList = AutoPackingList;
window.autoPackingList = new AutoPackingList();
console.log('AutoPackingList initialized with 7 categories:', Object.keys(window.autoPackingList.itemTemplates));

// app.js
document.addEventListener("DOMContentLoaded", function () {
  // Initialize data storage
  const tripData = JSON.parse(sessionStorage.getItem("allTripsData")) || [];
  let currentStep = 1;
  const totalSteps = 10;

  // DOM Elements
  const stepForms = document.querySelectorAll(".main");
  const previousBtn = document.querySelector(".previous");
  const nextBtn = document.querySelector(".next");
  const stepIndicators = document.querySelectorAll(".step");

  // Current trip object to collect all data
  let currentTrip = {
    destination: "",
    duration: "",
    weather: [],
    travelReason: [],
    packingFor: [],
    electronics: [],
    swimming: "",
    sports: "",
    vision: [],
  };

  // Initialize the form
  function initializeForm() {
    updateStepIndicator();
    updateButtons();
    showCurrentStep();
  }

  // Update step indicator
  function updateStepIndicator() {
    stepIndicators.forEach((step, index) => {
      if (index < currentStep) {
        step.classList.add("active");
      } else {
        step.classList.remove("active");
      }
    });
  }

  // Update button states
  function updateButtons() {
    previousBtn.disabled = currentStep === 1;
    // console.log(currentStep);
    
    // if (currentStep === 1) {
    //     previousBtn.addEventListener('click', function(){
    //             window.location.href = "/views/dashboard.html";

    //     })
    // }
    nextBtn.textContent = currentStep === totalSteps ? "Finish" : "Next";
  }

  // Show current step form
  function showCurrentStep() {
    stepForms.forEach((form, index) => {
      if (index === currentStep - 1) {
        form.classList.remove("inactive");
        form.classList.add("active");
      } else {
        form.classList.remove("active");
        form.classList.add("inactive");
      }
    });
  }

  // Save data from current step
  function saveCurrentStepData() {
    switch (currentStep) {
      case 1:
        currentTrip.destination = document
          .querySelector(".tripDestination")
          .value.trim();
        break;
      case 2:
        currentTrip.duration = document
          .querySelector(".tripDuration")
          .value.trim();
        // Update the weather forecast display
        document.querySelector(".tripLocation").textContent =
          currentTrip.destination || "Location";
        document.querySelector(".tripDate").textContent =
          currentTrip.duration || "Date";
        break;
      case 4:
        currentTrip.weather = getCheckedValues("weather");
        break;
      case 5:
        currentTrip.travelReason = getCheckedValues("travel-reason");
        break;
      case 6:
        currentTrip.packingFor = getCheckedValues("packing-for");
        break;
      case 7:
        currentTrip.electronics = getCheckedValues("electronics");
        break;
      case 8:
        currentTrip.swimming = getSingleCheckedValue("swimming");
        break;
      case 9:
        currentTrip.sports = getSingleCheckedValue("sports");
        break;
      case 10:
        currentTrip.vision = getCheckedValues("vision");
        break;
    }
  }

  // Get checked values for multiple checkbox groups
  function getCheckedValues(name) {
    const checkboxes = document.querySelectorAll(
      `input[name="${name}"]:checked`
    );
    return Array.from(checkboxes).map((cb) => cb.value);
  }

  // Get single checked value for radio-like behavior
  function getSingleCheckedValue(name) {
    const checked = document.querySelector(`input[name="${name}"]:checked`);
    return checked ? checked.value : "";
  }

  // Validate current step
  function validateCurrentStep() {
    switch (currentStep) {
      case 1:
        return document.querySelector(".tripDestination").value.trim() !== "";
      case 2:
        return document.querySelector(".tripDuration").value.trim() !== "";
      case 4:
        return getCheckedValues("weather").length > 0;
      case 5:
        return getCheckedValues("travel-reason") !=="";
      case 6:
        return getCheckedValues("packing-for").length > 0;
      case 7:
        return true; // Electronics are optional
      case 8:
        return getSingleCheckedValue("swimming") !== "";
      case 9:
        return getSingleCheckedValue("sports") !== "";
      case 10:
        return true; // Vision is optional
      default:
        return true;
    }
  }

// Setup checkbox behavior for single selection groups
function setupCheckboxGroups() {
  // Groups that should have single selection (radio-like behavior)
  const singleSelectGroups = ["swimming", "sports"];

  singleSelectGroups.forEach((groupName) => {
    const checkboxes = document.querySelectorAll(`input[name="${groupName}"]`);
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        if (this.checked) {
          // Uncheck all others in the same group
          checkboxes.forEach((otherCheckbox) => {
            if (otherCheckbox !== this) {
              otherCheckbox.checked = false;
            }
          });
        }
      });
    });
  });
}


  // Route to trips.html
  function routeToTripsPage(tripData, currentTrip) {
    // Save data to sessionStorage to pass to the next page
    sessionStorage.setItem("allTripsData", JSON.stringify(tripData));
    sessionStorage.setItem("latestTrip", JSON.stringify(currentTrip));
    console.log(currentTrip);
    

    // Redirect to trips.html
    window.location.href = "/views/trips.html";
  }

  // Reset all checkboxes
  function resetAllCheckboxes() {
    const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    allCheckboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
  }

  // Next button click handler
  nextBtn.addEventListener("click", function () {
    if (!validateCurrentStep()) {
      console.log("failed");
      
      
      const stepIndicator = document.querySelectorAll('#step-indicator')
      if (stepIndicator) {
      stepIndicator.classList.add('active')
      stepIndicator.classList.remove('inactive')
      }


    }


    saveCurrentStepData();

    // In your Next button click handler, when currentStep === totalSteps:
    if (currentStep === totalSteps) {   
      saveCurrentStepData();
        
      // Generate automatic packing list
      const packingList =
        window.autoPackingList.generatePackingList(currentTrip);
      currentTrip.packingList = packingList;

      // Save and redirect
      const updatedTripData = [...tripData, { ...currentTrip }];
      sessionStorage.setItem("allTripsData", JSON.stringify(updatedTripData));
      sessionStorage.setItem("latestTrip", JSON.stringify(currentTrip));

      console.log("Generated Packing List:", packingList);
    // routeToTripsPage(tripData, currentTrip)

      window.location.href = "/views/trips.html";
    } else {
      currentStep++;
      updateStepIndicator();
      updateButtons();
      showCurrentStep();
    }
  });

  // Previous button click handler
  previousBtn.addEventListener("click", function () {
    if (currentStep > 1) {
      currentStep--;
      updateStepIndicator();
      updateButtons();
      showCurrentStep();
    }
  });

  // Initialize the application
  setupCheckboxGroups();
  initializeForm();
});
