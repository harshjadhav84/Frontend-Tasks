const colorCircles = document.querySelectorAll('.color-circle');
const sizeSelect = document.getElementById('sizeSelect');
const customTextInput = document.getElementById('customTextInput');
const textColorInput = document.getElementById('textColorInput'); 
const tshirtImage = document.getElementById('tshirt-image');
const customText = document.getElementById('custom-text');
const totalPriceElement = document.getElementById('totalPrice');
const addToCartBtn = document.getElementById('addToCartBtn');
const notification = document.getElementById('notification'); 

const basePrice = 200; 
let totalPrice = basePrice;

const priceIncrements = {
    color: { white: 40, black: 60, blue: 70, red: 80 }, // Price increments
    size: { S: 0, M: 20, L: 40, XL: 60 } // Size increments
};

// Add click event listener to all color circles
colorCircles.forEach(circle => {
    circle.addEventListener('click', function() {
        colorCircles.forEach(c => c.classList.remove('selected'));
        
        this.classList.add('selected');

        const selectedColor = this.getAttribute('data-color');
        document.getElementById('selectedColor').textContent = selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1); // Update preview info

        tshirtImage.classList.remove('fade-in-active'); 
        tshirtImage.classList.add('fade-in');

        setTimeout(() => {
            tshirtImage.src = `images/shirt-${selectedColor}.png`;

            // Re-apply the fade-in-active class to trigger the fade-in effect
            tshirtImage.classList.remove('fade-in'); 
            void tshirtImage.offsetWidth; 
            tshirtImage.classList.add('fade-in-active');
        }, 10);
        
        updateTotalPrice();
        saveCustomization(); 
    });
});

// Update T-shirt size
sizeSelect.addEventListener('change', function() {
    const selectedSize = sizeSelect.value;
    document.getElementById('selectedSize').textContent = selectedSize;
    updateTotalPrice();
    saveCustomization(); 
});

customTextInput.addEventListener('input', function() {
    const enteredText = customTextInput.value;
    customText.textContent = enteredText;
    
    // Dynamically adjust font size based on the length of the entered text
    if (enteredText.length <= 10) {
        customText.style.fontSize = '24px'; // Default size for short text
    } else if (enteredText.length <= 20) {
        customText.style.fontSize = '20px'; // Smaller size for moderate text
    } else {
        customText.style.fontSize = '16px'; // Smallest size for long text
    }

    validateForm(); 
    saveCustomization(); 
});


// Update text color
textColorInput.addEventListener('input', function() {
    const selectedTextColor = textColorInput.value;  // Get the color value from the color picker
    customText.style.color = selectedTextColor;      // Apply the selected color to the custom text
    saveCustomization();                             // Save customization when color is changed
});

// Update the total price based on selections
function updateTotalPrice() {
    const selectedColor = document.querySelector('.color-circle.selected').getAttribute('data-color');
    const selectedSize = sizeSelect.value;

    totalPrice = basePrice + priceIncrements.color[selectedColor] + priceIncrements.size[selectedSize];
    totalPriceElement.textContent = `₹${totalPrice}`;
}

// Enable or disable the "Add to Cart" button based on form validation
function validateForm() {
    const selectedColor = document.querySelector('.color-circle.selected');
    const customTextValue = customTextInput.value.trim();

    if (selectedColor && sizeSelect.value && customTextValue) {
        addToCartBtn.disabled = false;
        notification.classList.add('d-none'); 
    } else {
        addToCartBtn.disabled = true;
        notification.textContent = 'Please select a color, size, and enter custom text before adding to the cart.';
        notification.classList.remove('d-none');
    }
}

// Save customization to localStorage
function saveCustomization() {
    const selectedColor = document.querySelector('.color-circle.selected').getAttribute('data-color');
    const selectedSize = sizeSelect.value;
    const customTextValue = customTextInput.value;
    const selectedTextColor = textColorInput.value;

    const customization = {
        color: selectedColor,
        size: selectedSize,
        text: customTextValue,
        textColor: selectedTextColor
    };

    localStorage.setItem('tshirtCustomization', JSON.stringify(customization));
}

// Load customization from localStorage
function loadCustomization() {
    const savedCustomization = localStorage.getItem('tshirtCustomization');
    if (savedCustomization) {
        const { color, size, text, textColor } = JSON.parse(savedCustomization);
        
        const savedColorCircle = document.querySelector(`.color-circle[data-color="${color}"]`);
        if (savedColorCircle) savedColorCircle.click();

        sizeSelect.value = size;
        document.getElementById('selectedSize').textContent = size;

        customTextInput.value = text;
        customText.textContent = text;
        textColorInput.value = textColor;
        customText.style.color = textColor;

        updateTotalPrice();
    }
}

// Add event listener for "Add to Cart" button
addToCartBtn.addEventListener('click', function() {
    const selectedColor = document.querySelector('.color-circle.selected');
    const selectedSize = sizeSelect.value;
    const customTextValue = customTextInput.value.trim();

    if (selectedColor && selectedSize && customTextValue) {
        alert('Item added to cart!'); // Alert message when item is added
    } else {
        validateForm(); // Call validate to show message if fields are empty
    }
});

// Call the loadCustomization on page load
window.onload = loadCustomization;
