import os
import re

index_path = "_wiki_de_poble/05_Escriptori_Soc_de_Poble/00_INDEX_ESCRIPTORI.md"
dir_path = "_wiki_de_poble/05_Escriptori_Soc_de_Poble/"

# files in dir_path ending with .md
files = [f for f in os.listdir(dir_path) if f.endswith(".md") and f != "00_INDEX_ESCRIPTORI.md"]
files.sort()

with open(index_path, "r") as f:
    content = f.read()

new_actes = []
new_prompts = []

for f_name in files:
    basename = f_name[:-3]
    if basename not in content:
        link = f"- [[{basename}]]"
        if "ACTA_" in f_name:
            new_actes.append(link)
        elif "PROMPT_" in f_name:
            new_prompts.append(link)

if new_actes:
    # insert before ## 💤 Actes de la Marmota (Tancaments)
    parts = content.split("## 💤 Actes de la Marmota")
    parts[0] = parts[0] + "\n".join(new_actes) + "\n\n"
    content = "## 💤 Actes de la Marmota".join(parts)

if new_prompts:
    # insert before ## 🗃️ Adopcions de l'Arxiu
    parts = content.split("## 🗃️ Adopcions de l'Arxiu")
    parts[0] = parts[0] + "\n".join(new_prompts) + "\n\n"
    content = "## 🗃️ Adopcions de l'Arxiu".join(parts)

with open(index_path, "w") as f:
    f.write(content)

