document.addEventListener("DOMContentLoaded", function() {
    let testimonialCarousel = new bootstrap.Carousel('#testimonialCarousel', {
        interval: 3000,
        pause: 'hover',
        touch: true 
    });

    const carouselElement = document.querySelector('#testimonialCarousel');
    let touchStartY = 0;

    carouselElement.addEventListener('touchstart', function(event) {
        touchStartY = event.touches[0].clientY;
    });

    carouselElement.addEventListener('touchmove', function(event) {
        const touchMoveY = event.touches[0].clientY;
        const diffY = touchMoveY - touchStartY;

        if (Math.abs(diffY) > 30) {
            event.preventDefault(); 
        }
    });
});
