import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://adllvwlsbqclsomzvwpm.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkConstraints() {
  const { data, error } = await supabase.rpc('get_table_info', { table_name: 'messages' });
  if (error) {
      console.log('RPC Failed. Trying alternative by inserting a duplicate test message...');
      
      // Let's insert a random message and see if it fails
      const testMsg = {
          conversation_id: '11111111-1111-4111-a111-111111111111', 
          sender_id: '11111111-1111-4111-a111-111111111111',
          content: 'Test duplicate'
      };
      
      const r1 = await supabase.from('messages').insert([testMsg]).select();
      console.log("R1", r1);
      
      const r2 = await supabase.from('messages').insert([testMsg]).select();
      console.log("R2", r2);
  } else {
      console.log(data);
  }
}
checkConstraints();
