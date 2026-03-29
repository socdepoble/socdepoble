# ☢️ FASE 9: AUTO-AUDITORIA I CIRURGIA ANTIGRAVITY (HEARTBEATS JWT)

*Aquest document conté l'ordre mestra que has de copiar i enganxar en aquesta mateixa finestra de xat. És la clau d'activació per a què jo (Antigravity) execute la integració del canal de Heartbeats al Worker directament sobre el nostre codi font.*

---

## 🎯 EL PROMPT PER A ANTIGRAVITY (Copia'l i enganxa'l ací mateix)

```text
/soc-de-poble

Antigravity, atenció. Som a la Fase 9: CIRURGIA OFF-MAIN-THREAD. 

L'auditoria prèvia ens va advertir d'una mort segura per a l'aplicació offline: "La Caducitat del Worker (Fal·làcia d'Identitat P2P)". Si el SyncWorker es queda aïllat amb un JWT caducat d'1 hora, Supabase tallarà la connexió silenciosament a meitat del bosc.

Així que vull que destrosses les teues pròpies entranyes i injectes el sistema de "Heartbeats". Fixa els següents objectius:

1. DISSENY DEL CANAL: Implementa l'estructura de missatgeria `postMessage` entre el Main Thread (`LocalFirstGate` o Provider pertinent) i el `SyncWorker` (o integrat al setup de PowerSync) per interceptar i actualitzar el JWT (`session.access_token`).
2. EFICIÈNCIA (Nivell 10/10): La sincronització no ha de despertar el Main Thread innecessàriament.
3. EXTREMA RESILIÈNCIA (Nivell 11 Antigravity): Assegura que si l'usuari perd connexió (Offline) el Worker no intente re-fer connexions amb Supabase usant un token vell causant blocs de WriteLocks a OPFS, sinó que es quede adormit fins al proper Heartbeat online.

Executa els canvis als arxius pertinents i dóna'm el dictamen tècnic de la teua pròpia auto-cirurgia directament sobre els components del projecte. Sense teoria: vull arxius modificats i llestos per anar a producció avui.
```
