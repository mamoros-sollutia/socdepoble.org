import fs from 'node:fs';

function fixFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('const _metaUrl')) {
    content = content.replace(/const _metaUrl = [^\n]+\n/, `const _metaUrl = import.meta.url.startsWith('file:') ? import.meta.url : 'file://' + import.meta.url;\n`);
    fs.writeFileSync(filePath, content);
  } else if (content.includes('import.meta.url')) {
    content = content.replace(/(import[^;]+;(\r?\n)*)/, `$1\nconst _metaUrl = import.meta.url.startsWith('file:') ? import.meta.url : 'file://' + import.meta.url;\n`);
    content = content.replace(/import\.meta\.url(?!\.)/g, '_metaUrl');
    fs.writeFileSync(filePath, content);
  }
}

fixFile('tooling/wiki/core/parse.mjs');
fixFile('tooling/wiki/tests/frontmatter_autoneteja.test.mjs');
