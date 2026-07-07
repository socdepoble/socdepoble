import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase
    .from('market_items')
    .select('uuid, title, description, price, category_slug, created_at, author_user_id, avatar_url, image_url')
    .limit(1);
  console.log('Test market_items:', error ? error.message : 'OK');
}
test();
