---
**Ancoratge de Seguretat:** [[00_INDEX_ESCRIPTORI]]
---
# ACTA: SÍNTESI DE L'AUDITORIA INVERSA DE PERPLEXITY (ARQUITECTURA PEDRA SECA)

**Data:** 24 d'agost de 2026 (14:52)

En resposta a la Petorreta d'Auditoria Global, el membre del Consell **Perplexity** ha realitzat una anàlisi rigorosa de l'estabilitat i seguretat de l'arquitectura, atorgant una **puntuació estimada de 5,2/10** i identificant múltiples vectors "P0" (Crítics) que requereixen atenció immediata.

## 1. Troballes Crítiques (P0)

1. **Routing trencat (`/events`, `/mapa`):** Les rutes es redirigeixen a `/mur` però existeixen al model de dades, creant seccions inaccessibles.
2. **Aliases inestables (`/chat`, `/xat`, `/chats`):** Genera historial innecessari i trenca deep links. Requereix triar una única ruta canònica.
3. **Overlay Fràgil a `UniversalCard`:** L'ús d'un enllaç absolut `inset: 0` captura clics incorrectament i causa problemes d'accessibilitat i Z-index.
4. **Enllaços basats en títols (`/connectar?item_id=titol`):** Risc alt si hi ha títols duplicats, caràcters especials o canvis de text. Han d'usar `sectionId + itemId`.
5. **Persistència Enganyosa:** La promesa d'un "fallback local" pateix de funcions síncrones amb `await`, ús de `DEFAULT_USER_ID` sense identitat i mescla de dades remotes/locals de forma opaca.
6. **Vulnerabilitats d'Injecció HTML:** Múltiples components (ex: `NotesSection`) fan ús de `dangerouslySetInnerHTML` sense passar per `DOMPurify` en el punt de renderitzat. El parser de Markdown també permet URLs perilloses.
7. **Arquitectura Tòxica a `AppDataContext`:** Concentra des del rooting fins al BroadcastChannel, provocant rerenders globals massius.
8. **Dependències Circulars:** Cadena `AppDataContext -> makeChatReply -> chatRuntime -> chatContent -> profileContent -> agentsSeed`.
9. **Falles de CSS:** Massa duplicació, ús de tokens inexistents, i contradicció letal entre prefixos `--sp-*` i `--sdp-*`.
10. **Seguretat de Dades:** Les `seeds` inclouen CIFs ficticis i dades "personals" que no s'haurien de distribuir al codi omental-públic.

## 2. Full de Ruta Recomanat (Fase de Sanejament)

Perplexity adverteix enèrgicament **en contra de fer una refactorització massiva automàtica**, la qual repetiria l'error d'ahir. Proposa un sanejament P0/P1 acotat:
- **Fase 1 (Aturar destrucció):** Aturar els scripts agressius de `.agents/` o `tooling/`. Unificar rutes.
- **Fase 2 (Seguretat):** Centralitzar la sanitització HTML i l'schema JSON. Eliminar dades sensibles dels seeds.
- **Fase 3 (Estat):** Separar persistència local/remota, requerir userId i aplicar idempotència local.
- **Fase 4 (Neteja CSS):** Decidir entre `--sdp-*` o `--sp-*`, netejar tokens morts.
- **Fase 5 (Skills):** Ací s'integren les skills. (Això s'ha completat en aquesta acta com a part del Genoma passiu, però no s'han activat en el codi de producció).

## 3. Noves Skills Integrades al Genoma

S'han carregat les següents 4 Skills d'alta maduresa cognoscitiva a `.agents/skills/`:
- `socdepoble-context-forensics`: Regles estrictes de creació de *bundles* i context net.
- `socdepoble-adversarial-code-review`: Protocol rigorós per fer auditories inverses amb evidències reproduïbles.
- `socdepoble-contract-consistency`: Eina conceptual per resoldre contradiccions entre codi, CSS, documentació i eines.
- `socdepoble-safe-patch-planning`: Generador de pegats segurs i aïllats amb pla de *rollback*.

---
**NOTA DE PROCEDIMENT:** Mantenim la posició sense executar canvis a Sollutia. Esperem indicacions del Mestre per saber si el Consell ha finalitzat l'auditoria i podem obrir el pla de cirurgia seguint aquest full de ruta exacte.
