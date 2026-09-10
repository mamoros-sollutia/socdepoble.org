import fs from 'fs';
import path from 'path';

function scanDirectory(directory) {
  const items = fs.readdirSync(directory);
  
  for (const item of items) {
    const fullPath = path.join(directory, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      scanDirectory(fullPath);
    } else if (stat.isFile() && fullPath.endsWith('.jsx')) {
      let code = fs.readFileSync(fullPath, 'utf8');
      if (code.includes('UniversalComponents')) {
        const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]*)UniversalComponents(?:.jsx)?['"];/g;
        
        code = code.replace(importRegex, (match, importsStr, basePath) => {
          const imports = importsStr.split(',').map(i => i.trim()).filter(i => i);
          const pageImports = [];
          const elementImports = [];
          
          for (const imp of imports) {
            if (imp === 'UniversalPage') {
              pageImports.push(imp);
            } else {
              elementImports.push(imp);
            }
          }
          
          let result = '';
          if (pageImports.length > 0) {
            result += `import { ${pageImports.join(', ')} } from '${basePath}UniversalPage';\n`;
          }
          if (elementImports.length > 0) {
            result += `import { ${elementImports.join(', ')} } from '${basePath}UniversalElements';\n`;
          }
          
          return result.trim();
        });
        
        fs.writeFileSync(fullPath, code);
        console.log(`Refactoritzat: ${fullPath}`);
      }
    }
  }
}

scanDirectory(path.resolve(process.cwd(), 'src'));
console.log('Totes les importacions refactoritzades!');
