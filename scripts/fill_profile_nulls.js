import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// If no VITE_SUPABASE_SERVICE_ROLE_KEY is in .env, try to read from other files or just use ANON
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Fetching entities (towns)...");
  const { data: towns, error: townsErr } = await supabase.from('entities').select('id, name');
  if (townsErr) {
    console.error("Error fetching towns:", townsErr);
    return;
  }
  
  const townMap = {};
  towns.forEach(t => {
     // match names loosely
     if (t.name.includes("Torre")) townMap["La Torre de les Maçanes"] = t.id;
     if (t.name.includes("Muro")) townMap["Muro"] = t.id;
     if (t.name.includes("Cocentaina")) townMap["Cocentaina"] = t.id;
     if (t.name.includes("Relleu")) townMap["Relleu"] = t.id;
     if (t.name.includes("Agost")) townMap["Agost"] = t.id;
     if (t.name.includes("Banyeres")) townMap["Banyeres"] = t.id;
     if (t.name.includes("Vall")) townMap["La Vall"] = t.id;
     if (t.name.includes("Ibi")) townMap["Ibi"] = t.id;
     townMap[t.name] = t.id;
  });

  console.log("Fetching profiles...");
  const { data: profiles, error: profErr } = await supabase.from('profiles').select('*');
  if (profErr) {
    console.error("Error fetching profiles:", profErr);
    return;
  }

  const updates = [];
  
  for (const p of profiles) {
    let changed = false;
    let dataToUpdate = {};

    // 1. Javi's Profile
    if (p.full_name === 'Javi Llinares' || p.username === 'javillinares') {
      if (p.primary_town !== 'La Torre de les Maçanes') { dataToUpdate.primary_town = 'La Torre de les Maçanes'; changed = true; }
      if (p.bio !== 'Disseny Gràfic') { dataToUpdate.bio = 'Disseny Gràfic'; changed = true; }
      if (p.town_uuid !== townMap["La Torre de les Maçanes"]) { dataToUpdate.town_uuid = townMap["La Torre de les Maçanes"]; changed = true; }
      if (p.is_demo_test === null) { dataToUpdate.is_demo_test = false; changed = true; }
      if (p.by_ai === null) { dataToUpdate.by_ai = false; changed = true; }
    } else {
      // 2. AI Profiles
      // Usually these have role = 'meta-roster' or 'official', or known by_ai = true
      // They might have primary_town set string but town_uuid is null
      if (p.primary_town && p.primary_town !== 'Global' && !p.town_uuid) {
         const matchingId = townMap[p.primary_town];
         if (matchingId) {
            dataToUpdate.town_uuid = matchingId;
            changed = true;
         }
      }

      if (p.is_demo_test === null) { dataToUpdate.is_demo_test = false; changed = true; }
      if (p.by_ai === null && p.role && (p.role === 'meta-roster' || p.role === 'official')) {
         dataToUpdate.by_ai = true; changed = true;
      }
      
      // Provide an empty array for cameras if it's currently NULL to "fill the nulls"
      if (p.cameras === null) {
          dataToUpdate.cameras = []; changed = true;
      }

      // Default position if NULL? maybe not needed, but let's set it to some default object if possible, 
      // or leave it if Supabase expects a true PostGIS type.
      // Usually it's JSONB {"lat": 0, "lng": 0} or PostGIS Point.
    }

    if (changed) {
      console.log(`Updating ${p.full_name}:`, dataToUpdate);
      const { error: updErr } = await supabase.from('profiles').update(dataToUpdate).eq('id', p.id);
      if (updErr) {
         console.error(`Failed to update ${p.full_name}:`, updErr.message);
      } else {
         updates.push(p.full_name);
      }
    }
  }

  console.log(`Successfully updated ${updates.length} profiles.`);
}

run();
