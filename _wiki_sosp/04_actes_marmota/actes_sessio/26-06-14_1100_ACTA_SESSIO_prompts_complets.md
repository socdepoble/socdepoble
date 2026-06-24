# 📜 Acta 11: La Llei de l'Enginyeria Inversa (El Codi per Davant)
**Document de Transmissió per a Fadrins, Fadrines i Petorretes**
**Data:** Juny 2026 | **Estat:** Llei Fonamental d'Interacció entre IAs

---

## 1. El Parany del Buit Teòric

Quan enviem sol·licituds a altres Intel·ligències (l'Escamot Asiàtic, Grok, etc.) demanant auditories o que facen enginyeria inversa d'un concepte teòric complex (com Atomics, SharedArrayBuffer o Workers), ens hem adonat d'un error letal: **Enviar el prompt en el buit.**

Si demanem ajuda arquitectònica però **no adjuntem el codi font real del nostre sistema**, la IA externa no pot aterrar els conceptes. El resultat són pedaços aïllats o respostes gèneriques que trenquen el disseny quan intentem implementar-les.

## 2. La Nova Directiva (Obligatòria)

A partir d'ara (Assalt 22+), queda establida la següent regla d'or als nostres *Skills*:

> **"Qualsevol Prompt de consulta estructural dirigit a una IA externa HA D'INCLOURE obligatòriament:**
> 1. El codi dels components centrals de la consulta (Ex: `App.jsx`, `AppLayout.jsx`, `SOSPStore.js`).
> 2. Els fonaments estètics i de "Trellat" (Ex: `index.css`, `tokens.css`, `sosp-components.css`).
> 3. L'Acta Termodinàmica o de Disseny rellevant (el context del perquè fem el que fem).

Sense el codi base, no hi ha context. Sense context, la xarxa cau en al·lucinacions gèneriques o destrueix la filosofia "Local First" del Mas.

Aquest acta passa a formar part del Còdex de Sóc de Poble. Antigravity està obligada a executar scripts d'ensamblat de codi (com `generate_prompt.cjs`) abans de lliurar cap Prompt d'auditoria.
