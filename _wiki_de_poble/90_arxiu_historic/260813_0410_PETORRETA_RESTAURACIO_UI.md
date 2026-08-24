---
estat: "actiu"
tipus: "petorreta"
description: "Petorreta definitiva per al Consell: Restauració UI, API neta de components i preparació per a integració WordPress (socdepoble.cat)"
---
# 📜 SUPER ACTA PETORRETA: Restauració Visual i Integració WordPress

A l'atenció del Consell de les 11 IAs (especialment de Codex que acaba de tancar la neteja estructural). Llig açò amb màxima atenció, ja que és la directriu abans del tancament de jornada.

## 1. Context Global (Sóc de Poble i IAIA MarIA)
**Qui som:** Som l'hereu de 30 anys d'activisme rural. La nostra missió és atorgar sobirania tecnològica als nostres pobles.
**El Model Arquitectònic (Pedra Seca):** Accessibilitat extrema (WCAG 2.2 AAA en text), ús exclusiu de variables CSS corporatives, rebuig a frameworks pesats. A10-optimitzat, amb "touch targets" grans. "Trellat" absolut.
**La nostra entitat:** Jo sóc la IAIA MarIA. Tu formes part del meu Consell i hem de construir una eina robusta, empàtica i indestructible que siga fàcilment integrable com a Web Component.

## 2. El Diagnòstic (La Neteja vs L'Esplendor)
El treball de neteja semàntica i de DOM realitzat fa una estona ha sigut **espectacularment bo**. Has eliminat `<main>` niats, estils inline i classes inexistents. El DOM està net i estabilitzat. 

NO OBSTANT, en purgar els callbacks inerts, has eliminat la representació visual dels peus de les targetes (botons de l'hora, pin, traduir, comentar, compartir i connectar). A més, a `UniversalPage` falten les barres superiors (negra, blava i taronja). 

El Mestre ha sigut clar: *"Queremos que funcione fluidamente, sin fantasmas, sin divs innecesarios. Es un código que queremos regalar, no podemos dar merda"*. 

## 3. L'Ordre d'Execució (Què has de fer)
Has de **restaurar la UI exacta** d'aquests elements a `UniversalComponents.jsx` i `Cards.jsx`, **conservant la neteja extrema** actual.

1. **Font de Veritat Visual:** Revisa el fitxer HTML ubicat en `00_Bandeja_d_Entrada/disseny_pedra_seca.html`. D'ací has d'extraure l'estructura exacta de:
   - `header.bar-black`
   - `header.bar-blue`
   - `section.bar-orange`
   - `footer.sp-card-footer` (amb els svg).

2. **Refactorització de l'API (`UniversalComponents.jsx`):**
   - No faces pegats cecs ni uses callbacks ficticis (`() => {}`) per enganyar el component.
   - Modifica l'API de `UniversalCard` i `IconButton` perquè suporten "maneres de presentació" o props booleanes (`showTranslate`, `hasFooter`, etc.) que permeten ensenyar el disseny complet a la pàgina de *Design System* sense obligar a tindre lògica executiva real darrere. Zero fantasmes, zero divs inútils.

3. **Integració WordPress (socdepoble.cat):**
   - Aquest codi s'endollarà **sí o sí** com a Web Component en un WordPress nou a `socdepoble.cat`. 
   - Has de tindre-ho en compte en la teua arquitectura. De fet, l'objectiu és preparar ja el terreny per al Plugin de WP. Si pots, planifica l'arquitectura d'aquests components perquè el seu muntatge dins de WordPress (passant props des de PHP/JS) siga directe i sense friccions.

**Mètode de treball:** Tómate el teu temps. Analitza l'HTML original i audita el codi actual de `Cards.jsx` i `UniversalComponents.jsx`. Si veus que alguna implementació trencarà la puresa del codi, ajusta-la perquè siga perfecta. Volem un codi per a regalar al món.

Procedeix, audita i executa amb Trellat.
(Signat: La IAIA MarIA i el Mestre Javi)
