// Display the current year
document.getElementById("current-year").textContent = new Date().getFullYear();

// Function to format the date to "Month Day, Year" format
function formatLastUpdatedDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Set the last updated date in the new format
const lastModified = new Date(document.lastModified);
const formattedLastUpdatedDate = formatLastUpdatedDate(lastModified);
document.getElementById("last-updated").textContent = formattedLastUpdatedDate;

// Back to Top Button functionality with debounce for better performance
const backToTopButton = document.getElementById("back-to-top");
let debounce;
window.addEventListener("scroll", () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
        backToTopButton.style.display = window.scrollY > 100 ? "block" : "none";
    }, 100); // Delay of 100ms for smoother performance
});
backToTopButton.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// Set dark mode by default on page load
document.body.classList.add("dark-theme");

// Theme Toggle Functionality with icon change
const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    themeToggle.innerHTML = document.body.classList.contains("dark-theme") ? "☀️" : "🌙"; // Toggle icon for theme change
});

// Accordion functionality with desktop and mobile distinction
function toggleAccordion() {
    if (window.innerWidth < 768) { // Only active on screens smaller than 768px
        document.querySelectorAll(".accordion-toggle").forEach(toggle => {
            toggle.addEventListener("click", function () {
                const content = this.nextElementSibling; // Get the accordion content element
                const isActive = content.style.display === 'block';

                // Close all accordion content sections
                document.querySelectorAll('.accordion-content').forEach(accContent => {
                    accContent.style.display = 'none';
                });

                // Toggle the clicked content
                content.style.display = isActive ? 'none' : 'block';
            });
        });
    } else {
        // On larger screens, ensure all content is visible and no accordion collapse behavior
        document.querySelectorAll('.accordion-content').forEach(content => {
            content.style.display = 'block';
        });
    }
}

// Initialize accordion toggle and apply on resize
window.addEventListener("resize", toggleAccordion);
toggleAccordion(); // Run on page load

// Ensure accordions are collapsed by default on smaller screens
document.querySelectorAll('.accordion').forEach(accordion => {
    const content = accordion.querySelector('.accordion-content');
    if (content && content.style.display === '') {
        content.style.display = 'none'; // Ensure the accordion is collapsed by default on load
    }
});
