// generateImageList.js
const fs = require('fs');
const path = require('path');

// Directory containing images
const dirPath = path.join(__dirname, 'public', 'data', 'transfer', 'phenocam');

// Get all jpg files in the directory
const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.jpg'));

// Create array of file paths
const fileArray = files.map(file => `/data/phenocam/${file}`);

// Write the array to a JSON file
fs.writeFileSync('./src/tempImages.json', JSON.stringify(fileArray, null, 2));

console.log('Image list generated.');
