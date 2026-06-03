// Servidor de prova mínim per validar handshake i canvi de versió
const express = require('express');
const path = require('path');
const app = express();
let appVersion = 1;

app.use((req, res, next) => {
  // Header de versió per a diagnosi; Cache-Control estricte per index.html
  res.setHeader('X-App-Version', String(appVersion));
  res.setHeader('Cache-Control', 'no-cache, must-revalidate');
  next();
});

// Endpoint per simular un nou desplegament que incrementa la versió
app.get('/invalidate', (req, res) => {
  appVersion += 1;
  res.setHeader('X-App-Version', String(appVersion));
  res.send({ ok: true, version: appVersion });
});

// Servim la carpeta dist generada per `vite build`
app.use(express.static(path.join(__dirname, '../../dist')));

const server = app.listen(5174, () => {
  console.log('handshake-server listening on http://localhost:5174');
});

process.on('SIGINT', () => server.close());
