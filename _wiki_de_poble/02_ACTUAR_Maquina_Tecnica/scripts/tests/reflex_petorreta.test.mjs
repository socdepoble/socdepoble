import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createHash, createHmac } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { editorialPart, validatePetorreta } from '../reflex_petorreta.mjs';

const execFileAsync = promisify(execFile);
const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_ROOT = path.resolve(TEST_DIR, '../../../..');
const SOURCE_SCRIPT = path.resolve(TEST_DIR, '../reflex_petorreta.mjs');
const SOURCE_FRONTMATTER = path.resolve(TEST_DIR, '../lib/frontmatter.mjs');
const SOURCE_AUTONETEJA = path.resolve(TEST_DIR, '../autoneteja_wiki.mjs');
const SOURCE_SCHEMA = path.resolve(TEST_DIR, '../schema.json');
const SOURCE_ROUTER = path.resolve(TEST_DIR, '../entropia_zero_router.js');
const SCRIPT_REL = '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/reflex_petorreta.mjs';
const FRONTMATTER_REL = '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/lib/frontmatter.mjs';
const AUTONETEJA_REL = '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/autoneteja_wiki.mjs';
const SCHEMA_REL = '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/schema.json';
const CUTOVER_REL = '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/schema-cutover.lock.json';
const ROUTER_REL = '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/entropia_zero_router.js';
const PRECOMMIT_REL = '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/pre-commit.mjs';
const FRONTMATTER_TEST_REL = '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/tests/frontmatter_autoneteja.test.mjs';
const REFLEX_TEST_REL = '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/tests/reflex_petorreta.test.mjs';
const SAFETY_TEST_REL = '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/tests/safety_dry_run.test.mjs';
const BASELINE_REL = '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/wiki-baseline.lock.json';
const GRAPH_REL = '_wiki_de_poble/.obsidian/graph.json';
const WIKI_REL = '_wiki_de_poble';
const CANARY_REL = '_wiki_de_poble/00_SER_Brain_Identitat/Canari_Restore.md';
const ESCRIPTORI_REL = '_wiki_de_poble/05_Escriptori_Soc_de_Poble';
const VALID_NAME = '260714_2345_PROMPT_Petorreta_Prova_Reflex_Sessio_Segell_Verificacio_Commit_Segur.md';
const BASE = `---\nestat: "esborrany"\ntipus: "petorreta"\ndescription: "Petorreta de prova vinculada al sistema de reflex verificable."\n---\n# Petorreta\n\n## Context\n${'Context verificable. '.repeat(50)}\n\n## Tasques\nAnalitzar i validar.\n\n## Riscos\nCap mutació sense rebut.\n\n## Criteris d'acceptació\nProves verdes i rollback disponible.\n`;
const sha256 = (value) => createHash('sha256').update(value).digest('hex');

async function run(file, args, cwd) {
  try {
    const { stdout, stderr } = await execFileAsync(file, args, {
      cwd,
      encoding: 'utf8',
      maxBuffer: 16 * 1024 * 1024,
    });
    return { code: 0, stdout, stderr };
  } catch (error) {
    return {
      code: Number.isInteger(error.code) ? error.code : 1,
      stdout: error.stdout || '',
      stderr: error.stderr || error.message || '',
    };
  }
}

async function runOk(file, args, cwd) {
  const result = await run(file, args, cwd);
  assert.equal(result.code, 0, `${file} ${args.join(' ')}\n${result.stderr}`);
  return result;
}

async function write(root, relative, content, mode) {
  const target = path.join(root, relative);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, content, 'utf8');
  if (mode) await fs.chmod(target, mode);
  return target;
}

async function setupFixture(t) {
  // macOS pot exposar /var com un enllaç a /private/var. Canonicalitzem l'arrel
  // perquè el guard `isMain` del script compare dos camins físics idèntics.
  const root = await fs.realpath(await fs.mkdtemp(path.join(os.tmpdir(), 'sdp-reflex-e2e-')));
  t.after(async () => fs.rm(root, { recursive: true, force: true }));

  await write(root, 'AGENTS.md', '# Bootstrap\nLlig totes les regles abans d’actuar.\n');
  await write(root, '.agents/AGENTS.md', '# Genotip\nCap mutació sense lease.\n');
  await write(root, '.agents/README.md', '# Context orientatiu\n');
  for (const name of ['01_context_i_principis.md', '02_workflow_execucio.md', '03_regles_arquitectura_i_dades.md', '04_criteris_producte_i_disseny.md']) {
    await write(root, `.agents/${name}`, '# Context no normatiu\n');
  }
  await write(root, '.agents/PROTOCOL_PETORRETA.md', '# Protocol\nOpen, seal, verify i consume.\n');
  await write(root, '.agents/skills/socdepoble-workflow/SKILL.md', '---\nname: workflow\n---\n# Workflow\nMínim privilegi.\n');
  await write(root, '.gitignore', '.sdp-reflex/\n.wiki-safety/\n');
  await write(root, 'package.json', '{"type":"module"}\n');
  await write(root, 'pnpm-lock.yaml', 'lockfileVersion: "9.0"\n');
  await write(root, 'pnpm-workspace.yaml', 'allowBuilds: {}\n');
  await write(root, 'work/target.txt', 'versió inicial\n');
  await write(root, 'outside.txt', 'fitxer fora del scope de treball\n');
  for (const hook of ['pre-commit', 'post-commit', 'pre-merge-commit', 'pre-applypatch', 'post-applypatch']) {
    await write(root, `.githooks/${hook}`, await fs.readFile(path.join(SOURCE_ROOT, '.githooks', hook), 'utf8'), 0o755);
  }
  await write(root, PRECOMMIT_REL, [
    '#!/usr/bin/env node',
    "const wiki = process.argv.find((arg) => arg.startsWith('--wiki='))?.slice(7);",
    "if (!wiki || !wiki.includes('sdp-precommit.')) {",
    "  console.error('El hook no ha passat una Wiki materialitzada en temporal.');",
    '  process.exit(91);',
    '}',
    '',
  ].join('\n'), 0o755);
  await write(root, '.github/workflows/wiki-integrity.yml', [
    'name: Integritat canària',
    'on: [push, pull_request]',
    'jobs:',
    '  test:',
    '    runs-on: ubuntu-latest',
    '    steps:',
    '      - run: pnpm run wiki:test',
    '      - run: pnpm run wiki:audit:strict',
    '',
  ].join('\n'));
  await fs.mkdir(path.join(root, ESCRIPTORI_REL), { recursive: true });
  await write(root, SCRIPT_REL, await fs.readFile(SOURCE_SCRIPT, 'utf8'), 0o755);
  await write(root, '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/package.json', '{"type":"module"}\n');
  await write(root, FRONTMATTER_REL, await fs.readFile(SOURCE_FRONTMATTER, 'utf8'));
  await write(root, ROUTER_REL, await fs.readFile(SOURCE_ROUTER, 'utf8'));
  await write(root, SCHEMA_REL, await fs.readFile(SOURCE_SCHEMA, 'utf8'));
  await write(root, '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/rules/trellat-rules.json', '{}\n');
  await write(root, AUTONETEJA_REL, '#!/usr/bin/env node\n// canari doctor\n', 0o755);
  for (const relative of [
    '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/cura_robotomia.mjs',
    '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/contradiction_engine.mjs',
    '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/compiler/build.cjs',
    '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/compiler/01_build_index.cjs',
    '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/compiler/02_build_ontology.cjs',
    '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/core/translate.mjs',
    '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/sdp.mjs',
    '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/core/audit.mjs',
    '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/core/lint.mjs',
    '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/core/snapshot_engine.mjs',
    '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/core/tombstone_gc.mjs',
    '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/core/self_repair.mjs',
    '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/core/edge_rag.mjs',
    '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/core/a11y_seo.mjs',
    '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/core/design_guard.mjs',
    '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/core/runner.mjs',
    'scripts/generate-supabase-seed.mjs',
    'scripts/enllacat-intelligent-wiki.mjs',
  ]) await write(root, relative, '// canari crític\n');
  await write(root, 'scripts/generate-supabase-seed.sh', '#!/bin/sh\nexit 0\n', 0o755);
  await write(root, CUTOVER_REL, '{"schema":"socdepoble.schema-cutover.v1","ready":true}\n');
  await write(root, FRONTMATTER_TEST_REL, '// canari test frontmatter\n');
  await write(root, REFLEX_TEST_REL, '// canari test reflex\n');
  await write(root, SAFETY_TEST_REL, "import './doctor_dependency.mjs';\n");
  await write(root, '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/tests/doctor_dependency.mjs', '// dependència transitiva canària\n');
  await write(root, CANARY_REL, '---\nestat: "canonic"\ntipus: "document"\ndescription: "Document canari de baseline per a les proves del Reflex."\n---\n# Canari\n\n[[Canari_Restore]]\n');
  await write(root, GRAPH_REL, `${JSON.stringify({
    search: '-path:"04_ARXIU_Documents_Historics" -path:"05_Escriptori_Soc_de_Poble" -path:"00_SER_Brain_Identitat/00_AGENTS_I_SKILLS_MIRROR" -path:"00_SER_Brain_Identitat/Sollutia" -path:"03_GOVERNAR_Normativa_Regles/agents_actius"',
    showAttachments: false,
    hideUnresolved: true,
    showOrphans: false,
    colorGroups: ['00_SER_Brain_Identitat', '01_SABER_Cultura_Coneixement', '02_ACTUAR_Maquina_Tecnica', '03_GOVERNAR_Normativa_Regles']
      .map((pillar) => ({ query: `path:"${pillar}"`, color: { a: 1, rgb: 1 } })),
  }, null, 2)}\n`);
  await write(root, BASELINE_REL, '{}\n');

  await fs.mkdir(path.join(root, '.sdp-reflex', 'sessions'), { recursive: true, mode: 0o700 });
  await fs.mkdir(path.join(root, '.sdp-reflex', 'bootstrap'), { recursive: true, mode: 0o700 });
  await fs.chmod(path.join(root, '.sdp-reflex'), 0o700);
  await fs.chmod(path.join(root, '.sdp-reflex', 'sessions'), 0o700);
  await fs.chmod(path.join(root, '.sdp-reflex', 'bootstrap'), 0o700);
  await write(root, '.sdp-reflex/secret.key', `${'ab'.repeat(32)}\n`, 0o600);

  const baseline = await runOk('node', [path.join(root, SCRIPT_REL), 'baseline', '--json'], root);
  await write(root, BASELINE_REL, `${JSON.stringify(JSON.parse(baseline.stdout), null, 2)}\n`);

  await runOk('git', ['init', '-q'], root);
  await runOk('git', ['config', 'user.name', 'Reflex Tests'], root);
  await runOk('git', ['config', 'user.email', 'reflex@example.invalid'], root);
  await runOk('git', ['add', '.'], root);
  await runOk('git', ['-c', 'core.hooksPath=/dev/null', 'commit', '-q', '-m', 'baseline'], root);

  return {
    root,
    script: path.join(root, SCRIPT_REL),
    target: path.join(root, 'work/target.txt'),
    escriptori: path.join(root, ESCRIPTORI_REL),
  };
}

async function setupAutonetejaFixture(t) {
  const fixture = await setupFixture(t);
  const schemaText = await fs.readFile(SOURCE_SCHEMA, 'utf8');
  await write(fixture.root, AUTONETEJA_REL, await fs.readFile(SOURCE_AUTONETEJA, 'utf8'), 0o755);
  await write(fixture.root, SCHEMA_REL, schemaText);
  await write(fixture.root, CUTOVER_REL, `${JSON.stringify({
    schema: 'socdepoble.schema-cutover.v1',
    ready: true,
    schemaSha256: sha256(schemaText),
    adapted: ['canari-e2e-temporal'],
    blockers: [],
    acceptance: ['El canari apply/restore s’executa només dins de tmp.'],
  }, null, 2)}\n`);
  const initial = Buffer.from([
    '---',
    'estat: canonic',
    'categoria: doc',
    'description: "Document canari per provar migració i restauració byte a byte."',
    '---',
    '# Canari reversible',
    '',
    'Cos estable que ha de sobreviure exactament al cicle complet.',
    '',
  ].join('\n'));
  const note = path.join(fixture.root, CANARY_REL);
  await fs.mkdir(path.dirname(note), { recursive: true });
  await fs.writeFile(note, initial);
  await runOk('git', ['add', '.'], fixture.root);
  await runOk('git', ['-c', 'core.hooksPath=/dev/null', 'commit', '-q', '-m', 'fixture autoneteja'], fixture.root);
  return {
    ...fixture,
    autoneteja: path.join(fixture.root, AUTONETEJA_REL),
    note,
    initial,
    safety: path.join(fixture.root, '.wiki-safety'),
  };
}

async function reflex(fixture, args) {
  return run(process.execPath, [fixture.script, ...args], fixture.root);
}

async function fixtureModule(fixture, source) {
  return run(process.execPath, ['--input-type=module', '--eval', source], fixture.root);
}

async function autoneteja(fixture, args) {
  return run(process.execPath, [fixture.autoneteja, ...args], fixture.root);
}

async function openSession(fixture, { operation = 'git-commit', scopes = ['work'] } = {}) {
  const result = await reflex(fixture, [
    'open',
    '--json',
    '--intent=provar el reflex complet sense tocar el projecte real',
    '--risk=high',
    ...scopes.map((scope) => `--scope=${scope}`),
    `--operation=${operation}`,
  ]);
  assert.equal(result.code, 0, result.stderr);
  return JSON.parse(result.stdout);
}

async function createBootstrap(fixture, opened, { planSha256 = null, sources = null } = {}) {
  const directory = path.join(fixture.root, opened.session.bootstrap.path);
  const petorreta = path.join(directory, VALID_NAME);
  const manifest = path.join(directory, 'context-reflex-test.json');
  const planMarker = planSha256 ? `Plan-SHA256: ${planSha256}\n` : '';
  const content = `${BASE}\nReflex-Session: ${opened.session.sessionId}\nIntent-SHA256: ${opened.session.intentSha256}\nRules-SHA256: ${opened.session.rulesDigest}\n${planMarker}`;
  await fs.writeFile(petorreta, content, 'utf8');
  await fs.writeFile(manifest, `${JSON.stringify({
    sources: sources || [{
      path: 'AGENTS.md',
      reason: 'Regla arrel usada com a referència immutable.',
      classification: 'internal',
      role: 'reference',
    }],
  }, null, 2)}\n`, 'utf8');
  return {
    directory,
    petorreta,
    manifest,
    receipt: path.join(fixture.root, '.sdp-reflex', 'sessions', `${opened.session.sessionId}.json`),
  };
}

async function sealSession(fixture, opened, bootstrap) {
  const result = await reflex(fixture, [
    'seal',
    '--json',
    `--session=${opened.session.sessionId}`,
    `--nonce=${opened.nonce}`,
    `--petorreta=${bootstrap.petorreta}`,
    `--manifest=${bootstrap.manifest}`,
  ]);
  assert.equal(result.code, 0, result.stderr);
  return JSON.parse(result.stdout);
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return value;
}

function signReceipt(receipt, secret) {
  const { signature, ...unsigned } = receipt;
  return createHmac('sha256', secret)
    .update(JSON.stringify(stable(unsigned)))
    .digest('hex');
}

test('els placeholders dins de l’annex de codi no invaliden el cos editorial', () => {
  const content = `${BASE}\n## Annex de codi\n\n\`\`\`js\nconst x = \`\${legitim}\`;\n\`\`\`\n`;
  assert.deepEqual(validatePetorreta(VALID_NAME, content), []);
  assert.doesNotMatch(editorialPart(content), /legitim/);
});

test('frontmatter absent, placeholder editorial i nom no canònic fallen', () => {
  const withoutFrontmatter = BASE.replace(/^---\n[\s\S]*?\n---\n/, '');
  assert.match(validatePetorreta(VALID_NAME, withoutFrontmatter).join(' '), /frontmatter absent/);

  const errors = validatePetorreta('260714_2300_PETORRETA_Curta.md', `${BASE}\n\${pendent}\n`);
  assert.match(errors.join(' '), /nom invàlid/);
  assert.match(errors.join(' '), /placeholder editorial/);

  const withoutState = BASE.replace('estat: "esborrany"\n', '');
  assert.match(validatePetorreta(VALID_NAME, withoutState).join(' '), /estat|propietat obligatòria/i);

  const withLegacyTags = BASE.replace('tipus: "petorreta"\n', 'tipus: "petorreta"\ntags: "legacy"\n');
  assert.match(validatePetorreta(VALID_NAME, withLegacyTags).join(' '), /Propietat no admesa pel v2: tags/);
});

test('doctor JSON falla sense hooksPath i passa quan la configuració és completa', async (t) => {
  const fixture = await setupFixture(t);
  // Un core.hooksPath global de la màquina amfitriona no ha de contaminar el test.
  await runOk('git', ['config', 'core.hooksPath', '.hooks-inexistents'], fixture.root);
  const incomplete = await reflex(fixture, ['doctor', '--json']);
  assert.equal(incomplete.code, 1);
  assert.equal(JSON.parse(incomplete.stdout).ok, false);
  assert.match(incomplete.stdout, /core\.hooksPath/);

  await runOk('git', ['config', 'core.hooksPath', '.githooks'], fixture.root);
  const complete = await reflex(fixture, ['doctor', '--json']);
  assert.equal(complete.code, 0, complete.stderr);
  assert.deepEqual(JSON.parse(complete.stdout), { ok: true, findings: [] });
});

test('doctor detecta hooks symlink, clau permissiva i CI no versionada', async (t) => {
  const fixture = await setupFixture(t);
  await runOk('git', ['config', 'core.hooksPath', '.githooks'], fixture.root);
  await fs.rm(path.join(fixture.root, '.githooks', 'pre-merge-commit'));
  await fs.symlink('pre-commit', path.join(fixture.root, '.githooks', 'pre-merge-commit'));
  await fs.chmod(path.join(fixture.root, '.sdp-reflex', 'secret.key'), 0o644);
  await runOk('git', ['rm', '--cached', '-q', '.github/workflows/wiki-integrity.yml'], fixture.root);

  const diagnosed = await reflex(fixture, ['doctor', '--json']);
  assert.equal(diagnosed.code, 1);
  assert.match(diagnosed.stdout, /symlink\/hardlink/);
  assert.match(diagnosed.stdout, /0600/);
  assert.match(diagnosed.stdout, /wiki-integrity\.yml/);
});

test('doctor --ci és portable, init activa el clon i la clausura detecta imports transitius', async (t) => {
  const fixture = await setupFixture(t);
  const ci = await reflex(fixture, ['doctor', '--ci', '--json']);
  assert.equal(ci.code, 0, ci.stderr);

  const initialized = await reflex(fixture, ['init', '--json']);
  assert.equal(initialized.code, 0, initialized.stderr);
  assert.equal((await runOk('git', ['config', '--get', 'core.hooksPath'], fixture.root)).stdout.trim(), '.githooks');
  assert.equal((await reflex(fixture, ['doctor', '--json'])).code, 0);

  const dependency = '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/tests/doctor_dependency.mjs';
  await runOk('git', ['rm', '--cached', '-q', dependency], fixture.root);
  const missing = await reflex(fixture, ['doctor', '--ci', '--json']);
  assert.equal(missing.code, 1);
  assert.match(missing.stdout, /doctor_dependency\.mjs/);
});

test('doctor rebutja corpus buit i regressions del contracte de graph.json', async (t) => {
  const fixture = await setupFixture(t);
  const graph = JSON.parse(await fs.readFile(path.join(fixture.root, GRAPH_REL), 'utf8'));
  graph.showOrphans = true;
  await fs.writeFile(path.join(fixture.root, GRAPH_REL), `${JSON.stringify(graph, null, 2)}\n`);
  await fs.rm(path.join(fixture.root, CANARY_REL));
  const diagnosed = await reflex(fixture, ['doctor', '--ci', '--json']);
  assert.equal(diagnosed.code, 1);
  assert.match(diagnosed.stdout, /showOrphans|corpus Markdown buit|baseline divergent/i);
});

test('open reserva i anuncia un bootstrap físic, nou i buit', async (t) => {
  const fixture = await setupFixture(t);
  const opened = await reflex(fixture, [
    'open', '--intent=provar el directori bootstrap anunciat', '--risk=high',
    '--scope=work', '--operation=git-commit',
  ]);
  assert.equal(opened.code, 0, opened.stderr);
  const match = /^BOOTSTRAP ESPERAT: (.+)$/m.exec(opened.stdout);
  assert.ok(match, opened.stdout);
  const directory = match[1];
  assert.equal(path.relative(fixture.root, directory).startsWith('.sdp-reflex/bootstrap/'), true);
  const stat = await fs.lstat(directory);
  assert.equal(stat.isDirectory(), true);
  assert.equal(stat.isSymbolicLink(), false);
  assert.deepEqual(await fs.readdir(directory), []);
});

test('el snapshot signa explícitament les exclusions derivades', async (t) => {
  const fixture = await setupFixture(t);
  const opened = await openSession(fixture, { scopes: ['.'] });
  assert.ok(opened.session.scopeSnapshot.excluded.includes('.git'));
  assert.ok(opened.session.scopeSnapshot.excluded.includes('.sdp-reflex'));
  const bootstrap = await createBootstrap(fixture, opened);
  const sealed = await sealSession(fixture, opened, bootstrap);
  assert.deepEqual(sealed.scopeSnapshotAtSeal.excluded, opened.session.scopeSnapshot.excluded);
});

test('el manifest rebutja una MEGA-Petorreta de més de 25 fonts', async (t) => {
  const fixture = await setupFixture(t);
  const sources = [];
  for (let index = 0; index < 26; index++) {
    const relative = `context/font-${String(index).padStart(2, '0')}.md`;
    await write(fixture.root, relative, `# Font ${index}\nContext mínim.\n`);
    sources.push({
      path: relative,
      reason: `Font adversarial ${index}.`,
      classification: 'internal',
      role: 'reference',
    });
  }
  const opened = await openSession(fixture);
  const bootstrap = await createBootstrap(fixture, opened, { sources });
  const sealed = await reflex(fixture, [
    'seal', `--session=${opened.session.sessionId}`, `--nonce=${opened.nonce}`,
    `--petorreta=${bootstrap.petorreta}`, `--manifest=${bootstrap.manifest}`,
  ]);
  assert.equal(sealed.code, 1);
  assert.match(sealed.stderr, /màxim selectiu és 25/);
});

test('seal limita els bytes de la Petorreta i tanca propietats extra del manifest', async (t) => {
  const oversizedFixture = await setupFixture(t);
  const oversizedOpen = await openSession(oversizedFixture);
  const oversizedBootstrap = await createBootstrap(oversizedFixture, oversizedOpen);
  await fs.appendFile(oversizedBootstrap.petorreta, `\n${'A'.repeat(129 * 1024)}\n`);
  const oversized = await reflex(oversizedFixture, [
    'seal', '--json', `--session=${oversizedOpen.session.sessionId}`, `--nonce=${oversizedOpen.nonce}`,
    `--petorreta=${oversizedBootstrap.petorreta}`, `--manifest=${oversizedBootstrap.manifest}`,
  ]);
  assert.equal(oversized.code, 1);
  assert.match(oversized.stderr, /Petorreta supera/);

  const extraFixture = await setupFixture(t);
  const extraOpen = await openSession(extraFixture);
  const extraBootstrap = await createBootstrap(extraFixture, extraOpen);
  const manifest = JSON.parse(await fs.readFile(extraBootstrap.manifest, 'utf8'));
  manifest.annex = 'camp no declarat';
  await fs.writeFile(extraBootstrap.manifest, `${JSON.stringify(manifest)}\n`);
  const extra = await reflex(extraFixture, [
    'seal', '--json', `--session=${extraOpen.session.sessionId}`, `--nonce=${extraOpen.nonce}`,
    `--petorreta=${extraBootstrap.petorreta}`, `--manifest=${extraBootstrap.manifest}`,
  ]);
  assert.equal(extra.code, 1);
  assert.match(extra.stderr, /només admet la propietat `sources`/);
});

test('el manifest bloqueja PII bàsica abans de segellar', async (t) => {
  const fixture = await setupFixture(t);
  await write(fixture.root, 'context/contacte.md', 'Contacte privat: persona@example.org\n');
  const opened = await openSession(fixture);
  const bootstrap = await createBootstrap(fixture, opened, {
    sources: [{
      path: 'context/contacte.md',
      reason: 'Canari de redacció de PII.',
      classification: 'restricted',
      role: 'reference',
    }],
  });
  const sealed = await reflex(fixture, [
    'seal', `--session=${opened.session.sessionId}`, `--nonce=${opened.nonce}`,
    `--petorreta=${bootstrap.petorreta}`, `--manifest=${bootstrap.manifest}`,
  ]);
  assert.equal(sealed.code, 1);
  assert.match(sealed.stderr, /correu electrònic/);
});

test('open i seal rebutgen qualsevol canvi de scope fora del bootstrap', async (t) => {
  const fixture = await setupFixture(t);
  const opened = await openSession(fixture);
  await fs.writeFile(fixture.target, 'mutació abans de seal\n', 'utf8');
  const bootstrap = await createBootstrap(fixture, opened);

  const sealed = await reflex(fixture, [
    'seal',
    '--json',
    `--session=${opened.session.sessionId}`,
    `--nonce=${opened.nonce}`,
    `--petorreta=${bootstrap.petorreta}`,
    `--manifest=${bootstrap.manifest}`,
  ]);
  assert.equal(sealed.code, 1);
  assert.match(sealed.stderr, /scopes han canviat entre open i seal/);
});

test('seal només admet els dos fitxers regulars del bootstrap reservat', async (t) => {
  const fixture = await setupFixture(t);
  const opened = await openSession(fixture);
  const bootstrap = await createBootstrap(fixture, opened);

  const legacyPetorreta = path.join(fixture.escriptori, VALID_NAME);
  await fs.copyFile(bootstrap.petorreta, legacyPetorreta);
  const outside = await reflex(fixture, [
    'seal', `--session=${opened.session.sessionId}`, `--nonce=${opened.nonce}`,
    `--petorreta=${legacyPetorreta}`, `--manifest=${bootstrap.manifest}`,
  ]);
  assert.equal(outside.code, 1);
  assert.match(outside.stderr, /fills directes/);

  const extra = path.join(bootstrap.directory, 'extra.txt');
  await fs.writeFile(extra, 'entrada no autoritzada\n', 'utf8');
  const withExtra = await reflex(fixture, [
    'seal', `--session=${opened.session.sessionId}`, `--nonce=${opened.nonce}`,
    `--petorreta=${bootstrap.petorreta}`, `--manifest=${bootstrap.manifest}`,
  ]);
  assert.equal(withExtra.code, 1);
  assert.match(withExtra.stderr, /exactament la Petorreta i el manifest/);
  await fs.rm(extra);

  const petorretaContent = await fs.readFile(bootstrap.petorreta, 'utf8');
  await fs.rm(bootstrap.petorreta);
  await fs.symlink(fixture.target, bootstrap.petorreta);
  const withSymlink = await reflex(fixture, [
    'seal', `--session=${opened.session.sessionId}`, `--nonce=${opened.nonce}`,
    `--petorreta=${bootstrap.petorreta}`, `--manifest=${bootstrap.manifest}`,
  ]);
  assert.equal(withSymlink.code, 1);
  assert.match(withSymlink.stderr, /fitxers regulars|symlinks/i);
  await fs.rm(bootstrap.petorreta);
  await fs.writeFile(bootstrap.petorreta, petorretaContent, 'utf8');
  await sealSession(fixture, opened, bootstrap);
});

test('seal detecta si el directori bootstrap reservat ha sigut substituït', async (t) => {
  const fixture = await setupFixture(t);
  const opened = await openSession(fixture);
  const directory = path.join(fixture.root, opened.session.bootstrap.path);
  await fs.rm(directory, { recursive: true });
  await fs.mkdir(directory, { mode: 0o700 });
  const bootstrap = await createBootstrap(fixture, opened);
  const sealed = await reflex(fixture, [
    'seal', `--session=${opened.session.sessionId}`, `--nonce=${opened.nonce}`,
    `--petorreta=${bootstrap.petorreta}`, `--manifest=${bootstrap.manifest}`,
  ]);
  assert.equal(sealed.code, 1);
  assert.match(sealed.stderr, /bootstrap reservat ha sigut substituït/);
});

test('Plan-SHA256 dins del bootstrap no altera el snapshot dels scopes', async (t) => {
  const fixture = await setupFixture(t);
  const planSha256 = 'a'.repeat(64);
  const opened = await openSession(fixture, { operation: 'autoneteja-frontmatter' });
  const bootstrap = await createBootstrap(fixture, opened, {
    planSha256,
    sources: [{
      path: 'work/target.txt',
      reason: 'Target explícit de la prova d’autoneteja.',
      classification: 'internal',
      role: 'target',
    }],
  });
  const sealed = await sealSession(fixture, opened, bootstrap);
  assert.equal(sealed.planSha256, planSha256);
  assert.equal(sealed.scopeSnapshotAtSeal.digest, opened.session.scopeSnapshot.digest);
  assert.deepEqual(sealed.scopes, ['work']);
  assert.equal(sealed.petorreta.path.startsWith('.sdp-reflex/bootstrap/'), true);
});

test('el bootstrap no pot ser target ni tan sols amb scope arrel', async (t) => {
  const fixture = await setupFixture(t);
  const opened = await openSession(fixture, { scopes: ['.'] });
  const bootstrap = await createBootstrap(fixture, opened, {
    sources: [{
      path: `${opened.session.bootstrap.path}/${VALID_NAME}`,
      reason: 'Intent adversarial de convertir estat intern en target.',
      classification: 'internal',
      role: 'target',
    }],
  });
  const sealed = await reflex(fixture, [
    'seal', `--session=${opened.session.sessionId}`, `--nonce=${opened.nonce}`,
    `--petorreta=${bootstrap.petorreta}`, `--manifest=${bootstrap.manifest}`,
  ]);
  assert.equal(sealed.code, 1);
  assert.match(sealed.stderr, /Target de context fora de scope/);
});

test('canari E2E: audit, Reflex, apply, consume, segon Reflex i restore byte a byte', async (t) => {
  const fixture = await setupAutonetejaFixture(t);
  assert.equal(await fs.stat(fixture.safety).catch((error) => error.code === 'ENOENT' ? null : Promise.reject(error)), null);

  const audited = await autoneteja(fixture, ['--json']);
  assert.equal(audited.code, 0, audited.stderr);
  const audit = JSON.parse(audited.stdout);
  assert.equal(audit.frontmatter.plannedRewrites, 1);
  assert.equal(audit.plan.frontmatterActions.length, 1);
  assert.equal(audit.plan.frontmatterActions[0].file, path.relative(path.join(fixture.root, WIKI_REL), fixture.note));
  assert.deepEqual(audit.plan.frontmatterActions[0].removedFields, ['categoria']);
  assert.deepEqual(await fs.readFile(fixture.note), fixture.initial);

  const firstOpen = await openSession(fixture, {
    operation: 'autoneteja-frontmatter',
    scopes: [WIKI_REL],
  });
  const firstBootstrap = await createBootstrap(fixture, firstOpen, {
    planSha256: audit.plan.planDigest,
    sources: [{
      path: CANARY_REL,
      reason: 'Únic target del canari de reescriptura v2.',
      classification: 'internal',
      role: 'target',
    }],
  });
  await sealSession(fixture, firstOpen, firstBootstrap);

  const appliedResult = await autoneteja(fixture, [
    '--json', '--apply-frontmatter', '--ack-schema-cutover', '--ack-legacy-loss',
    `--receipt=${firstBootstrap.receipt}`,
  ]);
  assert.equal(appliedResult.code, 0, appliedResult.stderr);
  const applied = JSON.parse(appliedResult.stdout);
  assert.equal(applied.mutation.applied, true);
  assert.equal(applied.mutation.actions, 1);
  assert.equal(applied.plan.planDigest, audit.plan.planDigest);
  assert.notDeepEqual(await fs.readFile(fixture.note), fixture.initial);
  const manifestPath = await fs.realpath(applied.mutation.manifestPath);
  assert.equal(path.dirname(path.dirname(manifestPath)), await fs.realpath(fixture.safety));

  const consumedApply = await reflex(fixture, ['consume', '--json', `--receipt=${firstBootstrap.receipt}`]);
  assert.equal(consumedApply.code, 0, consumedApply.stderr);
  assert.equal(JSON.parse(consumedApply.stdout).status, 'consumed');

  const manifestDigest = sha256(await fs.readFile(manifestPath));
  const secondOpen = await openSession(fixture, {
    operation: 'autoneteja-restore',
    scopes: [WIKI_REL],
  });
  const secondBootstrap = await createBootstrap(fixture, secondOpen, {
    planSha256: manifestDigest,
    sources: [
      {
        path: path.relative(fixture.root, manifestPath),
        reason: 'Manifest reversible exacte que autoritza el restore.',
        classification: 'internal',
        role: 'reference',
      },
      {
        path: CANARY_REL,
        reason: 'Target únic que ha de recuperar els bytes originals.',
        classification: 'internal',
        role: 'target',
      },
    ],
  });
  await sealSession(fixture, secondOpen, secondBootstrap);

  const restoredResult = await autoneteja(fixture, [
    '--json', `--restore=${manifestPath}`, `--receipt=${secondBootstrap.receipt}`,
  ]);
  assert.equal(restoredResult.code, 0, restoredResult.stderr);
  assert.equal(JSON.parse(restoredResult.stdout).restored, true);
  assert.deepEqual(await fs.readFile(fixture.note), fixture.initial);
  const restoredManifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  assert.equal(restoredManifest.status, 'restored');

  const consumedRestore = await reflex(fixture, ['consume', '--json', `--receipt=${secondBootstrap.receipt}`]);
  assert.equal(consumedRestore.code, 0, consumedRestore.stderr);
  assert.equal(JSON.parse(consumedRestore.stdout).status, 'consumed');
});

test('flux complet: verify, scope, snapshot, staged tree, replay i consume', async (t) => {
  const fixture = await setupFixture(t);
  const opened = await openSession(fixture);
  const bootstrap = await createBootstrap(fixture, opened);
  const sealed = await sealSession(fixture, opened, bootstrap);
  assert.equal(sealed.status, 'sealed');
  assert.equal(sealed.petorreta.path.endsWith(VALID_NAME), true);

  const implicitOperation = await reflex(fixture, [
    'verify', `--receipt=${bootstrap.receipt}`, '--scope=work',
  ]);
  assert.equal(implicitOperation.code, 1);
  assert.match(implicitOperation.stderr, /exactament un --operation/);

  const valid = await reflex(fixture, [
    'verify', '--json', `--receipt=${bootstrap.receipt}`, '--operation=git-commit', '--scope=work',
  ]);
  assert.equal(valid.code, 0, valid.stderr);

  const outOfScope = await reflex(fixture, [
    'verify', `--receipt=${bootstrap.receipt}`, '--operation=git-commit', '--scope=fora-del-scope',
  ]);
  assert.equal(outOfScope.code, 1);
  assert.match(outOfScope.stderr, /Target fora de scope/);

  await fs.writeFile(fixture.target, 'canvi encara no autoritzat\n', 'utf8');
  const changedSnapshot = await reflex(fixture, [
    'verify', `--receipt=${bootstrap.receipt}`, '--operation=git-commit', '--scope=work',
  ]);
  assert.equal(changedSnapshot.code, 1);
  assert.match(changedSnapshot.stderr, /worktree ha canviat|contingut dels scopes ha canviat/i);

  await fs.writeFile(fixture.target, 'versió final autoritzada\n', 'utf8');
  await runOk('git', ['add', 'work/target.txt'], fixture.root);
  const staged = await reflex(fixture, [
    'verify', '--json', '--staged', `--receipt=${bootstrap.receipt}`, '--operation=git-commit',
  ]);
  assert.equal(staged.code, 0, staged.stderr);
  const pending = JSON.parse(await fs.readFile(bootstrap.receipt, 'utf8'));
  assert.match(pending.pendingCommit.tree, /^[a-f0-9]{40,64}$/);
  assert.equal(pending.pendingCommit.stagedPaths.includes('work/target.txt'), true);
  assert.equal(pending.pendingCommit.stagedChanges[0].mode, '100644');
  assert.equal(pending.pendingCommit.headBeforeCommit, opened.session.gitBefore.head);

  const exactPending = await reflex(fixture, ['pending-tree', '--json', `--receipt=${bootstrap.receipt}`]);
  assert.equal(exactPending.code, 0, exactPending.stderr);
  assert.equal(JSON.parse(exactPending.stdout).tree, pending.pendingCommit.tree);

  const copiedReceipt = path.join(fixture.root, '.sdp-reflex', 'receipt-copiat.json');
  await fs.copyFile(bootstrap.receipt, copiedReceipt);
  const copiedReplay = await reflex(fixture, [
    'verify', '--staged', `--receipt=${copiedReceipt}`, '--operation=git-commit',
  ]);
  assert.equal(copiedReplay.code, 1);
  assert.match(copiedReplay.stderr, /rebut canònic/i);

  const prematureGenericConsume = await reflex(fixture, ['consume', `--receipt=${bootstrap.receipt}`]);
  assert.equal(prematureGenericConsume.code, 1);
  assert.match(prematureGenericConsume.stderr, /consume-commit/);

  await runOk('git', ['-c', 'core.hooksPath=/dev/null', 'commit', '-q', '-m', 'canvi verificat'], fixture.root);
  const consumed = await reflex(fixture, ['consume-commit', '--json', `--receipt=${bootstrap.receipt}`]);
  assert.equal(consumed.code, 0, consumed.stderr);
  assert.equal(JSON.parse(consumed.stdout).status, 'consumed');

  const replay = await reflex(fixture, [
    'verify', `--receipt=${bootstrap.receipt}`, '--operation=git-commit', '--scope=work',
  ]);
  assert.equal(replay.code, 1);
});

test('un rename staged fora->dins no amaga el preimage fora de scope', async (t) => {
  const fixture = await setupFixture(t);
  const opened = await openSession(fixture, { scopes: ['work'] });
  const bootstrap = await createBootstrap(fixture, opened);
  await sealSession(fixture, opened, bootstrap);

  await runOk('git', ['mv', 'outside.txt', 'work/mogut.txt'], fixture.root);
  const verified = await reflex(fixture, [
    'verify', '--staged', `--receipt=${bootstrap.receipt}`, '--operation=git-commit',
  ]);
  assert.equal(verified.code, 1);
  assert.match(verified.stderr, /Target fora de scope: outside\.txt/);
});

test('el hook pre-commit materialitza i audita l’arbre pending en un temporal', async (t) => {
  const fixture = await setupFixture(t);
  const opened = await openSession(fixture, { scopes: ['work'] });
  const bootstrap = await createBootstrap(fixture, opened);
  await sealSession(fixture, opened, bootstrap);

  await fs.writeFile(fixture.target, 'bytes exactes staged\n', 'utf8');
  await runOk('git', ['add', 'work/target.txt'], fixture.root);
  await fs.writeFile(fixture.target, 'canvi posterior no staged\n', 'utf8');

  const hook = await run(path.join(fixture.root, '.githooks', 'pre-commit'), [], fixture.root);
  assert.equal(hook.code, 0, `${hook.stdout}\n${hook.stderr}`);
  const receipt = JSON.parse(await fs.readFile(bootstrap.receipt, 'utf8'));
  assert.match(receipt.pendingCommit.tree, /^[a-f0-9]{40,64}$/);
});

test('un symlink staged continua prohibit encara que el worktree el disfresse de fitxer regular', async (t) => {
  const fixture = await setupFixture(t);
  const opened = await openSession(fixture, { scopes: ['work'] });
  const bootstrap = await createBootstrap(fixture, opened);
  await sealSession(fixture, opened, bootstrap);

  const disguised = path.join(fixture.root, 'work', 'disfressat.txt');
  await fs.symlink('target.txt', disguised);
  await runOk('git', ['add', 'work/disfressat.txt'], fixture.root);
  await fs.rm(disguised);
  await fs.writeFile(disguised, 'el worktree ara sembla regular\n', 'utf8');

  const verified = await reflex(fixture, [
    'verify', '--staged', `--receipt=${bootstrap.receipt}`, '--operation=git-commit',
  ]);
  assert.equal(verified.code, 1);
  assert.match(verified.stderr, /symlink prohibida en l’índex/);
});

test('post-commit no consumix una lease d’una operació aliena', async (t) => {
  const fixture = await setupFixture(t);
  const opened = await openSession(fixture, { operation: 'compiler-build', scopes: ['work'] });
  const bootstrap = await createBootstrap(fixture, opened);
  await sealSession(fixture, opened, bootstrap);

  const wrongConsumer = await reflex(fixture, ['consume-commit', `--receipt=${bootstrap.receipt}`]);
  assert.equal(wrongConsumer.code, 1);
  assert.match(wrongConsumer.stderr, /no autoritza git-commit/);

  const generic = await reflex(fixture, ['consume', '--json', `--receipt=${bootstrap.receipt}`]);
  assert.equal(generic.code, 0, generic.stderr);
  assert.equal(JSON.parse(generic.stdout).status, 'consumed');
});

test('un claim de mutador és d’un sol ús i només es consumix després de completar-lo', async (t) => {
  const fixture = await setupFixture(t);
  const opened = await openSession(fixture, { operation: 'snapshot-create', scopes: ['work'] });
  const bootstrap = await createBootstrap(fixture, opened, {
    sources: [{ path: 'work/target.txt', reason: 'Target canari del claim.', role: 'target' }],
  });
  await sealSession(fixture, opened, bootstrap);
  const moduleUrl = pathToFileURL(fixture.script).href;
  const options = {
    receiptPath: bootstrap.receipt,
    operation: 'snapshot-create',
    targets: [fixture.target],
    checkDirty: true,
  };
  const executed = await fixtureModule(fixture, `
    import { claimReceiptForMutation, completeMutationClaim, consumeReceipt } from ${JSON.stringify(moduleUrl)};
    const options = ${JSON.stringify(options)};
    const first = await claimReceiptForMutation(options);
    let replay = '';
    try { await claimReceiptForMutation(options); } catch (error) { replay = error.message; }
    let premature = '';
    try { await consumeReceipt(options.receiptPath); } catch (error) { premature = error.message; }
    await completeMutationClaim({ receiptPath: options.receiptPath, operation: options.operation }, first.claimToken);
    const consumed = await consumeReceipt(options.receiptPath);
    console.log(JSON.stringify({ replay, premature, status: consumed.status }));
  `);
  assert.equal(executed.code, 0, executed.stderr);
  const result = JSON.parse(executed.stdout);
  assert.match(result.replay, /Replay prohibit/);
  assert.match(result.premature, /claims no completats/);
  assert.equal(result.status, 'consumed');
});

test('claim i consume concurrents no poden tindre èxit alhora ni ressuscitar el rebut', async (t) => {
  const fixture = await setupFixture(t);
  const opened = await openSession(fixture, { operation: 'snapshot-create', scopes: ['work'] });
  const bootstrap = await createBootstrap(fixture, opened, {
    sources: [{ path: 'work/target.txt', reason: 'Target canari de concurrència.', role: 'target' }],
  });
  await sealSession(fixture, opened, bootstrap);
  const moduleUrl = pathToFileURL(fixture.script).href;
  const options = {
    receiptPath: bootstrap.receipt,
    operation: 'snapshot-create',
    targets: [fixture.target],
    checkDirty: true,
  };
  const raced = await fixtureModule(fixture, `
    import { claimReceiptForMutation, consumeReceipt } from ${JSON.stringify(moduleUrl)};
    const options = ${JSON.stringify(options)};
    const results = await Promise.allSettled([
      claimReceiptForMutation(options),
      consumeReceipt(options.receiptPath),
    ]);
    const receipt = JSON.parse(await (await import('node:fs/promises')).readFile(options.receiptPath, 'utf8'));
    console.log(JSON.stringify({ statuses: results.map((item) => item.status), receiptStatus: receipt.status }));
  `);
  assert.equal(raced.code, 0, raced.stderr);
  const result = JSON.parse(raced.stdout);
  assert.equal(result.statuses.filter((status) => status === 'fulfilled').length, 1);
  assert.ok(['sealed', 'consumed'].includes(result.receiptStatus));
});

test('scopes i targets que travessen symlinks no poden escapar del projecte', async (t) => {
  const fixture = await setupFixture(t);
  const external = await fs.realpath(await fs.mkdtemp(path.join(os.tmpdir(), 'sdp-reflex-outside-')));
  t.after(async () => fs.rm(external, { recursive: true, force: true }));
  await fs.writeFile(path.join(external, 'outside.txt'), 'fora del projecte\n', 'utf8');
  await fs.symlink(external, path.join(fixture.root, 'scope-escapat'));

  const escapedScope = await reflex(fixture, [
    'open', '--json', '--intent=provar el límit físic dels scopes', '--risk=high',
    '--scope=scope-escapat', `--scope=${ESCRIPTORI_REL}`, '--operation=git-commit',
  ]);
  assert.equal(escapedScope.code, 1);
  assert.match(escapedScope.stderr, /físicament fora del projecte|symlink/i);

  const opened = await openSession(fixture);
  const bootstrap = await createBootstrap(fixture, opened);
  await sealSession(fixture, opened, bootstrap);
  await fs.symlink(path.join(external, 'outside.txt'), path.join(fixture.root, 'work', 'target-escapat.txt'));
  await runOk('git', [
    'add', 'work/target-escapat.txt',
  ], fixture.root);
  const escapedTarget = await reflex(fixture, [
    'verify', '--staged', `--receipt=${bootstrap.receipt}`, '--operation=git-commit',
  ]);
  assert.equal(escapedTarget.code, 1);
  assert.match(escapedTarget.stderr, /físicament fora del projecte|symlink/i);
});

test('l’estat local no pot ser un symlink i els targets no poden ser hardlinks', async (t) => {
  const stateFixture = await setupFixture(t);
  const state = path.join(stateFixture.root, '.sdp-reflex');
  const displaced = path.join(stateFixture.root, '.reflex-real');
  await fs.rename(state, displaced);
  await fs.symlink(displaced, state);
  const unsafeOpen = await reflex(stateFixture, [
    'open', '--intent=detectar estat local desviat', '--risk=high',
    '--scope=work', '--operation=git-commit',
  ]);
  assert.equal(unsafeOpen.code, 1);
  assert.match(unsafeOpen.stderr, /directori físic|symlink/i);

  const hardlinkFixture = await setupFixture(t);
  const opened = await openSession(hardlinkFixture);
  const bootstrap = await createBootstrap(hardlinkFixture, opened);
  await sealSession(hardlinkFixture, opened, bootstrap);
  await fs.link(hardlinkFixture.target, path.join(hardlinkFixture.root, 'work', 'duplicat-hardlink.txt'));
  const hardlinkVerify = await reflex(hardlinkFixture, [
    'verify', `--receipt=${bootstrap.receipt}`, '--operation=git-commit', '--scope=work/target.txt',
  ]);
  assert.equal(hardlinkVerify.code, 1);
  assert.match(hardlinkVerify.stderr, /hardlink/);
});

test('una lease signada però caducada és rebutjada', async (t) => {
  const fixture = await setupFixture(t);
  const opened = await openSession(fixture);
  const bootstrap = await createBootstrap(fixture, opened);
  await sealSession(fixture, opened, bootstrap);

  const receipt = JSON.parse(await fs.readFile(bootstrap.receipt, 'utf8'));
  const secret = (await fs.readFile(path.join(fixture.root, '.sdp-reflex', 'secret.key'), 'utf8')).trim();
  receipt.leaseExpiresAt = '2000-01-01T00:00:00.000Z';
  receipt.signature = signReceipt(receipt, secret);
  await fs.writeFile(bootstrap.receipt, `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');

  const expired = await reflex(fixture, [
    'verify', `--receipt=${bootstrap.receipt}`, '--operation=git-commit', '--scope=work',
  ]);
  assert.equal(expired.code, 1);
  assert.match(expired.stderr, /caducada/);
});
