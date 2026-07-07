import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log("Checking posts schema...");
  const { data: posts } = await supabase.from('posts').select('*').limit(2);
  console.log("POSTS 0:", posts[0]);
  
  console.log("Checking market_items schema...");
  const { data: marketItems } = await supabase.from('market_items').select('*').limit(2);
  console.log("MARKET_ITEMS 0:", marketItems[0]);
}

check();
