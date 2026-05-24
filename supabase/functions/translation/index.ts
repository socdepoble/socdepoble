import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const payload = await req.json();

        // Validate Supabase User Auth (Security Check)
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return new Response(
                JSON.stringify({ error: 'Unauthorized: Missing Authorization header' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
            );
        }

        const API_SECRET = Deno.env.get('API_SECRET');
        if (!API_SECRET) {
            console.error('API_SECRET not configured in Edge Function');
            return new Response(
                JSON.stringify({ error: 'System configuration error: Missing API_SECRET.' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
            );
        }

        const actualUrl = 'https://europe-west1-socdepoble.cloudfunctions.net/marketingBrain';

        const response = await fetch(actualUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_SECRET}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errData = await response.text();
            console.error('Proxy to marketingBrain failed:', errData);
            return new Response(
                JSON.stringify({ error: 'Translation failed', details: errData }),
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
2. Create new function named "translation-proxy"
3. Paste this code exactly as is.
4. Add environment variables:
   - API_SECRET : (The secret API key for marketingBrain)
5. Deploy
6. In the frontend, the code now invokes `supabase.functions.invoke('translation-proxy', ...)`
*/
