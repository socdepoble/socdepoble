/* eslint-disable */
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

async function findTheMotherboard() {
  console.log('--- BUSCANDO TORREMANZANAS EN ABSOLUTAMENTE TODAS LAS TABLAS COMUNES ---');
  
  const tables = [
    'profiles', 'system_agents', 'market_items', 'towns', 'events', 
    'realms', 'businesses', 'companies', 'entity_members', 'posts', 'comments',
    'market_categories', 'town_realms'
  ];

  for (const table of tables) {
    try {
      let { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(10); // Solo cogemos algunos para no petar si es gigante, buscaremos luego en js

      if (error) {
        console.log(`Tabla ${table} inaccesible u oculta:`, error.message);
        continue;
      }

      if (data && data.length > 0) {
        // Buscamos si Torremanzanas o Sóc de Poble está en CUALQUIER campo de cualquier fila
        let found = false;
        for (const row of data) {
           const rowStr = JSON.stringify(row);
           if (rowStr.includes('Torremanzanas') || rowStr.includes('d921ddee-215b-4239-8aca-22bd001fd2f8')) {
              console.log(`🚨 ¡ENCONTRADO EN LA TABLA: ${table}!`, row);
              found = true;
           }
        }
        
        // Búsqueda específica directa en la base de datos por 'name' o similar si no está en las 10 primeras
        try {
          let { data: deepData } = await supabase.from(table).select('*').or('name.ilike.%Torremanzanas%,title.ilike.%Torremanzanas%,description.ilike.%Torremanzanas%').limit(1);
          if (deepData && deepData.length > 0) {
            console.log(`🚨 ¡BÚSQUEDA PROFUNDA ENCONTRÓ TORREMANZANAS EN: ${table}!`, deepData);
          }
        } catch (e) {
          // Ignore
        }
      }
    } catch(err) {
      console.log(`Error buscando en ${table}`);
    }
  }

  // Buscamos a SOC DE POBLE si o si!
  for (const table of tables) {
    try {
       let { data: soc } = await supabase.from(table).select('*').eq('id', 'd921ddee-215b-4239-8aca-22bd001fd2f8');
       if (soc && soc.length > 0) {
         console.log(`👻 ¡EL FANTASMA SOC DE POBLE VIVE EN LA TABLA FÍSICA: ${table}!`, soc);
       }
    } catch(e) {}
  }
}

findTheMotherboard();
