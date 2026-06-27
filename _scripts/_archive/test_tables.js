import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testCols(table) {
  const { data: cols, error: errCols } = await supabase.from(table).select('*').limit(1);
  if (errCols) {
    console.error(table, "error:", errCols.message);
  } else {
    console.log(table, "columns:", cols && cols.length > 0 ? Object.keys(cols[0]) : "no rows");
  }
}
async function run() {
  await testCols('events');
  await testCols('towns');
  await testCols('profiles');
  await testCols('user_roles');
}
run();
