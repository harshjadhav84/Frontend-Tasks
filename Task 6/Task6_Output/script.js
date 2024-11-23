document.addEventListener("DOMContentLoaded", function () {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Initialize Date Range Picker with minDate set to today
  flatpickr("#date-range", {
    mode: "range",
    dateFormat: "Y-m-d",
    allowInput: true,
    minDate: today, // Disable past dates
  });

  // Destination Autocomplete
  const destinationInput = document.getElementById("destination");
  const autocompleteResults = document.getElementById("autocomplete-results");

  destinationInput.addEventListener("input", function () {
    const query = this.value;
    fetch("destination.json")
      .then((response) => response.json())
      .then((data) => {
        autocompleteResults.innerHTML = "";
        const filtered = data.filter((item) =>
          item.name.toLowerCase().includes(query.toLowerCase())
        );

        filtered.forEach((item) => {
          const li = document.createElement("li");
          li.className = "list-group-item list-group-item-action";
          li.textContent = item.name;
          li.onclick = () => {
            destinationInput.value = item.name;
            autocompleteResults.innerHTML = "";
          };
          autocompleteResults.appendChild(li);
        });
      });
  });

  // Update Guest and Room Counters
  window.updateCounter = function (type, change) {
    const countElement = document.getElementById(
      type === "guests" ? "guest-count" : "room-count"
    );
    let count = parseInt(countElement.textContent);
    count = Math.max(1, count + change); // Ensure count doesn't go below 1
    countElement.textContent = count;
  };

  // Search Button Click Event
  document
    .getElementById("search-button")
    .addEventListener("click", function () {
      const destination = destinationInput.value;
      const dateRange = document.getElementById("date-range").value;
      const guests = parseInt(
        document.getElementById("guest-count").textContent
      );
      const rooms = parseInt(document.getElementById("room-count").textContent);

      // Check if all required fields are filled
      if (!destination) {
        alert("Please enter a destination.");
        return; // Stop execution if the destination is missing
      }
      if (!dateRange) {
        alert("Please select a date range.");
        return; // Stop execution if the date range is missing
      }
      if (guests <= 0) {
        alert("Please select at least one guest.");
        return; // Stop execution if guests count is invalid
      }
      if (rooms <= 0) {
        alert("Please select at least one room.");
        return; // Stop execution if rooms count is invalid
      }

      // Proceed with fetching hotels if all fields are filled
      fetch("hotels.json")
        .then((response) => response.json())
        .then((data) => {
          const hotels = data[destination] || [];
          displayHotels(hotels);
          document
            .getElementById("hotel-cards-grid")
            .scrollIntoView({ behavior: "smooth" });
        });
    });

  // Display Hotels in Grid Layout
  function displayHotels(hotels) {
    const hotelCardsGrid = document.getElementById("hotel-cards-grid");
    hotelCardsGrid.innerHTML = "";

    hotels.forEach((hotel) => {
      const card = document.createElement("div");
      card.className = "col-12 col-md-4";
      card.innerHTML = `
        <div class="card hotel-card">
          <img src="${hotel.image}" class="card-img-top" alt="${hotel.name}" />
          <div class="card-body">
            <h5 class="card-title">${hotel.name} ${hotel.rating}</h5>
            <p class="card-text">${hotel.reviews}</p>
            <p class="card-text"><strong>Price: ${hotel.price}</strong></p>
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#hotelModal">Book Now</button>
            <div class="hover-info">${hotel.specialOffer}</div>
          </div>
        </div>
      `;
      hotelCardsGrid.appendChild(card);
    });

    hotelCardsGrid.style.display = hotels.length ? "flex" : "none";
  }

  // Modal Setup for Booking
  document
    .getElementById("hotelModal")
    .addEventListener("show.bs.modal", function (event) {
      const button = event.relatedTarget;
      const hotelName = button
        .closest(".hotel-card")
        .querySelector(".card-title").textContent;
      document.getElementById(
        "hotelModalLabel"
      ).textContent = `Booking for ${hotelName}`;
    });

  // Booking Form Submission
  document
    .getElementById("booking-form")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent form submission

      // Validate Form Inputs
      const checkIn = document
        .getElementById("date-range")
        .value.split(" to ")[0];
      const checkOut = document
        .getElementById("date-range")
        .value.split(" to ")[1];
      const guests = parseInt(
        document.getElementById("guest-count").textContent
      );
      const rooms = parseInt(document.getElementById("room-count").textContent);

      if (validateForm(checkIn, checkOut, guests, rooms)) {
        alert("Booking confirmed!");
        document.getElementById("hotelModal").modal("hide"); // Close modal after submission
      }
    });
});

// Price Range Slider Control
const priceMin = document.getElementById("priceMin");
const priceMax = document.getElementById("priceMax");
const minPriceLabel = document.getElementById("minPrice");
const maxPriceLabel = document.getElementById("maxPrice");

priceMin.addEventListener("input", function () {
  if (parseInt(priceMin.value) > parseInt(priceMax.value)) {
    priceMin.value = priceMax.value;
  }
  minPriceLabel.textContent = priceMin.value;
});

priceMax.addEventListener("input", function () {
  if (parseInt(priceMax.value) < parseInt(priceMin.value)) {
    priceMax.value = priceMin.value;
  }
  maxPriceLabel.textContent = priceMax.value;
});

// Distance Range Slider Display Update
const distanceLandmarkInput = document.getElementById("distance-landmark");
const distanceLandmarkDisplay = document.getElementById(
  "distance-landmark-display"
);

distanceLandmarkInput.addEventListener("input", function () {
  distanceLandmarkDisplay.textContent = this.value;
});

// Validate Booking Form Dates and Counts
function validateForm(checkIn, checkOut, guests, rooms) {
  const today = new Date().toISOString().split("T")[0];

  // Validate check-in and check-out dates
  if (checkIn < today) {
    alert("Check-in date cannot be in the past.");
    return false;
  }
  if (checkOut <= checkIn) {
    alert("Check-out date must be after the check-in date.");
    return false;
  }

  // Validate number of guests and rooms
  if (guests <= 0 || rooms <= 0) {
    alert("Number of guests and rooms must be greater than 0.");
    return false;
  }

  return true; // All validations passed
}
