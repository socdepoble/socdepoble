import { app, BrowserWindow, session } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import serve from 'electron-serve';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV === 'development';

// Fallback loader para los archivos estáticos en producción
const loadURL = serve({ directory: 'dist' });

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Ocultar la barra de menú en producción para una experiencia inmersiva
  if (!isDev) {
    mainWindow.setMenuBarVisibility(false);
  }

  // Interceptar headers para permitir que sqlite-wasm funcione (Cross-Origin-Opener-Policy y Cross-Origin-Embedder-Policy)
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      },
    });
  });

  if (isDev) {
    // En desarrollo apuntamos al servidor de Vite
    mainWindow.loadURL('http://localhost:5173');
    // mainWindow.webContents.openDevTools();
  } else {
    // electron-serve se encarga de servir 'dist/index.html' mediante 'app://-'
    loadURL(mainWindow);
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
