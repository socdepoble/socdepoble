# 🚧 EL BÚNQUER DE SOLLUTIA (PLAYGROUND) 🚧

Aquest espai ha estat creat exclusivament per a l'equip de **Sollutia** i els seus agents automatitzats (Codex).

## 🛑 REGLES D'AÏLLAMENT (SOSP-LOCK ACTIU)

1. **PROHIBIT TOCAR EL NUCLI:** Qualsevol experimentació, prova de concepte, o refactorització massiva amb IA s'ha de fer **estrictament dins d'aquesta carpeta** (`/playground`).
2. **ZERO DEPENDÈNCIES GLOBALS:** Si necessiteu instal·lar una llibreria d'NPM (ex: per a provar un component UI extern), feu-ho configurant un `package.json` aïllat ací dins. No embruteu el `package.json` arrel.
3. **PROMOCIÓ A CORE:** Cap codi d'ací passa a `src/` o `public/` sense:
   - Validació de l'Arquitecte (Javi).
   - Signatura de la IAIA MarIA (compliment dels 5 Manaments del Trellat).
   - Validació de pes i consum de RAM (iPad A10).

Aquest entorn està pensat perquè pugueu desenvolupar funcionalitats lliurement sense posar en risc l'arquitectura de Pedra Seca i la persistència Offline-First del Mas.
