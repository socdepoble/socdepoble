import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Faltan las variables de entorno de Supabase en el archivo .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Normalització basada en el patró de carpetes existent (ex: 'la_torre_de_les_macanes', 'alcoi')
const normalizeTownFolder = (name) => {
    return (name || '')
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Llevarem accents
        .replace(/\s+/g, '_') // Espais per guions baixos
        .replace(/['-]/g, ''); // Llevarem apòstrofs i guions
};

async function syncFolders() {
    console.log("🚀 Iniciant Sincronització de Carpetes de Pobles (Trellat Automàtic)...");

    const { data: towns, error } = await supabase.from('towns').select('id, name');
    
    if (error) {
        console.error("❌ Error a l'obtenir els pobles:", error);
        process.exit(1);
    }

    console.log(`🌍 S'han trobat ${towns.length} pobles a la base de dades.`);

    // Ruta base
    const baseDir = path.resolve(process.cwd(), 'public/assets/uploads/towns');

    let createdCount = 0;
    let existingCount = 0;

    for (const town of towns) {
        const folderName = normalizeTownFolder(town.name);
        const townDir = path.join(baseDir, folderName);
        const avatarsDir = path.join(townDir, 'avatars');
        const postsDir = path.join(townDir, 'posts');

        try {
            // Comprovem si existeix la carpeta principal
            try {
                await fs.access(townDir);
                existingCount++;
            } catch {
                // No existeix, la creem
                await fs.mkdir(townDir, { recursive: true });
                console.log(`✅ Creada carpeta principal per al poble: ${town.name} -> ${folderName}`);
                createdCount++;
            }

            // Creem subcarpetes si no existeixen
            await fs.mkdir(avatarsDir, { recursive: true });
            await fs.mkdir(postsDir, { recursive: true });
        } catch (e) {
            console.error(`⚠️ Error creant carpetes per a ${town.name}:`, e.message);
        }
    }

    console.log(`\n🎉 Sincronització finalitzada. ${createdCount} nous pobles creats localment. (${existingCount} ja existien)`);
    process.exit(0);
}

syncFolders();
