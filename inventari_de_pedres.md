# Inventari de Pedres (Arqueologia Digital)
Aquest document actua com a cens arqueològic de la Masía. Cada peça clau del sistema té la seua fitxa.

## service_worker.js
- **Motiu d'existència**: Servir l'aplicació offline i actuar com a proxy interceptor.
- **Data**: Des de l'origen de la PWA.
- **Dependències**: Depén de workbox-core, cache-names. L'app sencera depén d'ell.
- **Risc**: CRÍTIC (Zona Sagrada).

## IndexedDB (Gestor Local)
- **Motiu d'existència**: Emmagatzemar el poble al telèfon de l'usuari per evitar requests innecessàries i garantir l'ús en l'Hivern Digital.
- **Risc**: CRÍTIC (Zona Sagrada).
