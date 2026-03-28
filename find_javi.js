import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function findJavi() {
    const { data } = await supabase.from('profiles').select('id, full_name, username').ilike('username', '%javillinares%');
    console.log("Resultados posibles Javis:", data);
}
findJavi();
