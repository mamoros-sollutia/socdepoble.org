import fs from 'fs';

let f, code;

// OnboardingSection.jsx
f = 'src/sections/onboarding/OnboardingSection.jsx';
code = fs.readFileSync(f, 'utf8');
code = code.replace(/style=\{\{ marginBottom: '1\.5rem', textAlign: 'center', padding: '1\.5rem' \}\}/g, 'className="onb-section-intro"');
code = code.replace(/style=\{\{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '1\.5rem' \}\}/g, 'className="onb-flex-center-mt"');
code = code.replace(/style=\{\{ textAlign: 'center', marginBottom: '1\.5rem', opacity: 0\.6, fontWeight: 600, fontSize: '0\.9rem', textTransform: 'uppercase', letterSpacing: '0\.5px' \}\}/g, 'className="onb-section-header"');
fs.writeFileSync(f, code);

// OnboardingSteps.jsx
f = 'src/sections/onboarding/OnboardingSteps.jsx';
code = fs.readFileSync(f, 'utf8');
code = code.replace(/style=\{\{ textAlign: 'center' \}\}/g, 'className="onb-center-text"');
code = code.replace(/style=\{\{ textAlign: 'center', marginTop: '1rem' \}\}/g, 'className="onb-center-text-mt"');
code = code.replace(/style=\{\{ width: '2rem', height: '2rem', flexShrink: 0, cursor: 'pointer' \}\}/g, 'className="onb-icon-action"');
code = code.replace(/style=\{\{ marginTop: '0\.5rem', display: 'block' \}\}/g, 'className="onb-block-mt"');
fs.writeFileSync(f, code);

console.log('Fixed inline styles 3');
