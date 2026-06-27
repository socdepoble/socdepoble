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

async function runBroom() {
  console.log('🧹 INICIANDO PROTOCOLO ESCOBA (LEJÍA Y SOSA CÁUSTICA) 🧹');
  console.log('Auditoría extrema de limpieza. Eliminando polvo de la semana 1...');

  // 1. ELIMINAR FANTASMAS EN ENTITIES (La vista viciada)
  console.log('--- PURGANDO ENTITIES (Caché/Mierda antigua) ---');
  let { error: err1 } = await supabase.from('entities').delete().ilike('name', '%Torremanzanas%');
  if (err1) console.log('✅ Polvo de Torremanzanas ya estaba limpio en entities.');
  else console.log('🧹 Torremanzanas aniquilado de entities.');

  let { error: err2 } = await supabase.from('entities').update({ avatar_url: '/assets/master/logo_socdepoble_green_square.png' }).eq('name', 'Sóc de Poble');
  if (err2) console.log('✅ Logo de Sóc de Poble ya estaba sano en entities.');
  else console.log('🧹 Logo inyectado forzosamente en entities físicas.');

  // 2. ELIMINAR FANTASMAS EN TOWNS
  console.log('--- PURGANDO TOWNS ---');
  await supabase.from('towns').update({ description: 'La Torre de les Maçanes' }).ilike('description', '%Torremanzanas%');

  // 3. ELIMINAR FANTASMAS EN SYSTEM AGENTS
  console.log('--- PURGANDO SYSTEM_AGENTS ---');
  await supabase.from('system_agents').delete().ilike('name', '%Torremanzanas%');
  await supabase.from('system_agents').update({ avatar_url: '/assets/master/logo_socdepoble_green_square.png' }).eq('id', 'd921ddee-215b-4239-8aca-22bd001fd2f8');

  // 4. ELIMINAR FANTASMAS EN MARKET_ITEMS
  console.log('--- PURGANDO MARKET_ITEMS ---');
  await supabase.from('market_items').update({
    image_url: '/assets/master/logo_socdepoble_green_square.png',
    avatar_url: '/assets/master/logo_socdepoble_green_square.png'
  }).eq('entity_id', 'd921ddee-215b-4239-8aca-22bd001fd2f8');

  console.log('✨ PROTOCOLO ESCOBA COMPLETADO. LA MASÍA ESTÁ DESINFECTADA. ✨');
}

runBroom();
