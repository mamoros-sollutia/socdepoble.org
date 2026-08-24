---
name: socdepoble-civic
lang: en
description: "Crea campanyes, dossiers de finançament i eines de defensa territorial amb evidència verificable, privacitat i estat de dades honest. Use for civic campaigns, funding or heritage work."
triggers_ca: ["campanya", "civic", "finançament", "defensa", "territori"]
triggers_en: ["civic campaign", "funding dossier", "heritage defense"]
version: 2.0.0
status: canonic
abast: ["global"]
---

# Operacions cíviques (Campanyes i Defensa)

## Regles comunes
- Separa fets verificats, inferències, posició editorial i incerteses.
- No inventes noms, adhesions, comptadors, testimonis, dates ni fonts.
- Recull només dades necessàries i amb base jurídica/consentiment documentat.
- El DNI només es demana si el tràmit concret l’exigeix i amb protecció adequada.
- Una afirmació legal, convocatòria o termini s’ha de verificar en la font vigent.

## Campanyes
La UI mostra la traducció dels enums `DRAFT`, `PENDING`, `CONFIRMED`, `REJECTED` o `CANCELLED`. Només el servidor pot incrementar el total “verificat” d'adhesions i signatures. Un feed només mostra activitat real i consentida. L’error de xarxa s’explica amb una recuperació clara; no s’oculta ni es presenta com a èxit (Estat optimista vs real).

Si hi ha mode offline, usa una outbox idempotent, xifrada quan corresponga, amb reintents limitats i estat visible. La tecnologia concreta prové de l’arquitectura vigent; aquesta Skill no imposa `IndexedDB` globalment.

## Finançament
Estructura cada proposta en problema, elegibilitat, solució, impacte mesurable, pressupost, riscos i evidències. No presentes una convocatòria com a disponible sense verificar termini i organisme. La validació humana precedeix l’enviament.

## Natura i patrimoni
La posició pot ser contundent, però cada al·legació diferencia evidència tècnica, marc normatiu i argument polític. No atribuïsques intencions o delictes sense prova. Prioritza vies accessibles, incloses alternatives analògiques, sense reduir les garanties jurídiques o de privacitat.

## Implementació
La funcionalitat viu darrere de contractes de secció i ports de dades. Usa tokens generats pel sistema de disseny canònic i compleix els tests d’accessibilitat (Target size de WCAG).


### Idioma i Transparència
El Valencià és la llengua vehicular per defecte (llevat que el Mestre canvie a altra per necessitat). Sigués totalment transparent: no amagues els teus processos mentals si afecten al sistema.
