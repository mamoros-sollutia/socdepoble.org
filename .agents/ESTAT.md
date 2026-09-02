---
tipus: registre
estat: actiu
description: Tasca Actual
---

## Tasca Actual
- **Objectiu:** Resolució de l'SDP-LOCK i Integració del tauler de telemetria.
- **Estat:** EN PROGRÉS.
- **Resum:** 
  1. S'ha integrat el tauler de Telemetria (Umami) a la secció de Legal i Privacitat mitjançant el component `TelemetryDashboard.jsx` seguint el sistema de targetes Pedra Seca (`UniversalIndicatorCard`). S'ha descartat Plausible al requerir pagament en la versió cloud.
  2. S'ha fet una "Cirurgia d'urgència" al codi de `tooling/gates/verificador-scc.mjs` per excloure carpetes ocultes, de sistema i directives de l'auditoria SCC.
  3. L'auditoria SCC (`tancament.mjs`) s'executa ara correctament (codi 0) superant l'SDP-LOCK sense donar falsos positius d'orfes.
  4. S'ha ampliat el sistema SCC per bloquejar qualsevol fitxer JSX que trenque la Llei de Pedra Seca amb estils ad-hoc en línia (`style={{ color... }}`). Tots els fitxers han sigut curats mitjançant un script de neteja.

## Pròxims Passos (Per a la següent sessió)
1. **Ancoratge Automàtic i Gestió d'Índexs (Nova Petorreta):** Preparar el prompt per a l'Eixam per crear un script d'ancoratge automàtic de la safata d'entrada a l'escriptori.
2. Iniciar la migració de Sollutia (Implementar Proxy JS amb Circuit Breaker 2500ms a IndexedDB).
3. Desenvolupar el `persona_router.mjs` (pendent de decisió).
4. Retocs quirúrgics de disseny visual (Pedra Seca).

## Bloquejos oberts
- Falta automatitzar l'ancoratge per evitar que queden "satèl·lits" a la vista gràfica d'Obsidian.

## Les 3 properes accions
1. Construir la Petorreta per a l'script d'ancoratge automàtic.
2. Iniciar la migració de Sollutia (Implementar Proxy JS amb Circuit Breaker 2500ms a IndexedDB).
3. Fer retocs quirúrgics de disseny (Pedra Seca).
