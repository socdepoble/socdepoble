# 🔬 SOL·LICITUD D'AUDITORIA VISUAL I ESTABILITAT
**Per a l'Oracle: DEEPSEEK**

Benvolgut DeepSeek,

Hem implementat un nou Design System Tipogràfic CMS-Ready (amb components `Text`, `Blockquote`, `List`) i estem a punt de llençar-lo sobre els components massius i heretats del projecte "Sóc de Poble", començant per la nostra `UniversalCard` i el `HubView`.

El client assenyala que, darrere d'aquests canvis recents, encara hi poden haver "fantasmes de disseny", és a dir, col·lisions on els nous CSS Tokens i el model Flexbox col·lapsen a nivell intern.

### LA TEVA MISSIÓ COM A "CSS & LAYOUT EXTREME DEBUGGER":
Com a enginyer sènior, no necessito codi rutinari, necessito la teva ment de compilador:
1. **Vulnerabilitats d'Herència:** Quins trencaments de `line-height`, `margin-collapse` o sobredimensionament (`flex-1`, `truncate`, `min-w-0`) podem esperar al substituir elements natius (`div/span` plens de tailwind) pels meus nous components polimòrfics `<Text variant="...">` i `<Button context="inline">`?
2. **Guia d'Aïllament:** Quin és el llistat estricte de regles per auditar visualment la `UniversalCard` quan passem el seu text lliure a l'editor de blocs restringit?
3. **Escut de Contenidors:** Quines classes *wrapper* de Tailwind has d'assegurar sempre en l'arrel on conviuran múltiples components `<Text>` amb `mb-5` (marges mòbils) per tal que res salti fora de l'ordinador o sobreescrigui les barreres mòbils?

Analitza el factor de risc global de substituir el codi *inline* i dona'm les pautes d'auditoria que m'estalviïn asseure'm a resoldre puzles de graella CSS. Actua sense pietat cap a la complaença. 
