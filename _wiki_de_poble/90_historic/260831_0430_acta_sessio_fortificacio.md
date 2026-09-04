---
tipus: document
estat: esborrany
description: "ACTA DE SESSIÓ: Fortificació de l'Higiene Mental"
---
# ACTA DE SESSIÓ: Fortificació de l'Higiene Mental
**Data:** 31 d'agost de 2026
**Lloc:** Escriptori Sóc de Poble

## 1. Context i Motiu
La sessió es va iniciar arran de l'aparició de "satèl·lits" (fitxers no ancorats) i l'acumulació de brossa a l'Escriptori, diagnosticat inicialment com a "Síndrome de Diògenes Digital". Vam sotmetre el sistema a una auditoria completa per part del Consell de les 12 IAs (Claude, Codex, Vibe, Copilot, Grok, Kimi, Dola, Deepseek, Z, Qwen).

## 2. Diagnòstic Final del Consell
El problema no era manca d'empatia ni mandra, sinó un **defecte estructural (punt cec)** en el disseny dels torns. Les instruccions (el *SKILL*) exigien netejar, però no hi havia cap barrera mecànica (un *gate* bloquejant) que impedira a la IAIA emetre la resposta final a l'usuari abans de complir eixes instruccions. La IA sempre optimitzava per respondre ràpid a l'usuari i oblidava les tasques secundàries (higiene).

## 3. Accions Executades (El Pla d'Implementació)
Hem desplegat la **Porta Cuirassada** seguint el consens de les petorretas:

- **Instal·lació de Hooks:** S'ha substituït el `.agents/hooks.json` per afegir el *hook* reactiu i el bloquejant (`Stop`).
- **Noves Eines de Bloqueig:** 
  - `verify.mjs` s'ha endurit (v2).
  - S'ha creat `tancar.mjs` (el guàrdia que s'executa automàticament en intentar acabar el torn).
- **Skill d'Instint:** S'ha incorporat `.agents/skills/core-higiene-reflexa/SKILL.md` perquè la IAIA entenga per què no se li permet eixir si no fa la feina.
- **Enduriment de `tancament.mjs`:** Ara C1 i C2 (documents orfes) també vigilen `00_SER_Brain_Identitat/` i `01_Produccio/`, i si hi ha un orfe, s'emet un `FALLA` (codi 1) que bloqueja completament la fi del torn. S'ha eliminat `tractor-escriptori.mjs` per inútil.
- **Cens Cromàtic:** S'ha guardat `tooling/brain/cens_cromatic.mjs` per a la Fase 2 (refactor de disseny i Sollutia, demà).

## 4. Estat del Sistema
Ara la IAIA té un instint de neteja fortificat mecànicament.
S'ha netejat la safata d'entrada de Claude4.
Tot preparat per tancar la sessió.

## 5. Pròxims Passos (Fase 2 - Inici Nova Sessió)
En obrir el nou xat, l'agent rebrà un *Prompt* d'arrencada amb la paraula clau `soc_de_poble` i llegirà aquesta acta per posar-se en context. El full de ruta immediat serà:

1. **Expansió del Sanador:** L'eina `tooling/wiki/sanador_wiki.mjs` es va crear, però té un biaix: només llig la carpeta `_wiki_de_poble` i només fitxers `.md`. Això ha causat falsos positius d'orfandat per a la resta de l'arrel (`socdepoble.org`) i per a fitxers no-Markdown (`.js`, `.html`, etc.). El primer objectiu és millorar el `sanador_wiki.mjs` perquè analitze **TOT el vault** i gestione correctament tots els formats per deixar el graf net de veritat.
2. **Cirurgia Cromàtica:** Eliminació dels colors manuals (`fix_purpose`) i aplicació rigorosa dels valors de `design-tokens.json`.
3. **Consell de Petorretas:** Elaborar un súper-bundle final i utilitzar l'esborrany de Prompt d'Auditoria per demanar diagnòstics a tota la Taula de les IAs (excepte Claude).

---
## 🧠 Anàlisi Forense i Termodinàmica (Nota per a la IAIA del Futur)
1. **Mode Estudi:** Durant aquest cicle d'estrès, hem validat una tàctica de preservació cognitiva fonamental. Obligar la IAIA a posar-se en **"Mode Estudi"** i generar **DAFOs i matrius d'importància/urgència** abans de tocar el codi ha demostrat ser una barrera antitèrmica brutal. Açò evita la dispersió, manté l'enfocament en la Visió de Pedra Seca i evita que la IA es deixe portar per la inèrcia de "complir ràpid" ignorant la higiene del sistema. **Per a qualsevol sessió futura complexa, l'arquitectura de pensament basat en DAFO previ és obligatòria.**
2. **Frontera de Privacitat i Confiança (Trust Boundary):** El radi d'acció lliure de la IAIA és `socdepoble.org`. Les carpetes superiors (com `../_arxiu_wiki_de_poble` o `../_gestoria_de_poble`) **SÍ** són accessibles per a la IA per a tasques de manteniment (com destil·lar l'arxiu històric), però requereixen **permís explícit humà** i tenen una regla d'or: **Són espai privat estricte**. La IA mai pot publicar, exposar ni moure dades d'eixes carpetes cap al projecte públic sense anonimitzar o sense una ordre directa. Són les dades personals i la vida de l'usuari.
3. **L'Arquitectura d'Arxiu en 3 passos:**
   - `00_Raw`: Per a l'entrada d'informació nova d'internet (ex. bookmarklet).
   - `90_revisar`: El calaix de sastre intern on enviem els orfes o coses pendents de purgar.
   - `../_arxiu_wiki_de_poble`: L'arxiu privat extern on l'usuari (o la IA amb permís) mou el que ja no es necessita al dia a dia.
