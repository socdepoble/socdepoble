import { globSync } from 'glob';
const files1 = globSync('_SKILLS/**/*.{md,html,markdown}');
console.log('Skills:', files1.length);
const files2 = globSync('.agents/**/*.{md,html,markdown}');
console.log('Agents:', files2.length);
