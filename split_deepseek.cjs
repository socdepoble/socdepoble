const fs = require('fs');

const copilotPrompt = fs.readFileSync('prompt_ronda_3_copilot.md', 'utf8');
const supabaseFull = fs.readFileSync('src/core/services/supabaseService.js', 'utf8');

const supabaseLines = supabaseFull.split('\n');
const midPoint = Math.floor(supabaseLines.length / 2);

// Trobem un punt de tall net (per exemple, abans d'un 'export' o una funció gran si és possible, però per anar segurs tallem al mig i afegim comentaris)
const supabase1 = supabaseLines.slice(0, midPoint).join('\n');
const supabase2 = supabaseLines.slice(midPoint).join('\n');

const deepseek1 = `${copilotPrompt}\n\n[TRELLAT]: DeepSeek, com que el codi complet és massa llarg per a la teua memòria a curt termini, he dividit el servei principal en dues parts. Ací tens la UI i la PART 1 de la base de dades:\n\n### \`src/core/services/supabaseService.js\` (PART 1 de 2)\n\`\`\`javascript\n${supabase1}\n\`\`\`\n\n**[Nota per a DeepSeek]: No contestes encara, espera't al següent missatge on et passaré la PART 2.**`;

const deepseek2 = `[TRELLAT]: Ací tens la segona meitat del servei de base de dades per completar el context:\n\n### \`src/core/services/supabaseService.js\` (PART 2 de 2)\n\`\`\`javascript\n${supabase2}\n\`\`\`\n\n**Ara sí, amb tot el codi de la UI, la fortificació de seguretat i el servei sencer (part 1 i 2), dona'm el teu vistiplau definitiu!**`;

fs.writeFileSync('prompt_ronda_3_deepseek_part1.md', deepseek1);
fs.writeFileSync('prompt_ronda_3_deepseek_part2.md', deepseek2);

console.log('Prompts de DeepSeek generats amb èxit.');
