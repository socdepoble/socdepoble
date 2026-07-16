import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {
  parseFrontmatter,
  serializeFrontmatter,
} from '../lib/frontmatter.mjs';
import {
  auditWiki,
  extractLinks,
  liveMarkdown,
  applyAuditPlan,
} from '../autoneteja_wiki.mjs';
import { determinarCarpeta, validarFrontmatter } from '../entropia_zero_router.js';

test('frontmatter buit, CRLF i llistes en bloc són vàlids', () => {
  const empty = parseFrontmatter('---\n---\n# Títol');
  assert.equal(empty.hasFrontmatter, true);
  assert.deepEqual(empty.data, {});
  assert.equal(empty.body, '# Títol');

  const list = parseFrontmatter('---\r\naliases:\r\n  - "Un"\r\n  - Dos\r\n---\r\nCos');
  assert.deepEqual(list.data.aliases, ['Un', 'Dos']);
  assert.equal(list.body, 'Cos');
});

test('serialitza dos punts i coixinets sense trencar YAML', () => {
  const yaml = serializeFrontmatter({
    estat: 'canonic',
    tipus: 'document',
    description: 'Protocol: no convertir #text en comentari',
    aliases: ['A: B', 'C # D'],
  }, ['estat', 'tipus', 'description', 'aliases']);
  const parsed = parseFrontmatter(`${yaml}Cos`);
  assert.equal(parsed.errors.length, 0);
  assert.equal(parsed.data.description, 'Protocol: no convertir #text en comentari');
  assert.deepEqual(parsed.data.aliases, ['A: B', 'C # D']);
});

test('un escalar YAML ambigu es reporta, no se silencia', () => {
  const parsed = parseFrontmatter('---\ndescription: Açò acaba en dos punts:\n---\nCos');
  assert.match(parsed.errors.join(' '), /cal citar-lo/);
});

test('comentaris YAML vàlids passen i claus duplicades bloquegen', () => {
  const commented = parseFrontmatter([
    '---',
    'estat: canonic # comentari permés',
    '# comentari entre claus',
    'tipus: document',
    'description: "Descripció prou clara"',
    '---',
    'Cos',
  ].join('\n'));
  assert.deepEqual(commented.errors, []);
  assert.equal(commented.data.estat, 'canonic');

  const duplicate = parseFrontmatter('---\nestat: canonic\nestat: esborrany\n---\nCos');
  assert.match(duplicate.errors.join(' '), /clau duplicada/);
});

test('un apòstrof valencià no obri cometes YAML ni oculta el comentari', () => {
  const parsed = parseFrontmatter([
    '---',
    "description: L'avi documenta el sistema amb prou detall # comentari real",
    "aliases: [L'avi, 'Pep, el ''roig''', \"C # D\", C#] # llista comentada",
    '---',
    'Cos',
  ].join('\n'));
  assert.deepEqual(parsed.errors, []);
  assert.equal(parsed.data.description, "L'avi documenta el sistema amb prou detall");
  assert.deepEqual(parsed.data.aliases, ["L'avi", "Pep, el 'roig'", 'C # D', 'C#']);
});

test('els enllaços dins de codi i comentaris no formen part del graf viu', () => {
  const markdown = [
    '[[Viu]]',
    '`[[InlineFantasma]]`',
    '<!-- [[ComentariFantasma]] -->',
    '%% [[ComentariObsidian]] %%',
    '```js',
    'const exemple = "[[FenceFantasma]]";',
    '```',
    '````md',
    '```',
    '[[EncaraDinsFenceLlarg]]',
    '````',
    '[Relatiu](../B.md)',
    '[Parèntesis](Carpeta/A_(B).md)',
  ].join('\n');
  const live = liveMarkdown(markdown);
  assert.doesNotMatch(live, /FenceFantasma|EncaraDinsFenceLlarg|InlineFantasma|ComentariFantasma|ComentariObsidian/);
  assert.deepEqual(extractLinks(markdown).map((link) => link.target), ['Viu', '../B.md', 'Carpeta/A_(B).md']);
});

test('els URI file són externs i Markdown relatiu no resol per basename global', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'sdp-autoneteja-links-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const ser = path.join(root, '00_SER_Brain_Identitat');
  const saber = path.join(root, '01_SABER_Cultura_Coneixement');
  await fs.mkdir(ser, { recursive: true });
  await fs.mkdir(saber, { recursive: true });
  await fs.writeFile(path.join(ser, 'A.md'), '# A\n\n[Extern](file:///tmp/context/SKILL.md)\n[No relatiu](B.md)\n');
  await fs.writeFile(path.join(saber, 'B.md'), '# B\n');

  const report = await auditWiki(root);
  assert.equal(report.graph.unresolvedOccurrences, 1);
  assert.equal(report.graph.unresolved[0].target, 'B.md');
});

test('un basename exacte guanya a un alias homònim i evita quarantena falsa', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'sdp-autoneteja-alias-collision-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const pilar = path.join(root, '00_SER_Brain_Identitat');
  await fs.mkdir(pilar, { recursive: true });
  await fs.writeFile(path.join(pilar, 'Target.md'), '');
  await fs.writeFile(path.join(pilar, 'Alias.md'), serializeFrontmatter({
    estat: 'canonic',
    tipus: 'document',
    description: 'Document alternatiu que declara un alias homònim.',
    aliases: ['Target'],
  }) + 'Contingut alternatiu amb identitat pròpia.\n');
  await fs.writeFile(path.join(pilar, 'Source.md'), serializeFrontmatter({
    estat: 'canonic',
    tipus: 'document',
    description: 'Document font que enllaça el basename físic exacte.',
  }) + 'Consulta [[Target]] per continuar.\n');

  const report = await auditWiki(root);
  assert.equal(report.graph.ambiguousOccurrences, 0);
  assert.equal(report.graph.unresolvedOccurrences, 0);
  assert.equal(report.safety.quarantineCandidates.includes('00_SER_Brain_Identitat/Target.md'), false);
  assert.equal(report.graph.orphanFiles.includes('00_SER_Brain_Identitat/Target.md'), false);
  assert.equal(report.graph.orphanFiles.includes('00_SER_Brain_Identitat/Alias.md'), true);
});

test('audit és dry-run real, conserva el cos i només quarantina buit aïllat', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'sdp-autoneteja-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const pilar = path.join(root, '00_SER_Brain_Identitat');
  await fs.mkdir(path.join(root, '.obsidian'), { recursive: true });
  await fs.mkdir(pilar, { recursive: true });
  await fs.writeFile(path.join(root, '.obsidian', 'graph.json'), JSON.stringify({
    showOrphans: true,
    hideUnresolved: false,
    colorGroups: [],
  }));
  const bodyA = '# A\n\nEnllaça [[B]].\n\n```js\nconst x = "[[NoExisteix]]";\n```\n';
  await fs.writeFile(path.join(pilar, 'A.md'), [
    '---',
    'estat: canonic',
    'categoria: doc',
    'description: "Document A amb context suficient"',
    '---',
    bodyA,
  ].join('\n'));
  await fs.writeFile(path.join(pilar, 'B.md'), [
    '---',
    'estat: esborrany',
    'categoria: doc',
    'description: "Document B encara buit"',
    '---',
  ].join('\n'));
  await fs.writeFile(path.join(pilar, 'C.md'), '');

  const before = new Map();
  for (const name of ['A.md', 'B.md', 'C.md']) {
    const file = path.join(pilar, name);
    const stat = await fs.stat(file);
    before.set(name, { content: await fs.readFile(file, 'utf8'), mtime: stat.mtimeMs });
  }

  const report = await auditWiki(root);
  assert.equal(report.snapshot.files, 3);
  assert.equal(report.graph.unresolvedOccurrences, 0);
  assert.deepEqual(report.content.semanticEmpty.sort(), [
    '00_SER_Brain_Identitat/B.md',
    '00_SER_Brain_Identitat/C.md',
  ]);
  assert.deepEqual(report.safety.quarantineCandidates, ['00_SER_Brain_Identitat/C.md']);
  const actionA = report.plan.frontmatterActions.find((action) => action.file.endsWith('/A.md'));
  assert.ok(actionA);
  assert.equal(parseFrontmatter(actionA.content).body, parseFrontmatter(before.get('A.md').content).body);

  await assert.rejects(
    applyAuditPlan(report, { quarantineEmpty: true }),
    /arrel --wiki alternativa/,
  );
  for (const name of ['A.md', 'B.md', 'C.md']) {
    const file = path.join(pilar, name);
    const stat = await fs.stat(file);
    assert.equal(await fs.readFile(file, 'utf8'), before.get(name).content);
    assert.equal(stat.mtimeMs, before.get(name).mtime);
  }
});

test('un YAML invàlid es reporta però mai entra al pla de reescriptura', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'sdp-autoneteja-invalid-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const pilar = path.join(root, '00_SER_Brain_Identitat');
  await fs.mkdir(pilar, { recursive: true });
  await fs.writeFile(path.join(pilar, 'Duplicat.md'), [
    '---',
    'estat: canonic',
    'estat: esborrany',
    'tipus: document',
    'description: "Document amb capçalera conflictiva"',
    '---',
    '# Cos',
  ].join('\n'));

  const report = await auditWiki(root);
  assert.equal(report.frontmatter.yamlErrors.length, 1);
  assert.equal(report.plan.frontmatterActions.length, 0);
  assert.equal(report.ok, false);
});

test('un frontmatter v2 canònic no duplica obligatòriament la data de Git', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'sdp-autoneteja-v2-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const pilar = path.join(root, '00_SER_Brain_Identitat');
  await fs.mkdir(pilar, { recursive: true });
  await fs.writeFile(path.join(pilar, 'Canon.md'), [
    '---',
    'estat: "canonic"',
    'tipus: "document"',
    'description: "Document aprovat amb traça autoritativa conservada en Git."',
    '---',
    '# Document canònic',
  ].join('\n'));

  const report = await auditWiki(root);
  assert.equal(report.frontmatter.canonicalViolations.length, 0);
  assert.equal(report.plan.frontmatterActions.length, 0);
});

test('metadades v2 vàlides conserven C#, apòstrofs i puntuació byte a byte', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'sdp-autoneteja-preserve-v2-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const pilar = path.join(root, '00_SER_Brain_Identitat');
  await fs.mkdir(pilar, { recursive: true });
  const content = serializeFrontmatter({
    estat: 'futur',
    tipus: 'document',
    description: "Manual de C# de l'avi: símbols # i puntuació humana intactes.",
    aliases: ['C#', "L'avi"],
  }, ['estat', 'tipus', 'description', 'aliases']) + 'Cos editorial suficient i estable.\n';
  await fs.writeFile(path.join(pilar, 'Canon.md'), content);

  const report = await auditWiki(root);
  assert.equal(report.frontmatter.unsafeSourceFields.length, 0);
  assert.equal(report.plan.frontmatterActions.length, 0);
});

test('enums i descriptions invàlids exigixen revisió humana, mai inferència silenciosa', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'sdp-autoneteja-human-review-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const pilar = path.join(root, '00_SER_Brain_Identitat');
  await fs.mkdir(pilar, { recursive: true });
  await fs.writeFile(path.join(pilar, 'Invalid.md'), serializeFrontmatter({
    estat: 'perfecte',
    tipus: 'artefacte',
    description: 'x'.repeat(141),
  }) + 'Cos que no ha de justificar una reparació destructiva.\n');

  const report = await auditWiki(root);
  assert.equal(report.plan.frontmatterActions.length, 0);
  assert.equal(report.frontmatter.unsafeSourceFields.length, 1);
  assert.match(report.frontmatter.unsafeSourceFields[0].errors.join(' '), /estat.*revisió humana/);
  assert.match(report.frontmatter.unsafeSourceFields[0].errors.join(' '), /tipus.*revisió humana/);
  assert.match(report.frontmatter.unsafeSourceFields[0].errors.join(' '), /massa llarga/);
  assert.equal(report.safety.mutationBlockers.length, 1);
});

test('orfes, placeholders i títols sols operatius fan fallar audit i --strict', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'sdp-autoneteja-operational-p1-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const pilar = path.join(root, '00_SER_Brain_Identitat');
  await fs.mkdir(pilar, { recursive: true });
  const fm = (description) => serializeFrontmatter({ estat: 'canonic', tipus: 'document', description });
  await fs.writeFile(path.join(pilar, 'Orfe.md'), fm('Document operatiu amb contingut però sense cap sinapsi.')
    + 'Contingut editorial autònom que encara no té cap enllaç.\n');
  await fs.writeFile(path.join(pilar, 'Placeholder.md'), fm('Document operatiu que encara és només un marcador explícit.') + 'Pendent\n');
  await fs.writeFile(path.join(pilar, 'Titol.md'), fm('Document operatiu que encara conserva únicament el seu títol.') + '# Títol sol\n');

  const report = await auditWiki(root);
  assert.equal(report.operational.ok, false);
  assert.equal(report.ok, false);
  assert.equal(report.operational.health, 'degradat');
  assert.equal(report.operational.graph.orphans, 3);
  assert.deepEqual(report.operational.placeholders, ['00_SER_Brain_Identitat/Placeholder.md']);
  assert.deepEqual(report.operational.titleOnly, ['00_SER_Brain_Identitat/Titol.md']);
});

test('un orfe històric és informatiu i no contamina el nucli operatiu', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'sdp-autoneteja-archive-orphan-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const archive = path.join(root, '04_ARXIU_Documents_Historics');
  await fs.mkdir(archive, { recursive: true });
  await fs.writeFile(path.join(archive, 'Historic.md'), serializeFrontmatter({
    estat: 'arxivat',
    tipus: 'document',
    description: 'Document històric deliberadament aïllat del graf operatiu.',
  }) + 'Memòria històrica preservada fora del circuit viu.\n');

  const report = await auditWiki(root);
  assert.equal(report.graph.orphans, 1);
  assert.equal(report.operational.graph.orphans, 0);
  assert.equal(report.operational.ok, true);
  assert.equal(report.ok, true);
});

test('apply rebutja un pla manipulat abans de demanar cap rebut', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'sdp-autoneteja-tampered-plan-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const pilar = path.join(root, '00_SER_Brain_Identitat');
  await fs.mkdir(pilar, { recursive: true });
  await fs.writeFile(path.join(pilar, 'Legacy.md'), [
    '---',
    'estat: canonic',
    'categoria: doc',
    'description: "Document legacy segur que necessita migració mecànica."',
    '---',
    'Cos editorial complet.\n',
  ].join('\n'));
  const report = await auditWiki(root);
  assert.equal(report.plan.frontmatterActions.length, 1);
  assert.match(report.plan.schemaSha256, /^[a-f0-9]{64}$/);

  const blockerTamper = structuredClone(report);
  blockerTamper.safety.mutationBlockers = [
    ...blockerTamper.safety.mutationBlockers,
    { file: 'injectat.md', reason: 'ocultat' },
  ];
  await assert.rejects(applyAuditPlan(blockerTamper, {
    applyFrontmatter: true,
    ackSchemaCutover: true,
    ackLegacyLoss: true,
  }), /bloquejos no concorden/);

  const schemaTamper = structuredClone(report);
  schemaTamper.plan.schemaSha256 = '0'.repeat(64);
  await assert.rejects(applyAuditPlan(schemaTamper, {
    applyFrontmatter: true,
    ackSchemaCutover: true,
    ackLegacyLoss: true,
  }), /schema\.json actual/);

  report.plan.frontmatterActions[0].content += '\nINJECCIÓ';

  await assert.rejects(applyAuditPlan(report, {
    applyFrontmatter: true,
    ackSchemaCutover: true,
    ackLegacyLoss: true,
  }), /afterSha256 no concorda/);
});

test('el router v2 conserva la ruta existent i valida revisat només quan apareix', () => {
  const canonical = {
    estat: 'canonic',
    tipus: 'document',
    description: 'Document canònic sense data manual duplicada.',
  };
  assert.deepEqual(validarFrontmatter(canonical), []);
  assert.equal(
    determinarCarpeta(canonical, { currentPath: '01_SABER_Cultura_Coneixement/nota.md' }),
    '01_SABER_Cultura_Coneixement/',
  );
  assert.equal(
    determinarCarpeta({ ...canonical, estat: 'futur', tipus: 'skill' }, {
      currentPath: '02_ACTUAR_Maquina_Tecnica/skills/MOTOR_OFFLINE.md',
    }),
    '02_ACTUAR_Maquina_Tecnica/skills/',
  );
  assert.match(validarFrontmatter({ ...canonical, revisat: '2026-02-30' }).join(' '), /data real/);
});
