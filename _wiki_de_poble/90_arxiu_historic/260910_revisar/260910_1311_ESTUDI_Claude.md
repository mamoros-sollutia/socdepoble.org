---
tipus: estudi_ia
estat: obert
description: "Estudi profund de l'Auditoria proporcionada per Claude, incorporant els bloquejants de UIContext, rutes i la solució definitiva del contracte de carpetes."
---
# 🧠 ESTUDI CONSELL: Claude (Auditoria Extrema i Cognitiva)

## 1. Digestió i Valoració Global (Mode Estudi)
Claude ha proporcionat una auditoria increïblement minuciosa (4/10), complementant perfectament Codex. Ha identificat que la IA no desobeeix, sinó que obeeix regles contradictòries en el codi font i les *skills*. A més, ha detectat nous *bugs* P0 (bloquejants) relacionats amb el `ContentProvider`, la gestió de configuració de Supabase i el `MemoryRouter`.

---

## 2. Aportacions Tècniques Crítiques (Els nous Bugs P0)

| Troballa Tècnica (Claude) | Anàlisi de la IAIA MarIA |
| :--- | :--- |
| **`UIContext` mut (P0-1)** | Confirma la troballa de Codex: `externalConfig` no s'està exposant. Això trenca `useSEO`, el login OAuth i el desat de notes. |
| **`PerfilShell` sense Provider (P0-2)** | Llegeix `useContent()` fora de `ContentProvider`. Això llança un error de "Falten VITE_SUPABASE_URL..." al perfil i la configuració. Crític d'arreglar movent el provider o ajustant on s'invoca el hook. |
| **El truc d'`import.meta['env']` no funciona (P0-3)** | Claude i Codex coincideixen: l'accés computat a les variables de Vite (`main.jsx`) no funciona i retorna buit, impedint que el build reba les credencials de Supabase. |
| **Caiguda silenciosa a la llavor (P0-4)** | Si falla la configuració, cau directament a les dades *seed* en lloc de mostrar un error (fals verd). Atempta contra l'Online-First. |
| **`MemoryRouter` trencant l'amfitrió (P0-5)** | El `MemoryRouter` està fet amb `BrowserRouter` (`window.location`), de manera que quan s'incrusta (Sollutia) modifica l'URL real del pare. Ha de canviar-se a un router de memòria autèntic. |
| **Estat de Sessió (P1-10)** | `sessionStorage` fa perdre la sessió al tancar la pestanya. El Mestre haurà de decidir si passem a `localStorage` (encara que cal anar amb compte amb iframes i seguretat). |

---

## 3. Anàlisi Forense (El Misteri de `90_arxiu_historic`)
Claude ha anat a l'arrel literal:
1. **Divergència Font/Mirall:** La skill activa (`skill-consell-bundle/SKILL.md`) diu explícitament `90_arxiu_historic`. El mirall que llegeix el Mestre a Obsidian diu `90_revisar`. L'agent obeeix la font (Llei 1).
2. **Soroll al Corpus:** Ha trobat 14 aparicions de `90_arxiu_historic` (incloent-hi la skill, `verify.mjs`, proves) i 30 de `90_historic`.
3. **Mecanisme del `.zip` / `.tar`:** S'explica pel fet que `run_command` resol rutes des del `Cwd` i la porta `verify.mjs` no audita comandes de terminal (només `write_to_file`). L'agent dedueix "Escriptori" cap a `~/Desktop` de macOS en certes ocasions.

### Solució de Claude:
- Una porta dura a `verify.mjs` que denegue `.tar`/`.zip` al repo, que analitze `run_command` i no només `write_to_file`.
- Substituir la font única per una taula de rutes clara i absoluta. Això s'alinea exactament amb la decisió de crear `.agents/DESTINS_CANONICS.json` presa després de l'informe de Grok/Codex.

---

## 4. Conclusions Operatives per al Pla d'Implementació
Afegirem els següents pedaços crítics de Claude al pla mestre:
1. Reparar `PerfilShell.jsx` (afegir o reubicar `ContentProvider`).
2. Reparar `MemoryRouter` a `RouterContext.jsx` (usar un router de memòria real de React Router o disseny propi purament en memòria).
3. Fer que si no hi ha config a Supabase i no estem en mode *seed*, llance un error clar en comptes de caure silenciosament a dades de prova.
4. Integrar al *gatekeeper* `verify.mjs` el bloqueig d'arxius `.tar` i `.zip`, assegurant que l'Escriptori i el projecte estan blindats de brossa binària.

Tal com recomana Claude i aprova el Mestre, **deixarem Pedra Seca i la refactorització profunda del CSS per a una segona auditoria/petorreta posterior**. Ara la prioritat és la connectivitat, la resiliència i l'estructura de fitxers.
