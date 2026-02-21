# SKILL: Protocol de Purga Nuclear i Desplegament Blindat 🏺🔥🚀

Aquest protocol blinda el flux de desplegament del Mas per a evitar que "fantasmes" de caché o versions antigues embruten el bategat del projecte.

## 1. Purga de Fantasmes (Caché & Residus)

Abans de cada desplegament de producció, l'agent ha de realitzar un "Exorcisme Tècnic":

1.  **Neteja Local**: `rm -rf dist` (o carpeta de build) per a assegurar que no hi ha artefactes orfes.
2.  **Invalitació de Caché (Vercel)**: L'`index.html` ha de portar SEMPRE la capçalera `Cache-Control: public, max-age=0, must-revalidate`. Els assets han de ser immutables.
3.  **Increment de Vcrit**: Cada canvi important ha d'anar acompanyat d'un increment de versió al `package.json` o un bategat de timestamp al sistema.

## 2. El Bategat de Verificació (Post-Deploy)

Una vegada realitzat el desplegament, l'agent **NO pot donar-lo per finalitzat** sense realitzar les següents comprovacions:

- **Check de Capçaleres**: Usar `curl -I https://socdepoble.org` per a verificar que el `Cache-Control` és correcte.
- **Check de Versió**: Navegar amb el browser tool i buscar la meta-etiqueta `sp-version` o comprovar el log de consola per a confirmar que és la versió esperada.
- **Cache Busting de Prova**: Provar la URL amb el suffix `?v=[timestamp]` per a forçar un refresc extern si el Mestre ho sol·licita.

## 3. Ordre de Neteja de Codi (Anti-Ghosts)

- **Eliminació de fallbacks obsolets**: Si un component s'ha bategat amb una nova identitat (ex: Súper Ratolí), s'ha de purgar la identitat antiga del codi per a evitar col·lisions.
- **Zero Warnings**: El build ha de ser net, sense alertes de "unused variables" que indiquen codi fantasma.

> [!CAUTION]
> Un desplegament sense verificació és un bategat a cegues. El Mestre mereix la darrera versió, sempre.

## 15. CHECKLIST DE DESPLEGAMENT (v1.0)

- [ ] ¿S'ha buidat la carpeta `dist`?
- [ ] ¿S'ha incrementat la versió o bategat el timestamp?
- [ ] ¿Les capçaleres de `vercel.json` bloquegen la caché de l'`index.html`?
- [ ] ¿S'ha verificat la live URL després de la pujada?
