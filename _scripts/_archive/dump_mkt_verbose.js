import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  console.log('Fetching market_items...');
  const { data: mkt, error: err1 } = await supabase.from('market_items').select('*').limit(5);
  console.log('mkt items:', mkt ? mkt.length : 0, err1 || '');
  if (mkt && mkt.length > 0) {
    console.log('Columns:', Object.keys(mkt[0]));
    console.log('Sample title:', mkt[0].title);
  }

  console.log('Fetching system_agents...');
  const { data: agnt } = await supabase.from('system_agents').select('*').eq('name', 'Sóc de Poble');
  console.log('agents found Sóc de Poble?', agnt);

  console.log('Fetching entities view...');
  const { data: ent } = await supabase.from('entities').select('*').eq('name', 'Sóc de Poble');
  console.log('entities found Sóc de Poble?', ent);
}
run();
