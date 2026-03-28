import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
    const { data: posts, error } = await supabase.from('posts').select('*').limit(1);
    if (error) {
        console.error(error);
        return;
    }
    if (posts.length > 0) {
        console.log("Columnas de posts:", Object.keys(posts[0]).join(', '));
    } else {
        console.log("No hay posts devueltos.");
    }
}
run();
