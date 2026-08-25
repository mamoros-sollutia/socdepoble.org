# Lliurament — Auditoria Inversa 260824

## Què hi ha

```
tooling/gates/
  tanca.mjs                    coll de botella únic d'escriptura
  tractor-tanca.mjs            porta que obliga a usar-la
  tanca.exempcions             exempcions amb motiu escrit
  repara-comentaris-jsx.mjs    substitut de fix-inline.mjs

src/
  shims/jsx-runtime.js         signatura corregida (+ jsxDEV)
  config/theme.js              respecta la frontera del shadow

.agents/skills/
  socdepoble-mutacio-segura/
  socdepoble-porta-mecanica/
  socdepoble-verificacio-empirica/
  socdepoble-frontera-encastada/

PEGATS_PENDENTS.md             els que no he pogut aplicar sense veure el vostre arbre
```

## Instal·lació

```bash
cp -r tooling/gates/* <repo>/tooling/gates/
cp src/shims/jsx-runtime.js <repo>/src/shims/
cp src/config/theme.js <repo>/src/config/
cp -r .agents/skills/* <repo>/.agents/skills/

# 1. Retirar el culpable
git rm tooling/brain/fix-inline.mjs

# 2. Reparar els 45 comentaris (llegiu l'assaig primer)
node tooling/gates/repara-comentaris-jsx.mjs
node tooling/gates/repara-comentaris-jsx.mjs --procedeix

# 3. Enganxar la porta al build
#    "porta:tanca": "node tooling/gates/tractor-tanca.mjs",
#    "porta": "npm run porta:manual && npm run porta:consell && npm run porta:tanca",
```

`theme.js` canvia de signatura: `readThemePreference(configurat, arrel)`.
Cal actualitzar les dos crides — `PedraSecaEmbed.jsx:200` i el consumidor de
`App.jsx` — passant-los `this.shadowRoot` i `arrelDeTema(mainRef.current)`
respectivament.

## Estat de verificació

| Afirmació | Com s'ha comprovat |
|---|---|
| El shim destruïa contingut i claus | executat amb `react` instal·lat |
| 45 comentaris en posició de fill JSX | `@babel/parser`, nodes `JSXText` |
| El detector de la Tanca en troba 45/45 | contrastat amb la referència AST |
| Reparació: 45 → 0, 72 fitxers parsegen | reverificat amb `@babel/parser` |
| `resolveInside` permetia escapada per symlink | symlink creat i escrit |
| `withRollback`/`withLock`/`assertWriteZone` a 0 usos | grep a tot l'arbre |
| La Tanca para la mutació de `fix-inline` | reproduïda; fitxer intacte |
| Arbre brut, radi d'explosió, rollback | 5 proves d'extrem a extrem |
| `card__*` sense CSS | grep a tots els fulls: 0 coincidències |
| 30 infraccions de `tractor-tanca` al repo real | executat |

**No verificable amb este bundle:** hi falten `package.json`,
`vite.config.js`, `vite.standalone.config.js`, `.husky/` i
`scripts/build-seo-routes.mjs`. Són els fitxers que decidixen si l'àlies del
shim està actiu, si les portes s'executen i si el manifest de rutes es
genera. Cap auditor pot certificar el comportament de build sense ells.
