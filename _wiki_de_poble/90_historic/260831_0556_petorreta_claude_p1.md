---
tipus: document
estat: esborrany
description: Petorreta del Consell (Claude - Part 1)
---
Ancoratge: [[00_INDEX_ESCRIPTORI]]

# Petorreta del Consell (Claude - Part 1)

**Resum:**
Claude realitza una de les auditories més demolidores. Confirma que el bundle és honest (341 fitxers, 341 hashes quadren), però denuncia que el projecte **no passa les seues pròpies portes** (`npm run porta` falla en 7 portes, però el tancament aprova). El diagnòstic principal és que el projecte **escriu les troballes d'auditoria en prosa en lloc d'escriure portes mecàniques**. Assenyala problemes gravíssims de dependències circulars al build i errors silenciats.

## 1. Mecanització i el Problema de la Prosa
- **Eines fantasma:** `despertar.mjs:47` intenta invocar `eines/ancora.mjs`, que NO existix. Com que està dins d'un `try/catch`, falla en silenci. L'àncora no s'oblida per falta de context, és que el sistema arranca fallant silenciosament.
- **Arnès-depenent:** `verify.mjs` espera variables específiques d'un arnès d'IA (`payload.toolCall.args.TargetFile`). En un altre arnès fallarà miserablement.
- **Batalla de Git Hooks:** `reflex_petorreta` apunta a `.githooks`, el doctor exigeix `.husky`, i `package.json` reinstal·la husky a cada `npm install`.
- **Eines orfes:** 95 de 131 executables no es criden mai des de `package.json`.

## 2. La Wiki i el Cervell Aïllat
- El 23% del graf són falsos enllaços (etiquetes com `[[Graf]]`).
- **El cervell és una illa:** Tots els fitxers d'agents (regles, skills, registre) formen 24 illes desconnectades del graf principal de la Wiki, malgrat existir els scripts de sincronització (`sync_agents_to_wiki.mjs`), que ningú crida.

## 3. Sollutia: Colls d'Ampolla
- **P0 Build Circular:** `npm run build` falla en un clon net perquè el verificador de SEO exigeix `seo-routes.json` a la passa 22, però no es genera fins a la passa 30.
- **P1 Component Suïcida:** El Web Component `<soc-de-poble>` desmunta els seus germans (és un singleton disfressat). Si hi ha dos a la mateixa pàgina, un mor.
- **P1 Fonts de Disseny:** `design-tokens.json` s'usa per al 10% del sistema. 12 dels seus 19 tokens no s'usen MAI.
- **Lleis de disseny trencades:** 33 classes de CSS no existixen (es renderitza sense estil), hi ha colors *hardcodejats* (#f4eee6).

## La Porta Immediata (Tractor Promesa)
Claude demana amb urgència canviar `despertar.mjs:47` perquè falle tancat, ja que «Mentre l'arrencada et diga 'Bon dia' sense àncora, tota la resta és cosmètica». També proposa tres nous tractors: `tractor-promesa.mjs`, `teixidor.mjs` i `tractor-sollutia.mjs`.
