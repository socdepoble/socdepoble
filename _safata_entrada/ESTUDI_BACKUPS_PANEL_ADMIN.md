# 🛡️ ESTUDI D'IMPLEMENTACIÓ DE BACKUPS (Tauler SuperAdministrador)

Aquest estudi respon a la instrucció activa del Còdex per a prevenir futurs desastres en producció (com el rollback crític manual que s'exigeix en aquesta mateixa sessió). L'objectiu és oferir la tranquil·litat equivalent a la d'un plugin clàssic de WordPress directament des de l'arquitectura desconnectada/híbrida de *Sóc de Poble* (SiteGround + Supabase).

## 1. Estat Real de les Capes d'Infraestructura

*Sóc de Poble* té dos cors de dades. Cada cor té el seu propi sistema de seguretat natiu que podem o no consumir des del codi.

### A. La Capa de Frontend i Assets (SiteGround)
- **Què guarda:** El codi minificat (`dist/`), les imatges precompilades, el codi font viu quan programes.
- **Backups Natius SG:** SiteGround guarda **30 dies de còpies automàtiques completes**.
- **Realitat API:** SiteGround **NO té una API pública** per acionar o descarregar backups de forma programada des del nostre codi React. Si el panell cedeix, l'única via és que entres al panell *Site Tools > Seguridad > Copias de Seguridad* i polses "Restaurar" o "Descarregar" manualment.
- **Veredicte Frontend:** No podem clavar un botó en el `SuperAdmin.jsx` que desencadene un backup en SiteGround. Eixa xarxa de seguretat ja està activada silenciosament pel hosting, però exigeix acció humana.

### B. La Capa de Dades Vives (Supabase)
- **Què guarda:** Usuaris, bandos, calendaris, diccionaris (la vida del poble). **Excepció:** Els grans arxius multimèdia de Storage només es guarden com a metadades en el `pg_dump`, la fotografia crua viu en els buckets.
- **Backups Natius SPB:** Fan còpies diàries automàtiques i mantenen historial (segons el teu pla). Piquen la base de dades amb un sistema similar a Point-in-Time Recovery.
- **Realitat API:** Supabase tampoc proporciona un "Endpoint Màgic de Bakcups" directe en la seua API REST (el client que usem normalment `supabase-js`).
- **El Camí Alternatiu (pg_dump):**
  L'única manera de traure l'or cru del poble fora dels servidors de Supabase és connectar-se per línia de comandes:
  ```bash
  pg_dump "postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres" --clean > poble_backup.sql
  ```

---

## 2. L'Estratègia Tàctica per al Panell d'Administrador

Atès que les APIs naturals d'aquests grans proveïdors estan tancades a l'ecosistema del navegador (per raons òbvies de seguretat massiva), si volem la il·lusió de control de WordPress dins de l'app, l'arquitectura proposada seria la següent:

### Fase 1: Sincronització de Seguretat de Dades JSON (El Botó del Pànic Lleuger)
Crearíem un botó al Panell d'Administrador: **"Exportar Informació Vital (JSON)"**
Aquesta funcionalitat farà ús del `supabaseClient` existent per fer un `SELECT *` agressiu (però filtrat) de les taules que t'importen més: Usuaris verificats, Entitats i Bandos, col·locant eixe resum de la base de dades en un arxiu `.json` massiu que es descarregarà localment a l'ordinador del Mestre. Sense dependre de `pg_dump`. 

### Fase 2: Automatització Silenciosa amb GitHub Actions (El Búnquer Brutal)
La solució professional no és un botó al navegador que xoca amb límits de temps de NodeJS, sinó una acció programada al cervell del Còdex (GitHub).
Dins del repositori, es muntaria un *GitHub Workflow (Cron)* que de matinada execute el següent:
1. Connecta per `pg_dump` al servidor fortificat de Supabase.
2. Extrau un llibre d'un sol arxiu `.sql` íntegre amb la fotografia del poble.
3. El puja a un sub-repositori protegit o l'adhereix caient cap a l'arrel de *Sóc de Poble*/backups.

### Fase 3: SiteGround: El Ritual Manual Asumit
Donat que SG no allibera la seua API de Site Tools, documentarem protocol·làriament al Panell que _el disseny i el codi UI estiga garantit pels teus _commits_ manuals en Git_, i l'estat del servidor per la garantia de 30 dies de SiteGround. 

---

## 3. Què necessite de tu per avançar? (Decisions)

1. **Vols que comencem muntant el botó "Escombrat d'Emergència JSON" al panell de control ara mateix?** (Ideal per descarregar manualment dades urgents si tens por que algun agent trenque columnes vitals en `AppLayout.jsx` o `ProjectPresentation.jsx`).
2. O vols que saltem al model del Cron de Github primer?

*Quede a l'espera de la teua validació per tallar els primers codis!*
