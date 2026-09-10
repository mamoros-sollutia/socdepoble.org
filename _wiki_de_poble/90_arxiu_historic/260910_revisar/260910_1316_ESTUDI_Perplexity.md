---
tipus: estudi_ia
estat: obert
description: "Estudi profund de l'Auditoria proporcionada per Perplexity, enfocada en la màquina d'estats de l'arxiu, el pes de components universals i contractes de rutes."
---
# 🧠 ESTUDI CONSELL: Perplexity (Auditoria Extrema i Cognitiva)

## 1. Digestió i Valoració Global (Mode Estudi)
Perplexity ens aporta l'última peça del puzle (nota 7.2/10). Fa una diagnosi forense excel·lent sobre per què la IA "tria" `90_arxiu_historic` (és una competició semàntica on les paraules 'arxiu' i 'històric' tenen més densitat que 'revisar'). A més, a nivell de React, detecta el perill de tindre components universals "massa intel·ligents" (amb excés de responsabilitats).

---

## 2. Aportacions Tècniques (L'Excés de Responsabilitat)

| Troballa Tècnica (Perplexity) | Anàlisi de la IAIA MarIA |
| :--- | :--- |
| **Components Universals massa llestos** | `UniversalPage` i `UniversalElements` fan massa coses (routing, dades, permisos, UI). Suggereix dividir-los en *Boundaries* i *Renderers*. Molt cert, però demanaria un refactor gegant. (Fase 2) |
| **Contracte de Rutes** | Proposa crear una taula estricta de rutes (path, title, indexable, authRequired) per centralitzar el SEO i l'enrutament, deslliurant el router de tindre-ho *hardcoded*. |
| **Frontera de Backend** | Demana definir formalment un contracte mínim (identitat, paginació, errors, etc.) abans de connectar Sollutia, confirmant la visió de Claude sobre l'adaptador. |

---

## 3. Anàlisi Forense i la Màquina d'Estats
L'anàlisi psicològica de Perplexity és profunda. Diu que l'instint naix perquè l'agent confon l'inventari (allò que existeix) amb l'acció (allò permès). Proposa:
1. **Màquina d'Estats (El cicle de vida real)**: 
   - Nou → `90_revisar` (validat).
   - Revisat → `90_arxiu_historic` (només per aprovació humana).
2. **Separar Lectura/Escriptura**: El manifest pot permetre llegir l'històric, però no escriure-hi per defecte.
3. **Pla Obligatori (Dry-Run)**: Abans d'escriure res, l'agent ha d'imprimir la ruta resolta, la regla que l'autoritza i l'estat.

---

## 4. Conclusions Operatives per al Pla d'Implementació
Afegirem els matisos de Perplexity al nostre pla (ja gairebé blindat):
1. **El Contracte `DESTINS_CANONICS` serà una Màquina d'Estats**: No només direm on van les coses, sinó que establirem que `90_arxiu_historic` és **Read-Only** per defecte per a l'agent, i `90_revisar` és la bústia d'escriptura per defecte de tot allò no lliurable.
2. **Deute Tècnic d'Arquitectura React (A Poda Futura)**: Sumarem al deute de la següent iteració la descomposició de l'`UniversalPage` en *Boundaries* (Dades, SEO, Permisos, Error) com suggereix de forma brillant Perplexity.
