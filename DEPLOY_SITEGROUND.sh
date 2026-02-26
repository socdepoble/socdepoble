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

# 4. Neteja Forense d'Artefactes MacOS invisibles
echo "🧹 Netejant fitxers invisibles brossa de macOS (._* i .DS_Store)..."
find dist -name "._*" -type f -delete
find dist -name ".DS_Store" -type f -delete

# 5. Compressió
echo "📦 Empaquetant dist.tar.gz (Netejat)..."
tar -czf dist.tar.gz dist

if [ $? -eq 0 ]; then
    echo "💎 Paquet dist.tar.gz llast per al lliurament."
    
    if [ ! -z "$FTP_HOST" ]; then
        echo "🚀 Iniciant pujada FTP a $FTP_HOST/$FTP_TARGET_DIR ..."
        
        # Generar script helper PHP per a SiteGround
        cat << 'EOF' > deploy_helper.php
<?php
$targetDir = __DIR__;
$archive = $targetDir . '/dist.tar.gz';

echo ">> Iniciant extracció...<br>";
// 1. Extraure
if (file_exists($archive)) {
    exec("tar -xzf dist.tar.gz");
    echo ">> Arxiu descomprimit.<br>";
    
    // Moure contingut de dist/ a l'arrel i netejar
    exec("cp -r dist/* ./ && rm -rf dist/");
    exec("rm dist.tar.gz");
    echo ">> Contingut mogut i neteja completada.<br>";
} else {
    echo ">> Error: dist.tar.gz no trobat.<br>";
}

// 2. Buidar Caché Dinàmica de SiteGround
echo ">> Buidant SG Cache...<br>";
if (function_exists('sg_cachepress_purge_cache')) {
    sg_cachepress_purge_cache();
    echo ">> (Plugin) Caché buidada.<br>";
}

// Curl a l'endpoint de SiteGround si el supercacher està actiu desat ací
// L'execució d'un script php per la web farà que la cache s'invalide normalment si toquem fitxers mtime
clearstatcache();
echo ">> Bategat completat amb èxit.";
unlink(__FILE__); // Autodestrucció
?>
EOF

        # Pujar l'arxiu i el helper
        echo ">> Pujant fitxers..."
        curl -T dist.tar.gz -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_TARGET_DIR/dist.tar.gz"
        curl -T deploy_helper.php -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_TARGET_DIR/deploy_helper.php"
        
        if [ $? -eq 0 ]; then
            echo "✅ Pujada completada. Executant script remot per descomprimir i buidar caché..."
            
            # Executar helper via web (necessitem la URL base, l'assumim per FTP_HOST o manual)
            DOMAIN_URL="https://socdepoble.org"
            curl -s "$DOMAIN_URL/deploy_helper.php"
            
            echo ""
            echo "🎉 TOTA L'OPERACIÓ DE DESPLEGAMENT ACABADA AUTOMÀTICAMENT!"
            echo "✔️ El fitxer ha estat penjat, extret i la caché buidada."
            
            # Neteja local
            rm deploy_helper.php
        else
            echo "❌ Error durant la pujada FTP. Revisa els credencials a .env.deploy"
            rm deploy_helper.php
            exit 1
        fi
    else
        echo "🚀 Pròxim pas: Pujar-ho a SiteGround public_html de forma manual perquè falten credencials."
    fi
else
    echo "❌ Error en la compressió."
    exit 1
fi
