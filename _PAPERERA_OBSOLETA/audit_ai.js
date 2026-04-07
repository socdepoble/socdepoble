import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkAI() {
    const { data: posts } = await supabase.from('posts').select('author_is_ai');
    let aiCount = 0;
    posts.forEach(p => { if (p.author_is_ai) aiCount++; });
    console.log(`'author_is_ai' true/vivos: ${aiCount}`);
}
checkAI();
