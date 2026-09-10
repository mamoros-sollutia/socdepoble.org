import fs from 'fs';

let css = `
/* Noves classes per a batch 6 */
.sdp-flex-col-h100 { display: flex; flex-direction: column; height: 100%; }
.ue-inline-block-mw10 { display: inline-block; min-width: 10px; }
.ue-block-mw10 { display: block; min-width: 10px; }
.ue-cal-badge-wrap { position: relative; z-index: 20; cursor: pointer; border: 1px solid var(--sdp-accent-subtil); padding: 0; }
.ue-flex-col-center { display: flex; flex-direction: column; align-items: center; }
.ue-accordion-header-btn { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 16px; cursor: pointer; }
.ue-accordion-body-pd { padding: 0 16px 16px 16px; }
.app-avatar-img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
.app-error-p2 { padding: 2rem; color: red; }
.app-route-error-wrap { padding: 2rem; text-align: center; background: var(--sdp-bg-alt); }
.app-text-danger { color: var(--sdp-danger); }
.app-btn-retry { padding: 0.5rem 1rem; margin-top: 1rem; cursor: pointer; }
.ob-mb-15 { margin-bottom: 1.5rem; }
.ob-mt-15-op8 { margin-top: 1.5rem; opacity: 0.8; }
`;

fs.appendFileSync('src/css/index.css', css);
console.log('CSS appended for batch 6');
