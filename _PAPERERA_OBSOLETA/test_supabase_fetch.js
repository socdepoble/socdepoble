import { createClient } from '@supabase/supabase-js';

// Mock fetch
const originalFetch = global.fetch;
global.fetch = async (url, options) => {
    console.log("FETCH URL:", url);
    console.log("FETCH METHOD:", options.method);
    console.log("FETCH BODY:", options.body);
    return { ok: true, json: async () => ([]) };
};

const supabase = createClient('https://mock.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.dummy');

async function test() {
    const msg = {
        conversation_id: '11111111-1111-4111-a111-111111111111',
        sender_id: '11111111-1111-4111-a111-111111111111',
        content: 'Hola'
    };

    const safeColumns = 'id, conversation_id, sender_id, content, attachment_url, attachment_type, attachment_name, created_at, is_ai, is_read, is_playground';
    
    await supabase.from('messages').insert([msg]).select(safeColumns);
}

test();
