 
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  console.log('Fetching profiles...');
  const { data: prof, error: errp } = await supabase.from('profiles').select('id, username, full_name, avatar_url, role').ilike('username', '%Sóc de Poble%').or('full_name.ilike.%Sóc de Poble%');
  console.log('profiles found:', prof, errp || '');

  console.log('Fetching any table with id d921ddee-215b-4239-8aca-22bd001fd2f8 ...');
  
  const tables = ['profiles', 'market_items', 'events', 'towns', 'realms', 'system_agents', 'businesses', 'companies'];
  for (const table of tables) {
    const { data: test, error: errt } = await supabase.from(table).select('*').eq('id', 'd921ddee-215b-4239-8aca-22bd001fd2f8');
    if (test && test.length > 0) {
      console.log(`\nFound in ${table}!`);
      console.log(test[0]);
    }
  }

}
run();
