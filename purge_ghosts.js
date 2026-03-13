const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
const finalKey = supabaseKey || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !finalKey) {
  console.error('Missing Supabase credentials in env.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, finalKey);

async function purgeGhosts() {
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, username')
      .or('full_name.ilike.%llinares%,email.ilike.%javillinares%,full_name.ilike.%damian%,username.ilike.%damian%');
      
    if (error) {
       console.error('Error finding profiles:', error);
       return;
    }
    
    console.log('Found profiles:', profiles);
    const allIds = profiles.map(p => p.id);
    
    if (allIds.length > 0) {
      console.log('Found IDs to nuke:', allIds);
      const { error: delErr } = await supabase.from('profiles').delete().in('id', allIds);
      if (delErr) {
        console.error('Error deleting profiles:', delErr);
      } else {
        console.log('NUKE COMPLETE. Profiles deleted.');
      }
    } else {
      console.log('No ghost profiles found to nuke.');
    }
  } catch (err) {
    console.error('Script Error:', err);
  }
}

purgeGhosts();
