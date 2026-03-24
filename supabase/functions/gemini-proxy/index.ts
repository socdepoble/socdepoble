// ✅ EDGE FUNCTION - GESTIÓN SEGURA DE CLAVES API
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // [SEGURETAT] Validar sesión del usuario
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('No autorizado');
    }

    // [RATE LIMIT] Máximo 100 peticiones/hora por usuario
    const { data: rateLimitData } = await supabaseClient
      .from('api_rate_limits')
      .select('request_count, last_reset')
      .eq('user_id', user.id)
      .single();

    const now = Date.now();
    const oneHour = 3600000;

    if (rateLimitData && rateLimitData.last_reset) {
      const lastReset = new Date(rateLimitData.last_reset).getTime();
      if (now - lastReset < oneHour) {
        if (rateLimitData.request_count >= 100) {
          return new Response(
            JSON.stringify({ error: { message: 'Límite de peticiones excedido' } }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
    }

    // Actualizar o crear rate limit
    await supabaseClient.from('api_rate_limits').upsert({
      user_id: user.id,
      request_count: (rateLimitData?.request_count || 0) + 1,
      last_reset: rateLimitData && rateLimitData.last_reset && 
                  now - new Date(rateLimitData.last_reset).getTime() < oneHour 
                  ? rateLimitData.last_reset 
                  : new Date().toISOString()
    });

    // [GEMINI API] Obtener clave desde variables de entorno (NUNCA en frontend)
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('API key no configurada en el servidor');
    }

    const { model, geminiPayload, personaKey } = await req.json();

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiPayload)
      }
    );

    const data = await response.json();

    // [LOGGING] Registrar uso para auditoría
    await supabaseClient.from('api_usage_logs').insert({
      user_id: user.id,
      persona_key: personaKey,
      model: model,
      timestamp: new Date().toISOString(),
      success: !data.error
    });

    return new Response(
      JSON.stringify(data),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Gemini Proxy] Error:', error);
    return new Response(
      JSON.stringify({ error: { message: error.message || 'Error del servidor' } }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
