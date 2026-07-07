const fs = require('fs');

// 1. Modificar soc_de_poble/index.html
let socHtml = fs.readFileSync('public/soc_de_poble/index.html', 'utf8');

const newCard = `
        <!-- CARD BRAIN -->
        <div class="universal-card" onclick="window.location.href='../brain/index.html'">
          <header class="uc-caputxa">
            <div class="uc-autor-zona">
              <div class="uc-avatar">
                <img src="../gestoria/logo.svg" alt="" style="width: 100%; height: 100%; object-fit: contain; padding: 4px; background: #000;">
              </div>
              <div class="uc-autor-text">
                <span class="uc-autor-nom">SISTEMA</span>
                <span class="uc-autor-lloc">El Cervell Digital</span>
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
            <h1>BRAIN</h1>
            <h2>EL CERVELL DIGITAL DE SÓC DE POBLE</h2>
            <div style="font-size: 64px; color: var(--sp-blue-100); margin-top: 16px;"><i data-lucide="network"></i></div>
          </div>
          <div class="uc-peu">
            <div class="uc-icones-centre">
              <span><i data-lucide="languages"></i></span>
              <span><i data-lucide="message-circle"></i></span>
              <span><i data-lucide="share-2"></i></span>
            </div>
            <button class="uc-boto-accio">
              <span class="uc-boto-icon">+</span><span class="uc-boto-text"> CONNECTAR</span>
            </button>
          </div>
        </div>
`;

// Insert the new card after IAIA MarIA card
if (socHtml.includes('<!-- CARD PUBLICAR -->')) {
  // Let's find where the IAIA MarIA card ends and the BLOC DE NOTES card starts
  socHtml = socHtml.replace('<!-- CARD BLOC DE NOTES -->', newCard + '\n        <!-- CARD BLOC DE NOTES -->');
}

fs.writeFileSync('public/soc_de_poble/index.html', socHtml);
console.log("Card Brain añadida a soc_de_poble/index.html");

// 2. Modificar brain/index.html
let brainHtml = fs.readFileSync('public/brain/index.html', 'utf8');

// The brain page will load the Cervell3D overlay automatically or have a dedicated canvas.
// Let's just create a page with a big button to open the Brain overlay, or embed the canvas directly.
// The user said "que el Brain empiece a funcionar a ver qué está pasando". I'll put a card that triggers the brain, or just the same overlay system.
brainHtml = brainHtml.replace(/<title>.*?<\/title>/, '<title>Brain - Sóc de Poble</title>');
brainHtml = brainHtml.replace('<h1>IAIA MarIA</h1>', '<h1>BRAIN</h1>');
brainHtml = brainHtml.replace('<h2>EL MEU GENOTIP</h2>', '<h2>XARXA NEURAL</h2>');
brainHtml = brainHtml.replace('<span class="up-categoria">INTEL·LIGÈNCIA ARTIFICIAL</span>', '<span class="up-categoria">SISTEMA CENTRAL</span>');
brainHtml = brainHtml.replace('<span class="up-etiqueta">ADMINISTRADOR</span>', '<span class="up-etiqueta">CERVELL 3D</span>');

// Replace the avatar in caputxa
brainHtml = brainHtml.replace(
  /<img src="\.\.\/assets\/uploads\/ia\/01-iaia-matriarca\/avatars\/iaia-maria-avatar\.png".*?>/, 
  '<img src="../gestoria/logo.svg" alt="Brain Logo" style="width: 100%; height: 100%; object-fit: contain; padding: 4px; background: #000;">'
);
brainHtml = brainHtml.replace(/<span class="uc-autor-nom">IAIA MarIA<\/span>/g, '<span class="uc-autor-nom">SISTEMA<\/span>');
brainHtml = brainHtml.replace(/<span class="uc-autor-lloc">La Torre de les Maçanes<\/span>/g, '<span class="uc-autor-lloc">El Cervell Digital<\/span>');
brainHtml = brainHtml.replace('<div>@iaiamaria</div>', '<div>@brain</div>');

// Add the Cervell3D overlay code from soc_de_poble/index.html
const cervellOverlay = `
  <!-- CERVELL 3D OVERLAY -->
  <div id="sp-visor-cervell" class="sp-visor-cervell" inert aria-hidden="true">
    <div class="cervell-controls">
      <button class="btn-cervell btn-tancar" id="btn-tancar-cervell">
        <i data-lucide="x"></i> Tancar
      </button>
    </div>
    <div class="cervell-canvas-container">
      <canvas id="cervell-canvas"></canvas>
      <div id="cervell-stats" class="cervell-hud">Inicialitzant Cervell 3D...</div>
    </div>
  </div>

  <script>
    lucide.createIcons();
  </script>

  <!-- Orquestrador Principal del Nucli 1.0 -->
  <script type="module" src="../soc_de_poble/js/app.js"></script>

  <script type="module">
    import { MotorCervell3D } from '../soc_de_poble/js/cervell3d/cervell3d-integration.js';
    
    document.addEventListener("DOMContentLoaded", () => {
      window.cervell3d = new MotorCervell3D('cervell-canvas');
      
      const btnObrir = document.getElementById('btn-obrir-cervell');
      if (btnObrir) {
        btnObrir.addEventListener('click', () => {
          window.cervell3d.start();
        });
      }
      
      const btnTancar = document.getElementById('btn-tancar-cervell');
      if (btnTancar) {
        btnTancar.addEventListener('click', () => {
          window.cervell3d.stop();
        });
      }
    });
  </script>
`;

brainHtml = brainHtml.replace(/<\/body>/, cervellOverlay + '\n</body>');

// Fix the path to the CSS in brainHtml
brainHtml = brainHtml.replace(/<link rel="stylesheet" href="\.\.\/assets\/pedra-seca\.css\?v=3">/, '<link rel="stylesheet" href="../assets/pedra-seca.css?v=3">\n  <link rel="stylesheet" href="../soc_de_poble/css/cervell3d.css">');

fs.writeFileSync('public/brain/index.html', brainHtml);
console.log("brain/index.html actualizada con la estructura de Brain");

