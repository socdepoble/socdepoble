import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function absolutPurge() {
    console.log("Iniciando purga absoluta de autores falsos...");

    // 1. Obtener la ID de la Entidad "Sóc de Poble"
    const { data: entities, error: eErr } = await supabase
        .from('entities')
        .select('id, name')
        .ilike('name', '%Sóc de Poble%')
        .limit(1);

    if (eErr || !entities || entities.length === 0) {
        console.error("No se encontró la entidad Sóc de Poble");
        return;
    }
    const socId = entities[0].id;

    // 2. Traer todos los posts que no sean de Javi o de Rentonar
    const { data: posts, error: pErr } = await supabase
        .from('posts')
        .select(`id, author`)
        .not('author', 'in', '("Javi Llinares","El Rentonar")');

    if (pErr) {
        console.error("Error obteniendo posts", pErr);
        return;
    }

    console.log(`Encontrados ${posts.length} posts con autores falsos o aleatorios.`);

    if (posts.length === 0) return;

    // 3. Asignar todos esos a Sóc de Poble
    const { error: updErr } = await supabase
        .from('posts')
        .update({
            author: 'Sóc de Poble',
            author_role: 'official', // o company
            author_type: 'entity',
            author_user_id: null,
            author_entity_id: socId
        })
        .not('author', 'in', '("Javi Llinares","El Rentonar")');

    if (updErr) {
        console.error("Fallo actualizando:", updErr);
    } else {
        console.log("¡Todos los autores falsos han sido asimilados por Sóc de Poble!");
    }
}
absolutPurge();
