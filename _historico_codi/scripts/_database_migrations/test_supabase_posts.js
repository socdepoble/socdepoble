import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testQuery() {
  console.log("Testing posts.select...");
  
  const selectStr = 'id, content, created_at, author, image_url, image_alt, author_role, author_type, is_playground, author_user_id, author_entity_id, profiles!fk_posts_author_profile(avatar_url, full_name, town_uuid)';
  
  const { data, error } = await supabase.from('posts').select(selectStr).limit(1);
  if (error) {
    console.error("posts select error:", error);
  } else {
    console.log("posts select success:", data);
  }
}
testQuery();
