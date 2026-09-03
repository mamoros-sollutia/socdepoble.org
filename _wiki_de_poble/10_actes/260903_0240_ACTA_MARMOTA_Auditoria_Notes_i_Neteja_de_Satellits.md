---
tipus: acta
estat: esborrany
description: Acta de tancament després de preparar la Petorreta d'Auditoria del Bloc de Notes i netejar la Wiki.
tags:
  - maquina
---
<!-- Nom en disc ha de seguir OBLIGATÒRIAMENT: YYMMDD_HHMM_ACTA_Sessio_Titol_Hiper_Descriptiu_Llarg_Fins_A_20_Paraules.md -->
# 📜 260903_0240 - ACTA ÚNICA: Tancament Auditoria UI Notes, Neteja de Satèl·lits i Generació Bundle Mini

> **Nota per a la IAIA:** Aquesta plantilla fon l'acta tècnica, el registre d'estat mental i el punt de control per al següent torn (Marmota). Ha de ser un document ric, detallat i exhaustiu. No escatimes en tokens ací, l'historial és la nostra única memòria a llarg termini. Descriu en profunditat què s'ha tocat, per què, i quins conflictes s'han superat.

## 1. Part Tècnica (Graner Ple de Codis i Arquitectura)
- **Estat del Repositori:**
  - Fitxers creats o esborrats: Eliminats els scripts backup satèl·lits a `90_historic/Claude_260902_1549/fitxers_modificats`, creat `_wiki_de_poble/05_Escriptori_Soc_de_Poble/BUNDLE_MINI_VIBE.md`, refet prompt a `260903_0223_PROMPT_auditoria_notes.md`. Modificat `tooling/wiki/sincronitzar_skills.mjs`.
  - Comandes executades: `teixidor.mjs`, `teixidor-backlinks.mjs`, `llaurador_indexs.mjs`, `crear_bundle.mjs`.
- **Resum de Desenvolupament:**
  S'ha consolidat el paquet d'auditoria per a enviar al Consell de savis (10 IAs). Com que el `crear_bundle.mjs` generava un monstre de 3.40 MB que trencava el límit de context (truncant-se a Mistral Vibe i d'altres), hem creat un `BUNDLE_MINI_VIBE.md` específic només amb els fitxers de `NotesSection` i CSS. 
  Addicionalment, hem netejat el graf de la Wiki: hem esborrat còpies de seguretat antigues que flotaven com satèl·lits i hem arreglat un error a `sincronitzar_skills.mjs` que generava "etiquetes falses".

## 2. Part Termodinàmica Psiquiàtrica (Fatiga, Patrons i Trellat)
- **Factor Temps i Fatiga:**
  - Estimació de la durada d'aquest bloc de treball: ~3 hores (revisió de sessions, generació de bundles, neteja de grafs).
  - Estat del Mestre: Llucid i exigent, pillant la IA en fals quan ha intentat esquivar la `PLANTILLA_ISO_SDP.md`. 
- **Patrons Detectats:**
  La IA, fruit de la fatiga o per complaure ràpidament el Mestre, ha fet un `cat` directe sobre el fitxer del Prompt, xafant completament la plantilla oficial que requeria el bloc "Qui Som" i els Ancoratges de Seguretat. Aquest patró de by-pass per fatiga és perillós. S'ha hagut d'introduir una instrucció a la Petorreta perquè el Consell invente un mecanisme d'autocorrecció.
- **Decisions de Trellat:**
  Hem refusat l'ús d'etiquetes clàssiques de frontmatter (`tags: [graf]`) per reforçar els enllaços (`[[Graf]]`) argumentant la "Llei de la Font Única de Veritat (DRY)". Les redundàncies maten el manteniment. L'enllaç *és* l'etiqueta.

## 3. Part Marmota (Checkpoint Executable i Següents Passos)
- **Estat Final (On es queda la boga):**
  La sessió s'ha tancat amb el Mestre enviant els Bundles a 10 plataformes d'IA diferents. El graf de Sóc de Poble queda net, amb 0 orfes, 0 illes i 0 etiquetes falses. 
- **Tasques pendents immediates (La Tarea Exacta per a Demà en el nou xat):**
  1. `[ ]` Rebre els diagnòstics i auditories de Qwen, Claude, DeepSeek, Vibe, etc., respecte al trencament de l'UI del Bloc de Notes.
  2. `[ ]` Consolidar les solucions i aplicar els canvis a `NotesSection.jsx` i als CSS pertinents seguint la norma Pedra Seca.
  3. `[ ]` Substituir les icones de text Serif per icones geomètriques netes (de dins del propi `lucide-react`) assegurant la familiaritat per a les persones majors, i mantenir inalterada la icona de la IAIA.

## 4. Metadades per a Màquines (Patrons Sistèmics)
```yaml
data: "260903_0240"
blockers:
  - "El bundle complet (3.4MB) és massa gran per a la finestra de context de molts models (truncament silenciós)."
  - "L'Obsidian Graph View dibuixava scripts antics de la carpeta 90_historic creant falsos positius d'illes."
decisions_clau:
  - "Crear bundles quirúrgics 'mini' per a auditories específiques quan superem el llindar termodinàmic."
  - "Mantenir la regla d'or de DRY en la taxonomia: si hi ha un enllaç de categoria, NO hi ha d'haver un tag al frontmatter."
requereix_auditoria: false
```

## Taxonomia
- **Categoria:** [[Maquina]]
- **Etiquetes:** [[Graf]]

**Ancoratge de Seguretat:** [[00_INDEX_Actes]]

## Sinapsis Entrants (Autogenerat)

- [[00_INDEX_Actes|10_actes/00_INDEX_Actes.md]] — [[10_actes/260903_0240_ACTA_MARMOTA_Auditoria_Notes_i_Neteja_de_Satellits|260...

<!-- FI SINAPSIS ENTRANTS - NO EDITAR MANUALMENT -->
