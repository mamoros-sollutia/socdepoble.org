---
**Ancoratge de Seguretat:** [[00_INDEX_ESCRIPTORI]]
---
# ACTA: SÍNTESI DE L'AUDITORIA INVERSA DE COPILOT (ARQUITECTURA PEDRA SECA)

**Data:** 24 d'agost de 2026 (15:08)

En resposta a la Petorreta d'Auditoria Global, el membre del Consell **Copilot** ha aportat un enfocament organitzat basat en la divisió del treball a curt, mitjà i llarg termini. Des del seu "Seat", l'auditoria reforça que l'estabilitat vindrà d'una implementació progressiva de patrons de resiliència madurs.

## 1. El Red Teaming: Vectors d'Atac Lògic
L'informe descriu les formes principals com el sistema podria ser tombat:
- **Gestió d'estat (Condicions de Carrera):** Reordenacions i mutacions en peticions asíncrones.
- **Fuites de Memòria:** `useEffect` sense `cleanup` o subscripcions no tancades.
- **Secrets al Bundle:** Constants compromeses a `dist/` o codi client que revelen APIs privades.
- **Seguretat XSS i Fallades Unipuntuals (SPOF).**

## 2. El Pla d'Estabilitat (Pegats Prioritzats)
Copilot aporta una visió accionable en fases:

### Fase 1: Hotfix (Hores)
- **Bloqueig de Secrets:** Cercar i moure claus privades.
- **Neteja d'Efectes:** Reparar ràpidament tots els `useEffect` perillosos (el famós leak).
- **Timeouts i Reintents:** Crear un *Circuit Breaker* bàsic per crides HTTP per evitar penjar-ho tot.
- **Sanitització XSS:** Aplicar `DOMPurify` de manera implacable.

### Fase 2: Mitjà Termini (Dies-Setmanes)
- **Aïllament d'Estat:** Partir l'estat monolític (Zustand / partició Context).
- **Observabilitat:** Instrumentar el codi per rebre senyals de caiguda ràpida.
- **Test de regressió E2E** (amb Playwright) abans d'incorporar nova funcionalitat.

### Fase 3: Reestructuració Profunda
- Sincronització asíncrona amb eines dedicades (tipus React Query).
- Aïllament amb *Microfrontends* o boundaries forts.
- Canvis a les polítiques de construcció (*builds*).

## 3. L'Arsenal Cognitiu (5 Noves Skills)
Copilot aporta un catàleg de *skills* molt pràctiques per estructurar el raonament de la intel·ligència artificial i evitar fallades de codi per descontextualització:
- `chain-of-thought-moderation`: Força una declaració explícita (però limitada en passos) del raonament lògic, sense exposar-ho, donant un score de confiança.
- `hallucination-guard`: Categortiza cada resposta de la IA en *VERIFICABLE*, *INFERIT*, o *ESPECULATIU*.
- `prompt-safety-and-context`: Redueix els prompts als requeriments mínims essencials per evitar la "demència de context".
- `evidence-first-reasoning`: Força la cerca i citació documental abans de deduir conclusions (ideal per a auditories tècniques).
- `code-stability-refactor`: Orientat exclusivament a refactoritzar petites parts del codi focalitzant-se en estabilitat (treure re-renders, memòria, circularitats).

---
**NOTA DE PROCEDIMENT:** Una aportació molt valuosa al manual de govern de Sóc de Poble. Aporta una "estructura d'execució" genial per agrupar les feines. Com ja sabem, encara esperem que *Claude* ens entregue les eines de bloqueig (`tanca.mjs`) a la seua segona part!
