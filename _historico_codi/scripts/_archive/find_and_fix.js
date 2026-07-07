import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  // Try querying towns, market_categories, realms, groups
  let tables = ['towns', 'market_categories', 'realms', 'groups', 'marketplace_items', 'entities'];
  
  for(let table of tables) {
     console.log(`Checking ${table}...`);
     let selectStr = "id, name";
     if(table==='entities') selectStr="id, name, type";
     if(table==='realms') selectStr="id, name"; // Maybe type?
     try {
       const { data } = await supabase.from(table).select(selectStr).ilike('name', '%Sóc de Poble%');
       if (data && data.length > 0) {
         console.log(`FOUND in ${table}:`, data);
         if(table !== 'entities') {
            console.log(`UPDATE THIS TABLE: ${table}`);
            const {error: upErr} = await supabase.from(table).update({
                logo_url: '/assets/master/logo_socdepoble_green_square.png',
                avatar_url: '/assets/master/logo_socdepoble_green_square.png',
                image_url: '/assets/master/logo_socdepoble_green_square.png'
            }).eq('id', data[0].id);
            if(upErr) console.error("Update error mostly because column doesn't exist:", upErr.message);
            else console.log(`✅ Success updating ${table}`);
         }
       }
     } catch { /* ignore */ }
  }
}
check();
