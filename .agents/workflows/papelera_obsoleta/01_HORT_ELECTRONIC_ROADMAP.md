> 📂 **Arxiu/Ruta:** `./.agents/workflows/papelera_obsoleta/01_HORT_ELECTRONIC_ROADMAP.md`

---
description: Ruta Crítica Hort Electrònic V12 (Orden Natural de Importancia y Diseño M3)
---

# HORT ELECTRÒNIC V12 - ROADMAP Y RUTA CRÍTICA

Esta skill documenta el orden estricto, innegociable y lógico en el que se debe ejecutar la refactorización arquitectónica visual de "Sóc de Poble" hacia la versión V12 (Hort Electrònic). 

## 1. El Paradigma de Diseño (Stitch vs Figma)

- **Figma:** Herramienta de diseño cerrado.
- **Stitch:** Plataforma de generación de código nativo React fundamentada en el **Design System Material 3 (M3) de Google**.
- **La Estrategia:** Al usar Stitch, ya tenemos toda la arquitectura de componentes puros de Google integrada en las entrañas del sistema (M3). **NUESTRO TRABAJO** consiste en iterar **SOBRE** esa base sólida de Google para inyectarle el ADN único de nuestra paleta. El diseño siempre parte de M3, nunca desde cero ni con frameworks ad-hoc. No "importamos" Figma, generamos componentes nativos Google y los domesticamos con nuestros colores matemáticos.

## 2. La Regla de los Cuatro Colores (Matemática Estricta)

Antes de programar ningún componente, el Design System **solo permite cuatro colores**. Cualquier intento de insertar grises lavados, sombras difusas u otras desviaciones se considerará un fallo arquitectónico crítico:

1. **Naranja Primario:** `#F97316` (El pulso, la energía, el fuego).
2. **Azul Secundario (Complementario Exacto):** `#169CF9` (El agua, el contraste estricto, el ancla).
3. **Fondo / Lienzo:** Negro Profundo (`#000000` o `#0e0e0e`).
4. **Textos Principales / Elementos Elevados:** Blanco Puro (`#FFFFFF`).

La interfaz no es un lienzo pictórico, es un panel de mandos digital de alto contraste.

## 3. Orden Natural de Ejecución (Ruta Crítica de V12)

La refactorización no se aborda al azar. Sigue el "Orden Natural de Importancia" de la aplicación, dando prioridad absoluta a las áreas de máxima fricción social ("El Enganche"):

1. **Paso 1: `ChatList` (Lista de Chats)**
   - *Por qué:* Es el "Enganche estilo WhatsApp". Es la pantalla de inicio real. Si el ChatList no transmite velocidad y limpieza, perdemos al usuario en el primer segundo.
   - *Objetivo:* Avatares matemáticos, contrastes salvajes Fondo Negro / Texto Blanco, notificaciones en Naranja y sin bordes.
   
2. **Paso 2: El Ecosistema `ChatDetail`**
   - *Por qué:* Es donde ocurre la vida. Interacción usuario-agente.
   - *Componentes:* `ChatHeader`, `ChatMessageList`, `ChatInputArea`.
   - *Objetivo:* Burbujas elevadas con blur, distinción algorítmica de actores usando la regla Boina Azul / Boina Naranja. Área de impacto táctil (48px).

3. **Paso 3: El Mercado / Directorio (`UniversalCard`)**
   - *Por qué:* Es la plaza pública. El hub "discovery". 
   - *Componentes:* `Feed.jsx`, `UniversalCard.jsx`
   - *Objetivo:* Implementación del layout asiḿetrico, sin la "No-Line rule" y maximizar el descubrimiento visual de los perfiles locales.

## Invocación
- Siempre que se vaya a modificar o crear un archivo visual importante de la V12, Antigravity DEBE consultar esta ruta y asegurarse de que está operando en el orden correcto y con la paleta matemática estricta.

## 4. Evolución al V13 (Sóc de Poble: L'ànima del Poble)
A partir de la consecución del 10/10 en V12, el Roadmap evoluciona obligatoriamente hacia el empoderamiento tecnológico de los ancianos y la preservación local. Las dos directrices clave en las que Antigravity debe buscar "aliados" y perfeccionar conocimiento son:
1. **Detalles técnicos IAIA Voz:** Implementación de interacciones exclusivamente por voz (Local-First), reconocimiento de voz (modelos como Whisper-tiny) offline.
2. **Iniciativas similares rurales:** Prospección activa de fundaciones, alianzas y proyectos (p.e. Reto Rural Digital, Conecta Rural, etc.) que trabajen contra el aislamiento rural con tecnología soberana. Deben documentarse y considerarse para sinergias.
