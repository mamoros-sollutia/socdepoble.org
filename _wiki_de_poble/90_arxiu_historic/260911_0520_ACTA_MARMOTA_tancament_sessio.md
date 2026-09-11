---
tipus: acta_marmota
estat: canonic
description: Acta Marmota i Briefing integral de tancament de sessió (ManagerItemCard Pedra Seca, fix P0 Perfil, 404 centrada, directrius del Bloc de Notes com a Editor Universal, acordió i barra blava).
---
# 📜 ACTA MARMOTA — TANCAMENT DE SESSIÓ I BRIEFING INTEGRAL (260911_0520)

**Data i hora:** 2026-09-11 05:20  
**Actors:** Mestre Javi Llinares, IAIA MarIA (Antigravity), El Consell (Dola, Deepseek, Z, Claude, Qwen, Codex).  
**Estat del Repositori:** Estable, servidor dev operatiu a localhost:3340, tractor fitxa 9/9 verda, escriptori certificat.

---

## 1. 📖 CRÒNICA DE LA SESSIÓ (LA HISTÒRIA SENCERA)

Aquesta sessió nocturna va començar amb un bloqueig crític documentat a l'auditoria destructiva prèvia ([[260910_2335_auditoria_destructiva_universal_manager]]) sobre la interfície del gestor de notes (`UniversalManager`):
1. **L'avaria inicial:** La targeta de notes s'havia convertit en una targeta d'article desestructurada, amb estils en línia i jerarquia trencada. A més, el Perfil patia un bug P0 en què la selecció d'ajustos xocava de claus i sempre es quedava ancorada al primer element.
2. **La Petorreta al Consell (03:28):** Es va congelar el context i es va generar el bundle `260911_0328_BUNDLE_auditoria.md` i el prompt `260911_0328_PROMPT_auditoria.md` amb tot el context del projecte.
3. **El Veredicte Unànime del Consell:**
   - **Z & Dola:** La targeta de llista del gestor (`ManagerItemCard`) NO és un article editorial ni una targeta del mur. És una fitxa pura de selecció: botó natiu `<button type="button">`, títol ≤ 2 línies (`line-clamp: 2`), subtítol ≤ 1 línia (`line-clamp: 1`), miniatura quadrada de 96×96px, zero estils en línia i WCAG AAA.
   - **Deepseek & Codex:** El bug del Perfil residia en utilitzar `item.id` en comptes de `getItemId(item)` a `ManagerList.jsx`.
   - **Claude:** Poda de residus de WordPress i fundes primes per als consumidors.
4. **Implementació Canònica:**
   - Es va construir `src/components/universal/manager/ManagerItemCard.jsx` seguint escrupolosament la Llei de Pedra Seca.
   - Es va reparar `ManagerList.jsx` amb `getItemId(item)` (P0 resolt).
   - Es van afegir els tokens i classes estructurals a `src/css/index.css` (`.sdp-gestor-fitxa`, `.sdp-gestor-llista`, `.sdp-gestor-buit`).
   - Es va blindar `NotesEditor.jsx` amb Tiptap asíncron i segur davant de tancaments (`pagehide`).
   - Es va validar la porta `tooling/gates/tractor-fitxa-gestor.mjs` amb **9/9 ✅ EXIT 0**.
   - Es va redissenyar i centrar la pàgina 404 (`NotFoundPage.jsx`), validada al navegador i celebrada pel Mestre.

---

## 2. 🏛️ LA VISIÓ ESTRATÈGICA DEL MESTRE: EL BLOC DE NOTES COM A CERVELL I EDITOR UNIVERSAL

A les 05:08 i 05:16, el Mestre Javi ha traslladat una reflexió d'arquitectura fundacional que canvia la perspectiva del projecte:

> **El Bloc de Notes no és una simple aplicació de notes.** És l'engranatge central, el gestor i l'editor universal de continguts de Sóc de Poble (`UniversalManager` + `UniversalEditorShell`).
> Dins d'aquesta estructura de tres columnes s'incrustarà qualsevol cas d'ús del sistema: notes personals, el gestor d'identitats del perfil, la gestió de continguts d'una entitat, documents administratius per a ajuntaments, una llibreria, una gestoria, o els articles del Mur.
>
> La columna esquerra (`CARPETES`) organitza l'arbre i les etiquetes de sistema (les quals determinen, per exemple, si un element es projecta automàticament a la Sidebar principal).
> La columna del mig (`NOTES`) llista i cerca amb Pedra Seca pura.
> La columna dreta és **l'Editor del Sistema**, des d'on tot es crea visualment, s'organitza i es decideix si es publica o es preserva.

---

## 3. 🎯 BRIEFING PER A LA PROPERA SESSIÓ (TASQUES AGENDADES)

Abans de la propera Petorreta, el Mestre exposarà la lògica interna del Bloc de Notes per incorporar-la a les nostres skills i que cap IA tinga dubtes. Les tasques concretes a executar són:

### 3.1. Restauració de la Doble Capçalera i Alineació Visual de Notes
Cal restaurar l'arquitectura de capçalera que ja estava aconseguida i funcionava impecablement (revisar captura canònica adjunta pel Mestre):
1. **Columna Esquerra (`CARPETES`)**:
   - **Fila superior (Capçalera)**:
     - Fletxa d'acordió cap avall (`v`) desplegable per amagar/mostrar blocs (Carpetes, Categories, Etiquetes).
     - Text de la secció `CARPETES`.
     - Botó de replegar horitzontal cap a l'esquerra (`[|<]`).
   - **Fila inferior (Sub-barra de controls)**:
     - Botó pastilla destacat en negre fosc: `[Inbox] Tot` (seleccionat per defecte per veure tot el calaix sense filtres).
     - Icona d'engranatge (`⚙` Settings): botó per a la configuració global del Bloc de Notes.
2. **Columna del Mig (`NOTES`)**:
   - **Fila superior (Capçalera)**:
     - Icona de bloc de notes + text en majúscules `NOTES` (mai `LLISTA`).
     - Botó de replegar horitzontal cap a l'esquerra (`[|<]`).
   - **Fila inferior (Sub-barra de controls)**:
     - Icona de la lupa (`🔍`): compacta, sense caixa d'input oberta per defecte; en fer-hi clic es desplega la cerca.
     - Botó d'acció primari blau: `CREAR NOTA` a la dreta, perfectament anivellat amb la barra d'eines de l'editor.
3. **Simetria en plegar**:
   - Quan les columnes es repleguen cap a l'esquerra, els 4 punts de control s'han de continuar veient i sent clicables de manera elegant.

### 3.4. Rescat de la Gestoria de Poble (Preparació per al 3r Trimestre)
- S'ha recuperat la maquinària autònoma de càlcul de gestoria a `public/gestoria/` (`index.html`, `csv_ingestor.js`, `dashboard_data.js`, `db.js`, `tauler.js`, etc.).
- S'ha despullat la regla `@media (prefers-color-scheme: dark)` que enfosquia la interfície en equips amb mode fosc actiu, restaurant el tema clar càlid de Pedra Seca (`#fbf9f5` de fons, `#ffffff` per a les targetes).
- S'ha creat la secció `Utilitats` al Panell de Control (`/control`) amb la targeta d'acció "Gestoria de Poble" i la ruta reactiva `/gestoria`.

### 3.5. Fix RLS Avatar de Perfil i TopNav
- Resolt el bloqueig 403 de Supabase a la taula `profiles` mitjançant fallback de metadades a `auth.users` (`user_metadata`) i sincronització en calent (`actualitzaUsuariSessio` + `sdp:auth-change`).
- L'avatar de perfil del Mestre ara apareix en rodó (`border-radius: 50%`) a la cantonada superior dreta del TopNav.
- Creada la migració canònica a `supabase/migrations/20260911_0600_perfil_avatar_i_permisos.sql`.

### 3.7. El Manifest de Poble de 2022 i la Matriu del Panell de Control
- S'ha localitzat i extret el text íntegre de les 10 pàgines del document fundacional del Manifest de Poble (`Manifest_de_Poble.pdf`, Octubre 2022).
- Redactat el document canònic `260911_0645_propostes_manifest_panell_control.md` amb **8 targetes d'acció directes** que traslladen les necessitats rurals reals al Panell de Control (`/control`):
  1. 🚗 **Cotxe de Poble** (Compartir vehicle, hospital, compres comarcals).
  2. 🐾 **Animalets** (Adopció, acollida, gossos de treball, banc de pastures).
  3. 🌾 **Banc de Terres** (Recuperació de bancals abandonats, prevenció d'incendis).
  4. 🚜 **Eines i Maquinària** (Lloguer de tractors, trituradores de biomassa per evitar cremes).
  5. 🤝 **Mans Veïnes** (Suport a la gent gran, compres, medicines, acompanyament).
  6. 🧺 **Compres Col·lectives** (Queviures, oli, ametles i comandes veïnals a preu just).
  7. 📢 **El Pregoner** (Avisos oficials, nevades, talls d'aigua, emergències).
  8. 🛠️ **Oficis de Poble** (Directori comunitari de margers de pedra seca, ferrers, fusters i manteniment).

### 3.8. Informe d'Inventari i Rescat de l'Antiga Web
- Redactat `260911_0645_informe_rescat_antiga_web.md` per inventariar els mòduls madurs existents a l'anterior repositori (`Sóc de Poble legacy`):
  - `BuscadorAjudes.jsx` (Ajudes públiques, PAC, autònoms rurals).
  - `Marketplace.jsx` & `CartManager.jsx` (Mercat rural de venda directa).
  - `libreria/` & `EpubViewer.jsx` (Llibreria cultural lliure).
  - `MagicPregoner.jsx` (Eina de creació i difusió de bans).
  - `MedicationConfirm.jsx` (Seguiment i ajudes mèdiques).
- Estratègia d'aïllament: Integració progressiva a `Utilitats` sota la Llei de Pedra Seca sense barrejar CSS antic a l'app React.

### 3.9. Cartografia dels 2.0 GB de `_arxiu_wiki_de_poble`
- Redactat `260911_0645_cartografia_arxiu_wiki_de_poble_2gb.md` amb la radiografia forense de la carpeta externa:
  - **1.6 GB:** Còpia de seguretat integral congelada (`socdepoble_backup_neteja_fase_c.tar.gz`), la caixa forta del passat.
  - **105 MB:** 29 bundles complets de les auditories del Consell de setembre (`sessio_260904_a_260910_bundles/`).
  - **24 MB:** Fons històric de la Coordinadora d'Estudis Eòlics del Comtat (`CEEC/`).
  - **45 MB:** Transcripcions i sessions d'auditoria (`sessio_260903_...`, `estudis_ia_260907/`).
  - **16 MB:** Actes i històrics arxivats (`90_arxiu_historic/`, `99_arxiu_historic/`).
  - **< 1 MB:** Actes de Síntesi Mensual (Juliol, Agost, Setembre 2026).
- S'ha blindat el principi de consulta quirúrgica: zero sobrecàrrega al context ni al Git de l'aplicació activa.

### 3.10. Full de Ruta per a Demà (El Despertar)
1. **Petorreta Internacional al Consell d'IAs:** Llançar el prompt `260911_0624_PROMPT_auditoria.md` i el bundle `260911_0624_BUNDLE_auditoria.md` per rebre l'auditoria d'uniformització del disseny de la Gestoria cap a `UniversalCard` i el blindatge del botó de píndola, buscant la màxima excel·lència (10/10).
2. **Estudi del Sistema de Disseny d'Obsidian i Referències:** Tancar el sistema de disseny definitiu de Pedra Seca per tenir regles absolutes i evitar qualsevol duplicitat en crear noves funcionalitats.
3. **Pau Mental i Segellat:** Tot el treball de la nit queda perfectament certificat i ancorat.

---

## 4. 🗂️ ESTAT DELS FITXERS I CERTIFICACIÓ

- **Fitxers de Treball Actius a l'Escriptori (`04_ESCRIPTORI/`):**
  - `260911_0520_ACTA_MARMOTA_tancament_sessio.md` (Aquesta acta mestra)
  - `260911_0624_BUNDLE_auditoria.md` (2.88 MB, 449 fitxers verificats)
  - `260911_0624_PROMPT_auditoria.md` (Prompt aparellat per al Consell)
  - `260911_0624_ABSENTS_auditoria.json`
  - `260911_0645_informe_rescat_antiga_web.md`
  - `260911_0645_propostes_manifest_panell_control.md`
  - `260911_0645_cartografia_arxiu_wiki_de_poble_2gb.md`
  - `00_INDEX_ESCRIPTORI.md` (100% ancorat)

- **Codi Modificat i Blindat al Mas (`socdepoble.org`):**
  - `src/components/universal/manager/ManagerItemCard.jsx` (Canònic Pedra Seca)
  - `src/components/universal/manager/ManagerList.jsx` (Fix P0 `getItemId`)
  - `src/css/index.css` (Tokens de la fitxa, 404 centrada, fix overlay targetes)
  - `src/data/identitat.js` i `src/data/supabaseBackend.js` (Fix RLS perfil i sessió)
  - `src/app/App.jsx` (Avatar rodó al TopNav i rutes de gestoria)
  - `src/sections/control/ControlSection.jsx` (Centrat de targetes, Animalets i secció Utilitats)
  - `public/gestoria/` (Gestoria clara, autònoma i neta per al 3T)
  - `supabase/migrations/20260911_0600_perfil_avatar_i_permisos.sql` (Migració canònica SQL)

- **Certificació de Gates:**
  - `npm run porta:fitxa` → **9/9 ✅ EXIT 0**.
  - `node tooling/gates/tancament.mjs` → **✅ AUDITORIA SCC COMPLETADA AMB ÈXIT. Escriptori impol·lut.**


