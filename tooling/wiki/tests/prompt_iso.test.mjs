import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { loadIsoContext, buildIsoPrompt, validateIsoPrompt, ISO_SOURCES } from '../lib/prompt_iso.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const fields = { title:'Auditoria de notes', description:'Revisa la maquetació del bloc de notes', objective:'Reparar el bloc de notes', context:'Codi vigent i Wiki llegits; integració online amb Sollutia.', instruction:'Localitza les causes i verifica les correccions', output:'markdown' };
const context = loadIsoContext(root);
const prompt = buildIsoPrompt(context, fields);
test('genera un prompt complet des de la plantilla, sense placeholders ni blocs condicionals', () => {
  assert.deepEqual(validateIsoPrompt(context, prompt), []);
  assert.match(prompt, /## Font de Logos/);
  assert.match(prompt, /tipus: petorreta/);
  assert.doesNotMatch(prompt, /\[IF:|## Frontmatter Obligatori|## Sinapsis Entrants/);
});
test('rebutja eliminar cada secció i els tres marcadors executius', () => {
  for (const section of context.templateSections) assert.ok(validateIsoPrompt(context, prompt.replace(`## ${section.heading}`, `**${section.heading}**`)).length, section.heading);
  for (const key of ['OBJECTIU','EXECUTA','FORMAT']) assert.ok(validateIsoPrompt(context, prompt.replace(key, 'OMES')).length, key);
});
test('rebutja identitat alterada, canvi d’ordre i seccions fingides dins de codi', () => {
  assert.ok(validateIsoPrompt(context, prompt.replace('30 anys', '2 anys')).length);
  assert.ok(validateIsoPrompt(context, prompt.replace('## Objectiu', '## Context Necessari')).length);
  assert.ok(validateIsoPrompt(context, prompt.replace('## Font de Logos', '```markdown\n## Font de Logos\n```')).length);
});
test('rebutja rebut absent o de context anterior', () => {
  assert.ok(validateIsoPrompt(context, prompt.replace(/\n<!-- SDP-ISO-CONTEXT:[^\n]+/, '')).length);
  assert.ok(validateIsoPrompt({...context, fingerprint:{...context.fingerprint, extra:'changed'}}, prompt).length);
});
test('una font absent falla abans de generar; un canvi posterior a la lectura també', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'sdp-iso-test-'));
  try {
    assert.throws(() => loadIsoContext(tmp));
    for (const file of ISO_SOURCES) { const target=path.join(tmp,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(root,file),target); }
    const stale = loadIsoContext(tmp);
    fs.appendFileSync(path.join(tmp,ISO_SOURCES[1]), '\nCanvi de context\n');
    assert.throws(() => buildIsoPrompt(stale, fields), /Context modificat/);
  } finally { fs.rmSync(tmp,{recursive:true,force:true}); }
});
test('els camps incomplets i les capçaleres injectades es bloquegen', () => {
  assert.throws(() => buildIsoPrompt(context,{...fields,objective:''}));
  assert.throws(() => buildIsoPrompt(context,{...fields,context:'## Fora de plantilla\nText'}));
});
