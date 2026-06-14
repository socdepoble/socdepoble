# ACTA 13
**ID:** 2026-06-13_1825_ACTA_consola-multinivell-explicativa.md
**Data:** 2026-06-13
**Hora:** 18:25
**Categoria:** ACTA
**Títol:** consola-multinivell-explicativa
**Estat:** Acordada

## 1. Context
- **Què ha passat:** S'ha arrencat el "Visor Nano" i el Mestre veu un tauler ple de mètriques complexes al costat de la consola nativa del navegador. L'aplicació funciona, però no hi ha comprensió del propòsit de cada dada.
- **Per què importa ara:** Perquè tenim màquines mesurant l'estat del sistema i l'usuari, però sense una traducció humana (Trellat), les dades són soroll informàtic.
- **Quin problema hi ha damunt la taula:** Cal una eina dins de l'aplicació que explique de forma comprensible què és cada cosa, lligant la màquina amb la visió humanista i psicològica.

## 2. Prompt Base
- **Objectiu:** Definir una norma de disseny per a la interfície explicativa del Visor Nano i tota plataforma de "Sóc de Poble".
- **Destinataris:** Desenvolupadors Front-end i membres de l'Eixam encarregats del disseny.
- **Entrada clau:** Reflexió del Mestre exigint una explicació multinivell per a evitar la frustració de l'usuari i donar sentit a les mètriques.
- **Sortida esperada:** Fixar la regla de la "Triple Explicació".

## 3. Captura / Evidència
- **Tipus:** Captura de pantalla amb el Visor Nano obert a l'esquerra i la consola del navegador (DevTools) a la dreta amb logs de Supabase i Vite.
- **Què mostra:** Tècnicament, la màquina està funcionant a la perfecció. Cognitivament, el Mestre està cec perquè la consola de DevTools no parla l'idioma del Trellat.
- **Acció sobre la captura:** Contestar aclarint què és la captura i redactar aquesta acta.

## 4. Consens de l’Eixam
- S'acorda que no podem delegar l'explicació de l'aplicació a un log de consola de desenvolupador. Cal crear un component nadiu dins del Visor Nano dedicat exclusivament a la traducció de mètriques.

## 5. Accions
S'estableix com a **Llei de Disseny (Llei de la Consola Transparent)**:

Tot indicador, panell o mètrica rellevant a "Sóc de Poble" ha de tenir accés a un panell explicatiu que continga, sense excepció, tres definicions:
1. **L'Enfocament Humà (Usuaris sense experiència):** Què significa això en el món real de forma clara i planera.
2. **L'Enfocament Informàtic (Enginyers):** Què està passant tècnicament (cost en bytes, temps de CPU, on es guarda la dada).
3. **L'Enfocament Psicològic (Relació Màquina-Humà):** Quines tècniques s'apliquen per lligar l'estat del sistema amb l'estat de l'usuari, buscant patrons i imatges mentals.

## 6. Riscos i Notes
- **Risc de UX:** Crear una consola "molt allargada" pot trencar el *Zero Thrashing* visual si no es fa bé. Caldrà implementar-ho com un panell lateral (*Side-panel*) o seccions en acordió que es puguen llegir amb calma sense interrompre l'operativa.
- **Recordatori:** Aplicar aquesta llei immediatament quan es reprenga la maquetació del Visor Nano.

## 7. Tancament
- **Resultat:** Resolut. Fixat en acta per a tota l'arquitectura.
- **Pròxim pas:** Dissenyar aquest panell de Triple Explicació quan toquem el codi del Visor Nano.
