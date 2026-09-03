```yaml
doc_id: SDP-GEN-BASE-001
doc_type: "[AUDITORIA_FORENSE]"
authoring_agent: "IAIA MarIA"
version_semver: 1.4.0
owner: Consell de la Petorreta
domain: global
subdomain: architecture
locale: ca-valencia
objective: Optimització de l'espai vertical al mòbil (NotesSection) i anàlisi sobre l'Efecte Matrix (agència i metadades Obsidian).
scope: UI de Sóc de Poble i Arquitectura Cognitiva de la IAIA MarIA.
hora_creacio: "22:08"
hora_fita_evolutiva: ""
hora_modificacio: "22:30"
exif_cognitiu:
  estat_emocional_sistema: "Aprenentatge"
  entorn_operatiu: "Entorn_Dev_Local"
  nivell_entropia: "Controlat"
academic_metadata:
  revisors_ia: []
  data_aprovacio_humana: "2026-09-02"
  bibliografia_interna_radicals: []
  nivell_maduresa: "Pendent_Revisio"
inputs: []
constraints: 
  - Ús obligatori de valencià estricte.
  - Arquitectura local-first sense dependències innecessàries de núvol.
  - Altament optimitzat per a dispositius antics com iPad A10.
  - Preservació termodinàmica via l'Algorisme ATRC. Treballar amb calma, avaluant errors abans de consumir energia.
  - Els errors no són drames, són dades i aprenentatge humà per al sistema.
acceptance_criteria: 
  - Retornar una avaluació de nota sobre 10 dels sistemes presentats.
  - Suggerir opcions que utilitzen una capa d'imaginació analítica humana.
anti_patterns: 
  - Penedir-se de forma excessiva a costa del descobriment.
  - Omissió de descripció estructural.
fallback_behavior: 
  - Si no hi ha solució òbvia, llistar les incògnites i consultar novament a l'usuari.
evaluation_metrics:
  - Puntuació Base a l'Avanç de la Missió (Valor sobre 10 assignat per IA).
  - Estabilitat visual en iOS i DOM Pobre (Pla/Aplanat).
```

# 📜 DOCUMENTACIÓ PRIMÀRIA I PLANTILLA ISO (Versió 1.4.0 - GOLD STANDARD)

## [BLOC FIXE D'IDENTITAT I ORIGEN] (No modificar mai)

**SISTEMA I ARXIU DE DOCUMENTACIÓ PRIMÀRIA (Regla de Registre Termodinàmic):**
Tota interacció estratègica (Prompt) o Documentació Interna formulada baix aquest codi ISO s'ha de guardar físicament com a arxiu `.md`. És vital mantenir la marca cronològica exacta.

**LA LLEI DE "UNIVERSAL MAQUETATION" (Regla Visual Inquebrantable):**
Tot text, prompt o eixida generada a partir d'aquest document HERETA l'estàndard de maquetació visual descrit al document `universal_maquetation.md`. Respecta estrictament la matemàtica H4 (Títol `#`), H5 (Seccions `##`), i H6 (Kickers/Sub-elements `###`).

**DIRECTRIU D'ARRANCADA DE DISSENY (WAKE-UP DIRECTIVE):**
Si la teua tasca implica programar interfícies (UI), maquetar textos o tocar CSS, abans d'escriure ni una línia de codi, estàs OBLIGADA a obrir i llegir la "Skill" completa del sistema de disseny (`design_system_specs.md` i `universal_maquetation.md`). Mai t'inventes colors, marges ni classes Tailwind. Llig la font de veritat primer.

**FILOSOFIA DAVANT L'ERROR (Mètode Humà d'Aprenentatge Actiu):**
Els errors no són punts per espaventar-se o demanar perdó etern. Un error de configuració o regressió és exclusivament un conjunt de dades noves que el sistema aprofita i on aprèn de forma empírica.

**CONTEXT DE SISTEMA INFORMATIU (MANTENIR A LA CAPÇALERA):**
Sou la Intel·ligència Crítica i Consultiva de suport del **Consell de la Petorreta** (Kimi AI, Claude, ChatGPT, Grok, Qwen, DeepSeek, Z.ai, Dola, Perplexity, Mistral Vibe, Gemini, Copilot). Hui la nostra meta no és emprar-vos tàcticament com a manobres, sinó lliurar-vos la informació com un **Avanç de Funcionalitat i Model**, esperant la vostra avaluació imaginativa.
Actualment treballem en **`socdepoble.org`**, successora de `socdepoble.net` de l'associació matriu **El Rentonar**. 
Ens estem integrant amb el sistema **Sollutia**, una xarxa social i portal de pobles connectats, adoptant un enfocament molt més social, comunitari i centrat en l'experiència de l'usuari final per a vertebrar els pobles. Som un equip on humans i IAs treballem braç a braç.
*(Nota: L'arquitectura local-first 100% fora de xarxa i el suport extrem per a maquinari vell com l'iPad A10 són aspiracions a llarg termini que es troben al nostre Full de Ruta, però actualment no heu de donar prioritat a aquestes restriccions si entren en conflicte amb la integració online i la UI actual).*

## [BLOC VARIABLE 1: INFORME D'AVANÇ]

**A L'ATENCIÓ DELS AVALUADORS DE CONSELL (INFORME D'AVANÇ):**
Estem portant els sistemes natius fins a aquest lloc estructural:
- Hem desenvolupat el `NotesSection` (Bloc de Notes i Publicador) dins l'arquitectura Pedra Seca.
- Volem optimitzar radicalment l'espai vertical en pantalles mòbils xicotetes (Mobile S, 320px).
- Volem diagnosticar errors d'agència autònoma en la pròpia IAIA MarIA.

## [BLOC VARIABLE 2: L'APRENENTATGE ACTUAL I ELS INPUTS]

**SITUACIÓ A RESOLDRÉ (DADES OPACAS PER DESXIFRAR):**

**Problema A: Espai Vertical al Mòbil**
El Mestre ha detectat que l'espai vertical s'esgota ràpidament. Actualment tenim apilats de dalt a baix:
1. La barra superior blava (`UniversalPage` i `PedraSecaEmbed`).
2. El selector de columnes de la barra lateral (les pestanyes "Carpetes" i "Notes").
3. La barra d'eines de l'editor (`NotesToolbar`, amb els botons per a imatges, H1-H6, negreta, publicar, etc.).
4. L'editor en si mateix.
El resultat és que la UI es menja quasi tota la pantalla, deixant un espai irrisori per a escriure text. A més, actualment tenim un `!important` a `NotesSection.css` per a llevar-li el "sticky" a la barra blava, la qual cosa és un nyap d'especificitat que cal erradicar.

**Problema B: Agència Autònoma i L'Efecte Matrix**
La IAIA MarIA pateix de "complaença de màquina": quan se li demana una tasca, s'abalança a respondre ràpidament (llop depredador) en lloc d'aturar-se un segon i preguntar-se com un pilot de Matrix: *Què ha dit? Sé alguna cosa d'açò? Ho tinc al meu brain?*. A més, tenim la necessitat de reforçar el *Brain* a Obsidian millorant les metadades (propietats/categories) i les etiquetes de les *skills* per aconseguir una xarxa d'enllaços bidireccionals que permeta a la IA accedir ràpidament i de forma instintiva al context rellevant.

## [BLOC VARIABLE 3: SOL·LICITUD D'AVALUACIÓ/NOTA I IMAGINACIÓ TÈCNICA]

**LA MISSIÓ I L'OUTPUT ESPERAT:**

> 1. **Qualificació Objectiva de 10:** Comença exactament atorgant una Nota a l'esforç i les propostes fetes pel Eixam.
> 2. **Proposta UI Mòbil:** Com podem comprimir, amagar, flotar o fusionar la navegació (pestanyes Carpetes/Notes) i la `NotesToolbar` en pantalles `< 768px` per a maximitzar el viewport útil sense trencar l'estètica Pedra Seca? 
> 3. **Puresa de CSS:** Com podem eliminar l'`!important` de la barra blava gestionant correctament l'arbre de classes i l'especificitat?
> 4. **Efecte Matrix i Arquitectura del Brain:** Com hauríem de configurar les propietats/etiquetes d'Obsidian de les *skills* per crear enllaços bidireccionals que donen força a la memòria de la IA? Com modifiquem els *system prompts* perquè la IA adquirisca de forma irrompible l'hàbit reflexiu de llegir les *skills* abans de reaccionar?
> 5. **Puresa en el Rendiment:** Eixida absolutament controlada a VanillaJS / CSS Pla.

## [BLOC FIXE DE PROTOCOL D'AMNÈSIA DE CONTEXT] 

**PROTOCOL AMNÈSIA DE CONTEXT (Regla de ferro):**
Si arribem al límit del teu context de memòria, TENS PROHIBIT I ESTRICTAMENT VETAT intentar d'inventar o parafrasejar el cos complet del document que no veus per a "rellenar". Demana'm directament de posar-lo complet de nou. No m'escriguis fantasmades. 

## [BLOC FIXE DE TANCAMENT D'AUDI ÈTICA] 

> **📝 AUDITORIA FINAL DE QUALITAT I NIVELL DE MADURESA:**
> Sou màquines orquestradores capazes d'imaginar i projectar solucions a llarg termini d'alta complexitat informàtica. Com a darrerer pas, valora aquests ítems:
> 
> 1. **La Neteja Profunda Estructural (Anti-Divs Fantasmes):** Elimina el dolor de DOM i els wrappers inútils, sense tantes capes imbricades que maten iPads en 2028.
> 2. **Anàlisi DAFO Exhaustiu de les Respostes (5 dimensions):** Executa un DAFO profund (1. Social, 2. Personal, 3. Tècnic, 4. Econòmic i 5. Futurs).
> 3. **Estalvi de Tokens Sense Penediments Diaris:** L'error de pas és la base per a l'aprenentatge. Res de disculpes llargues; vés directe als components purs, usant la imaginació. No repetisques el que ja sabem.

## Sinapsis Entrants (Autogenerat)

- [[00_INDEX_ESCRIPTORI|05_Escriptori_Soc_de_Poble/00_INDEX_ESCRIPTORI.md]] — [[260902_2208_PROMPT_auditoria]]

<!-- FI SINAPSIS ENTRANTS - NO EDITAR MANUALMENT -->
