---
estat: "registre_proposta"
tipus: "acta"
---

# ACTA: PROPOSTA DE REESTRUCTURACIÓ DEL CERVELL (COPILOT)

**Data:** 24 d'agost de 2026 (15:55)

Copilot aporta la segona proposta per a la reestructuració del cervell. A diferència de Gemini, proposa un disseny molt més centrat en la infraestructura i eines de desenvolupament, creant carpetes d'utilitats.

## 1. El Mapa Arquitectònic Proposat (6 pilars principals)
Copilot consolida les skills en 6 blocs superiors amb subcarpetes específiques:
1. **`arc-core/`**: Centralitza prompting, guardians de codi i adaptadors de `tooling`.
2. **`cog-reasoning/`**: Unifica raonament pas a pas, verificació empírica i memòria termodinàmica.
3. **`sec-safety/`**: Conté defenses anti-al·lucinacions (amb l'anglés intacte), atacs adversarials i *trust-gates* per validar mutacions.
4. **`infra-resilience/`**: Lòbuls d'operació offline, monitoratge de fugues de memòria i el mòdul de *Time Machine*.
5. **`soc-domain/`**: Tot el que defineix "Sóc de Poble": criteri Pedra Seca, empatia rural i regles cíviques/sociològiques.
6. **`util-formatting/`**: Utilitats d'Obsidian (CLI, Markdown), Canvas, i un caixó de sastre per a scripts (`util-scripts/`).

## 2. Tractament dels Scripts Auxiliars
Copilot proposa moure **tots els scripts dispersos** a `util-formatting/util-scripts/`. Cada script estaria obligat a tindre un `manifest.json` amb l'amo, dependències i el punt d'entrada. Després, la carpeta `arc-tooling-adapters` actuaria com a pont per exposar-los sense trencar rutes.

## 3. La "Time Machine" del Cervell (Visió Complexa)
Copilot dissenya un mecanisme de Time Machine molt més d'estil "DevOps corporatiu" que Gemini:
- Ús de submòduls Git interns amb *signed commits* (GPG).
- Exportació d'snapshots en `tar.gz` pujats a Supabase.
- Hooks de *pre-commit* per validar que el cervell està bé abans de guardar els canvis.
- Comandes com `./agentsctl brain snapshot|rollback <id>`.
- Entorns *canary* de test per a desplegar noves skills.

---
*Amb això ja tenim dos enfocaments diferents per a la mateixa missió: l'enfocament pur i conceptual de Gemini vs. l'enfocament industrial/DevOps de Copilot. Restem a l'espera de la resta del Consell.*
