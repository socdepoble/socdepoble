const functions = require('@google-cloud/functions-framework');
const { VertexAI } = require('@google-cloud/vertexai');
const { google } = require('googleapis');
const webPush = require('web-push');
const { createClient } = require('@supabase/supabase-js');

// --- CLIENTS (Lazy Init or Safe Init) ---
let supabase;
let vertexAI;
let model;

function initClients() {
    if (supabase && vertexAI) return; // Already init

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const PROJECT_ID = process.env.GCP_PROJECT_ID || process.env.GCLOUD_PROJECT;
    const LOCATION = 'europe-west1';

    // Push Config
    const VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY;
    const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY;

    if (SUPABASE_URL && SUPABASE_KEY) {
        supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    } else {
        console.warn('⚠️ Supabase credentials missing. Updates will fail.');
    }

    if (PROJECT_ID) {
        vertexAI = new VertexAI({ project: PROJECT_ID, location: LOCATION });
        model = vertexAI.preview.getGenerativeModel({ model: 'gemini-1.5-pro-002' });
    } else {
        console.warn('⚠️ GCP Project ID missing. AI will fail.');
    }

    if (VAPID_PUBLIC && VAPID_PRIVATE) {
        webPush.setVapidDetails(
            'mailto:admin@socdepoble.com',
            VAPID_PUBLIC,
            VAPID_PRIVATE
        );
    } else {
        console.warn('⚠️ VAPID keys missing. Push will fail.');
    }
}

// --- HELPERS ---

// 1. Generate Content with Vertex AI
async function generateNewsletterContent(recentEvents) {
    const prompt = `
    Eres el experto en marketing de "Sóc de Poble", una app para pueblos de la Comunidad Valenciana.
    Tu tono es cercano, divertido, "de pueblo" pero profesional. A veces usas expresiones valencianas típicas (con naturalidad).
    
    Genera el cuerpo HTML (solo el contenido, sin <html> ni <body>) para un boletín semanal basado en estos eventos recientes:
    ${JSON.stringify(recentEvents)}

    Estructura:
    - Un saludo cálido.
    - Resumen de lo más destacado.
    - Una llamada a la acción para entrar en la app.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.candidates[0].content.parts[0].text;
}

// 1.b Generate Event Description
async function generateEventDescription(draft) {
    const prompt = `
    Actua com la IAIA de "Sóc de Poble", una experta en comunicació rural i dinamització de pobles.
    
    Tasques:
    1. Llegeix aquest esborrany d'esdeveniment: "${draft}"
    2. Reescriu-lo per a que siga atractiu, divertit i clar.
    3. Fes servir emojis (però sense passar-se, estil "boomer entranyable").
    4. Estructura'l amb Markdown (Negretes per a lloc/hora).
    5. Si falta informació (hora/lloc), inventa-t'ho amb gràcia (p.ex: "Al lloc de sempre", "Quan caiga el sol") o posa un placeholder clar.
    6. Afegeix hashtags rurals valencians (#PobleViu, #LaMevaGent).
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.candidates[0].content.parts[0].text;
}

// 2. Send Email via Gmail API
async function sendEmail(auth, to, subject, htmlBody) {
    const gmail = google.gmail({ version: 'v1', auth });

    // Construct raw email
    const str = [
        `To: ${to}`,
        `Subject: ${subject}`,
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=utf-8',
        '',
        htmlBody
    ].join('\n');

    const encodedMessage = Buffer.from(str).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    await gmail.users.messages.send({
        userId: 'me',
        requestBody: { raw: encodedMessage }
    });
}

// --- MAIN FUNCTION ---
functions.http('marketingBrain', async (req, res) => {
    try {
        initClients();

        // 1. Authentication (Basic check, improve for production)
        if (req.headers.authorization !== `Bearer ${process.env.API_SECRET}`) {
            return res.status(401).send('Unauthorized');
        }

        const { campaignType } = req.body;

        if (campaignType === 'event_description') {
            const { draft } = req.body;
            if (!draft) return res.status(400).send('Draft content missing');

            const aiContent = await generateEventDescription(draft);
            return res.status(200).json({ status: 'success', aiContent });
        }

        if (campaignType === 'weekly_newsletter') {
            // ... (existing newsletter logic) ...
            // A. Fetch Data
            const { data: events } = await supabase.from('events').select('*').limit(5); // Example

            // B. Generate Content
            const aiContent = await generateNewsletterContent(events);

            // C. Prepare Template (Simplified)
            // In production, load the full HTML template from a file or Storage
            const finalHtml = `
                <div style="font-family: sans-serif; color: #333;">
                    ${aiContent}
                    <hr>
                    <p style="font-size: 12px; color: #999;">Enviat automàticament per l'IA de Sóc de Poble.</p>
                </div>
            `;

            // D. Auth Google
            const auth = new google.auth.GoogleAuth({
                scopes: ['https://www.googleapis.com/auth/gmail.send']
            });
            const authClient = await auth.getClient();

            // E. Send
            await sendEmail(authClient, 'javillinares@example.com', "PREVIEW: Boletín IA 🤖", finalHtml);

            return res.status(200).json({ status: 'success', aiContent });
        }

        if (campaignType === 'test_push') {
            // 1. Get ALL active subscriptions for the user (multi-device support)
            // We fetch the most recent ones (e.g. last 10) to avoid spamming old ghost devices
            const { data: subs, error } = await supabase
                .from('push_subscriptions')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(10);

            if (error || !subs || subs.length === 0) {
                return res.status(404).json({ error: 'No subscriptions found in DB.' });
            }

            // 2. Define Payload (God Level)
            const payload = JSON.stringify({
                title: '⚡ Notificació NIVELL DÉU',
                body: 'La teua IAIA funciona al 100%. Mira quina foto més bonica.',
                icon: '/icon-192.png',
                badge: '/icon-192.png',
                image: 'https://socdepoble-web.web.app/assets/notification_bg.png', // Rich image (needs public URL)
                vibrate: [200, 100, 200, 100, 200],
                data: {
                    url: '/market',
                    type: 'god_mode'
                },
                actions: [
                    { action: 'open', title: '👀 Veure Detalls' },
                    { action: 'close', title: 'Tancar' }
                ]
            });

            // 3. Send to ALL devices (Promise.allSettled to not fail if one device is dead)
            const sendPromises = subs.map(sub => {
                const subscription = {
                    endpoint: sub.endpoint,
                    keys: {
                        p256dh: sub.p256dh,
                        auth: sub.auth
                    }
                };
                return webPush.sendNotification(subscription, payload);
            });

            const results = await Promise.allSettled(sendPromises);
            const successCount = results.filter(r => r.status === 'fulfilled').length;

            return res.status(200).json({
                status: 'success',
                sent_to: `${successCount}/${subs.length} devices`,
                debug_img: 'Notification image updated'
            });
        }

        return res.status(400).send('Unknown campaign type');

    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: e.message });
    }
});
