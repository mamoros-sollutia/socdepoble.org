import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { parseFrontmatter } from '../lib/frontmatter.mjs';

async function walk(dir, acc = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    if ((e.name.startsWith('.') && e.name !== '.agents') || e.name === 'node_modules') continue;
    if (e.name === 'vendor' || e.name === 'mirrors' || e.name.startsWith('90_') || e.name.toLowerCase().includes('petorreta')) continue;

    const full = join(dir, e.name);
    if (e.isDirectory()) {
      if (full.includes('bot/var') || full.includes('05_Escriptori') || full.includes('04_ARXIU')) continue;
      await walk(full, acc);
    } else if (e.name.endsWith('.md')) {
      acc.push(full);
    }
  }
  return acc;
}

export async function buildSlugIndex(root, options = {}) {
  const files = options.files || (await walk(root));
  const slugIndex = [];

  let malformedCount = 0;
  for (const file of files) {
    const raw = await readFile(file, 'utf8');
    const parsed = parseFrontmatter(raw);
    if (parsed.malformed || parsed.errors.length) {
      console.warn(`[WARN] Frontmatter trencat o parsat amb errors a ${file}`);
      malformedCount++;
      continue;
    }
    
    // Extreiem metadata d'interès per l'índex semàntic
    const meta = parsed.meta || {};
    const title = meta.title || meta.name || file.split('/').pop().replace('.md', '');
    const slug = meta.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = meta.id || slug;
    
    slugIndex.push({
      id: id,
      slug: slug,
      type: meta.type || meta.tipus || 'wiki',
      title: title,
      path: relative(root, file)
    });
  }

  return { docs: slugIndex, malformedCount };
}

export async function run(options = {}) {
  const root = options.root || '.';
  console.log('Construint índex semàntic (slugIndex.json)...');
  
  const index = await buildSlugIndex(root, options);
  
  if (index.malformedCount > 0) {
    console.error(`[FATAL] S'han detectat ${index.malformedCount} fitxers amb frontmatter trencat. Corregiu-los.`);
    process.exit(1);
  }
  
  const outFile = join(root, 'public', 'slugIndex.json');
  await writeFile(outFile, JSON.stringify(index.docs), 'utf8');
  console.log(`Índex semàntic construït amb ${index.docs.length} rutes a ${outFile}`);
  return { ok: true, summary: `Índex semàntic construït.`, data: {} };
}

import { fileURLToPath } from 'node:url';

// Si s'executa com a script principal
if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) {
  run().catch(console.error);
}
