#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const agentsDir = path.resolve(process.cwd(), '.agents/skills');
const sealFile = path.resolve(process.cwd(), '.agents/SKILLS_SEAL.json');

function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const files = getAllFiles(agentsDir).sort();
let combinedHash = crypto.createHash('sha256');

for (const file of files) {
  const content = fs.readFileSync(file);
  combinedHash.update(file);
  combinedHash.update(content);
}

const finalHash = combinedHash.digest('hex');

const seal = {
  timestamp: new Date().toISOString(),
  hash: finalHash,
  filesCount: files.length
};

fs.writeFileSync(sealFile, JSON.stringify(seal, null, 2));
console.log(`✅ [Llei Z] Skills cryptosegellats. Hash: ${finalHash.substring(0, 8)}...`);
process.exit(0);
