# Paquet de correccions · Auditoria 260829

Tot el que hi ha ací s'ha executat contra l'arbre real extret del bundle, amb Node 22. Els números són mesures, no estimacions.

## Ordre d'aplicació

L'ordre importa: cada pas deixa el següent en un estat comprovable.

### 1 · La SSOT de rutes (5 min)

```
tooling/wiki/lib/project_paths.mjs   →  +9 exportacions, ESCRIPTORI_DIR inclosa
tooling/gates/tractor-rutes.mjs      →  fitxer nou
```

```bash
node tooling/gates/tractor-rutes.mjs --baseline
node tooling/gates/tractor-rutes.mjs      # ha de dir PASSA
```

Fes això primer perquè R3 comprova que la resta de portes tenen entrada CLI. Amb el `design_guard.mjs` original al disc, R3 el detecta:

```
R3 script de porta sense CLI : 1
    tooling/gates/design_guard.mjs:1  Declarat a `npm run porta` però no té
    punt d'entrada CLI: `node tooling/gates/design_guard.mjs` ix amb codi 0
    sense fer res.
```

Deute inicial mesurat: **52 literals orfes** (R1, amb ratchet), **0** a R2 i R3 una volta aplicat el pegat.

### 2 · La porta de disseny (10 min)

```
tooling/gates/design_guard.mjs   →  substituïx el fitxer sencer
```

```bash
node tooling/gates/design_guard.mjs --baseline
node tooling/gates/design_guard.mjs --detall | head -30
```

Tres canvis respecte de l'original: punt d'entrada CLI, arrel per defecte `src` en lloc de `src/components/universal`, i ratchet de deute amb identitats que ignoren números de línia.

Un quart canvi que no havia previst i que va eixir provant: la regla `tailwind-visual` acusava `text-center` i `text-panel__head`, que són **classes vostres**. L'heurística de prefix no distingix Tailwind de BEM. Ara el guard carrega el vocabulari real del CSS i només denuncia el que no hi és. Va baixar de 221 a 219 crítics, i els 2 que van caure eren falsos.

Deute inicial: `raw-color 205 · touch-too-small 7 · focus-invisible 5 · h1-outside-header 2`.

Concentració real (no està escampat):

| Fitxer | Crítics |
|---|---|
| `css/legacy-components.css` | 120 |
| `css/index.css` | 60 |
| `sections/disseny/DesignSection.jsx` | 26 |
| `sections/connectar/ConnectarSection.css` | 8 |
| `config/app.js` | 5 |

### 3 · El vocabulari tancat (15 min)

```
tooling/gates/tractor-vocabulari.mjs   →  fitxer nou
```

Necessita `@babel/parser`, que ja tens a `devDependencies`.

```bash
node tooling/gates/tractor-vocabulari.mjs --baseline
node tooling/gates/tractor-vocabulari.mjs --detall
node tooling/gates/tractor-vocabulari.mjs --fantasmes
```

Açò és el ciment armat. Fa amb el CSS el que `termodinamic.mjs` ja fa amb els noms de fitxer: vocabulari tancat. Dins de `src/sections/**`, una classe que no estiga declarada al full canònic falla la compilació.

Fa servir AST i no regex a propòsit. La meua primera passada amb expressions regulars acusava `isPrivate`, `selectedArea` i `viewMode`, que són variables dins de ternaris, no classes. L'AST no s'equivoca en això.

**30 infraccions reals, 0 falsos positius.** Vaig comprovar quatre a mà: `toggle-button--active`, `folder-button--active`, `devices-bubble--me` i `notes-column--mobile` tenen **0 ocurrències** al CSS. Són modificadors BEM que no existixen: els estats «actiu» i «mòbil» d'eixes vistes són invisibles ara mateix.

I una troballa de camí: **126 classes declarades amb cos buit** (`.card {}`, `.button {}`, `.text-panel__head {}`). Passen qualsevol comprovació d'existència i no fan res. `--fantasmes` les llista.

### 4 · La nomenclatura (2 min)

```
tooling/wiki/lib/termodinamic.mjs   →  substituïx el fitxer sencer
```

Afig `BUNDLE` i `PETORRETA` a `CATEGORIES`, fixa el límit de paraules del títol en codi (1–6, resolent la contradicció amb `PROTOCOL_PETORRETA.md`), i exempta `00_INDEX_ESCRIPTORI.md` i `00_EN_CURS.md`.

Verificació: el nom del bundle que em vas passar passa de `✗ INVÀLID` a `VÀLID`.

Queda una faena que no puc fer jo: **`termodinamic.mjs` l'importen 8 scripts i cap dels 8 està a `npm run porta`**. Mentre no hi entre, continua sent una preferència. Decidix on el vols endollar.

### 5 · L'arrencada (2 min)

```
tooling/brain/despertar.mjs   →  substituïx el fitxer sencer
package.json                  →  "despertar": "node tooling/brain/despertar.mjs"
```

Corregix tres coses: `process.cwd()` → `discoverProjectRoot()` (era fail-open: des d'un subdirectori deia que l'escriptori no existia i eixia amb èxit), literal hardcodejat → `ESCRIPTORI_DIR`, i zero cridadors → script npm.

Afig un avís que et cantarà cada matí fins que el corregisques:

```
--- ⚠ AVÍS: L'ESCRIPTORI ÉS INVISIBLE PER AL RAG ---
Estos indexadors salten 05_Escriptori:
  tooling/wiki/core/build_rag_index.mjs
  tooling/wiki/core/edge_rag.mjs
  tooling/wiki/core/build_slug_index.mjs
Els directoris històrics (12_actes) SÍ que s'indexen.
```

Ací està la resposta a «per què anava jo sempre a palpes a `12_actes`». No era desordre: l'escriptori no es podia recuperar i l'arxiu sí. L'agent escrivia a l'únic lloc que la recuperació li ensenyava.

### 6 · OAuth (1–2 h, inclou desplegar el relé)

```
public/auth/callback.html    →  fitxer nou, desplegar a auth.socdepoble.cat/callback
src/data/oauthRelay.js       →  fitxer nou
src/config/storage.js        →  substituïx el fitxer sencer (+ capa efímera)
PEGATS_QUIRURGICS.md         →  retalls per a supabaseBackend, LoginSection, App, package.json
```

Comprovacions que ja he fet:

- **PKCE validat contra el vector oficial del RFC 7636, apèndix B.** El repte que genera el codi coincidix caràcter per caràcter amb el del document.
- **Validació d'origen del relé: 12/12 vectors d'atac correctes.** Amb igualtat exacta. Amb `startsWith` (l'error habitual) passarien `https://socdepoble.cat.atacant.com`, `https://socdepoble.catx`, `https://socdepoble.cat@atacant.com` i tres més. Per això el comentari del fitxer avisa: mai `startsWith`, mai regex.

Tres camins de tornada, per ordre: emergent + `postMessage`; emergent + esdeveniment `storage` quan Google talla l'`opener` amb capçaleres COOP (passa de veres); i redirecció completa per a iPads amb emergents bloquejats. Als dos primers, la finestra amfitriona no navega mai fora — que era exactament la teua queixa.

Hi ha un punt que has de verificar tu contra la teua versió de GoTrue: el `grant_type` de bescanvi (`pkce`) i el nom del camp (`auth_code`). Els he aïllat a dues constants al principi d'`oauthRelay.js` precisament per això. Fes una entrada de prova abans de donar-ho per bo. No tinc manera de comprovar-ho des d'ací i no vull que et fies d'una cosa que no he vist funcionar.

### 7 · Skills (10 min)

```
.agents/skills/DESCRIPCIONS_CORREGIDES.md   →  sis descripcions per a copiar
```

Sis de dotze skills tenien `Skill for X operations.` — en anglés, autogenerat, sense cap senyal semàntic. I són precisament els `core-*`, la identitat i la revisió entre agents. Les de govern eren les úniques irrecuperables.

Inclou també la correcció de `00_INDEX_SKILLS.md`, que diu «3 Controls Transversals» i en llista 5.

---

## Faena que et deixe a tu, i per què

Coses que he trobat i que **no** he pegat, perquè són decisions teues i no defectes:

1. **Els 52 literals de ruta.** El ratchet els congela i impedix que en cresquen de nous. Anar-los llevant és faena de fons.
2. **Endollar `termodinamic.mjs` a la porta.** No sé quin tractor vols que el cride.
3. **Llevar `05_Escriptori` de l'exclusió del RAG.** Segurament es va excloure per volum. Potser el que vols és indexar-lo a banda amb un índex propi, no ficar-lo al general. És una decisió d'arquitectura.
4. **`.agents/cervells/inicial_2026-08-24.../`.** 12 de 12 skills byte-idèntics amb `.agents/skills/`. Idèntics **hui**. Dues còpies escrivibles sense gate de sincronia: el dia que algú edite la còpia equivocada, divergiran en silenci. Esborrar-la o posar-hi gate és decisió teua; jo no esborre res del teu cervell.
5. **`ConnectarSection.css`.** 356 línies, ningú l'importa, 0 de 30 classes usades. El tractor de vocabulari el denuncia (`css-de-seccio`), però esborrar-lo el firmes tu.
6. **Les 126 classes fantasma.** Cal decidir una per una si el cos buit era un oblit o un marcador.

---

## Una nota que et dec

El patró que et vaig descriure a l'auditoria — regla escrita, gate absent — me l'he trobat a mi mateix mentre escrivia açò. La primera versió del meu `design_guard` marcava `tailwind-visual` com a llei dura i hauria fet fallar el vostre build el primer dia per dues classes vostres perfectament legítimes. Ho vaig vore perquè el vaig **executar**, no perquè el vaig llegir.

És la mateixa lliçó que ja teniu escrita a `.agents/`: saber no és fer. Cap d'aquestes portes val res fins que està a `npm run porta` i algú l'ha vista fallar a propòsit. Fes-les fallar totes tres abans de fiar-te'n.
