import fs from 'fs';

let f, code;

// SectionItemCard.jsx
f = 'src/components/SectionItemCard.jsx';
code = fs.readFileSync(f, 'utf8');
code = code.replace(/style=\{\{ display: 'flex', flexDirection: 'column', height: '100%' \}\}/g, 'className="sdp-flex-col-h100"');
fs.writeFileSync(f, code);

// UniversalEditorShell.jsx
f = 'src/components/universal/UniversalEditorShell.jsx';
code = fs.readFileSync(f, 'utf8');
code = code.replace(/style=\{\{display: 'none'\}\}/g, 'className="sdp-ocult"'); // display: 'none' with no spaces
code = code.replace(/style=\{\{ display: 'inline-block', minWidth: '10px' \}\}/g, 'className="ue-inline-block-mw10"');
code = code.replace(/style=\{\{ display: 'block', minWidth: '10px' \}\}/g, 'className="ue-block-mw10"');
fs.writeFileSync(f, code);

// UniversalElements.jsx
f = 'src/components/universal/UniversalElements.jsx';
code = fs.readFileSync(f, 'utf8');
code = code.replace(/style=\{\{ position: 'relative', zIndex: 20, cursor: 'pointer', border: '1px solid var\(--sdp-accent-subtil\)', padding: 0 \}\}/g, 'className="ue-cal-badge-wrap"');
code = code.replace(/style=\{\{ display: 'flex', flexDirection: 'column', alignItems: 'center' \}\}/g, 'className="ue-flex-col-center"');
code = code.replace(/style=\{\{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', cursor: 'pointer' \}\}/g, 'className="ue-accordion-header-btn"');
code = code.replace(/style=\{\{ padding: '0 16px 16px 16px' \}\}/g, 'className="ue-accordion-body-pd"');
fs.writeFileSync(f, code);

// For App.jsx and OnboardingSection.jsx which I saw in the grep
f = 'src/app/App.jsx';
code = fs.readFileSync(f, 'utf8');
code = code.replace(/style=\{\{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' \}\}/g, 'className="app-avatar-img"');
code = code.replace(/style=\{\{ padding: '2rem', color: 'red' \}\}/g, 'className="app-error-p2"');
code = code.replace(/style=\{\{ padding: '2rem', textAlign: 'center', background: 'var\(--sdp-bg-alt\)' \}\}/g, 'className="app-route-error-wrap"');
code = code.replace(/style=\{\{ color: 'var\(--sdp-danger\)' \}\}/g, 'className="app-text-danger"');
code = code.replace(/style=\{\{ padding: '0\.5rem 1rem', marginTop: '1rem', cursor: 'pointer' \}\}/g, 'className="app-btn-retry"');
fs.writeFileSync(f, code);

// For OnboardingSteps.jsx
f = 'src/sections/onboarding/OnboardingSteps.jsx';
code = fs.readFileSync(f, 'utf8');
code = code.replace(/style=\{\{ marginBottom: '1\.5rem' \}\}/g, 'className="ob-mb-15"');
fs.writeFileSync(f, code);

// For OnboardingSection.jsx
f = 'src/sections/onboarding/OnboardingSection.jsx';
code = fs.readFileSync(f, 'utf8');
code = code.replace(/style=\{\{ marginTop: '1\.5rem', opacity: 0\.8 \}\}/g, 'className="ob-mt-15-op8"');
fs.writeFileSync(f, code);

console.log('Fixed inline styles 6');
