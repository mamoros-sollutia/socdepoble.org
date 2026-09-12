import fs from 'fs';

const filePath = 'src/css/index.css';
let content = fs.readFileSync(filePath, 'utf8');

const emptyRuleRegex = /([^{}]+)\{\s*\}/g;
let match;
let count = 0;
while ((match = emptyRuleRegex.exec(content)) !== null) {
  count++;
}

console.log(`Found ${count} empty rules.`);

const newContent = content.replace(/([^{}]+)\{\s*\}/g, '');
fs.writeFileSync(filePath, newContent);
console.log('Removed empty rules.');
