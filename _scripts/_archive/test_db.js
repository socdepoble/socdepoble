import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function check() {
    const tables = ['posts', 'post_translations', 'market_items', 'entities', 'notifications', 'realms', 'profiles'];
    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
            console.log(`Error on ${table}:`, error.message);
        } else {
            console.log(`Table ${table} sample keys:`, data.length > 0 ? Object.keys(data[0]).join(', ') : 'Empty');
            if (data.length > 0) {
               console.log(`  id type: ${typeof data[0].id}`);
               console.log(`  uuid type: ${typeof data[0].uuid}`);
            }
        }
    }
}
check();
