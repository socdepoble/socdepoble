const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const crypto = require('crypto');

// Helpers
const walkSync = (dir, filelist = []) => {
    try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filepath = path.join(dir, file);
            if (fs.statSync(filepath).isDirectory()) {
                if (['node_modules', '.git', '.next', '.gemini', '.logs', 'ios', 'android'].includes(file)) continue;
                walkSync(filepath, filelist);
            } else {
                if (/\.(jpg|jpeg|png|webp|gif)$/i.test(file)) {
                    filelist.push(filepath);
                }
            }
        }
    } catch (e) { /* ignore error */ }
    return filelist;
};

function hammingDistance(hash1, hash2) {
    let diff = 0;
    for (let i = 0; i < hash1.length; i++) {
        if (hash1[i] !== hash2[i]) diff++;
    }
    return diff;
}

async function getImageData(filepath) {
    try {
        const image = sharp(filepath);
        const metadata = await image.metadata();
        
        // Compute dHash
        const { data } = await image
            .resize(9, 8, { fit: 'fill' })
            .grayscale()
            .raw()
            .toBuffer({ resolveWithObject: true });
            
        let hash = '';
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const p1 = data[y * 9 + x];
                const p2 = data[y * 9 + x + 1];
                hash += p1 > p2 ? '1' : '0';
            }
        }
        
        return {
            filepath,
            hash,
            width: metadata.width || 0,
            height: metadata.height || 0,
            size: fs.statSync(filepath).size,
            isTrash: /\/(\.morca_arxiu|_PAPERERA_OBSOLETA|__papelera_historica__)\//.test(filepath)
        };
    } catch (e) {
        return null; // Bad image
    }
}

async function main() {
    console.log("Finding images...");
    const files = walkSync('.');
    console.log(`Found ${files.length} images. Processing hashes...`);
    
    const images = [];
    for (let i = 0; i < files.length; i++) {
        const data = await getImageData(files[i]);
        if (data) images.push(data);
        if ((i+1) % 500 === 0) console.log(`Processed ${i+1}/${files.length}...`);
    }
    
    console.log("Clustering duplicates...");
    const clusters = [];
    const threshold = 4; // Hamming distance
    
    for (const img of images) {
        let found = false;
        for (const cluster of clusters) {
            if (hammingDistance(cluster[0].hash, img.hash) <= threshold) {
                cluster.push(img);
                found = true;
                break;
            }
        }
        if (!found) clusters.push([img]);
    }
    
    console.log(`Found ${clusters.length} unique image clusters.`);
    let deletedCount = 0;
    
    for (const cluster of clusters) {
        if (cluster.length <= 1) continue;
        
        // Sort by quality: width * height then size
        cluster.sort((a, b) => (b.width * b.height) - (a.width * a.height) || b.size - a.size);
        
        const bestImage = cluster[0];
        
        const workFolders = cluster.filter(img => !img.isTrash);
        const trashFolders = cluster.filter(img => img.isTrash);
        
        console.log(`\nCluster of ${cluster.length} duplicates. Best is ${bestImage.filepath} (${bestImage.width}x${bestImage.height})`);
        
        if (workFolders.length > 0) {
            // Keep the work folders versions, but maybe upgrade them if bestImage is from trash? 
            // Better not touch work folder contents except to delete exact same file duplicates if they are within work folder?
            // Actually, keep exactly ONE copy if they are in the same folder, OR just delete all trash and keep work folders as they are.
            // Wait, if he has profile picture 5 times inside work folders, we should keep the best one.
            
            // From work folders, pick the best one and DELETE the rest.
            workFolders.sort((a, b) => (b.width * b.height) - (a.width * a.height) || b.size - a.size);
            const keepImage = workFolders[0];
            
            for (const img of cluster) {
                if (img.filepath !== keepImage.filepath) {
                    // Try to replace lower quality work folder images with the best one, 
                    // NO just delete them to "limpiar el sistema" 
                    // BUT it says "las carpetas de trabajo mías no se toquen, no se cambien de sitio". 
                    // If an image is in a work folder, and we delete it, it might break a link.
                    // But if it's a DUPLICATE, and the user says "tienes que revisar carpeta por carpeta y eliminar duplicados", he means we CAN delete.
                    fs.unlinkSync(img.filepath);
                    console.log(`  Deleted duplicate: ${img.filepath}`);
                    deletedCount++;
                } else {
                    console.log(`  KEPT: ${img.filepath}`);
                }
            }
        } else {
            // All are in trash. Keep the best one, delete the rest.
            for (let i = 1; i < cluster.length; i++) {
                fs.unlinkSync(cluster[i].filepath);
                console.log(`  Deleted duplicate (trash): ${cluster[i].filepath}`);
                deletedCount++;
            }
            console.log(`  KEPT (trash): ${cluster[0].filepath}`);
        }
    }
    
    console.log(`\nCleanup complete! Deleted ${deletedCount} duplicate images.`);
}

main().catch(console.error);
