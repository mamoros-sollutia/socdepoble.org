# Auditoria destructiva: disseny_notes_editor (Codex)

## Veredicte
**NO-GO per a edició de notes privades en producció. SDP-LOCK actiu sobre les escriptures i qualsevol migració de dades.**

## Troballes prioritzades

### P0 — Blocatge immediat
- **P0.1 Les notes “privades” no tenen aïllament per usuari.** Es guarden en un JSON compartit a `app_content` sense `owner_user_id`. Exposició potencial de contingut personal.
- **P0.2 Fals positiu de guardat.** `PATCH` amb `return=minimal` pot no modificar cap fila i la UI mostra èxit. No hi ha política INSERT/UPDATE per a `app_content`.
- **P0.3 GET→modificació d'array→PATCH sense control de versió.** Cada tecla reescriu totes les notes. Pèrdua de canvis per concurrència assegurada.

### P1 — Alta importància
- **P1.1 Responsive contrari al requisit.** Ocultar l'editor és inacceptable (alineat amb Claude/Z/Kimi).
- **P1.2 Estat optimista permanent.** `localNoteOverrides` no es neteja ni es revertix en cas d'error.
- **P1.3 Publicació no idempotent.** Cada clic envia una submissió duplicada.

## Pla executable de Codex (Conflicte d'ordre amb Claude)
Codex dictamina que **NO es pot arreglar primer la cosmètica (UI)**. Exigix tancar el model de dades i el protocol de guardat (RLS, owner_user_id) abans d'aplicar la nova composició responsive. Açò contradiu directament el consell de Claude, que deia de fer el responsive primer per a salvar el cursor abans de tocar l'estat.
