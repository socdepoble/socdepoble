import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const PINATA_JWT = Deno.env.get('PINATA_JWT');

serve(async (req) => {
  // 1. Verificar l'autenticació de l'usuari (JWT de Supabase)
  const authHeader = req.headers.get('Authorization');
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } }
  );
  
  const { data: { user }, error } = await supabaseClient.auth.getUser();
  if (error || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  // 2. Obtindre el CID del cos de la petició
  const { cid } = await req.json();
  if (!cid) {
    return new Response(JSON.stringify({ error: 'CID required' }), { status: 400 });
  }

  // 3. Cridar a l'API de Pinata per fer 'pin' del CID
  const pinataResponse = await fetch('https://api.pinata.cloud/pinning/pinByHash', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${PINATA_JWT}`,
    },
    body: JSON.stringify({
      hashToPin: cid,
      pinataMetadata: { name: `user_${user.id}_${cid}` }
    }),
  });

  if (!pinataResponse.ok) {
    const errorText = await pinataResponse.text();
    return new Response(JSON.stringify({ error: 'Pinata pinning failed', details: errorText }), { status: 500 });
  }

  const pinataResult = await pinataResponse.json();
  return new Response(JSON.stringify({ success: true, ipfsHash: pinataResult.IpfsHash }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
