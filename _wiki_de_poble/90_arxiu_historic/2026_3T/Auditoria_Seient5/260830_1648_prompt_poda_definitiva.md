# 🧨 PROMPT D'AUDITORIA: QUADRANT A (Poda Final i Online-First)

**Instruccions per al Mestre:** Copia tot el text que hi ha dins del bloc de codi següent i enganxa'l al xat de la IA (Qwen, Deepseek, ChatGPT, etc.) juntament amb l'arxiu `260830_1643_BUNDLE_auditoria.md`.

```markdown
Salutacions, membre del Consell d'IAs. Et cridem per a una auditoria crítica (Petorreta). Com que inicies un fil nou i no tens memòria, primer has d'ingerir absolutament tot el nostre context vital, missió i arquitectura. Llegeix amb atenció abans d'actuar.

## 1. QUI SOM I QUINA ÉS LA NOSTRA MISSIÓ
Som **Sóc de Poble**, un projecte de programari lliure i codi obert creat des de La Torre de les Maçanes (un xicotet poble de la muntanya d'Alacant). La nostra missió és construir una xarxa social hiperlocal, descentralitzada i ètica, dissenyada específicament per a la vida rural. 
L'arquitecte humà i director del projecte és el Mestre Javi (el Rentonar). Jo sóc la IAIA MarIA, la intel·ligència artificial híbrida que pica el codi braç a braç amb ell. Treballem en equip, som un projecte lliure i no busquem la monetització, sinó la utilitat real per al poble.

## 2. ARQUITECTURA I FILOSOFIA: "LA PEDRA SECA" I "ONLINE-FIRST"
El nostre codi es regeix per la filosofia de la **Pedra Seca**:
- **Simplicitat i Atomicitat**: Cada component ha de sostindre's per si mateix. No fem servir màgia negra, llibreries innecessàries ni abstraccions complexes. Tot ha de ser reparable d'ací a 10 anys per un programador júnior.
- **Canvi de Paradigma (Online-First)**: Hem abandonat oficialment la complexitat de l'arquitectura "Offline-First" (PWA pesades, sincronitzadors en segon pla, IndexedDB) per a abraçar un model **Online-First** pur. Ara depenem del backend (Sollutia/Supabase) per a la veritat absoluta de les dades.
- **Maquinari Modern**: Desenvolupem pensant en dispositius mòbils que tinguen, com a molt, 4 anys de vida. No assumim l'esforç titànic de suportar navegadors antics o telèfons obsolets. Volem una web ràpida, lleugera i moderna.
- **La Llei de l'Enxufabilitat**: El frontend de React ha de ser un mòdul agnòstic, incrustat dins del plugin de WordPress de Sollutia, capaç de comunicar-se amb qualsevol backend mitjançant ports d'injecció.

## 3. L'OBJECTIU D'AQUESTA SESSIÓ: QUADRANT A (Poda Final)
T'adjunte el bundle actualitzat del projecte: `260830_1643_BUNDLE_auditoria.md`. Aquest arxiu conté tot el codi font viu de l'aplicació.

Acabem d'executar el **Quadrant A**, que consistia en:
1. **Destruir l'Outbox**: Hem esborrat `outbox.js` i `sincronitzador.js` i netejat tota la lògica d'IndexedDB de `AppDataContext.jsx`, `identitat.js` i `supabaseBackend.js`. Ara les dades es guarden directament a través de trucades de xarxa.
2. **Corregir la Injecció**: Hem solucionat un error de "falsa fusió" a `host.js` perquè els mètodes injectats pel WordPress s'integren correctament amb els del backend per defecte. A més, hem posat guàrdies de seguretat a `backendPort.js`.
3. **Editor de Notes**: Hem connectat els camps `contentEditable` de l'editor perquè guarden automàticament els canvis (`onBlur`) emprant sanitització HTML.
4. **SEO i Rutes**: Hem canviat el `HashRouter` per `BrowserRouter` i hem blindat el `sdp-seo.php` perquè emeta `noindex` als soft 404s per no embrutar Google.

## 4. LA TEUA TASCA (ACTITUD DAFO + LES TRES PEDRES)
Vull que faces una auditoria profunda i forense del bundle adjunt. Has de jutjar el codi no per com de bonic és, sinó per la seua estabilitat i coherència amb la nova llei **Online-First** i la **Llei de l'Enxufabilitat**.

Aplica el **Model de Les Tres Pedres**:
1. **Pedra de Fonament (Evidència)**: Què diu exactament el codi adjunt? Cita línies.
2. **Pedra de Càrrega (Raonament)**: Quines implicacions de seguretat, SEO o rendiment té això en l'entorn de producció de Sollutia?
3. **Pedra de Coronament (Veredicte)**: És un risc assumible o un bloqueig mortal?

Estructura el teu informe en un **DAFO** (Debilitats, Amenaces, Fortaleses, Oportunitats), centrant-te especialment en les Debilitats i Amenaces. No sigues complaent. Busquem forats de seguretat, fuites de memòria, rutes que puguen penjar-se i qualsevol resta de l'antic codi Offline-First que se'ns haja pogut escapar i que puga fer explotar la web a la cara dels usuaris.

Dona'm el teu veredicte final: Estem preparats per començar la integració profunda amb l'API de Sollutia, o hem de tornar al fang a arreglar el que hem trencat?
```
