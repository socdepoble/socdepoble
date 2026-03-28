import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Fetching posts written by Ajuntament...');
  const { data, error } = await supabase
    .from('posts')
    .select('id, author')
    .ilike('author', '%Ajuntament%');

  if (error) {
    console.error('Error fetching:', error);
    return;
  }

  console.log(`Found ${data?.length || 0} posts.`);

  if (!data || data.length === 0) return;

  let updated = 0;
  for (const post of data) {
    if (!post.author.startsWith('Simulació ')) {
      // Reemplaçar "Ajuntament" amb "Simulació Ajuntament" 
      // Si l'autor ja és "Ajuntament de la Torre", serà "Simulació Ajuntament de la Torre"
      const newAuthor = 'Simulació ' + post.author;
      const { error: updateError } = await supabase
        .from('posts')
        .update({ author: newAuthor })
        .eq('id', post.id);
        
      if (updateError) {
        console.error(`Error updating post ${post.id}:`, updateError);
      } else {
        updated++;
      }
    }
  }

  console.log(`Successfully updated ${updated} posts.`);
}

run();
