#!/usr/bin/env node

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { PROJECT_DIR, ESCRIPTORI_DIR } from '../wiki/lib/project_paths.mjs';

const ANCORA_FILE = join(ESCRIPTORI_DIR, '.ancora_sessio.json');

try {
  const commit = execSync('git rev-parse HEAD', { cwd: PROJECT_DIR }).toString().trim();
  const branch = execSync('git branch --show-current', { cwd: PROJECT_DIR }).toString().trim();
  const data = {
    timestamp: new Date().toISOString(),
    commit,
    branch,
    message: process.argv.slice(2).join(' ') || 'Arranc de sessió'
  };

  writeFileSync(ANCORA_FILE, JSON.stringify(data, null, 2));
  console.log(`✅ Àncora de sessió creada a ${ANCORA_FILE}`);
} catch (error) {
  console.error('❌ Error creant àncora:', error.message);
  process.exit(1);
}
