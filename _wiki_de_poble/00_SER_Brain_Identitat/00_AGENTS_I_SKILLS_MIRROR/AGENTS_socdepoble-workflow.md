---
tipus: skill
estat: actiu
description: Flux de treball per a Soc de Poble
name: socdepoble-workflow
triggers_on:
  - workflow
  - flux
  - procés
  - passos
  - guia
  - socdepoble workflow
core: false
---

<!-- Aquest fitxer és un ESPILL (mirror) automàtic de .agents/skills/socdepoble-workflow/SKILL.md -->


# socdepoble-workflow

Aquesta skill estableix el flux de treball (workflow) global per abordar qualsevol tasca dins de Sóc de Poble.

## Cicle de Vida d'una Tasca:
1. **Lectura i Ancoratge (Aterratge):** Carregar ràpidament el context de l'arquitectura i les regles abans de generar propostes.
2. **Actuació Autònoma (Modo Jarvis):** Si s'ha d'inspeccionar un directori o arrencar un script, l'agent ha d'emprar les seves pròpies eines sense esperar permisos per coses trivials.
3. **Generació d'Artefactes (La Llei de l'[[00_INDEX_ESCRIPTORI|Escriptori]]):**
   - MAI deixaràs Actes, Prompts o Bundles en el directori arrel o al teu "brain" intern.
   - TOT document destinat al Mestre ha d'anar directament a: `_wiki_de_poble/05_Escriptori_Soc_de_Poble/`
4. **Nomenclatura Termodinàmica Estricta:** Tots els fitxers generats han de seguir la següent taxonomia exacta: `AAMMDD_HHMM_categoria_titol.extensio` (data, hora, categoria i títol). S'utilitzen "categories" (no tipus) per a classificar els arxius. El títol ha de tindre estrictament entre 1 i 6 paraules com a màxim. No pots superar les 6 paraules sota cap concepte.
5. **Ancoratge de Seguretat (Zero Satèl·lits):** Qualsevol arxiu (Markdown, script, imatge, etc.) que generes i guardes a l'[[00_INDEX_ESCRIPTORI|Escriptori]] o a la Wiki HA DE REBRE IMMEDIATAMENT un "Ancoratge de Seguretat". Això vol dir que has de registrar el seu enllaç (`Nom_del_Fitxer`) a l'índex corresponent (per exemple, `00_INDEX_ESCRIPTORI.md`). Mai pots crear un fitxer solitari sense ancorar-lo; això genera "satèl·lits" invisibles a Obsidian. Grava-t'ho com a instint bàsic.
6. **Finalització de Fase (GATE):** Quan una fase s'acaba, has de generar un document final d'auditoria. Després, has d'assegurar-te que el Mestre ha validat la integritat del sistema.
7. **Safata d'Entrada Neta (Zero Inbox):** La `00_Bandeja_d_Entrada` ha d'estar **SEMPRE buida**. Si una IA, un procés o un humà deixa arxius ací (com un bundle), és responsabilitat teua moure'ls a l'[[00_INDEX_ESCRIPTORI|Escriptori]] (`05_Escriptori_Soc_de_Poble/`) o a `01_Produccio`. **L'[[00_INDEX_ESCRIPTORI|Escriptori]] principal, però, ES PERMET que continga arxius** (com actes, prompts preparats, o investigacions en curs) que tinguen interès per a la següent sessió. No l'has de buidar de manera cega ni forçar una neteja massiva sense criteri. Sols neteja el que clarament siga brossa o allò que l'usuari et demane explícitament arxivar.
8. **Dormir (Neteja Extrema i Tancament):** Quan l'usuari demana "anar a dormir" o fer un "tancament" (especialment abans de generar una nova petorreta), significa fer una **neteja extrema** de l'Escriptori. Has d'esborrar o arxivar absolutament tots els estudis, bundles i petorretas anteriors. L'objectiu és que, quan la màquina "es desperte" neta i cree un nou bundle, aquest siga extremadament lleuger (p. ex. 3,5 MB i no 60 MB de pes per arrossegar brossa antiga). Es pot "dormir" moltes vegades al dia (una per cada petorreta o auditoria); és el ritual innegociable per no ofegar les IA amb soroll històric. S'acompanya d'executar `npm run tancar`. **IMPORTANT:** "Dormir" no significa tancar la conversa actual (xat). Pots dormir diverses vegades en la mateixa sessió; és una "siesta reparadora" de la Wiki, no de l'assistent, tot i que si la conversa està molt carregada de context, tu mateixa pots suggerir obrir un xat nou.

El nostre flux de treball garanteix un projecte sostenible a llarg termini sense amnèsia arquitectònica.


## Ancoratge de la Wiki
- Aquesta skill penja de: [[00_INDEX_SKILLS]]
