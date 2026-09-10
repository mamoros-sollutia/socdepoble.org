import fs from 'fs';

let css = `
/* Noves classes per a UniversalEditorShell */
.ue-px-12 { padding: 0 12px; }
.ue-flex-col-8 { display: flex; flex-direction: column; gap: 8px; }
.ue-text-sm { font-size: 0.85rem; }
.ue-input-field { flex: 1; height: 38px; border-radius: 4px; }
.ue-flex-8 { display: flex; gap: 8px; }

/* Noves classes per a UniversalElements */
.ue-min-w-150 { min-width: 150px; }
.ue-flex-center-8 { display: flex; align-items: center; gap: 8px; }
.ue-flex-1-pr-16 { flex: 1; min-width: 0; padding-right: 16px; }
.ue-shrink-0 { flex-shrink: 0; }
.ue-w-full { width: 100%; }
.ue-flex-center { display: flex; align-items: center; }

/* Noves classes per a UniversalPage */
.up-badge-inline { float: none; margin-left: 16px; display: inline-block; vertical-align: middle; margin-bottom: 4px; }

/* Noves classes per a ItemDetailSection */
.id-container-p8 { max-width: 800px; margin: 0 auto; padding: var(--sdp-space-8); }
.id-container-px4-pb8 { max-width: 800px; margin: 0 auto; padding: 0 var(--sdp-space-4) var(--sdp-space-8); }

/* Noves classes per a DevicesSection */
.dv-flex-wrap-8 { display: flex; gap: 8px; flex-wrap: wrap; }
.dv-grid-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
.dv-m-0 { margin: 0; }
.dv-m-0-mb-16 { margin: 0; margin-bottom: 16px; }
.dv-my-16 { margin: 16px 0; }
`;

fs.appendFileSync('src/css/index.css', css);
console.log('CSS appended for batch 5');
