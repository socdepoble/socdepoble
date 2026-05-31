import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

import { IAIES_MUNDIALS_HTML } from './src/data/IaiesMundialsContent.js';
import { GENOTIP_HTML } from './src/data/GenotipContent.js';
import { VERSIONS_HTML } from './src/data/VersionsContent.js';

async function seed() {
    const pages = [
        {
            slug: 'iaies-mundials',
            title: 'Iaies Mundials',
            html_content: IAIES_MUNDIALS_HTML
        },
        {
            slug: 'genotip',
            title: 'Genotip',
            html_content: GENOTIP_HTML
        },
        {
            slug: 'versions',
            title: 'Versions',
            html_content: VERSIONS_HTML
        }
    ];

    for (const page of pages) {
        console.log(`Upserting ${page.slug}...`);
        const { data, error } = await supabase
            .from('cms_pages')
            .upsert({
                slug: page.slug,
                title: page.title,
                html_content: page.html_content,
                author_id: '11111111-1111-4111-a111-000000000008', // Joan Batiste (System)
                published_at: new Date().toISOString()
            }, { onConflict: 'slug' })
            .select();
        
        if (error) {
            console.error(`Error for ${page.slug}:`, error);
        } else {
            console.log(`Success for ${page.slug}`);
        }
    }
}

seed();
