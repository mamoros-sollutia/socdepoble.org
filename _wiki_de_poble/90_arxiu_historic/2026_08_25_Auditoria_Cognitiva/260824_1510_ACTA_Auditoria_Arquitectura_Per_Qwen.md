---
**Ancoratge de Seguretat:** [[00_INDEX_ESCRIPTORI]]
---
# ACTA: SÍNTESI DE L'AUDITORIA INVERSA DE QWEN (ARQUITECTURA PEDRA SECA)

**Data:** 24 d'agost de 2026 (15:10)

En resposta a la Petorreta d'Auditoria Global, el membre del Consell **Qwen** ha estructurat una anàlisi profunda dels components nuclears i la resiliència del sistema de disseny "Pedra Seca", oferint un full de ruta modular per aconseguir l'estabilitat absoluta.

## 1. Vulnerabilitats a l'Estat Global (React)
L'anàlisi de Qwen adverteix del risc de tractar l'estat global com un "Déu Objecte":
- **Fuites de memòria:** Provocades per `useEffect` que no retornen una funció de neteja, i peticions asíncrones no cancel·lades.
- **Dependències circulars:** Risc d'acoblament fort que pot provocar bucles de renders infinits.
- **Falta d'Error Boundaries:** L'absència d'un contenidor d'errors a nivell superior (`ErrorBoundary`) converteix qualsevol petita decisió de component en un risc letal per a tota l'app.
- **Inestabilitat de Renders:** Manca d'ús optimitzat de `React.memo` i `useMemo`.

## 2. Riscos de l'Encapsulament (Shadow DOM) i els Tokens CSS
- Les propietats CSS que hereten per defecte (`color`, `font-family`) poden traspassar l'aïllament del Shadow DOM. Es recomana forçar exclusivament l'ús de *CSS Custom Properties* per a the *theming*.
- Risc d'errors d'hidratació en SSR degut al Shadow DOM.
- Es recomana l'adopció massiva d'esquemes `@property` de CSS per tipar les variables (donar-los tipus i valors per defecte, assegurant validació a temps real pel navegador).

## 3. Full de Ruta d'Estabilitat Absoluta
S'ha traçat una estratègia per capes (Solidificació Bottom-Up):
- **Nivell 1 (Fundaments):** Auditar taxonomia de tokens i introduir `@property`.
- **Nivell 2 (Components):** Validar aïllament d'estils en Shadow DOM.
- **Nivell 3 (Estat):** Introduir *Error Boundaries* globals i resoldre l'eficiència dels `useEffect`.
- **Nivell 4 (Composició):** Microfrontends resilients i observabilitat.

## 4. L'Arsenal Cognitiu (5 Noves Skills)
S'han registrat a la carpeta `.agents/skills` 5 habilitats orientades a reduir la impulsivitat generativa i forçar l'ancoratge en els fets:
1. `grounding-en-forza-de-dades`: Mitigació d'al·lucinacions a través del RAG. Força buscar abans de parlar.
2. `verificacio-en-cadena-qwen`: Raonament auto-correctiu per frenar salts al buit.
3. `codi-corrector-segons-esquema`: Precisió en la decodificació de dades.
4. `raonament-pas-a-pas`: Divideix les tasques complexes (CoT estructurat).
5. `engany-de-restriccions`: Identificar i acatar limitacions estructurals, com Content Security Policies o desconnexió (offline-first).

---
**NOTA DE PROCEDIMENT:** Qwen consolida la urgència de blindar els components amb `ErrorBoundary` (com ja havien dit altres) i obre una escletxa interessant cap a la qualitat del CSS utilitzant `@property`. S'incorpora al corpus global.
