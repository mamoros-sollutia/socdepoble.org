import os
import re

dir_path = '_wiki_de_poble/05_Escriptori_Soc_de_Poble'
index_path = os.path.join(dir_path, '00_INDEX_ESCRIPTORI.md')

# Find all markdown files except the index itself
md_files = [f for f in os.listdir(dir_path) if f.endswith('.md') and f != '00_INDEX_ESCRIPTORI.md']

# Categories
actes = []
marmotes = []
briefings = []
prompts = []
inbox = []

for f in md_files:
    name = f.replace('.md', '')
    if 'MARMOTA' in name:
        marmotes.append(name)
    elif 'ACTA' in name:
        actes.append(name)
    elif 'BRIEFING' in name:
        briefings.append(name)
    elif 'PROMPT' in name or 'PETORRETA' in name or 'BUNDLE' in name:
        prompts.append(name)
    else:
        inbox.append(name)

# Sort them alphabetically (or chronologically since they start with timestamps)
actes.sort()
marmotes.sort()
briefings.sort()
prompts.sort()
inbox.sort()

new_index = f"""---
estat: canonic
tipus: document
description: "Índex Mestre de l'Escriptori per a ancorar Actes, Briefings i Prompts al Graf."
temes:
- escriptori
tags:
- actes
- escriptori
- socdepoble
- temporal
---

# 🗂️ Índex Mestre de l'Escriptori

Aquest document serveix per a **ancorar al cervell** totes les notes temporals, actes i documents de treball que el Mestre i la IAIA MarIA creen diàriament. Sense aquest document, el graf queda ple d'òrfenes desconnectades.

## 🛠️ Eines i Utilitats
- [[00_INDEX_QUARANTENA|🚧 Calaix de Quarantena (Scripts)]]

## 📥 Bandeja d'Entrada (Inbox)
"""
for name in inbox:
    new_index += f"- [[{name}]]\n"

new_index += "\n## 📝 Actes de Sessió\n"
for name in actes:
    new_index += f"- [[{name}]]\n"

new_index += "\n## 💤 Actes de la Marmota (Tancaments)\n"
for name in marmotes:
    new_index += f"- [[{name}]]\n"

new_index += "\n## 📋 Briefings i Planificació\n"
for name in briefings:
    new_index += f"- [[{name}]]\n"

new_index += "\n## 💬 Prompts i Codi Injectat\n"
for name in prompts:
    new_index += f"- [[{name}]]\n"

new_index += """
## 🗃️ Adopcions de l'Arxiu

---
> *"Un escriptori ordenat és l'avantsala d'una ment eficient. Que no quede cap paper solt."*


---

**Ancoratge de Seguretat:** [[00_INDEX]]
"""

with open(index_path, 'w', encoding='utf-8') as f:
    f.write(new_index)

print("Index rebuilt successfully.")
