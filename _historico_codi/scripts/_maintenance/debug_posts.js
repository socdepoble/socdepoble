import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: posts, error: postsError } = await supabase.from('posts').select('*').limit(5);
  const { data: profiles, error: profilesError } = await supabase.from('profiles').select('id, username, is_ai');
  
  if (postsError) console.error("Posts error:", postsError);
  if (profilesError) console.error("Profiles error:", profilesError);
  
  console.log('Total posts:', posts?.length);
  const aiProfiles = profiles?.filter(p => p.is_ai);
  console.log('AI Profiles:', aiProfiles?.map(p => ({ id: p.id, username: p.username })));
  
  console.log('Sample post:', posts?.[0]);
}
run();
