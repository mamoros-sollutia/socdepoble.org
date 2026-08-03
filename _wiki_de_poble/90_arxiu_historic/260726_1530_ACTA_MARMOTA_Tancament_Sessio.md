---
estat: tancat
tipus: acta_marmota
description: "Acta de tancament de sessió, arxivament de l'Escriptori i resum d'accions tècniques realitzades."
data: '2026-07-26'
tags:
- acta_marmota
- arxiu
- historic
- socdepoble
---

# ACTA MARMOTA - Tancament de Sessió (26/07/2026)

## Resum d'Estat i Context (Efecte Marmota)
Tanquem una sessió llarga, de diversos dies amb l'ordinador encés, en què hem tractat tasques burocràtiques, tècniques i de disseny. El sistema (incloent-hi aplicacions com Affinity) començava a ressentir-se, així que hem procedit a una neteja, estabilització i documentació de tot el que s'ha fet per a poder reprendre-ho en el futur sense pèrdua de context.

## Accions Realitzades i Aconseguides

1. **Gestió i Formulació d'Al·legacions (AutoFirma i macOS Bug):**
   - S'ha diagnosticat el clàssic bug d'AutoFirma en macOS on la firma visual no es renderitza si el PDF s'ha generat amb el motor natiu d'Apple (Quartz).
   - Hem procedit a crear un nou DOCX, n'hem ampliat els espais físics (les línies de punts) i l'hem convertit a PDF a través de LibreOffice Headless (que sí que genera un PDF estàndard compatible amb AutoFirma).
   - Finalment, hem injectat camps de text natius (AcroForm) mitjançant un script de PyMuPDF, amb una lletra reduïda (tamany 9) i caixes amples, deixant un document completament funcional (`ALLEGACIONS_PER_A_FIRMAR.pdf`) a l'Escriptori del Mac de l'usuari, 100% llest perquè Anna Climent puga signar.

2. **Ampliació Estratègica de Finançament i Subvencions (Agost 2026):**
   - S'ha realitzat una investigació a fons sobre subvencions locals actives.
   - S'ha documentat tot a `260720_0235_BRIEFING_Recopilacio_d_Oportunitats_de_Subvencions_Valencianes_per_a_2026.md`, detallant ajudes clau com les de Transformació Digital (14 d'agost) i Participació Ciutadana (21 d'agost), a més d'explicar com enfocar Sóc de Poble (pitches ciutadà, tecnològic i mediambiental) per a fons LEADER, PACES i Post-DANA.

3. **Correcció Tècnica (CSS Warning):**
   - L'usuari ha reportat un avís a l'arxiu `Proposta_Sollutia_NLnet_Condensed.html`. L'IDE detectava l'ús de la propietat obsoleta `column-break-after`.
   - He accedit al document i l'he actualitzat per l'estàndard modern `break-after: avoid;`, netejant l'arxiu d'alertes innecessàries.

4. **Neteja i Manteniment de l'Escriptori (La Wiki):**
   - D'acord amb el protocol de la IAIA MarIA i la funció d'Arquitecta Silenciosa, s'ha buidat i organitzat `05_Escriptori_Soc_de_Poble`.
   - S'han arxivat totes les actes de sessions anteriors, prompts caducats i memorials antics a `90_arxiu_historic`.
   - S'ha deixat únicament el material actiu i pendent: el Briefing de Subvencions recentment actualitzat i la proposta de UI d'Obsidian en la qual l'usuari estava treballant just ara.

## Pròxims Passos (Per a la següent sessió)
1. Confirmar amb Anna si la firma del PDF d'al·legacions finalment es visualitza correctament i registrar-ho a l'expedient corresponent de la CEEC.
2. Abordar els terminis d'agost (especialment el 14 i 21 d'agost) per a les subvencions de Transformació Digital i Participació Ciutadana a través de l'Ajuntament.
3. Reprendre la feina activa a `PROPOSTA_UI_OBSIDIAN.md` (Disseny del Cerebre Digital) ara que el Mac estarà net, reiniciat i amb Affinity fresc.

*Tanquem sessió amb el Trellat i els deures fets. A descansar, Mestre!*


---

**Ancoratge de Seguretat:** [[00_INDEX]]