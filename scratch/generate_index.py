import os
import uuid
from datetime import datetime

base_dir = "_wiki_de_poble/90_arxiu_historic"
scripts = []
for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith((".py", ".js", ".mjs", ".txt")):
            rel_path = os.path.relpath(os.path.join(root, file), base_dir)
            scripts.append(rel_path)

content = f"""---
id: doc-{uuid.uuid4()}
title: "Índex d'Scripts Històrics"
type: "note"
tags: ["index", "scripts", "arxiu"]
links: []
last_modified: "{datetime.utcnow().isoformat()}Z"
embedding_hash: ""
---
# Índex d'Scripts Històrics i Temporals

Aquest índex s'ha creat automàticament per enllaçar tots els scripts temporals (Python, JS, MJS, TXT) de l'arxiu històric i de l'escriptori, evitant que queden com a nodes satèl·lit (desconnectats) en el graf d'Obsidian.

## Llistat d'Scripts

"""
for script in sorted(scripts):
    content += f"- [[{script}]]\n"

with open(os.path.join(base_dir, "00_INDEX_SCRIPTS_HISTORICS.md"), "w") as f:
    f.write(content)
