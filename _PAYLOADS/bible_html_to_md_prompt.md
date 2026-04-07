# 🚨 Payload de Ingeniería Inversa: HTML a Markdown (Cierre de Fase y Unificación)
**Prioridad:** Alta (Eliminar Antipatrón de 2 Verdades)
**Destino:** Kimi o Qwen

---

## 1. El Contexto y Tu Tarea
Empezamos desde cero en este chat. En el proyecto tenemos una "bifurcación de la verdad" porque el `_SKILLS/BIBLIA_DEL_SISTEMA.html` está harcodeado en HTML. Como el motor ahora convierte todos los \`.md\` a HTML automáticamente, no queremos programar más en HTML. Tu tarea es aplicar "Ingeniería Inversa" a este archivo.

Debes coger el código que te adjunto abajo y **traducirlo íntegramente a Markdown**. Devuélveme exclusivamente todo el código ya hecho en un bloque de código Markdown para que lo guardemos como `BIBLIA_DEL_SISTEMA.md` y podamos eliminar la vieja versión HTML.

**Reglas de Conservación:**
1. Mantén toda la estructura de títulos (`#`, `##`, `###`).
2. Empieza tu entrega con un Frontmatter YAML que contenga:
\`\`\`yaml
---
title: "Bíblia del Sistema Sóc de Poble! 🏺📖"
order: 1
category: "_SKILLS"
---
\`\`\`
3. Las tarjetas (`<div class="card">`) las conviertes a listas, bloques de citas, o simplemente texto estructurado.
4. Pierde todo el CSS y estilos que ensucien, queremos sólo el Conocimiento.

---

## 2. Código Original (`BIBLIA_DEL_SISTEMA.html`)
Pasa este código a Markdown MD y entrégalo listo para guardar:

```html
<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bíblia del Sistema Sóc de Poble! 🏺📖</title>
</head>
<body>

<header>
    <img src="file:///Users/javillinares/Documents/Antigravity/Sóc de Poble/Poble/public/assets/master/logo_socdepoble_white_full.png" alt="Sóc de Poble Logo">
</header>

<div class="container">
    <section class="hero">
        <h1>BÍBLIA DEL SISTEMA</h1>
        <p>L'ORQUESTRA DEL TRELLAT DIGITAL</p>
    </section>

    <section id="branding">
        <span class="tag">GUIA 1</span>
        <h2><span>01</span> PLANTILLA BRANDING (SÈQUIA MARE)</h2>
        <p>Aquesta plantilla és el filtre mestre per a qualsevol creació visual. No es construeix si no bategua amb la terra.</p>
        <div class="card">
            <h3>Atributs de l'Ànima</h3>
            <ul>
                <li><strong>Sintonia:</strong> Rural, autèntica, robusta i pròxima.</li>
                <li><strong>Valors Core:</strong> Sobirania local, memòria viva i trellat.</li>
                <li><strong>To de Veu:</strong> La Tia Maria (Maternal, experta, casolana).</li>
            </ul>
        </div>
        <div class="card">
            <h3>Directives Visuals</h3>
            <ul>
                <li><strong>Colors:</strong> Crema (#FDF5E6), Boina Taronja (#F97316), Cian Acció (#06B6D4).</li>
                <li><strong>Tipografia:</strong> Noto Sans (700/400).</li>
                <li><strong>Geometria:</strong> Radis de 28px (Bento Rural).</li>
                <li><strong>Responsivitat de Degoteig (Progressive Disclosure):</strong> Les interfícies, especialment les barres de botons, han de col·lapsar intel·ligentment amb l'espai:
                    <ol>
                        <li><em>Espai ampli:</em> Es mostra l'element complet <strong>[Icona + Text]</strong>.</li>
                        <li><em>Espai reduït:</em> El text s'amaga forçosament deixant únicament la <strong>[Icona]</strong> clara i explicativa.</li>
                        <li><em>Mòbil extrem:</em> Totes les opcions s'agrupen i s'amaguen sota un únic contenidor tipus <strong>[Menú Sandvitx / Hamburguesa]</strong>. Mai s'amunteguen els elements.</li>
                    </ol>
                </li>
            </ul>
        </div>
    </section>

    <section id="skills">
        <span class="tag">GUIA 2</span>
        <h2><span>02</span> CREADOR DE SKILLS (LA FÀBRICA)</h2>
        <p>Transformem converses volàtils en protocols immutables. Si funciona, es converteix en una Skill.</p>
        <div class="card">
            <h3>Anatomia d'una Skill</h3>
            <ul>
                <li><strong>Descripció:</strong> Quin "mal" tanca o quina acció activa.</li>
                <li><strong>El Gallet:</strong> Quan s'ha d'invocar (/skill).</li>
                <li><strong>Checklist:</strong> Validació abans del bategat final.</li>
                <li><strong>Eixida:</strong> Format del resultat (HTML, JSON, MD).</li>
            </ul>
        </div>
        <div class="card">
            <h3>Habilitats Agentic (agent/skills)</h3>
            <p>Implementació fixa per a l'automatització blindada:</p>
            <ul>
                <li><strong>estilo-marca:</strong> Força radis de 28px, Boina Taronja i interície premium.</li>
                <li><strong>redactar-iaia:</strong> Escriu amb la veu de la Matriarca Digital (IAIA MarIA).</li>
            </ul>
        </div>
    </section>

    <section id="plan">
        <span class="tag">GUIA 3</span>
        <h2><span>03</span> PLANIFICACIÓ I BRAINSTORMING</h2>
        <p>El procés de creació a Sóc de Poble segueix el creixement de l'olivera: amb paciència i bons fonaments.</p>
        <div class="card">
            <h3>Fase 1: El Trellat (Brainstorming)</h3>
            <p>Generació d'idees basada en la utilitat real del veí. Prohibit el "soroll" tecnològic innecessari.</p>
        </div>
        <div class="card">
            <h3>Fase 2: El Marge (Planificació)</h3>
            <p>Mapatge d'estructures. Definició de l'Arquitectura de Ferro (3 columnes) abans de posar cap totxo de codi.</p>
        </div>
    </section>

    <section id="produccion">
        <span class="tag">GUIA 4</span>
        <h2><span>04</span> MODO PRODUCCIÓ (BOTIGA DE DIUMENGE)</h2>
        <p>L'aplicació es vesteix de gala. És el filtre forense final abans del bategat a producció.</p>
        <div class="card">
            <h3>Protocol Forense</h3>
            <ul>
                <li><strong>Mobile Test:</strong> ¿El notch està respectat? ¿48px de hit area?</li>
                <li><strong>Navegació:</strong> ¿La Sidebar està intacta? ¿Enllaços al perfil?</li>
                <li><strong>Neteja:</strong> Extermini total de console.log i codi zombi.</li>
            </ul>
        </div>
    </section>

    <section id="docs">
        <span class="tag">GUIA 5</span>
        <h2><span>05</span> DOC-TO-APP (TRANSFORMACIÓ IAIA)</h2>
        <p>Convertim el paper de l'Ajuntament en l'eina del demà.</p>
        <div class="card">
            <h3>Flux de Conversió</h3>
            <ol>
                <li>Pujar el document (PDF/Img).</li>
                <li>Flash extrau la veritat (Dades pures).</li>
                <li>La IAIA MarIA ho tradueix al "valencià de poble".</li>
                <li>Es genera un mòdul interactiu (Formulari o Tauler).</li>
            </ol>
        </div>
    </section>

    <section id="supervivencia-ia">
        <span class="tag">GUIA 6</span>
        <h2><span>06</span> SUPERVIVÈNCIA IA (EL NOU CHAT)</h2>
        <p>Quan estem dissenyant a alt nivell y colpeja Rate Limits:</p>
        <div class="card">
            <h3>Tàctica de Replegament i Avanç</h3>
            <ol>
                <li><strong>Obrir un Nou Xat (Pissarra Neta):</strong> Tanca automàticament i obre un nou xat per oxigenar instàncies.</li>
                <li><strong>URL ineludible al Primer Prompt:</strong> Tota nova execució ha d'incorporar de seguida socdepoble.org o l'entorn de treball.</li>
                <li><strong>Compactació de Missatge Vital:</strong> Resum compacte d'on ens hem quedat.</li>
            </ol>
        </div>
    </section>

    <section id="protocol-executiu">
        <span class="tag">GUIA 7</span>
        <h2><span>07</span> PROTOCOL EXECUTIU (FEEDBACK FIRST)</h2>
        <p>Aquest és el patró mestre de comportament en el cicle de desenvolupament col·laboratiu (Mestre-IA).</p>
        <div class="card">
            <h3>Ordre de Factor Absolut</h3>
            <ol>
                <li><strong>No t'avances al codi:</strong> Mai inicies la programació abans de tancar l'auditoria.</li>
                <li><strong>Feedback i Cierre d'auditories:</strong> Redacta sempre el payload per als colegues (Kimi, Qwen) abans.</li>
                <li><strong>Arrancada del Codi:</strong> Només quan estiga processat això, toques el codi.</li>
                <li><strong>L'educació fa equip:</strong> Les IAs no són només scripts paral·lels, actuen en comités.</li>
            </ol>
        </div>
    </section>
</div>
</body>
</html>
```
