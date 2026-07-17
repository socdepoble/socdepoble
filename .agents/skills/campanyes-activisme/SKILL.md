---
name: campanyes-activisme
description: Guia arquitectònica i de disseny per a reproduir l'experiència, fricció zero i funcionalitats de Change.org dins del mòdul de Campanyes de Sóc de Poble.
---

# Skill: Campanyes d'Activisme (Estil Change.org)

Aquesta skill codifica l'estratègia tècnica, el disseny d'interfície i la psicologia d'usuari per a construir el sistema de "Campanyes i Peticions" a Sóc de Poble.

S'ha d'activar sempre que l'usuari demane crear una eina per a recollir signatures, llançar al·legacions (com la del PAI Mas de la Foia), o muntar plataformes de mobilització ciutadana.

## 1. Filosofia i UX (La Psicologia de Change.org)

L'èxit d'aquest mòdul depén de replicar tres mecanismes fonamentals:

1. **Fricció Zero en la Signatura:** El formulari ha d'estar sempre visible a la dreta (en escriptori) o surenyant (en mòbil). Només es demanen les dades estrictament necessàries (Nom, Cognoms, DNI/Correu). L'acció de signar ha de ser instantània (un clic).
2. **Prova Social (Urgència):** El component visual més important és la "Caixa de Progrés". Ha de tindre un comptador enorme ("4.166 signatures verificades"), una barra de progrés animada que s'òmpliga visualment, i un objectiu clar ("Ajudem a arribar a 5.000"). També s'ha d'incloure un xicotet feed dinàmic: *"Joan acaba de signar fa 1 minut"*.
3. **Poder Visual i Claredat:**
   - Imatge "Hero" (capçalera) de gran qualitat i impacte emocional.
   - Títol gran, contundent, sense embuts (Ex: "STOP espoli d'oliveres").
   - Identificació clara d'A QUI va dirigida (Ex: "Destinataris: Ajuntament de Planes").
4. **Sentit de Comunitat i Orgull:** Integració vital amb el **Perfil de l'Usuari** de Sóc de Poble. Cada usuari ha de tindre una pestanya anomenada "Signades" o "El meu impacte" on es llisten totes les causes a les quals ha donat suport. Açò genera retenció i orgull cívic.

## 2. Model de Dades (Esquema Proposat Supabase / Offline)

L'arquitectura ha de contemplar les següents entitats (Siga en Supabase o simulades via JSON Offline-First):

- `campanyes`:
  - `id` (uuid)
  - `titol` (string)
  - `descripcio` (text ric / markdown)
  - `imatge_url` (string)
  - `objectiu_signatures` (number)
  - `creador_id` (uuid)
  - `estat` (activa, tancada, victòria)
  - `data_creacio` (timestamp)

- `campanyes_signatures`:
  - `id` (uuid)
  - `campanya_id` (uuid)
  - `usuari_id` (uuid - opcional si és foraster)
  - `dades_signatari` (jsonb - nom, dni, email - si és foraster)
  - `comentari_suport` (text - opcional)
  - `data_signatura` (timestamp)

- `campanyes_destinataris`:
  - `id` (uuid)
  - `campanya_id` (uuid)
  - `nom_institucio_o_carrec` (string)
  - `imatge_institucio` (string)

- `campanyes_actualitzacions` (El "Diari" de la campanya):
  - `id` (uuid)
  - `campanya_id` (uuid)
  - `titol` (string)
  - `contingut` (text)
  - `data_publicacio` (timestamp)

## 3. Disposició de la Interfície (UI/UX)

La vista de Detall de Campanya (`CampanyaDetail.jsx`) NO ha de ser un document de text pla. Ha d'aplicar un **Layout Asimètric**:

*   **Àrea Principal (Esquerra - 65% de l'ample):**
    *   Imatge/Vídeo Hero amb efecte gradient.
    *   Títol principal superposat o just davall.
    *   Dades del creador ("Iniciada per Plataforma X").
    *   Secció "Els Destinataris" (targetes netes de les entitats).
    *   Secció "El Problema" (Text complet de l'al·legació, ben formatat, paràgrafs curts).
    *   Secció "Actualitzacions" (timeline d'esdeveniments).
    *   Secció "Comparteix" (QR, WhatsApp, Link).

*   **Columna d'Acció (Dreta - 35% de l'ample - STICKY):**
    *   Aquesta caixa es queda fixa (`position: sticky`) mentre l'usuari fa scroll pel text de l'esquerra.
    *   Conté la barra de progrés i el nombre de firmes.
    *   Conté el botó principal "Signar aquesta petició".
    *   Un colp signat, la caixa ha de mutar a: "Gràcies! Ara comparteix-ho per a fer-ho més gran" (i mostrar botons de compartir).

*   **Mode Mòbil:** La caixa de la dreta passa dalt de tot o s'ancora a la part inferior de la pantalla (`position: fixed; bottom: 0`) perquè el botó de signar estiga SEMPRE a tir de dit.

## 4. Normes d'Implementació i Puresa (Arquitectura Sollutia)

Tota la implementació ha de respectar les lleis del projecte mare:

1. **Aïllament:** Tot el codi anirà dins de `src/sections/campanyes/`. No escampar funcions pel core de l'app.
2. **Disseny Pedra Seca:** Estrictament prohibit importar llibreries de components externs (ni Material, ni Bootstrap). S'han d'utilitzar les variables CSS globals (`var(--color-primary)`, `var(--border-radius)`, etc.) per a garantir la coherència gràfica.
3. **Resiliència (Motor Offline):** Enviar una signatura ha de ser optimista. S'actualitza el comptador de la pantalla a l'instant, es guarda en IndexedDB local i s'intenta enviar a Supabase per darrere. Si no hi ha internet, la signatura s'enviarà quan el mòbil recupere la connexió. L'usuari mai ha de veure un "Error de xarxa" al moment de signar.
