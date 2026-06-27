import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testQuery() {
  const { data, error } = await supabase.from('market_items').select('id').limit(1);
  if (error) {
    console.error("market_items id error:", error);
  } else {
    console.log("market_items id success:", data);
  }
}
testQuery();
