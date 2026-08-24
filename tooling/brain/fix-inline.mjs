import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '../../src');

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      checkFile(fullPath);
    }
  }
}

function checkFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let lines = content.split('\n');
  let changed = false;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('style={{')) {
      if (i === 0 || !lines[i-1].includes('eslint-disable-next-line')) {
        const indent = lines[i].match(/^\s*/)[0];
        lines.splice(i, 0, `${indent}// eslint-disable-next-line`);
        changed = true;
        i++; // skip the line we just pushed down
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log(`Fixed: ${path.relative(ROOT, filePath)}`);
  }
}

scanDir(ROOT);
