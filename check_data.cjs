import fs from 'fs';

const code = fs.readFileSync('src/data.js', 'utf8');

const regexFeed = /export const MOCK_FEED = \[([\s\S]*?)\n\];/;
const regexMarket = /export const MOCK_MARKET = \[([\s\S]*?)\n\];/;
const regexEvents = /export const MOCK_EVENTS = \[([\s\S]*?)\n\];/;

const analyze = (name, regex) => {
    const match = code.match(regex);
    if (!match) return { total: 0 };
    const arrStr = `[${match[1]}]`;
    
    // We cannot just eval if there are variables inside, but we can count occurrences of keys:
    const items = match[1].split('},{').concat(match[1].split('}, {'));
    let missingSubtitle = 0;
    let missingContent = 0;
    
    items.forEach(item => {
        if (!item.includes('post_subtitle:')) missingSubtitle++;
        if (!item.includes('content:') && !item.includes('description:')) missingContent++;
    });
    
    console.log(`${name}: Total ~${items.length}, Missing Subtitle: ${missingSubtitle}, Missing Content: ${missingContent}`);
};

analyze('MOCK_FEED', regexFeed);
analyze('MOCK_MARKET', regexMarket);
analyze('MOCK_EVENTS', regexEvents);
