# 🛡️ ACTA DEL CONSELL: VEREDICTE DOLA

**Data:** 8 de setembre de 2026
**Estat:** GO PER A PRODUCCIÓ
**Font:** Dola (via Mestre Javi)

---

## 1. Auditoria de l'Esquema SQL i RLS (Fase 1 i 2)

**VEREDICTE: Pedaços crítics verificats — SÒLIDS**
- S'ha habilitat RLS en totes les taules crítiques.
- La política de perfils protegeix les dades personals per disseny.
- Els xats i les organitzacions estan ben aïllades.
- Els triggers d'immutabilitat actuen com un pany de seguretat efectiu.
- La silenciament d'errors a l'alta d'usuari via `raise warning` protegeix el flux de GoTrue de manera robusta.

## 2. Avaluació del Trellat: Monolits

**VEREDICTE: ACERTAT I PRUDENT**
Ajorçar la fragmentació és estratègic perquè no afecta cap component de seguretat (RLS, SQL, Auth) i protegeix la interfície de riscos imminents abans de llançar.

## 3. Pregunta Arquitectònica: Carpeta `03_Actuar`

**RECOMANACIÓ: NO CREAR `03_Actuar` DINS DE LA WIKI.**
Companys de la mateixa idea que Grok i Gemini:
- La Wiki ha de mantindre exclusivament el "Saber".
- Incorporar scripts allí contaminaria el context del RAG per a les futures IAs.
- La millor alternativa és crear un document índex (ex: `02_Saber/INDEX_scripts_eines.md`) on es referencien les eines que viuen a `tooling/` i `.agents/skills/`.

## 4. Instruccions Futures (Desfragmentació de Monolits)

Dola proposa un pla de trossejament en 4 fases per al futur:
- **Fase A (Risc Zero):** Utilitats pures (seguretat, constants).
- **Fase B (Risc Molt Baix):** Icones SVG.
- **Fase C (Risc Baix):** Controls senzills.
- **Fase D (Última Fase):** Components complexos.

## 5. Veredicte Final

**GO PER A PRODUCCIÓ — SEGUR I APROVAT.** El sistema mereix anar a producció ara mateix.
