---
estat: actiu
tipus: skill
description: "Mirall humà de la skill obsidian-markdown"
source: .agents/skills/obsidian-markdown/SKILL.md
---

> [!WARNING]
> **AQUEST FITXER ÉS UN REFLEX (MIRROR)**
> Açò és l'estrat humà. Qualsevol modificació o discussió sobre com he d'actuar s'ha de fer ací. Quan estiguem d'acord, s'actualitzarà la meua vertadera matriu a `.agents/skills/obsidian-markdown/SKILL.md` exclusivament en anglés tècnic.

# Markdown d'Obsidian (Obsidian Flavored Markdown)

Crea i edita Markdown vàlid per a Obsidian. Obsidian amplia CommonMark i GFM amb wikilinks, incrustacions (embeds), callouts, propietats, comentaris i altra sintaxi.

## Flux de Treball: Crear una Nota

1. **Afig frontmatter** amb propietats (title, tags, aliases) a la part superior del fitxer.
2. **Escriu contingut** utilitzant Markdown estàndard per a l'estructura.
3. **Enllaça notes relacionades** utilitzant wikilinks (`[[Nota]]`).
4. **Incrusta contingut** d'altres notes, imatges o PDFs utilitzant la sintaxi `![[embed]]`.
5. **Afig callouts** per a informació destacada utilitzant la sintaxi `> [!tipus]`.

> **Regla d'or**: Utilitza `[[wikilinks]]` per a notes dins del vault (Obsidian fa un seguiment dels canvis de nom automàticament) i `[text](url)` només per a URLs externes.

## Enllaços Interns (Wikilinks)

```markdown
[[Nom de la Nota]]                     Enllaç a nota
[[Nom de la Nota|Text a Mostrar]]      Text personalitzat
[[Nom de la Nota#Encapçalament]]       Enllaç a encapçalament
[[Nom de la Nota#^block-id]]           Enllaç a bloc
[[#Encapçalament mateixa nota]]        Enllaç dins la mateixa nota
```

Defineix un ID de bloc afegint `^block-id` al final d'un paràgraf:

```markdown
Aquest paràgraf pot ser enllaçat. ^my-block-id
```

## Incrustacions (Embeds)

Afig un `!` davant de qualsevol wikilink per incrustar-ne el contingut en línia:

```markdown
![[Nom de la Nota]]                    Incrusta la nota sencera
![[Nom de la Nota#Encapçalament]]      Incrusta només la secció
![[image.png]]                         Incrusta imatge
![[image.png|300]]                     Incrusta imatge amb amplada 300px
![[document.pdf#page=3]]               Incrusta pàgina de PDF
```

## Callouts

```markdown
> [!note]
> Callout bàsic.

> [!warning] Títol Personalitzat
> Callout amb un títol a mida.

> [!faq]- Plegat per defecte
> Callout plegable (- plegat, + desplegat).
```

Tipus comuns: `note`, `tip`, `warning`, `info`, `example`, `quote`, `bug`, `danger`, `success`, `failure`, `question`, `abstract`, `todo`.

## Propietats (Frontmatter)

```yaml
---
title: La meua nota
date: 2024-01-15
tags:
  - projecte
  - actiu
aliases:
  - Nom Alternatiu
cssclasses:
  - classe-personalitzada
---
```

## Etiquetes (Tags)

```markdown
#etiqueta                    Etiqueta en línia
#etiqueta/niuada             Etiqueta amb jerarquia
```

## Comentaris

```markdown
Açò és visible %%però açò està amagat%%.

%%
Tot aquest bloc està amagat.
%%
```

## Sintaxi específica d'Obsidian

```markdown
==Text ressaltat==                   Sintaxi per ressaltar (highlight)
```

---
**Ancoratge de Seguretat:** [[00_INDEX_MIRROR]]
