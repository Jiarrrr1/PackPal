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
    // previousBtn.disabled = currentStep === 1;
    if (currentStep === 1) {
        previousBtn.addEventListener('click', function(){
                window.location.href = "/views/dashboard.html";

        })
    }
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
        return getCheckedValues("travel-reason").length > 0;
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
      const checkboxes = document.querySelectorAll(`input[name="${name}"]`);
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
  function routeToTripsPage(tripData) {
    // Save data to sessionStorage to pass to the next page
    sessionStorage.setItem("allTripsData", JSON.stringify(tripData));
    sessionStorage.setItem("latestTrip", JSON.stringify(currentTrip));

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
    // if (!validateCurrentStep()) {
    //     alert('Please complete this step before continuing.');
    //     return;
    // }

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
