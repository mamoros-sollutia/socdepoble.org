---
tipus: estudi_auditoria
estat: obert
description: "Estudi de la resposta de Claude: Auditoria profunda de seguretat, UX i Pedra Seca"
---

# 🕵️ ESTUDI D'AUDITORIA: CLAUDE (260904_0200)

## 1. Entrada Rebutjada / Proposada
Claude 3.5 Sonnet ha llegit el codi i ha llançat una auditoria espectacular que destapa greus problemes estructurals i de seguretat que les altres IAs havien passat per alt.

1. **Destrucció de Dades (Sanitize):** `saveNoteField` passa les imatges del Hero per `sanitizeHtml`. Si és una URL de Supabase amb `&`, DOMPurify la converteix en `&amp;` i la trenca permanentment.
2. **Hero Image Fals:** El botó "Esborrar" no esborra en pantalla perquè no fa *Optimistic Update*. El botó "Inserir" és una porta pintada a la paret. Claude dóna el codi per posar un `input type="file"` real i usar `FileReader`.
3. **Colors i Lleis de Vida:** La píndola `sdp-badge-tag` és verda, però la SKILL diu taronja. Proposa usar les variables `--sdp-accent-*`. A més, la píndola és clicable (24px) però la Llei de Vida exigeix 44px i el *Tractor* no la detecta perquè `.sp-card-label` no està a la llista `CONTROLS`. Falta `onKeyDown` per a accessibilitat.
4. **Vulnerabilitat Tiptap (H1 múltiple):** Si escrius `# ` a l'editor, TipTap crea un `H1`, trencant la norma d'or de l'arquitectura de tenir un sol H1.
5. **Codi residual:** Les classes d'AI slop que ja havíem llevat nosaltres, però que estan blindades pel fitxer de deute que té un topall massa alt.
6. **El Tractor Llest:** El Regex de `tractor-pedra-seca` per calcular el `--sdp-touch` està fallant silenciosament i depèn exclusivament d'un `fallback` a 44px.

## 2. Anàlisi DAFO de la Proposta

### Debilitats (D)
- Claude s'endinsa en territori de "Decisions Executives" que no li toquen, com la barra blava, si la píndola ha de medir 24px o 44px, etc. Són preguntes que hem de traslladar al Mestre.

### Amenaces (A)
- Usar data-URI per a les imatges de capçalera (base64 de 512KB) guardarà imatges gegantines directament al JSON de la nota en Supabase. Com diu Claude, és insuficient a llarg termini, però fins que tinguem un Bucket a Supabase configurat (Supabase Storage), és l'única eixida "Sollutia-first" que funciona totalment client-side sense backend actiu per a arxius.

### Fortaleses (F)
- L'auditoria de seguretat de dades (el *sanitizer* corrompent URLs signades) és una autèntica classe magistral que salva vides.
- La limitació de l'H1 de Tiptap demostra un coneixement impecable de la llibreria i del sistema semàntic de Pedra Seca.

### Oportunitats (O)
- Aprofitar el canvi de píndoles per establir finalment els colors correctes (`--sdp-accent`) i l'accessibilitat tàctil + teclat alhora.
- Corregir el script de `tractor-pedra-seca` perquè siga robust.

## 3. Matriu d'Importància i Urgència (Eisenhower)
- **Urgentíssim (P0):** 
  - Impedir que `sanitizeHtml` trenque les URL de les imatges (`esFontImatgeSegura`).
  - Llevat del H1 de TipTap.
  - Fixar l'estat local quan s'esborra el Hero.
- **Important i Urgent:** 
  - Fer funcionar l'input d'imatge (amb límit de 512KB).
  - Canviar el color de les etiquetes a taronja.
  - Protegir l'Accessibilitat (onKeyDown).

## 4. Preguntes per al Mestre
Com diu Claude, cal que ens definimques com a Creador en 5 fronts:
1. **La barra blava a l'editor:** La llevem del tot quan estem al Bloc de Notes, o traiem el Hero fora perquè es puga vore si s'amaga la barra?
2. **Píndoles al Bloc de Notes:** Mostrem píndoles de categoria/etiqueta dins del mur de targetes petites de l'esquerra?
3. **Llei de Vida:** Fem que la píndola mesure 44px d'alt (Targeta Mestra més voluminosa) o la mantenim a 24px (trencant la puresa tàctil estricta)?
4. **Contrast Taronja (Dark Mode):** S'ha detectat que el taronja en fosc no és AAA sinó AA. T'importa, o ajustem el to al `design-tokens.json`?
5. **Emmagatzematge:** Acceptes el Data-URI temporal (512KB màxim per nota) mentre no configurem Supabase Storage?
