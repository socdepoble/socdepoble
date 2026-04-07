import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkRoles() {
    const { data: posts, error } = await supabase.from('posts').select('id, author_role, author').neq('author_role', null);
    
    if (error) {
        console.error(error);
        return;
    }

    const uniqueRoles = [...new Set(posts.map(p => p.author_role))];
    console.log("Roles existentes en la DB:", uniqueRoles);

    // Filter roles that are NOT in our constraint list
    const valid = [
        'admin', 'official', 'ambassador', 'citizen', 'user', 'vei', 'freelance', 
        'business', 'company', 'group', 'institution', 'student', 'system', 
        'autonomous', 'community', 'private', 'personal'
    ];
    
    const invalidRoles = uniqueRoles.filter(r => !valid.includes(r));
    console.log("Roles INVÁLIDOS atascando la DB:", invalidRoles);
}
checkRoles();
