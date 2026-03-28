import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
    console.log("Aplicando parche de comarcas usando UUIDs...");

    const updates = [
        supabase.from('towns').update({ comarca: 'Comtat' }).eq('uuid', '0ceaad35-1b20-4ff4-8aad-43d506fa1acc'),
        supabase.from('towns').update({ comarca: "L'Alcoià" }).eq('uuid', '0ad6c046-c2be-4bc4-ade6-97868a9d999e'),
        supabase.from('towns').update({ comarca: "L'Alacantí" }).eq('uuid', 'edd2f840-f4af-414a-821c-ebb8b8b2a80a'),
        supabase.from('towns').update({ comarca: "L'Alcoià" }).eq('uuid', 'e7f77180-b47a-41e4-ae81-ed45292f4154'),
        supabase.from('towns').update({ comarca: "L'Alacantí" }).eq('uuid', '2ce9ee32-4204-4742-8483-db9708751081')
    ];

    const results = await Promise.all(updates);
    
    results.forEach(r => {
        if (r.error) console.error("Error updating:", r.error);
    });

    console.log("🔥 INYECCIÓN DE COMARCAS COMPLETADA.");

    const { data: towns, error } = await supabase
        .from('towns')
        .select(`uuid, name, comarca`);

    if (error) {
        console.error(error);
        return;
    }

    const missing = towns.filter(t => !t.comarca || t.comarca.toLowerCase().includes('sense') || t.comarca.toLowerCase().includes('pioner'));

    if (missing.length === 0) {
        console.log("✅ AUDITORIA SUPERADA. TÓDAS LAS COMARCAS CUMPLEN LA RUTA (0 HUECOS).");
    } else {
        console.log("Quedan problemas:");
        console.table(missing);
    }
}
run();
