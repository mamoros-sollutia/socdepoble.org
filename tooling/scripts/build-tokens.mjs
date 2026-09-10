import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

async function buildTokens() {
  const jsonPath = join(process.cwd(), 'src/config/design-tokens.json');
  const cssPath = join(process.cwd(), 'src/css/design-tokens.css');
  
  const content = await readFile(jsonPath, 'utf8');
  const tokens = JSON.parse(content);

  let cssOutput = `/* AUTO-GENERATED FROM design-tokens.json */\n:root, :host, .sdp-root {\n`;

  // Color
  cssOutput += `  /* Color */\n`;
  for (const obj of Object.values(tokens.color || {})) {
    cssOutput += `  ${obj.css_var}: ${obj.value};\n`;
  }
  
  // Radi
  cssOutput += `\n  /* Radi */\n`;
  for (const obj of Object.values(tokens.radi || {})) {
    const val = obj.value_rem ? obj.value_rem : `${obj.value_px}px`;
    cssOutput += `  ${obj.css_var}: ${val};\n`;
  }

  // Tacte
  cssOutput += `\n  /* Tacte */\n`;
  for (const obj of Object.values(tokens.tacte || {})) {
    const val = obj.value_rem ? obj.value_rem : `${obj.value_px}px`;
    cssOutput += `  ${obj.css_var}: ${val};\n`;
  }

  // Tipografia
  cssOutput += `\n  /* Tipografia */\n`;
  for (const obj of Object.values(tokens.tipografia || {})) {
    const val = obj.value_rem ? obj.value_rem : `${obj.value_px}px`;
    cssOutput += `  ${obj.css_var}: ${val};\n`;
  }

  cssOutput += `}\n`;

  await writeFile(cssPath, cssOutput, 'utf8');
  console.log(`✅ [build-tokens] Generat ${cssPath} amb èxit.`);
}

buildTokens().catch((error) => {
  console.error('❌ [build-tokens] Error:', error);
  process.exit(1);
});
