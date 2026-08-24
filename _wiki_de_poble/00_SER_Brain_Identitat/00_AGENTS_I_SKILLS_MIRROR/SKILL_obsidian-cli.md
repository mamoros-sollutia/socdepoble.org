---
estat: actiu
tipus: skill
description: "Mirall humà de la skill obsidian-cli"
source: .agents/skills/obsidian-cli/SKILL.md
---

> [!WARNING]
> **AQUEST FITXER ÉS UN REFLEX (MIRROR)**
> Açò és l'estrat humà. Qualsevol modificació o discussió sobre com he d'actuar s'ha de fer ací. Quan estiguem d'acord, s'actualitzarà la meua vertadera matriu a `.agents/skills/obsidian-cli/SKILL.md` exclusivament en anglés tècnic.

# CLI d'Obsidian

Utilitza el CLI `obsidian` per interactuar amb una instància d'Obsidian en execució. Requereix que Obsidian estiga obert.

## Referència d'ordres

Executa `obsidian help` per veure totes les ordres disponibles. Açò sempre està actualitzat. Documentació completa: https://help.obsidian.md/cli

## Sintaxi

Els **Paràmetres** prenen un valor amb `=`. Posa els valors amb espais entre cometes:

```bash
obsidian create name="La meua nota" content="Hola món"
```

Els **Flags** són interruptors booleans sense valor:

```bash
obsidian create name="La meua nota" silent overwrite
```

Per a contingut multilínia, utilitza `\n` per a un salt de línia i `\t` per a una tabulació.

## Destí de fitxers

Moltes ordres accepten `file` o `path` per apuntar a un fitxer. Sense cap dels dos, s'utilitza el fitxer actiu.

- `file=<name>` — es resol com un wikilink (només el nom, sense ruta ni extensió)
- `path=<path>` — ruta exacta des de l'arrel del vault, ex. `carpeta/nota.md`

## Destí de Vaults

Les ordres apunten per defecte al vault enfocat més recentment. Utilitza `vault=<name>` com a primer paràmetre per apuntar a un vault específic:

```bash
obsidian vault="El Meu Vault" search query="prova"
```

## Patrons comuns

```bash
obsidian read file="La meua nota"
obsidian create name="Nova nota" content="# Hola" template="Plantilla" silent
obsidian append file="La meua nota" content="Nova línia"
obsidian search query="terme de cerca" limit=10
obsidian daily:read
obsidian daily:append content="- [ ] Nova tasca"
obsidian property:set name="status" value="done" file="La meua nota"
obsidian tasks daily todo
obsidian tags sort=count counts
obsidian backlinks file="La meua nota"
```

Utilitza `--copy` en qualsevol ordre per copiar l'eixida al porta-retalls. Utilitza `silent` per evitar que s'òbriguen els fitxers. Utilitza `total` a les ordres de llista per obtindre un recompte.

## Desenvolupament de plugins

### Cicle de desenvolupament/prova

Després de fer canvis al codi d'un plugin o tema, segueix este flux de treball:

1. **Recarrega** el plugin per aplicar els canvis:
   ```bash
   obsidian plugin:reload id=el-meu-plugin
   ```
2. **Comprova si hi ha errors** — si apareixen errors, soluciona'ls i repeteix des del pas 1:
   ```bash
   obsidian dev:errors
   ```
3. **Verifica visualment** amb una captura de pantalla o inspecció del DOM:
   ```bash
   obsidian dev:screenshot path=captura.png
   obsidian dev:dom selector=".workspace-leaf" text
   ```
4. **Comprova l'eixida de la consola** per detectar avisos o registres inesperats:
   ```bash
   obsidian dev:console level=error
   ```

### Ordres de desenvolupador addicionals

Executar JavaScript en el context de l'aplicació:

```bash
obsidian eval code="app.vault.getFiles().length"
```

Inspeccionar valors CSS:

```bash
obsidian dev:css selector=".workspace-leaf" prop=background-color
```

Activar/desactivar l'emulació mòbil:

```bash
obsidian dev:mobile on
```

Executa `obsidian help` per veure ordres de desenvolupador addicionals, incloent controls CDP i del depurador.

---
**Ancoratge de Seguretat:** [[00_INDEX_MIRROR]]
