import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  try {
    const { data } = await supabase.from('market_items').select('*').limit(5);
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
run();
