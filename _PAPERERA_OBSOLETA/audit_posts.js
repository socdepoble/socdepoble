import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function purgeRemaining() {
    console.log("Limpieza manual de los últimos 34 posts huérfanos...");

    const wrongAuthors = ['Trànsit', 'Natura', 'Música', 'Cultura', 'Festers', 'Joventut', 'Gent Gran', 'Esports', 'Educació', 'Agricola', 'Festes Patronals', 'Història Local', 'El Basurer'];

    const { error } = await supabase
        .from('posts')
        .update({
            author: 'Javi Llinares',
            author_role: 'personal',
            author_type: 'user',
            author_user_id: '25218ea4-5d7d-4db4-bdc5-7ae035629242'
        })
        .in('author', wrongAuthors);

    if (error) {
        console.error("Fallo:", error);
    } else {
        console.log("¡Cazados y asimilados los rebeldes!");
    }
}
purgeRemaining();
