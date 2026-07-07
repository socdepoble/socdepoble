import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function purgeGhosts() {
    console.log('Initiating ghost purging protocol...');
    
    // Purging user "javi" (Javi Llinares / javi-llinares) & "damian"
    const { data: ghosts, error: fetchError } = await supabase
        .from('profiles')
        .select('id, username, full_name')
        .or('username.ilike.%javi%,full_name.ilike.%javi%,username.ilike.%damian%,full_name.ilike.%damian%');

    if (fetchError) {
        console.error('Error finding ghosts:', fetchError.message);
        return;
    }

    if (!ghosts || ghosts.length === 0) {
        console.log('No ghosts actively haunting the database.');
        return;
    }

    console.log(`Found ${ghosts.length} ghost(s) to purge:`);
    ghosts.forEach(g => console.log(`- ${g.id} (${g.username} / ${g.full_name})`));

    const idsToPurge = ghosts.map(g => g.id);

    // Delete associated items before deleting profiles? Depends on cascade setup. Assuming cascade is on for now, or just deleting from profiles.
    const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .in('id', idsToPurge);

    if (deleteError) {
        console.error('Failed to purge ghosts:', deleteError.message);
    } else {
        console.log('Ghost purging protocol successful. Database is clensed.');
    }
}

purgeGhosts();
