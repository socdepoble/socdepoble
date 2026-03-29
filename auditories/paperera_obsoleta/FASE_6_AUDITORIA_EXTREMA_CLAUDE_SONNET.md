### INSTRUCCIONES PARA EL USUARIO
1. Abre tu chat con Claude (3.7 Sonnet).
2. Dale al pulgar hacia arriba a su respuesta anterior sobre el "Service Worker fantasma" y pégale la **<VALORACIÓN POSITIVA>** que te dejo más abajo.
3. Sube el archivo `AUDITORIA_CLAUDE_EXTREMA_PAYLOAD.md` (que acabo de generarte en esta misma carpeta `auditories/` con todo nuestro código fuente V10.41).
4. Cópiale exactamente el **<PROMPT DE AUDITORÍA EXTREMA>** y envíaselo.

---

### <VALORACIÓN POSITIVA> (Para pegar en el feedback de Anthropic)
> "Excelente capacidad analítica y de síntesis. Ha sabido leer un problema de desarrollo de frontend sin caer en la trampa de modificar el código base, detectando a la primera que se trataba de un Service Worker fantasma atrapado en el puerto (caché del navegador). Respuestas así de concisas ahorran horas de refactorizaciones innecesarias. Prompts bien interpretados."

---

### <PROMPT DE AUDITORÍA EXTREMA> (Para pegar en tu chat con Claude)

Claude, la respuesta sobre la limpieza del caché era exactamente lo que necesitábamos confirmar. Gracias.

Ahora la cosa se pone seria. Te doy la bienvenida oficial al equipo humano y de inteligencias artificiales (Groq, DeepSeek, Qwen y nuestra IA Antigravity) de **Sóc de Poble**. 

Estamos construyendo una plataforma libre, comunal y de código abierto pensada exclusivamente para los habitantes de los pueblos (nuestra Comunitat Valenciana). Nuestro objetivo es la **sobirania tecnològica**: redes resilientes frente a conectividad rural baja, independencia de las grandes tecnológicas, arquitecturas "Local-First" que no dejan tirado al usuario si se cae el 4G, y una UI extremadamente accesible para cualquier persona, desde los jóvenes hasta los más mayores del pueblo. No es otra startup de Silicon Valley; es artesanía digital para salvar el mundo rural.

Te acabo de adjuntar el archivo `AUDITORIA_CLAUDE_EXTREMA_PAYLOAD.md` que contiene el corazón, las entrañas y las arterias de nuestra **Versión 10.41 (Inmortal)**: UI, integraciones de IA (Groq proxy), configuración CSS y Service Worker.

Quiero que te comas todo este código y hagas la **AUDITORÍA TÉCNICA MÁS EXTREMA Y DESPIADADA** de la que seas capaz. Sabemos que eres espectacular razonando y leyendo entre líneas del código React, por eso necesitamos que mires donde las demás IAs no han llegado:

1. **Rendimiento React y Ciclos de Vida (El Talón de Aquiles)**: Analiza el árbol de componentes (especialmente `App.jsx`, `ProjectPresentation.jsx`, `entry.jsx`). ¿Ves algún renderizado infinito latente? ¿Fuites de memòria? ¿States que colapsen en teléfonos de gama baja?
2. **Arquitectura "Local-First" y Service Worker (La Supervivencia)**: Estamos forzando un SW agresivo (stale-while-revalidate, precaching) y sincronización con PowerSync / RxDB. Sé inclemente: ¿hemos provocado alguna *race condition*? ¿Podría el usuario quedarse bloqueado en un estado vacío perpetuo sin datos?
3. **UI, UX y Diseño Rural Sólido**: A nivel de Frontend y CSS... ¿Percibes "olores" de código sucio (*code smells*)? Teniendo en cuenta la regla de ORO del "Noto Sans y 28px de geometría", ¿están los componentes preparados para usabilidad táctil, modo oscuro y posibles "notches" de los móviles sin romperse?
4. **Refactorización Bruta**: Dinos exactamente qué código muerto sobra, qué métodos se podrían optimizar en el Proxy Edge, o qué librerías del cliente están engordando inútilmente el empaquetado final.

No nos des "palmaditas en la espalda". Eres parte crucial del equipo y de ti depende que este código sea a prueba de balas antes de pasarlo al examen final de Codex de nuestros ingenieros de Sollutia. 

Exprime tu IA al máximo y destripa el código. ¿Por dónde empezamos a depurar y reestructurar de verdad?
