# Aplicació del pedaç — Auditoria Seient Núm. 5 (260831)

Tot el que hi ha ací s'ha executat i verificat sobre el bundle extret
(339/339 fitxers, sha256 comprovat). Cap número d'aquest document és una
estimació.

---

## 1. Ordre exacte

```bash
# 0. Àncora abans de tocar res
node eines/ancora.mjs --pon "abans del pedac 260831 seient 5"

# 1. Fitxers nous
cp tractor-tokens.mjs        tooling/gates/
cp tractor-cens.mjs          tooling/gates/
cp 260831_rescat_tokens.mjs  tooling/brain/
cp consell.json              .agents/
cp SKILL_core-restauracio-segellada.md \
   .agents/skills/core-restauracio-segellada/SKILL.md

# 2. La fusió: esborrar la skill absorbida
git rm -r .agents/skills/core-safe-restore

# 3. El pedaç dels fitxers existents
patch -p1 --dry-run < 260831_0300_PEDAC_auditoria_seient5.patch   # ha de dir "checking"
patch -p1           < 260831_0300_PEDAC_auditoria_seient5.patch

# 4. Portes
node tooling/gates/tractor-registre.mjs    # ha de passar
node tooling/gates/tractor-innerhtml.mjs   # ha de passar
node tooling/gates/tractor-tokens.mjs      # ha de passar
node tooling/gates/tractor-cens.mjs        # 4 infraccions ESPERADES (§4)
```

## 2. Afegir les portes a `package.json`

```json
"porta:tokens": "node tooling/gates/tractor-tokens.mjs",
"porta:cens":   "node tooling/gates/tractor-cens.mjs",
```

I dins de `"porta"`, després de `tractor-registre.mjs`:

```
&& npm run porta:tokens && npm run porta:cens
```

**No poses sostre de deute a `porta:tokens`.** Eixa és tota la gràcia.

---

## 3. Què fa cada peça

### 3.1 XSS — `NotesSection.jsx` · **P0**

Quatre `dangerouslySetInnerHTML` sense sanejar (`title`, `subtitle`, `lead`,
`content`). `notes` és secció connectable (`supabaseBackend.js:54`) i
`mergedNotes` fusiona `sectionSubmissions` remotes: HTML escrit per un veí
s'executava al navegador d'un altre.

El pedaç saneja **als dos costats**: al render i dins de `handleSaveField`.

> **Cal que ho sàpies:** `handleSaveField` era un *stub* buit
> (`// Lògica de desament` i res més). L'editor `contentEditable` no desa res
> ara mateix. Això no rebaixa la gravetat — el camí remot és el perillós — però
> vol dir que **l'editor del Quadern és decoratiu**. Ho he deixat marcat amb un
> `TODO(260831)` en lloc d'inventar-te una capa de persistència.

### 3.2 Tokens — `tractor-tokens.mjs` + `260831_rescat_tokens.mjs`

**85 substitucions en 8 fitxers.** El guió de rescat no inventa cap color: tots
els destins ja existixen al bloc `:root, :host, .sdp-root`. La correspondència
és semàntica, no tipogràfica — `--sdp-marca` s'usava com a **color de text**
sobre fons clar, per tant va a `--sdp-accent-text` (AA 5,51:1) i no a
`--sdp-accent`, que el cànon reserva per a fons.

La porta té quatre lleis i **cap sostre**:

| | |
|---|---|
| T1 | Cap `var(--sdp-*)` sense definició |
| T2 | Cap fallback dins de `var()` (és una còpia privada del sistema) |
| T3 | Un sol lloc de definició |
| T4 | Dos capes: cap component cita una primitiva |

Verificat: **83 infraccions → 0.**

### 3.3 Registre — fusió de les dues skills de restauració

`core-safe-restore` i `core-restauracio-segellada` compartien el 100% dels
triggers i eren doctrinalment incompatibles (una `requires` el que l'altra
`substitueix`). La v2.0.0 fusionada conserva el segell criptogràfic i absorbix
les fases 3, 4 i 8 de l'altra (radi d'explosió semàntic, salvavides amb SHA,
retorn automàtic).

`tractor-registre.mjs`: **7 divergències → 0.** De 15 skills a 14.

### 3.4 `design_guard.mjs` — recuperació del senyal

68 de les 121 identitats `raw-color` eren les definicions canòniques dels
propis tokens dins de `:root`. El pedaç calla dins dels blocs de tema i
**només** allí.

`raw-color: 205 → 149`. Crítics totals: **210 → 161.**

> El sostre de `.design-guard-deute.json` s'ha de baixar a mà després d'açò.
> El pedaç no el toca: regenerar un baseline per fer passar una porta és
> tornar al problema de zero, i això ho diu el teu propi `_segell`.

### 3.5 i18n — `error.chat.rejected`

`App.jsx:112` usava una clau que no existia en cap dels cinc idiomes.
Afegida a `ca`, `es`, `en`, `eu`, `gl`. `tractor-consell` L6 passa.

### 3.6 El cens — `consell.json` + `tractor-cens.mjs`

La resposta a la Missió 1 convertida en màquina. Cinc lleis:

| | |
|---|---|
| C1 | El cens és vàlid i cada membre té fortalesa, debilitat i rol |
| C2 | Cap document que parle del Consell com a conjunt es deixa ningú |
| C3 | Cap document anomena una IA que no és al cens |
| C4 | Cap xifra literal contradiu el recompte |
| C5 | `multi-agent-review` cita el cens, no una llista amb «etc.» |

C4 exigix el **plural** (`onze proveïdors`, `11 IAs`) perquè en valencià «nou
model» és un model nou, no nou models. Amb el plural, zero falsos positius.

C1 i C5 ja passen: he reescrit `multi-agent-review/SKILL.md` (v3.0.0) perquè el
punt 0 siga el cens i n'he llevat la llista de cinc noms acabada en «etc.».

---

## 4. Les quatre coses que NO he tocat

Són decisions de doctrina. No em pertoquen.

**4.1 · `02_EQUIP_IA.md:85` — «no fixa una litúrgia d'onze proveïdors»**
El mateix document diu a la línia 54 que s'han d'enumerar totes sense excepció
i a la 78 que no obliga a un nombre fix. **Una de les dues frases ha de morir.**
Digues quina i la llevo.

**4.2 · Codex** (`AGENTS.md:21` i, abans del pedaç, `multi-agent-review:38`)
Apareix com a membre del Consell i no és a la família electrònica.
**O entra al cens, o ix dels documents.** No pot quedar a mitges.

**4.3 · `ESTANDARD_UI_Universal.md:192` — «Consell de les 11 IAs»**
Onze contra dotze. Cal decidir el número i propagar-lo des del cens.

**4.4 · `ESTANDARD_UI_Universal.md` — cens incomplet**
Parla del Consell i n'anomena 3 de 12.

---

## 5. El que continua roig i per què

`tractor-consell.mjs` L8 · `wordpress-plugin/dist/seo-routes.json` absent.

**No és culpa del pedaç.** `dist` és a `dirs_exclosos` del contracte del bundle,
així que no puc saber si el fitxer existix al teu disc. Si existix, ignora-ho.
Si no, `sdp_resolve_request()` torna 404 a **totes** les rutes React i cal
`npm run build:seo`.

---

## 6. El que queda de la Missió 3 i no entra ací

Açò tanca el vocabulari de tokens. **No tanca Pedra Seca.** Queda:

1. **Cinc fonts de veritat de disseny.** `src/config/design-tokens.json` es
   proclama `font_unica_de_veritat: true`, no l'importa ningú, el seu namespace
   `--sp-*` té zero usos, i la seua pròpia nota diu que 48px substituïx 48px.
   **O es connecta o es mata.**
2. **`ESTANDARD_Tokens_Pedra_Seca.md`**: 51 tokens de Material Design 3, dels
   quals 3 tenen equivalent real. 39 dels 42 hex no existixen al CSS.
3. **44 contra 48**: sis documents, sis xifres. Cal un decret.
4. **176 estils en línia i 133 classes òrfenes**, avui amb sostre igual a la
   realitat.

Digues per quin vas i el prepare.
