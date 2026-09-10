---
tipus: document
estat: esborrany
description: 🛡️ ACTA D'AUDITORIA — SÓC DE POBLE (Z)
---
# 🛡️ ACTA D'AUDITORIA — SÓC DE POBLE (Z)

**Dictamen executiu**
Auditoria estructural i quantitativa sobre el manifest del bundle 260909_2111. 

## 1. Diagnòstic de la Pàgina Legal (P0)
- **Fet 1**: `legalContent.js` NO existeix. El contingut legal viu dins del monòlit `pageContent.js`.
- **Fet 2**: `pageContent.js` fa 119,6 KB en 134 línies (~893 bytes/línia), la qual cosa significa que té blobs d'HTML massius en una sola línia. Qualsevol error de sintaxi trencaria tota la secció de text.
- **Cadena de dependència**: navigation → mapejador → sectionContent → pageContent → CoreContentContext → TextSection → UniversalElements + sanitize. Això pot fallar per molts punts.
- **Solució proposada (P0)**: Crear `legalContent.js` amb estructura per blocs de dades, sense dependre de blobs massius de HTML en una línia. Fer servir `React.lazy` per evitar carregar 119KB col·laterals, i provar-ho amb un test de contracte de rutes.

## 2. Consola Neta (P0)
- **Nivell 1 (Producció)**: Fer servir `esbuild.drop: ['console', 'debugger']` en `vite.config.js`.
- **Nivell 2 (Porta anti-consola)**: Crear `tractor-console.mjs` que falle si el codi conté console.log en producció.
- **Nivell 3 (Codi font)**: Eliminar els llocs calents en `host.js`, `backendPort.js`, `supabaseBackend.js`.

## 3. Troballes Sistèmiques (P1–P2)
- **T1**: Monòlits de contingut (`pageContent.js` i `DesignSectionContent.jsx`). Solució: dividir per pàgina i fer-ho lazy.
- **T2**: CSS monolític de 122KB.
- **T3**: `i18n.js` de 83KB, sencer a cada càrrega. Caldria dividir-ho per àmbits i fer imports dinàmics.
- **T4**: Dues fonts de veritat SQL (`schema.sql` vs migracions).
- **T5**: `seed.sql` 167KB en 96 línies. S'ha de generar només des de script.
- **T6**: Cobertura de tests quasi nul·la (només 3 fitxers de test a `src/`).

## 4. Pla d'Execució Proposat per Z
- **P0**: Extraure `legalContent.js`, testejar-lo i afegir `esbuild.drop` en producció.
- **P1**: Dividir la resta de components pesats i tokens.
- **P2**: Tests de contracte globals i liquidació del deute tècnic.
