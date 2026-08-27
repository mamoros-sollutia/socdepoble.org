# Auditoria Qwen (Final) - 27 Agost 2026 (Sóc de Poble)

## Anàlisi Crítica de l'Aïllament Clínic del Context React

- **MemoryRouter:** Cal assegurar que no s'usa `window.history` directament enlloc del codi.
- **Aïllament Global:** Proposa l'ús d'un IIFE o almenys detectar col·lisions amb llibreries globals com jQuery o React.
- **Singleton Guard:** Confirmar que s'aplica correctament (ja ho tenim previst).

## Robustesa del Patró Làzaro: Vulnerabilitats en Condicions Extremes

- **Bloqueig Mortal de `open()`:** `indexedDB.open()` pot quedar penjat indefinidament. Proposa un patró de reintent amb retroalimentació exponencial (Exponential Backoff) per garantir que la tancada ha finalitzat abans de reobrir.
- **Pics Massius de Consum de Memòria:** Recomana l'ús de cursors d'IndexedDB (`openCursor`) per carregar grans quantitats de dades en lloc de demanar tots els resultats de cop, i cedir el control al main thread.
- **Problemes amb `Blob`:** Els blobs poden fallar en Safari antic (retornen 'null'). Recomana convertir `Blob` a `ArrayBuffer`.

## Estratègia d'Interruptor de Circuits i Gestió Intel·ligent

- **Circuit Breaker:** Rebutja la purga automàtica total. Suggereix avisar a l'usuari o fer una purga selectiva (com ja teníem al pla).

## Propostes en Vanilla JS

1. **`openDatabaseResilient`:** Amb `maxRetries = 10` i `Math.pow(2, attempt) * 20` de retard.
2. **`loadLargeDatasetChunked`:** Fent servir un cursor i donant temps al main thread (`if (allData.length % batchSize === 0)`).
