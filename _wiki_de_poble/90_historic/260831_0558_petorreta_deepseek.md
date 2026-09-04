---
tipus: document
estat: esborrany
description: Petorreta del Consell (Deepseek)
---
Ancoratge: [[00_INDEX_ESCRIPTORI]]

# Petorreta del Consell (Deepseek)

**Resum:**
Deepseek aprofundeix en la mecanització forta de l'ancoratge i la integració amb Sollutia. Destaca que la dependència de la memòria agentiva és la fallida estructural principal i proposa solucions en tres capes (Git hooks, scripts d'avaluació i skills preventives). A més, aporta suggeriments concrets sobre el build standalone de React i l'encapsulament de l'estil al Shadow DOM perquè Sollutia puga personalitzar el tema.

## Mecanització i Patrons Universals (Missió 1)
- **Tractor d'ancoratge (Git hook):** Proposa l'script `tractor-ancoratge.mjs` que llig quins fitxers estan en *staged* (`git diff --cached`) i aborta el commit si algun Markdown nou de l'Escriptori no apareix al `00_INDEX_ESCRIPTORI.md`.
- **Skill Preventiva `core-anchor`:** Crear una skill lligada a les eines d'escriptura (`write_to_file`, `replace_file_content`) per obligar l'agent a ancorar abans o immediatament després d'escriure, interceptant l'oblit.

## Sanador i Wiki (Missió 2)
- **Sanació Semàntica:** Ús de models d'embeddings NLP lleugers per detectar relacions semàntiques i proposar connexions per a la `teixidora_sinapsis.mjs`, funcionant en un mode interactiu on demane confirmació abans d'aplicar canvis (evitant destrosses cegues).
- **Criteri d'Orfe Rellevant:** Un orfe amb més de 200 paraules és molt més prioritari que un document residual.

## Preparació per a Sollutia (Missió 3)
- **Build ESM Opcional:** El build actual externalitza React cap a `wp.element` (específic per a WordPress). Recomana oferir un build ESM natiu addicional per si Sollutia fa servir un sistema on importa els components com a mòdul i no confia en globals.
- **Customització de Temes des de l'Amfitrió:** Exposar un mètode al component (`themeConfig`) que permeta al contenidor de Sollutia injectar els seus propis colors i sobreescriure variables CSS com `--sdp-bg` directament sobre el Shadow Root. Això flexibilitza la integració visual.
