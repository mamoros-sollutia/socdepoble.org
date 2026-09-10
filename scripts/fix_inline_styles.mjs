import fs from 'fs';

let f;

// OnboardingSteps.jsx
f = 'src/sections/onboarding/OnboardingSteps.jsx';
let code = fs.readFileSync(f, 'utf8');
code = code.replace(/<div style=\{\{ display: 'flex', gap: '0.5rem', justifyContent: 'center' \}\}>/g, '<div className="onb-avatar-actions">');
fs.writeFileSync(f, code);

// DetallAjust.jsx
f = 'src/sections/profile/DetallAjust.jsx';
code = fs.readFileSync(f, 'utf8');
code = code.replace(/style=\{\{ textAlign: 'center', marginTop: '2rem' \}\}/g, 'className="ajust-center-text"');
code = code.replace(/style=\{\{ display: 'flex', flexDirection: 'column', gap: '1rem' \}\}/g, 'className="ajust-flex-col"');
code = code.replace(/style=\{\{ width: '128px', height: '128px', objectFit: 'cover', borderRadius: '50%', border: '2px solid var\(--sdp-vora-control\)' \}\}/g, 'className="ajust-avatar"');
code = code.replace(/style=\{\{ marginTop: '1.5rem', display: 'flex', gap: '1rem' \}\}/g, 'className="ajust-btn-group"');
fs.writeFileSync(f, code);

// LlistaAjustos.jsx
f = 'src/sections/profile/LlistaAjustos.jsx';
code = fs.readFileSync(f, 'utf8');
code = code.replace(/style=\{\{ padding: 0 \}\}/g, 'className="no-padding"');
fs.writeFileSync(f, code);

// SelectorIdentitat.jsx
f = 'src/sections/profile/SelectorIdentitat.jsx';
code = fs.readFileSync(f, 'utf8');
code = code.replace(/style=\{\{ padding: 0 \}\}/g, 'className="no-padding"');
code = code.replace(/style=\{\{ display: 'flex', alignItems: 'center', gap: '0.75rem' \}\}/g, 'className="ident-flex-row"');
code = code.replace(/style=\{\{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' \}\}/g, 'className="ident-avatar"');
code = code.replace(/style=\{\{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' \}\}/g, 'className="ident-flex-col"');
fs.writeFileSync(f, code);

console.log('Inline styles fixed!');
