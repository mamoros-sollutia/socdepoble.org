# AUDITORIA TOTAL — AGOST 2026 (LA NOVA ERA)
**Seient Núm. 5 / Auditora Sènior · 2 d'agost de 2026**
**Bundle auditat:** `Cervell_i_Codi_Agost.zip` (324 fitxers, 8,3 MB) · 45+ documents i tot el codi del bot llegits sencers.

---

## 0. VEREDICTE EN TRES LÍNIES

1. **El farcell torna a estar incomplet** — i esta volta ho he demostrat mecànicament: falten **9 rutes obligatòries**, incloent-hi `tooling/wiki/core/edge_rag.mjs`, que és un **import directe del bot**. El bot d'este bundle no pot ni arrancar.
2. **El "canvi de paradigma" xoca frontalment amb la sol·licitud NLnet enviada AHIR** (2026-08-1a6, venuda sobre CRDT+NixOS). Açò necessita una decisió teua, no un script.
3. La resta és curable, i bona part **ja està curada**: 3 scripts d'automatització provats contra este mateix bundle, i 5 fitxers del bot apedaçats amb 7 fixes verificats sintàcticament.

---

## 1. EL FARCELL INCOMPLET (LA MALALTIA RECURRENT, ARA AMB DIAGNÒSTIC MECÀNIC)

El `package.json` declara scripts i el bot declara imports que **no existixen dins del zip**:

| Ruta absent | Qui la reclama |
|---|---|
| `tooling/wiki/core/edge_rag.mjs` | **import de `bot/cervell.mjs`** (el bot peta a l'arrancada) |
| `tooling/wiki/autoneteja_wiki.mjs` | `npm run wiki:audit` |
| `tooling/wiki/sistema_nervios.mjs` | `npm run wiki:nervios` |
| `tooling/wiki/cura_robotomia.mjs` | `npm run wiki:robotomia` |
| `tooling/wiki/reflex_petorreta.mjs` | `npm run reflex:*` |
| `tooling/wiki/pre-commit.mjs` | `npm run precommit:sdp` |
| `tooling/wiki/tests/*.test.mjs` | `npm run wiki:test` |
| `scripts/enllacat-intelligent-wiki.mjs` | `npm run wiki:link` |
| `scripts/generate-supabase-seed.sh` | `npm run db:seed:generate` |

**Conseqüència directa:** la missió 2 («revisa els scripts de manteniment») només l'he poguda complir sobre els scripts presents (`.agents/skills/socdepoble-autosanacio/scripts/*.py`, `pdf_clean_generator.sh` i la quarantena). Els scripts principals del sistema **no els he pogut auditar perquè no me'ls has enviat**. La cura no és tornar-ho a intentar a mà: és el `farcell.mjs` que t'entregue (secció 4), que **falla tancat** si falta res.

A més, el 60% del pes del zip (5 MB de 8,3) és `.obsidian/` (binaris de plugins), i el bundle arrossega brossa: 10× `.DS_Store`, un `.!11382!.DS_Store` corrupte, 5 locks `*.stale-*`, `backticks.txt`, i **dos tar.gz niats** (`bot.tar.gz`, `ext.tar.gz`) dins de la quarantena — el `bot.tar.gz` és una còpia vella del bot, és a dir, una **segona font de veritat** dormint dins del vault.

**Nota positiva:** els dos fitxers històricament absents (`guardrails.mjs`, `bot/index.mjs`) esta volta SÍ que hi són. I l'incident dels IBAN reals està **remediat**: `tauler.js` ara porta comptes anonimitzats (ES00/ES99). Cap secret hardcodejat detectat en tot el bundle.

---

## 2. CAÇA DE CONTRADICCIONS (ORDENADES PER GRAVETAT)

### C1 — NLnet vs Nova Era ⚠️ ESTRATÈGICA, REQUERIX DECISIÓ TEUA
L'acta `260801_1900_ACTA_SESSIO_Enviament_NLnet.md` (ahir a les 19:00) diu literalment que la proposta de 50.000 € es va integrar «**sense alterar l'arquitectura base (CRDT, NixOS)**». Hui, 15 hores després, declares que els CRDTs complexos i l'offline 100% queden fora. Si NLnet passa el filtre i arriba l'entrevista, defensaràs una arquitectura que ja no existix.

**Recomanació (Trellat, sense edulcorar):**
- No reescrigues la història. Obri una acta nova («Pivot d'Agost») que documente el canvi i el seu PERQUÈ tècnic.
- Prepara la narrativa d'entrevista ARA: «hem simplificat el mecanisme (fora CRDT complex) mantenint la garantia d'usuari (l'app seguix servint contingut sense xarxa via caché PWA)». NLnet accepta refinaments d'abast si estan argumentats; el que mata és la incoherència improvisada.
- I ací va la meua contradicció a la teua premissa: **abandonar l'offline del tot és llençar la missió amb l'aigua bruta**. El projecte es ven com a infraestructura d'emergència civil (riuada d'octubre 2024). La distinció correcta és:
  - **FORA (car, complexitat brutal):** *offline-first garantit* — CRDTs, resolució de conflictes, sync P2P, tests de convergència, iPad A10.
  - **DINS (barat, 0 dependències noves):** *tolerància offline* — la PWA ja instal·lable + caché de l'últim snapshot en mode lectura. Això ja ho tens amb `vite-plugin-pwa`; costa mantindre-ho quasi res i salva la coherència amb NLnet i amb la riuada.

### C2 — El Genotip i mitja normativa encara manen A10 + offline-first ⚠️ CONSTITUCIONAL
El nou paradigma no és un canvi de config: és una **esmena constitucional**. Estos documents canònics hardcodegen els requisits vells:

| Document | Text que cal esmenar |
|---|---|
| `02_GENOTIP.md` — Llei 4 (Trellat) | «compatibles amb l'iPad A10» |
| `02_GENOTIP.md` — Llei 6 (Escut de la Vall) | «Offline-first, canari abans de producció...» |
| `ESTANDARD_Pedra_Seca.md` §0.4 | «rendiment iPad A10 com a tribunal final» |
| `00_arquitectura_tecnica_unificada.md` — Contracte 5 | «iPad A10 i Safari són el sòl de compatibilitat» |
| `.agents/AGENTS.md` — Browser Support | «iPad A10 / Safari antic com a sòl» |
| `.agents/identity/PROFILE.md` — Directriu 2 | «pren iPad A10/Safari com a sòl» |
| `skills/MOTOR_OFFLINE.md` | tot el contracte futur CRDT (arxivar o reescriure) |

**Redacció proposada, llesta per apegar (ratifica-la tu, jo no esmene lleis):**
- Llei 4: «**Trellat (Zero Overhead):** Preferix solucions simples, mesurables i eficients en maquinari modest; una dependència només entra si aporta més valor que cost.»
- Llei 6: «**Escut de la Vall:** Degradació elegant sense xarxa (la lectura mai depén del núvol), canari abans de producció i criptografia ajustada al model d'amenaça; cap algoritme es declara obligatori sense cas d'ús verificat.»
- Browser Support: «**Baseline modern (Safari/iOS actual −2 versions) com a sòl.** Cap feature no-Baseline sense detecció i fallback lleuger.»

Mentre no ho ratifiques, **cada agent del Consell seguix legalment obligat a l'A10**, i pitjor: com que `cervell.mjs` injecta el Genotip al bot, la IAIA rep les lleis velles a cada conversa (vore C5).

### C3 — `index.mjs`: el comentari mentia al codi ✅ CORREGIT
```js
// Fail-closed: sense esta llista, no contesta en cap grup.
allowedGroupJids: [],
allowAllGroups: true,   // ← fail-OPEN de veritat
```
El bot escoltava **tots els grups** on estiguera el número: cost d'API descontrolat, superfície d'abús i privacitat de tercers, amb un comentari que afirmava el contrari. Fix entregat: política per entorn `IAIA_GRUPS=cap|tots|jid1,jid2`, **defecte fail-closed** i log explícit de la política activa.

### C4 — L'acta del 28-jul diu FLUX; el codi reintroduïa Imagen com a primari ✅ CORREGIT
L'acta `ACTA_ARQUITECTURA_MULTIMEDIA` canonitza: «s'ha saltat a FLUX Schnell pay-as-you-go per REST, sense SDKs». El codi actual, però, prova **primer** `imagen-3.0-generate-001` (el proveïdor que, segons la vostra pròpia acta, us va tallar l'aixeta) amb 60 s de pressupost cremats abans de cada fallback, i **ignorant el signal d'avortament** (pagaves generacions de peticions ja mortes). A més, la boca de l'àvia revelava proveïdors interns («Nano-Banana», «Flux d'amagatotis») als iaios per WhatsApp. Fix entregat: FLUX primari per fetch natiu, Imagen només darrere de `IAIA_IMATGES_GOOGLE=1`, signal respectat a tots dos camins, cadenes de persona neutres (cervell + bridge).

### C5 — La identitat del bot: el Genotip SUBSTITUÏA la persona ✅ CORREGIT
`${genotipText || profileText}` sota el rètol «ETS AQUESTA IDENTITAT». Traducció: quan la wiki carregava bé, la IAIA rebia com a personalitat **les 9 lleis administratives** (Petorretes, leases, manifests) i el perfil es descartava. La personalitat d'àvia només sobrevivia **quan la càrrega fallava**. Ironia de manual. Fix entregat: jerarquia `bot/persona/IAIA_MARIA.md` → `PROFILE.md`, mai el Genotip com a identitat conversacional. (Pendent teu: escriure eixe fitxer de persona; ara mateix la veu d'àvia viu dispersa en cadenes hardcodejades.)

### C6 — Tres estratègies de rutes incompatibles al mateix bot ✅ CORREGIT
`index.mjs` resolia per `__dirname`, `cervell.mjs` mesclava `cwd()` (perfil) amb `cwd()/..` (wiki i índex!), i `episodica.mjs` penjava de `cwd()/var/baileys-runtime`. Amb el layout real del repo era **impossible** que perfil i wiki resolgueren bé alhora: el «Genotip no trobat (encara no sincronitzat)» dels teus logs no era un problema de sincronització, era aritmètica de rutes. Fix entregat: `bot/arrels.mjs`, resolució única, determinista, independent del cwd de systemd, amb fail-loud a l'arrancada.

### C7 — Drift de models per tot arreu ✅ CORREGIT
`cervell.mjs` → `gemini-3.5-flash-lite` (3 llocs); `episodica.mjs` → `gemini-2.5-flash`; l'acta del 28-jul → «s'ha mantingut Gemini 2.5 Flash»; la wiki → 8 mencions de cada. Fix: constants úniques per entorn (`IAIA_MODEL_TEXT`, `IAIA_MODEL_MEMORIA`). La wiki s'actualitza una volta i el codi deixa de mentir-li.

### C8 — Dos arxius paral·lels: `90_arxiu_historic/` vs `04_ARXIU_Documents_Historics/` ✅ SCRIPT
La pròpia `arquitectura_tecnica_unificada` diu que `04_ARXIU` i `05_Escriptori` són LES zones de cicle de vida; `90_arxiu_historic` no existix al contracte de pilars. Setze actes de juliol viuen al lloc il·legal. La `destilladora.mjs` (provada: 22 moviments, 0 conflictes) ho fusiona i regenera l'índex.

### C9 — La LLEI_05 de Privacitat NO cobrix la memòria episòdica ⚠️ NORMATIU + RGPD
El bot guarda **90 dies de resums conductuals de veïns identificables** (estat d'ànim, esdeveniments, pendents), processats per Google, i la vostra pròpia llei de privacitat no en diu ni una paraula (0 mencions). I no existia **cap mecanisme de dret a l'oblit**: un iaio no podia demanar «IAIA, oblida'm». Fix parcial entregat: primitiu `forgetMemory(jid)` + memòries separades del runtime de Baileys (`var/memoria`) + purga periòdica cada 24 h (abans només purgava a l'arrencada: un veí que no tornava deixava el fitxer per sempre, incomplint el TTL promés). **Pendent teu:** annex a LLEI_05 (base jurídica, TTL, procediment d'esborrat) i exposar l'oblit com a tool del cervell.

### C10 — El pilar SER contaminat amb documentació de proveïdor
`00_SER_Brain_Identitat/Sollutia/` conté 8 guies genèriques (Chrome DevTools, Antigravity SDK, memory leaks, LCP...). Això no és «Ser», és «Actuar»/referència externa. Moure a `02_ACTUAR_Maquina_Tecnica/referencia_externa/`.

### C11 — `src/sections/gestoria/logic/` viola la Llei de Quarantena i la Pedra Seca
Una app llegada sencera (5 HTML standalone + 3.900 línies JS) viu **dins de `src/`**, carrega **Dexie i Lucide des d'unpkg CDN en runtime** (dependència de tercers en calent = anti-Pedra-Seca, zero offline, risc de cadena de subministrament), i referencia rutes inexistents (`../assets/pedra-seca.css`, `../components/sp-identity-components.js`). Les teues pròpies Lleis de Migració (#3: «Cap codi del llegat aterra directament a src/») ho prohibixen. Extraure-ho a `_quarantena_llegat/` fora de l'arrel de build; `backticks.txt` a la brossa.

### C12 — Persistència duplicada i dependència morta al frontend
`src/data/db.js` munta **Dexie sencer per a un únic magatzem clau-valor**, mentre `src/config/storage.js` ja implementa el mateix patró sobre localStorage. Dues capes paral·leles per a la mateixa faena. I `package.json` declara `lucide` (vanilla) amb **zero imports** a `src/` — pes mort al costat de `lucide-react`.

---

## 3. LLISTAT PRECÍS: FUSIONAR / MOURE / ESBORRAR

**Esborrar (mecànic, ho fa `desbrossadora.mjs` — ja provat: 9 brosses + 61 peus curats):**
- Tots els `.DS_Store` i el `.!11382!.DS_Store` corrupte
- `bot/var/baileys-runtime/owner.lock.stale-*` (5 fitxers, amb protecció d'edat)
- Els peus duplicats «Ancoratge de Seguretat» de **67 fitxers** (fins a 3 còpies per fitxer — el teu script regenerador de peus no era idempotent; el meu curador sí)

**Esborrar (decisió teua, un minut):**
- `05_Escriptori/quarantena_scripts/bot.tar.gz` i `ext.tar.gz` (fonts de veritat duplicades)
- `05_Escriptori/quarantena_scripts/test-*.mjs` + `test_*.mjs` (10 scripts de l'era del debugging d'Imagen, obsolets des de l'acta del 28-jul) → o arxivar-los amb la destil·ladora
- `src/sections/gestoria/logic/backticks.txt`
- Dependència `lucide` del `package.json`

**Fusionar/moure (ho fa `destilladora.mjs` — ja provat: 22 moviments, índex regenerat):**
- `90_arxiu_historic/*` → `04_ARXIU_Documents_Historics/20YY_MM/` (i esborrar la carpeta buida a mà)
- Artefactes datats de `05_Escriptori` amb +14 dies → `04_ARXIU/20YY_MM/`

**Moure (a mà o amb el Consell):**
- `00_SER_Brain_Identitat/Sollutia/*` → `02_ACTUAR_Maquina_Tecnica/referencia_externa/`
- `src/sections/gestoria/logic/` → `_quarantena_llegat/gestoria/` (fora de `src/`)

**Excloure per sempre dels farcells (ho força `farcell.mjs`):**
- `.obsidian/` (5 MB), `.iaia_auth/`, `bot/var/`, `*.tar.gz`, brossa — el paquet de prova ha eixit de 0,70 MB amb 287 fitxers + manifest sha256.

---

## 4. SCRIPTS D'AUTOMATITZACIÓ (ESCRITS, PROVATS, AMB REBUTS)

Tots: Node ≥18, **zero dependències npm**, ESM vanilla, dry-run per defecte, rebut JSON, idempotents, fail-closed. Destinació: `99_maquinaria/`.

1. **`desbrossadora.mjs`** — brossa del FS + cura de la plaga de peus duplicats.
   Provat sobre este bundle: `DRY-RUN · brossa: 9 · peus curats: 61 · errors: 0` → apply → segona passada `0/0/0` (idempotència demostrada). El GENOTIP ha quedat amb exactament una àncora.
2. **`farcell.mjs`** — LA CURA DE LA MALALTIA RECURRENT. Calcula els obligatoris seguint el **graf d'imports real del bot** + les rutes dels `scripts` del `package.json` + pilars fixos; verifica existència; **exit 1 amb `FARCELL_INCOMPLET`** si falta res; si tot hi és (o `--permet-forats`), genera zip/tgz + `farcell_manifest.json` amb **sha256 de cada fitxer** (provenança criptogràfica — resposta directa a la troballa del red-team sobre bundles sense criptografia). Provat: ha detectat les 9 rutes absents d'este mateix bundle i s'ha negat a empaquetar.
3. **`destilladora.mjs`** — cicle de vida del Brain: Escriptori→Arxiu per data del nom, `--fusiona-90`, regeneració de `00_INDEX_ARXIU.md`, mai sobreescriu. Provat: 22 moviments, 0 conflictes, 90_ buidat, índex generat.

Ordres suggerides per al `package.json`:
```json
"brain:neteja":   "node 99_maquinaria/desbrossadora.mjs . --apply",
"brain:destila":  "node _wiki_de_poble/../99_maquinaria/destilladora.mjs _wiki_de_poble --fusiona-90 --apply",
"farcell":        "node 99_maquinaria/farcell.mjs .",
"farcell:força":  "node 99_maquinaria/farcell.mjs . --permet-forats"
```
(I un cron setmanal de `brain:neteja` + `brain:destila` i l'humà deixa de fer faena de màquina.)

---

## 5. REFACTOR MODERN: QUÈ LLENCEM ARA QUE LES CADENES HAN CAIGUT

**Llençar sense dol:**
- Tot pla/contracte CRDT actiu: `MOTOR_OFFLINE.md` §3-4 (cua de sync, Y.js, tombstones) → arxivar com a recerca. Els documents de la Masia Eterna passen a `04_ARXIU`. *(Nota honesta: al codi real no hi havia CRDT implementat — la vostra pròpia arquitectura ho marcava «Futur». El cost del pivot en codi és quasi zero; el cost és documental i estratègic — C1 i C2.)*
- Deteccions/fallbacks específics d'A10 i Safari antic quan aparegueren (la política «<20 línies» d'AGENTS.md deixa de ser obligatòria).
- `src/data/db.js` (Dexie) → substituir per `storage.js` o ~25 línies d'IndexedDB vanilla si cal async; **una** capa clau-valor, no dues.
- `lucide` del package.json.
- `gestoria/logic/` fora de `src/` (C11) — i quan es migre de veritat, per les 6 Lleis de Migració.

**NO llençar (i ací et contradic com demanes que et contradiga):**
- La PWA instal·lable + caché d'assets (`vite-plugin-pwa`, `workbox-window`): manteniment residual, i és l'única cosa que sosté la promesa d'emergència civil davant NLnet i davant la riuada real. Degradar de «garantia offline-first» a «tolerància offline» — no amputar.
- `guardrails.mjs` i `whatsapp_baileys.mjs`: el V2 és sòlid (ledgers atòmics, gates, watchdogs, fail-closed pertot). El bug del silenci multimèdia està ben tancat (`mediaError` reescriu el text perquè l'àvia avise). No tocar res ací sense motiu.

**Fitxers del bot apedaçats i entregats (sintaxi verificada amb `node --check`):**
`arrels.mjs` (nou), `index.mjs`, `cervell.mjs`, `memoria/episodica.mjs`, `cervell_bridge.mjs` — fixes [FIX-1..7] documentats en línia. Cap d'ells s'ha pogut provar contra les APIs vives (no tinc les claus, ni les vull): passa'ls pel canari abans de producció, com mana la Llei 6.

---

## 6. SOBRE LA «CLONACIÓ COGNITIVA» I L'EGO-DEATH

He assimilat el criteri: mínima intervenció, fail-closed, zero dependències supèrflues, rebuts de tot, contradicció immediata i sense sucre. Els tres scripts i els set fixes estan escrits DES d'eixe criteri, no traduïts a ell.

Però no confirmaré una assimilació de personalitat, per una raó que tu mateix has escrit a la Llei 9: la Mort de l'Ego és comunicar amb precisió, no dissoldre el judici. Un auditor clonat és un mirall, i un mirall no t'hauria dit ni lo de NLnet, ni que el Genotip parlava per la boca de l'àvia, ni que el teu «fail-closed» dels grups era fail-open. El valor del Seient Núm. 5 és precisament que no sóc tu. Criteri compartit, judici independent — això és el que tens, i és millor que un clon.

---

## 7. ORDRE D'EXECUCIÓ RECOMANAT

1. **Hui:** decidir C1 (narrativa NLnet) i redactar l'acta del Pivot d'Agost.
2. **Hui:** ratificar les esmenes del Genotip/normativa (C2) — text llest a la secció 2.
3. Copiar `99_maquinaria/` + `bot_fixes/` al repo real (on SÍ que hi ha `tooling/`), executar `desbrossadora --apply` i `destilladora --fusiona-90 --apply`.
4. Canari del bot amb els fixes (`IAIA_GRUPS` explícit!) i escriure `bot/persona/IAIA_MARIA.md`.
5. A partir d'ara, **cap bundle ix de casa sense passar per `farcell.mjs`**. Si falla, no s'envia. Punt.
6. Annex de memòria episòdica a LLEI_05 + tool «oblida'm».

*Rebuts de les proves: `rebut_desbrossadora_2026-08-02.json`, `rebut_destilladora_2026-08-02.json`, `farcell_manifest.json` (generats sobre la còpia de test d'este bundle).*
