import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Cache-Control': 'no-store, no-cache, must-revalidate', // ← nueva capa anti-cache dinámica
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization') || `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`;
    const isAnon = authHeader === `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`;

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    let userId = 'anonymous-guest-user';
    let isActuallyAnon = isAnon;

    if (!isAnon) {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        // Tolerem usuaris amb token expirat o invàlid com a anònims
        isActuallyAnon = true;
      } else {
        userId = data.user.id;
      }
    }
    
    if (isActuallyAnon) {
      const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0] || 'unknown';
      userId = `guest-${ip}`;
    }

    // RATE LIMIT → UNA ÚNICA RPC (la magia que rascaba 150-250 ms)
    const { data: rateLimit } = await supabase.rpc('enforce_rate_limit', {
      p_user_id: userId,
      p_max_requests: isAnon ? 10 : 100
    });

    if (rateLimit && rateLimit[0]?.limited) {
      return new Response(
        JSON.stringify({ error: { message: `Límit excedit: ${rateLimit[0].max_requests}/h` } }),
        { status: 429, headers: corsHeaders }
      );
    }

    const { model, geminiPayload, personaKey } = await req.json();

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')!;

    // V11.0 O2 Fix: Loggem d'ús RÀPID, però AWAITED per evitar mort sobtada de l'Isolate.
    // Així ens assegurem que el cost de token queda marcat.
    await supabase.from('api_usage_logs').insert({
      user_id: userId,
      persona_key: personaKey,
      model,
      timestamp: new Date().toISOString(),
      success: true 
    }).catch((e) => { console.error("Error logs", e); }); // fail-silent gracefully

    // V11.0: Real Stream Bypass API (Node/Deno Stream Pipe)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiPayload),
        signal: req.signal
      }
    );

    if (!response.ok) {
        const text = await response.text();
        return new Response(text, { status: response.status, headers: corsHeaders });
    }

    // Retorna el corrent directament al client (True Bypass)
    return new Response(response.body, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive'
      }
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: { message: error.message } }),
      { status: 500, headers: corsHeaders }
    );
  }
});
