> 📂 **Arxiu/Ruta:** `./auditories/260409_1123_R2_05_Claude_Arquitectura_Global.md`

# 🔴 RONDA 2: INVESTIGACIÓN CRUZADA (Claude #5)
*(Transcripció de la resposta de Claude a la Llave Maestra)*

---

### 1) La Memòria del Silici (El límit real de Safari)
Claude ha diagnosticat la causa exacta de la mort de l'iPad: no és la mida del fitxer, és que `y-indexeddb` genera "thrashing" al Garbage Collector perquè l'arxiu Uint8Array manté referències cícliques.
- Propulsa 3 solucions: El **Sharding lògic** (SdpDocRegistry) on es fa `.destroy()` explícit si no s'usa. El **Snapshot compacte** que s'engega només quan la PWA passa a `hidden` (es minimitza). I la confirmació de que per instàncies lineals (burocràcia) mai hem d'usar Y.js, sinó un **WAL pla**.

### 2) El Vincle Passiu (Capacitor OBLIGATORI)
La sentència d'Aple és absoluta: "Una PWA en iOS es congela en 30 segons". No hi ha Bluetooth Web.
- **La Solució:** Fer una "carcassa" nativa usant **Capacitor**.
- **El Hack Legal:** Declarar `bluetooth-central` dins de l'`Info.plist` de la carcassa nativa d'iOS. Això dona "background indefinit" al codi Swift, permetent que el mòdul Web estigui mort per estalviar bateria mentre Swift reparteix els audios Codec2 via BLE.

### 3) El Pont Legal (Twilio + Oficialitat)
- Abandona Baileys, tot i admetre que a petita escala funciona.
- Recomana saltar a un BSP (Business Solution Provider) autoritzat per fer de filtre, com **Twilio**.
- Ens dona el marc perfecte a presentar a Meta: El Projecte encaixa de manera oficial en la categoria avalada **"Agricultural Advisory / Alertes agràries"**. Això ens permet 1000 converses lliures de cost.

### 4) DAFO Holístic: El Bus Factor i la targeta SD
Claude demostra una intel·ligència pragmàtica aclaparadora:
- Avisa del "Bus Factor": Si només el Mestre Javi sap compilar un plugin Capacitor per a Xcode des d'un Mac, el dia que ell no estigui l'app no es pot actualitzar i mor.
- Avisa que el Node Llavador (la Raspberry Pi) fa malbé les targetes SD per desgast i algú de la cooperativa l'ha de blindar i saber reiniciar.
