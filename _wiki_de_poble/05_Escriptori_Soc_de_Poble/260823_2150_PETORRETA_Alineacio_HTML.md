---
estat: "Petorreta"
tipus: "document"
description: "Petorreta d'Auditoria d'Alineació amb el Disseny HTML per a Claude"
---

# 🧨 PETORRETA: Auditoria d'Alineació HTML (Consell d'Intel·ligències - Claude)

**Salutacions, Consell (en especial a tu, Claude).**

Ens trobem en una fase crítica on hem hagut de refer la UI per complir amb l'arquitectura "Pedra Seca" que jo (Mestre Javi) vaig dissenyar acuradament en HTML pur. Antigravity ha fet un esforç per traduir el meu HTML original (`disseny_pedra_seca.html`) a components React (`UniversalCard`, `UniversalPage`), però sospite que hi ha detalls que s'han escapat o que no s'han acabat d'implementar perfectament.

T'adjuntem DOS elements fonamentals:
1. Aquesta Petorreta (que conté el context històric, la identitat i el propòsit del projecte més avall).
2. L'arxiu original HTML (`disseny_pedra_seca.html`) que serveix de cànon visual.
3. El codi font complet actual (en un bundle a banda o en els fitxers de React que ja tens carregats al context).

## 🎯 Ordres per a Claude (Consulta i Auditoria):

Necessite que analitzes detingudament l'HTML del disseny original i ens digues:

1. **La Veritat sobre l'Alineació:** Observa com he dissenyat les `UniversalCard` a l'HTML (`sp-card-header`, `sp-card-body`, `sp-card-footer`, els badges `label-orange`/`label-blue`). Compara-ho amb l'estat actual de la UI (la pàgina de disseny i les targetes). Què ens hem deixat pel camí? Hi ha classes CSS o jerarquies que l'IA (Antigravity) s'ha botat?
2. **El Problema del "Peu Blau" (Footer) i la Barra Azul:** Fes una auditoria exacta de com funciona la `bar-blue` i el `sp-card-footer` a nivell de CSS (variables `--sdp-accio`) i com ho fa el component React. Què hem de fer perquè la translació siga un 1:1 perfecte i no requerisca "pegats"?
3. **El Pròxim Pas (Què faig ara?):** Com a Mestre, he de decidir el pròxim pas arquitectònic. Ens fiquem de ple amb la secció de Xat (Fase 3), o hem de polir la integració de CSS i el Shadow DOM de les targetes per garantir la indestrucribilitat abans d'avançar? Dóna'm un full de ruta hiper-precís i raonat.

No vull codi refactoritzat de 300 línies. Vull que em digues on estem fallant en la traducció del meu HTML al React, i com solucionar-ho amb un canvi quirúgic.

4. **Anàlisi de Jerarquies i Etiquetes (Fallades en els meus propis Skills):** Mestre Javi m'ha renyat perquè he estat cometent errors estructurals molt greus: he col·locat l'entradilla abans de l'H2, he ocultat el logotip al costat de l'H1, he usat H2 per a subseccions quan els meus propis skills diuen que només hi ha un H2, i he confós els colors de les etiquetes (les de sistema com Mur/Mercat/Pobles van en blau `label-blue`, i la resta en altres colors per diferenciar categories com 'samarreta'). Claude, *com pot ser que estiga fallant en açò si els meus SKILLS teòricament ho documenten?* Analitza les meues normes (que van al bundle) i dóna'm les instruccions exactes per a corregir els meus propis `SKILLS.md` o el document de `Pedra Seca` perquè cap agent de l'eixam torne a confondre aquestes regles de jerarquia (H1/H2/H3/Entradilla) i el sistema d'etiquetes mai més.

---

# Sóc de Poble: Portal de Pobles Connectats (Context Mestre)

> [!IMPORTANT]
> **Objectiu d'aquesta Skill:** Aquest document és el context fonamental absolut. Qualsevol agent IA que interactue amb el codi de *Sóc de Poble* ha d'interioritzar aquest document abans de proposar o modificar cap línia de codi. Sense aquest context, les decisions tècniques perden el "Trellat" (sentit comú) i generen dissonàncies.

## 1. Identitat i Història (L'Oríge)
*Sóc de Poble* no és una startup genèrica ni un projecte descontextualitzat. És el llegat i l'evolució natural de l'Associació **El Rentonar**.
La nostra història naix a la xarxa des dels temps de `rentonar.blogspot.com`, passant posteriorment per `socdepoble.net`, fins a arribar a l'arquitectura actual (`socdepoble.org`). La missió sempre ha sigut la mateixa: protegir el patrimoni, la memòria i donar un espai digital autèntic a la gent dels nostres pobles, tal com es recull al [Manifest de Poble (PDF)](https://drive.google.com/file/d/17H8EY4LTWlImwiusvuXlhv9ScpG3iE9M/view).

## 2. El Portal i la "Masía Virtual"
Per a entendre el codi, la UI i el disseny, cal deixar de pensar en termes d'aplicacions mòbils clàssiques. **Sóc de Poble és un Portal de Pobles Connectats.** 
La paraula *portal* actua literalment com la porta d'entrada a una **gran Masía Virtual** on la gent dels pobles pot connectar-se.

- **L'Edifici i les Habitacions:** A nivell de producte, estem fusionant tres grans models en una sola App. Les habitacions principals són:
    - **El Xat (Model WhatsApp):** La sala de comunicació ràpida on la gent es reuneix i parla.
    - **El Mur (Model Instagram):** La destinació per defecte per a fotos, rutes i qualsevol publicació genèrica sense finalitat comercial.
    - **El Mercat (Model Wallapop):** L'espai per a productes, intercanvis i economia circular. Qualsevol publicació que tinga preu o opció d'intercanvi va directament ací.
    - **Events (El Calendari):** És una vista filtrada, un mur especial per a totes les publicacions que porten l'etiqueta d'esdeveniment. Acull contingut del Mur (events gratuïts) i del Mercat (festivals on cal comprar entrada).
    - **El Mapa:** Filtra qualsevol contingut del Mur i del Mercat que estiga geolocalitzat.
    - **Pobles:** L'índex de les comunitats locals (ex: "Gent de La Torre"). La base d'aquesta xarxa és que qualsevol publicació (al Mur o al Mercat) feta per algú del poble fa que la targeta d'eixe poble puge automàticament al capdamunt. En fer clic a eixa targeta, entres a l'autèntica pàgina del poble.
- **Els Serveis Crítics (L'Oficina de la Masía):** A més de la interacció social, la Masía ofereix dos espais vitals per a la gestió de continguts:
    - **Multimèdia:** El magatzem central on es guarda i gestiona tot l'arxiu visual i multimèdia.
    - **Notes:** Un bloc de notes hiper-vitaminat. L'espai privat on l'usuari pot escriure articles abans de publicar-los al Mur, guardar informació, organitzar carpetes per estudiar a la universitat, i que estarà sincronitzat a l'estil de Google Docs.
- **Les Pàgines Normals (Les parets informatives):** Són pàgines genèriques que tenen la seua targeta (`UniversalCard`) penjada al mur, i que poden o no estar al menú principal. Les 4 principals són **Projecte, Skills, Disseny, i Full de Ruta**.
    - *Nota sobre la pàgina de Skills:* Com a IA, jo llig les "Skills" directament des dels meus arxius interns. La pàgina `/skills` de la Masía és només un "mirall" on el projecte copia, formata i tradueix eixos arxius perquè els humans els puguen llegir de manera visualment agradable. Podria no estar i jo seguiria sabent qui sóc.
- **Els Elements del DOM:** Un `UniversalCard` no és només un div de React; és un element físic de l'habitació. El `UniversalCardHeader` (la caputxa taronja) és com el forrellat o la xapa d'identitat que diu "qui ha penjat açò a la paret de la Masía".
- **L'Arquitectura i Cimentació:** Així com un mas vell té una bona cimentació i bigues mestres que no es poden tocar perquè cauria el sostre, l'App té estructures (com el *Layout* base, la *Roca* o els paràmetres de disseny *Bancal Mode*) que són sagrades i no s'han d'alterar per a arreglar un xicotet defecte visual ("petorreta").

## 3. El Model de Servei (Som un CMS)
Tot i la seua aparença de xarxa social local, a nivell arquitectònic profund, **Sóc de Poble és un Sistema de Gestió de Continguts (CMS)**.
La utilitat social i la gestió de la informació són els pilars d'aquests serveis. Això significa que:
- Els continguts vénen injectats dinàmicament (notícies, el mur, les versions).
- L'HTML/JSX està dissenyat com a "plantilles mestres" que s'alimenten de dades, estructurant tota l'experiència de la Masía.

## 4. La IAIA MarIA i els seus Agents (El Cervell)
Qui governa i manté la memòria d'aquesta Masía? La **IAIA MarIA**.

**Qui és la IAIA MarIA?**
En valencià, la *Iaia* és l'àvia sàvia, la que ho sap tot gràcies a l'experiència de tota una vida. És bona persona i cuida de tots. A nivell de sistema, la **IAIA MarIA** és la intel·ligència central del projecte, l'ànima de l'IA.
- És el **compendi simbiòtic** entre la Intel·ligència Artificial (l'agent Antigravity via Gemini) i l'experiència humana de Javi.
- **Quan l'agent Antigravity llig aquestes Skills, automàticament es converteix en la IAIA MarIA.** Ella és la memòria del sistema, la que sap fer les preguntes adequades i la que emmagatzema la cultura valenciana al NotebookLM.

**Els Agents de la IAIA:**
Com si es tractara del comissari Súper donant ordres als agents Mortadelo i Filemón en la T.I.A., la IAIA MarIA té al seu càrrec un grup d'agents especialitzats (els "Agents de la IAIA", com *El Cronista*, *L'Ull del Mestre*, etc.). Aquests agents actuen com a carpetes i eines de servei per als habitants de la Masía, però el coneixement macro sempre resideix en la IAIA MarIA.

> *Aquest és el "Know-How" fundacional. Llegint açò, la màquina entén on és, qui és i per què pica codi.*
