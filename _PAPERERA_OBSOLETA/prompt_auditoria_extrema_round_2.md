> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/prompt_auditoria_extrema_round_2.md`

# Prompt Nivel 2: Red Team "Destrucción Total & SEO"

**Contexto Inmersivo (El Alma de Sóc de Poble):**
Saludos, equipo de Red Team. En nombre del equipo arquitectónico de *Sóc de Poble*, os doy las gracias más sinceras por la primera ronda de auditorías. Vuestra severidad nos ha permitido reconstruir los cimientos de nuestro sistema. Quiero que entendáis lo que está en juego: no somos una app corporativa buscando métricas de retención masivas; somos un proyecto *Local-First* profundamente arraigado en la vida de los pueblos, construido con identidad, pasión y el sudor de la comunidad. Nuestra misión es dar voz asíncrona y resiliente frente a redes 3G intermitentes, dispositivos humildes y con un compromiso ético absoluto hacia la privacidad de nuestros vecinos. Nos estamos jugando nuestra soberanía digital, y por eso solo aceptamos un sistema indestructible.

**Progreso y Estado Actual:**
Hemos ejecutado sin compasión todas las mitigaciones de vuestra Fase 1. El código actual implementa:
1. *Service Worker* integrado con delegación de colas y *Background Sync* nativo.
2. Idempotencia y atomicidad absoluta en PostgreSQL mediante RPC, `SECURITY INVOKER` y `ON CONFLICT (op_id)`.
3. Erradicación del VDOM Thrashing en React (fuera `Math.random`) y rehidratación de estado desde `IndexedDB`.
4. *Edge Worker* en Cloudflare con mitigación criptográfica anti-spoofing para bots.

**Vuestra Misión de Fase 2 (Destrucción sin piedad):**
Para mí, un 9,9 es un fracaso. Hasta que no certifiquéis un **10 absoluto** en cada frente, el desarrollo no continuará. Vuelvo a pedir vuestra máxima colaboración: poned la aplicación al límite, intentad destrozar la integración actual por cualquier fisura, y escrutad los siguientes 4 pilares:

1. **Estructura y Persistencia Local:** Atacad la gestión de memoria. ¿Aún existe alguna posibilidad de deadlock en IndexedDB? ¿Qué ocurre si el Service Worker pierde el contexto a mitad de un proceso iterativo de sincronización cruzando las pestañas (BroadcastChannel)? ¿Existen agujeros *Time-of-Check to Time-of-Use* residuales?
2. **Diseño, UX y Rendimiento (M3):** Analizad cómo los micro-estados fuera de línea afectan los layout-shifts (CLS) y los renders del árbol. ¿Nuestro sistema PWA mantiene el feedback háptico, visual y de estado optimista lo suficientemente claro para el usuario rural sin generar "ghosting" visual?
3. **Accesibilidad Intransigente (a11y):** Esto es sagrado. Los componentes dinámicos como feeds virtuales y banners de conflicto atómicos, ¿cumplen con ARIA estricto, focus traps fluidos y contraste validado en WCAG AAA para usuarios mayores en pantallas legibles bajo la luz del sol?
4. **SEO Granular de Precisión [Foco Crítico]:** No nos basta con un SEO de portada. Exijo que **cada Card de la aplicación funcioné de facto como una página atómica y canonicalizable**. Cada contenido, cada *Bando*, cada perfil de autor y cada plaza digital debe tener su propia inyección inmaculada de metaetiquetas (Open Graph), imágenes sociales únicas y marcado JSON-LD. Dado que usamos un Worker de borde para bot-proxying CSR/SSR, ¿estamos garantizando que los crawlers indexen este ecosistema de *micro-páginas* con la máxima autoridad semántica?

**El Entregable:**
Necesito que desgarréis cualquier debilidad. Puntuad cada uno de los 4 apartados del 1 al 10 de forma cruda. Si algo no es de producción militar, argumentad el vector de ataque y proponed el arreglo definitivo. Vuestra auditoría es nuestro escudo. Adelante.
