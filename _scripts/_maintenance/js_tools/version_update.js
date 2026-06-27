const fs = require('fs');

let html = fs.readFileSync('Manual_Identitat_Extens.html', 'utf-8');

const creationDate = "18 ABR 2026 05:47";
const revisionDate = "18 ABR 2026 07:44 (+2)";

const versionHtml = `
      <div class="v-control" style="display: flex; flex-direction: column; align-items: flex-end; font-size: 6.5pt; font-family: monospace; color: var(--sosp-gray); text-transform: uppercase; line-height: 1.2; margin-left: auto; text-align: right;">
        <span>CREA: ${creationDate}</span>
        <span>REV: ${revisionDate}</span>
      </div>`;

// Find all matches for <div class="meta"> and insert the version-control block after it in the .doc-header
// Actually, it's safer to inject it just before the closing </div> of <div class="doc-header">
// But doc-header can have different nested divs. 
// A safer regex: find `<div class="meta">...</div>` and append the version block right after it.
html = html.replace(/(<div class="meta">[\s\S]*?<\/div>)/g, `$1${versionHtml}`);

fs.writeFileSync('Manual_Identitat_Extens.html', html, 'utf-8');
console.log("Version control updated in all headers!");
