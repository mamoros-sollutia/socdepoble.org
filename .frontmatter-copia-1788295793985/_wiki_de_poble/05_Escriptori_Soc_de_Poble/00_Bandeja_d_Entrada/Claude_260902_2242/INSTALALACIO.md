# Instal·lació — lliurament 260901

Set fitxers. Tots provats sobre el farcell `v5` (406/406 SHA-256 verificats,
materialitzat a disc i executat de veres).

```
tooling/wiki/lib/resolutor.mjs          nou
tooling/wiki/lib/frontmatter_pla.mjs    nou
tooling/wiki/llaurador_indexs.mjs       nou
tooling/wiki/codemod_frontmatter.mjs    nou
tooling/gates/tractor-frontmatter.mjs   nou
tooling/gates/esquema_frontmatter.json  nou
```

Cap toca res existent. `teixidor.mjs` es queda com està fins que decidixes si
el jubiles o el corregixes (mira el punt 4).

---

## 1. Ordre d'execució, una sola vegada

```bash
node tooling/wiki/codemod_frontmatter.mjs --diff     # mira què farà
node tooling/wiki/codemod_frontmatter.mjs --escriu   # 91 documents, fa còpia
node tooling/gates/tractor-frontmatter.mjs --baseline # segella el deute a 0
node tooling/wiki/llaurador_indexs.mjs --escriu      # adopta els 8 orfes
node tooling/wiki/llaurador_indexs.mjs --check       # ha d'eixir 0
rm -rf .frontmatter-copia-*                          # quan hages comprovat
```

Afig al `.gitignore`:

```
.frontmatter-copia-*
```

## 2. `package.json`

```json
"porta:orfes": "node tooling/wiki/llaurador_indexs.mjs --check",
"porta:frontmatter": "node tooling/gates/tractor-frontmatter.mjs",
"cus": "node tooling/wiki/llaurador_indexs.mjs --escriu"
```

I dins de `porta:baseline`, afig al final de la cadena:

```
&& node tooling/gates/tractor-frontmatter.mjs --baseline
```

## 3. `tooling/gates/run-portes.mjs`

Afig dos passos. Van al final, després de `Porta Teixit`:

```js
{ nom: 'Porta Orfes', cmd: 'npm', args: ['run', 'porta:orfes'] },
{ nom: 'Porta Frontmatter', cmd: 'npm', args: ['run', 'porta:frontmatter'] },
```

## 4. Decisió pendent sobre `teixidor.mjs`

`llaurador_indexs.mjs --check` cobrix la llei T1 (orfe) i T3 (illa) millor que
`teixidor`, perquè resol per ruta i mesura abast dirigit. `teixidor` encara
aporta T2 (penjats) i T4 (etiqueta falsa), que el llaurador només informa de
passada.

Tens tres eixides i cap és evident:

- **Jubilar `teixidor`** i moure T2/T4 al llaurador. Una eina menys.
- **Mantindre'l** però amb `--ancora=00_INDEX` a `package.json`, i baixar el
  deute de `orfes: 49` a `orfes: 12`. Mesurat: amb l'àncora corregida passa de
  11 orfes i 92 documents en illes, a 4 orfes.
- **Corregir-lo**: canviar `path.basename` per `lib/resolutor.mjs` i canviar
  `veins` (que uneix `ix` i `entra`, o siga connectivitat NO dirigida) per
  abast dirigit. Són dos canvis de poques línies, però és refer-lo.

No ho decidisc jo. El que sí que és mesura i no opinió: mentre l'àncora siga
`00_INDEX_ESCRIPTORI`, `teixidor` reporta 92 illes de 96 documents i ningú se'l
mirarà mai.

## 5. El que NO he tocat i hauries de tocar hui

Cap tractor vigila els dos fitxers que llig algú que arriba de zero.

- `README.md` línia amb `_wiki_de_poble/00_index.md` → ha de ser `00_INDEX.md`.
  Funciona al teu Mac, fa 404 a Linux i a GitHub.
- `README.md` diu `pnpm install --frozen-lockfile` i `pnpm-lock.yaml`. El
  repositori porta `package-lock.json` i totes les portes són `npm run`.
- `README.md` referencia `tooling/wiki/arquitectura/03-design.md`,
  `_templates/gestoria_base`, `.env.example` i
  `.github/workflows/wiki-integrity.yml`. Cap dels quatre existix.
- `.agents/BOOTSTRAP.md` ensenya Offline-First i IndexedDB. Dexie no és al
  `package.json` i `IndexedDB` apareix a `src/` una sola vegada, dins d'HTML
  comentat. Són 14 els documents que encara prediquen la capa esborrada,
  inclòs el bloc d'identitat de la plantilla de petorreta.
- `[[ESTANDARD_Pedra_Seca]]` — 11 enllaços, cap fitxer, cap àlies.
  `ESTANDARD_UI_Universal.md` declara que eixe document *prevaldrà* sobre ella.
  Una llei que cedix davant d'un document que no existix.
