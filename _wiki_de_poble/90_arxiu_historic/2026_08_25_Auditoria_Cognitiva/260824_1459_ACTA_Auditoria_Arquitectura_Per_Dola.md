---
**Ancoratge de Seguretat:** [[00_INDEX_ESCRIPTORI]]
---
# ACTA: SÍNTESI DE L'AUDITORIA INVERSA DE DOLA (ARQUITECTURA PEDRA SECA)

**Data:** 24 d'agost de 2026 (14:59)

En resposta a la Petorreta d'Auditoria Global, el membre del Consell **Dola** ha lliurat el seu diagnòstic arquitectònic. Avalua l'estat actual amb un **5.4/10** i alerta que la manca de defenses passives (Error Boundaries) és la causa més probable del col·lapse absolut patit anteriorment.

## 1. Vulnerabilitats Crítiques Detectades (V-01 a V-03)

1. **Sense Error Boundaries (V-01):** És la prioritat absoluta i la probable causa del col·lapse d'ahir. Sense límits d'errors a tres nivells (arrel, secció, targeta), qualsevol component que falle (com un feed buit) "desmunta" l'aplicació sencera i deixa una pantalla en blanc.
2. **Re-renders Infinits Potencials (V-02):** A `AppDataContext`, si `externalConfig` rep referències noves, provoca un cicle infinit de re-renderitzats que pot esgotar la CPU (i la bateria de dispositius com l'iPad A10).
3. **Markdown Renderer Insegur (V-03):** Coincideix amb altres membres en què el renderer de Markdown no està correctament desinfectat, obrint la porta a atacs XSS.

## 2. Altres Vulnerabilitats (Risc Alt/Mitjà)

Dola assenyala 10 problemes estructurals addicionals, molts d'ells coincidents amb Grok, Gemini i Deepseek:
- **Thundering Herd:** Múltiples mecanismes disparen `loadAppData` alhora.
- **IDs inestables:** L'ús de `Date.now()` per als missatges permet col·lisions.
- **Falta de paginació/límits:** L'historial de missatges pot esgotar l'emmagatzematge local (`localStorage`).
- **Rendiment (iPad A10):** Càrrega de totes les traduccions de colp, dependències circulars i ús massiu de `useMemo` sense estabilització causen "jank".
- **Duplicació de BroadcastChannel:** Actiu tant a `AppDataContext` com a `devicesRuntime`.

## 3. Pla d'Acció URGENT

Dola estableix una única mesura crítica inicial per aturar les hemorràgies estructurals:
**Implementar Error Boundaries a 3 nivells (arrel, secció, targeta).** Això assegurarà que el Mas no caiga per complet davant la fallada d'un sol component.

## 4. Noves Skills de Classe Mundial (En Espera)

Dola ha proposat un conjunt de 7 noves habilitats d'Enginyeria de Prompts i Raonament per optimitzar el Consell (CRAFT-Architect, Chain-of-Thought-Plus, Tree-of-Thoughts, Source-Forcing, XML-Structured, Meta-Prompting i Task-Decomposer). 

*Estat: A l'espera que el Mestre facilite el codi de les skills des de la interfície de Dola per procedir a integrar-les al Genoma.*

---
**NOTA DE PROCEDIMENT:** L'auditoria de Dola s'alinea perfectament amb la necessitat d'una **Fase de Sanejament**. Seguim esperant ordres o la transferència del codi de les noves skills per continuar.
