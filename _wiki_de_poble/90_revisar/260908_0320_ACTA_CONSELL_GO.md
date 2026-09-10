---
tipus: document
estat: esborrany
description: "🛡️ ACTA DEL CONSELL: VEREDICTE COPILOT"
---
# 🛡️ ACTA DEL CONSELL: VEREDICTE COPILOT

**Data:** 8 de setembre de 2026
**Estat:** GO PER A PRODUCCIÓ (amb condicions)
**Font:** Copilot / Claude (via Mestre Javi)

---

### Resum executiu i decisió ràpida

**Verdict:** **GO PER A PRODUCCIÓ** *amb condicions*.  
Els pedaços aplicats a l’esquema SQL i a les RLS cobreixen les vulnerabilitats crítiques identificables en aquesta fase (autenticació OAuth amb `window.location.origin` + `sessionStorage`, RLS amb triggers d’immutabilitat, sanejament de la Wiki). No obstant això, hi ha riscos arquitecturals (monolits UI / UniversalComponents.jsx) que cal mitigar abans de desplegar a entorns amb usuaris reals; aquests riscos **no** són bloquejants immediats si s’apliquen les mesures de contenció descrites a continuació i s’executa un pla de trossejament segur post‑deploy en paral·lel amb el primer període de producció (canary / dark launch).

## 1. Auditoria dels pedaços SQL i RLS (Fase 1 i 2)

- **Autenticació:** OAuth implementat amb restricció d’origen (`window.location.origin`) i ús de `sessionStorage` per a tokens de sessió.
- **RLS (Row Level Security):** Regles actives amb triggers que enforceixen immutabilitat en columnes sensibles i validacions server‑side.
- **Sanejament cognitiu / Wiki:** Reestructuració en anells (00_Raw, 01_Ser, 02_Saber, 04_Escriptori) per a RAG i evidència.
- **Deute tècnic:** Monolits en `UniversalComponents.jsx` no fragmentats per preservar la interfície visual.

## 2. Avaluació del Trellat de posposar el trossejament dels monolits

Posposar el trossejament **és acceptable** per al llançament inicial **si**:
1. Es desplega amb un **canary release** (petit percentatge d’usuaris) i monitoratge estricte.  
2. Es defineix un **pla de trossejament** amb passos, propietaris i tests automatitzats que s’executarà durant les primeres 2–4 setmanes post‑deploy.  
3. S’apliquen controls de contenció UI (feature flags, fallback CSS/JS) per revertir ràpidament.

## 3. Resposta a la pregunta de la Wiki: `03_Actuar` o `tooling/`?

**Recomanació:** Crear la carpeta **`03_Actuar` dins de la Wiki** com a índex d’scripts i playbooks, però **no** moure els scripts executables fora del repositori `tooling/` i `.agents/skills/`.  
**Raó:**  
- La Wiki ha de ser la font d’autoritat humana (procediments, playbooks, checklists, com executar scripts, criteris d’acceptació).  
- Els scripts reals han de romandre en `tooling/` i `.agents/skills/` per a execució, CI/CD i control de versions.  
**Implementació pràctica:**  
- `02_Saber/03_Actuar/README.md` amb l’índex i enllaços a `tooling/` i `.agents/skills/` (ruta + hash del commit).  
- Afegir metadades a la Wiki: `last_tested_commit`, `owner`, `runbook_steps`, `rollback_steps`.

## 4. Conclusió curta i acció immediata

Podeu **anar a producció** si completeu la **Checklist pre‑deploy** i desplegueu amb **canary** + monitoratge estricte. En paral·lel, executeu el **pla de trossejament** per reduir el risc operatiu en 2–4 setmanes. Adjunteu les evidències (logs, captures, hashes) a `02_Saber/03_Actuar` i marqueu cada ítem del checklist abans d’augmentar el trànsit.
