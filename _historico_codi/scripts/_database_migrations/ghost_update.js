import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function purgeGhost() {
  console.log('--- TEST 1: UPDATE DIRECTO A ENTITIES ---');
  let { data, error } = await supabase
    .from('entities')
    .update({ avatar_url: '/assets/master/logo_socdepoble_green_square.png' })
    .eq('id', 'd921ddee-215b-4239-8aca-22bd001fd2f8')
    .select();
    
  if (error) {
    console.error('❌ Falló el UPDATE en Entities (Confirmado que es una vista de sólo lectura):', error.message);
  } else {
    console.log('✅ ÉXITO: ¡Entities era una tabla actualizable (o view actualizable)! Datos:', data);
  }

  console.log('--- TEST 2: DELETE DIRECTO DE TORREMANZANAS (Fantasma viejo) ---');
  let { error: err2 } = await supabase
    .from('entities')
    .delete()
    .ilike('name', '%Torremanzanas%');
    
  if (err2) {
    console.error('❌ Falló el DELETE en Entities:', err2.message);
  } else {
    console.log('✅ ÉXITO: Torremanzanas fue eliminado mágicamente de entities.');
  }
}

purgeGhost();
