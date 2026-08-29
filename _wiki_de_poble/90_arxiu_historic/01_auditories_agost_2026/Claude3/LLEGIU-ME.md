# Pedaços P0 — Outbox i Sincronitzador

Auditoria del 27/08/2026. Quatre fitxers. Verificats amb execució real
(Node 22, React 19, `fake-indexeddb`), no amb lectura.

## Fitxers

| Fitxer | Destí |
|---|---|
| `outbox.js` | `src/data/outbox.js` (substituïx) |
| `sincronitzador.js` | `src/data/sincronitzador.js` (substituïx) |
| `AppDataContext.p0-3.patch` | `git apply` a l'arrel |
| `tractor-outbox.mjs` | `tooling/gates/tractor-outbox.mjs` (nou) |

## Instal·lació

```bash
cp outbox.js         src/data/outbox.js
cp sincronitzador.js src/data/sincronitzador.js
git apply AppDataContext.p0-3.patch
cp tractor-outbox.mjs tooling/gates/

npm i -D fake-indexeddb
node tooling/gates/tractor-outbox.mjs      # ha de donar exit 0
```

Afegiu la porta a la seqüència:

```json
"porta:outbox": "node tooling/gates/tractor-outbox.mjs",
"porta": "npm run porta:shim && npm run porta:outbox && npm run porta:persistencia"
```

## Sense migració d'esquema

`VERSIO` continua sent `2`. Qui ja tinga la BD creada no patix cap
`onupgradeneeded`. El sentinella `signe-vida` s'ha mogut al magatzem
`snapshots`, que ja existia.

## Resultat de la porta

Els mateixos 12 controls, contra les dues versions:

```
CODI ANTIC                              CODI CORREGIT
4 passades · 7 infraccions  (exit 1)    12 passades · 0 infraccions  (exit 0)

❌ T1 saveSnapshot() penjada en avortar   ✅ rebutja, no penja
❌ T2 cap rellotge vigilant               ✅ vigilant + onabort
❌ T3 deleteDatabase() cridat 2 vegades   ✅ buida la cua, snapshots intactes
❌ T4 intents [0,0,0,0,0,0,0,0,0,0,0,0]   ✅ 0→8 i acaba 'mort'
❌ T6 signe-vida contamina la cua         ✅ fora de la cua
❌ T8 esborrat fallit → reenviament       ✅ làpida, sense duplicats
❌ T9 arrel sense AppDataContext          ✅ crida arrancaSincronitzador()
```

## El que NO cobrixen estos pedaços

Continuen oberts i són d'altres fitxers:

- **P0-2** · `PedraSecaEmbed.jsx:317`. El gestor global d'`unhandledrejection`
  crida `indexedDB.deleteDatabase('sdp-outbox')` per a tota la pàgina de
  WordPress. Qualsevol plugin aliè que rebutge una promesa amb
  `QuotaExceededError` us esborra la cua i els snapshots. **Ha de quedar-se en
  `console.warn` i prou.** És el pedaç més curt i el més urgent dels que falten.
- **P1-3** · Claus asimètriques a `supabaseBackend.js`
  (`saveDevFallbackMessages`, `saveLocalSectionSubmissions`): escriuen sota
  `messages[0]?.ownerUserId` i llegixen sota `ownerUserId`.
- **P1-4** · `MyProfileSection.jsx:28`, `window.location.href = '/login'`.
- **P1-5** · Compartir, trencat des del canvi a `MemoryRouter`.
- **P1-6** · `App.jsx:86` reescriu l'`<html lang>` de WordPress sense guarda.
- **P1-7** · `devicesRuntime.js` guarda xats a `localStorage` síncron, contra el
  contracte que `storage.js` declara imposat i que cap llei comprova.
- **P1-8** · `sanitizeHtml` permet `style`.

## Nota sobre la porta

`tractor-outbox.mjs` no llig cadenes de text: importa el mòdul, l'executa i li
mira el comportament. Un embolcall d'una línia que reproduïsca el mateix error
no la passa. És el mateix criteri que `tractor-shim.mjs`, l'única porta d'este
projecte que ja no es podia enganyar.

Dues comprovacions passaven per accident a la primera versió i s'han endurit:
T3 ara espia `deleteDatabase` en compte de confiar que el snapshot sobreviu
(sobrevivia perquè l'esborrat quedava *bloquejat* per la connexió oberta, que és
la segona meitat del mateix defecte), i T9 falla si `AppDataContext.jsx` no
existix en compte de saltar-se el control en silenci.
