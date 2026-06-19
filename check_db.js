import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function check() {
  const { data: posts, error: errorPosts } = await supabase.from('posts').select('*').limit(2);
  console.log('Posts:', posts, errorPosts);
  
  const { data: market, error: errorMarket } = await supabase.from('market_items').select('*').limit(2);
  console.log('Market Items:', market, errorMarket);
}

check();
