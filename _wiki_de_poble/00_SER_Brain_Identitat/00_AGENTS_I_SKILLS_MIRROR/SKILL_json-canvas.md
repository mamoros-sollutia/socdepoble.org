---
estat: actiu
tipus: skill
description: "Mirall humà de la skill JSON Canvas"
source: .agents/skills/json-canvas/SKILL.md
---

> [!WARNING]
> **AQUEST FITXER ÉS UN REFLEX (MIRROR)**
> Açò és l'estrat humà. Qualsevol modificació o discussió sobre com he d'actuar s'ha de fer ací. Quan estiguem d'acord, s'actualitzarà la meua vertadera matriu a `.agents/skills/json-canvas/SKILL.md` exclusivament en anglés tècnic.

# Skill de JSON Canvas

Crea i edita fitxers JSON Canvas (`.canvas`) amb nodes, arestes, grups i connexions. S'utilitza en treballar amb fitxers `.canvas`, creant llenços visuals, mapes mentals, diagrames de flux, o quan l'usuari esmenta fitxers Canvas a Obsidian.

## Estructura del Fitxer

Un fitxer canvas (`.canvas`) conté dues llistes de nivell superior seguint l'especificació [JSON Canvas Spec 1.0](https://jsoncanvas.org/spec/1.0/):

```json
{
  "nodes": [],
  "edges": []
}
```

- `nodes` (opcional): Llista d'objectes node
- `edges` (opcional): Llista d'objectes aresta que connecten nodes

## Fluxos de Treball Comuns

### 1. Crear un Nou Canvas
1. Crea un fitxer `.canvas` amb l'estructura base `{"nodes": [], "edges": []}`
2. Genera identificadors hexadecimals únics de 16 caràcters per a cada node (ex: `"6f0ad84f44ce9c17"`)
3. Afig nodes amb els camps requerits: `id`, `type`, `x`, `y`, `width`, `height`
4. Afig arestes referenciant IDs de nodes vàlids mitjançant `fromNode` i `toNode`
5. **Validar**: Analitza el JSON per confirmar que és vàlid. Verifica que tots els valors `fromNode`/`toNode` existeixen a la matriu de nodes.

### 2. Afegir un Node a un Canvas Existent
1. Llig i analitza el fitxer `.canvas` existent
2. Genera un ID únic que no col·lidisca amb cap node o aresta existent
3. Tria una posició (`x`, `y`) que evite solapar nodes existents (deixa 50-100px d'espai)
4. Afig el nou objecte node a la llista `nodes`
5. Opcionalment, afig arestes que connecten el nou node amb els existents
6. **Validar**: Confirma que tots els IDs són únics.

### 3. Connectar Dos Nodes
1. Identifica els IDs del node d'origen i de destinació
2. Genera un ID únic d'aresta
3. Defineix `fromNode` i `toNode` amb els IDs d'origen i de destinació
4. Opcionalment defineix `fromSide`/`toSide` (top, right, bottom, left) per als punts d'ancoratge
5. Opcionalment defineix `label` per al text descriptiu a l'aresta
6. Afig l'aresta a la llista `edges`

### 4. Editar un Canvas Existent
1. Llig i analitza el fitxer `.canvas` com a JSON
2. Localitza el node o aresta objectiu mitjançant el seu `id`
3. Modifica els atributs desitjats (text, posició, color, etc.)
4. Escriu el JSON actualitzat de tornada al fitxer

## Generació d'IDs
Genera cadenes hexadecimals en minúscules de 16 caràcters (valor aleatori de 64 bits):
`"6f0ad84f44ce9c17"`

## Colors
Accepta una cadena hexadecimal o un número predefinit:
- `"1"`: Roig
- `"2"`: Taronja
- `"3"`: Groc
- `"4"`: Verd
- `"5"`: Cian
- `"6"`: Morat

---
**Ancoratge de Seguretat:** [[00_INDEX_MIRROR]]
