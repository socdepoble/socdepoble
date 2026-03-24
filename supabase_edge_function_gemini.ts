import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client, x-gemini-api-key',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const payload = await req.json();
        
        // Define Model
        const model = payload.model || "gemini-1.5-flash";

        // Validate Gemini API Key (Fallback to client-provided key if server secret is missing)
        const apiKey = Deno.env.get('GEMINI_API_KEY') || req.headers.get('x-gemini-api-key');
        if (!apiKey) {
            console.error('GEMINI_API_KEY not configured in Edge Function or Client Headers');
            return new Response(
                JSON.stringify({ error: 'System configuration error: AI provider not configured.' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
            );
        }

        // Validate Supabase User Auth (Security Check)
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return new Response(
                JSON.stringify({ error: 'Unauthorized: Missing Authorization header' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
            );
        }

        // Call Gemini API server-to-server
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": apiKey
                },
                body: JSON.stringify(payload.geminiPayload),
            }
        );

        if (!response.ok) {
            const errData = await response.json();
            console.error('Proxy to Gemini failed:', errData);
            return new Response(
                JSON.stringify({ error: 'Failed to generate content from AI provider.', details: errData }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: response.status }
            );
        }

        const data = await response.json();
        return new Response(
            JSON.stringify(data),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );

    } catch (error) {
        console.error('Unexpected Edge Function error:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return new Response(
            JSON.stringify({ error: errorMessage }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
    }
});

/* 
DEPLOYMENT INSTRUCTIONS (Sóc de Poble):

1. Go to Supabase Dashboard → Edge Functions
2. Create new function named "gemini-proxy"
3. Paste this code exactly as is.
4. Add environment variables:
   - GEMINI_API_KEY : (Your actual Google Gemini API Key)
5. Deploy
6. In the frontend, ensure your API calls invoke `supabase.functions.invoke('gemini-proxy', ...)`
*/
