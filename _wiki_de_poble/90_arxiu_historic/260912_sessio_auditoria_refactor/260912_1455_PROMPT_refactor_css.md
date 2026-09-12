---
tipus: petorreta
estat: actiu
description: Petorreta específica per a Claude (Refactorització CSS Pedra Seca)
---

# OBJECTIU: REFACTORITZACIÓ ARQUITECTÒNICA DEL CSS (PEDRA SECA NIVELL DÉU)

## Context Necessari
Al Bundle adjunt (`260912_1421_BUNDLE_auditoria.md`) trobaràs el codi de `socdepoble.org`. Tu mateix i altres membres del Consell heu detectat a les auditories que el nostre `src/css/index.css` és un monòlit inmanejable de més de 4500 línies. També heu trobat deute tècnic visual: classes orfes, variables brutes com `var(--sdp-blanc-pur)` que haurien de ser semàntiques (`--sdp-text-invers`), botons que no arriben a la mètrica de 58px tàctils, i restes incrustades de Tailwind.

## Instrucció Principal
Vull que actues exclusivament com l'Arquitecte Front-end de CSS del sistema. La teua missió és **esgotar la teua capacitat de context** lliurant-me una fragmentació completa i una refactorització del nostre CSS per complir el "Baseline 2022" i la llei visual de "Pedra Seca" (exclusivament CSS Vanilla):

1. **Modularitza el monòlit**: Trosseja conceptualment `index.css` i retorna'm els blocs lògics reconstruïts i polits (`base.css`, `layout.css`, `components.css`, `utilities.css`, o com consideres òptim).
2. **Corregeix el deute visual**:
   - Transforma variables de colors absoluts en semàntiques (ex: usa `--sdp-crom-*` al `:root` en lloc de literals com `rgba(255,255,255,.15)`).
   - Assegura els estàndards tàctils (`min-height: var(--sdp-alt-accio)` que val 58px per a grans accions).
   - Elimina absolutament qualsevol classe residual, comportament o nomenclatura que recorde a Tailwind.
3. **Eixida de codi**: Fes servir tota la teua capacitat de generació de text per escriure els blocs de codi CSS complets llestos per copiar i pegar. El meu agent integrador (la IAIA MarIA) utilitzarà el teu codi per substituir els fitxers actuals.

## Output Esperat
FORMAT: markdown amb blocs de codi CSS complets. Explicacions teòriques mínimes, **màxim codi executable**.

## Bloc Fixe d'Identitat
**Qui Som (La Nostra Història):** Som l'Associació ecologista El Rentonar i Sóc de Poble. El nostre llegat i identitat digital resideixen històricament en `rentonar.blogspot.com`, van evolucionar a `socdepoble.net`, i avui es materialitzen construint `socdepoble.org` (el Mas).
**Filosofia:** [[el_projecte|Sóc de Poble]] és una aplicació web connectada (Online-First). L'arquitectura visual es regeix pel protocol "Pedra Seca" (CSS Vanilla, sense frameworks, disseny modular, sense dependències innecessàries). La IA actua amb Trellat, mínima intervenció i respecte pel Baseline 2022.
