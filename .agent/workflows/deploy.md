---
description: Com fer el deploy a SiteGround de forma autònoma i ràpida
---

// turbo-all
Aquest workflow permet a l'agent i a tu realitzar el deploy a SiteGround d'una forma gairebé 100% autònoma, resolent els conflictes de confirmacions múltiples.

0. **Requisit previ (només la primera vegada):**
   Asegura't de tindre creat l'arxiu `.env.deploy` a l'arrel amb els teus credencials FTP (t'he deixat una plantilla a `.env.deploy.template`). Aquest fitxer s'ignorarà a git per seguretat.

1. Executar el bategat local que construirà i pujarà automàticament via FTP a SiteGround:

```bash
./DEPLOY_SITEGROUND.sh
```

2. **Únic pas manual** Obrir el navegador a SiteGround File Manager:
   https://tools.siteground.com/filemanager?siteId=S3czMFpYc0tKZz09

3. Operacions de fitxers al servidor:
   _(El fitxer `dist.tar.gz` ja s'haurà pujat directament a la teua carpeta public_html)_

   - Eliminar prèviament les carpetes/fitxers antics a excepció de `dist.tar.gz`.
   - Extraure (Extract) el `dist.tar.gz`.
   - Moure el contingut de la carpeta `dist` a `public_html`.
   - Esborrar la carpeta `dist` buida i el fitxer `dist.tar.gz`.

4. Neteja de Cache (Recomenat):
   https://tools.siteground.com/cacher?siteId=S3czMFpYc0tKZz09
   - Clicar a "Vaciar caché".
