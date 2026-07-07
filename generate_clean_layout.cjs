const fs = require('fs');

const html = fs.readFileSync('public/soc_de_poble/index.html', 'utf8');

const pre = html.substring(0, html.indexOf('<article class="up-document">'));
const post = html.substring(html.lastIndexOf('</article>') + 10);

function createCard(title, subtitle, icon, avatarUrl, avatarName, btnText, btnColor = 'var(--sp-blue-600)') {
  return `        <div class="universal-card" onclick="window.location.href='#'">
          <header class="uc-caputxa">
            <div class="uc-autor-zona">
              <div class="uc-avatar">
                <img src="${avatarUrl}" alt="Avatar ${avatarName}" style="width: 100%; height: 100%; object-fit: ${avatarUrl.includes('logo.svg') ? 'contain' : 'cover'}; ${avatarUrl.includes('logo.svg') ? 'padding: 4px; background: #000;' : ''} border-radius: 50%;">
              </div>
              <div class="uc-autor-text">
                <span class="uc-autor-nom">${avatarName}</span>
                <span class="uc-autor-lloc">La Torre de les Maçanes</span>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <div class="uc-data-zona">
                <div>23:33</div>
                <div>22/03/26</div>
              </div>
            </div>
          </header>
          <div class="uc-cos">
            <h1>${title}</h1>
            <h2>${subtitle}</h2>
            <div style="font-size: 64px; color: ${title === 'EIXIR DEL POBLE' ? 'var(--sp-black-100)' : 'var(--sp-blue-100)'}; margin-top: 16px;"><i data-lucide="${icon}"></i></div>
          </div>
          <div class="uc-peu">
            <div class="uc-icones-centre">
              <span><i data-lucide="languages"></i></span>
              <span><i data-lucide="message-circle"></i></span>
              <span><i data-lucide="share-2"></i></span>
            </div>
            <button class="uc-boto-accio" style="${btnColor ? `background: ${btnColor}; border-color: ${btnColor};` : ''}">
              <span class="uc-boto-icon">+</span><span class="uc-boto-text"> ${btnText}</span>
            </button>
          </div>
        </div>`;
}

const javiAvatar = "../assets/uploads/gent/javi-llinares/avatars/javi-llinares-perfil-1200px.jpg";
const iaiaAvatar = "../assets/uploads/ia/01-iaia-matriarca/avatars/iaia-maria-avatar.png";
const logoAvatar = "/gestoria/logo.svg";

const newArticle = `
      <!-- Cos del Document Markdown-friendly -->
      <article class="up-document">
        
        <!-- SECCIÓ 1: ACCIONS PRINCIPALS -->
        <h2 class="up-subtitol-fora">Accions Principals</h2>
        <div class="universal-grid">
${createCard('JAVI LLINARES', 'EL TEU ESPAI PERSONAL', 'user', javiAvatar, 'Javi Llinares', 'CONNECTAR', '')}
${createCard('IAIA MarIA', 'ÀNIMA I CONSCIÈNCIA DEL SISTEMA', 'cpu', iaiaAvatar, 'IAIA MarIA', 'CONNECTAR', '')}
${createCard('BRAIN', 'EL CERVELL DIGITAL DE SÓC DE POBLE', 'network', logoAvatar, 'SISTEMA', 'CONNECTAR', '')}
        </div>

        <!-- SECCIÓ 2: ENTORNS NATIUS -->
        <h2 class="up-subtitol-fora" style="margin-top: 32px;">Viatja als entorns natius</h2>
        <div class="universal-grid">
${createCard('SÓC DE POBLE', 'XARXA SOCIAL NATIUA', 'users', iaiaAvatar, 'IAIA MarIA', 'CONNECTAR', '')}
${createCard('GESTORIA', "TAULER D'ADMINISTRACIÓ", 'building', iaiaAvatar, 'IAIA Gestora', 'CONNECTAR', '')}
${createCard('LLIBRERIA', "MOTOR D'ESCANEIG", 'book-open', iaiaAvatar, 'IAIA MarIA', 'CONNECTAR', '')}
        </div>

        <!-- SECCIÓ 3: RECURSOS I EINES -->
        <h2 class="up-subtitol-fora" style="margin-top: 32px;">Recursos i Eines</h2>
        <div class="universal-grid">
${createCard('DUBTES', 'CANAL DIRECTE AMB SISTEMA', 'help-circle', iaiaAvatar, 'IAIA MarIA', 'CONNECTAR', '')}
${createCard('CONSOLA TERMODINÀMICA', 'ÍNDEX DE SALUT DEL MAS', 'activity', iaiaAvatar, 'IAIA MarIA', 'CONNECTAR', '')}
${createCard('BLOC DE NOTES', 'NOTES PERSONALS I ESBORRANYS', 'file-text', iaiaAvatar, 'IAIA MarIA', 'CONNECTAR', '')}
${createCard('EL PROJECTE', 'CONSTITUCIÓ I NORMES', 'shield', iaiaAvatar, 'IAIA MarIA', 'CONNECTAR', '')}
${createCard('EIXIR DEL POBLE', 'TANCAR SESSIÓ DE FORMA SEGURA', 'log-out', iaiaAvatar, 'IAIA MarIA', 'EIXIR', 'var(--sp-black-90)')}
        </div>
      </article>
`;

fs.writeFileSync('public/soc_de_poble/index.html', pre + newArticle + post);
console.log("Layout generated cleanly.");
