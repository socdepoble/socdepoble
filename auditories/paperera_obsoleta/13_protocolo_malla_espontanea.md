# 📡 PROTOCOLO NIVEL 13: MALLA ESPONTÁNEA & CEREBRO DE BOLSILLO
**Autor:** Qwen (Distinguished Engineer - DARPA Standard)
**Estado:** ARQUITECTURA SOBERANA
**Fecha:** 29 Marzo 2026

## 🎯 FILOSOFIA
La infraestructura de telecomunicaciones es débil, pero la infraestructura social es fuerte. Transformamos cada dispositivo en un nodo de la red. Si un móvil tiene datos, el pueblo tiene datos.

---

## 🕸️ PILAR 1: MALLA DE SYNC VIRAL (WEBRTC + CRDTs)
Uso de `yjs`, `y-webrtc` y `y-indexeddb` para fusionar el estado de dos móviles que se encuentran sin cobertura (ej. en la montaña). 
- Signaling offline vía "QR Handshake" (escanear QR para pasarse las credenciales P2P).
- Sincronización libre de conflictos matemáticas. Cuando uno de los dos vuelve a 3G, sube los cambios de ambos por defecto.
- Componente UI: `MeshStatusBadge` que indica si estás en modo Cloud, Mesh (P2P) u Offline aislado.

---

## 🔍 PILAR 2: MOTOR DE BÚSQUEDA DESCONECTADO (FLEXSEARCH + FUZZY)
Si no hay red, la búsqueda en el Directorio sigue siendo instantánea y tolerante a faltas de ortografía.
- En Build Time: `generate-search-index.ts` descarga de Supabase todos los datos y crea un JSON estático.
- En Runtime: `useOfflineSearch.ts` descarga ese JSON, lo carga en IndexedDB y monta un índice `FlexSearch` en memoria.
- Soporta búsquedas fuzzy (ej. "pastsseria" -> "Pastisseria") en milisegundos sin tocar la red.

---

## 🧠 PILAR 3: PRECOGNICIÓN CUÁNTICA DE INTERFAZ (TENSORFLOW.JS LITE)
Inyección de Machine Learning local (`@tensorflow/tfjs`) que corre en el hilo secundario para aprender los patrones semanales de uso sin mandar datos afuera.
- `useInterfacePrecognition`: loguea la ruta, hora, día de la semana y entrena un modelo Naive Bayes.
- `PredictiveHomeScreen`: Altera el orden de los accesos directos adivinando lo que vas a hacer. Si es sábado por la mañana, adivina que buscas "Horarios de Panadería". 

---

## 📊 RESUMEN EVOLUTIVO
- **Nivel 11:** La ilusión del 0ms (Cinematografía GPU).
- **Nivel 12:** La inmortalidad offline (Caching y Supervivencia Energética).
- **Nivel 13:** La inteligencia colectiva (Mesh P2P Edge AI).
