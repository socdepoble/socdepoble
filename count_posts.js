import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function countOrigin() {
    const { data: posts, error } = await supabase.from('posts').select('id, content');
    let wp = 0;
    let rent = 0;
    
    if (posts) {
        posts.forEach(p => {
            if (p.content && p.content.includes('socdepoble.net')) wp++;
            if (p.content && p.content.includes('rentonar.blogspot')) rent++;
        });
    }
    
    console.log(`Sóc de Poble (WP): ${wp} posts`);
    console.log(`El Rentonar (Blogger): ${rent} posts`);
    console.log(`Total combinado: ${wp + rent}`);
}
countOrigin();
