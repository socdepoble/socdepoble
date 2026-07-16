import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { run as runGc } from '../core/tombstone_gc.mjs';
import { createSnapshot } from '../core/snapshot_engine.mjs';
import { auditRootHygiene } from '../wiki_integritat.mjs';
import { cura } from '../cura_robotomia.mjs';

test('tombstone GC en dry-run no crea ni tan sols un temporal', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'sdp-gc-dry-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const state = path.join(root, 'state.ndjson');
  const initial = '{"id":1,"__deleted":true}\n{"id":2,"value":"viu"}\n';
  await fs.writeFile(state, initial, 'utf8');
  const before = (await fs.readdir(root)).sort();

  const result = await runGc({
    file: state,
    write: false,
    thresholdBytes: 0,
    tombstonePercentMax: 0,
  });

  assert.equal(result.ok, true);
  assert.equal(result.data.compacted, true);
  assert.equal(result.data.written, false);
  assert.equal(await fs.readFile(state, 'utf8'), initial);
  assert.deepEqual((await fs.readdir(root)).sort(), before);
});

test('snapshot físic falla tancat sense rebut i no crea el directori', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'sdp-snapshot-lock-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await fs.writeFile(path.join(root, 'A.md'), '# A\n', 'utf8');
  const out = path.join(root, '.snapshots');

  await assert.rejects(createSnapshot({ root, out }), /rebut|active\.json|ENOENT|fora del projecte/i);
  await assert.rejects(fs.stat(out), { code: 'ENOENT' });
});

test('la higiene d’arrel reporta Markdown solt sense moure’l', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'sdp-root-hygiene-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const loose = path.join(root, 'Solt.md');
  await fs.writeFile(loose, '# Solt\n', 'utf8');

  const count = await auditRootHygiene(root, path.join(root, '04_ARXIU_Documents_Historics'), { dryRun: true });
  assert.equal(count, 1);
  assert.equal(await fs.readFile(loose, 'utf8'), '# Solt\n');
});

test('Robotomia detecta tokens nous i casing mixt però permet la font Roboto', async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'sdp-robotomia-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  await fs.writeFile(path.join(root, 'ferida.md'), '# ROBOTOFÍCIE\n\nRoboto és una font.\n', 'utf8');
  const result = await cura(root);
  assert.equal(result.ok, false);
  assert.equal(result.substitucions, 1);
  assert.equal(result.detall[0].ferides[0].token, 'ROBOTOFÍCIE');
});
