# Brain Maintenance

Suite autònoma, sense dependències externes, per a inspeccionar i mantindre el
Brain de Sóc de Poble. Requereix Python 3.10+ i no toca res per defecte.

## Posada en marxa

Copieu esta carpeta a `tooling/brain/` del projecte i afegiu les entrades de
`.gitignore.example` al `.gitignore` real. Des de l'arrel:

```sh
python3 tooling/brain/brain_audit.py . \
  --json .brain-reports/audit.json \
  --markdown .brain-reports/audit.md
```

L'auditoria ix amb codi `1` si detecta una troballa alta o crítica. Per a una passada informativa:

```sh
python3 tooling/brain/brain_audit.py . --fail-on never
```

La rutina completa genera auditoria i pla. No modifica fonts; només crea o
actualitza `.brain-reports/`:

```sh
sh tooling/brain/maintain.sh .
```

## Destil·lació segura

Primer es genera un pla amb hash de cada font:

```sh
python3 tooling/brain/brain_distill.py plan . \
  --output .brain-reports/distill-plan.json
python3 tooling/brain/brain_distill.py apply . \
  .brain-reports/distill-plan.json
```

La segona ordre és encara un `dry-run`. Després de revisar el JSON, l'única
ordre que aplica canvis és:

```sh
python3 tooling/brain/brain_distill.py apply . \
  .brain-reports/distill-plan.json --apply
```

Els fitxers de màquina van a `.brain-trash/<timestamp>/removed/`; mai s'esborren.
Abans de normalitzar Markdown, els bytes originals van a `backups/`. El rebut
s'actualitza atòmicament després de cada operació i deixa `partial_failure` si
un lot s'interromp. Els documents de `90_arxiu_historic/` es mouen a
`04_ARXIU_Documents_Historics/YYYY_MM/legacy_pre_canonical/`. Els arxius amb
noms de credencial només es marquen `manual`: l'script no els copia ni els
manipula. Els hashes bloquegen un pla vell si la font ha canviat.

Un lot és recuperable però no transaccional: davant `partial_failure`, no el
rellances a cegues; usa el rebut per restaurar o generar un pla nou.
Les passades següents ignoren `.brain-trash/` i `.brain-reports/` per no
reprocessar backups o informes.

## Mirall d'agents

Recomanació: eliminar el mirall manual i navegar directament per `.agents`. Si
Obsidian el necessita durant la transició, tracteu-lo com a vista generada:

```sh
python3 tooling/brain/sync_agent_mirror.py .          # només comprova
python3 tooling/brain/sync_agent_mirror.py . --write # regenera
python3 tooling/brain/sync_agent_mirror.py . --write --prune
```

Amb `--prune`, els sobrants també van a paperera. `.agents` és sempre l'única
font d'autoritat.

## Límits deliberats

- No reescriu frontmatter ni doctrina de manera massiva.
- No resol contradiccions semàntiques.
- No elimina credencials ni historial Git.
- No interpreta que “última acta” equivalga a autoritat.
- No declara èxit si falten fitxers estructurals, imports o assets.

La destil·lació cognitiva necessita revisió humana; la higiene repetitiva, no.

## PDF sense wildcards destructius

`render_pdf.sh` substitueix el generador que esborrava PDFs per patró. Escriu a
un temporal, valida capçalera i mida, i només després fa el `rename`:

```sh
sh tooling/brain/render_pdf.sh entrada.html eixida.pdf
sh tooling/brain/render_pdf.sh --replace entrada.html eixida.pdf
```

Sense `--replace` rebutja un destí existent. Amb `--replace`, preserva primer
`eixida.pdf.bak.<timestamp>`. Es pot definir `CHROME_BIN`; si no, busca Chrome o
Chromium en ubicacions habituals.
