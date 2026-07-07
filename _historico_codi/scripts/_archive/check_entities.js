import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY);

async function check() {
  const { data: vw } = await supabase.from('entities').select('*').eq('name', 'Sóc de Poble');
  console.log("From entities VIEW:", vw);

  // Check profiles
  const { data: prof } = await supabase.from('profiles').select('id, username, avatar_url, role').ilike('username', '%Sóc de Poble%');
  console.log("From profiles:", prof);

  // Check market_items (in case it's a commerce entity)
  const { data: mkt } = await supabase.from('market_items').select('id, name, logo_url').ilike('name', '%Sóc de Poble%');
  console.log("From market_items:", mkt);
}
check();
