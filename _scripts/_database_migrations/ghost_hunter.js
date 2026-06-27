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

async function checkGhost() {
  console.log('--- FETCHING SYSTEM_AGENTS ---');
  let { data: agents, error: err1 } = await supabase
    .from('system_agents')
    .select('*')
    .limit(1);
    
  if (err1) console.error('Error agents:', err1);
  else if (agents && agents.length > 0) {
    console.log('Columnas en system_agents:', Object.keys(agents[0]));
  } else {
    console.log('system_agents devuelto vacío o inaccesible (RLS).');
  }

  console.log('--- FETCHING REALMS ---');
  let { data: realms, error: err2 } = await supabase
    .from('realms')
    .select('*')
    .limit(1);
    
  if (err2) console.error('Error realms:', err2);
  else if (realms && realms.length > 0) {
    console.log('Columnas en realms:', Object.keys(realms[0]));
  } else {
    console.log('realms devuelto vacío o inaccesible (RLS).');
  }

  console.log('--- FETCHING SÓC DE POBLE DIRECTAMENTE EN ENTITIES ---');
  let { data: ent, error: err3 } = await supabase
    .from('entities')
    .select('*')
    .eq('id', 'd921ddee-215b-4239-8aca-22bd001fd2f8');
    
  if (err3) console.error('Error entities:', err3);
  else console.log('El Fantasma Oculto (entities):', ent);
}

checkGhost();
