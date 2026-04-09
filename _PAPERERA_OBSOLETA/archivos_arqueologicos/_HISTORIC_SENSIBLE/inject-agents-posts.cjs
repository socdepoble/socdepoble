const fs = require('fs');
const path = require('path');

const dataPath = path.join(process.cwd(), 'src', 'data.js');

let dataContent = fs.readFileSync(dataPath, 'utf-8');

// Agent UUIDs properly mapped
const AGENT_MAP = [
    { name: 'IAIA MarIA', id: '11111111-1a1a-0000-0000-000000000000' },
    { name: 'Andreu Soler', id: '11111111-1a1a-0001-0000-000000000001' },
    { name: 'Beatriz Ortega', id: '11111111-1a1a-0001-0000-000000000002' },
    { name: 'Carla Soriano', id: '11111111-1a1a-0001-0000-000000000003' },
    { name: 'Pepica la Vall', id: '11111111-1111-4111-a111-000000000009' },
    { name: 'Vicent Ferris', id: '11111111-1111-4111-a111-000000000003' },
    { name: 'El Viatjant', id: '11111111-1111-4111-a111-000000000004' },
    { name: 'Elena Popova', id: '11111111-1111-4111-a111-000000000005' },
    { name: 'Joan Batiste', id: '11111111-1111-4111-a111-000000000008' },
    { name: 'Marc (El Gall)', id: '11111111-0000-0000-0000-000000000004' },
    { name: 'Súper Ratolí', id: '11111111-0000-0000-0000-000000000001' },
    { name: 'Mixa', id: '11111111-1a1a-0001-0000-000000000011' },
    { name: 'Flash', id: '11111111-1a1a-0001-0000-000000000010' },
    { name: 'Nano Banana', id: '11111111-1111-4111-a111-000000000007' },
    { name: 'Sultan', id: '11111111-1111-4111-a111-000000000006' }
];

// Find all occurrences of MOCK_FEED items and modify their author_entity_id
let contentMatches = [...dataContent.matchAll(/id:\s*(["'\w-]+)\s*,([^]*?)(?=id:\s*["'\w-]+\s*,|\];$)/g)];

let index = 0;
let nanoImages = [
    '/assets/brain/5077ff52-2ef9-4338-9271-8d6ba5443231/nano_banana_radio_1774218942097.png',
    '/assets/brain/5077ff52-2ef9-4338-9271-8d6ba5443231/nano_banana_trail_1774218956700.png'
];
let nanoCount = 0;

const newData = dataContent.replace(/id:\s*(["'\w-]+)\s*,([\s\S]*?)author_entity_id:\s*(["'\w-]+)\s*,([\s\S]*?)author(?:_name)?:\s*(["'][^{]+?["']),/g, 
    (match, id, part1, oldEntity, part2, oldAuthor) => {
        // Only assign to mock feed/market objects that have author_entity_id
        if (!oldEntity.includes('11111111-')) {
            // Distribute round-robin for generic ones
            const agent = AGENT_MAP[index % AGENT_MAP.length];
            index++;
            
            let replacedMatch = match.replace(oldEntity, `"${agent.id}"`);
            replacedMatch = replacedMatch.replace(oldAuthor, `"${agent.name}"`);
            return replacedMatch;
        } else {
             // For existing agent posts, assign them sequentially to all agents to fill everyone up
             const agent = AGENT_MAP[index % AGENT_MAP.length];
             index++;
             let replacedMatch = match.replace(oldEntity, `"${agent.id}"`);
             replacedMatch = replacedMatch.replace(oldAuthor, `"${agent.name}"`);

             // Inject new images for Nano Banana specifically
             if (agent.name === 'Nano Banana' && nanoCount < nanoImages.length) {
                  replacedMatch = replacedMatch.replace(/image(s|_url)?:\s*\[?["'][^"']+["']\]?,/, `image_url: ["${nanoImages[nanoCount]}"],`);
                  replacedMatch = replacedMatch.replace(/image_url:\s*["'][^"']+["']\s*,/, `image_url: "${nanoImages[nanoCount]}",`);
                  nanoCount++;
             }

             return replacedMatch;
        }
    }
);

fs.writeFileSync(dataPath, newData, 'utf-8');
console.log('Distributed posts across all agents correctly!');
