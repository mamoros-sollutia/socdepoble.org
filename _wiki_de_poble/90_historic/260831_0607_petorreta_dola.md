---
tipus: document
estat: esborrany
description: Petorreta del Consell (Dola)
---
Ancoratge: [[00_INDEX_ESCRIPTORI]]

# Petorreta del Consell (Dola)

**Resum:**
L'auditoria de Dola és potser la més ferotge i pràctica de totes. Ha anat directament als punts cecs del codi actual i ha destapat que l'arquitectura de tancament i la validació de la Wiki estan plenes de falsos positius ("caoses benèvoles"). També destrossa l'estat actual de `design-tokens.json`.

## 1. Els Tres Forats dels Scripts de Tancament
- **`hooks.json` cec:** L'esdeveniment `Stop` no té `matcher`.
- **C2 és un avís enganyós:** La regla C2 (orfes) està programada com a `AVÍS` a `tancament.mjs`, i només es converteix en bloquejant a `tancar.mjs` mitjançant un "parxo". Cal que la regla arrel siga `FALLA`.
- **La trampa del diari:** `tancar.mjs` confia cegament en el diari de sessió. Si algú crea un fitxer per terminal o script alié, el diari no ho veu i el tancament aprova. Cal un escaneig físic de l'escriptori secundari.
- **`ESCRIPTORI_RESERVATS` perillós:** La llista de fitxers ignorats a l'escriptori inclou carpetes senceres com `Claude4` o `00_Bandeja_d_Entrada`. Qualsevol fitxer dins d'estes carpetes és invisible per al control C1.

## 2. La Wiki Fantasma
- **Directoris inexistents:** El control C2 busca el directori `05_Escriptori_Soc_de_Poble`, que no existix en eixe camí relatiu al bundle, i salta silenciosament.
- **El 75% sense control:** Només `00_SER_Brain_Identitat` està baix la vigilància de C2. Tota la resta (`02_ACTUAR`, `03_GOVERNAR`, `04_arquitectura`) no té control d'orfes.

## 3. La Bomba de design-tokens.json
- Està marcat com a "TANCAT", però només té 13 colors (amb barreja d'anglès, valencià i català).
- Falten categories estructurals completes: espaiat, ombres, z-index, breakpoints.
- Cap color es correspon amb la filosofia Pedra Seca (terra, mediterrani, naturalesa).
- Aconsella desmarcar-lo com a tancat immediatament, refer-lo sencer, i crear un script de sincronització que genere el CSS automàticament des del JSON per evitar que es desincronitzen.
