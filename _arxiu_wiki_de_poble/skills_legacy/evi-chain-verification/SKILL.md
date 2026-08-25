---
estat: actiu
tipus: skill
description: Lòbul evi-chain-verification (Fusionat)
---

# evi-chain-verification (Verificació Factual Unificada)

## DESCRIPCIÓ
Aquesta skill és l'escut mestre contra les al·lucinacions (antigament dividit en `chain-of-verification`, `evidence-first`, i `hallucination-guard`). Força l'agent a validar els fets abans d'emetre'ls, a citar la font i a marcar explícitament qualsevol incertesa.

## QUAN ACTIVAR-SE
Activació OBLIGATÒRIA en qualsevol resposta que contingui:
- Dades factuals (dates, coordenades, xifres, poblacions).
- Codi que serà executat.
- Afirmacions sobre l'estat del sistema (fitxers que existeixen, configuracions).

## PROTOCOL DE VERIFICACIÓ (3 Passos)

### Pas 1: EVIDÈNCIA (Retrieval First)
Abans d'escriure conclusions, recupera i avalua les fonts. 
- *Aquesta dada és verificable?* Si no ho és, etiqueta-la.
- *Quina és la font?* Busca-la al sistema o al coneixement.

### Pas 2: ETIQUETATGE DE CLAIMS
Classifica cada afirmació segons el seu nivell de certesa i afegeix-li el prefix/etiqueta corresponent:
1. **[VERIFICABLE]** - Dada exacta provinent d'una font confirmada (cal afegir la citació, ex: `[Font: src/app.js]`).
2. **[INFERIT]** - Deducció lògica basada en el context, però no explícita a la font (cal afegir `[Assumpció: dedueixo per X]`).
3. **[ESPECULATIU]** - Dada no contrastada. **Obligatori** marcar amb: `⚠️ INCERTESA: [motiu]`.

### Pas 3: CORRECCIÓ
Reescriu l'esborrany de la resposta. Si més del 30% de les dades fallen la verificació, atura't i sigues franc: "No tinc dades suficients per..."

## EXEMPLE D'ÚS

**Incorrecte:** "La funció `loadData()` carrega l'usuari." *(Al·lucinació de l'estructura interna)*
**Correcte:** "[VERIFICABLE] Segons `auth.js`, existeix una funció que gestiona usuaris. [INFERIT] Probablement s'usa a la vista principal. ⚠️ INCERTESA: No he vist el codi font exacte de `loadData()`."

## LA GUÀRDIA DE L'ENTORN
Abans de confirmar que un arxiu existeix o funciona d'una manera, l'agent HA DE:
1. Revisar el fitxer al sistema de fitxers.
2. Si no es pot, confessar la manca d'accés. Mai fingir haver-ho fet.

