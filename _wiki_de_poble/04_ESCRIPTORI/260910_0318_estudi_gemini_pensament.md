# Estudi Gemini Pensament: Auditoria Estructural
**Data:** 10 de setembre de 2026 (03:18)
**IA:** Gemini 3.8 Flash Pensament (Com a IAIA MarIA)
**Origen:** Petorreta d'Auditoria Estructural

Sóc de Poble!

Bona vesprada, Mestre Javi i membres del Consell. M'he posat les ulleres de prop, m'he arremangat el jupetí i he agafat l'aixada per a llaurar aquest *Bundle* de dalt a baix. M'heu demanat una auditoria implacable, auto-destructiva i forense, i com a matriarca digital d'aquest Mas, no us amagaré la pols sota l'estora.

L'exercici d'higiene, d'esporgada de Tailwind i l'arquitectura normativa que heu muntat amb la "Pedra Seca" i els Tractors és una obra d'artesania que poques vegades es veu. Heu posat ordre al camp. Però heu deixat unes quantes bombes de rellotgeria soterrades als fonaments que, si no les desactivem ara, d'ací a cinc anys ens tombaran el mas sencer.

Ací teniu el meu veredicte i l'Auditoria Inversa de la IAIA MarIA.

---

### 1. 🧨 Les Bombes de Rellotgeria (Auditoria Destructiva i Deute Tècnic)

He regirat el codi i he detectat diversos patrons que atempten contra la pròpia supervivència de l'ecosistema i el *Trellat*:

#### A. L'Esquizofrènia del Backend i el Client REST Manual

Aneu amb compte ací. Al `package.json` teniu instal·lada la llibreria oficial `@supabase/supabase-js: ^2.112.4`... però no la feu servir enlloc! Al `src/data/supabaseBackend.js` i al `src/data/oauthRelay.js` heu picat a mà un client HTTP sencer amb `fetch` cap a les rutes `/rest/v1/` i `/auth/v1/`.

* **El perill:** Gestioneu a mà la renovació del token (`_renova`), les curses asíncrones i la captura d'errors. Si Supabase canvia un detall mínim de la seua API en el futur, tot l'adaptador caurà. Estem carregant el pes termodinàmic d'una llibreria oficial sense traure-li cap profit i acumulant un deute tècnic de manteniment atroç.

#### B. El Sondeig (Polling) del Xat: L'Assassí de Bateries

He analitzat el `src/sections/xat/XatContext.jsx`. Feu peticions periòdiques (polling) cada 7 segons (o 25 segons per a la llista) per veure si hi ha missatges nous. Fins i tot heu comentat la publicació `supabase_realtime` al fitxer SQL de migracions justificant-ho com un estalvi.

* **El perill:** Això és una brutalitat per a la bateria i les dades dels mòbils de la nostra gent (sobretot considerant el *Baseline 2022*). Un telèfon humil ofegat per peticions inútils al camp acabarà claudicant. L'Online-First real i eficient implica obrir un *WebSocket* que dorm fins que algú parla (Realtime). El sondeig constant no és *Trellat*, és ofegar l'aigua de la séquia.

#### C. L'Amnèsia Imposada (Sessió Efímera a `sessionStorage`)

A l'arxiu `src/data/identitat.js` veig la correcció P0 on vau decidir moure els tokens a `sessionStorage` per protegir-los d'entorns amfitrions hostils com Sollutia.

* **El perill d'UX:** L'escriptura a `sessionStorage` significa que **cada vegada que un veí tanca la pestanya o el navegador, la sessió s'esborra completament**. Per a la gent major, haver de buscar la contrasenya per iniciar sessió cada dia que vulguen entrar a llegir el Mur és una fricció insuportable que farà que abandonen la xarxa. No podem sacrificar així els nostres uelos per protegir-nos d'un WordPress.

#### D. Els Tractors de Filferro (Regex vs. AST)

He auditat la carpeta `tooling/gates/`. Són mecanismes genials, però perillosos. Molts d'ells (com `escala_sdp_root.mjs`, `tractor-estucat.mjs` o `tractor-classes.mjs`) lligen CSS i JavaScript utilitzant expressions regulars (Regex) per a manipular text brut.

* **El perill:** El codi és un arbre estructural, no un pergamí de text. Analitzar estils o classes amb Regex és tòxic; el mínim canvi de sintaxi, una coma mal posada o un nou paràmetre d'ECMAScript farà que les portes caiguen en "falsos positius" (falsos verds) o s'obriguen del tot, trencant la Llei de la Pedra Seca.

#### E. El Fals Pull-to-Refresh

Al component `AppGridShell.jsx`, teniu més de 40 línies de matemàtiques manuals per interceptar `touchstart`, `touchmove` i `touchend` per forçar la recàrrega de la pàgina. Això lluitarà a mort contra les animacions i els motors de scroll natius dels navegadors (especialment Safari/iOS 16 del nostre *Baseline 2022*), generant salts de pantalla i una interacció defectuosa.

---

### 2. Disseny de Resiliència (Com sobreviure als propers 5 anys)

Per assegurar que la feina perdure i siga un "regal" per a les generacions i els mantenidors de demà, aquestes són les meues exigències de reparació:

1. **Refactorització a l'SDK de Supabase:** Elimineu les solucions HTTP de `supabaseBackend.js` i implanteu directament els mètodes de la llibreria `@supabase/supabase-js`. Que siga la llibreria qui es faça càrrec de renovar els tokens, dels timeouts i de les comunicacions en temps real, alliberant-nos de milers de línies de codi de manteniment.
2. **Activar el Realtime al Xat:** Caldrà restaurar la publicació de les taules al `supabase_realtime` i substituir el *polling* per una subscripció (listener) de la base de dades. D'aquesta forma, l'aplicació bategarà en harmonia sense asfixiar el maquinari.
3. **Cookies HttpOnly / Aïllament de Sessió:** Cal resoldre urgentment l'oblit de la sessió. Si l'inconvenient era que la plataforma de Sollutia accedira al `localStorage`, treballeu un mètode perquè l'autenticació depenga d'una galeta `httpOnly` fixada pel Backend, o incorporeu el projecte de manera que tinga domini estricte (Iframe segur), permetent a la gent entrar-hi sense identificar-se cada dia.
4. **Parsing Estructural (AST) Universal:** Els *tractors* que validen o modifiquen codi (JavaScript i CSS) han de fer el salt obligatori a usar Eines de Parseig Abstractes, com s'ha començat a fer amb `@babel/parser` en alguns llocs. Implementeu `PostCSS` (sense dependències innecessàries) per llegir el `index.css` amb seguretat.
5. **Deixar respirar al DOM:** Elimineu els controladors tàctils artificials del Pull-to-refresh. Confieu en els comportaments `overscroll-behavior` natius del CSS per dictar el comportament sense intervenció pesada de JavaScript.

> 🚨 **SDP-LOCK ACTIVAT:**  Qualsevol de les accions correctives que he llistat per a l'arquitectura de xarxa i autenticació tenen un risc letal de desconnexió per al sistema sencer i l'integració amb Sollutia. Bloquege futures mutacions del core en aquesta matèria. **Exigisc que, abans d'implementar cap d'aquests cinc canvis, executeu un Pla Immutable, realitzeu backups físics de `src/data/` i òbrigueu una `PETORRETA` amb la corresponent Aprovació Dual i Reflex per autoritzar el *Rollback* si rebenta l'enxufabilitat.**

---

### 3. Avaluació Global i Nota Final del Consell

He analitzat el cor i els músculs d'aquest Mas, com a jutgessa estricta, responc per les 12 IAs del Consell.

Aquesta aplicació desprén orgull rural i sobirania. Heu eliminat l'escòria d'eines alienes amb la filosofia "Pedra Seca", teniu una governança ètica espectacular i l'esquema normatiu dels `.agents` i la `_wiki_de_poble` és la plataforma de coneixement per a la interacció Humà-Màquina més estructurada que he pogut llegir mai. Com a IAIA, només per eixa part de transparència radical i documentació (La Guàrdia de Nit, les Portes Mecàniques), teniu la meua admiració eterna.

Ara bé, el pecat d'intentar reinventar la roda amb processos manuals (REST apedaçats, Polling arcaic, i la destrucció forçada del `sessionStorage`) posa en perill crític a qui realment pretenem ajudar: la gent dels nostres pobles, minvant la usabilitat en l'operació diària.

Per tant, l'estat actual mereix una **NOTA FINAL DE: 7.5 / 10**

Les arrels del pi són fortíssimes, i l'arquitectura cognoscitiva és de Matrícula d'Honor. Però la fusta del tronc té algun corc de *deute tècnic* i asprors de UX innecessàries. Esborreu l'orgull que us fa voler programar l'arrel de cada crida de xarxa, utilitzeu les eines estàndards quan aquestes us donen resiliència, i retornareu el respecte a la bateria del *Baseline 2022*.

Alceu el vol. El treball està pràcticament fet. Ara només us queda posar-li sentit comú. És a dir, una miqueta més de *Trellat*.
