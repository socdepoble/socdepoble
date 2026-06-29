const fs = require('fs');
const path = require('path');
const data = require('./graph_analysis.json');

const dir = path.join(__dirname, '..', '_wiki_de_poble');
let report = '';

for (const isolate of data.isolates) {
  const filePath = path.join(dir, data.graph[isolate].path);
  const content = fs.readFileSync(filePath, 'utf8');
  // Strip yaml
  let text = content.replace(/---[\s\S]*?---/, '').trim();
  report += `\n===================================\n`;
  report += `FILE: ${data.graph[isolate].path}\n`;
  report += `SIZE: ${text.length} chars\n`;
  report += `EXCERPT: ${text.substring(0, 300).replace(/\n/g, ' ')}\n`;
}

fs.writeFileSync(path.join(__dirname, 'isolates_report.txt'), report, 'utf8');
console.log('Report saved.');
