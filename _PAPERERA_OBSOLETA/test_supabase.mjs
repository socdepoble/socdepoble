import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://adjlvwtxhpclgmnsvwpm.supabase.co'
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function test() {
    console.log("Invoking gemini-proxy with valid payload...")
    const payload = {
        contents: [
            {
                role: "user",
                parts: [{ text: "Hola sóc de poble" }]
            }
        ]
    };
    try {
        const { data, error } = await supabase.functions.invoke('gemini-proxy', {
            body: { model: 'gemini-1.5-flash', geminiPayload: payload },
            headers: { 'x-gemini-api-key': process.env.VITE_GEMINI_API_KEY || '' }
        });
        console.log("Data:", JSON.stringify(data, null, 2))
        console.log("Error:", error)
    } catch(err) {
        console.log("Caught Exception:", err)
    }
}
test()
