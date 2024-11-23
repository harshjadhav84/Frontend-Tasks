const hamburger = document.querySelector('.navbar-toggler');
const navLinks = document.querySelector('.navbar-collapse');
const dropdowns = document.querySelectorAll('.dropdown-toggle');

// Toggle the "show" class when the hamburger is clicked
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('show');
    const expanded = navLinks.classList.contains('show');
    hamburger.setAttribute('aria-expanded', expanded);
});

// Close navbar when clicking outside the menu (only for mobile view)
document.addEventListener('click', (event) => {
    // Check if the menu is open and the click is outside of the navbar
    if (navLinks.classList.contains('show') && !event.target.closest('.navbar')) {
        navLinks.classList.remove('show');
        hamburger.setAttribute('aria-expanded', 'false');
    }
});

// Close navbar when a link is clicked
navLinks.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
        navLinks.classList.remove('show');
        hamburger.setAttribute('aria-expanded', 'false');
    }
});

// Handle dropdowns with keyboard (Enter/Space) for accessibility
dropdowns.forEach(dropdown => {
    dropdown.addEventListener('click', function() {
        this.classList.toggle('show');
    });
    dropdown.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            this.classList.toggle('show');
            event.preventDefault();
        }
    });
});

// Close the menu using Escape key
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        navLinks.classList.remove('show');
        hamburger.setAttribute('aria-expanded', 'false');
    }
});
