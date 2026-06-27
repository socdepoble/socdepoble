import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase
    .from('posts')
    .select('id, profiles!fk_posts_author_profile(avatar_url, full_name, town_uuid)')
    .limit(1);
  console.log('Test 1 (posts):', error ? error.message : 'OK');

  const { data: d2, error: e2 } = await supabase
    .from('market_items')
    .select('id, profiles!fk_market_author_profile(avatar_url, full_name, town_uuid)')
    .limit(1);
  console.log('Test 2 (market_items profiles):', e2 ? e2.message : 'OK');
}
test();
