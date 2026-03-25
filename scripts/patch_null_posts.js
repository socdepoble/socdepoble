import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const AGENTS = {
  marc: '11111111-0000-0000-0000-000000000004',
  andreu: '11111111-1a1a-0001-0000-000000000001',
  vicent: '11111111-1111-4111-a111-000000000003',
  samir: '11111111-1111-4111-a111-000000000004',
  mariamel: '11111111-1111-4111-a111-000000000005',
  pepica: '11111111-1a1a-0001-0000-000000000007',
  carmen: '11111111-1111-4111-a111-000000000009',
  iaia: '11111111-1a1a-0000-0000-000000000000'
};

const NOVES_IMATGES = {
  308: 'https://cdn.discordapp.com/attachments/111/ametlles_campanya_logo.png', // Més endavant actualitzarem esta urL real si cal, per ara reservem el concepte visual
  319: 'https://cdn.discordapp.com/attachments/111/sopar_germanor_logo.png' 
};

async function patchPosts() {
  console.log('🔗 Connectant a Supabase per reassignar ànimes als posts nuls...');
  
  const { data: posts, error: fetchErr } = await supabase.from('posts').select('id, content').is('author_id', null);
  
  if (fetchErr) {
    console.error('Error recuperant els posts:', fetchErr);
    return;
  }

  if (!posts || posts.length === 0) {
    console.log('✅ El mur ja no té posts nuls. Tot el llegat de proves està correctament assignat o esborrat!');
    return;
  }

  let assignedCounts = {};
  
  for (const p of posts) {
    const txt = (p.content || '').toLowerCase();
    let assignTo = AGENTS.iaia;

    if (txt.includes('avís') || txt.includes('atenció') || txt.includes('obres')) assignTo = AGENTS.marc;
    else if (txt.includes('sortida') || txt.includes('cim') || txt.includes('reforestació') || txt.includes('poma')) assignTo = AGENTS.andreu;
    else if (txt.includes('oli') || txt.includes('ametlla') || txt.includes('mel')) assignTo = AGENTS.vicent;
    else if (txt.includes('teixit')) assignTo = AGENTS.samir;
    else if (txt.includes('arc antic') || txt.includes('fira') || txt.includes('assaig general') || txt.includes('exposicions')) assignTo = AGENTS.mariamel;
    else if (txt.includes('ciclamens') || txt.includes('bulbs')) assignTo = AGENTS.pepica;
    else if (txt.includes('formatges') || txt.includes('vi de la terra') || txt.includes('premi')) assignTo = AGENTS.carmen;
    else if (txt.includes('germanor') || txt.includes('sopar')) assignTo = AGENTS.iaia;

    const updates = { author_id: assignTo };
    
    // Injecció de les obres generades per "Nano Banana"
    if (NOVES_IMATGES[p.id]) {
      // Per ara podem pujar aquestes imatges a mà a un storage però per simular injectem l'URL conceptual
      // Aquí, l'URL real el configurarem manualment ja siga al Storage de supabase o passant-la a public/images.
      updates.image_url = '/images/ametlles_campanya_logo.png'; 
      if(p.id === 319) updates.image_url = '/images/sopar_germanor_logo.png';
    }

    const { error: updErr } = await supabase.from('posts').update(updates).eq('id', p.id);
    
    if (updErr) {
      console.error(`❌ Error actualitzant post ${p.id}:`, updErr);
    } else {
      assignedCounts[assignTo] = (assignedCounts[assignTo] || 0) + 1;
      console.log(`✅ Post ${p.id} assignat exitosament a un agent.`);
    }
  }

  console.log('\n📊 RESUM D\'ASSIGNACIONS:');
  for (const [agentId, count] of Object.entries(assignedCounts)) {
    console.log(`- Agent ID ${agentId.split('-')[1]} va rebre: ${count} posts`);
  }
}

patchPosts();
