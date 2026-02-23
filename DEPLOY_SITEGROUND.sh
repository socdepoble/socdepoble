#!/bin/bash

# [DEPLOY SÓC DE POBLE v10.34.0]
# Automatització de build, compressió i pujada a SiteGround via FTP

echo "⚡️ Iniciant bategat de deploy..."

# 1. Carregar credenciales si existeixen
if [ -f ".env.deploy" ]; then
    export $(cat .env.deploy | grep -v '^#' | xargs)
else
    echo "⚠️ Avís: No s'ha trobat el fitxer .env.deploy"
    echo "Pots crear-lo a partir de .env.deploy.template per automatitzar la pujada."
    read -p "¿Vols continuar de totes formes i fer la pujada manualment? (s/N) " confirm
    if [[ ! "$confirm" =~ ^[sS]$ ]]; then
        echo "❌ Deploy avortat."
        exit 1
    fi
fi

# 2. Neteja prèvia
rm -f dist.tar.gz

# 3. Execució de build
echo "🏗️ Construint el Sunday Dress..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build finalitzat amb èxit."
else
    echo "❌ Error en el build. Abortant deploy."
    exit 1
fi

# 4. Compressió
echo "📦 Empaquetant dist.tar.gz..."
tar -czf dist.tar.gz dist

if [ $? -eq 0 ]; then
    echo "💎 Paquet dist.tar.gz llast per al lliurament."
    
    if [ ! -z "$FTP_HOST" ]; then
        echo "🚀 Iniciant subida automàtica a $FTP_HOST/$FTP_TARGET_DIR ..."
        
        # Utilitzem curl per pujar el fitxer per FTP
        curl -T dist.tar.gz -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_TARGET_DIR/dist.tar.gz"
        
        if [ $? -eq 0 ]; then
            echo "✅ Pujada completada amb èxit!"
            echo "➡️ Proper pas manual: Descomprimir el fitxer a SiteGround (fins que SiteGround activi SSH per lftp)."
        else
            echo "❌ Error durant la pujada FTP. Revisa els credencials a .env.deploy"
            exit 1
        fi
    else
        echo "🚀 Pròxim pas: Pujar-ho a SiteGround public_html de forma manual."
    fi
else
    echo "❌ Error en la compressió."
    exit 1
fi
