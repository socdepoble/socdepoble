import inquirer from 'inquirer';
import yaml from 'yaml';
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import { v4 as uuidv4 } from 'uuid';
import { MicrorecordSchema, calculateMemoryWeight } from './schema.js';

const ACTES_DIR = path.join(process.cwd(), 'knowledge', 'actes');

async function main() {
  console.clear();
  console.log(chalk.bold.bgYellow.black('\n 🚜 EL PORXO DEL MAS: TANCAMENT DE JORNADA \n'));
  console.log(chalk.italic.gray('Lleva\'t les botes. Només et furtaré 2 minuts (nivell 1).\n'));

  // NIVELL 1: Preguntes Obligatòries (Sense fatiga)
  const nivell1 = await inquirer.prompt([
    {
      type: 'input',
      name: 'titol',
      message: chalk.cyan('1. Títol d\'aquesta sessió (Resum d\'1 línia):'),
      validate: i => i.length > 5 || 'Massa curt. Posa un poc de context.'
    },
    {
      type: 'input',
      name: 'contingut',
      message: chalk.cyan('2. Què hem fet exactament hui? (Màx 500 caràcters):'),
      validate: i => i.length >= 20 || 'Explica-ho un poc millor (mínim 20 caràcters).'
    },
    {
      type: 'input',
      name: 'llico_apresa',
      message: chalk.cyan('3. Quina lliçó ens emportem o quin és el Trellat d\'avui?:'),
    },
    {
      type: 'number',
      name: 'intensitat',
      message: chalk.yellow('4. Del 0 al 10, quina intensitat emocional o frustració ha tingut la sessió?:'),
      validate: i => (i >= 0 && i <= 10) || 'Del 0 al 10.'
    }
  ]);

  let microrecords = [];
  const data_creacio = new Date().toISOString();
  const act_id = `ACTA-${data_creacio.split('T')[0]}-${uuidv4().substring(0, 8)}`;

  // Microrecord base (Sessió general)
  const mrBase = {
    id: `mr-${uuidv4().substring(0, 8)}`,
    sessio_origen: act_id,
    tipus: 'fact',
    titol: nivell1.titol.substring(0, 80),
    contingut: nivell1.contingut.substring(0, 500),
    contexto_narrativo: 'Generat en tancar sessió rutinària.',
    impacte: 5, // Impacte mitjà per defecte
    intensitat: nivell1.intensitat,
    llico_apresa: nivell1.llico_apresa || undefined,
    data_creacio,
    memory_weight: calculateMemoryWeight(5, nivell1.intensitat)
  };
  
  microrecords.push(MicrorecordSchema.parse(mrBase));

  // NIVELL 2: Si l'usuari està frustrat o molt emocionat
  if (nivell1.intensitat >= 7) {
    const isEuphoria = nivell1.intensitat >= 9;
    if (isEuphoria) {
      console.log(chalk.bold.bgYellow.black('\n ✨ DETECTADA ALTA EUFÒRIA / INSPIRACIÓ (NIVELL 2) \n'));
      console.log(chalk.italic.gray('Uau! Quina mina d\'or hem trobat hui? Quina Lliçó mestra gravem en or?\n'));
    } else {
      console.log(chalk.bold.bgRed.white('\n 🩸 DETECTADA ALTA INTENSITAT. OBRINT CONSULTORI (NIVELL 2) \n'));
      console.log(chalk.italic.gray('Sento que ha sigut un dia dur o revelador. Deixem-ne constància.\n'));
    }
    
    let afegirMes = true;
    while (afegirMes) {
      const respNivell2 = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'vol_afegir',
          message: isEuphoria ? 'Vols registrar una Lliçó d\'or o una Convicció profunda?' : 'Vols registrar una Cicatriu (scar) o una Creu (tombstone) específica?',
          default: true
        }
      ]);

      if (!respNivell2.vol_afegir) {
        break;
      }

      const detall = await inquirer.prompt([
        {
          type: 'list',
          name: 'tipus',
          message: 'Quin tipus de Microrecord vols guardar?',
          choices: ['scar', 'tombstone', 'whisper', 'conviction', 'discarded_idea', 'pattern']
        },
        {
          type: 'input',
          name: 'healing_note',
          message: 'Com s\'ha curat/resolt aquest dany? (healing_note):',
          when: (answers) => answers.tipus === 'scar'
        },
        {
          type: 'input',
          name: 'reason',
          message: 'Per què estem enterrant/descartant això? (reason):',
          when: (answers) => ['tombstone', 'discarded_idea'].includes(answers.tipus)
        },
        {
          type: 'input',
          name: 'titol',
          message: 'Dona-li un títol (ex: "Z-index Apocalypse"):',
        },
        {
          type: 'input',
          name: 'contingut',
          message: 'Per què ens ha fet mal o què hem descartat exactament?:',
        },
        {
          type: 'number',
          name: 'impacte',
          message: 'Quin impacte estructural té açò (0-10)?:',
          validate: i => (i >= 0 && i <= 10)
        }
      ]);

      // Aplicar el pacte de la Navalla d'Ockham: Injectar respostes estructurals dins de contexto_narrativo
      let contextEspecial = `Alta intensitat registrada (${nivell1.intensitat}/10).`;
      if (detall.healing_note) {
        contextEspecial += `\n\n[CURA/RESOLUCIÓ]: ${detall.healing_note}`;
      }
      if (detall.reason) {
        contextEspecial += `\n\n[RAÓ DEL DESCART]: ${detall.reason}`;
      }

      const mrExtra = {
        id: `mr-${uuidv4().substring(0, 8)}`,
        sessio_origen: act_id,
        tipus: detall.tipus,
        titol: detall.titol.substring(0, 80),
        contingut: detall.contingut.substring(0, 500),
        contexto_narrativo: contextEspecial,
        impacte: detall.impacte,
        intensitat: nivell1.intensitat,
        data_creacio,
        memory_weight: calculateMemoryWeight(detall.impacte, nivell1.intensitat)
      };

      microrecords.push(MicrorecordSchema.parse(mrExtra));

      const { seguir } = await inquirer.prompt([{ type: 'confirm', name: 'seguir', message: 'Alguna ferida més a curar?', default: false }]);
      afegirMes = seguir;
    }
  }

  // Guardar Acta
  await fs.mkdir(ACTES_DIR, { recursive: true });
  const actaPath = path.join(ACTES_DIR, `${act_id}.md`);
  
  const mdContent = `---
${yaml.stringify({ id: act_id, data: data_creacio, microrecords })}---

# 🚜 Acta del Mas: ${nivell1.titol}

> **Lliçó del dia:** ${nivell1.llico_apresa || 'Sense lliçó destacable.'}

Aquesta sessió ha generat **${microrecords.length}** unitats semàntiques (Microrecords).
Executeu \`npm run memoria:indexar\` per incorporar-ho al RAG Rural.
`;

  await fs.writeFile(actaPath, mdContent);
  console.log(chalk.green(`\n✅ Acta guardada amb Trellat a: ${actaPath}\n`));
}

main().catch(e => {
  console.error(chalk.red('\n❌ Error d\'introspecció: '), e);
});
