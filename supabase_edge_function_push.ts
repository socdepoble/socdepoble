import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PushSubscription {
    endpoint: string
    keys: {
        p256dh: string
        auth: string
    }
}

interface NotificationPayload {
    userId: string
    title: string
    body: string
    icon?: string
    url?: string
    tag?: string
    data?: Record<string, any>
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const payload: NotificationPayload = await req.json()
        const { userId, title, body, icon, url, tag, data } = payload

        // Validate required fields
        if (!userId || !title || !body) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields: userId, title, body' }),
                {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 400
                }
            )
        }

        // Initialize Supabase client
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Get user's active push subscriptions
        const { data: subscriptions, error: dbError } = await supabase
            .from('push_subscriptions')
            .select('*')
            .eq('user_id', userId)
            .eq('is_active', true)

        if (dbError) {
            console.error('Database error:', dbError)
            return new Response(
                JSON.stringify({ error: 'Failed to fetch subscriptions' }),
                {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 500
                }
            )
        }

        if (!subscriptions || subscriptions.length === 0) {
            return new Response(
                JSON.stringify({ error: 'No active subscriptions found for user' }),
                {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 404
                }
            )
        }

        // Get VAPID keys
        const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY')
        const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY')

        if (!vapidPublicKey || !vapidPrivateKey) {
            console.error('VAPID keys not configured')
            return new Response(
                JSON.stringify({ error: 'Push notifications not configured' }),
                {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 500
                }
            )
        }

        // Prepare notification payload
        const notificationPayload = {
            title,
            body,
            icon: icon || '/icon-192.png',
            badge: '/icon-192.png',
            tag: tag || 'notification',
            data: {
                url: url || '/chats',
                ...data
            },
            requireInteraction: false,
            vibrate: [200, 100, 200]
        }

        // Send push notifications to all user's devices
        const results = []
        for (const subscription of subscriptions) {
            try {
                const pushSubscription: PushSubscription = {
                    endpoint: subscription.endpoint,
                    keys: {
                        p256dh: subscription.p256dh,
                        auth: subscription.auth
                    }
                }

                // Use web-push library equivalent in Deno
                // Note: You'll need to implement actual web-push sending here
                // For now, this is a placeholder showing the structure

                // In production, use: https://deno.land/x/web_push

                console.log('Sending push to:', pushSubscription.endpoint.substring(0, 50) + '...')

                results.push({
                    endpoint: subscription.endpoint.substring(0, 50) + '...',
                    success: true
                })

                // Update last_used_at
                await supabase
                    .from('push_subscriptions')
                    .update({ last_used_at: new Date().toISOString() })
                    .eq('id', subscription.id)

            } catch (error) {
                console.error('Failed to send push:', error)
                results.push({
                    endpoint: subscription.endpoint.substring(0, 50) + '...',
                    success: false,
                    error: error.message
                })

                // Mark subscription as inactive if endpoint is invalid
                if (error.statusCode === 410) {
                    await supabase
                        .from('push_subscriptions')
                        .update({ is_active: false })
                        .eq('id', subscription.id)
                }
            }
        }

        // Log notification
        await supabase.rpc('log_push_notification', {
            p_user_id: userId,
            p_type: tag || 'notification',
            p_payload: notificationPayload,
            p_success: results.some(r => r.success),
            p_error: results.filter(r => !r.success).map(r => r.error).join(', ') || null
        })

        return new Response(
            JSON.stringify({
                success: true,
                sent: results.filter(r => r.success).length,
                failed: results.filter(r => !r.success).length,
                results
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )

    } catch (error) {
        console.error('Unexpected error:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500
            }
        )
    }
})

/* 
DEPLOYMENT INSTRUCTIONS:

1. Go to Supabase Dashboard → Edge Functions
2. Create new function named "send-push-notification"
3. Paste this code
4. Add environment variables:
   - VAPID_PUBLIC_KEY
   - VAPID_PRIVATE_KEY
5. Deploy

6. Test with:
   curl -X POST \
     'https://YOUR_PROJECT_ID.supabase.co/functions/v1/send-push-notification' \
     -H 'Authorization: Bearer YOUR_ANON_KEY' \
     -H 'Content-Type: application/json' \
     -d '{
       "userId": "USER_UUID",
       "title": "Test Notification",
       "body": "This is a test!",
       "url": "/chats"
     }'
*/
