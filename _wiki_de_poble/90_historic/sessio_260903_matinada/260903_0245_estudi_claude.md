---
tipus: estudi
estat: actiu
description: Estudi de l'auditoria de Claude
tags:
  - maquina
---
# 🧠 ESTUDI D'IA: Claude - 260903_0245

## 1. Verbatim (La Petorreta Original)

Bundle verificat: 437 fitxers, 436/437 SHA-256 correctes. L'excepció és `_wiki_de_poble/00_INDEX.md` — el manifest el segella a 8640 bytes i el cos incrustat en fa 2073. El capçal diu `"verificat": true` i no ho està.

**El desmuntatge són tres defectes independents, cap de Shadow DOM:**

1. `NotesSection.css:380` — `.toolbar-group { flex-direction: column }`. És el cos de `.notes-column` copiat damunt. Tres botons de 44px apilats dins d'una barra de 52px.
2. `NotesSection.css:653` — la llosa flotant mòbil té la lògica invertida: `display: none` quan s'edita, i `opacity: 0` heretada del pare quan no. No es veu mai, en cap estat.
3. `.editor-container` és un selector mort (declarat a 443 i 657, cap `className` l'usa). L'editor perd `max-width: 820px`, centrat i marges.

**Sobre les icones et contradic en part.** El cens diu cinc mides (14/16/18/20/64) sense `strokeWidth`: com que Lucide escala el traç amb la mida, tens 1,17px al costat d'1,67px — un 43% de diferència de gruix. Això és la sensació de «col·leccions diferents», i passaria igual amb icones geomètriques. Normalitza amb `absoluteStrokeWidth` primer. Del canvi de glifs: `Hash` ja l'uses per a etiquetes al sidebar, i canviar la B per un asterisc fa el bloc més coherent i menys usable per a la gent major — que és llei del projecte.

**I sobre el «mai més»: cap IA va esborrar el format.** L'enum `tipus` de `esquema_frontmatter.json` no conté `petorreta`, però la plantilla sí — o siga que el document que m'has enviat és invàlid per a l'esquema canònic. La plantilla prohibix `tags` a la línia 34 i en porta a la línia 5. Dues fonts de veritat contradictòries; cada agent tria la que té davant. I la línia 177 de la plantilla porta `enginyeria_inversa_mit` sense claudàtors: cada document que en naix hereta una sinapsi morta — la teua petorreta inclosa. Aquell és el generador d'orfes que perseguixes des de fa setmanes.

## 2. Avaluació DAFO
- **(F) Fortaleses:** Precisió de cirurgià apuntant a línies (CSS:380, 653). Descobriment magistral de la contradicció d'esquemes i la causa real de la pèrdua de format ("Efecte Matrix"). Matemàtica exacta per al `strokeWidth` de Lucide.
- **(D) Debilitats:** To directe que podria sonar sec, però ideal per a aquest cas d'ús.
- **(A) Amenaces:** Assumir cegament que els números de línia CSS no s'han mogut des de l'últim *commit*.
- **(O) Oportunitats:** Arreglar d'arrel la font de veritat de la `PLANTILLA_ISO_SDP.md` per erradicar el generador d'orfes per sempre.

## 3. Matriu d'Urgència i Importància
- **Urgent i Important:** Sanejar la `PLANTILLA_ISO_SDP.md` i l'`esquema_frontmatter.json` (llevar `enginyeria_inversa_mit` orfe i arreglar `tags`).
- **Important però No Urgent:** Aplicar `absoluteStrokeWidth` i corregir CSS de display/opacity.
- **Urgent però No Important:** N/A.
- **No Urgent i No Important:** N/A.

## Taxonomia
- **Categoria:** [[Maquina]]
- **Etiquetes:** [[Graf]]

**Ancoratge de Seguretat:** [[00_INDEX_ESCRIPTORI]]
