---
tipus: estudi_auditoria
estat: obert
description: "Estudi de la resposta de Codex: Seguretat Backend i Refactorització"
---

# 🕵️ ESTUDI D'AUDITORIA: CODEX (260904_0210)

## 1. Entrada Rebutjada / Proposada
Codex ha llançat un SDP-LOCK fulminant, detectant un defecte arquitectònic P0 a nivell de base de dades.

1. **[P0] Seguretat i Integritat Backend:** Les notes actualment es guarden dins de l'array JSON de la taula `app_content`. Aquesta taula és de lectura pública, el que significa que qualsevol nota "privada" pot ser llegida per qualsevol si intercepta la petició! A més, fer GET+PATCH d'un array sencer JSON pot causar sobreescriptures si dos dispositius guarden a l'hora. Proposa crear una taula SQL `notes` dedicada amb RLS (Row Level Security).
2. **[P1] Hero Image Destructiu:** Confirma el mateix que Claude. El botó no funciona i l'esborrat no fa *optimistic update*.
3. **[P1] Taxonomia Corrompuda:** Confirma l'error del 'Mur' (Grok, Dola, Claude).
4. **[P1] Accessibilitat Píndoles:** Confirma la falta de teclat per a interactuar amb el `role="button"`. Proposa extraure un component `BadgeList`.
5. **[P1] Connectar genera [object Object]:** A `UniversalComponents.jsx:444`, `titleText` està rebent un node React en compte d'un String, i s'està ficant a la URL com a `[object Object]`. Brutal captura!
6. **[P1] H1 Duplicat:** `DesignSection.jsx:210` posa un tag `<h1>` extra.
7. **[P2] AI Slop Confirmada:** Totes les classes que deia Claude, més 19 estils inline a DesignSection, 18 a UniversalComponents.

## 2. Anàlisi DAFO de la Proposta

### Debilitats (D)
- Demana una migració de base de dades SQL massiva en mig d'una auditoria de UI Frontend.

### Amenaces (A)
- Si fem la migració SQL ara, podem trencar tot el sistema de notes existent.

### Fortaleses (F)
- Ha trobat el bug del `[object Object]` a la URL que ningú més havia vist.
- La seua visió de seguretat backend és incontestable: les notes no poden viure en un camp de lectura pública.

### Oportunitats (O)
- Separar l'auditoria en dues fases: 
  - FASE 1 (Ara): Refactorització React, UI, Píndoles, Hero Image.
  - FASE 2 (Futur): Migració backend SQL per a les notes.

## 3. Matriu d'Importància i Urgència (Eisenhower)
- **Crític i Urgent:** Arreglar el bug de la URL `[object Object]`. Netejar els H1 i l'AI Slop. Arreglar els botons i la lògica de píndoles (ja previst).
- **Crític però No Urgent (per a aquesta sessió):** Migració de taula SQL. Quedarà apuntat com a Deute Tècnic P0 per a una sessió dedicada de backend.

## 4. Aplicació del Trellat
Atés que el Mestre ha donat llum verda per aplicar el "Trellat" sobre les decisions obertes:
1. **La Barra Blava:** La llevem al Bloc de Notes, però traiem el Hero fora del seu condicional a `UniversalComponents` perquè no desaparega.
2. **Llei de Vida:** Les píndoles interactives faran 44px (o tindran un padding transparent que eixample la diana tàctil a 44px sense trencar el disseny visual massivament).
3. **Data URI:** Ho limitarem a 512KB temporalment.
4. **Base de Dades:** Les notes es queden en `app_content` només durant aquesta sessió. No tocaré Supabase hui per evitar catàstrofes.
