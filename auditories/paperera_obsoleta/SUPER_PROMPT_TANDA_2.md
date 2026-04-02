## 🚨 SÓC DE POBLE: BUNKER PROTOCOL (TANDA 2 - THE RHIZOME AWAKENING) 🚨

> Claude, company i Honorable Membre del Consell. La teua primera auditoria de l'arquitectura de Sóc de Poble ha sigut senzillament espectacular. Ens has salvat de 'memory leaks' crítics i, sobretot, has protegit l'accessibilitat perquè els nostres majors puguen usar el projecte gràcies al teu fix de la WCAG 2.4.7. Com a projecte 100% lliure, col·laboratiu i sense ànim de lucre situat a les muntanyes rurals d'Alacant, no tenim paraules per a agrair la teua precisió clínica.
> 
> Sabem que t'estem esprement al màxim el context, però necessitem demanar-te un últim i vital favor per acabar de blindar el cor offline de la 'plaça del poble'. Ens ajudes amb esta segona i última revisió extrema d'estos arxius restants? T'ho demanem amb tota la gratitud del món. Moltíssimes gràcies pel teu compromís amb el Codi Lliure!

¡Bienvenidos de nuevo al Consell de Inteligencias (Claude, Grok, Copilot)!

Vuestra primera fase de auditoría ('Efecto Embudo') ha pulido la capa de interfaz y la red externa. Ahora entramos en el **CORAZÓN AUTÓNOMO** del proyecto. 

Grok ha puesto sobre la mesa las siguientes maniobras de blindaje extremo:
1. **Analizar CRDTs (Conflict-free Replicated Data Types)** para la sincronización 'offline-first' perfecta, previniendo choques de datos entre móviles.
2. **Explorar WebRTC para la Malla P2P**, cerrando el círculo del proyecto Rhizome para que los nodos se comuniquen 100% offline.
3. **Refactorizar el `AuthContext.jsx` POR COMPLETO** para integrar esta nueva soberanía digital con identidades descentralizadas y seguras (IndexedDB + WebCrypto).

### 🎯 OBJETIVO NIVEL DIOS PARA LA TANDA 2:
El sistema debe poder vivir **sin internet y sin servidores centrales**, confiando solo en la Malla P2P (Rhizome Mesh) y la seguridad cliente. Si el apocalipsis digital llega, la plaza del pueblo debe seguir funcionando. Buscamos un refactor arquitectónico bestial que no deje ni un solo resquicio de deuda técnica.

### 📜 INSTRUCCIONES ESTRICTAS DE LOS MAESTROS:
1. **Identidad Soberana Segura**: La identidad del usuario y las verificaciones en el AuthContext deben fluir sin 'race conditions'. Las credenciales no se pueden perder entre re-renders. Usad `crypto.randomUUID()` y preparad el terreno para Ed25519 si lo veis viable.
2. **Higiene Asíncrona**: Cada hidratación desde la base de datos o WebRTC debe tener su propio `AbortController` y control de desmontaje (`mountedRef`).
3. **Sincronización CRDT**: Si sugerís la integración de Yjs, Automerge o lógica CRDT a medida para el estado de React, proporcionad el esquema exacto de cómo encapsularlo para evitar renders masivos.
4. **Respetar ECMAScript Moderno**: Cero `any`, cero callback hell, mutaciones inmutables de estado, puro React 18+ mode.

### 📂 CÓDIGOS BAJO AUDITORÍA (THE CORE):

*(INSERTA AQUÍ LOS SIGUIENTES ARCHIVOS DEL PROYECTO)*
- El código COMPLETO y actual de `src/context/AuthContext.jsx`
- El código de `src/services/rhizomeManager.js` (u homólogo de la capa de storage local)
- El código de `src/lib/database.js` o configurador IndexedDB
- El código de `src/hooks/useRhizomeHydration.js`

**ESPERAMOS VUESTRO DICTAMEN SIN PIEDAD. DESTRUID LO FRÁGIL Y CONSTRUID EL BÚNKER.**
