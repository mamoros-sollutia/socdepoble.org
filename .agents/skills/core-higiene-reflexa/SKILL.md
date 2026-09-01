---
name: core-higiene-reflexa
description: >
  Llei d'ancoratge i tancament. Tot fitxer que es crea naix amb nom, lloc i
  enllaç, o no naix. Cap torn es tanca amb brossa a l'Escriptori. Controla el cicle sencer: obrir, classificar, ancorar i tancar.
version: 2.0.0
status: canonic
lang: ca
owner: project-governance
authority_level: procedural
prioritat: bloquejant
eines_obligatories:
  - .agents/hooks/verify.mjs
  - .agents/hooks/tancar.mjs
  - tooling/gates/obrir_torn.mjs
  - tooling/gates/tancament.mjs
triggers_on:
  - "tanca"
  - "tancar"
  - "acaba"
  - "acabat"
  - "fet"
  - "neteja"
  - "escriptori"
  - "ancorar"
  - "ancoratge"
  - "orfe"
  - "satèl·lit"
  - "crea fitxer"
  - "guarda"
  - "inici"
  - "obrir"
---

# Higiene reflexa: Cada ferramenta al seu clau

## Avís sobre esta skill

Esta pàgina no neteja res. Les que netegen són les portes (tractors).
Si no s'executen, l'Escriptori tornarà a embrutar-se. Aquesta regla unifica l'antic `core-brain-hygiene` i `core-higiene-reflexa`.

## Les Quatre Lleis del Cicle de Vida

### 1. En obrir el torn (El Passaport)
Abans de crear o moure res, has d'executar `node tooling/gates/obrir_torn.mjs --json` per a obtindre un `turn_id`. Sense ell, el torn no és legítim.

### 2. Un fitxer naix classificat i ancorat (o no naix)
No hi ha fitxers provisionals lliures. "Ja ho ordenaré després" és la frase que ha omplit l'Escriptori de brossa.
Abans de qualsevol escriptura, has de tindre clar el tipus i el lloc:
- `temporal`: s’elimina o va a quarantena abans d’eixir.
- `lliurable`: document de treball → `_wiki_de_poble/05_Escriptori_Soc_de_Poble/`. S'ancora al seu índex immediatament.
- `produccio`: codi d'aplicació → `src/` o `tooling/`. S'ancora i es documenta.
- `historic`: va a quarantena o arxiu històric de manera reversible.

Taxonomia: `AAMMDD_HHMM_categoria_titol.ext`. Sense accents, minúscules, 1–6 paraules. Excepcions: `SKILL.md`, `LEDGER.md`, `ESTAT.md`, `AGENTS.md` i codi font.

No es fan còpies a mà (`.bak`, `.old`). S'usa git o `core-restauracio-segellada`.

### 3. Crear i enllaçar és la mateixa acció
Crear el fitxer i crear la sinapsi és una sola operació. Si falta l’índex (`00_INDEX_ESCRIPTORI.md`), el treball no està acabat. Un text que diu "estic ancorat" no és un ancoratge: l’índex ha d’enllaçar-lo de veritat.

### 4. El torn no acaba quan contestes (El Tancament)
El torn acaba quan la porta et dona permís. Ordre exacte:
1. Classifica tots els canvis del `turn_id` i retira els temporals.
2. Actualitza `.agents/ESTAT.md` amb el camp `actualitzat:` d'ara.
3. Si has tocat `src/`, `tooling/` o `scripts/`, escriu entrada al `LEDGER.md` i signa'l: `node tooling/verify-ledger.mjs --sign`.
4. Assegura't que `00_INDEX_ESCRIPTORI.md` té enllaçat tot el document nou.
5. Executa `node tooling/gates/tancament.mjs --turn-id=<id> --json` (o `npm run tancar`). Si no hi ha rebut verd (`ok: true`), el torn no pot acabar.
6. Només llavors contestes al Mestre.

## Regla del sac
Qui va al bancal se'n torna amb el sac. Si has obert una carpeta, la tanques. Si has fet una prova, la lleves. El bancal queda com t'agradaria trobar-lo.
