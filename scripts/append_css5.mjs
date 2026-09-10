import fs from 'fs';

let css = `
/* Noves classes per a ControlSection */
.ctl-main-container {
  padding: var(--sdp-space-8) var(--sdp-space-4);
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--sdp-space-12);
}
.ctl-secondary-tools {
  display: flex;
  flex-direction: column;
  gap: var(--sdp-space-4);
  max-width: 400px;
  margin: 0 auto;
}
`;

fs.appendFileSync('src/css/index.css', css);
console.log('CSS appended for ControlSection');
