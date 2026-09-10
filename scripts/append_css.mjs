import fs from 'fs';
import path from 'path';

const cssContent = `

/* =========================================================================
   Salfumà Phase 3 - Semantic Classes replacing inline styles
========================================================================= */

/* RealitatSection.jsx */
.realitat-container { padding: 0 var(--sdp-space-4); }
.realitat-btn { text-align: left; width: 100%; cursor: pointer; }
.realitat-agent-label { display: flex; align-items: center; gap: var(--sdp-space-4); cursor: pointer; }
.realitat-agent-checkbox { width: 20px; height: 20px; accent-color: var(--sdp-accent); }
.realitat-agent-avatar { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; }
.realitat-agent-name { color: var(--sdp-text-fort); }
.realitat-agent-role { color: var(--sdp-text-suau); font-size: var(--sdp-text-sm); }

/* SearchSection.jsx */
.search-wrapper { margin: var(--sdp-space-8) 0; padding: 0 var(--sdp-space-5); }
.search-results { display: flex; flex-direction: column; gap: var(--sdp-space-6); padding: 0 var(--sdp-space-4); padding-bottom: var(--sdp-space-12); }
.search-empty { text-align: center; padding: var(--sdp-space-8); }

/* TranslationsSection.jsx */
.trans-container { max-width: 800px; margin: 0 auto; padding: 1rem; }
.trans-header { text-align: left; display: flex; justify-content: space-between; align-items: center; }
.trans-body { padding: 0; }
.trans-divider { border-top: 2px dashed var(--sdp-bg-alt); margin: 3rem 0; }
.trans-icon-wrap { display: inline-flex; vertical-align: middle; width: 20px; height: 20px; padding: 2px; background: var(--sdp-bg-alt); border-radius: 4px; }

/* XatControlSection.jsx */
.xatctrl-container { padding: var(--sdp-space-6) var(--sdp-space-4); }

/* XatSection.jsx */
.xat-avatar-wrap { display: flex; align-items: center; justify-content: center; }
.xat-scroll-area { display: flex; flex-direction: column; height: 100%; width: 100%; overflow-y: auto; overflow-x: hidden; }
.xat-header-info { flex: 1; }
.xat-header-subtitle { opacity: 0.8; display: block; }
.xat-divider { margin: 4px 0; border: none; border-top: 1px solid var(--sdp-vora-control); }
.xat-empty { text-align: center; margin: auto; padding: 16px; border-radius: 8px; }
.xat-bubble-wrapper { display: flex; align-items: center; }
.xat-bubble-wrapper--block { display: block; align-items: initial; }
.xat-bubble-content { flex: 1; min-width: 0; }
.xat-sender-name { margin-bottom: 2px; }

`;

const cssPath = path.resolve(process.cwd(), 'src/css/index.css');
fs.appendFileSync(cssPath, cssContent);
console.log('CSS appending done!');
