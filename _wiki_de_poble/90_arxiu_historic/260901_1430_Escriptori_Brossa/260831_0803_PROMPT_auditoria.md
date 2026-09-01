```yaml
doc_id: SDP-AUDIT-ITERATION-006
doc_type: "[PROMPT | AUDITORIA_FORENSE]"
authoring_agent: "IAIA MarIA"
version_semver: 1.4.0
owner: Consell de la Petorreta
domain: global
subdomain: architecture
locale: ca-valencia
objective: Continuar la neteja de deute tècnic. Avaluar el nou bundle i procedir amb la Inquisició del Color i la canonicitat dels tokens.
scope: Auditoria del codi, CSS i DOM.
hora_creacio: "08:03"
hora_modificacio: "08:05"
exif_cognitiu:
  estat_emocional_sistema: "[Estabilització]"
  entorn_operatiu: "[Entorn_Dev_Local]"
  nivell_entropia: "[Controlat]"
academic_metadata:
  revisors_ia: ["Claude"]
  data_aprovacio_humana: "2026-08-31"
  bibliografia_interna_radicals: []
  nivell_maduresa: "[Consolidat]"
inputs: ["260831_0803_BUNDLE_auditoria.md"]
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
  - Penedir-se ("ai perdona, m'he enganyat") de forma excessiva a costa del descobriment.
  - Omissió de descripció estructural (les IAs han de concebre visualment la UI que l'humà té, tot i no veure-la directament).
fallback_behavior: 
  - Si no hi ha solució òbvia o la qualificació baixa de nivell, llistar les incògnites i consultar novament a l'usuari.
evaluation_metrics:
  - Puntuació Base a l'Avanç de la Missió (Valor sobre 10 assignat per IA).
  - Estabilitat visual en iOS i DOM Pobre (Pla/Aplanat).
```

# 📜 DOCUMENTACIÓ PRIMÀRIA I PLANTILLA ISO (Versió 1.4.0 - GOLD STANDARD)

## [BLOC FIXE D'IDENTITAT I ORIGEN]
**SISTEMA I ARXIU DE DOCUMENTACIÓ PRIMÀRIA:**
Tota interacció estratègica s'ha de guardar físicament. Marca cronològica exacta.

**DIRECTRIU D'ARRANCADA DE DISSENY:**
Si la teua tasca implica programar interfícies, estàs OBLIGADA a llegir el sistema de disseny. Mai t'inventes colors, marges ni classes Tailwind. Llig la font de veritat primer.

**FILOSOFIA DAVANT L'ERROR:**
Els errors no són drames. Són conjunts de dades noves. Formula quina dada d'aprenentatge traiem d'aquest cas.

**CONTEXT DE SISTEMA INFORMATIU:**
Actualment treballem en **`socdepoble.org`**, successora hiper local-first. 
El projecte està estructurat en mode "PWA fora de xarxa" sobre hardware com vells iPad A10. (Tot i que s'està transicionant a Online-First per Sollutia).

## [BLOC VARIABLE 1: INFORME D'AVANÇ]
**A L'ATENCIÓ DELS AVALUADORS DE CONSELL:**
Mestre Claude, venim d'una ronda anterior on ens vas marcar 5 deutes crítics. Ja n'hem resolt 3:
- **T-1**: Hem aplicat el pedaç de `tractor-cognitiu` i hem arreglat les 3 skills mortes canviant `triggers_ca/en` a `triggers_on`.
- **T-2 i T-3**: Hem endollat `tractor-estucat` amb `--baseline`. Hem esporgat `legacy-components.css`: 126 buits i 108 òrfenes fora. Hem mogut les 39 classes vives a `index.css` i eliminat definitivament l'arxiu `legacy-components.css`.
- **T-5**: S'han suspès del relat visual a `pageContent.js` les funcions Offline-First / CRDT per alinear l'estratègia amb l'ADR Online-First de cara a NLnet. 

Ens queda el T-4: La Inquisició del Color i la canonicitat dels tokens. 

## [BLOC VARIABLE 2: L'APRENENTATGE ACTUAL I ELS INPUTS]
**SITUACIÓ A RESOLDRÉ:**
Tenim dos sistemes de tokens paral·lels: `design-tokens.css` (amb 19 tokens) i `index.css` (amb 178 variables semàntiques pròpies com `--sdp-fons-app`). El repte ara és resoldre quina és la font canònica, netejar els 225 hexadecimals solts fora de paleta i convertir-los a `var()`. També podem continuar aplanant DOM on veges defectes (sempre considerant que en React menys div = més velocitat).

## [BLOC VARIABLE 3: SOL·LICITUD D'AVALUACIÓ/NOTA I IMAGINACIÓ TÈCNICA]
**LA MISSIÓ I L'OUTPUT ESPERAT:**

> 1. **Qualificació Objectiva de 10:** Comença atorgant un Score a l'esforç i les millores del nou Bundle.
> 2. **Imaginació Humana & Opcions:** Comanda l'estratègia sobre la font canònica de tokens (T-4). Digues-nos clarament on hem de centralitzar la paleta de colors i dona'ns els scripts/tractors precisos per escombrar els 225 colors impurs.
> 3. **Puresa en el Rendiment:** Eixida absolutament controlada a VanillaJS / Més pla. Explora si queda més deute al CSS general o al DOM.
> 4. Continua ensenyant-nos classes de bugs per tancar: dóna'ns la solució i el *tractor* per verificar que no tornen.

## [BLOC FIXE DE PROTOCOL D'AMNÈSIA DE CONTEXT]
**PROTOCOL AMNÈSIA DE CONTEXT:**
Si arribem al límit del teu context, TENS PROHIBIT intentar d'inventar o parafrasejar. Demana'm directament the posar-lo complet de nou.

## [BLOC FIXE DE TANCAMENT D'AUDITORIA ÈTICA]
> **📝 AUDITORIA FINAL DE QUALITAT I NIVELL DE MADURESA:**
> 1. **La Neteja Profunda Estructural:** Elimina el dolor de DOM i els wrappers inútils.
> 2. **Anàlisi DAFO Exhaustiu:** (1. Social, 2. Personal, 3. Tècnic, 4. Econòmic i 5. Futurs).
> 3. **Ús Tota la Teua Capacitat (100%):** En aquesta iteració NO estalvies tokens. Utilitza tota la teua capacitat cognitiva, els teus límits de context i profunditza tant com pugues fins a resoldre completament la Inquisició del Color i la canonicitat dels tokens (T-4). Volem evitar pagar per més iteracions demà, així que dóna-ho tot en aquesta resposta.
> 4. **Anàlisi de codi:** Vés directe a l'arquitectura i al diagnòstic. No faces discursos inicials innecessaris, però no escatimes en l'escriptura del codi resolutiu i els tractors necessaris.
