import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WhatsAppPayload {
    userId: string
    message: string
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { userId, message }: WhatsAppPayload = await req.json()

        if (!userId || !message) {
            return new Response(
                JSON.stringify({ error: 'Missing userId or message' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
        }

        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Fetch user phone
        const { data: profile, error: dbError } = await supabase
            .from('profiles')
            .select('phone')
            .eq('id', userId)
            .single()

        if (dbError || !profile?.phone) {
            return new Response(
                JSON.stringify({ error: 'User phone not found' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
            )
        }

        // Twilio Config
        const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
        const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
        const fromNumber = Deno.env.get('TWILIO_WHATSAPP_NUMBER') // Format: whatsapp:+123456789

        const basicAuth = btoa(`${accountSid}:${authToken}`)

        const response = await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${basicAuth}`,
                },
                body: new URLSearchParams({
                    From: fromNumber!,
                    To: `whatsapp:${profile.phone}`,
                    Body: message,
                }),
            }
        )

        const twilioData = await response.json()

        if (!response.ok) {
            throw new Error(twilioData.message || 'Twilio error')
        }

        return new Response(
            JSON.stringify({ success: true, sid: twilioData.sid }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
    }
})
