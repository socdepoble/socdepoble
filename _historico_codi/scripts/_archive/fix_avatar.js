import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY);

async function fix() {
  const { error } = await supabase.from('entities')
    .update({ avatar_url: '/assets/master/logo_socdepoble_green_square.png' })
    .eq('name', 'Sóc de Poble');
  
  if (error) {
     console.error("Error:", error.message);
  } else {
     console.log("✅ Avatar Corporativo inyectado en la tabla entities con éxito.");
  }
}
fix();
