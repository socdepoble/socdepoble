import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '.env.deploy') });
dotenv.config({ path: resolve(__dirname, '.env') }); // Carrega .env

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  const p1Id = '00000000-0000-0000-0000-000000000001'; // Mock user
  const p2Id = '11111111-1a1a-0000-0000-000000000000'; // IAIA
  
  const types = ['ai', 'entity', 'user'];

  for (const type of types) {
      console.log(`Testing type: ${type}`);
      const payload = {
          participant_1_id: p1Id,
          participant_1_type: 'user',
          participant_2_id: p2Id,
          participant_2_type: type
      };

      const { error } = await supabase
          .from('conversations')
          .insert(payload)
          .select('id');

      if (error) {
          console.log(`❌ Failed for type '${type}':`, error.code, error.message);
      } else {
          console.log(`✅ Success for type '${type}'`);
      }
  }
}

testInsert();
