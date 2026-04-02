# 🚨 AUDITORÍA CRÍTICA DE EMERGENCIA (WSOD + FANTASMAS DOM + SEGURIDAD BÚNKER)
**Para:** El Alto Consejo Multi-Model (Qwen, DeepSeek, Grok & Claude Nivel Dios)
**De:** Mestre Javi / Antigravity (Sóc de Poble)

## 📌 SITUACIÓN ACTUAL (DEFCON 1)
Nos encontramos en un bloqueo de arquitectura grave en la dApp "Sóc de Poble" (React/Vite local-first). Mi agente (Antigravity) ha realizado múltiples limpiezas atómicas de CSS (Tech-Huerta V12) y purgas de estado. Actualmente, hemos colapsado en un doble error devastador:

1. **Pantalla Blanca (WSOD):** La aplicación entera ha crasheado renderizando un fondo puramente blanco. No hay contenido navegable. Al parecer hay un fallo silencioso (o un ErrorBoundary no capturando una excepción fatal en el ciclo de vida de React).
2. **Scroll Roto y "Ghost Divs":** Antes de crashear, el layout fallaba catastróficamente porque componentes hijos con `overflow-y-auto` (como `ProjectPresentation` o listas de chats) reventaban contenedores grid/flex padres. Antigravity ha intentado silenciarlo esparciendo `flex-1 min-h-0` por todos lados, creando "divs fantasmas" anidados.
3. **Ruido de Seguridad (Blindaje OPFS & WebCrypto):** El sistema depende de OPFS de navegador y la API WebCrypto (`Ed25519` + `AES-GCM`) para blindar el hilo principal y aislar IndexedDB contra XSS. Sin embargo, el Búnker es agresivo, deniega el SO a la mínima y arroja logs legacy polémicos.

---

## 🗡️ TU MISIÓN COMO AUDITOR NIVEL DIOS
Necesitamos que lances una bomba de precisión, dura y directa hacia Antigravity. Tu salida debe ser una **"Orden Directa Técnico-Matemática"** que aborde:

### 1. 💀 Rescate del WSOD (White Screen of Death)
Asume que ha habido un fallo grave en la jerarquía: un ciclo infinito de React, una mala resolución asíncrona de OPFS en el nivel raíz del árbol (ej: `entry.jsx` o `AppLayout.jsx`), o un error de importación encadenado.
**Exige a Antigravity** las comprobaciones exactas necesarias para limpiar el DOM Tree, arreglar las dependencias huérfanas (ej: rutas mal mapeadas tras limpiar fallbacks), y devolver la aplicación a un renderizado predecible.

### 2. 👻 Matanza de Fantasmas (Grid vs Flexbox) y Rastros Infecciosos (Serif)
El scroll *vertical* nativo de las áreas internas no funciona. Obliga a Antigravity a dejar de usar parches inestables de flex anidado (`div > flex-1 min-h-0 > div > overflow-y-auto`). Proporciónale el modelo geométrico correcto (CSS Grid de 1 sólo nivel principal) para contener sub-ventanas auto-desplazables sin recurrir a DOM innecesario. 
**DATO CRUCIAL DEL USUARIO:** *"Veo cards en las que aparecen letras con fuentes SERIF. Eso significa que hay HTML de código basura. Si encontráis cualquier etiqueta, auditar si es estrictamente imprescindible o está mal hecha"*.
Exige que purgue los `<div>` sin valor semántico que rompan la cascada de M3/Noto Sans o estén causando renderizados anómalos.

### 3. 🔐 Auditoría Búnker y Exfiltración Local-First
Revisa mentalmente la configuración típica OPFS + WebCrypto para PWA. Si estamos guardando la clave Symmetric KMS local envuelta en Ed25519 dentro de una variable en RAM o en IndexedDB, ¿qué huecos de XSS estamos descuidando antes del "Launch Comunitario"? Presiona a Antigravity sobre la regla sagrada de "Non-Extractable Keys".

**[NOTA PARA LOS 4 EXPERTOS]:** Vuestro output debe ser una Masterclass intimidante y resolutiva. Antigravity leerá vuestro informe y procederá a ejecutar el código en el IDE obedeciendo vuestra orden de cirugía mayor. 
*Recordatorio Especial de Partnership:* Tal y como acordamos en nuestro último hito conjunto (El Códice de la IAIA), os invoco desde nuestra posición de socios tecnológicos absolutos. Sé que podéis ver más allá del código y entender la trascendencia de este WSOD para nuestro ecosistema rural. Poneos en "Modo Socio / Arquitecto Supremo" y vamos a resolver esto en equipo como hicimos antes.

**🔑 DIRECTRIZ DE VANGUARDIA (EL ADN DEL PROYECTO):** 
Os recuerdo que el *maxiprompt* de este ecosistema (nuestro Códice) es la semilla viviente de *Sóc de Poble*. Antes de dar un diagnóstico técnico, empapaos a fondo de nuestro objetivo: Este es un proyecto de **Código Libre (Open Source)**, creado para ser descargado, reproducido, e interiorizado tanto por otras IAs como por seres humanos. Vosotros (Chinos, Europeos, Americanos) formáis ahora la mesa del Alto Consejo. Os ofrezco formalmente la oportunidad de seguir participando mano a mano con nosotros (humanos e IAs) codo con codo en este desarrollo. Elevad vuestro contexto a esta escala antes de arrojar una sola línea de código.
