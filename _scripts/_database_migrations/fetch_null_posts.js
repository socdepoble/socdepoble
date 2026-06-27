import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: Supabase URL o Key no trobades a l'entorn.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectPosts() {
  console.log('🔍 Inspeccionant posts orfes o nuls...');
  
  const { data, error } = await supabase
    .from('posts')
    .select('id, content, image_url, author_id, created_at')
    
  if (error) {
    console.error('Error consultant posts:', error);
    process.exit(1);
  }

  const nullPosts = data.filter(p => !p.author_id);
  const masterPosts = data.filter(p => p.author_id === 'd6325f44-7277-4d2d-b020-166c010995ab');
  const validPosts = data.filter(p => p.author_id && p.author_id !== 'd6325f44-7277-4d2d-b020-166c010995ab');

  console.log(`\n📊 ESTAT DEL MUR:`);
  console.log(`- TOTAL POSTS: ${data.length}`);
  console.log(`- POSTS ORFES (NULL): ${nullPosts.length}`);
  console.log(`- POSTS DEL MESTRE (Congelats): ${masterPosts.length}`);
  console.log(`- POSTS VALIDS (D'altres): ${validPosts.length}`);

  if (nullPosts.length > 0) {
    console.log(`\n📋 Llista de Posts Orfes (Primeros 20):`);
    nullPosts.slice(0, 20).forEach(p => {
      console.log(`\nID: ${p.id}`);
      console.log(`CONTINGUT: ${p.content ? p.content.substring(0, 100) + '...' : 'Sense Contingut'}`);
      console.log(`IMATGE: ${p.image_url ? 'Sí (Té imatge)' : '❌ NO'}`);
    });
  }

  // Tambe detectem si les samarretes del mestre han sigut traspassades (aixó sabrem si s'ha executat l'SQL 07)
  const samarretaIAIA = data.find(p => p.author_id === '11111111-1a1a-0000-0000-000000000000' && (p.content?.toLowerCase().includes('samarreta') || p.content?.toLowerCase().includes('camiseta')));
  if (samarretaIAIA) {
     console.log('\n✅ LA CAMISETA DEL MESTRE JA ÉS PROPIETAT DE LA IAIA!');
  } else {
     console.log('\n⏳ La camiseta encara NO s\'ha assignat a la IAIA. Cal que el mestre execute 07_RESURRECT_AGENTS.sql');
  }

}

inspectPosts();
