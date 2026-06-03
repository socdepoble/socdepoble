const fs = require('fs');
const path = require('path');

const universalPagePath = path.join(__dirname, 'src/pages/public/UniversalPage.jsx');
let content = fs.readFileSync(universalPagePath, 'utf8');
content = content.replace("import { GENOTIP_HTML } from '../../data/GenotipContent';", "import { SKILLS_HTML } from '../../data/SkillsContent';");
content = content.replace(/'genotip', 'versions'/g, "'skills', 'versions'");
content = content.replace(/_slug === 'genotip'/g, "_slug === 'skills'");
content = content.replace(/GENOTIP_HTML/g, "SKILLS_HTML");
content = content.replace(/title = "Genotip"/g, 'title = "Skills"');
content = content.replace(/subtitle = "L'ADN artificial del sistema"/g, 'subtitle = "Tot el que em fa ser qui sóc"');
fs.writeFileSync(universalPagePath, content);

const navRailPath = path.join(__dirname, 'src/components/layout/NavigationRail.jsx');
let navRailContent = fs.readFileSync(navRailPath, 'utf8');
navRailContent = navRailContent.replace('path: "/genotip", key: "nav.genotip", fallback: "Genotip"', 'path: "/skills", key: "nav.skills", fallback: "Skills"');
fs.writeFileSync(navRailPath, navRailContent);

const appLayoutPath = path.join(__dirname, 'src/components/layout/AppLayout.jsx');
let appLayoutContent = fs.readFileSync(appLayoutPath, 'utf8');
appLayoutContent = appLayoutContent.replace('location.pathname === "/genotip"', 'location.pathname === "/skills"');
appLayoutContent = appLayoutContent.replace('path="/genotip" element={<UniversalPage slug="genotip"', 'path="/skills" element={<UniversalPage slug="skills"');
fs.writeFileSync(appLayoutPath, appLayoutContent);

console.log("Replacements done.");
