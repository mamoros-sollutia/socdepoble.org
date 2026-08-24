import fs from 'fs';
const file = 'demo_pedra_seca.html';
let content = fs.readFileSync(file, 'utf8');

// Replace globally
content = content.replace(/SOSP/g, 'SDP');
content = content.replace(/sosp/g, 'sdp');

// Remove Cel SDP block
// The HTML swatch to remove:
// <div class="swatch"><div class="swatch-color" style="background:#87CEEB; color:#111;">Cel SDP</div><div class="swatch-info">#87CEEB</div></div>
// Let's use regex to be safe with spaces
content = content.replace(/<div class="swatch">\s*<div class="swatch-color" style="background:#87CEEB; color:#111;">Cel SDP<\/div>\s*<div class="swatch-info">#87CEEB<\/div>\s*<\/div>/, '');

// Also remove from the CSS variable block in section 34:
content = content.replace(/--sdp-cel: #4A90A4;\n\s*/g, '');

const gradations = `
  /* Gradacions Primàries (Taronja) */
  --sdp-primary-50: #fff7ed;
  --sdp-primary-100: #ffedd5;
  --sdp-primary-200: #fed7aa;
  --sdp-primary-300: #fdba74;
  --sdp-primary-400: #fb923c;
  --sdp-primary-500: #f97316;
  --sdp-primary-600: #ea580c;
  --sdp-primary-700: #c2410c;
  --sdp-primary-800: #9a3412;
  --sdp-primary-900: #7c2d12;

  /* Gradacions Secundàries (Blau) */
  --sdp-secondary-50: #eff6ff;
  --sdp-secondary-100: #dbeafe;
  --sdp-secondary-200: #bfdbfe;
  --sdp-secondary-300: #93c5fd;
  --sdp-secondary-400: #60a5fa;
  --sdp-secondary-500: #2563eb;
  --sdp-secondary-600: #1d4ed8;
  --sdp-secondary-700: #1e40af;
  --sdp-secondary-800: #1e3a8a;
  --sdp-secondary-900: #172554;
`;

content = content.replace('--sdp-pedra-900: #0d0d0c;', '--sdp-pedra-900: #0d0d0c;\n' + gradations);

fs.writeFileSync(file, content);
console.log('Done cleaning and adding gradations.');
