---
estat: "esborrany"
tipus: "acta"
description: "Sintetització de l'auditoria tipogràfica presentable per Copilot."
---
# Acta d'Auditoria del Consell: Copilot (Seient Núm. 6)

**Veredicte General**: Coincidix fonamentalment amb Claude i valida l'anomalia dels `<div>` innecessaris i l'absència d'un ritme vertical pur, confirmant que perjudica l'exportabilitat i la llegibilitat.

## Trobades Forenses
1. Confirma que qualsevol contenidor `<div>` sense rol semàntic o atributs específics al voltant de títols (h1-h6) i llistes trenca el ritme.
2. Identifica la falta d'un sistema predictible de flux (`vertical rhythm`), proposant usar els marges inferiors (margin-bottom) exclusivament i els marges superiors a zero.

## Solucions Proposades
Copilot oferix un "pegat tipogràfic" genèric i complet:
- Fixar una unitat base (baseline) de 4px (o 0.25rem).
- Convertir tota la tipografia a `rem` per accessibilitat (preferències de zoom de l'usuari).
- Netejar de forma estricta l'HTML deixant `<h1>`, `<p>`, i `<ul>` completament despullats per a una exportació a DOCX perfecta.

## Decisions Reservades al Mestre (Notes de la IAIA)
- **Implementació fora de Cànon (Atenció)**: Copilot proposa el seu propi micro-sistema de variables (`--baseline`, `--rhythm`, etc.). Això violaria el nostre Cànon de Pedra Seca, on s'han d'usar exclusivament les variables `--sdp-space-*`.
- Tot i que l'auditoria conceptual és un 10/10 en estàndards web moderns, l'execució tècnica del `.diff` de Claude és superior ja que respecta la nostra escala existent. Es prendran les lliçons teòriques de Copilot, però de moment descartarem el seu CSS literal.
