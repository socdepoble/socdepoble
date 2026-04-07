const fs = require('fs');
const path = require('path');

const dataPath = path.join(process.cwd(), 'src', 'data.js');
let content = fs.readFileSync(dataPath, 'utf-8');

const AGENTS = [
    { name: 'IAIA MarIA', id: '11111111-1a1a-0000-0000-000000000000', town: 'La Torre de les Maçanes', tags: ['#tecnologia', '#IA'] },
    { name: 'Andreu Soler', id: '11111111-1a1a-0001-0000-000000000001', town: 'Penàguila', tags: ['#agricultura', '#camp'] },
    { name: 'Beatriz Ortega', id: '11111111-1a1a-0001-0000-000000000002', town: 'La Torre de les Maçanes', tags: ['#historia', '#cultura'] },
    { name: 'Carla Soriano', id: '11111111-1a1a-0001-0000-000000000003', town: 'Relleu', tags: ['#sostenibilitat', '#joves'] },
    { name: 'Pepica la Vall', id: '11111111-1111-4111-a111-000000000009', town: 'La Torre de les Maçanes', tags: ['#gastronomia', '#tradicio'] },
    { name: 'Vicent Ferris', id: '11111111-1111-4111-a111-000000000003', town: 'La Torre de les Maçanes', tags: ['#artesania', '#fusta'] },
    { name: 'El Viatjant', id: '11111111-1111-4111-a111-000000000004', town: 'Alcoi', tags: ['#comerc', '#noticies'] },
    { name: 'Elena Popova', id: '11111111-1111-4111-a111-000000000005', town: 'Benifallim', tags: ['#art', '#internacional'] },
    { name: 'Joan Batiste', id: '11111111-1111-4111-a111-000000000008', town: 'Tibi', tags: ['#festes', '#musica'] },
    { name: 'Marc (El Gall)', id: '11111111-0000-0000-0000-000000000004', town: 'Sella', tags: ['#esports', '#muntanya'] },
    { name: 'Nano Banana', id: '11111111-1111-4111-a111-000000000007', town: 'Xixona', tags: ['#disseny', '#humor'] }
];

let agentIndex = 0;

function generateTags(text) {
    const t = text.toLowerCase();
    const tags = new Set();
    if(t.includes('brussel') || t.includes('tecnologia') || t.includes('ia')) tags.add('#innovacio');
    if(t.includes('camp') || t.includes('olivera') || t.includes('terra')) tags.add('#agricultura');
    if(t.includes('festa') || t.includes('música') || t.includes('concert')) tags.add('#festes');
    if(t.includes('història') || t.includes('passat') || t.includes('castell')) tags.add('#patrimoni');
    if(t.includes('mercat') || t.includes('venc') || t.includes('preu')) tags.add('#km0');
    if(t.includes('sostenible') || t.includes('ecològic') || t.includes('natura')) tags.add('#sostenibilitat');
    
    if (tags.size === 0) tags.add('#actualitat');
    tags.add('#poble');
    
    return Array.from(tags).slice(0, 3);
}

// Complex regex replace to ensure author_name, author_entity_id, and tags exist in each object
// We will look for objects {id: ..., ...} and inject/replace their properties.
let inMockFeed = false;
let lines = content.split('\n');
let currentAgent = null;

for (let i = 0; i < lines.length; i++) {
    // Determine context
    if (lines[i].includes('export const MOCK_FEED = [')) inMockFeed = true;
    if (lines[i].includes('export const MOCK_MARKET_ITEMS = [')) inMockFeed = true;
    if (lines[i].includes('export const MOCK_TOWNS = [')) inMockFeed = false;
    
    if (inMockFeed && lines[i].trim().startsWith('{')) {
        currentAgent = AGENTS[agentIndex % AGENTS.length];
        agentIndex++;
    }

    if (inMockFeed && currentAgent) {
        // Force replace authors unless it's Javi or specific core staff
        if (lines[i].includes('author:') && !lines[i].includes('author_') && !lines[i].includes('Javi') && !lines[i].includes('Sóc de Poble')) {
            lines[i] = lines[i].replace(/author:\s*["'][^"']+["']/, `author: "${currentAgent.name}"`);
        }
        if (lines[i].includes('author_name:') && !lines[i].includes('Javi') && !lines[i].includes('Sóc de Poble')) {
            lines[i] = lines[i].replace(/author_name:\s*["'][^"']+["']/, `author_name: "${currentAgent.name}"`);
        }
        if (lines[i].includes('author_entity_id:') && !lines[i].includes('Javi')) {
            lines[i] = lines[i].replace(/author_entity_id:\s*["'][^"']+["']/, `author_entity_id: "${currentAgent.id}"`);
        }
        if (lines[i].includes('town_name:') || lines[i].includes('town:')) {
            // Replace town
            lines[i] = lines[i].replace(/town(?:_name)?:\s*["'][^"']+["']/, `town_name: "${currentAgent.town}"`);
        }

        // Add missing author_name / entity_id if not present but we are at the end of the object
        if (lines[i].trim() === '},' || lines[i].trim() === '}') {
            let blockStr = lines.slice(Math.max(0, i - 15), i).join('\n');
            if (blockStr.includes('title:') || blockStr.includes('content:')) {
                // It's a valid item
                if (!blockStr.includes('author_name:')) {
                    lines.splice(i, 0, `    author_name: "${currentAgent.name}",`);
                    i++;
                }
                if (!blockStr.includes('author_entity_id:') && !blockStr.includes('author_id:')) {
                    lines.splice(i, 0, `    author_entity_id: "${currentAgent.id}",`);
                    i++;
                }
                if (!blockStr.includes('tags:')) {
                    let contentMatches = blockStr.match(/content:\s*["'`]?([\s\S]*?)["'`]?,/);
                    let tagsToInsert = generateTags(contentMatches ? contentMatches[1] : '');
                    lines.splice(i, 0, `    tags: ${JSON.stringify(tagsToInsert)},`);
                    i++;
                }
                if (!blockStr.includes('town_name:')) {
                    lines.splice(i, 0, `    town_name: "${currentAgent.town}",`);
                    i++;
                }
            }
            currentAgent = null; // reset for next block
        }
    }
}

fs.writeFileSync(dataPath, lines.join('\n'), 'utf-8');
console.log('Data audit complete. All posts assigned to local agents and tagged.');
