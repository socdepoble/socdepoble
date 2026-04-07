const { contextBridge } = require('electron');

// Exponemos una API segura al contexto del navegador
contextBridge.exposeInMainWorld('electronAPI', {
  // Futuros métodos nativos (e.g. acceso a ficheros, notificaciones nativas, etc.)
  // getAppVersion: () => ipcRenderer.invoke('get-app-version'),
});
