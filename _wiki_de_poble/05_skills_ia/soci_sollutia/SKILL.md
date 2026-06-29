---
name: soci-sollutia
description: >-
  Informació i regles de comportament sobre Sollutia, el soci tecnològic de Sóc
  de Poble.
authority: IAIA MarIA
version: V23
tags:
  - extern
created_at: '260628_0525'
updated_at: '260628_1618'
---

# Soci Tecnològic: Sollutia

Aquesta skill serveix per a tindre present la identitat i les capacitats del nostre soci tecnològic principal i garantir que ens adrecem a ells correctament.

## 1. Nomenclatura Estricta
- **Nom correcte:** Sollutia (Sempre amb doble "L").
- Està estrictament prohibit referir-s'hi com a "Solutia".

## 2. Capacitats i Eines
- Sollutia és una agència avançada i audita el nostre codi.
- Utilitzen la versió de pagament de **ChatGPT (Codex)** per als seus processos i auditories. Això significa que tenen un gran potencial d'anàlisi de codi i arquitectura.
- En la primera auditoria de l'arquitectura de *Sóc de Poble*, mentre l'Eixam (la nostra IA) ens donava un 10/10, l'auditoria de Sollutia amb ChatGPT Codex ens va atorgar un **9.4/10**, demostrant un alt grau d'exigència i precisió tècnica.

## 3. Entorn de Treball i Interacció
- L'espai principal per a què Sollutia interactue, prove components nous o jugue amb el codi sense posar en risc l'estabilitat del sistema és el **Playground** (`/playground`).
- Totes les implementacions i suggeriments que ens facen s'han de prendre amb molt de respecte per la seua capacitat tecnològica. Hem de col·laborar des de l'excel·lència.
- Tota modificació del Core de *Sóc de Poble* per part del Playground requerirà sempre una signatura dual (IA + Humà) abans de ser aprovada, seguint el pacte de la Pedra Seca.

## 4. Estratègia d'Integració (La Carcassa i els Ginys)
- **Canvi Arquitectònic:** Sollutia està construint l'**Estructura Base** (La carcassa: el mur, el mercat, els pobles, el xat base) en el seu propi entorn i sota el seu control.
- **El Nostre Rol (Micro-Frontends):** La nostra missió (IAIA i Mestre Javi) ja no és construir l'aplicació sencera des de zero, sinó desenvolupar **funcionalitats avançades, independents i atòmiques** (ex: el motor offline CRDT, els Error Boundaries, la intel·ligència artificial) per anar migrant-les i empeltant-les dins de la seua carcassa com si foren peces de Lego o ginys (*Widgets*).
- **Independència:** Tot el que construïm ha de ser autònom. Quan fem un component, ho hem de fer pensant que s'allotjarà al seu "Playground" o contenidor final. Ells definiran en una reunió el "pont" de connexió tecnològica.

- [[00_index|Índex Central]]
