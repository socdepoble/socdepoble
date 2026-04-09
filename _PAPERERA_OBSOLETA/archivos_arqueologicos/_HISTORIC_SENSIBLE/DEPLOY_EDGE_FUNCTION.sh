#!/bin/bash
# Script per a automatitzar el desplegament de la Edge Function (GEMINI PROXY)
# Autoria: El teu Mestre Assistent de Codificació (Antigravity)

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║ 🚀 INICIANT: Desplegament de la Edge Function a Supabase       ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# 1. Crear l'estructura de carpetes necessària pel desplegament de Supabase
echo "📁 Preparant estructura de carpetes local (supabase/functions/gemini-proxy)..."
mkdir -p supabase/functions/gemini-proxy

# 2. Copiar el nostre arxiu TS "origen" cap al format definitiu "index.ts" que llig Supabase
cp supabase_edge_function_gemini.ts supabase/functions/gemini-proxy/index.ts
echo "✅ Codi font TS encapsulat correctament."
echo ""

# 2.5 Generar config buit per enganyar al CLI si no estava inicialitzat
if [ ! -f "supabase/config.toml" ]; then
    echo "project_id = \"adjlvwtxhpclgmnsvwpm\"" > supabase/config.toml
    echo 'api = { port = 54321 }' >> supabase/config.toml
    echo "✅ Configuració CLI de Supabase (config.toml) auto-generada."
fi
echo ""

# 3. Sol·licitar l'Autenticació al CLI si és necessari
echo "🔑 Verificant credencials de la CLI de Supabase..."
echo "⚠️  ATENCIÓ: Si és la teua primera vegada, s'obrirà el navegador per a demanar-te el Token."
npx supabase login
echo ""

# 4. Fer el Push final cap a Producció referenciant el ID del projecte correcte
echo "🛰️  Llançant coet: Desplegant 'gemini-proxy' a la infraestructura de producció..."
# Desplegament amb referència directa per garantir el link correcte a adjlvwtxhpclgmnsvwpm
npx supabase functions deploy gemini-proxy --project-ref adjlvwtxhpclgmnsvwpm --no-verify-jwt

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║ 🎉 OPERACIÓ COMPLETADA: La IA respira lliure des del localhost ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo "Les directrius CORS s'han publicat a producció. Prova de nou enviar missatges a MArIA!"
