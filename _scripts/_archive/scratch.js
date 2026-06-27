import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log("Fetching columns for posts...");
    const { data: postsData, error: postsErr } = await supabase.from('posts').select('*').limit(1);
    if (postsErr) console.error("Posts error:", postsErr);
    else if (postsData && postsData[0]) console.log("Posts columns:", Object.keys(postsData[0]).join(', '));
    else console.log("No posts found.");

    console.log("\nFetching columns for market_items...");
    const { data: marketData, error: marketErr } = await supabase.from('market_items').select('*').limit(1);
    if (marketErr) console.error("Market error:", marketErr);
    else if (marketData && marketData[0]) console.log("Market columns:", Object.keys(marketData[0]).join(', '));
    else console.log("No market items found.");
}

checkSchema();
