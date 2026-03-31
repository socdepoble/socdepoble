import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    try {
        const htmlContent = fs.readFileSync(path.resolve('public/assets/llibre-sencer.html'), 'utf8');
        
        const { data: existingPage, error: errFetch } = await supabase
            .from('cms_pages')
            .select('*')
            .eq('slug', '/el-projecte')
            .maybeSingle();

        if (existingPage) {
            await supabase.from('cms_pages').update({ 
                html_content: htmlContent, 
                title: 'SÓC DE POBLE (El Códice)' 
            }).eq('id', existingPage.id);
            console.log("Updated existing page");
        } else {
            await supabase.from('cms_pages').insert([{
                slug: '/el-projecte',
                title: 'SÓC DE POBLE (El Códice)',
                html_content: htmlContent,
                published_at: new Date().toISOString()
            }]);
            console.log("Inserted new page");
        }
    } catch (e) {
        console.error("Failed:", e);
    }
}
run();
