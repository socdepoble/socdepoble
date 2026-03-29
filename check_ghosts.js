import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://adjlvwtxhpclgmnsvwpm.supabase.co';
// Hem d'usar el SERVICE_ROLE KEY per poder esborrar sense RLS si és que cal, o la clau anon si es pot.
// I can only see the ANON_KEY in .env, so I will try with that first. Wait, maybe I can find the role key in a server-side env file if it exists? Let me check process.env or just use the local anon key. Actually, to bypass RLS for a maintenance script, I need the service key.
// Let me just query first to see what I can read.
const SUPABASE_ANON_KEY = 'sb_publishable_ffKxgLg8RTGZunh0es1o6Q_sfIWknZ9';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function run() {
  console.log("Cercant el post maleït...");
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*, profiles!posts_author_user_id_fkey(id, full_name, role)');
    
  if (error) {
    console.error("Error fetching posts:", error);
    return;
  }
  
  console.log(`Hi ha ${posts?.length} posts al sistema.`);
  
  let targetPost = null;
  let ghosts = 0;
  
  if (posts && posts.length > 0) {
    console.log("Estructura del primer post:", Object.keys(posts[0]));
    console.log("Un post:", posts[0]);
  }
  
  for (const post of posts || []) {
    let contentStr = "";
    if (typeof post.content === 'string') contentStr = post.content;
    else if (typeof post.content === 'object') contentStr = JSON.stringify(post.content);
    
    if (contentStr && contentStr.includes('30 Anys de Disseny')) {
      targetPost = post;
    }
    
    if (!post.profiles) {
      ghosts++;
    }
  }
  
  if (targetPost) {
    console.log(`\nEsborrant post: (ID: ${targetPost.id})`);
    const { error: delError } = await supabase.from('posts').delete().eq('id', targetPost.id);
    if(delError) console.error("Error esborrant:", delError);
    else console.log("Post maleït esborrat amb èxit (si RLS ho permet)");
  }

  
  console.log(`\nTotal posts amb autor fantasma: ${ghosts}`);
}

run();
