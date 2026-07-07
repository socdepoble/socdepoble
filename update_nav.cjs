const fs = require('fs');
const path = require('path');

const oldNav = `<nav class="sp-app-shell-nav-mobil">
    <a class="sp-nav-item active" data-view="home" href="/soc_de_poble/index.html">
      <span class="sp-nav-icon"><i data-lucide="layout-dashboard"></i></span>
    </a>
    <a class="sp-nav-item" data-view="xat" href="/xat">
      <span class="sp-nav-icon"><i data-lucide="message-circle"></i></span>
    </a>
    <a class="sp-nav-item-center" onclick="window.location.href='../connectar/index.html'">
      <div class="sp-nav-mobil-btn-add">
        <i data-lucide="plus"></i>
      </div>
    </a>
    <a class="sp-nav-item" data-view="mur" href="#">
      <span class="sp-nav-icon"><i data-lucide="newspaper"></i></span>
    </a>
    <a class="sp-nav-item" data-view="mercat" href="#">
      <span class="sp-nav-icon"><i data-lucide="shopping-bag"></i></span>
    </a>
  </nav>`;

const newNav = `<nav class="sp-app-shell-nav-mobil">
    <a class="sp-nav-item" data-view="xat" href="/xat">
      <span class="sp-nav-icon"><i data-lucide="message-square"></i></span>
    </a>
    <a class="sp-nav-item active" data-view="home" href="/soc_de_poble/index.html">
      <span class="sp-nav-icon"><i data-lucide="layout-grid"></i></span>
    </a>
    <a class="sp-nav-item-center" onclick="window.location.href='../connectar/index.html'">
      <div class="sp-nav-mobil-btn-add">
        <i data-lucide="plus"></i>
      </div>
    </a>
    <a class="sp-nav-item" data-view="mercat" href="#">
      <span class="sp-nav-icon"><i data-lucide="shopping-bag"></i></span>
    </a>
    <a class="sp-nav-item" data-view="pobles" href="#">
      <span class="sp-nav-icon"><i data-lucide="map-pin"></i></span>
    </a>
  </nav>`;

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('sp-app-shell-nav-mobil')) {
        // Find the block and replace it using regex to handle slight whitespace differences if any
        const regex = /<nav class="sp-app-shell-nav-mobil">[\s\S]*?<\/nav>/;
        content = content.replace(regex, newNav);
        fs.writeFileSync(fullPath, content);
        console.log('Updated:', fullPath);
      }
    }
  }
}

processDirectory('./public');
