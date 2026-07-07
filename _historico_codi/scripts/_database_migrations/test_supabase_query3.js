import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase
    .from('market_items')
    .select('uuid, profiles!fk_market_author_profile(avatar_url, full_name, town_uuid)')
    .limit(1);
  console.log('Test market_items (uuid):', error ? error.message : 'OK');
}
test();
