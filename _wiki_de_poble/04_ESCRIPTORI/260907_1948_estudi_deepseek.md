---
tipus: estudi
estat: esborrany
description: "Pla tècnic Fase 3 per Deepseek"
---

# 🛡️ FASE 3: Auditoria Deepseek

He rebut el bundle complet de Sóc de Poble (`260907_1528_BUNDLE_connexio_sollutia.md`). És un paquet d'auditoria que conté la Wiki canònica, el codi font i les eines del projecte, amb un manifest verificable. A continuació et faig un resum del que conté i t’oferisc ajuda per a qualsevol anàlisi específica.

## 📦 Què és aquest bundle
- **Esquema:** `sdp.bundle.v2` (generat el 2026-09-07).
- **Contingut:** 435 fitxers, 3.28 MB, amb sha256 de cada un.
- **Abast:** Inclou la Wiki (`_wiki_de_poble`), els agents (`.agents`), el codi font (`src`), les eines (`tooling`), scripts, assets i la base de dades (Supabase).
- **Verificació:** Pots comprovar les sumes SHA del manifest per assegurar que el cos coincideix amb el que es promet.

## 🧭 Estructura del projecte (4 pilars + 2 zones)
- **00_SER** – Identitat, genotip, actors, BIOS, IAIA MarIA.
- **01_SABER** – Cultura, Trellat, glossari, memòria rural.
- **02_ACTUAR** – Màquina tècnica, skills, scripts, plantilles, arquitectura React/Vite.
- **03_GOVERNAR** – Normativa, lleis, estàndards (UI, integració, privacitat).
- **04_ARXIU** – Històric curat.
- **05_ESCRIPTORI** – Treball actiu temporal (safata d’entrada i producció).

## 🔑 Principis clau (extrets del genotip i la constitució)
- **Trellat:** Simplicitat, accessibilitat, evidència abans d’afirmar.  
- **Pedra Seca:** Disseny visual basat en tokens CSS, sense Tailwind visual, amb contrast alt i objectius tàctils de 44px.  
- **Online-First estricte:** ADR-2026-08; la font de veritat és Supabase (la descentralització P2P és futura).  
- **Privacitat per defecte:** Dades personals mai exposades sense consentiment; política de no cookies comercials.  
- **Protocol Petorreta:** Qualsevol mutació requerix `open → seal → verify → consume` amb lease criptogràfica.

## 🧠 Skills actives (executades pels agents)
- `core-context-panic` – Fusible mental contra al·lucinacions.
- `core-restauracio-segellada` – Restauració amb hash i segell.
- `pedra-seca` – Llei de disseny visual.
- `universal-page` – Estàndard d’arquitectura de pàgines.
- I moltes altres (reflexió prèvia, cicle de vida, consell-bundle, estudi-mercat, etc.).

## 🛠️ Portes mecàniques (tractors) que verifiquen la integritat
El directori `tooling/gates/` conté desenes de tractors que auditen:
- L’ús de tokens CSS (`tractor-tokens`).
- La consistència cromàtica (`tractor-cromatic`).
- L’enxufabilitat del backend (`tractor-enxufe`).
- La coherència del cens de Petorretes (`tractor-cens`).
- La salut del graf (`teixidor`, `sistema_immunitari`).

## 📝 Com puc ajudar-te?
- **Verificar el bundle** – Comparar sumes SHA del manifest amb el cos extraït.
- **Extraure informació concreta** – Trobar una skill, una norma, un script, una ruta de codi.
- **Entendre un aspecte** – Explicar la filosofia de Trellat, l’arquitectura React, el protocol d’integració amb Sollutia, etc.
- **Generar un informe** – Resumir l’estat de les portes o el deute tècnic declarat.
- **Identificar punts febles** – Revisar les contradiccions o les promeses pendents.

Si tens una pregunta concreta, només has de dir-m’ho i aprofundiré en la part que t’interesse. Per ara, el bundle està processat i a la teua disposició per a qualsevol anàlisi.
