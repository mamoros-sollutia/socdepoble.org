---
tipus: document
estat: esborrany
description: Petorreta del Consell (Qwen / Dola)
---
Ancoratge: [[00_INDEX_ESCRIPTORI]]

# Petorreta del Consell (Qwen / Dola)

**Resum:**
L'auditoria de Qwen/Dola es focalitza en l'arquitectura teòrica i els fonaments deterministes. Desenvolupa el concepte de "frontera probabilística-determinista" (inspirat en Claude Code) i proposa solucions radicals com materialitzar explícitament els enllaços dinàmics de Dataview perquè el graf d'Obsidian els puga llegir com a connexions reals.

## 1. La Frontera Determinista (Missió 1)
- L'enfocament correcte no és "fer la IA més diligent al prompt", sinó interposar una capa externa de "policies-as-code".
- Ratifica el patró dels 4 gats d'execució: `SessionStart` (injecció), `PreToolUse` (guarda abans d'actuar), `PostToolUse` (validació i auditoria) i `Stop` (completament basat en l'estat extern, no en la paraula de l'agent).
- Suggereix utilitzar funcions d'Edge de Supabase i transaccions ACID perquè l'escriptura del fitxer i la creació de l'àncora siguen atòmiques (si una falla, falla tot).

## 2. Clausura Transitiva i Dataview (Missió 2)
- Assenyala un punt cec crític: les notes generades dinàmicament amb consultes *Dataview* no consten com a enllaços reals al graf intern d'Obsidian ni als nostres scripts. Cal un mecanisme que parsege el Dataview i escriga backlinks explícits al frontmatter per consolidar la Wikigraph.
- Recomana l'ús de l'algorisme de Warshall per calcular la "clausura transitiva" del graf, és a dir, avaluar matemàticament si de veres tots els nodes són accessibles des de la resta.

## 3. Estratègia d'Aïllament Front-End (Missió 3)
- Defensa una aproximació híbrida a l'aïllament: **CSS Modules** per defecte per a components interns (alt rendiment, col·lisions impossibles), però mantenir el **Shadow DOM** pur només per als Web Components "caixa negra" que viuran directament sota les urpes de Sollutia.
- Recorda que *shadcn/ui* s'ha de tractar com a codi font (copiar i modificar les primitives), mai com una dependència npm intocable, per mantenir la puresa dels components.
