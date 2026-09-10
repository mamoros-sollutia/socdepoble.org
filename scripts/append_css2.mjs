import fs from 'fs';
import path from 'path';

const cssContent = `
/* OnboardingSteps.jsx */
.onb-avatar-actions { display: flex; gap: 0.5rem; justify-content: center; }
.onb-center-text { text-align: center; margin-top: 1rem; }
.onb-org-list { list-style: none; padding: 0; margin: 1.5rem 0; }
.onb-org-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-bottom: 1px solid var(--sdp-vora); }
.onb-block { display: block; }
.onb-full-width-btn { width: 100%; margin-top: 1rem; }

/* DetallAjust.jsx */
.ajust-center-text { text-align: center; margin-top: 2rem; }
.ajust-flex-col { display: flex; flex-direction: column; gap: 1rem; }
.ajust-avatar { width: 128px; height: 128px; object-fit: cover; border-radius: 50%; border: 2px solid var(--sdp-vora-control); }
.ajust-btn-group { margin-top: 1.5rem; display: flex; gap: 1rem; }

/* LlistaAjustos.jsx / SelectorIdentitat.jsx */
.no-padding { padding: 0; }
.ident-flex-row { display: flex; align-items: center; gap: 0.75rem; }
.ident-avatar { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; }
.ident-flex-col { display: flex; flex-direction: column; align-items: flex-start; }
`;

const cssPath = path.resolve(process.cwd(), 'src/css/index.css');
fs.appendFileSync(cssPath, cssContent);
console.log('CSS appending done!');
