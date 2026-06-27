import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  const { data: posts, error: error1 } = await supabase.from('posts').select('*').limit(1);
  console.log("Posts columns:", Object.keys(posts?.[0] || {}));
  
  const { data: profiles, error: error2 } = await supabase.from('profiles').select('*').limit(1);
  console.log("Profiles columns:", Object.keys(profiles?.[0] || {}));
}

checkSchema();
