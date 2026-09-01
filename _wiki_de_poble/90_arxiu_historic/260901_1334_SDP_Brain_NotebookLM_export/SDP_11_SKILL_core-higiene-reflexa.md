---
name: core-higiene-reflexa
description: >
  Llei d'ancoratge i tancament. Tot fitxer que es crea naix amb nom, lloc i
  enllaç, o no naix. Cap torn es tanca amb brossa a l'Escriptori. S'activa en
  crear, moure, copiar o esborrar qualsevol fitxer, i en acabar una tasca.
version: 1.0.0
status: canonic
lang: ca
owner: project-governance
authority_level: procedural
prioritat: bloquejant
eines_obligatories:
  - .agents/hooks/verify.mjs
  - .agents/hooks/tancar.mjs
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
---

# Higiene reflexa

## Avís sobre esta skill

Esta pàgina no neteja res. Les que netegen són `verify.mjs` i `tancar.mjs`.
Si eixes dos no estan connectades a `.agents/hooks.json`, este document és
decoració i l'Escriptori tornarà a embrutar-se. Ja ha passat: l'AGENTS.md §4
diu des de fa mesos que cap sessió acaba sense `tancament.mjs`, i cap sessió
l'ha executat mai sense que el Mestre ho demanara.

## Les tres lleis

### 1. Un fitxer naix ancorat o no naix

No hi ha fitxers provisionals. El que s'escriu, s'escriu al seu lloc, amb el
seu nom i citat a l'índex de la seua zona. «Ja ho ordenaré després» és la
frase que ha omplit l'Escriptori de `Claude1/`, `prova-mur.mjs` i
`*.abans-260830`.

Abans de qualsevol escriptura, respon tres coses en veu alta:

- **On va?** Document de treball → `_wiki_de_poble/05_Escriptori_Soc_de_Poble/`.
  Eina → `tooling/`. Res va a l'arrel.
- **Com es diu?** `AAMMDD_HHMM_categoria_titol.ext`. Sense accents, minúscules,
  1–6 paraules. Excepcions: `SKILL.md`, `LEDGER.md`, `ESTAT.md`, `AGENTS.md`
  i codi font.
- **Qui l'enllaça?** Un `INDEX.md` de la zona. Si no saps quin, el fitxer no
  fa falta.

### 2. No es fan còpies a mà

`.abans-260830`, `.bak`, `.old`, `fitxer (2).md`: prohibits. Per a tornar
arrere hi ha git i hi ha `core-restauracio-segellada`. Una còpia manual és una
veritat duplicada, i dues veritats són cap veritat.

### 3. El torn no acaba quan contestes

Acaba quan `tancament.mjs` diu que pot acabar. Ordre exacte, sense saltar-se
cap pas:

1. Actualitza `.agents/ESTAT.md` amb el camp `actualitzat:` d'ara.
2. Si has tocat `src/`, `tooling/`, `wordpress-plugin/` o `scripts/`, afig
   entrada al `LEDGER.md` i signa'l: `node tooling/verify-ledger.mjs --sign`.
3. Declara a `00_INDEX_ESCRIPTORI.md` tot document nou de l'Escriptori.
4. `npm run tancar`. Si ix ❌, encara no has acabat.
5. Només llavors contestes al Mestre.

## Regla del sac

Qui va al bancal se'n torna amb el sac. No deixa les eines al mig del camí
perquè demà ja passarà per allí. Si has obert una carpeta, la tanques. Si has
fet una prova, la lleves. El bancal queda com t'agradaria trobar-lo.

## El que esta skill no cobrix

`tancament.mjs` només mira l'Escriptori, l'arrel del repositori i el LEDGER.
No mira `_wiki_de_poble/00_SER_Brain_Identitat/` ni `01_Produccio/`, on també
han aparegut satèl·lits. Fins que la porta no els mire, eixes zones depenen
de la Llei 1 i de ningú més. No pretengues que estan verificades.
