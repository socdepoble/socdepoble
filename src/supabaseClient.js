import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);

// [MASTER DEBUG] Total Tracer to catch every single Supabase call
const originalFrom = supabaseInstance.from;
supabaseInstance.from = function (table) {
    if (table === 'storage_stats' || table === 'stats' || table?.includes('stats')) {
        console.warn(`%c[SUPABASE-RADAR] Query targeting: "${table}"`, 'color: #ff0055; font-weight: bold;');
        console.trace();
    }
    return originalFrom.apply(this, arguments);
};

// [MASTER DEBUG] Global Fetch Interceptor for "Ghost" queries (Error 400/409 detection)
const originalFetch = window.fetch;
window.fetch = function (resource, config) {
    const url = typeof resource === 'string' ? resource : resource?.url;
    if (url && (url.includes('storage_stats') || url.includes('at_limit') || url.includes('profiles?id='))) {
        console.info(`%c[SACRED-RADAR] ${url}`, 'color: #00f2ff; background: #000; font-weight: bold; padding: 4px;');

        // [TRAP] Stop the universe to catch the ghost caller
        if (url.includes('storage_stats') || url.includes('at_limit')) {
            console.warn('[GHOST-TRAP] Pausing execution to catch the caller...');
            // debugger; // Uncomment this to pause in DevTools
        }
    }
    return originalFetch.apply(this, arguments);
};

export const supabase = supabaseInstance;
