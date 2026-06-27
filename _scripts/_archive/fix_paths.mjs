import fs from 'fs';

const code = fs.readFileSync('src/shared/data.js', 'utf8');

// Replace all Javi's avatars with the alias.
// What is the alias? Let's use `/assets/avatars/javi_avatar.png`
let newCode = code.replace(/\/assets\/mur\/2026-04-01_1200_POST__s_c_de_poble_el_llibre_de_la\/javi_llinares-foto_perfil-01_9d56f5\.png/g, '/assets/avatars/javi_avatar.png');
newCode = newCode.replace(/\/assets\/mercat\/2026-04-01_1200_PRODUCTE_camiseta_s_c_de_poble_edici_gr\/999-avatar_javi_llinares_c868fc\.png/g, '/assets/avatars/javi_avatar.png');

fs.writeFileSync('src/shared/data.js', newCode);
console.log('Javi avatar aliases updated.');
