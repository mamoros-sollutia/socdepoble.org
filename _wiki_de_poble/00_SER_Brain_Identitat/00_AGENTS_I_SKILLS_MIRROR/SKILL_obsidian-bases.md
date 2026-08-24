---
estat: actiu
tipus: skill
description: "Mirall humà de la skill obsidian-bases"
source: .agents/skills/obsidian-bases/SKILL.md
---

> [!WARNING]
> **AQUEST FITXER ÉS UN REFLEX (MIRROR)**
> Açò és l'estrat humà. Qualsevol modificació o discussió sobre com he d'actuar s'ha de fer ací. Quan estiguem d'acord, s'actualitzarà la meua vertadera matriu a `.agents/skills/obsidian-bases/SKILL.md` exclusivament en anglés tècnic.

# Skill de Bases d'Obsidian

Crea i edita fitxers de Bases d'Obsidian (`.base`) amb vistes, filtres, fórmules i resums. S'utilitza en treballar amb fitxers `.base`, creant vistes tipus base de dades per a notes, o quan l'usuari esmenta Bases, vistes de taula, vistes de targeta, filtres o fórmules a Obsidian.

## Flux de treball

1. **Crear el fitxer**: Crea un fitxer `.base` al vault amb contingut YAML vàlid.
2. **Definir l'abast**: Afig `filters` per seleccionar quines notes apareixen (per etiqueta, carpeta, propietat o data).
3. **Afegir fórmules** (opcional): Defineix propietats calculades a la secció `formulas`.
4. **Configurar vistes**: Afig una o més vistes (`table`, `cards`, `list` o `map`) amb `order` per especificar quines propietats mostrar.
5. **Validar**: Verifica que el fitxer siga YAML vàlid sense errors de sintaxi. Comprova que totes les propietats i fórmules referenciades existisquen.
6. **Provar a Obsidian**: Obri el fitxer `.base` a Obsidian per confirmar que la vista es renderitza correctament.

## Esquema

Els fitxers de Bases utilitzen l'extensió `.base` i contenen YAML vàlid.

```yaml
# Els filtres globals s'apliquen a TOTES les vistes de la base
filters:
  and:
    - 'status == "active"'
    - not:
        - 'file.hasTag("archived")'

# Defineix propietats de fórmula per utilitzar en totes les vistes
formulas:
  formula_name: 'expression'

# Configura els noms a mostrar (display names) i ajustos per propietats
properties:
  property_name:
    displayName: "Nom a Mostrar"
  formula.formula_name:
    displayName: "Nom a Mostrar de la Fórmula"
  file.ext:
    displayName: "Extensió"

# Defineix fórmules de resum personalitzades
summaries:
  custom_summary_name: 'values.mean().round(3)'

# Defineix una o més vistes
views:
  - type: table | cards | list | map
    name: "Nom de la Vista"
    limit: 10                    # Opcional: limita els resultats
    groupBy:                     # Opcional: agrupa resultats
      property: property_name
      direction: ASC | DESC
    filters:                     # Els filtres específics de vista segueixen les mateixes regles
      and:
        - 'status == "active"'
    order:                       # Propietats a mostrar en ordre
      - file.name
      - property_name
      - formula.formula_name
    summaries:                   # Assigna propietats a fórmules de resum
      property_name: Average
```

## Sintaxi de Filtres

Els filtres redueixen els resultats. Es poden aplicar globalment o per vista. 
Accepta filtres individuals o estructures imbricades amb operadors `and`, `or`, `not`.

| Operador | Descripció |
|----------|-------------|
| `==` | igual |
| `!=` | diferent |
| `>` | major que |
| `<` | menor que |
| `>=` | major o igual que |
| `<=` | menor o igual que |
| `&&` | AND lògic |
| `\|\|` | OR lògic |
| `!` | NOT lògic |

## Propietats

Hi ha tres tipus de propietats:
1. **Propietats de la nota** - Des del frontmatter: `note.author` o simplement `author`
2. **Propietats del fitxer** - Metadades del fitxer: `file.name`, `file.mtime`, `file.tags`, `file.links`, etc.
3. **Propietats de fórmula** - Valors calculats: `formula.my_formula`

## Sintaxi de Fórmules

Les fórmules calculen valors a partir de propietats i es defineixen a la secció `formulas`. Admeten aritmètica simple, lògica condicional (`if()`), formatat d'estils i dades (`file.ctime.format()`). 

- **Atenció amb les dates**: En restar dues dates, el resultat és del tipus **Duration** (no un número). Per tractar-lo com a número cal utilitzar les propietats `.days`, `.hours`, etc., i **després** aplicar funcions numèriques (com `.round()`).

## Funcions Clau

| Funció | Signatura | Descripció |
|----------|-----------|-------------|
| `date()` | `date(string): date` | Analitza un text com a data (`YYYY-MM-DD HH:mm:ss`) |
| `now()` | `now(): date` | Data i hora actual |
| `today()` | `today(): date` | Data actual (hora = 00:00:00) |
| `if()` | `if(condition, trueResult, falseResult?)` | Condicional |
| `duration()` | `duration(string): duration` | Analitza un text com a durada |
| `file()` | `file(path): file` | Obté l'objecte del fitxer |
| `link()` | `link(path, display?): Link` | Crea un enllaç |

## Incrustar Bases

Incrusta en fitxers Markdown utilitzant `![[NomDeLaBase.base]]` o `![[NomDeLaBase.base#Nom de la Vista]]` per a una vista específica.

## Regles de Cometes en YAML

- Utilitza cometes simples per a fórmules que contenen cometes dobles: `'if(done, "Sí", "No")'`
- Utilitza cometes dobles per a cadenes simples: `"El Nom de la meua Vista"`
- Compte amb caràcters especials YAML (`:`, `{`, `}`, `[`, `]`, `,`, `&`, `*`, `#`, `?`, `|`, `-`, `<`, `>`, `=`, `!`, `%`, `@`, `` ` ``). Cal emmarcar-los en cometes si formen part d'una cadena de text.

---
**Ancoratge de Seguretat:** [[00_INDEX_MIRROR]]
