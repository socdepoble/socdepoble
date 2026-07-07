import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function check() {
  const { data: vw, error: vwe } = await supabase.from('marketplace_items').select('*').eq('id', 'd921ddee-215b-4239-8aca-22bd001fd2f8');
  console.log('marketplace_items:', vw, vwe ? vwe.message : '');

  const { data: ent } = await supabase.from('entities').select('*').eq('id', 'd921ddee-215b-4239-8aca-22bd001fd2f8');
  console.log('entities:', ent);
  
  // Also check system_agents in case it failed earlier? No, earlier system_agents returned []
}
check();
