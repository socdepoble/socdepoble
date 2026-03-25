const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if(!supabaseUrl) { console.error('No Supabase URL'); process.exit(1); }
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('profiles').select('id, full_name, email, role, avatar_url, updated_at').ilike('full_name', '%Javi%Llinares%');
  if (error) console.error(error);
  else console.log(JSON.stringify(data, null, 2));
}
run();
