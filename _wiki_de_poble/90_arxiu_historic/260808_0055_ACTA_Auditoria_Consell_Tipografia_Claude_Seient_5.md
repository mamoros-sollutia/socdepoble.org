---
estat: "esborrany"
tipus: "acta"
description: "Sintetització de l'auditoria i les decisions pendents presentades per Claude (Seient Núm. 5)."
---
# Acta d'Auditoria del Consell: Claude (Seient Núm. 5)

**Veredicte**: 38/100
**Diagnòstic**: La sobrecàrrega de divs era el símptoma; la malaltia eren tres contradiccions estructurals al CSS.

## Trobades Forenses (T-1 a T-5)
1. **Cànon fantasma (P0)**: CSS editorial orfe dins d'una classe `.cms-preview` que no existia al body, deixant les llistes i blockquotes sense estils.
2. **Doble llei tipogràfica (P0)**: Els blocs de disseny forçaven H2 i H3 a ser idèntics, i duplicaven el ritme dels paràgrafs, oscil·lant la font de veritat.
3. **Frau d'accessibilitat (P0)**: El color `pedra-500` sobre `pedra-100` donava 4,35:1 (suspén AA), incomplint l'AAA reclamat per al text.
4. **Escala declarada ≠ escala real (P1)**: Els tokens no coincidien amb el que deia el document per H3, H4, H5, H6.
5. **H1 sense marges (P1)**: H1 es col·lapsava sense restaurar marges.

## Solucions Proposades
Claude ha aplicat 14 pedaços (que tenim a la safata d'entrada al fitxer `.diff`), instaurant un **motor tipogràfic editorial global** que erradica la dependència de caixes contenidores (`<div>`) i assigna els ritmes verticals correctes. A l'igual, ha retirat codi orfe i components innecessaris. L'HTML esdevé pur i totalment exportable.

## Decisions Reservades al Mestre (Pendents de Resolució)
- **D-1 (Escala de Tokens)**: Claude ha alineat els tokens de CSS al que deia el text canònic (H3=24, H4=20, H5=16, H6=14) en lloc de l'inrevés. S'aprova o volem l'escala antiga?
- **D-2 (Geometria)**: Les capçaleres estan centrades però la columna de text a l'esquerra. Manté esta geometria d'eixos perquè la considera part de la identitat, però planteja que si volem tot centrat caldrà fer ajustos menors.
- **D-3 (Contrast AAA vs AA)**: H2/H4 taronja `primary-600` donen 3,4:1 (Aproven AA per text gran però no AAA). Claude no ho ha canviat sense el nostre vist-i-plau. Acceptem degradar a AA per a estos títols o canviem la paleta?

**Acció Següent**: Restem a l'espera de rebre i registrar la resta de petorretas (i resoldre els 3 dilemes) abans d'aplicar qualsevol canvi estructural al disseny.
