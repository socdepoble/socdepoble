import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
    console.log("Aplicando parche de comarcas (Cero tolerancia a vacíos)...");

    const updates = [
        supabase.from('towns').update({ comarca: 'Comtat' }).eq('name', 'Benialfaquí'),
        supabase.from('towns').update({ comarca: 'L\'Alcoià' }).eq('name', 'Benifallim'),
        supabase.from('towns').update({ comarca: 'L\'Alacantí' }).eq('name', 'La Torre de les Maçanes'),
        supabase.from('towns').update({ comarca: 'L\'Alcoià' }).eq('name', 'Penàguila'),
        supabase.from('towns').update({ comarca: 'L\'Alacantí' }).eq('name', 'Xixona')
    ];

    await Promise.all(updates);

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
