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
  gallery.innerHTML = '';

  // Get the selected date range
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Fetch images from NASA's APOD API
  try {
    const response = await fetch(`${API_URL}?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`);
    const data = await response.json();

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
