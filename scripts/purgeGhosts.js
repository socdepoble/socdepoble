import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://adjlvwtxhpclgmnsvwpm.supabase.co';
const supabaseKey = 'sb_publishable_ffKxgLg8RTGZunh0es1o6Q_sfIWknZ9'; // Anon key is enough if RLS allows delete, but maybe not?

const supabase = createClient(supabaseUrl, supabaseKey);

async function purgeGhosts() {
  const slugsToPurge = ['skills', 'projecte', 'el-projecte', 'constitucio', 'versions'];
  
  for (const slug of slugsToPurge) {
    const { data, error } = await supabase
      .from('cms_pages')
      .delete()
      .eq('slug', slug);
      
    if (error) {
      console.error(`Error deleting ${slug}:`, error.message);
    } else {
      console.log(`Deleted ${slug}:`, data);
    }
  }
}

purgeGhosts();
