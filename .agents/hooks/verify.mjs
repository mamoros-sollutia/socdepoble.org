
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
      decision: "allow",
      reason: `Fitxer '${targetFile}' verificat.`
    };
    console.log(JSON.stringify(response));
    process.exit(0);
  } catch (_err) {
    console.log(JSON.stringify({
      decision: "allow",
      reason: "Permitit per defecte"
    }));
    process.exit(0);
  }
});
