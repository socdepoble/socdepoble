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
echo "📦 Empaquetant dist.tar.gz (Netejat de recursos de macOS extesos)..."
COPYFILE_DISABLE=1 tar -czf dist.tar.gz dist

if [ $? -eq 0 ]; then
    echo "💎 Paquet dist.tar.gz llast per al lliurament."
    
    if [ ! -z "$FTP_HOST" ]; then
        echo "🚀 Iniciant pujada FTP a $FTP_HOST/$FTP_TARGET_DIR ..."
        
        HELPER_FILE="deploy_helper_$(date +%s).php"
        # Generar script helper PHP per a SiteGround
        cat << 'EOF' > "$HELPER_FILE"
<?php
$targetDir = __DIR__;
$archive = $targetDir . '/dist.tar.gz';

echo ">> Iniciant extracció (exec de sistema)...<br>";

// 1. Purga Brutal d'Assets Vells (Evitar Zombis)
echo ">> Purgant assets vells...<br>";
$assetsDir = $targetDir . '/assets';
if (is_dir($assetsDir)) {
    $rit = new RecursiveDirectoryIterator($assetsDir, RecursiveDirectoryIterator::SKIP_DOTS);
    $rii = new RecursiveIteratorIterator($rit, RecursiveIteratorIterator::CHILD_FIRST);
    foreach ($rii as $file) {
        if ($file->isDir()) @rmdir($file->getRealPath());
        else @unlink($file->getRealPath());
    }
    @rmdir($assetsDir);
}

// 2. Extraure
if (file_exists($archive)) {
    exec("tar -xzf dist.tar.gz 2>&1", $out, $ret);
    if ($ret === 0) {
        echo ">> Arxiu descomprimit.<br>";
        
        // Moure contingut de dist/ a l'arrel i netejar
        $distDir = $targetDir . '/dist';
        if (is_dir($distDir)) {
            $iterator = new RecursiveIteratorIterator(
                new RecursiveDirectoryIterator($distDir, RecursiveDirectoryIterator::SKIP_DOTS),
                RecursiveIteratorIterator::SELF_FIRST
            );
            
            foreach ($iterator as $item) {
                $subPath = $iterator->getSubPathName();
                $dest = $targetDir . '/' . $subPath;
                
                if ($item->isDir()) {
                    if (!is_dir($dest)) @mkdir($dest, 0755, true);
                } else {
                    if (file_exists($dest)) @unlink($dest);
                    if (!@rename($item, $dest) && !@copy($item, $dest)) {
                        echo ">> [AVÍS] No s'ha pogut copiar/moure: $dest <br>";
                    }
                }
            }
            
            // Eliminar directori dist original iterativament
            $rit = new RecursiveDirectoryIterator($distDir, RecursiveDirectoryIterator::SKIP_DOTS);
            $rii = new RecursiveIteratorIterator($rit, RecursiveIteratorIterator::CHILD_FIRST);
            foreach ($rii as $file) {
                if ($file->isDir()) @rmdir($file->getRealPath());
                else @unlink($file->getRealPath());
            }
            @rmdir($distDir);
        }
        
        // Netejar l'empaquetat original
        @unlink($archive);
        echo ">> Contingut mogut i neteja completada nativament.<br>";
    } else {
        echo ">> Error d'extracció bash (ret=$ret): " . implode("<br>", $out) . "<br>";
    }
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
        curl -T "$HELPER_FILE" -u "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST/$FTP_TARGET_DIR/$HELPER_FILE"
        
        if [ $? -eq 0 ]; then
            echo "✅ Pujada completada. Executant script remot per descomprimir i buidar caché..."
            
            # Executar helper via web (necessitem la URL base, l'assumim per FTP_HOST o manual)
            DOMAIN_URL="https://socdepoble.org"
            curl -s "$DOMAIN_URL/$HELPER_FILE"
            
            echo ""
            echo "🎉 TOTA L'OPERACIÓ DE DESPLEGAMENT ACABADA AUTOMÀTICAMENT!"
            echo "✔️ El fitxer ha estat penjat, extret i la caché buidada."
            
            # Neteja local
            rm "$HELPER_FILE"
        else
            echo "❌ Error durant la pujada FTP. Revisa els credencials a .env.deploy"
            rm "$HELPER_FILE"
            exit 1
        fi
    else
        echo "🚀 Pròxim pas: Pujar-ho a SiteGround public_html de forma manual perquè falten credencials."
    fi
else
    echo "❌ Error en la compressió."
    exit 1
fi
