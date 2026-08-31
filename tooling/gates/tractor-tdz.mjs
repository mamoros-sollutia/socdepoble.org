#!/usr/bin/env node
/**
 * tractor-tdz.mjs — Llei de la Zona Morta Temporal.
 *
 * Detecta l'ús d'un binding `const`/`let`/`class` d'àmbit de mòdul en una
 * inicialitzadora que s'avalua ABANS de la seua declaració. Això no és un avís
 * d'estil: llança ReferenceError en carregar el mòdul i tomba l'aplicació
 * sencera. ESLint recommended no ho detecta (no-use-before-define no hi és).
 *
 * Ús: node tractor-tdz.mjs [arrel]
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from '@babel/parser';

const ARREL = process.argv[2] || 'src';
const EXT = new Set(['.js', '.jsx', '.mjs', '.cjs']);

function fitxers(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.git') continue;
      fitxers(p, acc);
    } else if (EXT.has(path.extname(e.name))) acc.push(p);
  }
  return acc;
}

const errors = [];

for (const f of fitxers(ARREL)) {
  const codi = fs.readFileSync(f, 'utf8');
  let ast;
  try {
    ast = parse(codi, {
      sourceType: 'module',
      plugins: ['jsx', 'classProperties', 'topLevelAwait', 'importAttributes'],
      errorRecovery: false,
    });
  } catch (e) {
    errors.push({ f, tipus: 'SINTAXI', msg: e.message, linia: e.loc?.line ?? 0 });
    continue;
  }

  // 1. Recollir bindings lèxics d'àmbit de mòdul amb la seua línia.
  const lexics = new Map(); // nom -> linia de declaració
  const recull = (node) => {
    if (!node) return;
    if (node.type === 'VariableDeclaration' && node.kind !== 'var') {
      for (const d of node.declarations) {
        if (d.id.type === 'Identifier') lexics.set(d.id.name, d.id.loc.start.line);
      }
    }
    if (node.type === 'ClassDeclaration' && node.id) lexics.set(node.id.name, node.id.loc.start.line);
  };
  for (const s of ast.program.body) {
    recull(s);
    if (s.type === 'ExportNamedDeclaration') recull(s.declaration);
    if (s.type === 'ExportDefaultDeclaration') recull(s.declaration);
  }

  // 2. Buscar identificadors usats dins d'inicialitzadores de nivell superior
  //    que s'avaluen immediatament (crides, no cossos de funció).
  const visita = (node, liniaSentencia, dinsFuncio) => {
    if (!node || typeof node !== 'object') return;
    const t = node.type;
    if (t === 'FunctionDeclaration' || t === 'FunctionExpression' ||
        t === 'ArrowFunctionExpression' || t === 'ClassMethod' || t === 'ObjectMethod') {
      dinsFuncio = true; // el cos s'avalua més tard: no és TDZ
    }
    if (!dinsFuncio && t === 'Identifier') {
      const dec = lexics.get(node.name);
      if (dec !== undefined && node.loc.start.line < dec) {
        errors.push({
          f, tipus: 'TDZ', linia: node.loc.start.line,
          msg: `'${node.name}' s'usa a la línia ${node.loc.start.line} però es declara (const/let/class) a la ${dec}. ReferenceError en avaluar el mòdul.`,
        });
      }
    }
    for (const k of Object.keys(node)) {
      if (k === 'loc' || k === 'type') continue;
      // `obj.zstdCompress` NO és una referència al binding `zstdCompress`.
      // Igual per a { clau: valor } i etiquetes de JSX.
      if (k === 'property' && !node.computed) continue;
      if (k === 'key' && !node.computed) continue;
      if (t === 'JSXAttribute' && k === 'name') continue;
      if (t === 'ImportSpecifier' || t === 'ExportSpecifier') continue;
      const v = node[k];
      if (Array.isArray(v)) v.forEach((c) => visita(c, liniaSentencia, dinsFuncio));
      else if (v && typeof v.type === 'string') visita(v, liniaSentencia, dinsFuncio);
    }
  };

  for (const s of ast.program.body) {
    const n = s.type.startsWith('Export') && s.declaration ? s.declaration : s;
    if (n.type === 'VariableDeclaration') {
      for (const d of n.declarations) if (d.init) visita(d.init, d.loc.start.line, false);
    } else if (n.type === 'ExpressionStatement') {
      visita(n.expression, n.loc.start.line, false);
    }
  }
}

const vistos = new Set();
const unics = errors.filter((e) => {
  const k = `${e.f}:${e.linia}:${e.msg}`;
  if (vistos.has(k)) return false;
  vistos.add(k);
  return true;
});

if (unics.length === 0) {
  console.log(`✅ TDZ: cap ús abans de declaració a ${ARREL}/`);
  process.exit(0);
}
console.log(`❌ TDZ: ${unics.length} problema(es)\n`);
for (const e of unics) console.log(`  [${e.tipus}] ${e.f}:${e.linia}\n      ${e.msg}`);
process.exit(1);
