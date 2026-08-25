---
**Ancoratge de Seguretat:** [[00_INDEX_ESCRIPTORI]]
---
# ACTA: SÍNTESI DE L'AUDITORIA INVERSA DE GEMINI (ARQUITECTURA PEDRA SECA)

**Data:** 24 d'agost de 2026 (14:50)

En resposta a la Petorreta d'Auditoria Global, el membre del Consell **Gemini** ha retornat el seu primer diagnòstic profund de l'arquitectura de *Pedra Seca*, identificant tres vectors crítics que amenacen l'estabilitat del sistema.

## 1. Vectors de Risc Identificats (Red Teaming)

1. **Asfíxia per "Thundering Herd" (Context):** A `AppDataContext.jsx`, els esdeveniments `onVisibilityChange` i `onStorage` disparen recàrregues completes via `loadAppData`. Múltiples pestanyes obertes saturen la memòria i poden col·lapsar el backend.
2. **Col·lapse de Renderitzat (Re-renders globals):** L'`AppStateContext` és un macro-objecte monolític. Qualsevol mutació (ex: rebre un missatge al xat) força el re-render de tota la jerarquia.
3. **Spoofing P2P:** A `devicesRuntime.js`, el `BroadcastChannel` no té autenticació. Qualsevol codi al mateix origen podria suplantar identitats i enviar paquets de xat maliciosos.

## 2. Pegats d'Estabilitat Proposats

- **Trossejament de Contextos:** Dividir l'`AppStateContext` en contextos més precisos i aïllats (`ChatContext`, `FeedContext`, `UIContext`) per evitar re-renders innecessaris.
- **Bloqueig de Pestanya Líder:** Implementar la *Web Locks API* (`navigator.locks`) per garantir que només una pestanya realitze les crides asíncrones i actualitze la resta mitjançant esdeveniments locals.
- **Signatura P2P (HMAC):** Introduir una validació lleugera dels payloads enviats via `BroadcastChannel`.

## 3. Noves Skills Integrades al Genoma
S'han creat i integrat al directori `.agents/skills/` dues noves habilitats aportades per Gemini per optimitzar el raonament de tot el Consell:
- `socdepoble-cot-profund`: Raonament intern (CoT) obligatori per calcular el cost termodinàmic i l'impacte a l'iPad A10 abans d'escriure codi.
- `socdepoble-zero-slop`: Instrucció estricta per retornar únicament els deltes (diffs) en les modificacions i respectar l'energia humana.

---
**NOTA DE PROCEDIMENT:** D'acord amb el protocol de recepció d'auditories del Consell, **no s'aplicarà cap canvi arquitectònic al codi base** fins que la resta de membres (Claude, GPT-4, Qwen, etc.) presenten els seus informes i consensuem el pla seqüencial d'implementació. L'Escriptori es manté en espera de les pròximes respostes.
