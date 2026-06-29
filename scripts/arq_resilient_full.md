# SUMMARY OF 27 CHAOTIC FILES

## --- copilot_bootstrap_wrapper.md ---
# Wrapper TypeScript d'Inicialització SW i Purga
*Generat pel Consell dels 11 (Copilot) - Segona Ronda*
*Data: 2026-06-03*

Aquest document guarda l'script central de l'App Shell (`bootstrap-sw-with-detection.ts`) que orquestra tota l'enginyeria defensiva a l'arrencada de l'aplicació en l'iPad.

## `src/bootstrap-sw-with-detection.ts`

Aquest script realitza les següents accions en cadena:
1. **Detecció Precoç**: Avalua si IndexedDB penja el sistema utilitzant el nostre `indexeddb-detect.js`.
2. **Registre**: Registra el `maintenance-sw` (primer) i el `service-worker` principal.
3. **Descàrrega Segura**: Baixa el `BUILD_ID.txt` i el `manifest.json` + `manifest.sig` amb estratègies de reintentos i timeouts per a xarxes rurals.
4. **Verificació Criptogràfica**: Comprova la signatura Ed25519 del manifest.
5. **Persistència Fallback**: Si està verificat, guarda el manifest a `wa-sqlite` o `localStorage`.
6. **Purga Nuclear**: Si s'ha actualitzat la versió, envia el missatge `NUCLEAR_PURGE` al `maintenance-sw` i espera confirmació per a recarregar.

Té hooks de telemetria incrustats per a monitoritzar tot el procés.

*(El codi font complet està integrat a l'historial de la sessió del Mestre).*


## --- copilot_ci_sign_manifest_cli.md ---
# Script de Signatura del Manifest al CI (Ed25519)
*Generat pel Consell dels 11 (Copilot) - Segona Ronda*
*Data: 2026-06-03*

Aquest document guarda l'script Node (TypeScript) encarregat de **generar la signatura criptogràfica** del manifest durant el procés d'integració contínua (CI).

## `scripts/ci-sign-manifest.ts`

El propòsit d'aquest script és automatitzar el signat segur del `manifest-<BUILD_ID>.json` abans de publicar l'app al CDN o al servidor.

Característiques clau:
1. **Injecció de BuildId**: Pot calcular i injectar el hash SHA-256 de tot el JSON com a `buildId` (si s'hi passa el flag `--inject`).
2. **Gestió Segura de Claus**: Llegeix la clau privada directament de les variables d'entorn (`SDP_PRIVATE_KEY_SEED`), pensat per utilitzar-se exclusivament amb GitHub Secrets.
3. **Firmant Criptogràfic**: Utilitza `tweetnacl` per a produir la signatura isolada (`detached`) de tipus Ed25519, generant l'arxiu `.sig`.
4. **Neteja Activa**: Al final de l'execució, intenta sobreescriure (zero-out) la memòria de la clau privada (un `best-effort` per evitar fuites de seguretat).

Aquest script tanca el cercle de seguretat junt amb el seu germà, el `ci-verify-manifest.ts`. Un genera la prova d'integritat, l'altre la verifica en un test.

*(El codi font complet està integrat a l'historial de la sessió del Mestre).*


## --- copilot_ci_verify_crypto_tests.md ---
# Tests Criptogràfics (Sense Mocks) per a CI Verify Manifest
*Generat pel Consell dels 11 (Copilot) - Segona Ronda*
*Data: 2026-06-03*

Aquest document guarda la versió definitiva i "hardcore" de la bateria de tests (Jest) per a l'script del CI.

A diferència de la versió anterior, aquests tests **no utilitzen mocks per a la criptografia**. 

## `__tests__/ci-verify-manifest-crypto.test.ts`

Accions que realitza cada test en temps real:
1. Genera un keypair Ed25519 **real** i aleatori amb `tweetnacl`.
2. Construeix una clau pública PEM (amb format SPKI DER) "on the fly".
3. Signa el manifest amb la clau secreta autèntica.
4. Executa la verificació.

Aquesta bateria avalua quatre escenaris sense xarxa de seguretat:
- **Manifest vàlid**: Signatura correcta i assets intactes.
- **Signatura invàlida**: Altera deliberadament un byte de la signatura real per simular un atac. El script falla (Èxit).
- **Asset corrupte**: La signatura és impecable, però l'asset de test ha sigut alterat i no quadra amb el SHA-256. El script falla (Èxit).
- **BuildId manipulat**: El hash genèric del manifest no coincideix amb el `buildId`. El script falla (Èxit).

Aquests tests asseguren que estem protegits contra falsos positius produïts per tests mal dissenyats.

*(El codi font complet està integrat a l'historial de la sessió del Mestre).*


## --- copilot_ci_verify_script.md ---
# Script de CI per a Validació de Manifests
*Generat pel Consell dels 11 (Copilot) - Segona Ronda*
*Data: 2026-06-03*

Aquest document guarda l'script de la "duana" del pipeline de CI. S'executa a GitHub Actions per validar que no s'està intentant pujar una versió corrupta.

## `scripts/ci-verify-manifest.ts`

Accions que realitza l'script per evitar purges accidentals per culpa del servidor:
1. Localitza el `manifest-<BUILD_ID>.json` i la seua firma `.sig`.
2. Calcula el SHA-256 local del manifest i comprova que coincideix amb el `buildId`.
3. Llig la clau pública (`ed25519_public.pem`).
4. Utilitza `tweetnacl` per a fer la validació de la signatura contra el contingut del manifest.
5. **Doble comprovació d'assets**: Itera sobre tots els arxius de `dist/` llistats i calcula el seu SHA-256 en viu per assegurar que cap arxiu de JS, CSS o imatge ha sigut corromput durant la compilació.
6. Torna exit code `2` si alguna cosa falla (bloquejant el CI), i exit code `0` si tot és correcte.

Aquest script serà cridat per GitHub Actions en l'step "Verify manifest and assets".

*(El codi font complet està integrat a l'historial de la sessió del Mestre).*


## --- copilot_ci_verify_tests.md ---
# Tests Unitaris per a CI Verify Manifest
*Generat pel Consell dels 11 (Copilot) - Segona Ronda*
*Data: 2026-06-03*

Aquest document guarda la bateria de tests (Jest + ts-jest) encarregada de provar que el nostre script de validació del CI funciona correctament. Aquests tests són essencials per garantir que el pipeline de desplegament només es trenca quan toca i passa quan tot és legítim.

## `__tests__/ci-verify-manifest.test.ts`

El test avalua tres escenaris crítics:
1. **Manifest vàlid i signat**: Amb assets intactes i els seus SHA-256 coincidents. Resultat: Èxit (`true`).
2. **Firma invàlida (Atac o Error)**: El manifest té una modificació no autoritzada i la signatura Ed25519 es trenca. Resultat: `Error` llançat.
3. **Asset corrupte**: La signatura és vàlida, però un dels fitxers (per exemple, `index.html`) ha canviat el seu contingut (corrupció de disc o injecció maliciosa) i ja no coincideix amb el hash declarat. Resultat: `Error` per *checksum mismatch*.

El codi simula arxius físics en un directori temporal i utilitza `jest.mock` per a `tweetnacl`.

*(El codi font complet està integrat a l'historial de la sessió del Mestre).*


## --- copilot_cloudfront_cookie_injector.md ---
# CloudFront Cookie Injector i Script E2E
*Generat pel Consell dels 11 (Copilot) - Segona Ronda*
*Data: 2026-06-03*

Aquest document guarda la joia de la corona de la usabilitat en entorns QA: **El Cookie Injector (0-clicks)**.

## 1. El Cookie Injector (`create-cookie-injector.ts`)
Aquest script TypeScript agafa les *Signed Cookies* generades al pas anterior, les integra dins d'un HTML inofensiu que farà l'acció de guardar-les al navegador, puja aquest HTML a Amazon S3 amb un nom completament aleatori, i en genera un URL presignat temporal (i si tenim clau, l'escurça amb Bitly). Aquest enllaç es lliura per Telegram i expira ràpidament.

## 2. Injecció al Dashboard (`qa-dashboard.html`)
Un botó integrat al nostre Dashboard que va a buscar l'enllaç generat al punt 1. Amb un sol clic de l'usuari (encara que siga des d'un iPad al mig de la muntanya), el navegador obri el *short link*, s'injecta les galetes de CloudFront sense que l'usuari veja res tècnic, i el redirigeix a l'aplicació de proves. UX en estat pur.

## 3. L'Orquestració en GitHub Actions
La part del codi `.yml` encarregada d'executar aquest script, crear l'artefacte en GitHub i enviar el missatge privat, pulcre i concís al Telegram dels administradors amb el *Short Link* en un lloc privilegiat.

*(Els fragments de codi font complets estan guardats a l'historial de la sessió del Mestre).*


## --- copilot_cloudfront_signed_cookies.md ---
# CloudFront Signed Cookies per a Canary Deployments
*Generat pel Consell dels 11 (Copilot) - Segona Ronda*
*Data: 2026-06-03*

Aquest document guarda la infraestructura de seguretat avançada per als entorns de proves.

## 1. Generador de *Signed Cookies*
L'arxiu `scripts/generate-cloudfront-signed-cookies.js` crea galetes criptogràficament signades amb RSA-SHA1 usant la clau privada (PEM) configurada al núvol d'AWS de Sóc de Poble. Aquestes galetes tenen un temps de vida molt curt i permeten, temporalment, entrar al directori `/canary/` de l'aplicació saltant-se les restriccions públiques de CloudFront.

## 2. Orquestració en GitHub Actions
El *Job* s'encarrega d'executar l'script anterior després de compilar, demanar-li al *runner* la clau privada, emetre el fitxer `signed-cookies.json` i esborrar immediatament la clau privada de la màquina (`shred -u keys/cloudfront_private.pem`).

## 3. Lliurament a l'Equip de Qualitat (QA)
S'utilitza novament el bot de Telegram de l'ajuntament per enviar de forma privada, directament al canal dels testers, les instruccions en JavaScript i els paràmetres de la *cookie* per poder entrar a provar la versió sense connexió de la PWA del poble.

*(El codi font complet està guardat en l'historial de la sessió del Mestre).*


## --- copilot_e2e_puppeteer_js.md ---
# Snippet DOM i Script Puppeteer (JavaScript)
*Generat pel Consell dels 11 (Copilot) - Segona Ronda*
*Data: 2026-06-03*

Aquest document guarda la implementació física de la interacció entre l'App Shell i l'entorn de proves de Puppeteer.

## 1. Snippet per a l'`index.html`
S'ha generat un codi HTML/JS mínim i segur (inofensiu) que crea un `div` absolut (`#sdp-e2e-indicator`) on l'aplicació va bolcant el seu estat:
- `boot`
- `offline-fallback`
- `purge-done`
- `manifest-applied`

Açò evita haver de fer *hacks* en Puppeteer per adivinar l'estat intern de l'aplicació.

## 2. Script de Puppeteer (Versió Node JS)
L'arxiu `e2e/run-pwa-ipad-offline.js` fa la simulació tàctica:
- Emula l'iPad Pro.
- Llig el `BUILD_ID.txt`.
- Talla la xarxa des del protocol Chrome DevTools (CDP).
- Envia el senyal `NUCLEAR_PURGE`.
- Llig el `div` (snippet anterior) esperant que canvie a `purge-done` o `offline-fallback`.
- Torna la xarxa i s'assegura que el Service Worker segueix controlant la pàgina.

*(El codi font està a l'historial de la sessió del Mestre).*


## --- copilot_e2e_puppeteer_telegram.md ---
# Tests E2E (iPad + Offline) i Notificació a Telegram
*Generat pel Consell dels 11 (Copilot) - Segona Ronda*
*Data: 2026-06-03*

Aquest document guarda l'epíleg operatiu del pipeline: com provem que tota l'arquitectura funciona abans d'ensenyar-la als usuaris reals.

## 1. Puppeteer (Simulació iPad i Desconnexió)
L'script `e2e/pwa-ipad-offline.test.ts` fa literalment màgia negra:
- Arranca una instància de Chromium en mode *headless*.
- Emula les dimensions i l'User-Agent d'un iPad Pro.
- Carrega l'aplicació i verifica que el Service Worker s'instal·la correctament.
- **Talla la connexió a internet** (simulant el mode avió o pèrdua de cobertura a la muntanya) usant el protocol CDP (`Network.emulateNetworkConditions`).
- Envia el senyal extrem `NUCLEAR_PURGE` per a comprovar si el *Maintenance Worker* l'intercepta i neteja la memòria.
- Comprova que la interfície s'ha degradat amb gràcia (indicador offline).
- Torna a connectar la xarxa i verifica la recuperació.

## 2. Notificacions a Telegram
L'script `scripts/notify-telegram.ts` s'executa només al final. Pren el hash `buildId`, el resultat dels tests i la signatura de la clau, i utilitza un bot de Telegram per avisar als administradors: *"Canari desplegat i testejat. Llest per a moure a Producció."*

*(Els scripts complets estan guardats en l'historial de la sessió del Mestre).*


## --- copilot_github_actions_workflow.md ---
# Workflow de GitHub Actions (Canary & Prod)
*Generat pel Consell dels 11 (Copilot) - Segona Ronda*
*Data: 2026-06-03*

Aquest document guarda l'orquestració mestra del CI/CD de "Sóc de Poble". És l'esquema `.github/workflows/release-canary.yml`.

## Punts Clau del Pipeline:
1. **Compilació**: Llença `npm run build` i genera l'App Shell i el manifest.
2. **Generació d'ID**: Calcula el hash de l'estructura base i escriu el `BUILD_ID.txt` per bloquejar-lo.
3. **Firmant Criptogràfic**: Executa el nostre estimat `ci-sign-manifest.ts`, injectant la clau privada guardada com a Secret de GitHub. Aquesta clau no toca el disc, sinó que es passa per variable d'entorn i s'esborra immediatament.
4. **Verificador**: Abans de pujar res enlloc, s'auto-avalua. S'executa `ci-verify-manifest.ts` de forma local dins del *runner* per assegurar que el pas anterior ha anat bé i que els assets són correctes.
5. **Desplegament Canari**: Si tot quadra, puja els arxius (firmats) a un directori de proves (Canary) al servidor (ex. `canary/<BUILD_ID>`), ideal per testejar-ho en un sol iPad del poble.
6. **Entorn de Producció**: El desplegament a producció es queda aturat esperant una aprovació manual (botó verd) d'un administrador.

*(El codi YML complet es troba guardat a l'historial de la sessió del Mestre).*


## --- copilot_indexeddb_module.md ---
# Mòdul de Detecció Robusta (IndexedDB i Circuit Breaker)
*Generat pel Consell dels 11 (Copilot) - Segona Ronda*
*Data: 2026-06-03*

Aquest document guarda el mòdul aïllat i reutilitzable per a detectar "hangs" d'IndexedDB (bug de Safari) abans que bloquegen l'aplicació sencer.

## `src/lib/indexeddb-detect.js`

El mòdul exporta les funcions clau per gestionar el Circuit Breaker:
- `detectIndexedDBUsable({ timeoutMs, retries, backoffMs, preferWASQLite })`
- `isCircuitBreakerOpen()`
- `tripCircuitBreaker(ttlMs)`
- `clearCircuitBreaker()`

```javascript
// Aquest mòdul intenta obrir una base de dades temporal 'sdp-detect-db'.
// Si Safari no respon ni amb "onsuccess" ni amb "onerror" dins del timeout (300ms),
// es considera "hang", s'aborta, i es dispara el Circuit Breaker al localStorage.

export async function detectIndexedDBUsable(options = {}) {
  // 1. Revisa si el Circuit Breaker està obert
  // 2. Si wa-sqlite està preferit i disponible, s'escapa i retorna true
  // 3. Intenta obrir IndexedDB amb backoff (re-intents)
  // 4. Dispara el Circuit Breaker si tot falla
}

function _attemptIndexedDBOpen() {
  // Lògica interna bruta que emula la promesa amb setTimeout
}
```

Aquest mòdul és una peça mestra d'enginyeria per a aplicacions PWA en entorns iOS inestables.


## --- copilot_indexeddb_tests.md ---
# Tests d'Estrès per a l'IndexedDB i el Circuit Breaker
*Generat pel Consell dels 11 (Copilot) - Segona Ronda*
*Data: 2026-06-03*

Aquests tests validen el comportament de l'arquitectura quan Safari en "Private Mode" congela (hang) qualsevol petició a IndexedDB.

## `__tests__/indexeddb-circuitbreaker.test.js`

El test utilitza un helper `mockIndexedDBHang()` que simula exactament el bug de WebKit: una promesa o request que mai resol ni retorna error, quedant-se penjada a l'infinit.

S'utilitza una lògica de `detectIndexedDBUsable(150)` amb timeout per a forçar l'obertura del Circuit Breaker i verificar que l'aplicació fa fallback de `wa-sqlite` a emmagatzemament en memòria o localStorage sense bloquejar el fil principal.

```javascript
describe('IndexedDB hang -> Circuit Breaker -> fallback', () => {
  // 1. Simula que l'IndexedDB penja el sistema
  test('cuando IndexedDB cuelga, detectIndexedDBUsable devuelve false y Circuit Breaker se abre', async () => { ... });

  // 2. Comprova que el bootstrapSW llig l'estat del CB
  test('bootstrapSW respeta Circuit Breaker abierto y evita operaciones pesadas; usa fallback localStorage', async () => { ... });

  // 3. Simula una fallida intermitent amb successos exponencials
  test('si IndexedDB falla intermitentemente, el sistema reintenta y finalmente abre Circuit Breaker tras N fallos', async () => { ... });
});
```

*(El codi font complet està integrat a l'historial de la sessió del Mestre).*


## --- copilot_jest_tests.md ---
# Tests Unitaris (Jest) per al Flux de Purga Nuclear
*Generat pel Consell dels 11 (Copilot) - Segona Ronda*
*Data: 2026-06-03*

Aquest document guarda els tests unitaris Jest proposats per Copilot per a validar el flux de registre del SW i la verificació Ed25519.

## sw-flow.test.js
El test emula un entorn `jsdom` i fa "mock" d'elements clau del navegador (`fetch`, `navigator.serviceWorker`, `window.waSQLite`, `crypto.subtle`, i `localStorage`).

```javascript
import { jest } from '@jest/globals';
import { bootstrapSW } from '../src/sw-register-and-verify.js';

// Helpers
const BUILD_ID = 'deadbeefbuildid';
const manifestObj = { ... };
const manifestText = JSON.stringify(manifestObj);
const sigHex = 'aa'.repeat(64);

describe('SW register & verify flow', () => {
  // [Mocks massius de WebCrypto, ServiceWorker, Fetch, LocalStorage i waSQLite]
  
  test('manifest válido -> verifica firma, guarda activeManifest y orquesta NUCLEAR_PURGE', async () => {
    // Simula resposta vàlida de la firma criptogràfica
    // Verifica que crida a INSERT OR REPLACE de wa-sqlite
    // Assegura que el maintenance SW rep el postMessage de NUCLEAR_PURGE
  });

  test('manifest con firma inválida -> rechaza y no orquesta purge', async () => {
    // Simula firma invàlida
    // Verifica que no s'insereix res a wa-sqlite i s'avorta la purga
  });

  test('circuit breaker abierto -> no intentar verificación Ed25519', async () => {
    // Simula Circuit Breaker actiu al localStorage
    // Comprova que no es fa cap operació criptogràfica costosa
  });

  test('wa-sqlite falla -> fallback a localStorage para activeManifest', async () => {
    // Força una fallida del wa-sqlite.exec
    // Verifica que s'escriu al localStorage com a fallback
  });
});
```


## --- copilot_playwright_video_and_nginx.md ---
# Configuració de Vídeo Playwright i Nginx per a Sóc de Poble
*Generat pel Consell dels 11 (Copilot) - Segona Ronda*
*Data: 2026-06-03*

Aquest document guarda la configuració de nivell expert per a la depuració i la seguretat del projecte.

## 1. Vídeo E2E (Playwright)
Hem recollit la configuració `video: 'retain-on-failure'` del fitxer `playwright.config.ts`. Això significa que si una prova E2E a l'iPad simulat falla en GitHub Actions, es guardarà l'MP4 automàticament com a *artifact*, però si funciona bé, s'esborrarà per no consumir emmagatzematge.

## 2. Seguretat del Dashboard (Nginx)
Com que el Dashboard QA és un arxiu HTML totalment auditable que dóna accés a informació sensible de *builds*, Copilot ens ha proporcionat el snippet d'Nginx i `htpasswd` per restringir l'accés públic al prefix `/canary/`. Ningú fora de l'ajuntament o de l'equip de desenvolupament podrà veure com va el test.

*(El codi d'ambdós sistemes està guardat a l'historial de la sessió del Mestre).*


## --- copilot_puppeteer_ts_and_checklist.md ---
# Tests Puppeteer en TypeScript i Checklist de Qualitat
*Generat pel Consell dels 11 (Copilot) - Segona Ronda*
*Data: 2026-06-03*

Aquest document guarda la versió final i elegant de les proves de validació *offline*.

## 1. Script Puppeteer TypeScript (`run-pwa-ipad-offline.ts`)
La versió definitiva del test que utilitza el pont de DOM de l'App Shell. 
Executat des del CI a través de `ts-node` (ràpid i sense haver de pre-compilar a `.js` si no volem). 
Comprova remotament el `BUILD_ID.txt`, simula la caiguda de xarxa, envia l'ordre de `NUCLEAR_PURGE` i llig del `#sdp-e2e-indicator` si la confirmació *purge-done* ha ocorregut abans de restablir la connexió.

## 2. Configs (package.json i tsconfig)
L'estructura mínima indispensable per fer rodar açò dins d'un *runner* de GitHub Actions. S'hi inclou el `ts-node` per la seua agilitat.

## 3. Checklist Manual de QA
Un document mestre. Pas a pas com validar el desplegament canari abans d'aprovar el pas a Producció. Detalla com comprovar des del DevTools que el `BUILD_ID` coincideix i com forçar una *Nuclear Purge* des de la consola manualment: `navigator.serviceWorker.controller.postMessage({ action: 'NUCLEAR_PURGE' })`.

*(El codi font està guardat a l'historial de la sessió del Mestre).*


## --- copilot_qa_dashboard_and_playwright.md ---
# QA Dashboard HTML i Playwright E2E
*Generat pel Consell dels 11 (Copilot) - Segona Ronda*
*Data: 2026-06-03*

Aquest document consolida dues de les grans millores finals del projecte.

## 1. Canary QA Dashboard (`qa-dashboard.html`)
Un xicotet fitxer HTML completament estàtic (sense dependències de React ni compilacions extres) que permet als administradors i tècnics QA validar l'estat d'un desplegament "canari" de manera visual. Llig el `BUILD_ID`, la signatura i fa de quadre de comandaments per entendre com s'està comportant l'App Shell i el Service Worker. Un luxe de simplicitat i "Trellat".

## 2. Playwright E2E Test (`pwa-ipad-offline.spec.ts`)
L'evolució natural del test anterior de Puppeteer. Playwright és superior per a emular dispositius Apple i gestionar xarxes. El test:
- Llança el context del navegador simulant un iPad Pro.
- Simula la caiguda offline a nivell de navegador sencer (molt més fidel que CDP manual).
- Comprova l'avís de contingut en memòria intermèdia (caché).
- Llença la descàrrega `NUCLEAR_PURGE`.
- Comprova la neteja en calent mitjançant l'indicador DOM de la UI.

*(El codi d'aquests fitxers està guardat a l'historial de la sessió del Mestre).*


## --- copilot_sw_register.md ---
# Codi Client de Registre SW i Verificació Ed25519 (Copilot)
*Generat pel Consell dels 11 - Segona Ronda*
*Data: 2026-06-03*

Aquest document guarda l'script de registre robust generat per Copilot, que tanca el cercle de seguretat en el client abans de la Purga Nuclear.

## sw-register-and-verify.js

Aquest mòdul integra:
- Registre del `maintenance-sw` i `service-worker`.
- Descàrrega del `manifest-<BUILD_ID>.json` i la seua signatura `.sig`.
- Verificació criptogràfica (Ed25519 via WebCrypto o TweetNaCl).
- Comparació amb `activeManifest` a `wa-sqlite`.
- Orquestració del `NUCLEAR_PURGE` via `maintenance-sw`.

```javascript
// ----------------------------- Configuración -----------------------------
const PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
...TU_CLAVE_PUBLICA_ED25519_EN_PEM...
-----END PUBLIC KEY-----`;

const FETCH_TIMEOUT_MS = 4000;
const FETCH_RETRIES = 2;
const BUILDID_FETCH_PATH = '/BUILD_ID.txt';
const MANIFEST_BASE_PATH = '/'; 
const CIRCUIT_BREAKER_KEY = '__sdp_indexeddb_cb__';
const CIRCUIT_BREAKER_TTL_MS = 5 * 60 * 1000; 

// [Utilitats de Fetch, Hex, PEM, SHA256 amagades ací per brevetat]

// ----------------------------- Verificador Ed25519 (WebCrypto + TweetNaCl fallback) -----------------------------
async function verifyEd25519(manifestString, sigHex, publicKeyPem) {
  const manifestBytes = new TextEncoder().encode(manifestString);
  const sigBytes = hexToUint8(sigHex);

  // Try WebCrypto import/verify
  try {
    const spki = pemToRaw(publicKeyPem);
    let key = null;
    try {
      key = await crypto.subtle.importKey('spki', spki.buffer, { name: 'Ed25519' }, false, ['verify']);
    } catch (e) {
      try {
        key = await crypto.subtle.importKey('raw', spki.buffer, { name: 'Ed25519' }, false, ['verify']);
      } catch (e2) {
        key = null;
      }
    }
    if (key) {
      const ok = await crypto.subtle.verify({ name: 'Ed25519' }, key, sigBytes.buffer, manifestBytes.buffer);
      if (ok) return true;
    }
  } catch (e) {}

  // Fallback: TweetNaCl
  if (typeof nacl !== 'undefined' && nacl.sign && nacl.sign.detached) {
    try {
      const spki = pemToRaw(publicKeyPem);
      const pubRaw = spki.slice(-32); 
      return nacl.sign.detached.verify(manifestBytes, sigBytes, pubRaw);
    } catch (e) {
      return false;
    }
  }
  throw new Error('No usable Ed25519 verifier available');
}

// ----------------------------- Orquestador principal -----------------------------
export async function bootstrapSW({ maintenanceSw = '/maintenance-sw.js', sw = '/service-worker.js', publicKeyPem = PUBLIC_KEY_PEM } = {}) {
  // [Codi d'orquestració massiu. Llig el manifest, verifica firma, i crida a NUCLEAR_PURGE si hi ha discrepància]
  // ... (Veure log complet a la conversa per al codi d'implementació exacte)
}
```


## --- copilot_telegram_botfather_dom.md ---
# Setup de Telegram (BotFather) i Interfície DOM per a E2E
*Generat pel Consell dels 11 (Copilot) - Segona Ronda*
*Data: 2026-06-03*

Aquest document guarda eines operatives vitals per a implementar la infraestructura dissenyada.

## 1. Telegram BotFather
Instruccions de creació ràpida:
1. Buscar `@BotFather` a Telegram.
2. `/newbot`
3. Nom: `Sóc de Poble Canary Bot`
4. Username: `SdpCanaryBot` (exemple).
5. Copiar el `TELEGRAM_BOT_TOKEN` als GitHub Secrets.
6. Usar l'API de Telegram localment per extraure el `TELEGRAM_CHAT_ID`.

## 2. Indicador DOM per a Puppeteer
L'App Shell (`index.html`) ha d'incloure un petit script inofensiu que crea un `div` invisible (`#sdp-e2e-indicator`).
Aquest element exposa visualment (i a nivell de DOM per a Puppeteer) l'estat intern de l'aplicació (`online`, `offline-fallback`, `purge-done`, etc.).
Això permet que l'script de Puppeteer (del pas anterior) no haja d'endevinar l'estat de l'aplicació mirant missatges obscurs de xarxa, sinó llegint directament l'estat d'aquest element DOM. És un pont de comunicació brillant entre l'App de React/Vanilla i el test E2E.

*(El codi HTML/JS complet està a l'historial de la sessió del Mestre).*


## --- copilot_verify_manifest.md ---
# Verificació de Signatura del Manifest (Ed25519)
*Generat pel Consell dels 11 (Copilot) - Segona Ronda*
*Data: 2026-06-03*

Aquest document conté el mòdul responsable de validar criptogràficament que el manifest descarregat és autèntic i no ha patit corrupció en el trànsit, evitant una execució fraudulenta o accidental de la Purga Nuclear.

## `src/lib/verify-manifest.ts`

El mòdul exporta `verifyManifestSignature` que executa la següent validació dual:
1. **Verificació WebCrypto (Ed25519)**: Utilitza les APIs natives del navegador per a un rendiment òptim.
2. **Fallback TweetNaCl**: Si el navegador objectiu no suporta `spki` per a Ed25519 o falla la importació (freqüent en versions antigues d'iOS/Safari), cau a l'execució en client de `nacl.sign.detached.verify`.
3. **Validació del Hash**: Calcula el SHA-256 del manifest sencer i el compara en temps constant (constant-time equal per evitar atacs per observació) amb el `buildId` inclòs.

S'acompanya dels corresponents tests de Jest (`__tests__/verify-manifest.test.ts`) que es poden executar en el CI/CD.

*(El codi font complet està integrat a l'historial de la sessió del Mestre).*


## --- informe_escut_vall.md ---
# 🛡️ Informe de Situació: L'Escut de la Vall (CI/CD i Resiliència)

## Context i Assoliments

Gràcies a la darrera ronda d'optimitzacions amb la IA (Copilot), hem construït una cuirassa impenetrable per al cicle de vida de l'aplicació "Sóc de Poble", assegurant que cap línia de codi arribe als dispositius rurals si no està al 100% lliure d'errors de connexió. Aquesta arquitectura s'ha batejat com **L'Escut de la Vall**.

Hem integrat les següents peces de nivell corporatiu:

### 1. Entorn "Canari" de Proves
S'ha creat un pipeline (`.github/workflows/release-canary-full.yml`) que, davant de qualsevol canvi a la branca `main`, desplega l'aplicació a un *bucket* S3 separat (`/canary/BUILD_ID`). Això permet als tècnics testar l'aplicació sense risc d'afectar els usuaris reals.

### 2. Signatura Criptogràfica (Ed25519)
Hem eliminat qualsevol possibilitat d'enverinament (Cache Poisoning) mitjançant la injecció criptogràfica:
- Generem els manifests signats via `scripts/ci-sign-manifest.ts`.
- Els verifiquem estrictament abans de permetre el pas a producció via `scripts/ci-verify-manifest.ts`.

### 3. Proves E2E "Offline" (Playwright)
Un robot automàtic simula ser un usuari amb un iPad Pro a cada compilació. 
- Aquest script (`pwa-ipad-offline.spec.ts`) atura en sec la connexió de xarxa.
- Intenta carregar recursos externs per verificar l'avís de cau (caché).
- Llança el comandament de purga (`NUCLEAR_PURGE`) per garantir que la PWA és capaç de netejar-se i curar-se tota sola.
- Si falla, s'enregistra automàticament un **vídeo de l'iPad virtual** per a la depuració matutina.

### 4. Seguretat d'Accés per a QA (Dashboard 0-clicks)
L'entorn "canari" de proves està tancat al públic mitjançant regles de seguretat.
Hem dissenyat un sistema en què el CI genera i signa *CloudFront Cookies*, creant un *Short Link* encriptat. Aquest enllaç arriba directament al Telegram dels administradors, de forma que amb un sol clic (`qa-dashboard.html`) es configuren les galetes de xarxa automàticament sense haver de tocar el codi, permetent testar la PWA de manera fluïda i segura.


> [!TIP]
> Tota la informació tècnica, així com els diferents codis, han estat arxivats a la memòria a llarg termini de l'IAIA per si requerim fer-ne ús o consultar algun patró. Totes les defenses de "Sóc de Poble" estan documentades.


## Passos Següents (Auditoria)

Com bé has assenyalat, la implementació tàctica s'ha assolit, però cap sistema està mai al 100%. Cal auditar l'entorn de desenvolupament (`localhost`) i posar l'accent en l'usuari final:
1. **Auditoria SEO i de Velocitat (Lighthouse):** Veure les Core Web Vitals reals (LCP, CLS, etc.).
2. **Accessibilitat (A11Y):** Comprovar contrast, lectors de pantalla i zones tàctils.
3. **Memòria (Memory Leaks):** Comprovar que l'aplicació no col·lapse la RAM d'un iPad antic en mode offline.


## --- perplex_backend_endpoint.md ---
# Backend API: PowerSync Upload Endpoint & ACID Transactions
*Generat pel Consell dels 11 (Perplexity) - Segona Ronda*
*Data: 2026-06-03*

Aquest document guarda l'esquema de backend dissenyat per rebre les dades des de l'iPad de forma segura utilitzant PostgreSQL.

## `src/routes/powersync/upload.ts`
Endpoint `/api/powersync/upload` que processa les dades enviades pel `PowerSyncConnector`.
Aplica **Transaccions ACID** de Postgres: Processa totes les operacions d'un batch dins d'un `BEGIN` i `COMMIT`, de manera que si l'esquema falla, es fa `ROLLBACK`.
Utilitza **Zod** per a la validació d'esquemes i previndre injeccions.

## `src/migrations/001-create-tables.sql`
Esquema de PostgreSQL amb suport de dades "schemaless" de PowerSync.
Inclou **Row Level Security (RLS)** per assegurar que els usuaris només poden escriure els seus propis posts, i triggers per actualitzar la data `updated_at`.

## `src/utils/conflictResolver.ts`
Implementa una estratègia de **Last-Write-Wins** combinada amb una alarma de **Dades Antigues** (Stale Data > 7 dies).
- Si client > servidor: El client guanya (Sobrescriptura).
- Si client < servidor: El servidor guanya (S'ignora l'enviament local).
- Si client > 7 dies: S'envia a una cua de revisió manual (`conflict_log`).

*(El codi font complet està integrat a l'historial de la sessió del Mestre).*


## --- perplex_cicd_pipeline.md ---
# CI/CD Pipeline: Desplegament i Auto-rollback
*Generat pel Consell dels 11 (Perplexity) - Segona Ronda*
*Data: 2026-06-03*

Aquest document guarda la infraestructura de desplegament continu (CI/CD) creada per protegir el codi en producció de qualsevol error en la resolució de conflictes de PowerSync.

## Estructura generada:
1. **`.github/workflows/ci.yml`**: Orquestrador principal.
   - Alça un contenidor de PostgreSQL en Docker.
   - Executa els tests d'integració i resolució de conflictes.
   - **Bloqueig estricte**: Si qualsevol test de conflicte cau, la pujada a producció es bloqueja automàticament.
   - Avisa per Slack de l'èxit o el fracàs.

2. **`.github/workflows/rollback.yml`**: Sistema d'emergència que detecta si l'entorn de producció falla després del desplegament i fa un `git checkout` automàtic a la versió anterior.

3. **`Makefile`**: Proporciona comandes ràpides per a que els desenvolupadors puguen executar `make docker-up` i `make test-conflict` al seu ordinador.

4. **Plantilles (PR i Bugs)**: Templates per estandarditzar el control de qualitat al repositori de Sóc de Poble.

*(El codi font complet està integrat a l'historial de la sessió del Mestre).*


## --- perplex_conflict_monitoring.md ---
# Monitoratge de Conflictes en Temps Real
*Generat pel Consell dels 11 (Perplexity) - Segona Ronda*
*Data: 2026-06-03*

Aquest document recull la solució completa de monitoratge dissenyada per rastrejar i alertar sobre problemes de sincronització a "Sóc de Poble" (arquitectura offline-first amb PowerSync).

## Components del Sistema
1. **`ConflictMonitor` (Service)**: Nucli del sistema que s'executa contínuament. Detecta cinc anomalies crítiques:
   - *Stale data* (dades de més de 7 dies aïllades).
   - Col·lisions simultànies.
   - Modificacions sobre registres ja eliminats.
   - Desfases horaris (Clock Skew) d'iPads.
   - Tasa de fallada alta.
2. **Cronjob Webhook (`conflictWebhook.ts`)**: S'encarrega d'agafar les alertes de la base de dades i enviar notificacions enriquides (amb colors segons severitat i botons d'acció) a un canal de Slack. També envia un resum diari.
3. **Rutes API i Dashboard (`dashboard.html`)**: Un panell de control lleuger amb `Chart.js` per a visualitzar de forma global les mètriques dels conflictes (pendents, severitat, etc.) i poder prendre accions de resolució manual en un sol clic.
4. **Taules SQL**: `alert_log`, `conflict_resolution_log` i `sync_metrics_daily` per a traçabilitat històrica.

*(El codi font complet està integrat a l'historial de la sessió del Mestre).*


## --- perplex_conflict_tests.md ---
# Tests d'Integració: Resolució de Conflictes al Servidor
*Generat pel Consell dels 11 (Perplexity) - Segona Ronda*
*Data: 2026-06-03*

Aquest document guarda la suite de tests automatitzats per garantir que l'estratègia de resolució de conflictes (Last-Write-Wins + Stale Data) del servidor funciona correctament amb una base de dades real de PostgreSQL.

## `tests/integration/powerSyncConflict.test.ts`

El test utilitza `supertest` per atacar directament a l'endpoint de l'API de càrrega (`/api/powersync/upload`) i comprova com actua el servidor en 10 escenaris límit:

1. **Last-Write-Wins (Server Wins)**: S'ignora l'enviament local si les dades remotes són més recents.
2. **Last-Write-Wins (Client Wins)**: El servidor fa cas al client si les dades són més recents.
3. **Stale Data (10 dies)**: Si l'usuari ha estat 10 dies sense cobertura, l'actualització es bloqueja i s'envia al `conflict_log` per a revisió manual.
4. **Col·lisió Simultània**: Dos clients actualitzen a l'hora, gestionant la carrera.
5. **Soft Delete Conflict**: Intentar actualitzar un post ja eliminat no reverteix la decisió.
6. **Merge de múltiples camps**: Diferents columnes alterades es mesclen correctament (PATCH parcial).
7. **Idempotència i Clock Skew**: Tanca forats de seguretat en cas d'errors en el rellotge de l'iPad.

S'acompanya de configuracions de `docker-compose.test.yml` per a instanciar la base de dades.

*(El codi font complet està integrat a l'historial de la sessió del Mestre).*


## --- perplex_integracio_total.md ---
# Codi d'Integració Completa (Perplexity)
*Generat pel Consell dels 11 - Segona Ronda*
*Data: 2026-06-03*

Aquest document guarda l'arquitectura completa generada per Perplexity per a la persistència i sincronització rural.

## 1. lib/storageVFS.ts
```typescript
import * as SQLite from '@journeyapps/wa-sqlite';
import { VFS } from '@journeyapps/wa-sqlite/src/vfs.js';
import { IDBVFS } from '@journeyapps/wa-sqlite/src/IDBVFS.js';
import { MemoryVFS } from '@journeyapps/wa-sqlite/src/MemoryVFS.js';

const DB_NAME = 'socdepoble.db';
const CIRCUIT_BREAKER_TIMEOUT = 300; 

export class RobustIDBVFS extends IDBVFS {
  private isPrivateMode = false;
  private initAttempts = 0;
  private readonly MAX_INIT_ATTEMPTS = 2;

  async initialize(): Promise<void> {
    this.initAttempts++;
    try {
      const initPromise = super.initialize();
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('IDBVFS init timeout')), CIRCUIT_BREAKER_TIMEOUT)
      );
      await Promise.race([initPromise, timeoutPromise]);
      this.isPrivateMode = false;
    } catch (err) {
      this.initAttempts++;
      if (this.initAttempts >= this.MAX_INIT_ATTEMPTS) {
        this.isPrivateMode = true;
        throw new PrivateModeDetectedError();
      }
      return this.initialize();
    }
  }
}

export class PrivateModeDetectedError extends Error {
  constructor() {
    super('Safari Private Mode detected');
    this.name = 'PrivateModeDetectedError';
  }
}

export class StorageVFSManager {
  private static instance: StorageVFSManager;
  private vfs: VFS | null = null;
  private db: SQLite.SQLite3DB | null = null;
  private currentVFSType: 'idb' | 'memory' = 'idb';
  private initialized = false;

  static async getInstance(): Promise<StorageVFSManager> {
    if (!StorageVFSManager.instance) {
      StorageVFSManager.instance = new StorageVFSManager();
    }
    return StorageVFSManager.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    try {
      const idbVFS = new RobustIDBVFS();
      await idbVFS.initialize();
      this.vfs = idbVFS;
      this.currentVFSType = 'idb';
      this.db = new SQLite.SQLite3DB(this.vfs);
      await this.initializeSchema();
      this.initialized = true;
    } catch (err) {
      if (err instanceof PrivateModeDetectedError) {
        const memoryVFS = new MemoryVFS();
        await memoryVFS.initialize();
        this.vfs = memoryVFS;
        this.currentVFSType = 'memory';
        this.db = new SQLite.SQLite3DB(this.vfs);
        await this.initializeSchema();
        this.initialized = true;
      } else {
        throw err;
      }
    }
  }

  private async initializeSchema(): Promise<void> {
    // ... schema definition ...
  }
}

export const storageVFS = {
  async initialize() {
    const manager = await StorageVFSManager.getInstance();
    return manager.initialize();
  }
};
```

## 2. lib/syncQueue.ts
Implementa Exponential Backoff + Jitter per a xarxes rurals.

## 3. sw.js
Service Worker de Purga Nuclear Unificat.

## 4. utils/serviceWorkerManager.ts
Gestor de SW des del client amb Circuit Breaker de 300ms i Purga Nuclear des del client.

## 5. hooks/useRuralSync.ts & components/SyncStatus.tsx
Hook de React i Component d'UI per a mostrar l'estat de la sincronització rural.


## --- perplex_powersync_integration.md ---
# Integració Completa: RuralSyncQueue + PowerSync SDK
*Generat pel Consell dels 11 (Perplexity) - Segona Ronda*
*Data: 2026-06-03*

Aquest document detalla la integració del SDK de PowerSync per a mantenir la filosofia **Local Truth First** amb el backoff exponencial per a xarxes rurals.

## 1. lib/PowerSyncConnector.ts
Connector personalitzat que intercepta l'`uploadData` de PowerSync.
Aplica el "Exponential Backoff con Jitter" abans de notificar un error o reintentar la pujada a l'endpoint backend.

```typescript
export class SocDePobleConnector extends PowerSyncBackendConnector {
  // ...
  async uploadData(database: PowerSyncDatabase): Promise<void> {
    // Intercepta CRUD transactions i les envia a /api/powersync/upload
    // Implementa exponencial backoff si falla (red inestable)
  }
}
```

## 2. lib/powersync.ts
Inicialitzador de PowerSync utilitzant `WASQLiteOpenFactory` i el `OPFSCoopSyncVFS` (vital per a compatibilitat amb Safari multi-tab i el bug de IndexedDB).

## 3. lib/AppSchema.ts
Esquema de wa-sqlite gestionat per PowerSync. Defineix taules vitals com `posts`, `users`, `villages` i `sync_errors`. 

## 4. hooks/usePowerSyncCRUD.ts
Hook React que assegura el Local Truth First:
- `createPost`: `INSERT INTO posts` directe a wa-sqlite (instantani).
- `watchPosts`: Observa canvis locals i remots via query reactiva de PowerSync.

## 5. components/LocalTruthFirstEditor.tsx
Component UI que permet l'escriptura offline immediata i mostra l'estat d'errors del "Rural Sync" donant opció al reintent manual en cas d'estar encallat pel backoff.

## 6. hooks/useRuralSyncWithPowerSync.ts & components/SyncStatusWithPowerSync.tsx
Uneixen l'estat intern del PowerSync (`_powersync_sync_status`) amb l'estat de la cua manual de `RuralSyncQueue` per donar al Mestre una visibilitat total (i tranquil·litat mental) sobre l'estat de la xarxa al poble.


## --- perplex_scaling_blindaje.md ---
# Estratègies d'Escalat i Optimització (Anti Thundering Herd)
*Generat pel Consell dels 11 (Perplexity) - Segona Ronda*
*Data: 2026-06-03*

Aquest document guarda el "Blindatge Definitiu" de l'arquitectura de Sóc de Poble. Resol el problema de què passa quan un poble sencer recupera la cobertura d'internet de colp i centenars d'iPads intenten sincronitzar (Pujar/Baixar dades) al mateix temps.

## Tècniques de Supervivència implementades:
1. **PostgreSQL Partitioning**: Particionat per rangs de dates (més) per a la taula de `posts` i de logs, evitant el col·lapse de les taules mastodòntiques.
2. **Índexs BRIN (Block Range Indexes)**: Ocupen un 90% menys d'espai que els B-tree i són perfectes per a les cerques *time-series* com les que fa PowerSync per a sincronitzar l'històric recent.
3. **Paginació per Cursor (No OFFSET)**: Substitució de l'`OFFSET` (que es degrada amb O(N)) per consultes per cursor `created_at + id` que mantenen temps de resposta constants de 20ms independentment del volum.
4. **PgBouncer (Transaction Pooling)**: Múltiplexor de connexions que permet que milers de peticions concurrents de PowerSync no rebenten les connexions físiques del PostgreSQL, reutilitzant un pool menut (ex. 100 connexions reals per a 1000 lògiques).
5. **Redis Caching & Rate Limiting**: Capa de caché i límit de peticions que actua com a dic de contenció abans que el tràfic xoque contra la base de dades, interceptant el "Thundering Herd".
6. **Manteniment Automatitzat (Cronjobs)**: Scripts automatitzats per a particionar, reconstruir índexs (REINDEX) i netejar brossa periòdicament sense intervenció manual.

*(El codi font i la configuració de Docker Compose estan integrats a l'historial de la sessió del Mestre).*


