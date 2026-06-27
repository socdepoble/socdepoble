import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data: cols, error: errCols } = await supabase.from('entities').select('*').limit(1);
  if (errCols) {
    console.error("entities error:", errCols.message);
  } else {
    console.log("entities columns:", cols && cols.length > 0 ? Object.keys(cols[0]) : "no rows");
  }
}
run();
