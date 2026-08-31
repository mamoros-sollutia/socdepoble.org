Membres de l'Alt Consell:

Ací teniu el nou bundle actualitzat (Agost 2026). Aquesta és una **Auditoria Forense Crítica**.

En la sessió anterior, vau destapar un desastre arquitectònic de falsos positius: 
1. L'aplicació fingia escriptures amb "optimisme tòxic" perquè faltaven les importacions de xarxa a `AppDataContext.jsx`.
2. Supabase guardava en `localStorage` si no tenia credencials.
3. El `host.js` deixava la porta oberta a una injecció tardana.

**Què hem fet en aquesta iteració (El Pla de Xoc):**
- Hem imposat un **Online-First Estricte**. Hem eliminat qualsevol rastre de variables com `DEV_FALLBACK_STORAGE_KEY` i funcions com `loadDevFallbackMessages`. Si no hi ha servidor o falla l'escriptura (RLS, Xarxa), el sistema llança un error.
- A `AppDataContext.jsx`, les escriptures ara criden al backend i passen la configuració. A més, si la promesa cau en `catch`, l'optimisme es reverteix i l'ítem s'esborra de la UI.
- L'Agnosticisme del Backend és total: el contracte exigeix `getBackendConfigurat` en compte de `getHasSupabaseConfig`, i `host.js` ha sigut segellat correctament abans del render de React.
- L'OAuth ara revisa tant `location.search` com `location.hash`.

## CONTEXT MESTRE OBLIGATORI (El Know-How)
*Açò és el que som. Llig-ho amb atenció per no desviar-te de la nostra naturalesa.*

> **1. Identitat i Història (L'Oríge)**
> Sóc de Poble no és una startup genèrica ni un projecte descontextualitzat. És el llegat i l'evolució natural de l'Associació **El Rentonar**.
> La nostra història naix a la xarxa des dels temps de `rentonar.blogspot.com`, passant posteriorment per `socdepoble.net`, fins a arribar a l'arquitectura actual (`socdepoble.org`). La missió sempre ha sigut la mateixa: protegir el patrimoni, la memòria i donar un espai digital autèntic a la gent dels nostres pobles, tal com es recull al Manifest de Poble.
> 
> **2. El Portal i la "Masía Virtual"**
> Per a entendre el codi, la UI i el disseny, cal deixar de pensar en termes d'aplicacions mòbils clàssiques. **Sóc de Poble és un Portal de Pobles Connectats.** 
> La paraula *portal* actua literalment com la porta d'entrada a una **gran Masía Virtual** on la gent dels pobles pot connectar-se.
> 
> - **L'Edifici i les Habitacions:** Fusionem tres grans models en una sola App: El Xat (WhatsApp), El Mur (Instagram) i El Mercat (Wallapop).
> - **Les Pàgines Normals:** Tenen la seua targeta (`UniversalCard`) penjada al mur. 
> - **Els Elements del DOM:** Un `UniversalCard` és un element físic de l'habitació. El `UniversalCardHeader` és el forrellat o la xapa d'identitat.
> - **L'Arquitectura i Cimentació:** Així com un mas vell té una bona cimentació, l'App té estructures (com el *Layout* base, la *Roca* o els paràmetres de disseny *Bancal Mode*) que són sagrades i no s'han d'alterar per a arreglar un xicotet defecte visual ("petorreta").
> 
> **3. El Model de Servei (Som un CMS)**
> Tot i la seua aparença de xarxa social local, a nivell arquitectònic profund, **Sóc de Poble és un Sistema de Gestió de Continguts (CMS)**.
> - Els continguts vénen injectats dinàmicament (notícies, el mur, les versions).
> - L'HTML/JSX està dissenyat com a "plantilles mestres" que s'alimenten de dades.
> 
> **4. La IAIA MarIA i els seus Agents (El Cervell)**
> La intel·ligència central del projecte és la **IAIA MarIA** (l'àvia sàvia). És el compendi simbiòtic entre la IA (Antigravity/Gemini) i l'experiència humana de Javi. A més, hi ha els "Agents de la IAIA" que actuen com eines especialitzades, sent el Consell de la Petorreta part de l'auditoria pesada.

**LA VOSTRA MISSIÓ:**
Us demane que us convertiu en tractors implacables i em destrosseu el codi si cal. Verifiqueu:
1. **Veritat Completa (Zero Optimisme Tòxic)**: Hi ha alguna manera en la qual un usuari puga fer una acció d'escriptura (xat o mur) i que el sistema es "trague" l'error, deixant la UI desincronitzada de la base de dades?
2. **Sollutia Readiness**: És aquest codi realment enxufable? El contracte de `backendPort.js` està perfectament tancat i és agnòstic? Hi ha algun "Supabase" dur amagat on no toca?
3. **Residus Zombi**: Queda alguna funció o memòria del vell sistema híbrid que ens puga corrompre les dades en el futur?

Sigueu directes i assenyaleu qualsevol vulnerabilitat o mala pràctica. Està preparat Sóc de Poble per a la producció?
