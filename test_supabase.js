import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  const p1Id = '00000000-0000-0000-0000-000000000001'; // Mock user
  const p2Id = '11111111-1a1a-0000-0000-000000000000'; // IAIA
  
  const payload = {
      participant_1_id: p1Id,
      participant_1_type: 'user',
      participant_2_id: p2Id,
      participant_2_type: 'ai'
  };

  const response = await fetch(`${supabaseUrl}/rest/v1/conversations?select=id,participant_1_id,participant_2_id,created_at`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload)
  });

  console.log("HTTP STATUS:", response.status);
  const data = await response.json();
  console.log("HTTP BODY:", data);
}

testInsert();
