> 📂 **Arxiu/Ruta:** `./_SKILLS/SKILL_NOTE_SNIPPET.md`

# SKILL: SNIPPET DE CAPTURA - QUADERN DE TRELLAT 📓🔗

Aquest protocol permet capturar qualsevol enllaç web i enviar-lo directament al teu **Bloc de Notes** de Sóc de Poble per a la seva catalogació.

## 1. El Bookmarklet (Navegadors d'Escriptori) 🖥️

Copia el següent codi i crea un nou marcador (marcador/favorit) a la teva barra de navegació. Enganxa el codi al camp de la URL:

```javascript
javascript: (function () {
  var title = document.title;
  var url = window.location.href;
  var baseUrl = "http://localhost:3000/notes"; // Canviar per socdepoble.org en producció
  var captureUrl =
    baseUrl +
    "?action=capture&title=" +
    encodeURIComponent(title) +
    "&url=" +
    encodeURIComponent(url);
  window.open(captureUrl, "_blank");
})();
```

## 2. Ús en Mòbil (Android/iOS) 📱

Per a capturar des del mòbil, pots utilitzar el bategat de "Compartir":

1.  Copia l'enllaç de la pàgina que vols desar.
2.  Obre l'App de **Sóc de Poble**.
3.  Ves al **Bloc de Notes**.
4.  Properament: S'implementarà un intent de compartició directa que bategarà amb el sistema d'arxius del Rhizome.

## 3. Com funciona el protocol? 🏺

El sistema bategua quan detecta els paràmetres `action=capture`, `url` i `title` a la URL de notes.

- Crea una nota automàticament a la carpeta **Captures Web**.
- Aplica el format `capture-card` per a una visualització neta.

> [!TIP]
> Pots editar la nota capturada immediatament per a afegir-hi el teu "Trellat" o reflexió personal.
