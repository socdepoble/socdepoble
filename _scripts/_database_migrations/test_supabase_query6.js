import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .limit(1);
  console.log('Posts columns:', error ? error.message : Object.keys(data[0] || {}));
}
test();
