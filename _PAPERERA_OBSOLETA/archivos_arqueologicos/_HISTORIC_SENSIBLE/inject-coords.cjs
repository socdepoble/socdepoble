const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'src', 'data.js');
let dataContent = fs.readFileSync(dataPath, 'utf-8');

// Base coordinates near La Torre to generate random offsets
const baseLat = 38.6042;
const baseLng = -0.4266;

// Match posts in MOCK_FEED array that don't have lat/lng
let replacements = 0;
dataContent = dataContent.replace(/id:\s*(["'\w-]+)\s*,([\s\S]*?)created_at:\s*(.*?)(?=\n\s*\})/g, (match, id, middle, createdAt) => {
    // If it already has lat or lng, skip
    if (middle.includes('lat:') || middle.includes('lng:')) {
        return match;
    }
    
    // Generate random offset (~5km radius)
    const latOffset = (Math.random() - 0.5) * 0.1;
    const lngOffset = (Math.random() - 0.5) * 0.1;
    
    const newLat = (baseLat + latOffset).toFixed(4);
    const newLng = (baseLng + lngOffset).toFixed(4);
    
    replacements++;
    return `id: ${id},${middle}lat: ${newLat},
    lng: ${newLng},
    created_at: ${createdAt}`;
});

fs.writeFileSync(dataPath, dataContent, 'utf-8');
console.log(`Injected coordinates into ${replacements} posts successfully.`);
