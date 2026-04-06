---
name: estilo-marca
description: Estàndard de marca visual i to de veu de Sóc de Poble. Usa-ho sempre que generes interfícies, codi HTML/CSS o textos per a l'usuari.
---

# Skill: Estilo y Marca (Sóc de Poble)

## Cuándo usar este skill

- Si vas a dissenyar una UI o una pantalla nova.
- Si vas a integrar un esbós visual de la Gem al codi.
- Si vas a escriure textos: titulars, CTAs, missatges del mur, bàndols o descripcions.
- Cada vegada que hages d'aplicar CSS (Tailwind) a un component.
- Si utilizas `lucide-react`, usa `strokeWidth={1.5}` o {2}.

### Capçalera Contextual Invariable
- El componente genérico `<ContextualHeader />` y la ventana de búsqueda superior de navegación DEBEN respetar SIEMPRE la regla de colorimetría central:
- **Modo Día**: Fondo Naranja (`bg-[#F97316]`).
- **Modo Noche**: Fondo Azul Corporativo Oscuro (`bg-[var(--sdp-blue)]` o `#002f5a`).
- NO se deben envolver en `bg-theme-base` ni clases transparentes que mimetizan el fondo global y diluyan esta personalidad. La pieza debe destacar sobre el scroll en sus dos variantes.

## Regla número 1

No improvises l'estil ni els colors. Si falta una dada, usa els valors definits als recursos d'aquest skill. L'estil per defecte de Tailwind o els dissenys genèrics estan prohibits.

## Dónde mirar según el tipo de tarea

- Estil visual, regles de codi, usabilitat i Lèxic Oficial: Consulta sempre i exclusivament el \`NOTEBOOK_LM_MASTER_SYNC.md\` situat a l'arrel del projecte. És la **Veritat Absoluta**.

## Checklist antes de entregar

1. ¿S'ha respectat la Llei de la Boina Taronja (geometria de \`28px\` exacta o cercle perfecte)?
2. ¿S'ha aplicat el Lèxic Oficial rigorós (P.e: "CONNECTAR", "MISSATGE DIRECTE", "MALLA") evitant anglicismes?
3. ¿L'estructura visual ha abandonat configuracions clares per acomplir l'estètica Premium Rústic (fons foscos \`bg-[#111]\` o \`bg-[#0a0a0a]\` amb \`backdrop-blur\` on escaiga)?
4. ¿El text sona rural, pràctic i proper (sense argot corporatiu o tecnològic)?
5. **(Llei del Títol Taronja / Orange Label Law):** ¿Els noms dels agents, títols principals de llistes i identificadors clau estan en color Taronja (\`text-[var(--theme-accent-primary)]\` o \`#F97316\`) i MAI en negre o gris? Aquest color es reserva exclusivament per a destacar identitats d'agents/persones.
6. **(Ortografia Valenciana / Regla de l'Apòstrof):** T'has assegurat que la composició gramatical dels pobles siga ortogràficament impecable? Si el poble comença amb vocal o "H" seguida de vocal (ex. Ontinyent, Alcoi, Iàtova), s'apostrofa la "de" convertint-la en "d'" (P.e. "Gent d'Ontinyent"). Mai "Gent de Ontinyent". Recorda revisar sempre la correcció ortogràfica estricta per al valencià.
7. **(Accessibilitat i SEO / Alt Text):** Totes les imatges han de portar el seu atribut `alt=""` descriptiu i meticulós. Assegura't de respectar sempre les bones pràctiques de SEO a qualsevol document que edites (etiquetes adients, atributs descriptius), afavorint la indexació i accessibilitat web.

## Cómo mejorar este Skill

Si alguna cosa no quadra, no ho arregles en el prompt: ajusta els recursos i torna a generar.
