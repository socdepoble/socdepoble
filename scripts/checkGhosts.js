import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://adjlvwtxhpclgmnsvwpm.supabase.co';
const supabaseKey = 'sb_publishable_ffKxgLg8RTGZunh0es1o6Q_sfIWknZ9'; 

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkGhosts() {
  const slugsToCheck = ['skills', 'projecte', 'el-projecte', 'constitucio', 'versions'];
  
  const { data, error } = await supabase
    .from('cms_pages')
    .select('slug, title, html_content')
    .in('slug', slugsToCheck);
    
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Found:', data);
  }
}

checkGhosts();
