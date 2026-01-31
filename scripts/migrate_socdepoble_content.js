
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { parseStringPromise } from 'xml2js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load Env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Config
const SOURCES = [
    {
        name: 'Sóc de Poble (General)',
        rss: 'https://socdepoble.net/feed/',
        default_entity: 'Sóc de Poble (Oficial)',
        category: 'Cultura'
    },
    {
        name: 'El Rentonar (Categoria)',
        rss: 'https://socdepoble.net/category/el-rentonar/feed/',
        default_entity: 'El Rentonar',
        category: 'El Rentonar'
    },
    {
        name: 'El Rentonar (Blogger Historique)',
        rss: 'https://rentonar.blogspot.com/feeds/posts/default?alt=rss',
        default_entity: 'El Rentonar',
        category: 'El Rentonar'
    }
];

// IDs (Resolving effectively) – In production code, query these.
// For this script, we need the user to have run the setup SQLs.
// We will query them dynamically using Supabase.

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Error: Missing env vars VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY/ANON_KEY');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const JAVI_USER_ID = 'd6325f44-7277-4d20-b020-166c010995ab';

async function getEntityIdByName(name) {
    const { data, error } = await supabase
        .from('entities')
        .select('id')
        .ilike('name', name)
        .single();

    if (error) {
        console.warn(`⚠️ Entity '${name}' not found or error: ${error.message}`);
        return null;
    }
    return data.id;
}

async function processFeed(source) {
    console.log(`\n📡 Fetching feed for: ${source.name} (${source.rss})...`);

    try {
        const { data } = await axios.get(source.rss);
        const result = await parseStringPromise(data);
        const items = result.rss.channel[0].item;

        console.log(`📝 Found ${items.length} items.`);

        let entityId = await getEntityIdByName(source.default_entity);
        if (!entityId && source.default_entity === 'Sóc de Poble') {
            // Fallback for Sóc de Poble if name implies it
            entityId = await getEntityIdByName('Sóc de Poble');
        }

        if (!entityId) {
            console.error(`❌ Could not resolve Entity ID for ${source.default_entity}. Skipping items.`);
            return;
        }

        console.log(`✅ Target Entity ID: ${entityId}`);

        for (const item of items) {
            const title = item.title[0];
            const link = item.link[0];
            const pubDate = new Date(item.pubDate[0]).toISOString();
            const contentEncoded = item['content:encoded'] ? item['content:encoded'][0] : item.description[0];
            const categories = item.category || [];

            // Extract Image
            let imageUrl = null;
            const $ = cheerio.load(contentEncoded);
            const imgEl = $('img').first();
            if (imgEl.length) {
                imageUrl = imgEl.attr('src');
            }

            // Deduplication Check
            // We verify if a post with this link or title already exists
            const { data: existing } = await supabase
                .from('posts')
                .select('id')
                .eq('author_id', JAVI_USER_ID)
                .ilike('content', `%${link}%`) // Simple heuristic if we store link
                .limit(1);

            if (existing && existing.length > 0) {
                console.log(`   ⏭️  Skipping existing: ${title.substring(0, 30)}...`);
                continue;
            }

            // Create Post Content
            // We append the link at the end for reference to original
            const cleanContent = $.text().substring(0, 300) + '...'; // Truncate for now or keep full?
            // For a migration, we probably want a "rich" content field.
            // But our current 'posts' table is simple text.
            // We will put the title and a snippet + link.

            const postContent = `**${title}**\n\n${cleanContent}\n\n🔗 [Llegir original](${link})`;

            const { data: postData, error: insertError } = await supabase
                .from('posts')
                .insert({
                    content: postContent,
                    author_id: JAVI_USER_ID,
                    entity_id: entityId,
                    created_at: pubDate,
                    image_url: imageUrl,
                    is_playground: false
                })
                .select('id')
                .single();

            if (insertError) {
                console.error(`   ❌ Failed to insert: ${insertError.message}`);
            } else {
                console.log(`   ✨ Imported: ${title}`);

                // Taxonomy Assignment
                if (source.category) {
                    const { data: term } = await supabase
                        .from('taxonomy_terms')
                        .select('id')
                        .eq('name', source.category)
                        .eq('type', 'category')
                        .single();

                    if (term) {
                        await supabase.from('post_taxonomy').insert({
                            post_id: postData.id,
                            term_id: term.id
                        });
                        console.log(`     🏷️  Linked to category: ${source.category}`);
                    }
                }

                // Process Tags
                for (const tagName of categories) {
                    const slug = tagName.toLowerCase()
                        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                        .replace(/\s+/g, '-')
                        .replace(/[^\w-]+/g, '');

                    const { data: tag, error: tagError } = await supabase
                        .from('taxonomy_terms')
                        .upsert({ name: tagName, slug, type: 'tag' }, { onConflict: 'slug,type' })
                        .select('id')
                        .single();

                    if (tag) {
                        await supabase.from('post_taxonomy').insert({
                            post_id: postData.id,
                            term_id: tag.id
                        }, { onConflict: 'post_id,term_id' });
                    }
                }
            }
        }

    } catch (e) {
        console.error(`❌ Error parsing feed: ${e.message}`);
    }
}

async function main() {
    console.log('🚀 Starting "Operació 30 Anys"...');

    for (const source of SOURCES) {
        await processFeed(source);
    }

    console.log('\n🏁 Migration Batch Complete.');
}

main();
