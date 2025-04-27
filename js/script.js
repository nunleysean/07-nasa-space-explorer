// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Automatically set the date inputs to the last 9 days
setupDateInputs(startInput, endInput);

// NASA APOD API key and endpoint
const API_KEY = "V1RmYXpBYw2KdfTh8hlX8opO06OxpT4ujSopkj79";
const API_URL = "https://api.nasa.gov/planetary/apod";

// Find the gallery and button elements
const gallery = document.getElementById('gallery');
const getImagesButton = document.querySelector('.filters button');

// Space facts
const spaceFacts = [
  "The Sun is a 4.5-billion-year-old yellow dwarf star composed primarily of hydrogen and helium.",
  "Earth is the only known planet to support life and possesses liquid water on its surface.",
  "The Moon preserves a historical record of our solar system through its impact craters, ancient lava flows, and ice deposits.",
  "Our solar system comprises eight planets and five officially recognized dwarf planets: Ceres, Pluto, Haumea, Makemake, and Eris.",
  "Ceres, located in the asteroid belt between Mars and Jupiter, is the largest object in that region and accounts for about one-third of the belt's total mass.",
  "Jupiter is the largest planet in our solar system, and over 1,300 Earths could fit inside it.",
  "Neptune experiences massive storms, some so vast they could engulf Earth entirely.",
  "Our solar system resides in the Orion Spur, a minor arm of the Milky Way galaxy, situated between the Sagittarius and Perseus arms.",
  "It takes approximately 230 million years for our solar system to complete one orbit around the center of the Milky Way.",
  "The solar system contains over 1.3 million asteroids, about 4,000 comets, and more than 300 moons orbiting planets and dwarf planets.",
  "Mars is the only planet inhabited solely by robots, with multiple NASA rovers exploring its surface.",
  "The James Webb Space Telescope has observed galaxies whose light has traveled over 12 billion years to reach us.",
  "The International Space Station (ISS) has been continuously inhabited since November 2000.",
  "NASA's 'Veggie' experiment aboard the ISS has successfully grown edible plants like lettuce and mustard greens in space."
];

// Find the spaceFacts div
const spaceFactsDiv = document.querySelector('.spaceFacts');

// Function to display a random space fact
function displayRandomSpaceFact() {
  // Select a random fact from the spaceFacts array
  const randomFact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];
  
  // Insert the fact into the spaceFacts div
  spaceFactsDiv.textContent = `SPACE FACT: ${randomFact}`;
}

// Call the function to display a random fact when the page loads
displayRandomSpaceFact();

// Create the modal elements
const modal = document.createElement('div');
modal.className = 'modal';
modal.innerHTML = `
  <div class="modal-content">
    <button class="modal-close">Close</button>
    <img src="" alt="" />
    <h2></h2>
    <p class="modal-date"></p>
    <p class="modal-explanation"></p>
  </div>
`;
document.body.appendChild(modal);

// Find modal elements
const modalImage = modal.querySelector('img');
const modalTitle = modal.querySelector('h2');
const modalDate = modal.querySelector('.modal-date');
const modalExplanation = modal.querySelector('.modal-explanation');
const modalClose = modal.querySelector('.modal-close');

// Function to open the modal
function openModal(imageUrl, title, date, explanation) {
  modalImage.src = imageUrl;
  modalImage.alt = title;
  modalTitle.textContent = title;
  modalDate.textContent = `Date: ${date}`;
  modalExplanation.textContent = explanation;
  modal.style.display = 'flex'; // Show the modal
}

// Function to close the modal
modalClose.addEventListener('click', () => {
  modal.style.display = 'none'; // Hide the modal
});

// Add click event to gallery items
gallery.addEventListener('click', (event) => {
  const galleryItem = event.target.closest('.gallery-item');
  if (galleryItem) {
    const imageUrl = galleryItem.querySelector('img').src;
    const title = galleryItem.querySelector('.overlay p strong').textContent;
    const date = galleryItem.querySelector('.overlay p:nth-child(2)').textContent;
    const explanation = galleryItem.dataset.explanation; // Explanation stored in data attribute
    openModal(imageUrl, title, date, explanation);
  }
});

// Function to fetch and display images
getImagesButton.addEventListener('click', async () => {
  // Clear the gallery
  gallery.innerHTML = '<p>Loading images, please wait...</p>'; // Display loading message

  // Get the selected date range
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Fetch images from NASA's APOD API
  try {
    const response = await fetch(`${API_URL}?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`);
    const data = await response.json();

    // Clear the loading message
    gallery.innerHTML = '';

    // Check if the response contains valid data
    if (Array.isArray(data)) {
      data.forEach(item => {
        // Only display items with images
        if (item.media_type === 'image') {
          const galleryItem = document.createElement('div');
          galleryItem.className = 'gallery-item';
          galleryItem.dataset.explanation = item.explanation; // Store explanation in data attribute

          // Add image and overlay with title and date
          galleryItem.innerHTML = `
            <img src="${item.url}" alt="${item.title}" />
            <div class="overlay">
              <p><strong>${item.title}</strong></p>
              <p>${item.date}</p>
            </div>
          `;

          gallery.appendChild(galleryItem);
        }
      });
    } else {
      gallery.innerHTML = '<p>No images found for the selected date range.</p>';
    }
  } catch (error) {
    console.error('Error fetching data from NASA API:', error);
    gallery.innerHTML = '<p>Failed to load images. Please try again later.</p>';
  }
});
