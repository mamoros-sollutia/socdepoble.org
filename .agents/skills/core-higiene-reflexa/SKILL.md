---
tipus: skill
estat: canonic
description: Protocol d'higiene cognitiva
tags:
  - core
name: core-higiene-reflexa
triggers_on:
  - tanca
  - tancar
  - acaba
  - acabat
  - fet
  - neteja
  - escriptori
  - ancorar
  - ancoratge
  - orfe
  - satèl·lit
  - crea fitxer
  - guarda
  - inici
  - obrir
core: true
eines_obligatories:
  - .agents/hooks/verify.mjs
  - .agents/hooks/tancar.mjs
  - tooling/gates/obrir_torn.mjs
  - tooling/gates/tancament.mjs
---

# Higiene reflexa: Cada ferramenta al seu clau

## Avís sobre esta skill

Esta pàgina no neteja res. Les que netegen són les portes (tractors).
Si no s'executen, l'[[00_INDEX_ESCRIPTORI|Escriptori]] tornarà a embrutar-se. Aquesta regla unifica l'antic `core-brain-hygiene` i `core-higiene-reflexa`.

## Les Quatre Lleis del Cicle de Vida

### 1. En obrir el torn (El Passaport)
Abans de crear o moure res, has d'executar `node tooling/gates/obrir_torn.mjs --json` per a obtindre un `turn_id`. Sense ell, el torn no és legítim.

### 2. Un fitxer naix classificat i ancorat (o no naix)
No hi ha fitxers provisionals lliures. "Ja ho ordenaré després" és la frase que ha omplit l'[[00_INDEX_ESCRIPTORI|Escriptori]] de brossa.
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

## 5. Regla del sac
Qui va al bancal se'n torna amb el sac. Si has obert una carpeta, la tanques. Si has fet una prova, la lleves. El bancal queda com t'agradaria trobar-lo.

## 6. La Destil·lació Diària (El xiquet que aprén)
L'[[00_INDEX_ESCRIPTORI|Escriptori]] permet mantenir arxius (com actes, petorretas o documents en curs) que siguen rellevants per a la següent sessió, sempre que estiguen ancorats. No cal esborrar-lo tot de colp. El que SÍ s'ha de buidar obligatòriament i de forma estricta és la `00_Bandeja_d_Entrada`. No obstant això, l'[[00_INDEX_ESCRIPTORI|Escriptori]] no és un abocador permanent:
Cada dia o al final d'una sessió complexa:
1. Llig els estudis, auditories o respostes temporals generades per tu o pel Consell (ex: `260901_2232_estudi_claude.md`).
2. **Destil·la el coneixement**: Si hi ha alguna millora arquitectònica o patró útil, afig-ho immediatament a la `SKILL.md` corresponent (o crea'n una de nova).
3. **Esborra sense pietat**: Un cop destil·lat l'aprenentatge, esborra l'arxiu temporal completament de la Wiki i de l'[[00_INDEX_ESCRIPTORI|Escriptori]]. No l'arxives enlloc. L'únic arxiu per al que s'utilitza la paraula "arxivar" és per a traure-ho completament de la Wiki (com ara moure'l a un `_arxiu_wiki_de_poble` fòssil fora del repositori).
4. **Poda d'Actes**: Les actes de sessions (`10_actes`) actuen com una Time Machine temporal, però tampoc s'han d'acumular ad infinitum. Fes higiene de tant en tant i esborra les actes de fa més de 2 o 3 setmanes si el seu contingut ja s'ha absorbit.


## Ancoratge de la Wiki
- Aquesta skill penja de: [[00_INDEX_SKILLS]]

## El Ritual del Somiador (Molt Important)
Abans de donar per finalitzada qualsevol jornada o tancar una conversa, l'Agent HA DE recordar proactivament a l'usuari que s'ha d'anar a dormir per a destil·lar el coneixement i netejar l'escriptori. 
L'Agent ha de dir: "Mestre, m'oblidava que he d'anar-me'n a dormir! Puc activar el Somiador per consolidar el cervell i netejar l'Escriptori?".
Si l'usuari dóna permís, s'ha d'executar el script `node tooling/brain/somiador.mjs`. Aquest script purga l'escriptori, guarda la memòria a l'històric i reestructura el graf de la Wiki perquè l'endemà arranque fresca i neta.
