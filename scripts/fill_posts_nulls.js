import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Fetching IAIA MarIA profile...");
  const { data: iaiaProfile, error: iaiaErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', 'iaia_master')
    .single();

  if (iaiaErr || !iaiaProfile) {
    console.error("Error fetching IAIA profile:", iaiaErr);
    return;
  }
  
  console.log("IAIA Profile Found:", iaiaProfile.full_name, iaiaProfile.id);

  console.log("Fetching posts...");
  const { data: posts, error: postsErr } = await supabase.from('posts').select('*');
  
  if (postsErr) {
    console.error("Error fetching posts:", postsErr);
    return;
  }

  const updates = [];
  let ajuntamentCount = 0;
  let orphanCount = 0;

  for (const post of posts) {
    let changed = false;
    let dataToUpdate = {};

    // 1. Rename Ajuntament de la Torre
    if (post.author_text && post.author_text.includes('Ajuntament de la Torre')) {
      dataToUpdate.author_text = 'Simulació Ajuntament la Torre';
      
      changed = true;
      ajuntamentCount++;
    }

    // 2. Orphan posts (author_id or author_text is NULL)
    if (!post.author_id || !post.author_text) {
      dataToUpdate.author_id = iaiaProfile.id;
      dataToUpdate.author_text = iaiaProfile.full_name;
      dataToUpdate.author_role = iaiaProfile.role || 'official';
      dataToUpdate.author_type = 'user'; // It's an AI 'user'
      
      if (!post.town_id && iaiaProfile.town_uuid) {
          dataToUpdate.town_id = iaiaProfile.town_uuid;
      }
      
      changed = true;
      orphanCount++;
    }

    if (changed) {
      // make sure we use the correct primary key
      const pk = post.id || post.uuid;
      const { error: updErr } = await supabase.from('posts').update(dataToUpdate).eq('id', pk);
      if (updErr) {
         console.error(`Failed to update post ${pk}:`, updErr.message);
      } else {
         updates.push(post.id);
      }
    }
  }

  console.log(`Successfully updated ${updates.length} posts.`);
  console.log(`- Renamed "Ajuntament de la Torre" in ${ajuntamentCount} posts.`);
  console.log(`- Assigned ${orphanCount} orphan posts to IAIA.`);
  
  // Extra: Also check entities table to see if we need to rename the actual entity
  const { data: entities, error: entErr } = await supabase.from('entities').select('*');
  if (!entErr && entities) {
      for (const ent of entities) {
          if (ent.name && ent.name.includes('Ajuntament de la Torre')) {
              console.log(`Renaming Entity: ${ent.name} to Simulació Ajuntament la Torre`);
              await supabase.from('entities').update({ name: 'Simulació Ajuntament la Torre' }).eq('id', ent.id);
          }
      }
  }
}

run();
