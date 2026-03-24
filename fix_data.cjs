const fs = require('fs');

let code = fs.readFileSync('src/data.js', 'utf8');

const injectMissingFields = (arrayName, defaultSubtitle, defaultContent) => {
    const startIdx = code.indexOf(`export const ${arrayName} = [`);
    if (startIdx === -1) return;
    const endIdx = code.indexOf('];', startIdx);
    
    let chunk = code.substring(startIdx, endIdx);
    
    const parts = chunk.split(/\{\s*id:/);
    
    for (let i = 1; i < parts.length; i++) {
        let part = parts[i];
        
        if (!part.includes('post_subtitle:')) {
            part = part.replace(/(title:\s*".*?",)/, `$1\n    post_subtitle: "${defaultSubtitle}",`);
        }
        
        if (!part.includes('content:') && !part.includes('description:')) {
            // we try to place content after post_subtitle if we just added it or if it exists
            if (part.includes('post_subtitle:')) {
                part = part.replace(/(post_subtitle:\s*".*?",)/, `$1\n    content: "${defaultContent}",`);
            } else {
                part = part.replace(/(title:\s*".*?",)/, `$1\n    content: "${defaultContent}",`);
            }
        }
        
        parts[i] = part;
    }
    
    const newChunk = parts.join('{ id:');
    code = code.substring(0, startIdx) + newChunk + code.substring(endIdx);
};

injectMissingFields('MOCK_FEED', 'Cròniques i ecos de la comarca', 'Un fragment de vida rural capturat en la xarxa. Aquesta publicació encara no té un text extens, però convida a connectar.');
injectMissingFields('MOCK_MARKET', 'Producte de proximitat i tradició', 'Aquest article del mercat local està disponible per a tota la comunitat. Fes costat al comerç de km 0.');
injectMissingFields('MOCK_EVENTS', 'Trobada comunitària i cultura', 'Un esdeveniment que unix la nostra gent. Pròximament publicarem el cartell i els horaris oficials.');
injectMissingFields('MOCK_TOWNS', "Un racó ple d\\'història i vida", 'Aquest poble manté vives les seues arrels i convida a tothom a descobrir la seua essència.');

fs.writeFileSync('src/data.js', code, 'utf8');
console.log('Fixed data.js fields successfully!');
