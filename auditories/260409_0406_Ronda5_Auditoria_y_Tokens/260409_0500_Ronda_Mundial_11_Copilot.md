> 📂 **Arxiu/Ruta:** `./auditories/260409_0406_Ronda5_Auditoria_y_Tokens/260409_0500_Ronda_Mundial_11_Copilot.md`

### DAFO Geopolítico y Sociotécnico

#### Fortalezas
- **Autonomía offline**: arquitectura PWA + IndexedDB + WAL + CAS permite lectura y escritura sin dependencia de la nube; reduce vector de fallo por cierre de proveedores.  
- **Contenido firmado y verificado**: manifest con checksums y firmas (Ed25519/ECDSA) garantiza integridad y dificulta manipulación local o MITM en entornos desconectados.  
- **Diseño de bajo consumo**: virtual scrolling absoluto (3 nodos), fetch budgeting y throttling térmico minimizan picos de CPU y memoria, prolongando vida útil de dispositivos antiguos.  
- **Resiliencia de almacenamiento**: hybrid store (Cache para shell, IDB chunked + WAL para blobs) con LRU y compaction controlada evita dependencia de políticas internas del navegador.  
- **Sincronización eventual segura**: modelo CAS + CRDT/anti‑entropy para metadatos y anotaciones evita conflictos destructivos en P2P y permite reconciliación offline.  
- **Transparencia y exportabilidad**: contenido versionado y direccionado por hash facilita auditoría, migración y preservación cultural fuera de proveedores comerciales.

#### Oportunidades
- **Soberanía local**: comunidades pueden operar nodos de intercambio (USB, Wi‑Fi Direct, Raspberry Pi) que actúen como repositorios locales firmados, reduciendo necesidad de infraestructura central.  
- **Economía de mantenimiento baja**: con herramientas de build automatizadas y manifest firmado, mantenimiento puede delegarse a voluntariado técnico local y procesos de verificación automatizados.  
- **Interoperabilidad**: adoptar estándares CAS/Merkle y CRDT facilita integración con otras iniciativas de preservación y redes mesh comunitarias.  
- **Capacitación y resiliencia social**: proyecto puede convertirse en vector educativo para alfabetización digital rural, creando custodios locales del sistema.  
- **Modelos de financiación alternativos**: microdonaciones, cooperativas y subvenciones públicas para soberanía digital pueden sostener nodos y backups físicos.

#### Debilidades
- **Dependencia del navegador**: comportamientos no documentados de WebKit/Safari (quota, jetsam, implementaciones parciales de WebCrypto) son un punto de fragilidad fuera del control del proyecto.  
- **Complejidad operativa**: WAL, chunking, LRU, CRDT y firma requieren disciplina en build y despliegue; errores humanos en el pipeline pueden introducir corrupción o incompatibilidades.  
- **Capacidad limitada de dispositivos**: iPad A10 y hardware similar tienen límites físicos que obligan a degradaciones agresivas; experiencia de usuario puede variar mucho.  
- **Supervisión y forensics locales**: sin telemetría central (por privacidad), detectar fallos sistémicos a escala requiere coordinación humana y procesos de reporte comunitario.  
- **Riesgo de fragmentación de datos**: múltiples forks locales sin políticas de anti‑entropy pueden generar crecimiento de almacenamiento y duplicación.

#### Amenazas
- **Política y regulación**: cambios regulatorios que limiten intercambio P2P o impongan requisitos de contenido podrían complicar despliegue en ciertas jurisdicciones.  
- **Cierre de plataformas**: actualizaciones de navegadores que cambien quota o APIs (WebCrypto, IDB) pueden degradar o romper funcionalidades críticas.  
- **Ataques de disponibilidad**: actores con recursos pueden intentar saturar peers con versiones conflictivas o forzar quota exhaustion mediante pushes maliciosos.  
- **Corrupción y manipulación local**: dispositivos comprometidos o usuarios con malas prácticas pueden introducir contenido corrupto si las verificaciones no se aplican estrictamente.  
- **Obsolescencia tecnológica**: formatos de compresión, codecs o APIs que caigan en desuso pueden complicar lectura de assets en décadas futuras.

---

### Test de Caja Negra — Vectorización desde la Ignorancia

#### Qué haría un adversario que recibe socdepoble.org en frío
- **Reconocimiento pasivo**: inspección del manifest, cabeceras HTTP, políticas CORS, SW y exposición de endpoints `/fragments/`.  
- **Ataques de disponibilidad simples**: intentar `install` del SW con `caches.addAll` masivo (si el SW lo permite) para forzar OOM en Safari; lanzar múltiples peticiones concurrentes a fragments para medir límites de conexión.  
- **Manipulación de contenido**: si fragments no están firmados, intentar servir versiones corruptas o con scripts inyectados (MITM o DNS poisoning) para provocar reflows, XSS o corrupción de manifest.  
- **Quota exhaustion**: empujar grandes blobs vía P2P o pushes repetidos para agotar almacenamiento y forzar purgas del navegador.  
- **Fuzzing de sync**: enviar versiones conflictivas repetidas para forzar crecimiento indefinido de objetos en IDB y provocar QuotaExceededError.  
- **Explotación de fallbacks**: forzar modos degradados (offline parcial) y observar si el cliente cae en estados inseguros o sin contenido.

#### Cómo resistiría y contraatacaría el núcleo endurecido
- **Validación previa a persistencia**: SW e IDBGuardian rechazan y no persisten fragments sin checksum y firma válidos; adversario no puede forzar almacenamiento de contenido corrupto.  
- **WAL y rollback**: escrituras interrumpidas quedan en WAL; en reinicio se detectan y se reponen o descartan, evitando corrupción parcial.  
- **Budget engine y semáforos**: fetchQueue con concurrency limitada y AbortController cancela ráfagas de peticiones; prefetchBudget impide flood.  
- **Eviction determinista**: LRU local y compaction evitan que pushes maliciosos crezcan indefinidamente; políticas de quota por origen y por peer bloquean abusos.  
- **Anti‑entropy y Merkle diff**: peers solo intercambian hashes y piden chunks faltantes; un adversario no puede forzar descarga masiva sin pasar por budget checks.  
- **Modo seguro y forensics**: si firmas fallan repetidamente, cliente entra en safe mode y muestra alerta; snapshots firmados permiten restauración desde copia conocida buena.  
- **Rate limiting P2P**: peers con comportamiento anómalo son desacreditados por reputación local y bloqueados; pushes rechazados si exceden storageBudget.

---

### Calificación Final de Resiliencia

| **Aspecto** | **Puntuación (1–10)** | **Justificación breve** |
|---|---:|---|
| **Integridad de contenido** | **9** | Firmas + checksums + WAL reducen casi totalmente riesgo de corrupción local. |
| **Disponibilidad offline** | **8** | Hybrid store y streaming mitigaciones fuertes; vulnerabilidad residual por políticas de navegador. |
| **Resistencia a ataques de cuota** | **7** | LRU y budget engine limitan impacto; navegadores pueden purgar sin aviso. |
| **Escalabilidad P2P** | **7** | CRDT + Merkle son sólidos; requiere gobernanza para evitar crecimiento descontrolado. |
| **Mantenibilidad a largo plazo** | **6** | Requiere disciplina en build, firmas y actualizaciones; riesgo humano y obsolescencia. |
| **Calificación global** | **7.5** (redondeo técnico: **8/10**) | Arquitectura es robusta y bien pensada para soberanía local; principales riesgos son externos (navegador, regulación, mantenimiento humano). |

---

### Testamento de Despedida
**Directriz final**: **Firma siempre; escribe por partes; verifica antes de confiar.**  
Una máxima técnica para custodios: **prioriza la integridad sobre la conveniencia** — un fragmento firmado y legible mañana vale más que mil copias corruptas hoy.

Si queréis, ahora entrego el paquete final con: scripts de build (split + Puppeteer measure), SW streaming + validación, IDB WAL + LRU, P2P Merkle/CRDT skeleton y el harness de caja negra para pruebas en iPad A10. Confirmad y lo exporto como un único paquete listo para integrar.
