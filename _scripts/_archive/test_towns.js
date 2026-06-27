import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testQuery() {
  const { data, error } = await supabase.from('towns').select('uuid').limit(1);
  if (error) console.error("towns uuid error:", error);
  else console.log("towns uuid success:", data);
}
testQuery();
