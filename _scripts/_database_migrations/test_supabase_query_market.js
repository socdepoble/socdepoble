import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testQuery() {
  console.log("Testing market_items...");
  
  const { data: cols, error: errCols } = await supabase.from('market_items').select('*').limit(1);
  if (errCols) {
    console.error("market_items select * error:", errCols);
  } else {
    console.log("market_items columns:", cols && cols.length > 0 ? Object.keys(cols[0]) : "no rows");
  }

  const { data, error } = await supabase.from('market_items').select('uuid').limit(1);
  if (error) {
    console.error("market_items uuid error:", error);
  } else {
    console.log("market_items uuid success:", data);
  }
}
testQuery();
