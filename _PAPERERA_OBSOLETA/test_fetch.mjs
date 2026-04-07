const url = 'https://adjlvwtxhpclgmnsvwpm.supabase.co/functions/v1/gemini-proxy';

async function test() {
    const payload = {
        contents: [{ role: "user", parts: [{ text: "Hola sóc de poble" }] }]
    };
    
    const token = process.env.VITE_SUPABASE_ANON_KEY;
    const apiKey = process.env.VITE_GEMINI_API_KEY;

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-gemini-api-key': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gemini-1.5-flash',
                geminiPayload: payload
            })
        });
        
        const text = await res.text();
        console.log("Status:", res.status);
        console.log("Body:", text);
    } catch(err) {
        console.log("Fetch Error:", err);
    }
}
test();
