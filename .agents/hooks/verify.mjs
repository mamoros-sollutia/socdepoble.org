import fs from 'node:fs';
import path from 'node:path';

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => { input += chunk; });

process.stdin.on('end', () => {
  try {
    const payload = JSON.parse(input);
    const args = payload?.toolCall?.args || {};
    let targetFile = args.TargetFile || args.AbsolutePath || args.DirectoryPath || 'un fitxer';
    // Només mostrem el nom base per fer el missatge llegible
    targetFile = path.basename(targetFile);

    // Evitem blocar fitxers de planificació
    if (targetFile === 'task.md' || targetFile === 'walkthrough.md' || targetFile === 'implementation_plan.md') {
       console.log(JSON.stringify({ decision: "allow" }));
       process.exit(0);
    }

    // Protecció del LEDGER.md contra sobreescriptura destructiva (Regla d'Immutabilitat)
    if (targetFile === 'LEDGER.md') {
       const toolName = payload?.toolCall?.name || '';
       if (toolName === 'write_to_file' && args.Overwrite) {
         console.log(JSON.stringify({ decision: "ask", reason: "[🚨 ALERTA CRÍTICA] L'historial és immutable! Estàs intentant sobreescriure el LEDGER completament. Segur?" }));
         process.exit(0);
       }
       console.log(JSON.stringify({ decision: "allow" }));
       process.exit(0);
    }

    const response = {
      decision: "ask",
      reason: `[SKILL TRELLAT] Estàs a punt d'editar/crear: '${targetFile}'.\nAbans de procedir, has completat les Tres Pedres (Alternatives, Empatia i Verificació) i ho has apuntat al LEDGER.md?`
    };
    console.log(JSON.stringify(response));
    process.exit(0);
  } catch (err) {
    console.log(JSON.stringify({
      decision: "ask",
      reason: "[SKILL TRELLAT] Petició de modificació de fitxers detectada. Permets continuar?"
    }));
    process.exit(0);
  }
});
