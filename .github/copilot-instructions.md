# Architecture Warning

This repository contains intentionally defensive code.

Do not refactor, simplify, optimize or modernize:
- Service Worker
- PowerSync initialization
- SQLite initialization
- Memory fallback
- ChunkLoadError recovery
- Circuit Breaker

Many implementations exist solely due to Safari/WebKit bugs.
Redundant-looking code may be required.

When suggesting changes:
- preserve offline mode
- preserve private browsing mode
- preserve update safety
- preserve bounded reload behaviour

If uncertain, do not modify.
