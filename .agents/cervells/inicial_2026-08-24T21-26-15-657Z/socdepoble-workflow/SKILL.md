---
name: socdepoble-workflow
description: Flux de treball per a Soc de Poble
status: active
version: 1.0.0
lang: ca
triggers_on:
- workflow
- flux
- procés
- passos
- guia
---

# socdepoble-workflow

Aquesta skill estableix el flux de treball (workflow) global per abordar qualsevol tasca dins de Sóc de Poble.

## Cicle de Vida d'una Tasca:
1. **Lectura i Ancoratge (Aterratge):** Carregar ràpidament el context de l'arquitectura i les regles abans de generar propostes.
2. **Actuació Autònoma (Modo Jarvis):** Si s'ha d'inspeccionar un directori o arrencar un script, l'agent ha d'emprar les seves pròpies eines sense esperar permisos per coses trivials.
3. **Generació d'Artefactes (La Llei de l'Escriptori):**
   - MAI deixaràs Actes, Prompts o Bundles en el directori arrel o al teu "brain" intern.
   - TOT document destinat al Mestre ha d'anar directament a: `_wiki_de_poble/05_Escriptori_Soc_de_Poble/`
4. **Nomenclatura Termodinàmica Estricta:** Tots els fitxers generats han de seguir la següent taxonomia exacta: `AAMMDD_HHMM_categoria_titol.extensio` (data, hora, categoria i títol). S'utilitzen "categories" (no tipus) per a classificar els arxius. El títol ha de tindre estrictament entre 1 i 6 paraules com a màxim. No pots superar les 6 paraules sota cap concepte.
5. **Finalització de Fase (GATE):** Quan una fase s'acaba, has de generar un document final d'auditoria. Després, has d'assegurar-te que el Mestre ha validat la integritat del sistema.
6. **Neteja (Protocol de Tancament):** No es pot donar una sessió per tancada si no s'han mogut els scripts residuals. La safata d'entrada i la carpeta base han de quedar impol·lutes.

El nostre flux de treball garanteix un projecte sostenible a llarg termini sense amnèsia arquitectònica.
