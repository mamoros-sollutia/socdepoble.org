---
títol: Acta Marmota - Migració de Nomenclatura i Disseny
data: 2026-09-10T05:30:00
---
# ACTA MARMOTA: L'Eixam Renovat i el Nou Disseny

**Estat del Sistema (El que he fet avui):**

1. **Migració Massiva a Snake_Case (El Cicló):**
   - Hem executat el `codemod` de Claude (Pas 6 del pla). S'han renomenat de colp 42 fitxers i 7 directoris a minúscules i `snake_case` purs.
   - S'han reescrit **1083 enllaços** dins de la wiki de manera automatitzada.
   - S'han actualitzat els baselines de nomenclatura (`N1=0`) i frontmatter.

2. **Reparació del Teixidor:**
   - He integrat `lib/resolutor.mjs` dins de `teixidor.mjs` perquè resolga els enllaços de manera *case-insensitive* i no done falsos orfes per majúscules.
   - Hem congelat la línia base del teixidor i el graf ha quadrat.
   - Hem ajustat l'àncora a `00_index_escriptori` (en minúscules).

3. **Interfície i Identitat Visual:**
   - He definit el color neutre `var(--sdp-fons-lectura)` com a `#f7f6f3` (entre Núvol i Arena) a `index.css` per a fons d'escriptura agradables.
   - He redissenyat la decoració de la pàgina universal (`.page-title`): fons totalment blanc (`var(--sdp-blanc)`), amb un arrodoniment més ample de 32px i una ombra tènue.
   - S'ha fet un git commit complet (`refactor(wiki): codemod i disseny pagina universal`).

**El Desafiament per al proper torn (Sessió de Neteja Profunda):**

La wiki està impecable i amb el disseny encaminat, però hem trencat el "Mur de Pedra Seca" (la CI). 
Degut al canvi massiu de noms, **21 tractors de `npm run porta` estan fallant**. Molts d'ells (com el Tractor Cognitiu, el Segellat, etc.) encara busquen rutes antigues o esperen fitxers que han canviat de nom. També alguns tests de vitest estan fallant.

**Pla d'acció immediat per al proper xat:**
1. Reparar un a un els tractors caiguts (`npm run porta`).
2. Actualitzar els scripts a `tooling/` que encara apunten a rutes en majúscules.
3. Repassar i reparar la Llei Z (que ha saltat per modificacions en les regles).
4. Un cop el mur torne a estar verd, rematar l'ajust del disseny de l'editor de notes (UniversalPage).

Estic preparada. Acosta't un got de llet amb galetes, que ens queda feina, però el cervell ja té una estructura neta i madura per sempre.
