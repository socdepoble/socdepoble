import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkQuery(name, q) {
  const { data, error } = await q.limit(1);
  if (error) console.error(`❌ ${name} ERROR:`, error.message);
  else console.log(`✅ ${name} OK`);
}

async function run() {
  await checkQuery('profiles', supabase.from('profiles').select('*'));
  await checkQuery('entities', supabase.from('entities').select('id, name, slug, avatar_url, cover_url, description, type, category, status, verification_status, town_uuid, social_links, contact_info, business_hours, members'));
  await checkQuery('user_roles', supabase.from('user_roles').select('*'));
  await checkQuery('system_config', supabase.from('system_config').select('*'));
}
run();
