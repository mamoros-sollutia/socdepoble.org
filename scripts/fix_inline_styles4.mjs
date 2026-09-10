import fs from 'fs';

let f, code;

// DesignSectionContent.jsx
f = 'src/sections/disseny/DesignSectionContent.jsx';
code = fs.readFileSync(f, 'utf8');
code = code.replace(/style=\{\{ whiteSpace: 'pre-wrap' \}\}/g, 'className="dsg-pre-wrap"');
code = code.replace(/style=\{\{ maxWidth: '600px', margin: '0 auto' \}\}/g, 'className="dsg-center-600"');
code = code.replace(/style=\{\{ display: 'flex', gap: 'var\(--sdp-space-3\)', maxWidth: '85%' \}\}/g, 'className="dsg-msg-container"');
code = code.replace(/style=\{\{ display: 'flex', gap: 'var\(--sdp-space-3\)', maxWidth: '85%', alignSelf: 'flex-end', flexDirection: 'row-reverse' \}\}/g, 'className="dsg-msg-container dsg-msg-self"');
code = code.replace(/style=\{\{ flex: 1 \}\}/g, 'className="dsg-flex-1"');
code = code.replace(/style=\{\{ borderRadius: '50%', width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' \}\}/g, 'className="dsg-btn-round"');
code = code.replace(/style=\{\{ width: '1\.2em', height: '1\.2em' \}\}/g, 'className="dsg-icon-1em"');
code = code.replace(/style=\{\{ paddingLeft: '1rem' \}\}/g, 'className="dsg-pl-1"');
fs.writeFileSync(f, code);

// MultimediaSection.jsx
f = 'src/sections/multimedia/MultimediaSection.jsx';
code = fs.readFileSync(f, 'utf8');
code = code.replace(/style=\{\{  width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'\}\}/g, 'className="mm-flex-center-full"');
fs.writeFileSync(f, code);

// MurSection.jsx
f = 'src/sections/mur/MurSection.jsx';
code = fs.readFileSync(f, 'utf8');
code = code.replace(/style=\{\{ padding: '0 16px' \}\}/g, 'className="mur-px-16"');
fs.writeFileSync(f, code);

// Aplec2023Article.jsx
f = 'src/sections/mur/articles/Aplec2023Article.jsx';
code = fs.readFileSync(f, 'utf8');
code = code.replace(/style=\{\{ marginBottom: 'var\(--sdp-space-6\)', borderRadius: 'var\(--sdp-radi-xl\)', overflow: 'hidden' \}\}/g, 'className="apl-img-mb"');
code = code.replace(/style=\{\{    marginBottom: 'var\(--sdp-space-4\)', marginTop: 'var\(--sdp-space-8\)'  \}\}/g, 'className="apl-title-spacing"');
code = code.replace(/style=\{\{ listStyleType: 'disc', paddingLeft: 'var\(--sdp-space-6\)', marginBottom: 'var\(--sdp-space-6\)', gap: 'var\(--sdp-space-2\)', display: 'flex', flexDirection: 'column' \}\}/g, 'className="apl-list"');
code = code.replace(/style=\{\{ textDecoration: 'underline' \}\}/g, 'className="apl-underline"');
code = code.replace(/style=\{\{ marginTop: 'var\(--sdp-space-6\)', borderRadius: 'var\(--sdp-radi-xl\)', overflow: 'hidden' \}\}/g, 'className="apl-img-mt"');
fs.writeFileSync(f, code);

// NotesSidebar.jsx
f = 'src/sections/notes/NotesSidebar.jsx';
code = fs.readFileSync(f, 'utf8');
code = code.replace(/style=\{\{ padding: 0 \}\}/g, 'className="no-padding"');
fs.writeFileSync(f, code);

console.log('Fixed inline styles 4');
