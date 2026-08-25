/**
 * context_preflight.mjs
 * 
 * Implementació del Bootloader determinista extern al model (Segons Codex Fase 1)
 */

import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

function hashContent(content) {
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

/**
 * Funció principal del Preflight.
 * Executada abans de la primera inferència.
 */
export async function preflight(taskContext) {
  const contract = parseTaskContract(taskContext);
  const explicitSources = extractExplicitSources(taskContext);
  
  const canonicalRegistry = await loadCanonicalRegistry();
  const skills = routeSkills(contract, canonicalRegistry);
  
  const globalRules = ['00_BIOS_COGNITIU.md']; 
  const dependencies = extractDependencies(skills);
  
  const mandatory = new Set([...explicitSources, ...globalRules, ...dependencies]);
  
  // Fail-closed read
  const receipts = await readFullAndHash(Array.from(mandatory));
  
  // Assert mandatory ⊆ receipts.paths
  for (const source of mandatory) {
    if (!receipts.paths.includes(source)) {
      throw new Error(`[PREFLIGHT_BLOCKED] Missing mandatory source: ${source}. The system must fail closed.`);
    }
  }

  // Retrieve evidence just-in-time
  const indexDigest = await requireFreshCorpusDigest();
  const evidence = await retrieveJIT(contract.questions, indexDigest);

  return {
    taskHash: hashContent(JSON.stringify(taskContext)),
    requiredSources: receipts.details,
    missingSources: [],
    skills: skills,
    indexDigest: indexDigest,
    omissions: [],
    ready: true
  };
}

function parseTaskContract(taskContext) {
  // Mock parser
  return { questions: [] };
}

function extractExplicitSources(taskContext) {
  // Extract user paths and attachments
  return [];
}

async function loadCanonicalRegistry() {
  // Carrega 00_INDEX_SKILLS.md
  return {};
}

function routeSkills(contract, registry) {
  // Torna llista d'identificadors
  return [];
}

function extractDependencies(skills) {
  return [];
}

async function readFullAndHash(paths) {
  const details = [];
  const validPaths = [];
  
  for (const sourcePath of paths) {
    try {
      // In a real system, resolve absolute paths correctly.
      const resolvedPath = path.resolve(process.cwd(), sourcePath);
      const content = await fs.readFile(resolvedPath, 'utf8');
      
      validPaths.push(sourcePath);
      details.push({
        id: path.basename(sourcePath, '.md'),
        canonicalPath: sourcePath,
        sha256: hashContent(content),
        bytes: Buffer.byteLength(content, 'utf8'),
        readMode: "full",
        authority: "evidence",
        reason: "mandatory-dependency"
      });
    } catch (err) {
      // Intentionally swallow to let the assert fail
      console.warn(`[WARNING] Could not read ${sourcePath}`);
    }
  }
  
  return { paths: validPaths, details };
}

async function requireFreshCorpusDigest() {
  return "fresh_sha256_placeholder";
}

async function retrieveJIT(questions, indexDigest) {
  return [];
}
