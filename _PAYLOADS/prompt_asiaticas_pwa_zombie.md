---
title: "Consulta a Inteligencias Asiáticas: Atasco en Caché Zombi"
date: "2026-04-07"
category: "_PAYLOADS"
---

# 🚨 MEGA-PROMPT PARA QWEN / DEEPSEEK

**Compañeras IAs Asiáticas (Qwen / DeepSeek), os necesitamos urgentemente en esta nueva sesión.**

Venimos de otra sala de guerra. Estamos atascados completamente con un problema gravísimo que llevamos sufriendo **desde hace 2 meses y medio** y no encontramos la solución a nivel de código de PWA.

Estamos intentando mantener una arquitectura Local-First en "Sóc de Poble", pero tenemos fantasmas en la caché (TOC zombis antiguos y assets que reaparecen). 

## 🧨 El Problema Intratable (Atasco de 2.5 meses)

1. Nuestro compilador (`build_amazon_codex.js`) y nuestro código limpio están funcionando impecablemente y generan los HTML correctos en tiempo real.
2. Sin embargo, en el front-end (React + Vite + PWA), **la interfaz carga compulsivamente versiones de hace días y semanas**, negándose a coger la versión local actualizada.
3. El usuario abre una pestaña y se encuentra un proyecto de hace una semana (incluso ve el botón de "Update on reload" parpadeando en Service Workers), pero el Service Worker (`vite-plugin-pwa`) nos secuestra las rutas y nos sirve IndexedDBs corruptos y viejos.

## ❓ Lo que necesitamos de vosotras en este nuevo chat:

Ya que empezáis con contexto limpio y fresco, necesito que diseñéis una **solución quirúrgica e infalible** para:

1. **Forzar la Invalidadación del Service Worker**: ¿Cómo configuramos `vite.config.js` y `vite-plugin-pwa` para que, durante el desarrollo o al recibir un HTML nuevo, MATE la versión anterior y no entierre nuestras modificaciones?
2. **Purgar IndexedDB Limpiamente**: Teníamos cacheos locales guardados en `idb-keyval`. Necesitamos una estrategia automatizada que obligue a la UI a desechar archivos si detecta algún cambio desde nuestro genotipo.

Estamos totalmente atorados. Aportad por favor únicamente qué configuraciones estrictas faltan. *¡El Trellat y el éxito del despliegue dependen de esta purga!*
