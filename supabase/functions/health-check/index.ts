import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Monitor de Salut del Poble (Transparència)
    const health = {
      status: 'healthy',
      version: '10.35+ Immortal',
      uptime_seconds: Deno.osUptime(), 
      timestamp: new Date().toISOString(),
      message: 'Sóc de Poble batega amb força i claredat.',
      // Es podrien afegir en el futur comprovacions a la BBDD (Supabase Health)
    };

    return new Response(JSON.stringify(health), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        status: 'degraded', 
        message: 'Batec irregular. El sistema experimenta xicotetes fallades.',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
