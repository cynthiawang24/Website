function switchPage(pageId) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });

  // Show the target page
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('active');
  }
}

// TOOLTIP!!!
const boundingBoxes = document.querySelectorAll('.bounding-box');
const tooltip = document.querySelector('.tooltip'); // Only needs to target the first tooltip, other tooltips will be handled similarly.

boundingBoxes.forEach(box => {
  const tooltip = box.querySelector('.tooltip'); // Select the tooltip inside the current bounding box
  box.addEventListener('mousemove', (e) => {
    const offsetX = 15; // Offset from the cursor to the right
    const offsetY = 12; // Offset from the cursor below

    // Get the mouse position relative to the bounding box
    const rect = box.getBoundingClientRect();
    const x = e.clientX - rect.left; // Mouse position relative to the bounding box
    const y = e.clientY - rect.top;  // Mouse position relative to the bounding box

    // Set the position of the tooltip to appear at the bottom-right of the cursor
    tooltip.style.left = `${x + offsetX}px`;
    tooltip.style.top = `${y + offsetY}px`;
  });
});


// savveeeee
function saveDrawing() {
  // Get the base64 image from the canvas
  const dataURL = canvas.toDataURL('image/png'); // Converts canvas content to PNG

  // Send the image to the backend (you can adjust this as per your backend endpoint)
  uploadImage(dataURL);
}

function uploadImage(imageData) {
  fetch('/upload', {  // Adjust the URL to your backend endpoint
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image: imageData }),  // Send the base64 image as JSON
  })
  .then(response => response.json())
  .then(data => {
    console.log('Image uploaded successfully:', data);
    // Optionally, refresh the gallery to show the new image
  })
  .catch(error => {
    console.error('Error uploading image:', error);
  });
}

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json({ limit: '10mb' }));  // Parse incoming JSON requests with large payloads

// Route to handle image upload
app.post('/upload', (req, res) => {
  const { image } = req.body;  // Get base64 image from the body

  // Remove the base64 metadata part (e.g., 'data:image/png;base64,')
  const base64Data = image.replace(/^data:image\/png;base64,/, '');

  // Create a unique filename for the image
  const filePath = path.join(__dirname, 'uploads', Date.now() + '.png'); // Save in 'uploads' directory

  // Write the image to the file system
  fs.writeFile(filePath, base64Data, 'base64', (err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to save the image.' });
    }

    res.status(200).json({ message: 'Image uploaded successfully', path: filePath });
  });
});

// Serve the uploaded images statically (you may need a public directory for this)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

app.get('/gallery', (req, res) => {
  const galleryFolderPath = path.join(__dirname, 'uploads');
  
  fs.readdir(galleryFolderPath, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to retrieve images.' });
    }

    // Return a list of file paths
    const images = files.map(file => '/uploads/' + file);
    res.json({ images });
  });
});

function loadGallery() {
  fetch('/gallery')  // Fetch the gallery images from the server
    .then(response => response.json())
    .then(data => {
      const galleryContainer = document.getElementById('gallery-container');
      galleryContainer.innerHTML = '';  // Clear previous images

      // Loop through the image paths and create <img> elements
      data.images.forEach(imagePath => {
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = 'User Drawing';
        img.classList.add('gallery-image');
        galleryContainer.appendChild(img);
      });
    })
    .catch(error => {
      console.error('Error loading gallery:', error);
    });
}
