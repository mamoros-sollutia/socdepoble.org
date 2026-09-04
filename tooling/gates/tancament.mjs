#!/usr/bin/env node
/**
 * tooling/gates/tancament.mjs
 * Orquestrador del gatekeeper (pre-commit o manual)
 */

import { VerificadorSCC } from './verificador-scc.mjs';
import { R } from '../lib/arrel.mjs';

import { execSync } from 'node:child_process';

async function main() {
  const args = process.argv.slice(2);
  const isJsonMode = args.includes('--json');
  
  const rootDir = R('.');

  // -1. Sincronitzar Skills al cervell (wiki) perquè siguen auditables
  try {
    if (!isJsonMode) console.log("🧠 Sincronitzant skills a la Wiki...");
    execSync('node tooling/wiki/sincronitzar_skills.mjs', { cwd: rootDir, stdio: isJsonMode ? 'ignore' : 'pipe' });
  } catch (e) {
    throw new Error(`Error sincronitzant skills: ${e.message}`);
  }

  // 0. Auto-generar els índexs de carpetes dinàmiques abans d'auditar
  try {
    if (!isJsonMode) console.log("🔄 Actualitzant índexs automàtics...");
    execSync('node generar_indexs.mjs', { cwd: rootDir, stdio: isJsonMode ? 'ignore' : 'pipe' });
  } catch (e) {
    throw new Error(`Error actualitzant índexs: ${e.message}`);
  }
  
  const verificador = new VerificadorSCC(rootDir);
  const result = await verificador.runAudits();

  if (isJsonMode) {
    // Escriure JSON net per stdout
    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
    process.exit(result.valid ? 0 : 1);
  }

  // Sortida per humans (si no porta --json)
  if (result.valid) {
    console.log("\n✅ AUDITORIA SCC COMPLETADA AMB ÈXIT.");
    console.log("   Tots els nodes estan actius i l'escriptori està impol·lut. Sessió neta.");
    process.exit(0);
  } else {
    console.error("\n❌ ERROR CRÍTIC: EL TANCAMENT S'HA BLOQUEJAT PER VIOLACIÓ DE REGLES.");
    
    for (const err of result.errors) {
      console.error(`\n🚨 [${err.code}] ${err.message}`);
      if (err.affected_files && err.affected_files.length > 0) {
        console.error("   Fitxers afectats:");
        for (const file of err.affected_files) {
          console.error(`     - ${file}`);
        }
      }
    }
    console.error("\n🔒 S'aplica l'SDP-LOCK. No pots fer commit fins que resolgues estos defectes.");
    process.exit(1);
  }
}

main().catch(e => {
  console.error("\n💥 Error inesperat durant l'auditoria:", e);
  process.exit(1);
});
