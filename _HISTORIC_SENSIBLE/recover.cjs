const https = require('https');
const fs = require('fs');

https.get('https://socdepoble.org/assets/index-CUNlxpIs.js.map', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const map = JSON.parse(data);
            const sources = map.sources;
            const sourcesContent = map.sourcesContent;
            
            const index = sources.findIndex(s => s.includes('ProjectPresentation.jsx'));
            if (index !== -1) {
                const sourceContent = sourcesContent[index];
                fs.writeFileSync('/Users/javillinares/Documents/Antigravity/Sóc de Poble/src/pages/ProjectPresentation.jsx', sourceContent);
                console.log('Recovered ProjectPresentation.jsx !');
            }

            const navIndex = sources.findIndex(s => s.includes('AppLayout.jsx'));
            if (navIndex !== -1) {
                const navContent = sourcesContent[navIndex];
                fs.writeFileSync('/Users/javillinares/Documents/Antigravity/Sóc de Poble/src/components/AppLayout.jsx', navContent);
                console.log('Recovered AppLayout.jsx !');
            }
        } catch (e) {
            console.error('Error:', e);
        }
    });
}).on('error', err => console.error(err));
