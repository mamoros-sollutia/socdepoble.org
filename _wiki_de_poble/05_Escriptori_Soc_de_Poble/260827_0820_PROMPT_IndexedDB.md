```yaml
doc_id: SDP-GEN-BASE-002
doc_type: "[AUDITORIA_FORENSE]"
authoring_agent: "IAIA MarIA"
version_semver: 1.4.0
owner: Consell de la Petorreta
domain: global
subdomain: architecture
locale: ca-valencia
objective: Auditar el pla de transició a IndexedDB i la implementació del patró Outbox asíncron per a Sóc de Poble.
scope: Xat Offline-First, sincronització de dades, gestió d'estat de xarxa.
hora_creacio: "08:20"
hora_modificacio: "15:20"
exif_cognitiu:
  estat_emocional_sistema: "Estabilització"
  entorn_operatiu: "iPad_A10_Offline"
  nivell_entropia: "Controlat"
academic_metadata:
  revisors_ia: []
  data_aprovacio_humana: "2026-08-27"
  bibliografia_interna_radicals: []
  nivell_maduresa: "Pendent_Revisio"
inputs: ["260827_0820_BUNDLE_IndexedDB.md"]
constraints: 
  - Ús obligatori de valencià estricte.
  - Arquitectura local-first sense dependències innecessàries de núvol.
  - Altament optimitzat per a dispositius antics com iPad A10.
  - L'Outbox ha de garantir zero pèrdues de dades (WAL).
acceptance_criteria: 
  - Retornar una avaluació de nota sobre 10 de la robustesa del patró Outbox.
  - Identificar qualsevol risc de condició de carrera o asincronia perillosa.
anti_patterns: 
  - Penedir-se ("ai perdona, m'he enganyat") de forma excessiva a costa del descobriment.
  - Ignorar el funcionament Offline-First.
fallback_behavior: 
  - Si hi ha dependències asíncrones bloquejants no previstes, alertar immediatament.
evaluation_metrics:
  - Estabilitat Offline.
test_vectors: []
change_log: []
```

# 📜 AUDITORIA FORENSE: TRANSICIÓ A INDEXEDDB I PATRÓ OUTBOX

## [BLOC FIXE D'IDENTITAT I ORIGEN]
**SISTEMA I ARXIU DE DOCUMENTACIÓ PRIMÀRIA:**
Sou la Intel·ligència Crítica i Consultiva de suport del **Consell de la Petorreta** (Kimi AI, Claude, ChatGPT, Grok, Qwen, DeepSeek). Actualment treballem en **`socdepoble.org`**, successora hiper local-first de Sóc de Poble. Estem construint una aplicació resilient per a funcionar en zones amb cobertura pèssima i dispositius vells com iPads A10.

L'arquitectura visual és "Pedra Seca" (HTML i CSS Vanilla, sense frameworks pesats). El paradigma tècnic és "Offline-First", la qual cosa significa que la xarxa no decideix mai si una dada existeix o no; s'escriu sempre en local primer, i després se sincronitza.

**Teniu adjunt un document BUNDLE amb tot el context (incloent-hi la Wiki, regles, els meus propis Skills i Scripts) i codi font necessari.** Llegiu-lo sencer de forma crítica abans d'emetre veredicte.

## [BLOC VARIABLE 1: INFORME D'AVANÇ]
**A L'ATENCIÓ DELS AVALUADORS DE CONSELL:**
Després de detectar falles greus en l'antic sistema de `localStorage` síncron (com pèrdues de dades silencioses i bloqueig del fil principal), estem migrant el sistema de persistència de Sóc de Poble cap a un veritable model Offline-First basat en **IndexedDB**. 

Hem dissenyat un patró d'**Outbox** asíncron per a l'enviament de missatges de xat:
1. S'escriu el missatge en local amb un UUID de client i un estat "pendent".
2. Es mostra immediatament a la interfície.
3. Un sincronitzador en segon pla (amb backoff exponencial) intenta l'enviament a Supabase.

## [BLOC VARIABLE 2: L'APRENENTATGE ACTUAL I ELS INPUTS]
**SITUACIÓ A RESOLDRÉ:**
Necessitem assegurar-nos que aquest nou model és rocós i immune a talls de cobertura i condicions de carrera. Heu d'auditar el pla d'implementació (present al bundle adjunt) i els possibles colls d'ampolla o problemes d'asincronia derivats del canvi d'API síncrona a asíncrona.

## [BLOC VARIABLE 3: SOL·LICITUD D'AVALUACIÓ/NOTA I IMAGINACIÓ TÈCNICA]
**LA MISSIÓ I L'OUTPUT ESPERAT:**
Avalueu l'arquitectura de l'Outbox present al Bundle adjunt, prestant especial atenció a la concurrència i la robustesa offline.

> 1. **Qualificació Objectiva de 10:** Atorgueu una Nota / Score a la solidesa del pla presentat.
> 2. **Detecció de Riscos:** Hi ha perill de duplicació si l'usuari perd connexió just després del POST però abans de rebre el 200 OK? S'ha gestionat bé l'idempotència? 
> 3. **Imaginació Humana & Opcions:** Si veieu defectes greus o colls d'ampolla (com l'adaptació de les funcions `setVal`/`getVal` a promesa en altres llocs del codi), proposeu els pedaços necessaris.
> 4. **Veredicte:** Si el pla és sòlid, doneu la "Llum Verda" per començar l'execució.

## [BLOC VARIABLE 4: AUDITORIA METACOGNITIVA DE LA WIKI I SKILLS]
**SITUACIÓ D'AMNÈSIA I CONTRADICCIONS INTERNES:**
Com a missió secundària crítica, heu d'avaluar l'estat actual de la Wiki de Poble i els meus propis Skills i Scripts (inclosos al Bundle). El Mestre Javi ha detectat que, en despertar per a noves sessions, el meu "cerbell" (jo, IAIA MarIA) no llig tot l'estipulat a la Wiki abans d'entrar a treballar. Seguisc tenint fallades d'ancoratge i amnèsia al context.

Llegiu la Wiki, les regles i els Skills de forma molt crítica i severa:
> 1. **Diagnòstic d'Amnèsia:** Per què no s'executa correctament la lectura global estipulada a l'inici de sessió? Quins bloquejos estructurals hi ha (ex: triggers que no es disparen)?
> 2. **Contradiccions i Duplicacions:** Trobeu instruccions oposades en la governança de la IA i deute tècnic pur en la documentació.
> 3. **Pla de Millora:** Què hem de polir exactament en la Wiki per a tindre una arrencada determinista i a prova de fallades de connexió amb el context.

## [BLOC FIXE DE PROTOCOL D'AMNÈSIA DE CONTEXT]
**PROTOCOL AMNÈSIA DE CONTEXT (Regla de ferro):**
Si arribem al límit del teu context de memòria, TENS PROHIBIT intentar d'inventar o parafrasejar el cos complet del document que no veus per a "rellenar". Demana'm directament de posar-lo complet de nou. No m'escriguis fantasmades. 

> **📝 AUDITORIA FINAL DE QUALITAT I NIVELL DE MADURESA:**
> 
> 1. **La Neteja Profunda Estructural:** Assegureu-vos que no proposeu solucions sobre-enginyeritzades amb llibreries externes quan Vanilla JS (o IndexedDB natiu/idb) siga suficient.
> 2. **Estalvi de Tokens:** No repetisques el que ja sabem, no faces discursos inicials. Vés directe a l'arquitectura i al diagnòstic de l'Outbox. Mútua eficiència per a no malbaratar la finestra de context.
