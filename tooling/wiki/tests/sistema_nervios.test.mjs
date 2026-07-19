import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {
  auditAttachments,
  auditSistemaNervios,
  auditToolingLayout,
  auditTrackedPrivateState,
} from '../core/sistema_nervios.mjs';
import { discoverProjectRoot } from '../lib/project_paths.mjs';

async function temporaryRoot(t, prefix) {
  const root = await fs.realpath(await fs.mkdtemp(path.join(os.tmpdir(), prefix)));
  t.after(async () => fs.rm(root, { recursive: true, force: true }));
  return root;
}

async function write(root, relative, content = '') {
  const target = path.join(root, relative);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, content);
  return target;
}

async function structuralProject(t) {
  const root = await temporaryRoot(t, 'sdp-paths-');
  await write(root, 'AGENTS.md', '# Regles\n');
  await write(root, 'package.json', '{"type":"module"}\n');
  await write(root, '.agents/PROTOCOL_PETORRETA.md', '# Protocol\n');
  await write(root, 'tooling/wiki/reflex_petorreta.mjs', '// canari\n');
  await fs.mkdir(path.join(root, '_wiki_de_poble'), { recursive: true });
  return root;
}

test('la descoberta estructural funciona des de qualsevol profunditat i falla tancada', async (t) => {
  const root = await structuralProject(t);
  const nested = path.join(root, 'tooling/wiki/core/profund');
  await fs.mkdir(nested, { recursive: true });
  assert.equal(discoverProjectRoot(nested), root);

  const incomplete = await temporaryRoot(t, 'sdp-paths-incomplete-');
  const child = path.join(incomplete, 'a/b');
  await fs.mkdir(child, { recursive: true });
  assert.throws(() => discoverProjectRoot(child), /Arrel de projecte no canònica/);
});

async function attachmentFixture(t) {
  const root = await temporaryRoot(t, 'sdp-attachments-');
  const wiki = path.join(root, '_wiki_de_poble');
  const note = [
    '---',
    'estat: "canonic"',
    'tipus: "document"',
    'description: "Canari d’adjunts per al Sistema Nerviós."',
    '---',
    '# Canari',
    '',
    '![[foto.png]]',
    '![absent](assets/absent.pdf)',
    '![[duplicat.jpg]]',
    '',
  ].join('\n');
  await write(wiki, '02_ACTUAR_Maquina_Tecnica/Canari.md', note);
  await write(wiki, '02_ACTUAR_Maquina_Tecnica/assets/foto.png', Buffer.from([1, 2, 3]));
  await write(wiki, '02_ACTUAR_Maquina_Tecnica/a/duplicat.jpg', Buffer.from([4]));
  await write(wiki, '02_ACTUAR_Maquina_Tecnica/b/duplicat.jpg', Buffer.from([5]));
  await write(wiki, '02_ACTUAR_Maquina_Tecnica/assets/orfe.pdf', Buffer.from([6, 7]));
  await write(wiki, '.DS_Store', Buffer.from([8]));
  return { root, wiki };
}

async function metadataTree(root) {
  const rows = [];
  async function walk(directory) {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name, 'ca'));
    for (const entry of entries) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) await walk(absolute);
      else {
        const stat = await fs.lstat(absolute);
        rows.push({
          file: path.relative(root, absolute),
          bytes: stat.size,
          mtimeMs: stat.mtimeMs,
        });
      }
    }
  }
  await walk(root);
  return rows;
}

test('els adjunts resolts, absents, ambigus i orfes es distingixen sense escriure', async (t) => {
  const { wiki } = await attachmentFixture(t);
  const before = await metadataTree(wiki);
  const report = await auditAttachments(wiki);
  const after = await metadataTree(wiki);

  assert.equal(report.resolvedOccurrences, 1);
  assert.equal(report.missing.length, 1);
  assert.equal(report.missing[0].target, 'assets/absent.pdf');
  assert.equal(report.ambiguous.length, 1);
  assert.equal(report.ambiguous[0].candidates.length, 2);
  assert.deepEqual(report.orphans.map((item) => item.file), [
    '02_ACTUAR_Maquina_Tecnica/assets/orfe.pdf',
  ]);
  assert.deepEqual(report.debris, ['.DS_Store']);
  assert.deepEqual(after, before);
});

test('la privacitat només usa noms versionats i evita falsos positius comuns', () => {
  const report = auditTrackedPrivateState([
    '.env',
    '.env.example',
    '.wwebjs_auth/session/Cookies',
    'keys/id_rsa',
    'Profile 1/Login Data',
    'src/auth/session.ts',
  ]);
  assert.equal(report.affectedPaths, 4);
  assert.equal(report.contentRead, false);
  assert.deepEqual(report.families, [
    { family: 'whatsapp-session', count: 1 },
    { family: 'environment-file', count: 1 },
    { family: 'private-key', count: 1 },
    { family: 'browser-profile', count: 1 },
  ]);
});

test('el layout detecta referències antigues sense executar ni reparar res', async (t) => {
  const root = await structuralProject(t);
  await write(root, 'scripts/legacy.mjs',
    "const old = '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/scripts/reflex_petorreta.mjs';\n");
  const report = await auditToolingLayout({
    projectRoot: root,
    trackedPaths: ['tooling/wiki/reflex_petorreta.mjs', 'scripts/legacy.mjs'],
    expectedPaths: ['tooling/wiki/reflex_petorreta.mjs'],
  });
  assert.deepEqual(report.missing, []);
  assert.deepEqual(report.obsoleteTracked, []);
  assert.deepEqual(report.legacyLiteralFiles, ['scripts/legacy.mjs']);
});

test('dos rastrejos sobre els mateixos bytes produïxen el mateix informe', async (t) => {
  const { root, wiki } = await attachmentFixture(t);
  await write(root, 'tooling/wiki/reflex_petorreta.mjs', '// canari estable\n');
  await write(wiki, '.obsidian/graph.json', `${JSON.stringify({
    search: '',
    showOrphans: false,
    hideUnresolved: true,
    showAttachments: false,
    colorGroups: [1, 2, 3, 4].map((value) => ({ query: String(value) })),
  })}\n`);
  const options = {
    projectRoot: root,
    wikiDir: wiki,
    trackedPaths: ['tooling/wiki/reflex_petorreta.mjs', '.env.example'],
    expectedPaths: ['tooling/wiki/reflex_petorreta.mjs'],
  };
  const first = await auditSistemaNervios(options);
  const second = await auditSistemaNervios(options);
  assert.deepEqual(second, first);
  assert.equal(first.complete, true);
  assert.equal(first.repairPlan.writes, false);
  assert.deepEqual(first.repairPlan.safeAutomaticActions, []);
});
