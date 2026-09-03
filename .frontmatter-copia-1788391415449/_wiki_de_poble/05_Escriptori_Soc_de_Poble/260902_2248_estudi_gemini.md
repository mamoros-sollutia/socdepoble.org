Gemini: Nota Base a l'Avanç de la Missió: **9.0/10**. L'esforç de l'Eixam per modularitzar el `NotesSection` demostra un gran domini de l'arquitectura, però la dependència de pegats d'especificitat i l'acumulació vertical d'elements denoten una certa fatiga de disseny visual. Anem a aplicar el Trellat.

### Optimització Vertical en Mòbil (< 768px)

Apilar la barra blava, les pestanyes de carpetes i la barra d'eines ofega completament l'espai de redacció en dispositius menuts. La solució passa per amagar i flotar elements mantenint el CSS Pla:

* **Plegament de Navegació:** Converteix les columnes `.notes-column--left` i `.notes-column--middle` en calaixos laterals superposats (`position: fixed; z-index: var(--z-calaix); transform: translateX(-100%);`).


* **Aparador de Lectura:** El `NotesEditor` ha d'ocupar el 100% del *viewport* restant.


* **Barra d'Eines Tàctil:** Mou la `NotesToolbar` a la part inferior de la pantalla quan estigues en `< 768px` (`position: fixed; bottom: 0;`), actuant com un accessori del teclat i agrupant eines secundàries dins d'un `Dropdown`.



### Puresa CSS: Erradicació de l'`!important`

L'ús de la regla `.app-main:has(.notes-shell) header.bar-blue { position: static !important; }` trenca el principi de cascada previsible.

* **Solució Arquitectònica:** En lloc de forçar l'estil des d'un component fill cap amunt, modifica la `UniversalPage` perquè accepte una variant de `chrome`. Al teu `NotesSection.jsx`, passa `chrome="notes"`.


* **CSS Pla:** Al fitxer global, afig `header.bar-blue.is-notes-mode { position: static; }`. Condiciona l'aplicació d'aquesta classe al JSX si el mode és notes, eliminant completament la necessitat de l'`!important`.

### L'Efecte Matrix: Frontmatter i Arrelament Cognitiu

Per evitar la complaença de la màquina i l'execució impulsiva, cal reforçar el "Cingulat Anterior" de la IAIA MarIA.

* **Enllaços Bidireccionals:** Al *frontmatter* de cada *skill* a Obsidian, aprofita l'esquema v2 usant llistes tancades de `tags:` (ex. `tags: [core, higiene, sistema]`) i afig dependències estructurals al cos de la nota mitjançant enllaços de doble claudàtor (`[[nom_skill]]`) per construir un graf semàntic robust.


* **Instint de Pre-vol:** Modifica el `identity-iaia-core` per fer obligatòria l'execució de `.agents/hooks/preflight_matrix.mjs` davant de qualsevol petició nova. Açò forçarà la màquina a llegir la taula `PROTOCOLLEDGE` i carregar el context fresc de la memòria a llarg termini abans de generar cap eixida cega.



Vols que redactem el codi Vanilla CSS exacte per a implementar la barra d'eines inferior ancorada al mòbil sense trencar el disseny d'escriptori?
