const fs = require('fs');

// 1. Clean src/data/index.js
let indexContent = fs.readFileSync('src/data/index.js', 'utf8');

const regexFeed = /export const MOCK_FEED = \[[\s\S]*?\];\nexport const MOCK_MARKET_ITEMS =/g;
indexContent = indexContent.replace(regexFeed, 'export const MOCK_FEED = [];\nexport const MOCK_MARKET_ITEMS =');

const regexMarket = /export const MOCK_MARKET_ITEMS = \[[\s\S]*?\];\nexport const MOCK_EVENTS =/g;
indexContent = indexContent.replace(regexMarket, 'export const MOCK_MARKET_ITEMS = [];\nexport const MOCK_EVENTS =');

const regexEvents = /export const MOCK_EVENTS = \[[\s\S]*?\];\nexport const MOCK_TOWNS =/g;
indexContent = indexContent.replace(regexEvents, 'export const MOCK_EVENTS = [];\nexport const MOCK_TOWNS =');

fs.writeFileSync('src/data/index.js', indexContent, 'utf8');


// 2. Clean src/data/mockLoreData.js
let loreContent = fs.readFileSync('src/data/mockLoreData.js', 'utf8');

const regexLorePosts = /export const MOCK_LORE_POSTS = \{[\s\S]*?\};\nexport const MOCK_LORE_ITEMS =/g;
loreContent = loreContent.replace(regexLorePosts, 'export const MOCK_LORE_POSTS = {};\nexport const MOCK_LORE_ITEMS =');

const regexLoreItems = /export const MOCK_LORE_ITEMS = \{[\s\S]*?\};/g;
loreContent = loreContent.replace(regexLoreItems, 'export const MOCK_LORE_ITEMS = {};');

fs.writeFileSync('src/data/mockLoreData.js', loreContent, 'utf8');


// 3. Clean src/data/mockIaiesPages.js
let iaiesContent = fs.readFileSync('src/data/mockIaiesPages.js', 'utf8');

const regexIaiesPages = /export const mockIaiesPages = [\s\S]*?\)\)\;/g;
iaiesContent = iaiesContent.replace(regexIaiesPages, 'export const mockIaiesPages = [];');

fs.writeFileSync('src/data/mockIaiesPages.js', iaiesContent, 'utf8');

console.log("Mock data completely purged.");
