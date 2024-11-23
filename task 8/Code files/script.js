document.addEventListener("DOMContentLoaded", () => {
  const faqContainer = document.querySelector(".faq-section");
  const searchInput = document.querySelector(".search-bar input");
  const searchSuggestions = document.createElement("div");
  searchSuggestions.classList.add("suggestions");
  document.querySelector(".search-bar").appendChild(searchSuggestions);
  const searchIcon = document.querySelector(".search-icon");
  const clearFilterBtn = document.getElementById("clear-filter-btn");

  let allQuestions = [];
  let currentlyOpenCategory = null; // Track the currently open category

  // Fetch FAQ data and populate questions for suggestions
  fetch("faq.json")
    .then((response) => response.json())
    .then((data) => {
      // Flatten questions from all categories into a single array
      data.categories.forEach((category) => {
        allQuestions = allQuestions.concat(
          category.questions.map((q) => q.question)
        );
      });

      // Setup category click events
      const faqCategories = document.querySelectorAll(".faq-card");
      faqCategories.forEach((card, index) => {
        card.addEventListener("click", () =>
          toggleCategoryQuestions(data.categories[index], card)
        );
      });
    })
    .catch((error) => console.error("Error loading FAQ data:", error));

  // Filter and display suggestions based on user input
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    if (query) {
      const filteredQuestions = allQuestions.filter((question) =>
        question.toLowerCase().includes(query)
      );

      // Show filtered questions in suggestions
      searchSuggestions.innerHTML = filteredQuestions
        .map((question) => `<div class="suggestion-item">${question}</div>`)
        .join("");

      searchSuggestions.style.display = filteredQuestions.length
        ? "block"
        : "none";
    } else {
      searchSuggestions.style.display = "none";
    }
  });

  // Handle click on a suggestion item to fill the search input and show the answer
  searchSuggestions.addEventListener("click", (event) => {
    if (event.target.classList.contains("suggestion-item")) {
      const selectedQuestion = event.target.textContent;
      searchInput.value = selectedQuestion;
      searchSuggestions.style.display = "none";

      // Find the answer for the selected question
      fetch("faq.json")
        .then((response) => response.json())
        .then((data) => {
          let answerFound = false;

          data.categories.forEach((category) => {
            category.questions.forEach((item) => {
              if (item.question === selectedQuestion) {
                if (!answerFound) {
                  displayAnswer(item.answer); // Display the answer
                  answerFound = true;
                }
              }
            });
          });
        });
    }
  });

  // Function to display the answer below the search bar
  function displayAnswer(answer) {
    const existingAnswer = document.querySelector(".faq-answer-container");
    if (existingAnswer) {
      existingAnswer.remove(); // Remove any existing answer container
    }

    const answerContainer = document.createElement("div");
    answerContainer.classList.add("faq-answer-container");
    answerContainer.innerHTML = `<p>${answer}</p>`;
    document.querySelector(".search-bar").appendChild(answerContainer);
  }

  // Toggle visibility of questions for a clicked category
  function toggleCategoryQuestions(category, card) {
    // Clear any previously opened answers or suggestions
    const answerContainer = document.querySelector(".faq-answer-container");
    if (answerContainer) {
      answerContainer.remove();
    }
    searchSuggestions.style.display = "none"; // Hide search suggestions

    // Check if the current category is already open
    if (currentlyOpenCategory === card) {
      // If the same category is clicked, hide its questions
      const questionsContainer = faqContainer.querySelector(
        `.questions-container[data-category="${category.title}"]`
      );
      if (questionsContainer) {
        questionsContainer.style.display = "none"; // Hide questions
      }
      currentlyOpenCategory = null; // Reset the open category
    } else {
      // If a new category is clicked, display its questions
      const questionsContainer = document.createElement("div");
      questionsContainer.classList.add("questions-container");
      questionsContainer.setAttribute("data-category", category.title);

      questionsContainer.innerHTML = `  
          <h3>${category.title} - FAQs</h3>
          <ul>
            ${category.questions
              .map(
                (item) =>
                  `<li class="faq-item" id="que">
                    <div class="faq-question">${item.question}</div>
                    <div class="faq-answer" style="max-height: 0;">${item.answer}</div>
                  </li>`
              )
              .join("")}
          </ul>
        `;

      // Hide previously opened questions (if any)
      const existingContainer = faqContainer.querySelector(
        ".questions-container"
      );
      if (existingContainer) {
        existingContainer.style.display = "none";
      }

      // Add new questions container
      faqContainer.appendChild(questionsContainer);

      // Add expand/collapse functionality to the new questions
      const faqItems = questionsContainer.querySelectorAll(".faq-item");
      faqItems.forEach((item) => {
        const question = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");

        question.addEventListener("click", () => {
          faqItems.forEach((i) => {
            i.querySelector(".faq-answer").style.maxHeight = null;
          });
          answer.style.maxHeight = answer.style.maxHeight
            ? null
            : answer.scrollHeight + "px"; // Toggle the answer visibility
        });
      });

      // Set the newly opened category as the current open category
      currentlyOpenCategory = card;
    }
  }

  // Event listener for the Clear Filter button to hide all questions
  clearFilterBtn.addEventListener("click", () => {
    // Hide all question containers
    const questionsContainers = faqContainer.querySelectorAll(
      ".questions-container"
    );
    questionsContainers.forEach((container) => {
      container.style.display = "none";
    });

    // Reset the currentlyOpenCategory variable
    currentlyOpenCategory = null;
  });

  // Search icon click functionality: Show the answer for the search query
  searchIcon.addEventListener("click", () => {
    const query = searchInput.value;

    if (query) {
      fetch("faq.json")
        .then((response) => response.json())
        .then((data) => {
          let answerFound = false;

          data.categories.forEach((category) => {
            category.questions.forEach((item) => {
              if (item.question.toLowerCase() === query.toLowerCase()) {
                if (!answerFound) {
                  displayAnswer(item.answer); // Display the answer
                  answerFound = true;
                }
              }
            });
          });

          if (!answerFound) {
            displayAnswer(
              "No matching question found. Please contact customer care."
            );
          }
        });
    } else {
      displayAnswer("Please enter a question to search.");
    }

    searchSuggestions.style.display = "none"; // Hide suggestions after search
  });

  // Event listener for the search input field to show the clear button when typing
  document
    .getElementById("search-input")
    .addEventListener("input", function () {
      const clearBtn = document.getElementById("clear-btn");
      if (this.value.length > 0) {
        clearBtn.style.display = "block"; // Show the clear button
      } else {
        clearBtn.style.display = "none"; // Hide the clear button if input is empty
      }
    });

  // Event listener for the clear button to clear the input field when clicked
  document.getElementById("clear-btn").addEventListener("click", function () {
    const searchInput = document.getElementById("search-input");
    searchInput.value = ""; // Clear the input field
    searchInput.focus(); // Focus the input field after clearing
    this.style.display = "none"; // Hide the clear button after clearing
  });
});
