---
tipus: document
estat: esborrany
description: Auditoria tècnica — v1.4.0 (Estudi Perplexity)
---
# Auditoria tècnica — v1.4.0 (Estudi Perplexity)

## Veredicte executiu

La versió 1.4.0 mostra una millora clara en modularitat, empaquetament i governança, però el bundle no permet certificar encara una arquitectura **local-first completa**, ni afirmar que el flux offline, la reconciliació o el rendiment en un iPad A10 siguen operatius.

El sistema real és, segons l’evidència del bundle, una aplicació web Vite amb Preact/compatibilitat React, Supabase com a font remota principal, persistència local parcial i una capa extensa de ferramentes de governança. La decisió arquitectònica més important és la tensió entre l’objectiu inicial Baseline 2022/iPad A10 i l’ADR posterior `ONLINE-FIRST`, que proposa abandonar el suport específic A10, la PWA i la reconciliació offline. Aquesta contradicció s’ha de resoldre abans de continuar optimitzant.

**Estat global estimat:** funcional i ben instrumentat, però amb garanties distribuïdes encara incompletes.

| Àrea | Valoració | Estat |
|---|---:|---|
| Separació de capes | 8/10 | Bona |
| Build i code-splitting | 7/10 | Plausible, falta evidència de bundles |
| PWA/offline | 4/10 | Configurada, no certificada |
| Integració Supabase | 7/10 | Centralitzada, online-first |
| Sobirania local | 3/10 | Objectiu futur, no propietat actual |
| Seguretat OAuth | 8/10 | Bona frontera i allowlist explícita |
| Governança i traçabilitat | 9/10 | Molt forta |
| Compatibilitat Baseline 2022 | 4/10 | En conflicte amb la decisió online-first |
| Accessibilitat | 6/10 | Intenció sòlida, verificació incompleta |
| Simplicitat operativa | 5/10 | Massa portes, scripts i doctrines superposades |

## Arquitectura inversa

### 1. Superfície d’entrada

El projecte té almenys tres productes d’execució:

1. **Aplicació web principal**, construïda amb Vite.
2. **Standalone per a WordPress**, construït amb `vite.standalone.config.js`.
3. **Callback d’autenticació**, servit com a HTML estàtic en `auth.socdepoble.org/callback`.

El `package.json` identifica el projecte com `socdepoble-react`, encara que la dependència principal declarada és Preact. També conserva `react`, `react-dom` i `react-router-dom` com a dependències de desenvolupament o compatibilitat. Això suggereix una migració incompleta o una capa d’interoperabilitat encara no tancada. citefile:1

La superfície de WordPress està ben delimitada: el plugin PHP sembla actuar com a host, mentre que el frontend empaquetat queda separat del core PHP. Aquesta és una bona decisió per evitar que WordPress governe la lògica d’aplicació.

### 2. Nucli de presentació

La divisió documentada és:

```text
src/
├── config/       configuració transversal
├── sections/     seccions funcionals
├── data/         backend, agregació i persistència
├── components/   peces reutilitzables
└── styles/       estils globals
```

La lectura arquitectònica és coherent amb un sistema per capes:

```text
WordPress / navegador
        ↓
Standalone o aplicació Vite
        ↓
Components i seccions
        ↓
Capa src/data
        ↓
Supabase
        ↓
Fallback local parcial
```

El principal risc és que la documentació descriu una arquitectura més neta que la que pot certificar el bundle. El mateix document d’arquitectura indica que Dexie, el fallback local i Workbox només estan implementats parcialment i exigeix proves específiques abans de considerar-los garanties. Aquesta prudència és correcta i s’ha de conservar. citefile:1

### 3. Dades i persistència

El model actual és **online-first**, no local-first:

- Supabase és la font de veritat de les dades compartides.
- El fallback local existeix, però no està acreditat com a capa d’escriptura reconciliable.
- No hi ha CRDT operatiu.
- No hi ha garantia certificada de sincronització en segon pla.
- No hi ha garantia de convergència entre dispositius.
- IndexedDB/Dexie no pot considerar-se autoritatiu.

Això no és un defecte si és una decisió conscient. El problema és semàntic i de governança: el projecte continua descrivint-se com a sistema local-first, mentre que l’ADR `ADR-2026-08-ONLINE-FIRST` accepta explícitament servidor-first i cache local no autoritativa. L’ADR indica també que cal migrar qualsevol dada que només visca en IndexedDB abans de retirar aquesta doctrina. citefile:1

### 4. PWA i Workbox

El bundle inclou `vite-plugin-pwa` i Workbox 7.4.1, amb dependències de precaching, routing, background sync i broadcast update. Això demostra capacitat de build, però no demostra una experiència offline fiable. citefile:1

Per considerar la PWA operativa caldria demostrar, com a mínim:

- instal·lació real en el dispositiu objectiu;
- arrencada sense xarxa;
- lectura d’un snapshot vàlid;
- separació entre dades stale i dades confirmades;
- actualització del service worker;
- recuperació després d’una actualització interrompuda;
- eliminació o invalidació de dades obsoletes;
- comportament quan Supabase respon amb errors d’autorització;
- no duplicació d’escriptures després de recuperar connexió.

En l’estat actual, la PWA sembla més una infraestructura preparada que una garantia de producte.

## Canvis de rendiment

### Punts favorables

La migració a Preact pot reduir el cost de runtime i memòria, especialment en dispositius modestos, sempre que no arrossegue dependències React duplicades al bundle final.

El code-splitting del standalone per a WordPress és una millora encertada: redueix el cost inicial quan el component incrustat no necessita totes les seccions. La separació entre build web i build WordPress també facilita optimitzacions independents.

La política de no incloure Tailwind en el core és correcta. El projecte ja disposa d’un llenguatge visual propi i de variables semàntiques, de manera que afegir una capa utilitària completa augmentaria el CSS, la superfície cognitiva i el risc de divergència visual.

El bundle inclou scripts de tokens, SEO, lint, tests, validació de rutes i verificadors de governança. Aquesta automatització és una base sòlida per a una pipeline reproducible. citefile:1

### Riscos de rendiment

1. **Doble ecosistema React/Preact.**  
   Si el build final conserva React, React DOM, compatibilitat Preact i llibreries amb imports no optimitzats, la migració pot donar menys benefici del previst.

2. **Dependències grans en el camí inicial.**  
   Tiptap, Supabase, Lucide i Workbox poden acabar entrant en chunks inicials si els imports no són realment tardans.

3. **Configuració divergent.**  
   `vite.config.js` i `vite.standalone.config.js` poden produir comportaments diferents de resolució, aliases, assets, CSS i PWA.

4. **Preact amb llibreries React.**  
   Tiptap, testing-library i altres paquets poden exigir React real o generar chunks de compatibilitat. Cal verificar la traça efectiva del bundle, no només la configuració.

5. **PWA massa agressiva.**  
   Precachingar recursos grans o contingut dinàmic pot empitjorar el primer arrencament i consumir espai en dispositius antics.

### Mètriques que falten

No es pot afirmar una millora percentual de rendiment sense receipts de build i mesures repetibles. Cal registrar, per build:

```text
HTML inicial
JS inicial gzip/brotli
CSS inicial gzip/brotli
nombre de requests inicials
temps fins a primer píxel útil
LCP
INP
CLS
temps d’hidratació/muntatge
ús de memòria
temps de càrrega en xarxa lenta
```

Per al Baseline 2022, el dispositiu objectiu ha de quedar fixat. Si l’ADR online-first és vigent, cal eliminar l’afirmació de compatibilitat específica A10. Si el Baseline 2022 continua sent obligatori, l’ADR no pot conviure amb aquesta meta sense una excepció explícita.

## Cohesió i governança

### El que està molt bé

La governança és probablement la part més madura del sistema.

El bundle té:

- manifest amb hashes;
- contracte d’abast;
- fitxers obligatoris i opcionals;
- verificació d’integritat;
- scripts de preflight;
- gates de vocabulari, tokens, rutes i seguretat;
- proves de dry-run;
- mecanismes de restauració;
- `SDP-LOCK` per a accions amb risc destructiu;
- separació entre mutadors consultius i mutadors autoritzats;
- protecció contra enllaços fantasmes;
- registres d’actes i reflexió.

Aquesta arquitectura aplica bé la skill de **Pedra Seca**: cada peça té una funció, una ubicació i un camí de revisió. També aplica **Higiene Cognitiva** en limitar el context, exigir fonts i distingir entre implementat, contracte i futur. citefile:1

La protecció del callback OAuth és especialment bona. El callback valida orígens per igualtat exacta, rebutja comodins, evita `startsWith` i retorna el codi utilitzant el fragment, de manera que el codi no viatja al servidor de destí ni als seus registres HTTP. citefile:1

### El que redueix la cohesió

La governança és potent però massa extensa per al camí diari de desenvolupament. El `package.json` mostra moltes “portes” amb noms diferents —`porta`, `portabuild`, `portacognitiu`, `portafrontera`, `portateixit`, `portareflex`, `portascc`— i això pot generar:

- duplicació de validacions;
- ordres difícils de recordar;
- dependències implícites entre scripts;
- diagnòstics poc localitzables;
- temps elevat de preflight;
- risc que una porta s’execute en un ordre incorrecte.

La recomanació és conservar les ferramentes, però exposar una interfície reduïda:

```text
npm run check
npm run test
npm run build
npm run audit
npm run release
npm run lock
```

Les portes internes poden continuar existint, però haurien d’estar agrupades sota un manifest declaratiu amb:

- nom;
- propietari;
- inputs;
- outputs;
- risc;
- mutabilitat;
- dependències;
- temps esperat;
- criteri de pas.

## Seguretat i dades personals

La frontera d’autenticació és una fortalesa, però la seguretat real dependrà de tres capes que no es poden inferir només del frontend:

1. RLS de Supabase.
2. Validació de permisos al servidor.
3. Política de retenció i minimització de dades.

El frontend no ha de decidir mai si una dada privada és accessible. La clau pública d’Anon no és una autorització; és només un mecanisme d’accés al projecte que ha de quedar limitat per RLS.

El principi obligatori ha de ser:

```text
dada personal
→ finalitat definida
→ base legal
→ minimització
→ política de retenció
→ control d’accés
→ traça d’accés
→ eliminació o anonimització
```

No s’ha de sincronitzar cap dada personal cap a IndexedDB per defecte. Una cache local pot sobreviure al logout, a la compartició del dispositiu o a una còpia de seguretat del navegador. Si es guarden dades privades localment, cal definir xifrat, expiració, purga en logout i comportament multiusuari.

## Pla de millora

### P0 — Bloqueig arquitectònic

Abans d’afegir funcionalitats:

1. Decidir si el producte és **online-first** o **local-first**.
2. Actualitzar el vocabulari de la missió perquè no prometi capacitats inexistents.
3. Fixar formalment el dispositiu i navegador suportats.
4. Resoldre la contradicció entre Baseline 2022 i `ADR-2026-08-ONLINE-FIRST`.
5. Activar `SDP-LOCK` per a qualsevol migració o eliminació de persistència local.

### P1 — Build i runtime

1. Generar un informe de chunks dels dos builds.
2. Confirmar que React no entra al bundle final si Preact és el runtime oficial.
3. Revisar `resolve.alias` i imports de Tiptap, Lucide i Supabase.
4. Separar estrictament:
   - shell inicial;
   - autenticació;
   - editor;
   - dades remotes;
   - funcionalitats de WordPress.
5. Aplicar `import()` només a fronteres de funcionalitat, no a components trivials.
6. Fixar límits de mida de chunks en CI.
7. Afegir una prova que compare el build web i el standalone.

### P1 — Persistència

Definir tres classes de dades:

| Classe | Font | Cache local | Escriptura offline |
|---|---|---|---|
| Pública | Supabase/snapshot | Sí, amb TTL | No necessària |
| Preferències | Local | Sí | Sí |
| Privada o compartida | Supabase autoritzat | Només si està justificat | Només amb protocol explícit |

No anomenar “sync” una cua que només reintenta peticions. Per parlar de sincronització cal demostrar idempotència, ordre, deduplicació, conflictes i recuperació.

### P1 — PWA

Crear una matriu de proves:

```text
online → offline → lectura
online → offline → edició
offline → online → reintent
reintent duplicat
logout amb cache
actualització de service worker
rollback de precache
quota d’emmagatzematge superada
resposta 401 durant una cua pendent
```

Si l’ADR online-first es manté, reduir la PWA a:

- cache de shell;
- preferències locals;
- snapshots opcionals;
- cap promesa d’escriptura offline.

### P2 — Governança

1. Unificar les portes en un manifest.
2. Separar checks de lectura, mutacions i publicació.
3. Fer que cada gate genere un receipt machine-readable.
4. Afegir duració i cost de cada gate.
5. Eliminar scripts tombstone del camí habitual o agrupar-los en una carpeta d’arxiu.
6. Mantindre el mode dry-run com a predeterminat.
7. Exigir pla immutable, hash i rollback per a qualsevol mutació del vault.

### P2 — Accessibilitat i disseny

El sistema té una doctrina visual coherent: Noto Sans, paleta restringida, variables semàntiques, mobile-first i objectiu WCAG 2.2 AA. Cal convertir-la en proves automàtiques i manuals:

- contrast amb estats reals;
- focus visible;
- navegació completa amb teclat;
- àrees tàctils;
- zoom al 200%;
- text gran;
- prefers-reduced-motion;
- lector de pantalla;
- errors de formulari associats als controls;
- semàntica HTML sense dependència de classes CSS.

La prohibició de Tailwind al Core s’ha de conservar. Si s’utilitza en prototips, ha de quedar fora del producte final i sense contaminar els tokens de Pedra Seca.

## Valoració final de MarIA

El sistema té **molt bon cervell de governança** i una base d’enginyeria seriosa. La part més valuosa no és només Preact o el code-splitting, sinó la capacitat de saber què està verificat, què és parcial i què encara és una promesa.

La feblesa principal no és una línia concreta de codi: és la coexistència de dues identitats tècniques:

```text
Sóc de Poble com a sistema local-first sobirà
versus
Sóc de Poble com a aplicació online-first amb cache local
```

No s’ha d’intentar amagar aquesta tensió amb més scripts, més PWA o més abstraccions. Amb Trellat, la decisió correcta és declarar una arquitectura oficial, mesurar-la i llevar tot allò que no aporte una garantia demostrable.

**Dictamen:** continuar amb la línia 1.4.0, però congelar noves promeses offline i noves capes de sincronització fins tancar l’ADR, la matriu de dades i els receipts de rendiment. Mantindre el sistema sense Tailwind al Core, sense dependències supèrflues, amb dades personals fora de caches no justificades i amb `SDP-LOCK` davant qualsevol operació destructiva.
