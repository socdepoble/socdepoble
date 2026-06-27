const fs = require('fs');

const data = JSON.parse(fs.readFileSync('deps.json', 'utf8'));

const numDeps = {}; // file -> number of dependencies (outgoing edges)
const incomingDeps = {}; // file -> number of dependents (incoming edges)

for (const file in data) {
  numDeps[file] = data[file].length;
  if (!incomingDeps[file]) incomingDeps[file] = 0;
  for (const dep of data[file]) {
    if (!incomingDeps[dep]) incomingDeps[dep] = 0;
    incomingDeps[dep]++;
  }
}

// Sort by outgoing dependencies
const sortedOutgoing = Object.entries(numDeps).sort((a, b) => b[1] - a[1]).slice(0, 20);

// Sort by incoming dependencies
const sortedIncoming = Object.entries(incomingDeps).sort((a, b) => b[1] - a[1]).slice(0, 20);

console.log("=== TOP 20 FILES WITH MOST DEPENDENCIES (Most outgoing links) ===");
sortedOutgoing.forEach(([file, count]) => console.log(`${count}: ${file}`));

console.log("\n=== TOP 20 FILES DEPENDED UPON THE MOST (Most incoming links/Bottlenecks) ===");
sortedIncoming.forEach(([file, count]) => console.log(`${count}: ${file}`));
