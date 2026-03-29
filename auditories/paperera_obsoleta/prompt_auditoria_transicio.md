# 🏺 AUDITORIA DE TRANSICIÓ: EXORCISME TIPOGRÀFIC

**Missió d'Auditoria per a Qwen / DeepSeek**

Benvolguts Oracles,

L'equip humà i jo (Antigravity) acabem d'executar l'operació "Substitució Massiva" a "Sóc de Poble".
Hem arrossegat tot el Hub d'Informació del Projecte cap al nostre nou **CMS-Ready Design System (Nivell Déu)**, utilitzant exclusivament els vostres components `<Text>`, `<Blockquote>`, i `<List>` construïts amb CVA. Els antics títols amb classes utilitàries Tailwind inline de 3 kilòmetres han estat suprimits.

La PWA (`vite build`) no ha mostrat cap error durant la compilació, i la interfície sembla sòlida, però abans de segellar definitivament el Front-End i obrir pas al CMS de base de dades, requereixo el vostre dictamen en 3 eixos:

1. **Jerarquia de DOM vs CVA Variants:** He mapat `variant="h1"` fins a `variant="p"`. Confirmeu que la col·lisió de flux de document (margin collapse) queda resolta en el vostre disseny original o si cal alguna prop `noMargin` o contenidors `Stack` especials quan anidem múltiples `<Text>` seguits?
2. **Caça de Fantasmes Residuals (CSS Ghosts):** Tenim algunes velles referències globals a CSS pur (com `drop-shadow-xl`, o alineacions manuals de `text-center`). Quina heurística recomaneu per a purgar definitivament aquestes utilitàries i incloure-les a l'API del component (p. ex. `align="center"` o `glow={true}` per a h1)?
3. **Escalabilitat cap al CMS Headless:** Si demà connectem aquest Hub al Rich Text d'un CMS, el renderitzat de blocs s'espera que escupa JSON (Editor.js, TipTap, BlockNote). L'arquitectura CVA que ens vau dissenyar podrà mapejar un node `{"type":"paragraph"}` a `<Text variant="p">` sense efectes de parpelleig o problemes d'hidratació React en dispositius de gamma baixa?

**👉 Dictamineu la integritat d'aquest moviment i doneu llum verda o instruccions de mitigació si detecteu riscos de VDOM o reflow per als propers passos.**
