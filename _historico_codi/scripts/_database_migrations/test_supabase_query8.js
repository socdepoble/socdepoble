import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase
    .from('market_items')
    .select('uuid, title, price, created_at, avatar_url')
    .order('created_at', { ascending: false })
    .limit(10);
  console.log('Test market_items overview:', error ? error.message : 'OK');
}
test();
