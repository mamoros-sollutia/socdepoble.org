#!/usr/bin/env node
/**
 * autoneteja_wiki.mjs — Facade de delegació
 * Auditoria i migració reversible de la Wiki.
 * Delegat completament al motor core/ per evitar Mente Colmena.
 */
import { pathToFileURL } from 'node:url';
import path from 'node:path';

// Reexporta l'API pública per a qui l'utilitze
export { auditWiki, applyAuditPlan, restoreRun, DEFAULT_WIKI_DIR } from './core/autoneteja_audit.mjs';
export { liveMarkdown, extractLinks } from './core/parse.mjs';

// Execució per defecte de la CLI si es crida directament
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  import('./sdp-cli.mjs')
    .then(({ main }) => main())
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
