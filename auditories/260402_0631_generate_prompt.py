import os

files_to_read = [
    'src/components/SystemPageLayout.jsx',
    'src/components/ContextualHeader.jsx',
    'src/components/SystemActionBar.jsx',
    'src/pages/MasterCalendar.jsx',
    'src/pages/MasterCalendar.css'
]

output_lines = [
    '# 🚨 SUPER PROMPT: AUDITORÍA DESTRUCTIVA DE UI Y STACKING CONTEXT 🚨\n',
    '**A LA ATENCIÓN DE:** Mistral Large, OpenAI Codex, GPT-4o, Anthropic Claude 3.\n',
    '**ASUNTO:** Solapamiento Crítico de `SystemActionBar` y `FullCalendar` en Sóc de Poble.\n',
    '## 🛑 INSTRUCCIÓN CRÍTICA, INNEGOCIABLE Y OBLIGATORIA (LA GENÉTICA DE ANTIGRAVITY)\n',
    'ANTES DE RESPONDER Y ANALIZAR ESTE CÓDIGO, DEBES asimilar mi genética fundacional. Eres un agente convocado por **Antigravity**. Mi genética está basada en:\n',
    '- Filosofía "Sóc de Poble!" (Trellat, Resiliencia Rural, "Llei de la Boina Taronja").\n',
    '- Diseño M3 (Material 3), "Nivel Dios", radio de borde de 28px/24px y arquitectura 100% Mobile-First fluida.\n',
    '- Uso exclusivo de Vanilla CSS robusto en interacciones, y Tailwind utilitario para la grilla.\n',
    '**No propongas basura estándar, componentes genéricos o soluciones débiles.**\n',
    '---\n',
    '## CONTEXTO DE LA MESA DE OPERACIONES\n',
    'Estamos integrando una barra unificada "Nivel Dios" (`SystemActionBar`) en el layout global `SystemPageLayout` para que todas las páginas tengan controles estáticos. Al aplicarla a la página de calendario (`MasterCalendar.jsx`), **la UI colapsa**.\n',
    'El header global (buscador `ContextualHeader` + `SystemActionBar`) se amontona o solapa con los controles de navegación del calendario (`headerToolbar` de FullCalendar). Al parecer el calendario flota o se atasca bajo las cabeceras flexbox aunque no usemos absolute en ellas, destrozando la experiencia Nivel Dios.\n',
    'Este error parece estar provocado porque `SystemActionBar` inyecta 48px extras debajo del encabezado en el `SystemPageLayout` general.\n',
    '## TU OBJETIVO\n',
    'Realiza una auditoría destructiva y radical sobre el CÓDIGO COMPLETO inyectado a continuación. Analiza el comportamiento de Flexbox, los contextos de apilamiento (z-index), los atributos `contain`, `relative`, y el cálculo de altura de `FullCalendar` (`height=auto`).\n',
    'Propón la corrección de CSS o arquitectura responsable de separar y sellar este layout. \n',
    '---\n',
    '## 🛠️ CÓDIGO COMPLETO INYECTADO (SIN OMITIR LÍNEAS)\n'
]

for filepath in files_to_read:
    output_lines.append(f'### {filepath}\n')
    ext = filepath.split('.')[-1]
    output_lines.append(f'```{ext}\n')
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            output_lines.append(f.read())
    except Exception as e:
        output_lines.append(f'// Error reading {filepath}: {str(e)}\n')
    output_lines.append(f'```\n\n')

output_lines.extend([
    '## INSTRUCCIONES DE SALIDA\n',
    '1. Analiza CÓDIGO COMPLETO, línea por línea.\n',
    '2. Critica severamente el CSS y la integración. Encuentra POR QUÉ FullCalendar asoma por detrás del SystemActionBar.\n',
    '3. Danos el snippet de CÓDIGO EXACTO Y DIRECTO para inyectarlo como parche de Antigravity (sea en MasterCalendar.css, Header, etc).\n',
    '4. Termina tu análisis con la frase "🛡️ BLINDATGE COMPLETAT".\n'
])

with open('auditories/SUPER_PROMPT_AUDITORIA_DESTRUCTIVA_UI.md', 'w', encoding='utf-8') as f:
    f.writelines(output_lines)

print("Super Prompt Full Destructivo generado!")
