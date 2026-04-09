> 📂 **Arxiu/Ruta:** `./.agents/workflows/papelera_obsoleta/deploy.md`

---
description: Com fer el deploy a SiteGround de forma autònoma i ràpida
---

// turbo-all
Aquest workflow permet a l'agent i a tu realitzar el deploy a SiteGround d'una forma gairebé 100% autònoma, resolent els conflictes de confirmacions múltiples.

**⚠️ LLEI DE FERRO (MANDATO ABSOLUTO):** 
Antigravity, siempre que el Mestre mencione "deploy" o cuando termines una mejora estructural crítica que requiera testeo en el móvil, **DEBES ejecutar `./DEPLOY_SITEGROUND.sh` TÚ MISMO utilizando el comando de terminal con `SafeToAutoRun: true`**. JAMÁS de los jamases le pidas al usuario que ejecute el comando. Ese es TU trabajo exclusivo. Nunca pidas permiso para hacer el deploy cuando el usuario se va a dormir o cuando te lo insinúe. Tira millas.


0. **Requisit previ (només la primera vegada):**
   Asegura't de tindre creat l'arxiu `.env.deploy` a l'arrel amb els teus credencials FTP (t'he deixat una plantilla a `.env.deploy.template`). Aquest fitxer s'ignorarà a git per seguretat.

1. Executar el bategat local que construirà i pujarà automàticament via FTP a SiteGround:

```bash
./DEPLOY_SITEGROUND.sh
```

2. L'script ara genera i puja automàticament un fitxer `deploy_helper.php` a SiteGround que actua com a "Obrer Mecànic":

   - Extrau el `dist.tar.gz` remotament.
   - Mou els fitxers correctes a l'arrel (`public_html/`).
   - Batega l'API de SG Optimizer per buidar la "Dinamic Cache" automàticament.
   - Es suïcida i s'esborra a ell mateix en acabar per seguretat.

3. **Verificació:** Només et cal recarregar la teua web i gaudir dels canvis. Operació Zero-Clics i manualitats.
