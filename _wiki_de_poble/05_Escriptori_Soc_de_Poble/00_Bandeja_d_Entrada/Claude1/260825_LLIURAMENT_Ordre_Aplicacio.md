---
estat: "Lliurament"
tipus: "pedaços"
seient: "Núm. 5 — Senior Auditor (Claude)"
data: "2026-08-25"
---

# Lliurament — Ordre d'aplicació

Tot verificat per execució sobre l'arbre extret del bundle. **Cap pedaç s'ha
aplicat al vostre repo**: ací hi ha els diffs i els fitxers, i els apliqueu vosaltres.

## Estat de les portes

| Porta | Abans | Després |
|---|---|---|
| `tractor-consell.mjs` | ❌ 17 infraccions | ❌ **14** — netejades L8 i L10×2 |
| `tractor-cognitiu.mjs` | ✅ **verd fals** (0 bloquejants) | ❌ **1 bloquejant real**, `exit 1` |

Que el Cognitiu ara falle **és la millora**. Abans donava verd sobre un fitxer
amb el fre llevat.

---

## Ordre

### 1 · `pedacos/tractor_cognitiu_P3_P5.diff` — primer de tot

Dos forats meus:

- **P3**: la comprovació de soques `'bypass'` estava **després** d'un `continue`.
  Esborrar l'import de la guarda era la manera de passar la porta. Ara va davant,
  amb exempció només per a la font del propi tractor.
- **P5**: `CANDIDATS_RAG.find()` agafava **el primer** camí que existia i no
  mirava els altres. Ara els recorre tots amb `filter()`.

Va primer perquè és el que fa visibles els altres tres.

```bash
git apply pedacos/tractor_cognitiu_P3_P5.diff
node tooling/wiki/tractor-cognitiu.mjs      # ha de donar exit 1
```

### 2 · `pedacos/core_build_rag_index.diff` — la ceguesa cognitiva

Una línia. L'excepció `.agents` estava aplicada a `tooling/wiki/build_rag_index.mjs`
i el Reflex (`reflex_petorreta.mjs:133`) crida `tooling/wiki/core/build_rag_index.mjs`,
que seguia cec.

**Verificat:** amb el pedaç, P5 passa de bloquejant a net.

> **Decisió pendent per a vosaltres:** hi ha **dues còpies** del constructor
> d'índex, 151 i 102 línies. Jo no en puc esborrar cap sense saber quina és la
> bona. Mentre les dos existisquen, tornarà a passar el mateix: es pedaça una i
> l'altra queda arrere.

### 3 · `fitxers/jsx-runtime.js` — substitució directa

Reemplaça `src/shims/jsx-runtime.js`.

```
jsx('li', {children:'La Torre de les Maçanes'}, 'poble-42')

  shim trencat  → key=null        props={children:'poble-42'}     ← el text desapareix
  shim correcte → key='poble-42'  props={children:'La Torre…'}
```

Verificat contra `react@18` amb tres casos: amb clau, sense clau i amb fills
imbricats. Afig `jsxDEV`, que faltava i fa petar el dev server.

El comentari de capçalera diu explícitament per què no s'ha de tornar a fer
`export const jsx = React.createElement`. **És la segona vegada que aquest bug
apareix.**

### 4 · `fitxers/build-seo-manifest.mjs` — el productor que faltava

Copiar a `tooling/gates/`. Zero dependències, ESM, fail-closed.

`dist/seo-routes.json` tenia **tres consumidors i cap productor**. Sense ell,
`sdp_resolve_request()` torna 404 dur en **totes** les rutes React.

```bash
node tooling/gates/build-seo-manifest.mjs            # dry-run a stdout
node tooling/gates/build-seo-manifest.mjs --escriu   # genera el fitxer
node tooling/gates/build-seo-manifest.mjs --verifica # exit 1 si ha derivat
```

Eixida real d'aquesta execució:

```
✅ [SEO] Escrit wordpress-plugin/dist/seo-routes.json
   37 rutes · 29 indexables · 10 àlies
   16 de sections.js · 11 de detall · 36 slugs revisats del PHP

⚠️  src/sections/mur/feedSeed.js → 'MOCK_FEED' és buit:
    cap ruta de detall de 'mur' serà indexable.
```

**Tres fonts, per ordre d'autoritat:**

1. `src/config/sections.js` — rutes de llista. Es llig **per text**, no per
   `import()`, perquè importa `lucide-react`. Si el format canvia i deixa de
   trobar seccions, **para** en compte de generar un manifest buit.
2. Els `*Seed.js` — rutes de detall, per `import()` dinàmic (són dades pures).
3. `sdp_route_pattern()` del PHP — els 36 slugs que el rewrite accepta. Els que
   `sections.js` no declara es registren com a **àlies** (`xat`→`chat`,
   `calendari`→`events`, `anima`→`ia`, `ruta`→`roadmap`…). Sense això el rewrite
   els accepta i el manifest els torna 404.

**Fail-closed comprovat:** amb menys de 10 rutes, amb cap indexable, o amb una
font il·legible, **no escriu i ix amb 1**. Un manifest incomplet és pitjor que cap:
publica un sitemap que després es contradiu amb 404.

`fitxers/seo-routes.json` és la generació d'aquesta sessió, per si voleu veure la
forma abans d'executar-lo.

> **Tres fonts de rutes que poden derivar:** `sections.js`, el manifest i la
> llista clavada dins de `sdp_route_pattern()`. Aquest generador cus les tres,
> però la solució de veres és que el PHP llija el patró del manifest.

### 5 · `pedacos/config_theme.diff` — mode fosc i Enxufabilitat

`App.jsx:73` **escriu** amb consciència de Shadow DOM. `theme.js:17` **llegia**
sense. `document.querySelector` no travessa el límit del Shadow DOM: dins de
WordPress no trobava mai `.sdp-root` i queia a `document.documentElement` — el
`<html>` de Sollutia.

Dos efectes: el tema no persistia mai, i **escrivíem atributs a l'arrel de
l'amfitrió**, que és violació directa de la Regla de l'Enxufabilitat.

El pedaç afig `arrelDelTema()`, que replica l'objectiu d'escriptura d'`App.jsx`.

### 6 · `pedacos/teixidora_sinapsis.diff` — parada dura

**Llegiu abans l'errata del §0 de l'informe.** Vaig dir que la Teixidora escrivia
en present i és fals: les quatre escriptures estan darrere d'`if (PROCEDEIX)` amb
`PROCEDEIX = false` clavat a la línia 94.

El problema real és la línia 345:

```js
if (PROCEDEIX) {
  // throw new Error removed for direct write
}
```

La parada no es va desactivar: **es va esborrar**, i va quedar l'`if` buit com a
cicatriu. El sistema és **segur per accident**, a una constant booleana de mutar
92 documents amb `receiptPath: 'bypass'` i sense rollback.

El pedaç torna a posar el `throw` amb el motiu escrit, com fa
`sync_sollutia_skills.mjs`. El mode consultiu (dry-run) segueix funcionant igual.

**Això no restaura les guardes.** Bloqueja fins que les restaureu de veres. Jo no
puc reconstruir `openReflex`/`sealReflex`/`claimReceiptForMutation`/
`completeMutationClaim` sense veure'n la implementació, i fingir que ho he fet
seria pitjor que la soca `'bypass'`.

---

## El que NO he tocat, i per què

| Cosa | Per què no |
|---|---|
| **`makeChatReply` del xat** | És decisió vostra, no meua. Ara inventa respostes i les **guarda a Supabase** amb `sender:'other'` i sense marca. Les eixides són: desconnectar-lo, o `isSynthetic:true` a la fila i etiqueta visible a la UI. Qualsevol de les dos és una decisió de producte. |
| **CSS duplicat** (`legacy-components.css` = `sosp-components.css`, 485 línies idèntiques) | Esborrar-ne una i migrar `sosp-`→`sdp-` és radi d'explosió gran. Va amb `tanca.mjs`, no a mà. |
| **Les 170 classes orfes i els 17 tokens fantasma** | Igual: lot gran, amb dry-run i diff revisat. |
| **Els 14 skills stub** | Omplir doctrina que el RAG no llig és treballar per a res. **Feu abans el punt 2.** Mentrestant: `status: active` → `status: draft` als 14. Que el frontmatter diga la veritat és gratis. |
| **L5 · Llei de Vida** (`index.css:1723-1724`, icones a 36 i 28px) | Una línia, però és decisió de disseny: pujar a 44px canvia la capçalera en mòbil. |
| **L2, L6, L7** | `normalizeDataMode()`, les claus i18n i els dos òrgans morts són trivials però toquen fitxers que no puc provar sense el `package.json`. |

---

## Encara falta al bundle

`package.json` · `vite.config.*` · `06_EINES/canonada.mjs` ·
`tooling/wiki/rules/trellat-rules.json` · `_wiki_de_poble/00_INDEX_MESTRE.md` ·
`disseny_pedra_seca.html` · **tot el codi de Sollutia**

El `package.json` és el més urgent dels que falten: és on es decideix si
`npm run gate` executa els tractors. Ara mateix tenim portes que funcionen i **no
podem comprovar que estiguen endollades a res**. Sense això, l'ordre 6 seguirà
tenint sostre.

---

*Seient Núm. 5 — Senior Auditor. Cap resposta atribuïda a cap altre seient del Consell.*
