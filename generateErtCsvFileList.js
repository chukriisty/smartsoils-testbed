const fs = require('fs');
const path = require('path');

// Directory containing .vtu files
const dirPath = path.join(__dirname, 'public', 'data', 'ert', 'csv_files', 'x');

// Get all .vtu files in the directory
const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.csv'));

// Create array of file paths relative to the public directory
const fileArray = files.map(file => `/data/ert/csv_files/x/${file}`);

// Write the array to a JSON file in the src directory
fs.writeFileSync('./public/ertFileList.json', JSON.stringify(fileArray, null, 2));

console.log('CSV file list generated.');
