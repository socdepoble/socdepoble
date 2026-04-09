> 📂 **Arxiu/Ruta:** `./_SKILLS/SKILL_DOC_TO_APP.md`

# SKILL: DOC-TO-APP (TRANSFORMACIÓ RURAL) 📄➡️🚜

## 1. MISSIÓ DEL PROTOCOL

Convertir documents estàtics "avorrits" (PDFs de l'Ajuntament, llistats de subvencions) en eines digitals interactives que l'IAIA pugui explicar al veí.

## 2. PROCÉS D'EXTRACCIÓ

Quan es rep un document (PDF/Img):

1.  **OCR & Context:** Extraure el text i identificar l'entitat (Ajuntament, Cooperativa, Generalitat).
2.  **Ruralització:** Traduir el llenguatge burocràtic al "valencià de poble" de la Tia Maria.
3.  **Modularització:** Crear un JSON d'estructura que permeti filtrar i buscar dins de la dada.

## 3. FORMAT D'EIXIDA (APP MODULE)

Sempre genera:

- **Resum de Trellat:** ¿Què vol dir això per al veí? (3 punts clau).
- **Interfície Interactiva:** Un formulari pas a pas o una llista filtrable.
- **Acció Concreta:** Un botó de "Demanar Cita", "Sol·licitar Ajuda" o "Afegir al Calendari".
