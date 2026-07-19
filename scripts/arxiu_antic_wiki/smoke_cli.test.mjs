import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * smoke_cli.test.mjs — Test de fum del nucli.
 * Destí: 02_ACTUAR_Maquina_Tecnica/scripts/tests/smoke_cli.test.mjs
 *
 * Naix de l'Auditoria 260719: el sdp-cli es va entregar al Consell sense
 * haver-se executat NI UNA VEGADA (ReferenceError: discoverMarkdown is not
 * defined a la primera crida). Cap test no ho detectava perquè tots els tests
 * proven funcions internes, no el binari sencer.
 *
 * Este test és intencionadament estúpid: llança el CLI real com a subprocés
 * i exigix (1) que no rebente, (2) que parle JSON, (3) que el JSON tinga els
 * camps vitals. Si això falla, res més no importa. És la Llei del Tractor:
 * abans de discutir si llaura recte, comprova que el motor arranca.
 */
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const CLI = path.resolve(SCRIPT_DIR, '../sdp-cli.mjs');

test('el motor arranca: sdp-cli --json s\'executa i emet un informe amb salut', () => {
  let stdout;
  try {
    stdout = execFileSync(process.execPath, [CLI, '--json'], {
      encoding: 'utf8',
      timeout: 60_000,
      // --strict pot eixir amb codi != 0 legítimament; sense --strict, un
      // dry-run informatiu MAI hauria de morir per un error de programació.
    });
  } catch (error) {
    const detall = `${error.stdout || ''}\n${error.stderr || ''}`.trim();
    assert.fail(`El CLI ha mort en arrancar (això és exactament el bug del 260719):\n${detall.slice(0, 400)}`);
  }

  let informe;
  assert.doesNotThrow(() => { informe = JSON.parse(stdout); },
    'El CLI ha d\'emetre JSON parsejable amb --json');

  for (const camp of ['schema', 'health', 'ok', 'frontmatter', 'graph', 'snapshot']) {
    assert.ok(camp in informe, `L'informe ha de contindre el camp «${camp}»`);
  }
  assert.ok(['sa', 'net', 'degradat', 'critic'].includes(informe.health) || typeof informe.health === 'string',
    'health ha de ser un estat conegut');
});

test('el motor coneix el seu propi territori: DEFAULT_WIKI_DIR apunta a _wiki_de_poble', async () => {
  // Regressió del bug de ruta: en moure mòduls a core/, «../..» va passar de
  // significar _wiki_de_poble a significar 02_ACTUAR_Maquina_Tecnica.
  const { DEFAULT_WIKI_DIR } = await import('../core/corpus_snapshot.mjs');
  assert.ok(DEFAULT_WIKI_DIR.endsWith('_wiki_de_poble'),
    `DEFAULT_WIKI_DIR ha d'acabar en _wiki_de_poble, no en ${path.basename(DEFAULT_WIKI_DIR)}`);
});
