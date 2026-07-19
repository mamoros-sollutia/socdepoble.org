#!/usr/bin/env node
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { auditSistemaNervios } from './core/sistema_nervios.mjs';

function parseCli(argv) {
  const options = { json: false, strict: false, wikiDir: undefined };
  for (const arg of argv) {
    if (arg === '--json') options.json = true;
    else if (arg === '--strict') options.strict = true;
    else if (arg.startsWith('--wiki=')) options.wikiDir = path.resolve(arg.slice(7));
    else if (arg === '--help') options.help = true;
    else throw new Error(`Argument desconegut: ${arg}`);
  }
  return options;
}

function printHelp() {
  console.log('Sistema Nerviós de la Wiki — auditoria one-shot, només lectura');
  console.log('  node tooling/wiki/sistema_nervios.mjs [--json] [--strict] [--wiki=/ruta]');
}

function printHuman(report) {
  console.log(`\n🫀 SISTEMA NERVIÓS — ${report.status.toUpperCase()} · NOMÉS LECTURA`);
  console.log(`   Documents: ${report.domains.content.documents} · operatius: ${report.domains.content.operationalDocuments}`);
  console.log(`   Graf: ${report.domains.graph.unresolvedOccurrences} fantasmes · ${report.domains.graph.operationalOrphans} orfes operatius`);
  console.log(`   Adjunts: ${report.domains.attachments.inventory.files} fitxers · ${report.domains.attachments.missing.length} absents · ${report.domains.attachments.orphans.length} orfes`);
  console.log(`   Layout: ${report.domains.layout.missing.length} crítics absents · ${report.domains.layout.legacyLiteralFiles.length} referències legacy`);
  console.log(`   Privacitat: ${report.domains.privacy.affectedPaths} rutes versionades de risc (contingut no llegit)`);
  console.log(`   Troballes: ${report.counts.critical} crítiques · ${report.counts.error} errors · ${report.counts.warning} avisos`);
  console.log(`   Digest: ${report.snapshotSha256}`);
  console.log('   Porta següent: revisió humana del pla; zero mutacions automàtiques.');
}

export async function runCli(argv = process.argv.slice(2)) {
  const options = parseCli(argv);
  if (options.help) {
    printHelp();
    return { exitCode: 0, report: null };
  }
  const report = await auditSistemaNervios({
    ...(options.wikiDir ? { wikiDir: options.wikiDir } : {}),
  });
  if (options.json) console.log(JSON.stringify(report, null, 2));
  else printHuman(report);
  return { exitCode: options.strict && !report.ok ? 1 : 0, report };
}

const isMain = Boolean(process.argv[1])
  && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMain) {
  const jsonRequested = process.argv.includes('--json');
  runCli().then(({ exitCode }) => {
    process.exitCode = exitCode;
  }).catch((error) => {
    const incomplete = {
      schema: 'socdepoble.sistema-nervios.v1',
      complete: false,
      ok: false,
      status: 'incomplet',
      error: { code: 'AUDITORIA_INCOMPLETA', message: error.message },
    };
    if (jsonRequested) console.log(JSON.stringify(incomplete, null, 2));
    else console.error(`❌ [SISTEMA NERVIÓS] ${error.message}`);
    process.exitCode = 2;
  });
}
