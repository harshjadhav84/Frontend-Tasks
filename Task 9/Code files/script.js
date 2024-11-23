document.addEventListener('DOMContentLoaded', function () {
    // Default auto-slide interval (5 seconds) 
    let autoSlideInterval = 5000;
    let carouselElement = document.querySelector('#travelCarousel');
    let currentSlide = 0;
    const slides = carouselElement.querySelectorAll('.carousel-item');
    const totalSlides = slides.length;
    let isPaused = false;

    // Function to show a specific slide
    function showSlide(index) {
        slides.forEach((slide, idx) => {
            slide.classList.toggle('active', idx === index);
        });

        // Update indicators
        const indicators = carouselElement.querySelectorAll('.carousel-indicators li');
        indicators.forEach((indicator, idx) => {
            indicator.classList.toggle('active', idx === index);
        });
    }

    // Auto-slide function
    function goToNextSlide() {
        if (!isPaused) {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        }
    }

    // Function to restart auto-slide with new interval
    function restartAutoSlide() {
        clearInterval(autoSlide); // Clear the existing interval
        autoSlide = setInterval(goToNextSlide, autoSlideInterval); // Set the new interval
    }

    // Auto-slide setup
    let autoSlide = setInterval(goToNextSlide, autoSlideInterval);

    // Pause auto-slide on hover
    carouselElement.addEventListener('mouseover', () => {
        isPaused = true;
        clearInterval(autoSlide);
    });

    // Resume auto-slide when hover ends
    carouselElement.addEventListener('mouseout', () => {
        isPaused = false;
        restartAutoSlide();
    });

    // Navigation arrow functionality
    const prevButton = carouselElement.querySelector('.carousel-control-prev');
    const nextButton = carouselElement.querySelector('.carousel-control-next');

    // Prevent default scroll behavior on arrow clicks
    prevButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent page scroll
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    });

    nextButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent page scroll
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    });

    // Swipe functionality for mobile devices
    let touchStartX = 0;
    let touchEndX = 0;

    carouselElement.addEventListener('touchstart', function (event) {
        touchStartX = event.changedTouches[0].screenX;
    });

    carouselElement.addEventListener('touchend', function (event) {
        touchEndX = event.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        if (touchEndX < touchStartX) {
            currentSlide = (currentSlide + 1) % totalSlides;
        } else if (touchEndX > touchStartX) {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        }
        showSlide(currentSlide);
    }

    // Click event for indicators
    const indicators = carouselElement.querySelectorAll('.carousel-indicators li');
    indicators.forEach((indicator, idx) => {
        indicator.addEventListener('click', () => {
            currentSlide = idx;
            showSlide(currentSlide);
        });
    });

    // Listen for changes to the auto-slide interval input field
    const intervalInput = document.getElementById('autoSlideInterval');
    intervalInput.addEventListener('input', function () {
        autoSlideInterval = parseInt(intervalInput.value, 10); // Update the interval value
        restartAutoSlide(); // Restart the auto-slide with the new interval
    });
});