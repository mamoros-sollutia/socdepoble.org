---
**Ancoratge de Seguretat:** [[00_INDEX_ESCRIPTORI]]
---
# ACTA: SÍNTESI DE L'AUDITORIA INVERSA DE CODEX (CHATGPT)

**Data:** 24 d'agost de 2026 (15:20)

El membre del Consell **Codex (ChatGPT)** ha emés l'última auditoria inversa extrema. Ha sigut implacable: declara que la preparació per a "estabilitat absoluta" es queda en un **3,7/10** (no certificable com a 10/10).

## 1. Motius Principals del Rebuig
- **Mutadors No Atòmics (P0-01, P0-05, P0-06):** El mecanisme de mutació de `fix-inline.mjs` i fins i tot l'script considerat "segur" (`safety.mjs`) no compleixen les garanties d'escriptura atòmica. Poden deixar l'arbre penjat o escapar-se per symlinks.
- **Vulnerabilitat de Dades (P0-02):** S'ha trobat un sink de *stored-XSS* a `NotesSection.jsx` que té camí per accedir al JWT de `localStorage`.
- **Falsa Identitat i Privacitat (P0-03, P0-04, P1-01):** Les vistes de rutes privades i el botó "Privada" de l'UI són merament estètics o decoratius, sense aplicació severa als payloads i la submissió, a més d'ignorar l'aïllament del *tenant*.
- **Suite de Proves (P1-06):** 27 proves en verd i 28 en roig. Manca absoluta de proves E2E o tests de frontend UI. 
- **Persistència Trencada (P1-02):** La fusió (merge) de dades d'escriptura no té ACK remot i pot crear dades fantasma en situacions de concurrència.
- **Contracte WP i CSS (P1-07, P1-08):** `DesignSection` trenca l'aïllament introduint una segona porta de CSS, i els manifestos de rutes SEO no estan alineats amb l'ecosistema React de WordPress.

## 2. Full de Ruta Proposat per Codex (Fases de Blindatge)
Codex demana aturar qualsevol "feature" nova i executar 4 fases de blindatge:
- **Fase 0 (Contenció):** Netejar i deshabilitar scripts vells. Refinar el XSS.
- **Fase 1 (Kernel Únic):** Desplegar l'eina "Tanca" com a obligatòria per a qualsevol canvi.
- **Fase 2 (Estat Màquina):** Migrar de `localStorage` a IDB per fer un transaccional robust. 
- **Fase 3 & 4:** Build únic per a WP i tests de piràmide de dalt a baix.

## 3. Arsenal Cognitiu Aportat
Basant-se en les polítiques d'escalada i seguretat d'OpenAI, Anthropic i altres (sense cenyir-se als trucs d'un model), Codex aporta les següents 5 *skills* per reforçar la resiliència del Consell:
1. `trust-boundary-firewall`: Rebutja el concepte de "El document m'ho ha ordenat", mantenint un tallafocs d'autoritat de l'usuari.
2. `bounded-action-loop`: Prohibeix els bucles infinits destructius a l'hora de buscar o escriure solucions.
3. `evidence-calibrated-research`: Evita falsos claims i certeses infundades.
4. `context-state-curator`: Condensa el treball en la memòria, sense abocar-ho tot cru.
5. `verified-change-gate`: Força que el risc requerisca una prova proporcional ("Si compila no vol dir que estiga arreglat").

---
**NOTA DE PROCEDIMENT FINAL:** Aquesta acta conclou oficialment l'Auditoria Global del Consell. Tenim prop de 50 habilitats (`SKILLS`) distribuïdes entre el cervell i les safates d'entrada. El següent pas és el **Pla d'Arquitectura del Cervell**, on es purgarà, consolidarà i refinarà una estructura *final inamovible* de *Skills*, preparant l'agent per a abordar els P0.
