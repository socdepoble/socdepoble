import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const TAG_MAP = {
    'formatge': 'Alimentació',
    'mel ': 'Alimentació',
    'mermelada': 'Alimentació',
    'tomates': 'Frescos',
    'vi ': 'Alimentació',
    'licor': 'Alimentació',
    'café': 'Alimentació',
    'pa ': 'Artesania',
    'oli ': 'Alimentació',
    'llit': 'Llar',
    'moble': 'Llar',
    'cadira': 'Llar',
    'taula': 'Llar',
    'ruta': 'Turisme',
    'guia': 'Turisme',
    'bossa': 'Souvenirs',
    'samarreta': 'Souvenirs',
    'llimona': 'Frescos',
    'poma': 'Frescos',
    'tomat': 'Frescos',
    'collita': 'Frescos',
    'fusta': 'Artesania',
    'ferro': 'Artesania',
    'ceràmica': 'Artesania',
    'test': 'Llar',
    'planta': 'Llar'
};

function guessTag(title) {
    if (!title) return 'Producte';
    const t = title.toLowerCase();
    for (const [key, tag] of Object.entries(TAG_MAP)) {
        if (t.includes(key)) return tag;
    }
    return 'Producte';
}

async function run() {
  console.log("Fetching IAIA MarIA profile...");
  const { data: iaiaProfile } = await supabase.from('profiles').select('*').eq('username', 'iaia_master').single();
  if (!iaiaProfile) return console.error("IAIA not found");
  console.log("IAIA Profile Found:", iaiaProfile.full_name, iaiaProfile.id);

  // 1. SANITIZE POSTS
  console.log("\\n--- SANITIZING POSTS ---");
  const { data: posts } = await supabase.from('posts').select('*');
  if (posts) {
      let postsUpdated = 0;
      for (const post of posts) {
          let updates = {};
          
          if (post.author_name && post.author_name.includes('Ajuntament de la Torre')) updates.author_name = 'Simulació Ajuntament La Torre';
          if (post.author && post.author.includes('Ajuntament de la Torre')) updates.author = 'Simulació Ajuntament La Torre';
          
          if (!post.author_id && !post.author_name && !post.author) {
              updates.author_id = iaiaProfile.id;
              updates.author_user_id = iaiaProfile.id;
              updates.author_name = iaiaProfile.full_name;
              updates.author = iaiaProfile.full_name;
              updates.author_role = 'official';
              updates.author_type = 'user';
              updates.author_is_ai = true;
              
              if (!post.town_uuid && iaiaProfile.town_uuid) {
                  updates.town_uuid = iaiaProfile.town_uuid;
              }
          }
          
          if (Object.keys(updates).length > 0) {
              const { error: err } = await supabase.from('posts').update(updates).eq('uuid', post.uuid);
              if (err) console.error(`Err updating post ${post.uuid}:`, err.message);
              else postsUpdated++;
          }
      }
      console.log(`Updated ${postsUpdated} posts.`);
  }

  // 2. SANITIZE MARKET ITEMS
  console.log("\\n--- SANITIZING MARKET ITEMS ---");
  const { data: marketItems } = await supabase.from('market_items').select('*');
  if (marketItems) {
      let marketUpdated = 0;
      for (const item of marketItems) {
          let updates = {};
          
          if (!item.tag || item.tag.trim() === '' || item.tag === 'null') {
              updates.tag = guessTag(item.title);
          }

          if (!item.author_name && !item.author_id && !item.author_user_id) {
              updates.author_id = iaiaProfile.id;
              updates.author_user_id = iaiaProfile.id;
              updates.author_name = iaiaProfile.full_name;
              updates.author_is_ai = true;
              updates.author_role = 'official';
              
              if (!item.town_uuid && iaiaProfile.town_uuid) {
                  updates.town_uuid = iaiaProfile.town_uuid;
              }
          }
          
          if (Object.keys(updates).length > 0) {
              const { error: err } = await supabase.from('market_items').update(updates).eq('uuid', item.uuid);
              if (err) console.error(`Err updating market item ${item.uuid}:`, err.message);
              else marketUpdated++;
          }
      }
      console.log(`Updated ${marketUpdated} market items.`);
  }
}

run();
