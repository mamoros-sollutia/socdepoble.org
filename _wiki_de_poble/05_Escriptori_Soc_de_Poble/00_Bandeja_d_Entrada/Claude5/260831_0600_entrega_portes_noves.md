# Entrega · Tres portes noves + un pedaç

> Ancoratge: [[00_INDEX_ESCRIPTORI]]
> Origen: auditoria del `260831_0520_BUNDLE_auditoria.md` · Seient Núm. 5
> Estat de verificació: **els tres scripts s'han executat contra el bundle**. Els
> números d'este document són mesurats, no estimats.

---

## Ordre d'aplicació

No apliques les portes primer. Apliques el pedaç primer. Una porta nova sobre
una arrencada que menteix només et donarà un informe més detallat de la mentida.

| # | Acció | Fitxer | Per què va ací |
|---|---|---|---|
| 1 | Pedaç | `tooling/brain/despertar.mjs` | L'àncora no existix i el sistema diu «Bon dia» |
| 2 | Porta | `tooling/gates/tractor-promesa.mjs` | Impedix que torne a passar |
| 3 | Pedaç | `package.json` → `build` | L'ordre circular impedix construir en clon net |
| 4 | Porta | `tooling/gates/tractor-sollutia.mjs` | Vigila la costura amb Sollutia |
| 5 | Porta | `tooling/wiki/teixidor.mjs` | Mesura el teixit sense enganyar-se amb etiquetes |

---

## 1 · Pedaç a `despertar.mjs` (P0)

`despertar.mjs:47` crida `node eines/ancora.mjs`. **`eines/` no existix al
repositori.** La crida viu dins d'un `try/catch` que imprimix `⚠ Avís` i
continua. La secció 5 detecta que el RAG salta `05_Escriptori` i també ho
imprimix com a avís.

Un avís que es repetix cada matí durant setmanes no és un avís: és una decisió
de conviure amb el defecte, presa per omissió.

El pedaç (`pedac/despertar.mjs.patch`) fa tres coses:

- Comprova `existsSync` abans d'executar l'àncora. Ruta per defecte
  `tooling/brain/ancora.mjs`, sobreescrivible amb `SDP_ANCORA`.
- Acumula tot el que impedix una sessió honesta a `BLOQUEIGS[]` en compte
  d'imprimir-ho i oblidar-ho.
- Al final: `process.exit(1)` si hi ha bloqueigs. Vàlvula explícita
  `SDP_FORCA_ARRENCADA=1`, que entra igualment però **ho diu per stderr**.

**Provat, tres camins:**

```
sense àncora                       → exit 1 · 2 bloqueigs (àncora + RAG)
amb àncora present                 → exit 1 · 1 bloqueig (RAG)
SDP_FORCA_ARRENCADA=1              → exit 0 · «⚠ Entrada forçada. Queda constància.»
```

L'àncora encara l'has d'escriure tu. El pedaç no la inventa: la reclama.

---

## 2 · `tractor-promesa.mjs` → `tooling/gates/`

La porta contra la prosa. El patró universal que has demanat, mecanitzat.

| Llei | Què caça | Deute |
|---|---|---|
| `P1 EINA-FANTASMA` | `execSync`/`import()` d'un camí del repo que no existix | **cap** (llei dura) |
| `P2 PROMESA-TOVA` | invocació d'eina dins d'un `try/catch` que només registra | cadenat |
| `P3 AVÍS-ETERN` | paràgraf `.md` que promet arreglar un camí citant línia, sense porta que ho cobrisca | cadenat |

`P3` analitza **per bloc, no per línia**: al cas real la promesa i el camí
estaven a línies distintes del mateix paràgraf (`SKILL.md:191` i `:194`).

**Mesurat sobre el bundle:**

```
❌ P1  1   despertar.mjs:47 → «eines/ancora.mjs» no existix
·  P2  3   despertar.mjs:46, despertar.mjs:54, preflight.mjs:45
·  P3  1   core-restauracio-segellada/SKILL.md:191
```

**Després del pedaç 1, contra el mateix repositori:**

```
✅ P1  0
·  P2  2 (màx 3)   ← el cadenat ha baixat sol
·  P3  1 (màx 1)
PASSA.
```

Arrancada:
```bash
node tooling/gates/tractor-promesa.mjs --baseline   # una sola vegada
```
`.promesa-deute.json` escriu sempre `P1: 0`. Congelar una eina fantasma seria
convidar-la a quedar-se.

---

## 3 · Pedaç a `package.json` (P0)

La cadena `build` desplegada té 30 passes. La passa 22 executa
`build-seo-manifest.mjs --verifica`, que exigix
`wordpress-plugin/dist/seo-routes.json`. Qui escriu eixe fitxer és `build:seo`,
**passa 30**. En clon net `npm run build` no pot passar mai, i
`tractor-consell` ho diu clar: *«Manifest de rutes absent: `sdp_resolve_request()`
retornarà 404 en TOTES les rutes React.»*

```diff
- "build": "npm run build:tokens && npm run gate && npm run rag:build && npm run slugs:build && npm run build:web && npm run build:wp && npm run build:seo",
+ "build": "npm run build:tokens && npm run build:seo && npm run gate && npm run rag:build && npm run slugs:build && npm run build:web && npm run build:wp",
```

I al mateix fitxer, `tooling/scripts/build-tokens.mjs` acaba amb
`.catch(console.error)` — codi d'eixida 0 passe el que passe:

```diff
- buildTokens().catch(console.error);
+ buildTokens().catch((e) => {
+   console.error('❌ [build-tokens]', e.message);
+   process.exit(1);
+ });
```

La primera passa del build era fail-open. Amb el CSS vell, tot el que ve
darrere valida contra tokens que ja no són els del JSON.

---

## 4 · `tractor-sollutia.mjs` → `tooling/gates/`

Totes les portes actuals miren cap endins. Cap mira la costura.

| Llei | Què caça |
|---|---|
| `S1 VAR-ORFE-AMFITRIÓ` | `var(--x, fallback)` a `index.html` o `wordpress-plugin/**` on `--x` no es definix enlloc |
| `S2 INSTÀNCIA-ÚNICA` | `connectedCallback` que desmunta germans **encara connectats** |
| `S3 ORDRE-CIRCULAR` | passa `--verifica` anterior a la passa `--escriu` del mateix artefacte |
| `S4 TOKEN-MUT` | token de `design-tokens.json` amb zero consumidors |

**Mesurat: 16 infraccions.**

- `S1` · `blank.php:26` usa `--sdp-bg`, que no existix. Pinta sempre `#f4eee6`,
  que no és cap token del sistema (el fons càlid és `#fff4ef`). `index.html:12`
  fa el mateix amb `--sdp-fons-app`. Dos noms, cap definició, un color forà.
- `S2` · `PedraSecaEmbed.jsx` desmunta instàncies vives. Dos blocs Gutenberg a
  la mateixa pàgina i el primer mor. A més `destroyToastSystem()` és global:
  desmuntar A apaga els avisos de B.
- `S4` · **12 dels 19 tokens del JSON tenen zero consumidors**, incloent-hi
  `--sp-touch-min` (els 44px), `--sp-orange-100` (#FF7300) i `--sp-blue-100`
  (#0984E3). El fitxer es proclama «font única de veritat» amb `status: TANCAT`
  i governa 19 de 197 variables. El sistema real és `--sdp-*`: 178 definides,
  1.286 consumides, escrites a mà, sense font JSON.

---

## 5 · `teixidor.mjs` → `tooling/wiki/`

Mesura de cohesió que no s'enganya.

El punt clau: **91 dels 396 `[[...]]` del bundle no són enllaços, són
etiquetes** del bloc `## Taxonomia` (`[[Graf]]` ×46, `[[Maquina]]` ×22,
`[[Identitat]]` ×16, `[[Govern]]` ×7). Cap destinació existix. Inflen la Vista
Gràfica d'Obsidian i abaixen el compte d'orfes sense cosir res. `T4` les compta
a banda i et diu l'alternativa: o crees la nota d'etiqueta, o ho escrius `#graf`.

| Llei | Què caça |
|---|---|
| `T1 ORFE` | document que ningú enllaça (etiquetes no compten) |
| `T2 PENJAT` | `[[destí]]` que no resol |
| `T3 ILLA` | component connex que no toca l'àncora |
| `T4 ETIQUETA-FALSA` | pseudo-enllaç de taxonomia sense fitxer darrere |

**Mesurat:** 70 documents, **273 arestes reals**, 100 etiquetes, densitat 3,90.

La wiki està bé: 47 fitxers, 5 orfes reals, 10%. El `sanador` ha fet la faena.

**El cervell no.** `.agents/` són **24 illes d'un sol node**: `AGENTS.md`,
`BIOS.md`, `LEDGER.md`, `ESTAT.md`, `PROFILE.md`, `BOOTSTRAP.md`, `BASELINE.md`
i les 12 `SKILL.md`. Zero entrada, zero eixida. El cervell no forma part del graf
que el cervell ha de navegar. `sync_agents_to_wiki.mjs` i `sync_brain_to_wiki.sh`
existixen i no els crida ningú.

Enllaç penjat campió: **`[[ESTANDARD_Pedra_Seca]]`, citat 10 vegades des de 9
fitxers, i no existix.**

Falla tancat si l'àncora no es troba, en compte de dir «24 illes» i enganyar-te:

```bash
node tooling/wiki/teixidor.mjs --baseline --ancora=00_INDEX_ESCRIPTORI
node tooling/wiki/teixidor.mjs --dot > graf.dot   # Graphviz
```

---

## Integració a `package.json`

```json
"porta:promesa":  "node tooling/gates/tractor-promesa.mjs",
"porta:frontera": "node tooling/gates/tractor-sollutia.mjs",
"porta:teixit":   "node tooling/wiki/teixidor.mjs",
```

Dins de `porta`, **al principi**, just després de `lint`:

```
npm run lint && npm run porta:promesa && npm run porta:tdz && …
```

`porta:promesa` va primera a posta: si una eina invoca el que no existix, la
resta de portes estan validant un sistema que no és el que corre.

`porta:frontera` i `porta:teixit`, al final, abans de `build-seo-manifest`.

I afig les tres línies de baseline a `porta:baseline`:

```
node tooling/gates/tractor-promesa.mjs --baseline && node tooling/wiki/teixidor.mjs --baseline
```

---

## Advertències honestes

1. **Les baselines adjuntes són de referència, no d'ús.** Estan mesurades sobre
   el bundle, i el contracte del bundle exclou `.husky`, `.githooks`, `dist/` i
   `05_Escriptori_Soc_de_Poble`. Regenera-les al repositori real abans de
   confiar en els sostres. Els números canviaran.

2. **No he pogut verificar els hooks de Git.** `.husky` i `.githooks` estan fora
   de l'abast. El que sé és el que es dedueix del codi inclòs:
   `reflex_petorreta.mjs:1427` fa `git config core.hooksPath .githooks`,
   `:1440` exigix `.husky`, i `package.json` té `"prepare": "husky"`, que
   reescriu `core.hooksPath=.husky` **a cada `npm install`**. Tres mecanismes,
   cap àrbitre. Guanya el que va córrer l'últim. Això s'ha de resoldre abans que
   cap porta nova valga res com a *pre-commit*.

3. **`.agents/hooks.json` no té format declarat.** `verify.mjs` llig
   `payload.toolCall.args.TargetFile / AbsolutePath / DirectoryPath / Overwrite`
   i respon `{decision: …}`. Eixa és la forma d'un arnés concret. Cap fitxer del
   repositori diu quin. Sota un altre arnés, `brut` ix buit i la porta respon
   `ask` a cada escriptura, i la desactivaràs en un matí. Escriu-ho al capçal
   del fitxer i posa una `assert` sobre la forma del `payload`.

4. **`tancar.mjs` té deriva documental dins.** El comentari diu que «C2 està
   classificat com a AVÍS i per això mai ha aturat res». Al `tancament.mjs`
   actual **C2 retorna `falla`**. La línia `avisos.filter(c => c.id === 'C2')`
   és codi mort. És el mateix mal que el *hook* existix per combatre.

5. **10 de 21 portes tornen codi ≠ 0 sobre este bundle.** Cinc per falta de
   `node_modules` al meu contenidor (react, @babel/parser) i no compten. Set
   fallen de veritat: `consell`, `doctrina`, `manual`, `persistencia`,
   `registre`, `rutes`, `pedra-seca`. `porta` encadena amb `&&`: mor a la
   primera. **Mentrestant `tancament.mjs` diu «Sessió tancable».**

---

## El que faria demà, per ordre

1. Escriure `tooling/brain/ancora.mjs`. És l'única peça que falta i que cap
   script pot inventar.
2. Aplicar el pedaç de `despertar.mjs` i el de `build-tokens.mjs`.
3. Reordenar `build`.
4. Resoldre husky vs githooks. Un dels dos, escrit al `AGENTS.md`, verificat
   per una porta.
5. `LLEI_03_COLOR_EN_LINIA`: `NotesSection.jsx:360 → #fff`. És llei dura i està
   trencada; `porta` no passarà fins que ho lleves.
6. Cosir `.agents/` al graf, o cridar `sync_agents_to_wiki.mjs` des de `build`.

Els tres tractors només serveixen per a que això no torne a passar. No arreglen
res per si sols.
