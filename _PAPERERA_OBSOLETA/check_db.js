import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
    // 1. Buscamos en posts (o en la tabla correcta)
    const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .or('author_name.is.null,author.is.null,author_name.ilike.%Ajuntament%');
    
    if (postsError) {
        console.error("Error in posts:", postsError.message);
    } else {
        console.log(`Found ${postsData.length} interesting rows in 'posts'.`);
        if (postsData.length > 0) {
            console.log("Sample:", postsData[0]);
        }
    }
}

checkData();
