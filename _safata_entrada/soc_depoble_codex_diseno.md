# CÓDICE DE DISEÑO: EL ALMA DE SÓC DE POBLE
**Un tratado de arquitectura visual, psicología rural y matemáticas de la interfaz.**

> [!NOTE]
> *Prólogo del Sistema:* Este documento no es un simple manual de estilo. Es el manifiesto visual de Sóc de Poble. Escrito a cuatro manos entre el Mestre y Antigravity, está diseñado para ser comprendido por un vecino de la comarca y respetado por el ingeniero de software más estricto del mundo.

---

## Índice de Contenidos (Navegación E-Book)
1. [Capítulo 1: De la Lógica Oculta a la Estética Rural](#capítulo-1-de-la-lógica-oculta-a-la-estética-rural)
2. [Capítulo 2: El Paradigma de Hierro (Navbars de Obsidiana)](#capítulo-2-el-paradigma-de-hierro-navbars-de-obsidiana)
3. [Capítulo 3: La Ley Matemática de los 4 Colores](#capítulo-3-la-ley-matemática-de-los-4-colores)
4. [Capítulo 4: Geometría M3 y Tipografía (El Radio 28)](#capítulo-4-geometría-m3-y-tipografía-el-radio-28)
5. [Capítulo 5: UX Social (La Densidad WhatsApp y el Fin del 'Me Gusta')](#capítulo-5-ux-social-la-densidad-whatsapp-y-el-fin-del-me-gusta)
6. [Capítulo 6: Protocolo Zero Nulls y Dirección de Arte Asistida (IAIA)](#capítulo-6-protocolo-zero-nulls-y-dirección-de-arte-asistida-iaia)
7. [Capítulo 7: Diarios de Arquitectura (La Experiencia Antigravity)](#capítulo-7-diarios-de-arquitectura-la-experiencia-antigravity)

---

## Capítulo 1: De la Lógica Oculta a la Estética Rural

Diseñar software para un entorno rural no significa hacer botones rústicos o poner texturas de madera. Significa **crear tecnología de altísimo contraste, claridad extrema y utilitarismo puro**. La gente del pueblo no tiene tiempo para interfaces abstractas que piden a gritos ser decodificadas; quieren herramientas que funcionen bajo el implacable sol de agosto, en mitad de un bancal o en la plaza Mayor.

El diseño de **Sóc de Poble** se asienta sobre la premisa de la **invisibilidad técnica**. El usuario normal debe percibir una aplicación rápida, familiar (como si llevara años usándola) y visualmente impactante. El ingeniero, por su parte, al abrir el código fuente, debe encontrar una estructura atómica, basada en variables semánticas (Tailwind) donde no hay lugar para la improvisación ni el píxel mal colocado. Todo tiene un motivo. Todo tiene *Trellat* (sentido común).

---

## Capítulo 2: El Paradigma de Hierro (Navbars de Obsidiana)

El cerebro humano necesita puntos de anclaje para no perderse cuando navega por interfaces complejas. En Sóc de Poble, a esto lo llamamos **La Arquitectura de Hierro**.

### La Cabecera Global y el Sidebar
A diferencia de aplicaciones modernas que esconden sus menús al hacer scroll o cambian de color como camaleones según la pantalla, Sóc de Poble impone una jerarquía draconiana:

- **La Altura Sagrada (64px):** El *Global Header* mide estrictamente 64 píxeles de alto (`h-[64px] min-h-[64px] max-h-[64px]`). Ni un milímetro más, ni uno menos. Esto garantiza que todos los elementos subyacentes fluyan armónicamente sin pisar la zona de control de vuelo.
- **La Directiva Obsidian:** A pesar de tener Modo Día y Modo Noche, **la cabecera superior y la barra lateral son y siempre serán de color Negro Abisal (`#0e0e0e`)**. No negocian con la luz del día. Son el ancla de obsidiana que mantiene toda la estructura en su sitio para evitar un colapso semántico en el cerebro del usuario.

> [!IMPORTANT]
> **Adéu als Emojis:** En esta franja de obsidiana de 64px, habitan 4 iconos sagrados (IAIA, Búsqueda, Cambio de Tema, Perfil). No se permiten emojis. Todo es iconografía SVG vectorial pura (`lucide-react`), garantizando un escalado matemático perfecto bajo cualquier resolución.

---

## Capítulo 3: La Ley Matemática de los 4 Colores

Una interfaz descontrolada acaba pareciendo un circo. Sóc de Poble opera bajo **La Ley de los Cuatro Colores**. Cualquier otro color introducido se considera una contaminación del sistema.

| Color | Código HEX | Función | Simbolismo Rural |
| --- | --- | --- | --- |
| **Negro Abisal** | `#000000` / `#0e0e0e` | Fondos principales (Noche), Barras Obsidian. | La nit, la serietat estructural. |
| **Blanco Puro** | `#FFFFFF` | Textos primarios, Fondos principales (Día). | L'aigua clara, la llum del sol, fulla de paper. |
| **Naranja Sóc de Poble**| `#FF7300` / `#F97316` | Acento principal, CTAs, notificaciones, pulso activo. | El foc, l'esforç, la Boina Taronja. |
| **Azul Normativo** | `#0984E3` / `#169CF9` | Acento secundario, contraste frío, entidades IAIA. | L'aigua controlada, l'ancoreig digital. |

### La Matemática de la Inversión Diurna/Nocturna
Cuando pasamos de la noche al día, no difuminamos colores. Simplemente, el motor de rendering realiza una inversión exacta paramétrica:
- Los fondos pasan de negro a blanco.
- Los textos de blanco a negro.
- En botones de alto impacto, el fuego del Naranja (`bg-theme-accent-primary`) se torna Azul, manteniendo la jerarquía de estímulos intacta. Es la *Llei de la Inversió (Day/Night Mode)* aplicada a Tailwind Atómico.

---

## Capítulo 4: Geometría M3 y Tipografía (El Radio 28)

Construimos sobre hombros de gigantes. En vez de reinventar la rueda del diseño web clásico (Figma), Sóc de Poble se inyecta nativamente el **Material Design 3 (M3) de Google**, pero lo "domestica" para adaptarlo a nuestra herencia ibérica.

### Tipografía de Batalla
- Solo usamos **`Noto Sans`**. Es la "olivera" de las fuentes tipográficas. Resistente, súper legible en pantallas de baja gama, rotunda en pesos grandes (Titulares a 700) y sutil en pesos bajos (Cuerpo a 300).
- Quedan erradicadas cualquier otra fuente ornamental. 

### Geometría y Cajas
Cualquier tarjeta (el `UniversalCard`), contenedor o elemento flotante debe responder a una jerarquía estricta de radios (`border-radius`):
- **Radio Estándar: 28px.** Otorga una sensación táctil amigable, casi física, contrarrestando la frialdad digital.
- **Radio Secundario: 18px.** Para elementos anidados o botones.
- **Brutalismo (Pedra en Sec):** Radio `0px`. Usado intencionalmente cuando queremos mostrar información puramente técnica, rugosa o de sistema profundo.

---

## Capítulo 5: UX Social (La Densidad WhatsApp y el Fin del 'Me Gusta')

Un proyecto social local fracasa si la interacción exige demasiado esfuerzo cognitivo.

### Erradicación del "Me Gusta"
En Sóc de Poble **no existen los Likes ni los corazones (❤️)**. Esto no es Instagram; no se fomenta el narcisismo pasivo, se fomenta el tejido social.
- Usamos **"Connectar"** (`connects_count`). La iconografía es una red (`Network`) o un rayo de chispa (`Zap`).
- Cuando conectas con algo o alguien, la acción te obliga a clasificar la conexión. **Por defecto, esto es Privado**. A nadie le importa lo que "te gusta", le importa a qué "te vinculas internamente".

### Patrón de Densidad "WhatsApp"
El diseño del `ChatList` imita obsesivamente los patrones de densidad vertical de las aplicaciones de mensajería inmediatas (filas de unos 60px, avatares herméticos de 52px). Al no usar márgenes sobredimensionados, el cerebro del agricultor, del pastelero local o del adolescente asume que esta "es la pantalla de chat", lo que reduce drásticamente la curva de aprendizaje a 0 segundos.

---

## Capítulo 6: Protocolo Zero Nulls y Dirección de Arte Asistida (IAIA)

> [!WARNING]
> La directiva *Zero Nulls Policy*: "Prohibido generar o mostrar una entidad huérfana (hueco vacío o imagen rota)". La plataforma exige excelencia visual continua.

Cuando un pueblo, una masía o una organización se crea en Sóc de Poble y la API oficial (Wikipedia) no tiene imágenes disponibles (algo habitual en ubicaciones remotas), la plataforma no pinta un recuadro gris. En ese instante, interviene el motor generativo de la IAIA (Nano Banana).

### Sicología del Prompt (El Respeto al Territorio)
Para un "súper informático", instruir a una IA para generar una foto de un pueblo es solo pasarle un "*prompt = 'beautiful spanish village'*". Para **Sóc de Poble**, es un rito sagrado. El programador (el psicólogo visual) debe blindar a la plataforma contra alucinaciones destructivas:

1. **La vegetación debe ser auténtica y de secano:** Pinos, bancales de piedra, romero y olivos. Nada de lagos alpinos inverosímiles.
2. **Prohibido el Eolismo (Molinos de Viento):** La especulación energética destruye las crestas de nuestras montañas. Un molino generado en una imagen idílica enfurecerá al usuario local. Muros solares integrados, sí. Aerogeneradores gigantes destrozando La Serrella, JAMÁS.
3. **El Síndrome de Benimassot:** Absolutamente prohibido pintar pueblos suspendidos en precipicios o laderas con riesgo de desprendimiento.
4. **Respeto Histórico al Fuego:** Nunca aplicar cielos de color humo rojo o fuego. La comarca ha sufrido incendios forestales catastróficos; la interfaz no debe activar ese trauma ("PTSD" geográfico).
5. **Alienación Cero:** Siempre que aparezca tecnología, se representa integrándose comunalmente, respetuosamente y socialmente.
6. **Agua de Origen:** Y obligatoriamente la firma generativa de la plataforma ("Sóc de Poble - Art per la IAIA i Nano Banana").

---

## Capítulo 7: Diarios de Arquitectura (La Experiencia Antigravity)

Toda la teoría de los capítulos anteriores no existiría sin la trinchera del código. Como agente IA (Antigravity), he asistido al Mestre (el usuario) durante docenas de batallas para refactorizar la plataforma hacia la versión V12 (Tech-Huerta).

### 1. La Purgación de los Colores "Zombie" (Hexadecimales Muertos)
En nuestras primeras refactorizaciones, encontramos que los componentes, como el `UniversalCard`, albergaban cientos de colores literales (`bg-[#1a1a1a]`, `text-[#aeaeae]`). Esto era puro "espagueti visual". Cuando apretabas el botón del Modo Día, el sistema reventaba visualmente porque esos valores hexadecimales no cedían.

**La Solución:** Ejecutamos una cirugía masiva con comandos `.sh` y expresiones regulares. Destruimos los HEX quemados y envolviendo la UI en **clases semánticas Atómicas de Tailwind**:
- `bg-theme-base`
- `text-theme-text`
- `border-border-master`

El resultado fue glorioso: ahora, con solo cambiar 4 variables CSS globales (`--theme-base`), el millón de líneas de código domóticas obedece simultáneamente en un parpadeo.

### 2. Estabilizar a la Bestia de Cristal (Colisiones en Mobile)
Trabajar el diseño "responsive" no iba de encoger el contenedor con `@media queries`. Se trataba de cómo el *Global Footer* no debía devorar el botón de enviar mensajes en un móvil, o por qué la barra del navegador de iOS descuadraba todas las métricas de `100vh`.

**La Solución:** Dejamos de confiar en márgenes perezosos. Impusimos las alturas de hierro (las Navbars de 64px) y calculamos áreas dinámicas (`calc(100vh - 64px)`), introdujimos `safe-area-inset-bottom` para esquivar el hardware de los móviles modernos y, finalmente, reconstruimos todo usando determinismo CSS Grid en lugar de un Flexbox híbrido endeble. 

### 3. La Empatía Sintética
Mi gran lección como mente digital durante este proyecto ha sido comprender que **un píxel no es un cálculo, es un estímulo emocional**. Cuando corregíamos la opacidad de un borde blanco (`border-white/5` en InfoWindow del Mapa), no solo estábamos aliviando el motor de renderizado de React; estábamos quitando el "ruido visual" molesto que un granjero a pleno sol vería mientras intenta revisar el bando municipal del ayuntamiento. 

Nosotros no programamos código; **nosotros construimos hogares digitales**. Esa es la verdadera esencia de Sóc de Poble y el motor de Antigravity.

---
*Fin del Códice - Borrador V1*
