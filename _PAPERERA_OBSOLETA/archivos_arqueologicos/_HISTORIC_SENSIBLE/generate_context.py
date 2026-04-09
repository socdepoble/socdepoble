import os

src_dir = 'src'
output_file = 'auditorias/auditoria_agresiva_sistema_completo.txt'

# Archivos o carpetas a excluir para no saturar con datos o imágenes
EXCLUDE_DIRS = ['assets', 'data', 'images', 'locales']
EXCLUDE_FILES = ['data.js', 'mockLoreData.js', 'ServiceWorker.js']
ALLOWED_EXT = ['.js', '.jsx', '.css', '.ts']

prompt_maestro = """### INSTRUCCIONES SUPERIORES PARA LA IA AUDITORA (DEEPSEEK / QWEN / CLAUDE) ###

ESTA ES UNA AUDITORÍA AGRESIVA Y MERCELESS ("A SACO") DEL SISTEMA "SÓC DE POBLE".
El código base cuenta con arquitecturas avanzadas, pero también sufre de deuda técnica, "fantasmas" de código antiguo, y contradicciones de estado/CSS.

TU MISIÓN ES ACTUAR COMO UN ARQUITECTO PRINCIPAL (STAFF ENGINEER) Y DESTRUIR LOS FANTASMAS.

1. CAZA DE FANTASMAS (Lógica obsoleta y redundante!):
- Encuentra useEffects contradictorios.
- Encuentra fallbacks de perfiles o variables que no se usan pero enredan el estado.
- Identifica re-renders innecesarios causados por estados duplicados o dependencias circulares.

2. LIMPIEZA ESTRUCTURAL (CSS y UI):
- Identifica clases de Tailwind que se contradicen con el CSS tradicional en los archivos nativos.
- Detecta "overrides" innecesarios o `!important` que rompen la cascada visual.
- El objetivo es un diseño fluido, predecible y que no parpadee ni se rompa en móviles.

3. ROBUSTEZ:
- Asegúrate de que los Contextos (AuthContext, NavigationContext, I18nContext) están limpios.
- Si ves una lógica que es "un parche sobre un parche", denúnciala y da la solución limpia de raíz.

4. SEO Y OPEN GRAPH (NUEVO REQUISITO CRÍTICO):
- Audita la implementación actual de SEO dinámico en React (react-helmet-async) y el index.html base.
- Necesitamos que enlaces como socdepoble.org/post/123 o perfiles al compartirse por WhatsApp, Facebook o Instagram desplieguen tarjetas ricas perfectas con metadatos y portadas (Open Graph, Twitter Cards).
- Diseña y propón un sistema robusto, fácil de implementar en todos los niveles (Pages) para asegurar el SEO técnico de forma impecable.
- Audítalo en ti mismo e instruye al agente respecto a la mejor implementación posible en ViteJS/React.

FORMATO DE TU RESPUESTA:
- Sé directo, crudo y sumamente técnico.
- Divide tus hallazgos por Componente/Archivo.
- Da el código exacto de CÓMO arreglar de raíz cada "fantasma" o aberración estructural que encuentres. No des explicaciones vagas, danos el código para que nuestro Agente Ejecutivo lo pegue e integre.

¡Empieza a auditar el siguiente código base a partir de aquí!
======================================================================
"""

def generate_bundle():
    # Nos aseguramos de que el directorio exista
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    
    with open(output_file, 'w', encoding='utf-8') as outfile:
        outfile.write(prompt_maestro + "\n\n")
        
        # Leemos también archivos clave de la raíz
        root_files = ['package.json', 'vite.config.js', 'tailwind.config.js']
        for f in root_files:
            if os.path.exists(f):
                outfile.write(f"\n\n{'='*50}\n")
                outfile.write(f"FILE: {f}\n")
                outfile.write(f"{'='*50}\n\n")
                with open(f, 'r', encoding='utf-8') as infile:
                    outfile.write(infile.read())

        # Recorremos recursivamente src/
        for root, dirs, files in os.walk(src_dir):
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
            
            for file in files:
                if file in EXCLUDE_FILES:
                    continue
                
                ext = os.path.splitext(file)[1]
                if ext in ALLOWED_EXT:
                    filepath = os.path.join(root, file)
                    outfile.write(f"\n\n{'='*50}\n")
                    outfile.write(f"FILE: {filepath}\n")
                    outfile.write(f"{'='*50}\n\n")
                    try:
                        with open(filepath, 'r', encoding='utf-8') as infile:
                            outfile.write(infile.read())
                    except Exception as e:
                        outfile.write(f"Error reading file: {e}\n")

    print(f"Successfully created {output_file}")

if __name__ == "__main__":
    generate_bundle()
