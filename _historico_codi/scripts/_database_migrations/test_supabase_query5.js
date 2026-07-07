import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  let selectStr = 'id, uuid, content, created_at, author, image_url, image_alt, author_role, author_type, is_playground, author_user_id, author_entity_id, profiles!fk_posts_author_profile(avatar_url, full_name, town_uuid)';
  const { data, error } = await supabase
    .from('posts')
    .select(selectStr)
    .limit(1);
  console.log('Test posts:', error ? error.message : 'OK');
}
test();
