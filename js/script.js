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

          // Add image and details
          galleryItem.innerHTML = `
            <img src="${item.url}" alt="${item.title}" />
            <p><strong>${item.title}</strong></p>
            <p>${item.date}</p>
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
