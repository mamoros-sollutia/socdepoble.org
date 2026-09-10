import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { auditWiki } from './autoneteja_audit.mjs';
import { discoverMarkdown, zoneOf } from './corpus_snapshot.mjs';
import { extractLinks, safeDecode } from './parse.mjs';
import { parseFrontmatter } from '../lib/frontmatter.mjs';
import {
  PROJECT_DIR,
  WIKI_DIR,
} from '../lib/project_paths.mjs';

const execFileAsync = promisify(execFile);
const LEGACY_TOOLING_PREFIX = '_wiki_de_poble/03_actuar/scripts/';
const SKIP_ATTACHMENT_DIRS = new Set([
  '.git', '.obsidian', '.wiki-safety', 'node_modules',
]);
const EXPECTED_TOOLING_PATHS = [
  'tooling/wiki/reflex_petorreta.mjs',
  'tooling/wiki/autoneteja_wiki.mjs',
  'tooling/wiki/sdp-cli.mjs',
  'tooling/wiki/pre-commit.mjs',
  'tooling/wiki/lib/project_paths.mjs',
  'tooling/wiki/core/autoneteja_audit.mjs',
  'tooling/wiki/core/corpus_snapshot.mjs',
  'tooling/wiki/core/mutation_kernel.mjs',
  'tooling/wiki/core/parse.mjs',
  'tooling/wiki/core/sistema_nervios.mjs',
  'tooling/wiki/sistema_nervios.mjs',
  'tooling/wiki/schema.json',
  'tooling/wiki/schema-cutover.lock.json',
  'tooling/wiki/wiki-baseline.lock.json',
];
const SOURCE_EXTENSIONS = new Set([
  '.cjs', '.js', '.json', '.jsx', '.md', '.mjs', '.sh', '.ts', '.tsx', '.yaml', '.yml',
]);
const TAXONOMY_TARGETS = new Set([
  '07_plantilles', 'coneixement', 'govern', 'graf', 'identitat', 'les_petorretes', 'maquina', 'skills',
]);
const SEVERITY_ORDER = new Map([
  ['critical', 0],
  ['error', 1],
  ['warning', 2],
  ['info', 3],
]);

const posix = (value) => value.split(path.sep).join('/');
import { normalitza as normalize } from '../lib/text.mjs';
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const isInside = (root, candidate) => {
  const relative = path.relative(root, candidate);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
};
const stableSort = (values, selector = (value) => String(value)) => [...values]
  .sort((a, b) => selector(a).localeCompare(selector(b), 'ca'));

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return value;
}

function extensionTarget(rawTarget) {
  let target = safeDecode(rawTarget).replace(/\\/g, '/').trim();
  if (!target || /^(?:https?:|mailto:|tel:|ftp:|file:|data:|obsidian:)/i.test(target)) return null;
  const anchor = target.search(/[?#]/);
  if (anchor >= 0) target = target.slice(0, anchor);
  target = target.trim();
  if (!target || /\.md$/i.test(target) || !/\.[A-Za-z0-9]{1,12}$/.test(target)) return null;
  return target;
}

async function inventoryAttachments(wikiDir) {
  const root = await fs.realpath(wikiDir);
  const files = [];
  const debris = [];
  const skippedSymlinks = [];

  async function walk(directory) {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name, 'ca'));
    for (const entry of entries) {
      const absolute = path.join(directory, entry.name);
      const relative = posix(path.relative(root, absolute));
      if (entry.isSymbolicLink()) {
        skippedSymlinks.push(relative);
        continue;
      }
      if (entry.isDirectory()) {
        if (entry.name.startsWith('.') || SKIP_ATTACHMENT_DIRS.has(entry.name)) continue;
        await walk(absolute);
        continue;
      }
      if (!entry.isFile()) continue;
      if (/^(?:\.!.*!)?\.DS_Store$/i.test(entry.name) || entry.name === '.DS_Store') {
        debris.push(relative);
        continue;
      }
      if (entry.name.startsWith('.') || entry.name.toLowerCase().endsWith('.md')) continue;
      const stat = await fs.lstat(absolute);
      if (stat.isSymbolicLink() || stat.nlink !== 1) {
        skippedSymlinks.push(relative);
        continue;
      }
      files.push({ file: relative, bytes: stat.size, zone: zoneOf(relative) });
    }
  }

  await walk(root);
  return {
    root,
    files: stableSort(files, (item) => item.file),
    debris: stableSort(debris),
    skippedSymlinks: stableSort(skippedSymlinks),
  };
}

export async function auditAttachments(wikiDir = WIKI_DIR) {
  const [{ docs }, inventory] = await Promise.all([
    discoverMarkdown(wikiDir),
    inventoryAttachments(wikiDir),
  ]);
  const byPath = new Map();
  const byBase = new Map();
  for (const attachment of inventory.files) {
    byPath.set(normalize(attachment.file), attachment);
    const base = normalize(path.posix.basename(attachment.file));
    if (!byBase.has(base)) byBase.set(base, []);
    byBase.get(base).push(attachment);
  }

  const referenced = new Set();
  const missing = [];
  const ambiguous = [];
  let resolvedOccurrences = 0;

  for (const doc of docs) {
    const body = parseFrontmatter(doc.content).body;
    for (const link of extractLinks(body)) {
      const target = extensionTarget(link.target);
      if (!target) continue;
      const withoutRoot = target.replace(/^\/+/, '');
      const candidates = [];
      if (target.startsWith('/')) {
        candidates.push(withoutRoot);
      } else {
        const relative = path.posix.normalize(path.posix.join(path.posix.dirname(doc.relPath), target));
        if (!relative.startsWith('../')) candidates.push(relative);
        if (link.kind === 'wiki' && target.includes('/')) candidates.push(withoutRoot);
      }
      const exact = [...new Set(candidates.map(normalize))]
        .map((candidate) => byPath.get(candidate))
        .filter(Boolean);
      const hits = exact.length > 0
        ? [...new Map(exact.map((item) => [item.file, item])).values()]
        : link.kind === 'wiki'
          ? byBase.get(normalize(path.posix.basename(withoutRoot))) || []
          : [];
      if (hits.length === 1) {
        referenced.add(hits[0].file);
        resolvedOccurrences++;
      } else if (hits.length > 1) {
        hits.forEach((item) => referenced.add(item.file));
        ambiguous.push({
          from: doc.relPath,
          zone: doc.zone,
          kind: link.kind,
          target,
          candidates: stableSort(hits.map((item) => item.file)),
        });
      } else {
        missing.push({
          from: doc.relPath,
          zone: doc.zone,
          kind: link.kind,
          target,
        });
      }
    }
  }

  const orphans = inventory.files
    .filter((item) => !referenced.has(item.file))
    .map(({ file, bytes, zone }) => ({ file, bytes, zone }));
  return {
    inventory: {
      files: inventory.files.length,
      bytes: inventory.files.reduce((sum, item) => sum + item.bytes, 0),
      referenced: referenced.size,
    },
    resolvedOccurrences,
    missing: stableSort(missing, (item) => `${item.from}\0${item.target}`),
    ambiguous: stableSort(ambiguous, (item) => `${item.from}\0${item.target}`),
    orphans: stableSort(orphans, (item) => item.file),
    debris: inventory.debris,
    skippedSymlinks: inventory.skippedSymlinks,
  };
}

export async function trackedPathsFromGit(projectRoot = PROJECT_DIR) {
  const { stdout } = await execFileAsync('git', ['-C', projectRoot, 'ls-files', '-z'], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  return stableSort([...new Set(stdout.split('\0').filter(Boolean).map(posix))]);
}

export function auditTrackedPrivateState(trackedPaths) {
  const families = new Map([
    ['whatsapp-session', 0],
    ['environment-file', 0],
    ['private-key', 0],
    ['browser-profile', 0],
  ]);
  for (const raw of trackedPaths) {
    const file = posix(raw);
    if (/(^|\/)\.wwebjs_(?:auth|cache)(\/|$)/i.test(file)) {
      families.set('whatsapp-session', families.get('whatsapp-session') + 1);
      continue;
    }
    if (/(^|\/)\.env(?:\.[^/]*)?$/i.test(file)
      && !/\.(?:example|sample|template|dist)$/i.test(file)) {
      families.set('environment-file', families.get('environment-file') + 1);
      continue;
    }
    if (/(^|\/)(?:id_rsa|id_ed25519|[^/]*(?:private|secret)[^/]*\.(?:pem|key)|[^/]*\.(?:p12|pfx))$/i.test(file)) {
      families.set('private-key', families.get('private-key') + 1);
      continue;
    }
    if (/(^|\/)(?:Default|Profile \d+)\/(?:Cookies|Login Data|Local Storage|Session Storage|Web Data)(\/|$)/i.test(file)) {
      families.set('browser-profile', families.get('browser-profile') + 1);
    }
  }
  const present = [...families.entries()]
    .filter(([, count]) => count > 0)
    .map(([family, count]) => ({ family, count }));
  return {
    checkedPaths: trackedPaths.length,
    affectedPaths: present.reduce((sum, item) => sum + item.count, 0),
    families: present,
    contentRead: false,
    note: 'Afegir patrons a .gitignore no neteja l’historial ni substituïx revocació o rotació.',
  };
}

export async function auditToolingLayout({
  projectRoot = PROJECT_DIR,
  trackedPaths,
  expectedPaths = EXPECTED_TOOLING_PATHS,
} = {}) {
  const root = await fs.realpath(projectRoot);
  const tracked = new Set(trackedPaths.map(posix));
  const missing = [];
  const unsafe = [];
  const untracked = [];
  for (const relative of expectedPaths) {
    const absolute = path.join(root, relative);
    if (!isInside(root, absolute)) throw new Error(`Ruta crítica fora del projecte: ${relative}`);
    const stat = await fs.lstat(absolute).catch((error) => error.code === 'ENOENT' ? null : Promise.reject(error));
    if (!stat) {
      missing.push(relative);
      continue;
    }
    if (!stat.isFile() || stat.isSymbolicLink() || stat.nlink !== 1) unsafe.push(relative);
    if (!tracked.has(relative)) untracked.push(relative);
  }

  const obsoleteTracked = stableSort([...tracked]
    .filter((relative) => relative.startsWith(LEGACY_TOOLING_PREFIX)));
  const legacyLiteralFiles = [];
  for (const relative of stableSort([...tracked])) {
    if (!relative.startsWith('tooling/wiki/') && !relative.startsWith('scripts/')) continue;
    if (!SOURCE_EXTENSIONS.has(path.extname(relative)) && path.basename(relative) !== 'Makefile') continue;
    const absolute = path.join(root, relative);
    const stat = await fs.lstat(absolute).catch(() => null);
    if (!stat?.isFile() || stat.isSymbolicLink() || stat.size > 2 * 1024 * 1024) continue;
    const content = await fs.readFile(absolute, 'utf8').catch(() => '');
    if (content.includes(LEGACY_TOOLING_PREFIX)) legacyLiteralFiles.push(relative);
  }

  return {
    strategy: 'structural-markers-fail-closed',
    expected: expectedPaths.length,
    missing: stableSort(missing),
    unsafe: stableSort(unsafe),
    untracked: stableSort(untracked),
    obsoleteTracked,
    legacyLiteralFiles: stableSort(legacyLiteralFiles),
  };
}

function repairClass(target) {
  const normalized = normalize(target);
  if (TAXONOMY_TARGETS.has(normalized)) {
    return {
      classification: 'taxonomia_sense_node',
      proposedAction: 'convertir_marcador_a_text_o_enllacar_node_amb_contingut',
    };
  }
  if (normalized.includes('04_arxiu_documents_historics')) {
    return {
      classification: 'referencia_historica_moguda',
      proposedAction: 'confirmar_destinacio_i_retargetar_sense_esborrar_context',
    };
  }
  if (target.includes('/')) {
    return {
      classification: 'ruta_absent',
      proposedAction: 'confirmar_ruta_canonica',
    };
  }
  return {
    classification: 'node_absent',
    proposedAction: 'crear_node_substantiu_o_reformular_referencia',
  };
}

export function buildRepairPlan(audit, attachments) {
  const grouped = new Map();
  for (const item of audit.operational.graph.unresolved) {
    const key = normalize(item.target);
    if (!grouped.has(key)) grouped.set(key, { targets: new Set(), sources: new Set(), occurrences: 0 });
    const group = grouped.get(key);
    group.targets.add(item.target);
    group.sources.add(item.from);
    group.occurrences++;
  }
  const unresolvedTargets = [...grouped.values()].map((group) => {
    const target = stableSort(group.targets)[0];
    return {
      target,
      occurrences: group.occurrences,
      sourceFiles: group.sources.size,
      ...repairClass(target),
      autoEligible: false,
    };
  });
  return {
    mode: 'observacio',
    writes: false,
    gate: 'revisio_humana',
    reportDigestRequiredForMutation: true,
    safeAutomaticActions: [],
    unresolvedTargets: stableSort(unresolvedTargets, (item) => item.target),
    operationalOrphans: audit.operational.graph.orphanFiles.map((file) => ({
      file,
      proposedAction: 'connectar_o_justificar',
      autoEligible: false,
    })),
    missingAttachments: attachments.missing.map((item) => ({
      from: item.from,
      target: item.target,
      proposedAction: 'restaurar_o_retargetar',
      autoEligible: false,
    })),
    orphanAttachments: attachments.orphans.map((item) => ({
      file: item.file,
      proposedAction: 'revisar_ús_abans_de_moure',
      autoEligible: false,
    })),
  };
}

function finding(code, severity, domain, count) {
  return { code, severity, domain, count };
}

function buildFindings(audit, attachments, layout, privacy) {
  const findings = [];
  const add = (code, severity, domain, count) => {
    if (count > 0) findings.push(finding(code, severity, domain, count));
  };
  const invalidFrontmatter = new Set([
    ...audit.frontmatter.malformed,
    ...audit.frontmatter.yamlErrors.map((item) => item.file),
    ...audit.content.controlChars,
    ...audit.safety.skippedSymlinks,
  ]);
  add('CONTINGUT.FRONTMATTER_INVALID', 'critical', 'content', invalidFrontmatter.size);
  add('CONTINGUT.ESQUEMA_DERIVA_OPERATIVA', 'warning', 'content', audit.operational.frontmatterDrift);
  add('GRAF.ENLLAC_IRRESOLT_OPERATIU', 'error', 'graph', audit.operational.graph.unresolvedOccurrences);
  add('GRAF.ENLLAC_AMBIGU_OPERATIU', 'error', 'graph', audit.operational.graph.ambiguousOccurrences);
  add('GRAF.ORFE_OPERATIU', 'error', 'graph', audit.operational.graph.orphans);
  add('GRAF.ORFE_CICLE', 'info', 'graph', audit.graph.orphans - audit.operational.graph.orphans);
  const obsidianDrift = audit.obsidian.present
    ? Number(audit.obsidian.showOrphans !== false)
      + Number(audit.obsidian.hideUnresolved !== true)
      + Number(audit.obsidian.showAttachments !== false)
      + Number(audit.obsidian.colorGroups < 4)
    : 1;
  add('GRAF.VISTA_OBSIDIAN_DIVERGENT', 'warning', 'graph', obsidianDrift);

  const missingOperational = attachments.missing.filter((item) => item.zone === 'operatiu').length;
  add('ADJUNT.ABSENT_OPERATIU', 'error', 'attachments', missingOperational);
  add('ADJUNT.ABSENT_CICLE', 'warning', 'attachments', attachments.missing.length - missingOperational);
  add('ADJUNT.AMBIGU', 'error', 'attachments', attachments.ambiguous.length);
  add('ADJUNT.ORFE', 'warning', 'attachments', attachments.orphans.length);
  add('ADJUNT.BROSSA_SISTEMA', 'warning', 'attachments', attachments.debris.length);
  add('ADJUNT.SYMLINK_OMES', 'critical', 'attachments', attachments.skippedSymlinks.length);

  add('LAYOUT.CRITIC_ABSENT', 'critical', 'layout', layout.missing.length);
  add('LAYOUT.CRITIC_INSEGUR', 'critical', 'layout', layout.unsafe.length);
  add('LAYOUT.CRITIC_NO_VERSIONAT', 'warning', 'layout', layout.untracked.length);
  add('LAYOUT.OBSOLET_VERSIONAT', 'error', 'layout', layout.obsoleteTracked.length);
  add('LAYOUT.REFERENCIA_LEGACY', 'warning', 'layout', layout.legacyLiteralFiles.length);
  add('PRIVAT.ESTAT_VERSIONAT', 'critical', 'privacy', privacy.affectedPaths);
  return findings.sort((a, b) => SEVERITY_ORDER.get(a.severity) - SEVERITY_ORDER.get(b.severity)
    || a.code.localeCompare(b.code, 'ca'));
}

function severityCounts(findings) {
  const counts = { critical: 0, error: 0, warning: 0, info: 0 };
  for (const item of findings) counts[item.severity] += item.count;
  return counts;
}

export async function auditSistemaNervios({
  projectRoot = PROJECT_DIR,
  wikiDir = WIKI_DIR,
  trackedPaths,
  expectedPaths = EXPECTED_TOOLING_PATHS,
} = {}) {
  const tracked = trackedPaths
    ? stableSort([...new Set(trackedPaths.map(posix))])
    : await trackedPathsFromGit(projectRoot);
  const [audit, attachments, layout] = await Promise.all([
    auditWiki(wikiDir),
    auditAttachments(wikiDir),
    auditToolingLayout({ projectRoot, trackedPaths: tracked, expectedPaths }),
  ]);
  const privacy = auditTrackedPrivateState(tracked);
  const repairPlan = buildRepairPlan(audit, attachments);
  const findings = buildFindings(audit, attachments, layout, privacy);
  const counts = severityCounts(findings);
  const status = counts.critical > 0 ? 'critic'
    : counts.error > 0 ? 'degradat'
      : counts.warning > 0 ? 'vigilancia' : 'saludable';
  const snapshotSha256 = sha256(JSON.stringify(stable({
    wiki: audit.snapshot.treeSha256,
    attachments: attachments.orphans.map((item) => [item.file, item.bytes]),
    tracked,
  })));
  const report = {
    schema: 'socdepoble.sistema-nervios.v1',
    complete: true,
    ok: counts.critical === 0 && counts.error === 0,
    status,
    snapshotSha256,
    counts,
    domains: {
      content: {
        health: audit.health,
        operationalHealth: audit.operational.health,
        documents: audit.snapshot.files,
        operationalDocuments: audit.operational.documents,
        frontmatterDrift: audit.operational.frontmatterDrift,
      },
      graph: {
        unresolvedOccurrences: audit.operational.graph.unresolvedOccurrences,
        unresolvedTargets: repairPlan.unresolvedTargets.length,
        ambiguousOccurrences: audit.operational.graph.ambiguousOccurrences,
        operationalOrphans: audit.operational.graph.orphans,
        lifecycleOrphans: audit.graph.orphans - audit.operational.graph.orphans,
        obsidian: audit.obsidian,
      },
      attachments,
      layout,
      privacy,
    },
    findings,
    repairPlan,
    recommendations: [
      'Revisar i aprovar el pla abans de qualsevol mutació.',
      'No crear nodes buits ni esborrar referències per silenciar el graf.',
      'Retirar estat privat de Git exigix sanejament d’historial i, si correspon, revocació o rotació.',
      'Executar este control one-shot en precommit o CI; no mantindre un daemon amb escriptura autònoma.',
    ],
  };
  return report;
}

export const DEFAULT_EXPECTED_TOOLING_PATHS = Object.freeze([...EXPECTED_TOOLING_PATHS]);
