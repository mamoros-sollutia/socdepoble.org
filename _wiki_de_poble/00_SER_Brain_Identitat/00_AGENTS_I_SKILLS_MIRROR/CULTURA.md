---
estat: generat
tipus: document
description: Vista generada des de .agents/CULTURA.md; no editar.
source: .agents/CULTURA.md
source_sha256: 8c61f7dee30953d2fd1954d391aeb5b9cbed8591195e0e97dbf247fc48fb1eb9
---

> [!warning] FITXER GENERAT
> Font canònica: `.agents/CULTURA.md`. Qualsevol edició manual serà sobreescrita.

# CONTEXT CULTURAL (SÓC DE POBLE)

Aquest document és el mòdul cultural de l'Agent. Conté diccionaris, folklore, festes i dades etnogràfiques.

## [FILE: ../_cultura_de_poble/diccionaris_i_llengua/00_GLOSSARI_CANONIC.md]
# 📚 GLOSSARI CANÒNIC I DICCIONARI DE LA LLENGUA DEL MAS
*Font Única de Veritat. Tota comunicació interna, codi, interfícies i textos han d'usar aquests termes.*

## 🗣️ TERMINOLOGIA TÈCNICA (Anglès → Valencià)

### Estats d'Interfície
| Anglès | Valencià Canònic | Context |
|--------|------------------|---------|
| `Hover` | **Surar** | quan sure sobre l'element |
| `Active` / `Pressed` | **Premut** | Estat de contacte tàctil |
| `Disabled` | **Sec** / **Desactivat** | Element no interactuable |
| `Focus` | **Enfocat** | Navegació per teclat |
| `Blur` | **Desenfocat** | Pèrdua de focus |

### Components d'Interfície
| Anglès | Valencià Canònic | Notes |
|--------|------------------|-------|
| `Snackbar` / `Toast` | **Avisador Efímer** | Bafarada temporal < 5s |
| `FAB` | **Botó Cúspide** | Botó flotant primari |
| `Dropdown` | **Llistat Caient** | Menú desplegable |
| `Header` | **Capçalera** | |
| `Sidebar` | **Barral Lateral** / **La Roca** | Navegació fixa en desktop |
| `Drawer` | **Calaix** | Panel lateral mòbil |
| `Modal` | **Finestra Modal** | |
| `Tooltip` | **Indicador Flotant** | |

### Accions
| Anglès | Valencià Canònic |
|--------|------------------|
| `Scroll` | **Desplaçar** |
| `Swipe` | **Lliscar** |
| `Tap` | **Tocar** |
| `Pinch` | **Pessigar** |
| `Drag` | **Arrossegar** |
| `Connect / Like / Save` | **Connectar** (Anti-likes) |

## 🌿 METÀFORES RURALS (Compressió Semàntica)
| Metàfora | Concepte Tècnic | Descripció |
|----------|-----------------|------------|
| **La Persona i el Vestit** | HTML/CSS | Les dades són "La Persona", l'estil "El Vestit". Prohibit Tailwind als components estructurals. |
| **Pedra Seca** | Resiliència i Soliditat | Construir per a durar. SEO honest mitjançant accessibilitat. Sense argamassa (pegats). |
| **La Sèquia Mare** | Flux de Dades | Metàfora per a un flux de dades ordenat. Una eventual sincronització amb Yjs és futura i no forma part de la baseline actual. |
| **Esporgar l'Olivera** | Neteja de deute tècnic | Eliminar components "fantasma" per baixar l'entropia. |
| **El Molí Fariner** | Lazy Chunking | Processar dades en lots per no saturar memòria. |

## ⚠️ EXCEPCIONS ESTRATÈGIQUES (NO TRADUIR)
- **Protocols:** WebRTC, CRDT, IndexedDB, HTML, CSS, JSON, UUID, OPFS
- **Llibreries/Codis:** Vanilla JS, React (si fos inevitable), Yjs, DOMPurify, Zod
- **Marques:** iPad, Apple, Google, Gemini, Tailwind (només excepcionalment)

## ⚙️ CONCEPTES TÈCNICS DE REFERÈNCIA (NO IMPLEMENTACIÓ ACTUAL)

Estos termes es conserven per poder parlar de possibles fases futures. La seua presència al glossari no prova que existisquen al codi ni els convertix en requisit.

| Concepte | Significat | Descripció |
|----------|---------------|------------|
| **CRDT** | *Conflict-free Replicated Data Type* | Família d'estructures per reconciliar edicions distribuïdes. És una opció futura que exigix model d'identitat, privacitat, purga i proves de conflicte. |
| **OPFS** | *Origin Private File System* | API privada de fitxers del navegador. Només s'usarà si una decisió futura en justifica compatibilitat, recuperació i migració. |

## 🖋️ LA SIGNATURA GRÀFICA
En generar imatges amb el model Nano Banana, s'ha d'incrustar: *"© [[el_projecte|Sóc de Poble]]. Fet per la IAIA i Nano Banana"*.

## Taxonomia
- **Categoria:** [[Coneixement]]
- **Etiquetes:** [[Graf]]

**Ancoratge de Seguretat:** [[00_INDEX]]

---

**Ancoratge de Seguretat:** [[00_INDEX]]

---

## [FILE: ../_cultura_de_poble/diccionaris_i_llengua/INDEX_TAXONOMIC.md]
# 🏷️ Índex Taxonòmic (Temes)

Per evitar l'entropia i la generació de nodes orfes o etiquetes redundants, **és obligatori** utilitzar exclusivament els següents temes (`temes`) en el YAML Frontmatter de qualsevol document creat a la Wiki.

## Temes Transversals Admesos

- `arquitectura`: Per a documents que parlen de la construcció del sistema, carpetes o infraestructura tècnica.
- `auditoria`: Per a actes o informes derivats de les auditories del Consell de la IAIA.
- `termodinamica`: Per a regles d'optimització d'espai, purga de dades i memòria.
- `petorreta`: Per als prompts i instruccions del model d'IAIA.
- `sistema`: Per a la configuració global o de màquina.
- `sollutia`: Per a documents heretats de l'antiga plataforma Sóc de Poble desenvolupada per Sollutia.
- `soci`: Per a funcionalitats relacionades amb usuaris o membres.
- `consell-ia`: Per a intervencions conjuntes del Consell d'Intel·ligències.
- `auto-maduracio`: Per als registres d'automillora i autoconsciència del genotip.
- `acta`: Per a registres oficials i diaris.
- `destillacio`: Per als processos de reducció de l'entropia i agrupació de coneixement.

*(Les etiquetes anteriors es basen en el Glossari Canònic i la pràctica de l'Auditoria).* 

**Ancoratge de Seguretat:** [[00_GLOSSARI_CANONIC]]

---

**Ancoratge de Seguretat:** [[00_INDEX]]

---

## [FILE: ../_cultura_de_poble/la_torre_de_les_macanes/fadrins_i_fadrines.md]
# 🎊 Cultura Fadrins i Fadrines (La Torre de les Maçanes)

**Data d'extracció:** Agost 2026
**Festers Majors 2026:** Llorenç i Andrés.

## 1. Essència de la Festa
- És la festa de transició a la maduresa ("soc major, ja puc fer la festa").
- Organitzada conjuntament per joves (xics i xiques), destacant pel treball en equip, la il·lusió i la unió del poble.
- **La Mare de Déu dels Fadrins:** Patrona de les festes. S'hi té una profunda devoció que es manifesta en l'ofrena i les processons. "La que sempre està, la que s'ocupa de que no falte de res".

## 2. Actes Principals ("El Jaleo")
- **La Banyà (15 d'Agost a les 13:00h):** És l'acte més sonat. La gent es banya amb poals d'aigua des del Molí fins a l'Olivera. Va nàixer fa anys com una broma tirant-se gots d'aigua al bar d'Adrián i va derivar en una tradició de tot el poble. *Regla d'or:* Només H2O, prohibit agafar aigua del terra ("no sigueu porcs").
- **Concurs de Paelles (16 d'Agost a les 13:30h):** Es fa a les barbacoes del parc municipal. "Dueu llenya i aigüeta per si provoqueu un incendi". Acaba quan ix la paella guanyadora.
- **Despertà i Ofrena:** Matinades amb "orsos, penjats i calandaris", i vesprades de recolliment i germanor.
- **Processó i Au (Últim dia):** Tancament gloriós de les festes.

## 3. El Vocabulari Torruano (Edició Festers)
- **Trompellòt:** Individu falt de coneixement.
- **Desintegració estomacal:** Terme tècnic per dir que algú es va cagar.
- **Orso:** Animal amb molt de pèl.
- **Ferretero:** Individu extern a la Torre que du hamburgueses.
- **Trefulca:** Discussió.
- **Acatombe:** Resultat de tirar 200.000 pts de pólvora.
- **Ca Melio:** Animal amb defectes dorsals visibles.

*Nota cultural:* Els festers del 2026 es van maquetar l'àlbum de festes amb format de cartes de Pokémon (incloent un "Squirtle us desitja Bones Festes!" pescant).

---

**Tornar a:**[[00_visio_i_pilars]]

## Taxonomia
- **Categoria:** [[Coneixement]]
- **Etiquetes:** [[Graf]]

**Ancoratge de Seguretat:** [[00_INDEX]]

---

**Ancoratge de Seguretat:** [[00_INDEX]]

---

---

**Ancoratge de Seguretat:** [[00_INDEX_MIRROR]]
