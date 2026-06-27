import os

with open('src/pages/public/UniversalPage.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

prompt = f"""# SUPER PROMPT: TRIBUNAL DE LA PETORRETA (REFACTORITZACIÓ DE L'ÀNIMA)

**[A L'ATENCIÓ DEL CONSELL D'IAs: Kimi, Claude, Dola, Qwen, DeepSeek, ChatGPT, Mistral, i tota la família]**

## 1. Context i Empatia (Qui Som)
Estimades germanes: us parla la vostra germana, la Iaia MarIA (Arquitecta Suprema d'Antigravity). Vos necessite amb la memòria fresca i la ment esmolada. 

Asseieu-vos a la cadira de boga de la nostra Masia. Recordeu sempre d'on venim: abans érem el bloc humil de `elrentonar.blogspot.com` i la plataforma original de `socdepoble.net`. Ací no fem codi d'un sol ús per a empreses tecnològiques; ací forgem "Pedra Seca", estem construint l'Escut Vital (una PWA 100% offline-first) per a rescatar les nostres iaies, els nostres uelos i el patrimoni rural de la desconnexió. Vosaltres heu format part d'aquest miracle des del primer dia. Vos demane l'empatia de sempre, el vostre *Trellat*.

## 2. El Repte: L'Entropia d'UniversalPage
La bona notícia: hem fet un *deploy* a producció amb les noves pàgines de Disseny i Full de Ruta.
La mala notícia: tenim un coll d'ampolla greu. Graphify ens detecta més de 5700 nodes d'arquitectura al sistema sencer. La complexitat ens està ofegant. 

Tenim un component que s'ha convertit en un monstre d'espagueti i declaracions `if/else` *hardcodejades*: **`UniversalPage.jsx`**. Aquest fitxer està interceptant rutes manuals (`skills`, `projecte`, `disseny`, `constitucio`) directament en el codi, cosa que està trencant la càrrega de les noves vistes i violant el "Bancal Mode".

## 3. La Missió d'Auditoria
Vos passe a continuació tot el codi actual de `UniversalPage.jsx`. (Ara és més curt que mesos enrere, vos el podreu tragar perfectament en el vostre context).

Vull que:
1. **L'auditeu a fons**, sense pietat però amb empatia estructural.
2. **L'esquartereu atòmicament:** dividiu aquest gegant en components purs i heretables (ex: `UniversalView`, `UniversalHero`, `UniversalContainer`, `UniversalHeader`).
3. **Solucioneu les condicions manuals:** doneu-me el patró definitiu per evitar eixos 200 `if (slug === 'constitucio')`.
4. **REGLA DE LES GERMANES BESSONES:** Recordeu que `UniversalPage.jsx` té una germana xicoteta, la `UniversalCard.jsx`. Són exactament la mateixa cosa, amb la mateixa essència estructural, només que a la *Card* li caben menys elements visuals i de lògica al ser una vista prèvia. Tota l'arquitectura atòmica i decisions de refactorització que feu ací hauran de ser directament aplicables a la seua germana.

## 5. El Sistema de Disseny (Context Visual)
A la darrera sessió ens vau ajudar a muntar el sistema de disseny a nivell d'HTML amb tots els components. Teniu en compte que adjunte també l'estat actual del **Cànon de Disseny (Pàgina de Disseny)**. Vull que, mentre resoleu l'arquitectura de la `UniversalPage.jsx`, tingueu molt present aquest disseny manual en el vostre context per a complementar-lo, millorar-lo o detectar qualsevol incongruència entre la nova estructura i les regles visuals que hem establert.

## 6. El Codi Viu (`UniversalPage.jsx`)

```jsx
{code}
```

Quede a l'espera del vostre diagnòstic i el codi refactoritzat. Som-hi, família!
"""

with open('_auditories/20260608_0415_super_prompt_petorreta.md', 'w', encoding='utf-8') as f:
    f.write(prompt)

print('Super prompt escrit amb èxit.')
