const fs = require('fs');

let html = fs.readFileSync('public/soc_de_poble/index.html', 'utf8');

// The file is messy from line 124 to line 643.
// I will extract each card. I'll define a regex to pull out all universal-card divs based on their H1 text.
function extractCard(title) {
    const startRegex = new RegExp(`<!-- CARD ${title} -->[\\s\\S]*?<div class="universal-card"`);
    const match = html.match(startRegex);
    if (!match) return null;
    
    const startIndex = match.index;
    let openDivs = 0;
    let i = startIndex + match[0].length - 28; // go back to <div class="universal-card"
    
    // Simple bracket matching to find the end of the card
    while (i < html.length) {
        if (html.substr(i, 4) === '<div') openDivs++;
        else if (html.substr(i, 5) === '</div') {
            openDivs--;
            if (openDivs === 0) {
                return html.substring(startIndex, i + 6);
            }
        }
        i++;
    }
    return null;
}

const javiCard = extractCard('EL TEU PERFIL') || extractCard('JAVI LLINARES');
const iaiaCard = extractCard('PUBLICAR') || extractCard('IAIA MarIA');
const brainCard = extractCard('BRAIN');
const sdpCard = extractCard('SÓC DE POBLE');
const gestoriaCard = extractCard('GESTORIA');
const llibreriaCard = extractCard('LLIBRERIA');
const dubtesCard = extractCard('DUBTES');
const notesCard = extractCard('BLOC DE NOTES');
const projecteCard = extractCard('EL PROJECTE');
const eixirCard = extractCard('EIXIR DEL POBLE');

const newArticle = `
      <!-- Cos del Document Markdown-friendly -->
      <article class="up-document">
        
        <!-- SECCIÓ 1: ACCIONS PRINCIPALS -->
        <h2 class="up-subtitol-fora">Accions Principals</h2>
        <div class="universal-grid">
${javiCard}
${iaiaCard}
${brainCard}
        </div>

        <!-- SECCIÓ 2: ENTORNS NATIUS -->
        <h2 class="up-subtitol-fora" style="margin-top: 32px;">Viatja als entorns natius</h2>
        <div class="universal-grid">
${sdpCard}
${gestoriaCard}
${llibreriaCard}
        </div>

        <!-- SECCIÓ 3: RECURSOS I EINES -->
        <h2 class="up-subtitol-fora" style="margin-top: 32px;">Recursos i Eines</h2>
        <div class="universal-grid">
${dubtesCard}
${notesCard}
${projecteCard}
${eixirCard}
        </div>
      </article>
`;

const preArticle = html.substring(0, html.indexOf('<article class="up-document">'));
const postArticle = html.substring(html.lastIndexOf('</article>') + 10);

const finalHtml = preArticle + newArticle + postArticle;
fs.writeFileSync('public/soc_de_poble/index.html', finalHtml);
console.log("Fixed public/soc_de_poble/index.html layout and removed duplicates.");
