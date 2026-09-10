---
tipus: document
estat: esborrany
description: Reparació verificada de les P0 d'organitzacions i de l'Efecte Matrix, i components del Perfil Universal
---

# REPARACIÓ: Perfil Universal i Efecte Matrix

> **Nota sobre el frontmatter.** `tipus: document` no és la millor etiqueta
> per a açò — seria `informe`. S'usa `document` perquè és de les poques que
> existixen a **les dues** còpies de `esquema_frontmatter.json`, que declaren
> la mateixa versió i tenen contingut distint. Fins que no s'unifiquen, tot
> el que s'escriga s'ha de quedar a la intersecció.

**Ancoratge de Seguretat:** [[00_index_escriptori]]

---

## 0. Com verificar açò

Res d'ací és una afirmació teòrica. Cada cosa s'ha executat:

| Comprovació | Com |
|---|---|
| Bundle íntegre | 427/427 fitxers, sha256 i bytes contra el manifest |
| Esquema SQL | PostgreSQL 16.15 real, shim d'`auth.uid()`/`auth.jwt()` i rols `anon`/`authenticated` |
| Migració | `psql -v ON_ERROR_STOP=1`, 12 proves d'acceptació amb casos negatius |
| Matrix | `node tooling/brain/matrix.mjs` amb 5 peticions distintes + prova de regressió |
| Llei 6 | 4 casos contra `.agents/hooks/verify.mjs` per stdin |
| Disseny | `node tooling/gates/design_guard.mjs --arrel=src` abans i després |
| Lint | `npx eslint src/sections/perfil` |

---

## 1. Base de dades — `pedacos/260904_2130_organitzacions_reparacio.sql`

### Què reparava

| | Abans (verificat) | Ara (verificat) |
|---|---|---|
| `list_my_organizations` | No existia. `CREATE` falla: 12 columnes declarades, 11 projectades | Existix i torna les 12 |
| `organizations` UPDATE | `permission denied` fins per al propietari | `name`, `lema`, `description` editables per qui administra |
| `organization_memberships` | Només `select`: cap membre afegible | Alta, canvi de rol i baixa per a qui administra |
| `create_organization` | Dues formes de retorn (`lema` només en una branca) | Una forma única, sempre amb `lema` |
| `entity` / `city_hall` | Validats per l'RPC, rebutjats per l'RLS amb error opac | Missatge clar: els dona d'alta l'administració |

### Baranes que s'hi afigen

La migració **no obri cap porta nova de privilegi**. `slug`, `kind`,
`tenant_id`, `visibility` i `created_by` són identitat i queden fora del grant
de columna, amb un trigger `protegeix_identitat_organitzacio()` com a segona
barrera. Les polítiques de membres exclouen el rol `owner`: la propietat es
traspassa amb un procediment propi, no amb un `UPDATE` de fila.

### Resultat de les 12 proves

```
T1  list_my_organizations torna 12 columnes           ✅ El Rentonar | Fem xarxa | owner
T2  create_organization torna lema                    ✅ "Pa de llenya"
T3  city_hall dona missatge clar                      ✅ "els dona d'alta l'administració del portal"
T4  el propietari edita nom i lema                    ✅
T5  NEG · canviar el slug                             ✅ permission denied
T6  NEG · canviar visibility                          ✅ permission denied
T7  afegir una veïna com a membre                     ✅ 2 membres
T8  NEG · segon owner                                 ✅ violates row-level security policy
T9  NEG · membre ras edita l'organització             ✅ 0 files, nom intacte
T10 NEG · membre ras es puja a admin                  ✅ 0 files, rol intacte
T11 la veïna se n'ix ella mateixa                     ✅
T12 NEG · el propietari s'esborra a si mateix         ✅ owner intacte
```

**Falta al client:** `supabaseBackend.js:571` no envia `p_lema` a
`create_organization`. Una línia.

---

## 2. Efecte Matrix — de instrucció a precondició

### La causa arrel era una expressió regular

`matrix.mjs:63` llig el registre amb `/\[\[([a-z0-9-]+)\/SKILL\|/g`, que exigix
`[[nom/SKILL|…]]`. Però `efecte-matrix` estava escrita a l'índex com
`[[.agents/skills/efecte-matrix/SKILL|SKILL]]` — ruta completa — **i dins del
bloc `LLAURADOR:ADOPCIONS`**, el calaix d'orfes que el propi bloc demana buidar
a mà: *"Mou cada enllaç a la secció temàtica que li toque"*.

Ningú la va moure mai. El parser no la veia. `matrix.mjs` donava
`ready:false` i eixida 2 **per a totes les peticions, sempre**.

> La skill que ordena consultar la Wiki era l'única que el carregador no podia
> veure, i eixa invisibilitat era el que el mantenia en roig permanent. No era
> psicopatia de la IAIA: era un `[a-z0-9-]+` que no accepta punts.

### Els quatre pedaços

1. **`00_INDEX_SKILLS.md`** — `efecte-matrix` adoptada a *Controls Transversals*
   en format canònic curt, i llevada del calaix d'orfes.
2. **`prioritat`** a `reflexio-previa` (10), `efecte-matrix` (20),
   `council-review` (40), `abocament-total` (45). Desfà les tres col·lisions de
   gallets (`bundle`, `auditoria`, `petorreta`) que es resolien a l'atzar.
3. **PROTOCOLLEDGE ampliada** amb 7 files: `prompt`, `informe`/`estudi`,
   `document`/`generar arxiu`, `bundle`, `prepara`/`planificació`,
   `nova funcionalitat`, `què sé jo`. I la fila per defecte deixa de ser un
   guionet i apunta a `PLANTILLA_ISO_SDP.md`.
4. **`matrix.mjs`** — dues portes noves:
   - **El defecte és un fitxer, no una frase impresa.** Abans, quan cap protocol
     casava, escrivia *"cau a PLANTILLA_ISO_SDP"* per pantalla, no la carregava,
     no comprovava que existira, i deia `ready:true`. Ara la carrega i n'emet
     rebut, o falla.
   - **Porta de cobertura.** Cada gallet d'`efecte-matrix` i `reflexio-previa`
     ha de casar amb una fila de la taula. Si no, error: eixa acció es generaria
     a mà lliure. És el forat exacte pel qual *"crear un prompt"* no arribava
     enlloc.

### Encaminament, abans i després

```
                                     ABANS              ARA
crear un prompt…              →  0 protocols  ❌   PLANTILLA_ISO_SDP        ✅
crea un informe               →  0 protocols  ❌   PLANTILLA_ESTUDI_IA      ✅
crear un estudi               →  0 protocols  ❌   PLANTILLA_ESTUDI_IA      ✅
genera un arxiu nou           →  0 protocols  ❌   PLANTILLA_ISO_SDP (def.) ✅
crea una acta de tancament    →  1 protocol   ✅   PLANTILLA_ACTA_UNICA     ✅
```

Prova de regressió: afegint un gallet `crear cartell` sense fila a la taula,
el Matrix ix amb 2 i diu *"Gallets de «efecte-matrix» sense fila a
PROTOCOLLEDGE: crear cartell. Eixes accions es generarien a mà lliure."*

### La Llei 6: Saber ≠ Fer

Els quatre pedaços de dalt fan que el Matrix **funcione**. No fan que
s'**òbriga**. Una instrucció es desobeïx sense conseqüència; per això
l'Efecte Matrix portava mesos escrit i mesos incomplit.

La peça que faltava: `matrix.mjs` ja calculava rebuts sha256 de cada font
llegida, però només els imprimia. Ara els escriu a `.agents/.diari_sessio.jsonl`
—**només si `ready:true`**, perquè un rebut d'una càrrega fallida seria pitjor
que cap rebut— i `verify.mjs` els exigix.

`verify.mjs` és l'única porta del sistema que tanca de veres: torna
`allow`/`ask`/`deny` i mai `allow` per defecte. La **Llei 6** hi afig: cap
document `.md` nou a `_wiki_de_poble/` o a l'Escriptori sense un rebut Matrix
viu (finestra de 30 minuts).

```
A · document sense rebut          → DENY  "sense haver fet l'Efecte Matrix"
B · passa el Matrix               → rebut de9540f71bc0 | 14 fonts | PROTOCOL_PETORRETA
C · el mateix document amb rebut  → ALLOW "amb rebut Matrix de9540f71bc0 (14 fonts…)"
D · rebut de fa 45 minuts         → DENY  "Un context caducat no és context"
E · un .jsx sense rebut           → ALLOW la Llei 6 no toca el codi
```

El cas E és deliberat: el codi el governa el Trellat, no la plantilla.

### El que **no** s'ha pogut arreglar

`preflight_matrix_wrapper.mjs` deia `[MATRIX BLOCK] No pots respondre encara`
i emetia això com a `ephemeralMessage` — un text. No bloquejava res.
`PreInvocation` no admet decisions, així que **no es pot fer que bloquege**.
El missatge s'ha reescrit perquè diga la veritat: que qui bloqueja és la
Llei 6. També s'ha unificat la forma de `hooks.json`, que barrejava dos
contractes distints en un mateix fitxer.

---

## 3. Perfil Universal — `src/sections/perfil/`

### Per què no és una pàgina

L'esquema ja separa dues coses que la interfície ajuntava:

| | Fitxa pública | Panell privat |
|---|---|---|
| Subjecte | Només organitzacions | Persona |
| Font | vista `organization_directory` (llig `anon`) | `profiles` + `list_my_organizations` |
| Editable | mai des del client | `full_name` |

`public.profiles` té sis columnes i `check (visibility = 'private')`. **Un
perfil de persona no pot ser públic mai.** No és un valor per defecte: és una
constricció, i és correcta.

Per això `ProfileSection.jsx` continua sent exposició legal: renderitza un
directori públic de persones amb `avatar_url`, `short_bio` i `role` per a
`type: 'PERSON'`. Hui funciona perquè menja d'`agentsSeed.js`. El dia que
toque `profiles` de veres, la interfície promet el que l'esquema prohibix.
**Això no s'ha tocat en aquest lliurament: és decisió teua, no meua.**

### Els sis fitxers

```
PerfilContext.jsx     estat + catàleg d'ajustos derivat del que l'RLS permet
PerfilShell.jsx       closca de tres columnes
SelectorIdentitat.jsx el canviador de compte de WhatsApp
LlistaAjustos.jsx     una fila per ajust
DetallAjust.jsx       sempre muntat
PerfilShell.css       graella de tres nivells
```

### Les tres lleis que porten dins

**1. El detall no es desmunta mai.** En estret s'amaga amb
`data-visible="no"` (`visibility`, no `display:none`, i mai un ternari que el
lleve del DOM). És l'error que va costar el cursor i l'scroll a l'editor de
notes. Reutilitza el `panellObert` que ja ha aterrat a `NotesContext.jsx:56`;
el sistema no ha de tindre dos models de panell.

**2. Canviar d'identitat filtra, no navega.** Passar de "El meu compte" a
"El Rentonar" canvia el contingut de la columna del costat i prou. Una persona
gran no ha d'aprendre dues jerarquies per a fer una cosa.

**3. Cap fila menteix.** Cada ajust declara `obert` i, si no ho està, el
motiu escrit:

```js
{ id: 'privacitat', titol: 'Privacitat', valor: 'Privat', obert: false,
  motiu: 'El perfil d’una persona és sempre privat. No es pot fer públic.' }
{ id: 'identificador', titol: 'Identificador', valor: org.slug, obert: false,
  motiu: 'L’identificador és permanent: hi ha enllaços publicats que hi apunten.' }
```

`obert` es deriva del rol i del que l'RLS permet de veres. Un botó que fa
`permission denied` en silenci és pitjor que una fila desactivada.

### Verificació

```
Design Guard · abans:  93 fitxers, 163 crítics
Design Guard · després: 99 fitxers, 163 crítics
Troballes que apunten a sections/perfil: 0
ESLint sobre src/sections/perfil: net
```

Sis fitxers nous, zero deute nou. Cap `style={{}}`, cap hex cru, cap classe
que no estiga al vocabulari CSS. Dos tokens que havia inventat
(`--sdp-vora-subtil`, `--sdp-text`) els va caçar la comprovació i s'han
substituït pels reals (`--sdp-vora`, `--sdp-text-cos`).

---

## 4. El que continua roig i no he tocat

**`design_guard` està en roig ara mateix, per coses anteriors:**

```
LLEI DURA VIOLADA · tailwind-visual: 5 infraccions (no admet deute)
    sections/disseny/DesignSection.jsx | text-danger, text-muted
DEUTE PUJA · inline-style 105→113 · raw-color 30→33 · touch-too-small 7→8 · focus-invisible 3→4
```

`DesignSection.jsx` és el fitxer que `universal-page/SKILL.md` declara
**"l'única referència vàlida per copiar i replicar el codi de la
UniversalPage"**. La font de veritat canònica és la que trenca la llei que no
admet deute. Qui obeïsca la skill hereta la infracció.

**`esquema_frontmatter.json` continua duplicat i divergent.** Dues còpies,
les dues `sdp.frontmatter.v1`, les dues `generat: 2026-09-01`, contingut
distint. A `tooling/gates/` falten `petorreta`, `prompt`, `informe` i
`briefing`. La petorreta que has enviat porta `tipus: 'petorreta'`: vàlida
contra una còpia, invàlida contra l'altra.

**`NotesSidebar.jsx:29`** encara desestructura `mobilePanel`, que
`NotesContext.jsx` ja no proveïx. Sempre `undefined`. Una línia.

---

## 5. Ordre d'aplicació

1. `pedacos/260904_2130_organitzacions_reparacio.sql` — l'onboarding està
   trencat en producció ara mateix.
2. Una línia a `supabaseBackend.js:571` per enviar `p_lema`.
3. Els cinc diffs del Matrix (índex, prioritats, PROTOCOLLEDGE, `matrix.mjs`,
   `verify.mjs`). Passa `node tooling/brain/matrix.mjs "prova"` i confirma
   eixida 0 abans de continuar.
4. `tailwind-visual` a `DesignSection.jsx`.
5. Unificar les dues còpies de `esquema_frontmatter.json`.
6. `src/sections/perfil/` + la ruta `/jo` a `App.jsx`.

Els punts 4 i 5 no bloquegen el 6, però sí que el contaminen: si `DesignSection`
continua sent la referència canònica amb la llei dura trencada, el perfil
naixerà amb el defecte incorporat el dia que algú "seguisca la skill".

---

## Sinapsis

- [[00_INDEX_SKILLS]]
- [[PROTOCOL_PETORRETA]]
- [[doc_governanca]]

## Taxonomia

- **Categoria:** [[maquina]]
- **Etiquetes:** [[graf]]

**Ancoratge de Seguretat:** [[00_index_escriptori]]
