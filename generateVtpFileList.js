const fs = require('fs');
const path = require('path');

// Directory containing .vtu files
const dirPath = path.join(__dirname, 'public', 'data', 'ert', 'vtp_files');

// Get all .vtu files in the directory
const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.vtp'));

// Create array of file paths relative to the public directory
const fileArray = files.map(file => `/data/ert/vtp_files/${file}`);

// Write the array to a JSON file in the src directory
fs.writeFileSync('./src/vtpFileList.json', JSON.stringify(fileArray, null, 2));

console.log('VTP file list generated.');
