import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase
    .from('posts')
    .select('*, author:profiles!fk_posts_author_profile(*)')
    .limit(1);
  console.log('Test posts profile join 2:', error ? error.message : 'OK');
}
test();
