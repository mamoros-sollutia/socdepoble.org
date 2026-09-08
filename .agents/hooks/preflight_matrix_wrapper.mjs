import fs from 'fs';
import { execSync, execFileSync } from 'child_process';
import path from 'path';

try {
  const inputRaw = fs.readFileSync(0, 'utf-8');
  if (!inputRaw.trim()) {
    console.log(JSON.stringify({ injectSteps: [] }));
    process.exit(0);
  }
  const input = JSON.parse(inputRaw);

  // Només ho executem en la primera invocació del torn
  if (input.invocationNum !== 1) {
    console.log(JSON.stringify({ injectSteps: [] }));
    process.exit(0);
  }

  // Extraure el darrer missatge de l'usuari del transcript
  const transcriptRaw = fs.readFileSync(input.transcriptPath, 'utf-8');
  const lines = transcriptRaw.trim().split('\n');
  let lastUserInput = '';
  for (let i = lines.length - 1; i >= 0; i--) {
    try {
      const step = JSON.parse(lines[i]);
      if (step.type === 'USER_INPUT') {
        lastUserInput = step.content || '';
        break;
      }
    } catch (e) {}
  }

  if (!lastUserInput.trim()) {
    console.log(JSON.stringify({ injectSteps: [] }));
    process.exit(0);
  }

  let resultJSON = '';
  try {
    const stdout = execFileSync('node', ['tooling/brain/matrix.mjs', '--json', lastUserInput], { encoding: 'utf-8', cwd: process.cwd() });
    resultJSON = stdout;
    
    const report = JSON.parse(resultJSON);
    
    const injectSteps = [];
    if (report.fonts_obligatories && report.fonts_obligatories.length > 0) {
      injectSteps.push({
        ephemeralMessage: "[MATRIX PREFLIGHT] He localitzat el context vinculat a aquesta petició. Carregant els fitxers obligatoris..."
      });
      for (const font of report.fonts_obligatories) {
        injectSteps.push({
          toolCall: {
            name: "view_file",
            args: {
              AbsolutePath: path.join(process.cwd(), font.ruta)
            }
          }
        });
      }
    }
    
    console.log(JSON.stringify({ injectSteps }));
    
  } catch (err) {
    // Netetjat error catch
    
    const stderr = err.stderr || '';
    const stdout = err.stdout || '';
    let reportStr = stdout;
    
    console.log(JSON.stringify({
      injectSteps: [
        {
          ephemeralMessage: `[MATRIX ROIG] El bootloader ha eixit amb ready:false: el context NO s'ha carregat.\nAquest hook no bloqueja res (PreInvocation no admet decisions); qui bloqueja és la\nLlei 6 de .agents/hooks/verify.mjs, que denegarà qualsevol document nou fins que\nhi haja rebut. Corregeix això primer.\n${reportStr}\n${stderr}`
        }
      ]
    }));
  }
} catch (e) {
  console.log(JSON.stringify({ injectSteps: [] }));
}
