> 📂 **Arxiu/Ruta:** `./_PAPERERA_OBSOLETA/historic_sensible_archived/CLAUDE_RESPUESTA_FASE2_DAFO.md`

# 📜 ACTA DE LA FASE 2 – BÚNKER P2P Y ANÁLISIS DAFO INTEGRAL  
**Alto Consejo Multi‑Model**  
**Representante en turno:** Claude  
**Asunto:** Supervivencia Densa y Expansión de Sóc de Poble  

---

# MISIÓN 1: AUDITORÍA DE VULNERABILIDADES Y P2P

## Vectores de Ataque Teóricos

**Timing Attacks en WebCrypto**

La Web Crypto API usa operaciones de tiempo constante internamente, pero el canal lateral está en el código que la rodea:

```javascript
// ❌ VULNERABLE — tiempo de respuesta revela si la clave existe
const key = await db.get('userKey')
if (!key) return // este branch es medible externamente

// ✅ CORRECTO — tiempo constante en la decisión
const key = await db.get('userKey')
const dummyKey = await crypto.subtle.generateKey({name:'AES-GCM',length:256}, false, ['encrypt'])
const activeKey = key ?? dummyKey
// siempre cifras, nunca revelas ausencia de clave por timing
```

Un atacante en la misma LAN haciendo múltiples peticiones puede inferir estado interno midiendo latencias de respuesta del Worker.

**Envenenamiento de IndexedDB**

Este es el vector más realista en una PWA local-first. No requiere XSS sofisticado:

```javascript
// Escenario: extensión de navegador maliciosa con permiso de "leer datos del sitio"
// Puede abrir la misma IndexedDB y sobrescribir metadatos sin tocar las claves:
const db = await idb.open('BunkerCryptoDB')
await db.put('metadata', { 
  userId: 'victim', 
  publicKey: attackerPublicKey // la clave pública del atacante sustituye la del usuario
}, 'identity')
// El usuario ahora firma con su clave pero anuncia la del atacante — Man-in-the-Middle
```

La contramedida es firmar los metadatos con la clave privada y verificar la firma al arrancar. Si los metadatos no verifican, la app entra en modo cuarentena.

**DoS por Saturación de Storage**

Sí existe y es infrautilizado como vector. Los límites de OPFS/IndexedDB son por origen y varían:

- Chrome: ~60% del espacio disponible en disco
- Safari: 1GB sin permiso explícito, luego pregunta
- Firefox: variable según configuración del usuario

Un atacante puede forzar un estado de cuota agotada escribiendo datos masivos desde el mismo origen (si tiene XSS) o simplemente induciendo al usuario a usar la app intensivamente sin limpieza. El resultado es que `crypto.subtle` empieza a fallar silenciosamente al intentar escribir claves nuevas.

```javascript
// Defensa — monitorizar cuota activamente
const quota = await navigator.storage.estimate()
const usageRatio = quota.usage / quota.quota
if (usageRatio > 0.85) {
  // alertar al usuario y entrar en modo solo-lectura
  emitEvent('STORAGE_CRITICAL', { usageRatio })
}
```

**Structured Clone Collisions**

Riesgo bajo pero real: cuando IndexedDB serializa un objeto `CryptoKey` via Structured Clone Algorithm, si dos versiones del navegador tienen implementaciones ligeramente distintas del algoritmo, la deserialización puede fallar silenciosamente o producir un objeto inválido. Esto no es un ataque externo sino un riesgo de compatibilidad entre versiones de Chrome/Firefox. La defensa es versionar explícitamente el schema de la DB y validar el tipo del objeto recuperado antes de usarlo.

---

## Diseño P2P para Pueblos Sin Internet Global

Esta es la parte más interesante y más difícil del proyecto. El reto real no es técnico — es el bootstrapping de confianza sin servidor central.

**Topología Recomendada: Gossip en Malla Local**

```
[Vecino A] ←→ [Vecino B] ←→ [Vecino C]
     ↑                              ↓
[Vecino D] ←——————————————→ [Vecino E]
```

No estrella (un nodo central que falla), no anillo (un corte rompe todo). Malla parcial donde cada nodo conoce 3-5 vecinos. Los mensajes se propagan por gossip: cada nodo reenvía a sus vecinos lo que recibe, con un TTL que evita loops.

**Stack Técnico Realista**

Para comunicación en LAN sin internet:

```
Descubrimiento: mDNS (Bonjour) — funciona en WiFi local sin router a internet
Señalización WebRTC: servidor de señalización local (uno de los móviles actúa de relay temporal)
Transporte: WebRTC DataChannel con DTLS (cifrado nativo)
Capa de aplicación: mensajes firmados con Ed25519 del remitente
```

El problema de Bluetooth/WiFi-Direct en navegadores es que la Web Bluetooth API no permite comunicación general de datos — solo GATT profiles específicos. WiFi-Direct directamente no está expuesto a navegadores. Esto significa que la solución P2P real fuera de LAN requiere una app nativa (PWA con plugin Capacitor/Tauri) o quedarse dentro de la misma red WiFi local.

**Intercambio de Claves en la Plaza del Pueblo Sin Red**

El modelo más práctico es el **QR de confianza física**:

```
1. Vecino A genera su keypair Ed25519 en su móvil
2. Vecino A muestra QR con su clave pública + fingerprint SHA-256 truncado (8 caracteres)
3. Vecino B escanea el QR en la plaza — verifica visualmente el fingerprint en voz alta
4. Vecino B firma la clave de A con su propia clave (Web of Trust local)
5. Esta "certificación social" se propaga por gossip a los demás vecinos
```

Es el modelo PGP simplificado para personas no técnicas. La verificación oral del fingerprint es el equivalente digital del apretón de manos en la plaza. No requiere internet, no requiere servidor, y la confianza es social antes que matemática.

---

# MISIÓN 2: DAFO SIN FILTROS

## 💪 FORTALEZAS

**Soberanía de datos real, no declarada.** La mayoría de apps "privadas" del mercado tienen backdoors en su modelo de negocio (metadatos, análisis de uso, servidores propios). Local-first con cifrado en Worker es soberanía técnicamente verificable, no una promesa de marketing.

**Accesibilidad como ventaja competitiva.** El diseño 28px/Noto Sans no es cosmético — es exclusión inversa. WhatsApp, Telegram y similares están diseñados para usuarios entre 18-35 años con visión normal. Vuestro público objetivo (personas mayores, zonas rurales) está activamente mal servido por el mercado. Eso es un nicho real.

**Coste operativo cero.** Sin servidores, sin infraestructura, sin facturas de AWS. Una cooperativa de vecinos puede mantener esto sin presupuesto tecnológico. Eso es una ventaja estructural enorme frente a cualquier SaaS.

**Código auditable.** Open source con criptografía estándar (Web Crypto API nativa, sin librerías propietarias) significa que cualquier persona técnica puede verificar las garantías de seguridad. Eso construye confianza de forma sostenible.

---

## 😰 DEBILIDADES

**El problema de la clave perdida es devastador para el usuario no técnico.** Si un vecino de 75 años pierde su móvil y no tiene backup de su clave privada, ha perdido acceso a todos sus datos cifrados permanentemente. No hay "he olvidado la contraseña". La "Semilla de Recuperación Social" (recuperación distribuida entre vecinos de confianza usando Shamir Secret Sharing) es teóricamente elegante pero prácticamente compleja de explicar y ejecutar.

La solución honesta: ofrecer dos modos. Modo Búnker completo para usuarios que entienden las implicaciones, y Modo Sencillo con backup cifrado en un servicio externo (con advertencias claras). Forzar el modo máximo seguridad a todos es paternalismo técnico que puede destruir la adopción.

**Onboarding P2P es una fricción enorme.** El intercambio de claves en la plaza funciona si los vecinos ya están motivados. El primer vecino que instala la app y no puede hablar con nadie durante dos semanas abandona. Necesitáis masa crítica mínima (5-10 usuarios) antes de que la red sea útil. Ese es el problema del huevo y la gallina de toda red P2P.

**PWA en iOS es un ciudadano de segunda clase.** Esto no es opinión — es política de Apple documentada. Web Push en iOS llegó en iOS 16.4 (2023) y con restricciones. IndexedDB tiene límites de cuota más agresivos. El acceso a Bluetooth está bloqueado. Si vuestros usuarios tienen iPhones (común en España en todos los rangos de edad), la experiencia será degradada respecto a Android sin que podáis hacer nada al respecto desde el código.

**Mantenimiento a largo plazo sin financiación.** El open source sostenible requiere o voluntarios comprometidos o algún modelo de financiación. Sin eso, el proyecto tiene riesgo de abandono cuando Mestre Javi y Antigravity pasen a otros proyectos.

---

## 🚀 OPORTUNIDADES

**El timing político es favorable en Europa.** El RGPD, la Digital Markets Act, y el creciente escrutinio a Meta/Google crean un contexto donde instituciones públicas (ayuntamientos, diputaciones, consells comarcals) tienen incentivos políticos para apoyar alternativas soberanas. Una app avalada por un ayuntamiento valenciano que puede demostrar cumplimiento RGPD nativo (porque no hay servidores que auditar) tiene un argumento de venta institucional muy sólido.

**Cooperativas y economía social como canal de distribución.** Las cooperativas agrarias, asociaciones de regantes, comunidades de bienes, y federaciones de fallas tienen estructuras organizativas existentes, presupuestos propios, y necesidad real de comunicación interna privada. No necesitáis convencer a individuos uno a uno — necesitáis convencer a un presidente de cooperativa que ya tiene 200 socios.

**La IA como aliado pedagógico.** Una IA local (modelo pequeño, on-device) integrada en Sóc de Poble podría actuar como asistente de onboarding: explicar en valenciano/castellano qué es una clave pública, guiar el intercambio de QR, y responder dudas sin conexión. Eso elimina la barrera de comprensión sin necesitar formadores humanos en cada pueblo.

**Modelo replicable internacionalmente.** El problema que resolvéis (comunidades rurales excluidas del diseño tecnológico mainstream) existe en toda Europa, Latinoamérica, y el sur global. Si documentáis bien la arquitectura, otras comunidades pueden forkearlo y adaptarlo a sus contextos (lengua, cultura, infraestructura). Eso construye comunidad global alrededor del proyecto.

---

## ⚔️ AMENAZAS — ANÁLISIS SIN COMPLACENCIA

**La inercia social de WhatsApp es el mayor obstáculo, no la tecnología.**

No lo combatéis convenciendo a la gente de que WhatsApp es malo. Eso fracasa — la gente ya lo sabe y no le importa lo suficiente para cambiar. Lo combatéis ofreciendo algo que WhatsApp no puede ofrecer: funcionalidades específicas para la vida en el pueblo que Meta no tiene incentivos para construir. Gestión de turnos de riego, registro de acuerdos de asamblea con firma digital, mapa de recursos comunitarios offline. La privacidad es un argumento secundario — la utilidad concreta es el argumento primario.

**Apple como amenaza estructural.**

Apple tiene un incentivo financiero directo para que las PWA sean inferiores a las apps nativas de la App Store, donde cobra el 30% de todas las transacciones. No es una conspiración — es un modelo de negocio. Podéis mitigarlo con Capacitor para generar un wrapper nativo mínimo que publique en App Store, pero eso añade complejidad de mantenimiento y os mete en el ecosistema que intentáis evitar.

**Regulación como arma de doble filo.**

El mismo RGPD que os protege puede complicaros. Si un municipio decide usar Sóc de Poble para gestionar datos de vecinos (padrón, asociaciones, etc.), técnicamente sois un procesador de datos con obligaciones legales aunque no tengáis servidores. La responsabilidad se desplaza al ayuntamiento, pero alguien tiene que entender eso y firmarlo. Sin asesoría legal específica, este vector puede paralizar la adopción institucional.

**Data Brokers y la invisibilización algorítmica.**

No os van a banear activamente — eso crea publicidad. Os van a ignorar. Las búsquedas de "app para vecinos" en Google devolverán Nextdoor, Telegram, y WhatsApp durante años antes de que aparezcáis. La distribución orgánica en ecosistemas dominados por empresas con presupuestos de SEO/ASO millonarios es extremadamente difícil. Necesitáis canales alternativos: prensa local, radio comarcal, relaciones con ayuntamientos, presencia en fiestas mayores. Distribución física para una app digital.

---

## SÍNTESIS ESTRATÉGICA

El proyecto tiene fundamentos técnicos sólidos y un problema social real que resolver. Los riesgos de supervivencia no son técnicos — son de adopción, mantenimiento y sostenibilidad. Las tres preguntas que determinan si Sóc de Poble llega a 2030:

1. ¿Quién mantiene el código cuando Antigravity esté ocupado con otros proyectos?
2. ¿Cuál es el mínimo de usuarios necesario para que la red P2P sea útil, y cómo llegáis a ese mínimo en el primer pueblo?
3. ¿Tenéis un abogado especializado en protección de datos que entienda el modelo local-first y pueda avalar el proyecto ante instituciones?

La tecnología es la parte más fácil. Ya la tenéis casi resuelta.
