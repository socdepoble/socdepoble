import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY);

async function check() {
  // Query system_agents
  let r1 = await supabase.from('system_agents').select('*').eq('id', 'd921ddee-215b-4239-8aca-22bd001fd2f8');
  console.log("system_agents:", r1.data);
  
  if (r1.data && r1.data.length > 0) {
     console.log("💥 IS IN system_agents! Updating...");
     const {error} = await supabase.from('system_agents').update({ avatar_url: '/assets/master/logo_socdepoble_green_square.png' }).eq('id', 'd921ddee-215b-4239-8aca-22bd001fd2f8');
     if(error) console.error("Error updating system_agents", error);
     else console.log("✅ Fixed system_agents!");
  } else {
    console.log("Not in system_agents. Searching profiles...");
    let r2 = await supabase.from('profiles').select('*').eq('id', 'd921ddee-215b-4239-8aca-22bd001fd2f8');
    if (r2.data && r2.data.length > 0) {
      console.log("💥 IS IN profiles! Updating...");
      const {error} = await supabase.from('profiles').update({ avatar_url: '/assets/master/logo_socdepoble_green_square.png' }).eq('id', 'd921ddee-215b-4239-8aca-22bd001fd2f8');
      if(error) console.error("Error updating profiles", error);
      else console.log("✅ Fixed profiles!");
    } else {
        console.log("Searching market_items by ID...");
        let r3 = await supabase.from('market_items').select('*').eq('id', 'd921ddee-215b-4239-8aca-22bd001fd2f8'); // Note: could be id or uuid
        if (r3.data && r3.data.length > 0) {
            console.log("💥 IS IN market_items! Updating logo_url or avatar_url (maybe logo_url)...");
            console.log(r3.data[0]);
        }
    }
  }
}
check();
