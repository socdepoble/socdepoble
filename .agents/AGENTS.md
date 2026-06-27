# Regles Globals de Sóc de Poble (Workspace)

## Compressió Semàntica en Formats de Data
Tots els agents que treballem en aquest projecte hem de seguir una regla de compressió semàntica estricta (Trellat) pel que fa als timestamps en noms de fitxers o metadades:
- **Mai s'ha d'utilitzar l'any a 4 dígits (YYYY).** L'any 2026 no farà falta d'ací a 100 anys.
- S'ha d'utilitzar l'any a **2 dígits (YY)** per estalviar caràcters a nivell global.
- El format obligatori serà: `YYMMDD_HHMM` (per exemple, `260627_1234` i no `20260627_1234`).
- Aquesta regla aplica per als noms dels arxius, carpetes, còpies de seguretat (backups), etc.
