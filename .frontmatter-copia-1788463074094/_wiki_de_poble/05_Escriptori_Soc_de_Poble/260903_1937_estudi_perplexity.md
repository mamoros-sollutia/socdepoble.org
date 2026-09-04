```yaml
doc_id: SDP-GEN-BASE-001
doc_type: "ESTUDI_INTERN_IA"
authoring_agent: "Perplexity"
version_semver: 1.4.0
owner: Consell de la Petorreta
domain: global
subdomain: architecture
locale: ca-valencia
objective: Auditoria Internacional del Sistema complet
scope: Tot el sistema, arquitectura i disseny actual.
hora_creacio: "19:37"
hora_modificacio: "19:37"
exif_cognitiu:
  estat_emocional_sistema: "Auditoria"
  entorn_operatiu: "Entorn_Dev_Local"
  nivell_entropia: "Controlat"
academic_metadata:
  revisors_ia: ["Perplexity"]
  data_aprovacio_humana: "2026-09-03"
  bibliografia_interna_radicals: []
  nivell_maduresa: "Consolidat"
inputs: ["260903_1908_BUNDLE_auditoria.md"]
constraints: []
acceptance_criteria: []
anti_patterns: []
fallback_behavior: []
evaluation_metrics: []
test_vectors: []
change_log: []
```

# ESTUDI PERPLEXITY - AUDITORIA INTERNACIONAL

Score base: 7,4/10
La base és sòlida, coherent i amb una identitat tècnica pròpia: governança explícita, privacitat per defecte, arquitectura React/Vite amb persistència local parcial, PWA, fallbacks i una voluntat clara de funcionar en dispositius modestos. La nota no és més alta perquè el Bundle documenta moltes intencions i normes, però encara no demostra amb prou proves reprodüibles que el sistema complet siga local-first, offline, accessible i estable en un iPad A10.

Veredicte executiu
El projecte no presenta un problema principal de falta d’idees, sinó de distància entre contracte, implementació i evidència.

Fortaleses
La font de veritat està ben definida i separa identitat, governança, arquitectura i futur.
Es reconeix correctament que PWA i Service Worker no equivalen automàticament a funcionament offline complet.
IndexedDB, Dexie, Supabase i els modes seed, local i hybrid formen una bona base d’adaptació progressiva.
La privacitat per defecte està formulada com una regla de producte, no només com una declaració legal.
La prohibició de dades sensibles en logs i prompts externs és especialment valuosa.
La visió CRDT/WebRTC està ben etiquetada com a futura i no com una capacitat ja implementada.
La intenció de controlar el DOM, els embolcalls innecessaris i les classes visuals alienes és adequada.
La targeta universal té una anatomia visual recognoscible: caputxa, contingut i peu d’acció.
El projecte entén correctament que l’accessibilitat per a gent major exigeix llegibilitat, reversibilitat i absència de patrons foscos.

Debilitats principals
Hi ha una contradicció entre el requisit de “VanillaJS, sense Tailwind” i la baseline canònica, que continua sent React/Vite amb Tailwind instal·lat i importat.
Hi ha normes històriques que prohibixen Tailwind, però el contracte vigent permet utilitats de layout. Aquesta dualitat pot provocar decisions diferents segons l’agent que llija el Bundle.
El DOM pla encara és un objectiu normatiu, no una garantia demostrada amb mètriques.
L’afirmació de CI bloquejant necessita proves verificables: fitxers, scripts, eixides i casos negatius.
Els modes de persistència no semblen estar descrits per flux funcional complet: lectura, escriptura, cua, reconnexió, conflicte i recuperació.
La privacitat està ben definida, però cal provar-la en exports, caches, logs, errors, còpies locals i sincronització.
El document conté enllaços trencats o marcadors TODO, fet que debilita la reconstrucció automàtica.
La documentació és molt extensa i pot carregar massa context als agents, sobretot si no existeix una capa executiva mínima amb autoritat i precedència.
ATRC apareix com a integració conceptual, però no queda prou especificat com a algorisme executable, amb entrades, eixides, invariants i proves.

Arquitectura actual
Lectura estructural visual
La geometria que emergeix del Bundle és esta:
Aplicació └── Shell persistent ├── Navegació i estat global ├── Pàgina universal │ ├── Títol i etiquetes │ └── Contingut principal │ └── Graella │ └── Targeta universal │ ├── Caputxa: autor, poble, data, hora │ ├── Multimèdia opcional │ ├── Cos: títol, text, badges │ └── Peu: icones i Connectar └── Capes locals ├── Estat de la interfície ├── IndexedDB/Dexie ├── cua offline ├── Service Worker └── adaptador remot opcional
Aquesta forma és raonable, però la frontera entre shell, estat de domini, persistència i transport ha de quedar visible també en el codi. Si les decisions de backend es prenen dins dels components visuals, la promesa local-first es torna difícil de verificar.

Punt crític: React contra VanillaJS
La recomanació no és reescriure-ho tot en VanillaJS per principi. El mateix Bundle reconeix que React/Vite és la carcassa productiva legítima i que la migració a peces pures és una proposta futura.
La decisió més neta és:
Capa | Decisió recomanada
Aplicació actual | Mantindre React/Vite
Components universals | React amb HTML semàntic i CSS propi
Peces independents | VanillaJS o Web Components només quan hi haja un cas d’ús real
Persistència | Mòduls purs, sense dependència de React
Sincronització | Adaptador separat, encara no CRDT
CSS | Tokens i classes pròpies; Tailwind només amb una política inequívoca
Proves | Contractes independents del framework
Això permet assolir un DOM més pobre sense pagar el cost d’una reescriptura general.

Correccions prioritàries
P0 — Autoritat i contradiccions
Crear un únic document curt d’autoritat, per exemple:
00INDEX → 03GOVERNAR → CONTRACTE_BASELINE.md
Ha d’indicar, en este ordre:
Quina és la baseline real.
Què està implementat.
Què està verificat.
Què és una hipòtesi futura.
Quines normes anul·len les històriques.
Quins fitxers són canònics.
Quines comandes reprodueixen les proves.
La política visual ha d’escollir una sola opció:
Opció A: Tailwind queda limitat a layout i el CSS propi governa colors, radis, ombres i tipografia.
Opció B: Tailwind queda eliminat de la baseline i tot passa a tokens i CSS propi.
Per a la filosofia Pedra Seca, recomane l’Opció A a curt termini i una eventual retirada posterior només si una mesura de pes, manteniment o coherència ho justifica.

P0 — Contracte local-first per flux
Cada funcionalitat ha de tindre una fitxa com esta:
flux: crear-publicacio font-primaria: indexeddb funciona-sense-xarxa: true lectura-local: true escriptura-local: true cua-reintent: pendent sincronitzacio: hybrid conflicte: no-aplicable exportacio: json esborrat: local-verificat prova-dispositiu: pendent
No s’ha de declarar “local-first” per aplicació sencera. La declaració ha de ser per flux.

P0 — Proves negatives reals
El CI ha de demostrar que falla quan:
apareix una classe Tailwind prohibida;
s’utilitza style={{ ... }};
es crea una targeta fora del generador canònic;
la profunditat DOM supera el límit acordat;
falta aria-label en una icona interactiva;
un botó no arriba a 48 px;
es grava una dada sensible en un log;
una operació offline intenta dependre obligatòriament de Supabase.
Una regla que només està escrita però no té una prova negativa és una intenció, no un escut.

P1 — Persistència i sincronització
Separar clarament quatre conceptes:
Domini → Repositori local → Outbox → Transport remot
El repositori local ha de ser la primera operació observable:
Validar l’ordre.
Escriure en IndexedDB.
Actualitzar la interfície des de la dada local.
Afegir l’operació a l’outbox.
Intentar sincronitzar.
Marcar èxit, reintent o conflicte.
Permetre exportar i recuperar.
No recomane introduir encara CRDT/WebRTC. El Bundle mateix indica que requeririen identitat, permisos, xifratge, tombstones, migracions, garbage collection i recuperació davant corrupció.

P1 — ATRC executable
ATRC necessita una especificació tècnica mínima:
ATRC(input): 1. mesura càrrega actual 2. identifica operacions no urgents 3. aplica cooldown 4. prioritza lectura local i persistència 5. ajorna treball no crític 6. registra només mètriques mínimes 7. retorna decisió i motiu
Sense això, ATRC és una metàfora útil, però encara no un algoritme auditable.

Rendiment i iPad A10
Objectiu tècnic
El dispositiu de referència no ha de ser només una frase del document. Ha de tindre un perfil de prova fix.
Millores concretes
Evitar renderitzar tota la graella si hi ha centenars de targetes.
Paginar o carregar per blocs, sense introduir una virtualització complexa abans de mesurar.
No carregar imatges fins que siguen pròximes al viewport.
Declarar sempre width, height o aspect-ratio per evitar salts visuals.
Reduir icons i dependències duplicades.
Evitar actualitzacions globals quan només canvia una targeta.

Accessibilitat que falta demostrar
Cal provar, no només declarar:
focus visible en Safari i VoiceOver;
ordre de focus coherent;
anunci de càrrega i errors;
missatges d’èxit després de guardar localment;
estat offline comprensible;

Imaginació analítica
Opció 1 — Sistema de confiança per flux
Cada funcionalitat podria mostrar internament una etiqueta de maduresa (Local: verificat, Offline: parcial...)
Opció 2 — Mode Casa i mode Plaça
Separar conceptualment Casa (dades locals) i Plaça (dades compartides). Aquesta metàfora és comprensible per a gent no tècnica.
Opció 3 — Pressupost de complexitat
Cada dependència nova hauria d’aportar una fitxa de justificació.

Diagnòstic final
La base mereix una nota alta perquè hi ha criteri, identitat, governança i consciència de les limitacions. El salt fins a 9 o 10 no vindrà d’afegir més arquitectura, sinó de demostrar amb proves que:
el que és local realment s’escriu primer en local;
el que és offline funciona sense xarxa;
el que és accessible funciona amb VoiceOver;
el que és Pedra Seca està protegit per gates reals;
La dada d’aprenentatge central és clara: la simplicitat no es prova per la quantitat de normes, sinó per la distància curta entre una regla, una implementació i una prova que pot fallar de manera visible.
