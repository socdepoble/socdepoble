const fs = require('fs');
const path = require('path');

const imageMapPath = path.join('src', 'utils', 'imageMap.json');
let imageMap = JSON.parse(fs.readFileSync(imageMapPath, 'utf8'));

let updatedMap = false;
for (const [key, val] of Object.entries(imageMap)) {
    if (val.includes('/uploads/users/ia/')) {
        imageMap[key] = val.replace('/uploads/users/ia/', '/uploads/ia/');
        updatedMap = true;
    }
}

if (updatedMap) {
    fs.writeFileSync(imageMapPath, JSON.stringify(imageMap, null, 2));
    console.log("Updated imageMap.json with correct /ia/ paths.");
} else {
    console.log("No updates needed for imageMap.json.");
}
