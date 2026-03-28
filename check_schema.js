import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function auditSchema() {
    console.log("Auditoría de columnas fantasma en la tabla POSTS...");
    
    // Fallback robusto usando postgres functions nativas o simplemente sacando un registro
    const { data: row, error } = await supabase.from('posts').select('*').limit(1);
    if (row && row.length) {
        console.log("\nColumnas vivas en el DB actual (leyendo objeto):", Object.keys(row[0]));
    } else {
        console.error("No se pudo leer:", error);
    }
}
auditSchema();
