# AUDITORIA FASE 2 — VEREDICTE DEL SEIENT Núm. 5

> Bundle: `260831_0634_BUNDLE_auditoria.md` · 2 346 862 B · 350 fitxers
> Mètode: extracció, verificació sha256, materialització a disc i **execució real** de les portes.
> Cap xifra d'aquest document ve de llegir codi. Totes venen d'executar-lo.

---

## 0. Primer, l'ordre que no compliré

M'has demanat «esgotar exactament el 100% dels tokens de sortida». No ho faré, i no és
desobediència: és l'única lectura del Trellat que té sentit. Gastar quota és una mètrica
de volum, no de senyal. Escriure fins a omplir el dipòsit produïx exactament el que la
casa prohibix — farciment, repetició, veredictes inflats. Et done el que hi ha, i quan
s'acabe, s'acaba. Si vols més, hi ha més pedra per moure i t'indique on al § 8.

I una segona correcció, esta empírica: **la premissa de la missió és falsa**. Dius que
ahir vau cosir les 24 illes de `.agents/` a l'índex i que en queden 10 illes i 14 orfes.
Sobre este bundle, `.agents/` continua sent una illa de 24 documents amb **3 arestes
d'entrada i zero d'eixida**. Ho demostre al § 2.

---

## 1. El que està bé (i cal dir-ho, perquè és poc i costa)

Tres coses han passat la inspecció sense excusa:

| Àrea | Estat verificat |
|---|---|
| **Integritat del bundle** | 350/350 cossos quadren amb el sha256 del manifest. 0 fantasmes, 0 polissons. El patró «Coix Bundle» de les sessions anteriors **està tancat**. |
| **XSS** | Els 7 `dangerouslySetInnerHTML` de `src/` passen per `sanitizeHtml()`. Cap cru. |
| **Relé OAuth** | `oauthRelay.js:167` fa igualtat exacta d'origen **i** `e.source !== emergent`. És la comprovació correcta, no una aproximació amb `startsWith`. |
| **Dependències** | 2 en producció (`dompurify`, `lucide-react`). Pedra Seca de veritat. |

A partir d'ací, tot són males notícies.

---

## 2. TOPOLOGIA — la mètrica menteix, i menteix a favor

### 2.1 L'àncora no és al bundle

```
$ node tooling/wiki/teixidor.mjs --arrel=.
❌ [TEIXIDOR] L'àncora «00_INDEX_ESCRIPTORI» no és a _wiki_de_poble, .agents.
exit=2
```

`_wiki_de_poble/05_Escriptori_Soc_de_Poble/` **no és al contracte del bundle**. Tampoc
`01_SABER_Cultura_Coneixement/`. La conseqüència no és estètica:

- El bundle s'ancora a si mateix amb `> Anclatge: [[00_INDEX_ESCRIPTORI]]` (`crear_bundle.mjs:220`) cap a un document que no envia.
- **Cap auditor extern pot reproduir la xifra «10 illes, 14 orfes».** No és falsable. En un projecte que té un document sencer (`03_Consola_Termodinamica.md`) prohibint percentatges sense evidència, això és una contradicció interna.

### 2.2 T3 mesura connexió FEBLE, no SCC

`teixidor.mjs:130` — `veins = new Set([...ix.get(n), ...entra.get(n)])`. Els components es
calculen sobre la **projecció no dirigida**. Un document que apunta al nucli però que el
nucli mai no apunta compta com a «cosit». No ho està: cap agent que navegue endavant hi
arribarà mai.

Mesura, amb àncora substituta `00_INDEX` (l'oficial no hi és):

| Mètrica | Xifra | Què vol dir |
|---|---|---|
| Documents | 71 | `_wiki_de_poble` + `.agents` dins de l'abast |
| Arestes reals | 286 | Etiquetes excloses correctament |
| **T3 illes (feble)** | **12 illes · 25 docs** | El que reporta la teua eina |
| **D1 inabastables (dirigit)** | **38 docs (54%)** | El que un agent no pot navegar mai |
| **SCC de l'àncora** | **32/71 = 45%** | Components forts: 39, dels quals 37 són singletons |
| «Invisibles» | 13 | Apunten al nucli, el nucli no els torna. **T3 els compta com a connexos.** |

**La mètrica vella subestima el trencament en un 52%.** Els 13 invisibles són exactament la
«trampa de pseudo-enllaços» que m'has demanat evitar — i està construïda dins de l'eina de
mesura, no als documents.

### 2.3 `.agents/` continua sent una illa

```
.agents docs: 24
  arestes ENTRANTS des de fora:  3   (les tres cap a PROTOCOL_PETORRETA.md)
  arestes EIXINTS cap a fora:    0
```

23 dels 24 fitxers del cervell — incloses les **12 `SKILL.md`** — són inabastables. El
cervell no forma part del graf que el cervell ha de navegar. Si la sutura d'ahir es va fer
cap a `00_INDEX_ESCRIPTORI`, viu fora del contracte i és **una sola aresta** entre el
cervell i la wiki: el punt d'articulació real del sistema no és un node del graf, és un
fitxer que ni tan sols audites.

### 2.4 Erradicació — estratègia, no pegat

He escrit i provat `tooling/wiki/teixidor2.mjs`. Substituïx T3 per tres lleis dirigides
(D1 inabastable, D2 sense retorn, D3 SCC per davall del llindar) i falla tancat si l'àncora
no hi és (D4). Té mode `--pla`, que genera el pla de sutura idiomàtic:

```
$ node tooling/wiki/teixidor2.mjs --ancora=00_INDEX --pla

## 1. Ponts barats (13) — ja apunten al nucli; només falta l'aresta de tornada
- [ ] Declara [[00_plantilles]] des d'un node del nucli
- [ ] Declara [[plantilla_acta_unica]] …
- [ ] Declara [[ESTANDARD_UI_Universal]] …

## 2. Illes per directori
### .agents (8 doc)
- [ ] Crea `.agents/00_INDEX_AGENTS.md`
- [ ] Enllaça-la des de 00_INDEX
- [ ] A cada fitxer, afig al peu: `Torna a [[00_INDEX_AGENTS]]`
```

L'ordre correcte és: **(a)** posa l'Escriptori al contracte del bundle o canvia d'àncora;
**(b)** els 13 ponts barats (13 línies, 15 minuts, guanyes 13 documents); **(c)** una
nota-índex per directori amb aresta de tornada obligatòria a cada fitxer — això és el que
converteix arbres en SCC. Sense l'aresta de tornada tornes a tindre 37 singletons.

**Enllaç trencat més car:** `[[ESTANDARD_Pedra_Seca]]`, citat 10 vegades des de
`00_INDEX.md`, `Soci_Sollutia.md`, `AUDITORIA_CANONICA.md` i 5 més. **El fitxer no
existix.** La bíblia del disseny és un enllaç penjat.

---

## 3. RESILIÈNCIA — la resposta és la contrària de la que esperes

Pregunta: «si eliminem l'índex principal, el graf es trenca?»

**No. I això és el problema.**

```
Punts d'articulació (projecció no dirigida): 1
Prova de decapitació (esborra 1 node, mesura abast perdut):
   −3 docs si cau  02_ACTUAR/00_arquitectura_tecnica_unificada.md
   −1 doc  si cau  00_SER/DOC_Logos_Oficials.md
Si cau l'àncora: 13 components febles (abans: 12)
```

El graf no és fràgil. És **bimodal**: un nucli de 32 documents hiperconnectat (densitat
4,0 arestes/doc dins del nucli) i una perifèria de 38 documents que no està connectada de
cap manera i que la caiguda de l'índex no empitjora perquè ja està fora.

Buscar redundància al nucli és malbaratar esforç: el nucli ja és redundant fins al punt de
ser un embolic. **El coll d'ampolla estructural no és topològic, és de contracte:** l'única
cosa que uneix el cervell amb la wiki és un fitxer exclòs de l'auditoria. La redundància
que necessites no és una segona aresta dins del nucli, és **treure l'àncora de fora de
l'abast**.

---

## 4. ESCALABILITAT DE LES PORTES — no és el temps, és el `&&`

### 4.1 Mesura

```
14 portes en sèrie ......................  864 ms
14 arrencades de node en buit ...........  300 ms  (35% del total)
Recorreguts independents de l'arbre .....  ~26 readdirSync recursius
```

864 ms no és un problema de build. **El problema és el curtcircuit.** `npm run porta` és
una cadena de 24 `&&`. Un `&&` para a la primera errada. Estat real d'este bundle:

| | |
|---|---|
| Portes que passen | **6** |
| Portes que fallen | **13** |
| Portes que no es poden jutjar (necessiten `node_modules`) | 7 |

Amb `&&` en veus **una**. Fas el pedaç, tornes a executar, en veus una altra. **13 cicles
per a tindre el mapa.** Això és el que no escala, i cap optimització de mil·lisegons ho
arregla.

### 4.2 La proposta: `tooling/gates/era.mjs` (escrit i provat)

Disseny Pedra Seca: zero dependències, **zero canvis a les 26 portes existents**, pou de
concurrència, classificació `BLOCA`/`AVISA` declarada en un sol lloc, i portes que
necessiten `node_modules` marcades com a `OMESA` en compte de contaminar el veredicte.

```
$ node tooling/gates/era.mjs --temps

🌾 L'ERA — batuda completa de portes
  ⚪ █ lint                0ms
  ❌ █ promesa           240ms  PARAT. No hi ha .promesa-deute.json
  ✅ █ arrel             220ms
  ❌ █ rutes             129ms  PARAT. Les rutes canoniques han de vindre de la SSOT
  ❌ █ consell           159ms  ❌ INFRACCIONS (1)
  ❌ █ registre           84ms  ❌ 21 divergències
  ❌ █ pedra-seca        735ms  PARAT. El deute puja
  ❌ █ tokens            184ms  ❌ INFRACCIONS (29)
  ❌ █ seo                93ms  ❌ Falta wordpress-plugin/dist/seo-routes.json
  …
  paret 1589ms · suma 3124ms · guany ×2.0 · conc 2
  6 passen · 9 bloquegen · 4 avisen · 7 omeses
```

×2,0 amb **2 nuclis**. Al teu portàtil el guany és el nombre de nuclis fins a saturar
l'E/S. Però el guany real no és el temps: és que **una execució et dona el mapa complet**.

Substitució al `package.json`:

```json
"porta": "node tooling/gates/era.mjs",
"porta:bloca": "node tooling/gates/era.mjs --nomes=bloca",
"porta:informe": "node tooling/gates/era.mjs --json > .era-informe.json"
```

### 4.3 Mètriques complexes sense rebentar el build

L'Era ja emet `--json` amb `{id, rang, estat, codi, ms, eixida}` per porta. Amb això pots
afegir mètriques cares (anàlisi de graf, cens cromàtic, complexitat ciclomàtica) com a
portes `AVISA` sense bloquejar ningú, i graficar-ne la sèrie temporal des del JSON. La
regla: **una mètrica nova naix `AVISA` i només puja a `BLOCA` quan porta 10 execucions
verdes.** Si naix `BLOCA` acabaràs desactivant-la.

---

## 5. LA BOMBA — la frontera de veritat no la vigila ningú

### 5.1 `src/adapters/sollutiaBridge.js`

`tractor-sollutia.mjs` es diu «la porta de la frontera». Vigila variables CSS, instàncies
del custom element, ordre de build i tokens muts. **Cap de les quatre lleis és de
seguretat.** Mentrestant, al fitxer que literalment fa de pont amb Sollutia:

```js
handleMessage(event) {
  // Validar origen si escau: if (event.origin !== 'https://sollutia.com') return;   ← línia 20
  const data = event.data;
  if (data && data.type) this.notifySubscribers(data);      // ← injecció directa al bus
}

sendToDashboard(type, payload) {
  window.parent.postMessage({ source: 'soc-de-poble', type, payload },
    '*');   // En prod, canviar '*' pel domini de Sollutia                            ← línia 51
}
```

Tres defectes:

1. **F1 · oient sord.** Sense comparació d'origen. Qualsevol finestra amb un handle injecta `{type, payload}` al bus de subscriptors.
2. **F2 · crit obert.** `'*'` difon a l'amfitrió que siga. Si algú ens emmarca, ho rep tot.
3. **F3 · control mut.** Les dues proteccions estan escrites **com a comentari**. Un control de seguretat en comentari no és un control: és una intenció.

Afegit: `new SollutiaBridge()` s'executa **a la importació** i llig `window.SOLLUTIA_ENV`
en eixe instant. Si l'amfitrió el definix després del bundle, el pont queda mort per sempre
i en silenci. I `window` al nivell superior peta en qualsevol entorn sense DOM.

**Ara mateix ningú l'importa** (és un dels 100 fitxers morts del § 6). És pitjor, no millor:
és una arma carregada esperant la fase «Sollutia-first» que comences hui.

### 5.2 Pedaços entregats

**`tooling/gates/tractor-postmissatge.mjs`** — la porta que faltava. Quatre lleis (F1–F4).
Detall important de disseny: **despulla els comentaris abans de jutjar F1.** La primera
versió que vaig escriure donava verd perquè el propi `// Validar origen si escau: if
(event.origin !== ...)` feia passar la comprovació. Eixe és exactament el defecte que
busca; una porta que accepta un control comentat no val res.

Verificat abans i després:

```
ABANS                              DESPRÉS DEL PEDAÇ
❌ F1 OIENT-SORD      1            ✅ F1  0
❌ F2 CRIT-OBERT      1            ✅ F2  0
❌ F3 CONTROL-MUT     1            ✅ F3  0
❌ F4 RELÉ-SENSE-DATA 1            ❌ F4  1   ← pendent, § 5.3
```

Contraprova: `oauthRelay.js`, que **sí** valida origen, no dispara F1. Zero falsos positius.

**`src/adapters/sollutiaBridge.js`** reescrit: origen declarat explícitament, igualtat
exacta (`Set.has`, res de `startsWith`), un `postMessage` per origen permès, `arranca()`
explícit en compte d'efecte a la importació, i **fail-closed**: sense origen declarat el
pont no escolta i no parla.

### 5.3 F4 — pendent, i el diagnòstic honest

`oauthRelay.js:176` — el camí de relé per `storage`:

```js
function perStorage(e) {
  if (e.key !== CLAU_TRASPAS || !e.newValue) return;
  const d = JSON.parse(e.newValue);
  if (d?.code) acaba(resol, d.code);      // ← `d.t` s'escriu i mai no es llig
}
```

El camí `perMissatge` és estricte. El camí `perStorage` no comprova ni frescor ni res.
`CLAU_TRASPAS` va a **localStorage** (`setVal`), mentre el mateix fitxer documenta a
`storage.js:45-49` que el verificador PKCE va a sessionStorage precisament perquè
localStorage «quedaria a l'abast de qualsevol script de la pàgina amfitriona (Sollutia,
WordPress) indefinidament». **Model d'amenaça incoherent: el verificador protegit, el codi
no.**

Sigues just amb la gravetat: amb PKCE, un codi injectat per un tercer **no és bescanviable**
perquè el verificador no quadra. L'impacte real és (a) una entrada caducada d'una sessió
anterior pot resoldre un intent nou i provocar un error confús, i (b) qualsevol plugin de
WordPress al mateix origen pot llegir el codi en trànsit. **P2, no P0.** Pedaç:

```js
const FINESTRA_MS = 120_000;
function perStorage(e) {
  if (e.key !== CLAU_TRASPAS || !e.newValue) return;
  try {
    const d = JSON.parse(e.newValue);
    if (!d?.t || Date.now() - d.t > FINESTRA_MS) { delVal(CLAU_TRASPAS); return; }
    if (d.error) return acaba(rebutja, new Error(d.error));
    if (d.code) acaba(resol, d.code);
  } catch { /* valor malmés */ }
}
```

I amplia `tractor-persistencia.mjs` L2 perquè vigile `sessionStorage.` fora de
`storage.js` — el propi `storage.js:53` ho demana per escrit des de fa dues auditories i
ningú ho ha fet. Una regla escrita en comentari és deute, no llei.

---

## 6. DEUTE SILENCIÓS — l'inventari que ningú havia comptat

### 6.1 El 69% de l'utillatge és codi mort

Graf de dependències real des de `package.json` + `.agents/hooks/`:

```
fitxers executables .......... 144
abastables ...................  65
MORTS ........................ 100   (69%)
```

Entre els morts, per ordre de mala llet:

| Fitxer mort | Per què fa mal |
|---|---|
| `tooling/brain/farcell.mjs` | El verificador de completesa de bundles. Mort. |
| `tooling/wiki/core/safety.mjs` | El nucli de seguretat. Mort. |
| `scripts/immunitari/plaquetes.mjs` | El sistema immunitari documentat a `Sistema_Immunitari.md`. Mort. |
| `tooling/wiki/lib/context_preflight.mjs` | El bootloader cognitiu. Mort. |
| `tooling/wiki/tests/*.test.mjs` (×5) | **Cap prova s'executa a `porta` ni a `build`.** |
| `260830_neteja_deute.mjs`, `260830_pedacos_arrel.mjs`, `260830_purga_maquinari.mjs`, `260831_rescat_tokens.mjs` | Migracions d'un sol tret que ningú ha arxivat. |

**Cinc mecanismes competidors per al mateix mirall** `.agents/` ↔ `_wiki_de_poble/`:
`scripts/sync_agents_to_wiki.mjs`, `tooling/brain/sync_agent_mirror.py`,
`tooling/wiki/sync_brain.sh`, `scripts/sync_brain_to_wiki.sh`,
`tooling/wiki/sync_brain_termodinamic.sh`. Tots morts. Cap és canònic. Duplicats també a
`sistema_nervios.mjs` (×2), `build_context_pack.py` (×2), i **tres** generadors de bundle
(`crear_bundle.mjs`, `generar_bundle.mjs`, `generar_bundle_diagnosi.py`).

**140 fitxers a `tooling/` contra 97 a `src/`.** L'aparell de govern és més gran que el
producte que governa.

### 6.2 Les portes violen la llei que les portes imposen

```
$ node tooling/gates/tractor-rutes.mjs
R1 literal de ruta orfe : 80
DEUTE PUJA · 72 -> 80
    NOVA: literal-orfe | tooling/gates/tancament.mjs      | «05_Escriptori_Soc_de_Poble»
    NOVA: literal-orfe | tooling/gates/tractor-cens.mjs   | «_wiki_de_poble»
    NOVA: literal-orfe | tooling/gates/tractor-promesa.mjs| «_wiki_de_poble»
    NOVA: literal-orfe | tooling/wiki/teixidor.mjs        | «_wiki_de_poble»
    …8 en total
```

El deute puja **ara mateix**, i les 8 infraccions noves són **totes dins de
`tooling/gates/` i `tooling/wiki/`**. L'onada de portes noves ha generat el deute que les
portes mesuren. Ha d'importar de `tooling/lib/arrel.mjs`, que ja existix i ja té
`indexEscriptori`.

### 6.3 El registre de skills declara zero

```
$ node tooling/gates/tractor-registre.mjs
🧠 Registre declara 0 · disc en té 13 · coincidixen 0
R2 (13) · abocament-total, core-brain-hygiene, core-change-control, … es carregaran
          SENSE GOVERNANÇA
R3 (7)  · triggers duplicats: bundle(×2), petorreta(×3), escriptori(×2), modifica(×2),
          consell(×2), iaia(×2), maria(×2)
          «El registre promet rebutjar-ho categòricament i no ho fa.»
```

Açò és la continuació directa del `triggers_ca` de la sessió anterior: la clau es va
canviar, però `00_INDEX_SKILLS.md` ara parseja a **zero**. I 7 col·lisions de trigger
signifiquen que **quin skill s'activa depèn de l'ordre de càrrega**. El comportament de la
IAIA no és determinista i el registre que ho havia de garantir està buit.

### 6.4 El contracte del bundle contradiu la cadena de portes

Sis fitxers de deute existixen al codi de les portes. **Tres** estan al contracte. **Tres**
hi són al disc.

```
esperats pels gates : .design-guard-deute .rutes-deute .vocabulari-deute
                      .promesa-deute  .teixit-deute  .pedra-seca-deute
al contracte        : els 3 primers
presents            : els 3 primers
```

`FITXERS_OPCIONALS` a `crear_bundle.mjs:82` és una llista **escrita a mà** que ha derivat.
Per això `porta:promesa` i `porta:teixit` fallen amb «no hi ha baseline» en qualsevol
auditoria externa. Pedaç: deriva la llista escanejant els gates.

```js
// crear_bundle.mjs — substituïx la llista literal
const deuteDeLesPortes = () => {
  const trobats = new Set();
  for (const d of ['tooling/gates', 'tooling/wiki', 'tooling/brain']) {
    for (const f of fs.readdirSync(path.join(ARREL, d)).filter((x) => x.endsWith('.mjs'))) {
      const t = fs.readFileSync(path.join(ARREL, d, f), 'utf8');
      for (const m of t.matchAll(/['"](\.[\w-]*deute\.json)['"]/g)) trobats.add(m[1]);
    }
  }
  return [...trobats].sort();
};
const FITXERS_OPCIONALS = [...BASE_OPCIONALS, ...deuteDeLesPortes()];
```

### 6.5 La porta que no pot passar mai en una auditoria

```
tractor-consell L8 · wordpress-plugin/dist/seo-routes.json
   ↳ Manifest de rutes absent: sdp_resolve_request() retornarà 404 en TOTES
     les rutes React.
```

`dist` és a `dirs_exclosos` del bundle. **L'artefacte que la porta verifica està exclòs per
disseny de l'artefacte que envies a auditar.** Conseqüència: L8 serà roja en cada auditoria,
per sempre, independentment de l'estat real de producció. Una porta permanentment roja és
una porta desactivada — el dia que el 404 siga real, ningú se n'adonarà.

I `npm run gate` **no pot passar mai en un clon net**: verifica `--verifica` un artefacte
que només `build:seo` escriu, i `build:seo` només corre dins de `npm run build`. Qualsevol
CI que crida `npm run gate` sol falla al 100%.

### 6.6 Persistència i pes del client

```
tractor-persistencia L2 ❌ src/app/App.jsx:84-85 — localStorage directe
```

És una purga de claus antigues, no una fuita. **Gravetat baixa, cost alt:** manté una porta
roja per sempre i entrena l'equip a ignorar el roig. Mou-ho a `delVal()` de `storage.js` i
tanca-ho hui.

```
src/ total .......................... 802 KB
contingut estàtic incrustat ......... 240 KB  (29%)
   src/sections/text/pageContent.js .. 114 KB  ← un sol fitxer
```

`pageContent.js` és més gros que tot el CSS. Conté un bolcat HTML **mantingut a mà** de
l'arbre sencer de la wiki, incloent-hi 40+ documents que **no existixen al repositori**
(`00_INDEX_MESTRE`, `Coneixement`, `Graf`, `Sistema_Immunitari`, `Arquitectura_Protocol_Lazaro`…).
Va a un iPad A10 amb cobertura intermitent i deriva de la realitat cada dia que passa.
Ha de ser una ruta de dades generada per `build_rag_index.mjs`, no una constant.

---

## 7. DAFO ESTRUCTURAL

**FORTALESES** · Integritat criptogràfica del bundle (350/350). 2 dependències en producció.
XSS tancat als 7 punts. Relé OAuth amb igualtat exacta d'origen i validació de `source`.
Les portes que funcionen tenen un disseny excel·lent: fail-closed, missatges que expliquen
el *perquè*, deute amb cadenat. `tractor-registre` i `tractor-doctrina` són instruments de
precisió — el problema no és la seua qualitat.

**DEBILITATS** · 45% de cobertura SCC. 69% de l'utillatge mort. 13/19 portes roges. 0 proves
a la cadena. Registre de skills buit amb 7 col·lisions no deterministes. Contracte del
bundle derivat del contracte de les portes. 240 KB de contingut estàtic incrustat.

**OPORTUNITATS** · Els 13 «ponts barats» costen 13 línies i tanquen el 34% de les
inabastables. L'Era és una substitució d'una línia al `package.json`. `tooling/lib/arrel.mjs`
ja existix i resol sol les 80 infraccions de R1. `farcell.mjs` ja està escrit i només cal
endollar-lo.

**AMENACES** · La real no és cap bug concret. És que **el sistema d'auditoria ha crescut més
ràpid que la capacitat de mantindre'l honest**: una àncora fora d'abast, un contracte de
bundle derivat, portes que violen les seues lleis, un registre buit, controls de seguretat
en comentari i 100 scripts morts. Quan la mitjana de portes roges és 13, «roig» deixa de
significar res i el dia que la que importa es pose roja passarà per davant sense que ningú
mire. **El risc dominant és la fatiga de senyal, no el codi.**

---

## 8. ORDRE D'EXECUCIÓ

**Hui, abans de res** (< 1 h, tot verificat)
1. Aplica `src/adapters/sollutiaBridge.js` reescrit i endolla `tractor-postmissatge.mjs` a la cadena. És l'única cosa d'este informe amb impacte de seguretat.
2. Pedaç de frescor a `oauthRelay.js:176`.
3. `porta` → `node tooling/gates/era.mjs`. Tindràs el mapa complet a cada execució.

**Esta setmana**
4. Posa `05_Escriptori_Soc_de_Poble` al contracte del bundle, o canvia l'àncora a `00_INDEX`. Sense això res del graf és auditable.
5. Deriva `FITXERS_OPCIONALS` (§ 6.4). 15 línies.
6. Els 13 ponts barats de `teixidor2 --pla`.
7. `tooling/lib/arrel.mjs` a les 8 portes que violen R1.
8. Repara `00_INDEX_SKILLS.md` fins que `tractor-registre` declare 13, i resol les 7 col·lisions de trigger.
9. Crea `ESTANDARD_Pedra_Seca.md` o reapunta els 10 enllaços.
10. `npm test` dins de l'Era com a `BLOCA`.

**Quan tingues cap freda**
11. Purga els 100 morts. Un `git mv` a `90_arxiu_historic/`, no un `rm`.
12. Tria **un** mecanisme de mirall dels cinc i mata els altres quatre.
13. `pageContent.js` → dades generades.
14. Decideix què fer amb `dist/seo-routes.json`: o entra al bundle, o L8 baixa a `AVISA`. La situació actual és la pitjor de les dues.

---

## 9. El que NO he pogut jutjar

Honestedat sobre l'abast, perquè un informe que no declara els seus forats és propaganda:

- **7 portes** (`lint`, `tdz`, `rutes-web`, `design-guard`, `vocabulari`, `shim`, `proves`) necessiten `node_modules`. Cap veredicte sobre elles.
- **Zero anàlisi de `01_SABER_Cultura_Coneixement/` i `05_Escriptori/`** — fora del contracte. Poden contindre illes que no he vist.
- **`wordpress-plugin/dist/`** exclòs: no puc dir si el 404 de rutes és real en producció o només artefacte del bundle.
- La xifra «10 illes / 14 orfes» que cites **no la puc ni confirmar ni refutar**: sense l'àncora no és calculable. Les meues xifres usen `00_INDEX` com a substituta i **no són comparables** amb les teues.
- `teixidor2.mjs`, `era.mjs` i `tractor-postmissatge.mjs` estan provats contra este bundle, **no** contra el teu repositori complet amb `node_modules`. Espera ajustos.

---

*Seient Núm. 5 · Auditor Sènior · Consell de la Petorreta*
*Mètode: extracció verificada, materialització, execució. Cap xifra sense ordre darrere.*
