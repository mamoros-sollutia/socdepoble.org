import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, '..', 'src');
const routerContextPath = path.join(srcDir, 'app', 'contexts', 'RouterContext.jsx');

function fixImports(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixImports(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes("from 'react-router-dom'")) {
        let relativePath = path.relative(path.dirname(fullPath), routerContextPath);
        if (!relativePath.startsWith('.')) {
          relativePath = './' + relativePath;
        }
        // Remove .jsx extension for standard import
        relativePath = relativePath.replace(/\.jsx$/, '');
        
        content = content.replace(/from 'react-router-dom'/g, `from '${relativePath}'`);
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

fixImports(srcDir);
