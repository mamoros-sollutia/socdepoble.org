import fs from 'fs';

let f, code;

// UniversalEditorShell.jsx
f = 'src/components/universal/UniversalEditorShell.jsx';
code = fs.readFileSync(f, 'utf8');
code = code.replace(/style=\{\{ padding: '0 12px' \}\}/g, 'className="ue-px-12"');
code = code.replace(/style=\{\{ display: 'flex', flexDirection: 'column', gap: '8px' \}\}/g, 'className="ue-flex-col-8"');
code = code.replace(/style=\{\{ fontSize: '0\.85rem' \}\}/g, 'className="ue-text-sm"');
code = code.replace(/style=\{\{ flex: 1, height: '38px', borderRadius: '4px' \}\}/g, 'className="ue-input-field"');
code = code.replace(/style=\{\{ display: 'flex', gap: '8px' \}\}/g, 'className="ue-flex-8"');
fs.writeFileSync(f, code);

// UniversalElements.jsx
f = 'src/components/universal/UniversalElements.jsx';
code = fs.readFileSync(f, 'utf8');
code = code.replace(/style=\{\{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '150px' \}\}/g, 'className="ue-flex-col-8 ue-min-w-150"');
code = code.replace(/style=\{\{ display: 'flex', alignItems: 'center', gap: '8px' \}\}/g, 'className="ue-flex-center-8"');
code = code.replace(/style=\{\{ flex: 1, minWidth: 0, paddingRight: '16px' \}\}/g, 'className="ue-flex-1-pr-16"');
code = code.replace(/style=\{\{ flexShrink: 0 \}\}/g, 'className="ue-shrink-0"');
code = code.replace(/style=\{\{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' \}\}/g, 'className="ue-flex-center-8 ue-w-full"');
code = code.replace(/style=\{\{ display: 'flex', alignItems: 'center' \}\}/g, 'className="ue-flex-center"');
fs.writeFileSync(f, code);

// UniversalPage.jsx
f = 'src/components/universal/UniversalPage.jsx';
code = fs.readFileSync(f, 'utf8');
code = code.replace(/style=\{\{ float: 'none', marginLeft: 16, display: 'inline-block', verticalAlign: 'middle', marginBottom: 4 \}\}/g, 'className="up-badge-inline"');
fs.writeFileSync(f, code);

// ItemDetailSection.jsx
f = 'src/sections/detail/ItemDetailSection.jsx';
code = fs.readFileSync(f, 'utf8');
code = code.replace(/style=\{\{ maxWidth: '800px', margin: '0 auto', padding: 'var\(--sdp-space-8\)' \}\}/g, 'className="id-container-p8"');
code = code.replace(/style=\{\{ maxWidth: '800px', margin: '0 auto', padding: '0 var\(--sdp-space-4\) var\(--sdp-space-8\)' \}\}/g, 'className="id-container-px4-pb8"');
fs.writeFileSync(f, code);

// DevicesSection.jsx
f = 'src/sections/dispositius/DevicesSection.jsx';
code = fs.readFileSync(f, 'utf8');
code = code.replace(/style=\{\{ display: 'flex', gap: '8px', flexWrap: 'wrap' \}\}/g, 'className="dv-flex-wrap-8"');
code = code.replace(/style=\{\{ display: 'grid', gridTemplateColumns: 'repeat\(auto-fill, minmax\(300px, 1fr\)\)', gap: '16px' \}\}/g, 'className="dv-grid-cards"');
code = code.replace(/style=\{\{ margin: 0 \}\}/g, 'className="dv-m-0"');
code = code.replace(/style=\{\{ margin: 0, marginBottom: 16 \}\}/g, 'className="dv-m-0-mb-16"');
code = code.replace(/style=\{\{ margin: '16px 0' \}\}/g, 'className="dv-my-16"');
fs.writeFileSync(f, code);

console.log('Fixed inline styles 5');
