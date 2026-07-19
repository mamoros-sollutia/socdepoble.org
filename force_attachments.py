import os

# Find all valid attachment extensions for Obsidian
attachment_exts = {'.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg', '.mp3', '.webm', '.wav', '.m4a', '.ogg', '.3gp', '.flac', '.mp4', '.ogv', '.mov', '.mkv', '.pdf', '.opus', '.docx', '.css', '.yaml', '.ndjson'}

assets = []
for root, dirs, files in os.walk('_wiki_de_poble'):
    for f in files:
        ext = os.path.splitext(f)[1].lower()
        if ext in attachment_exts:
            assets.append(os.path.join(root, f))

# Force linking ALL of them into the index, using their full path relative to the vault
index_path = '_wiki_de_poble/04_ARXIU_Documents_Historics/00_INDEX_ADJUNTS.md'
content = "---\nestat: \"canonic\"\ntipus: \"index\"\ndescription: \"Índex d'arxius adjunts orfes i multimèdia.\"\ntemes: [\"sistema\", \"acta\"]\n---\n# 📎 Índex d'Adjunts i Multimèdia\n\n"

for asset in assets:
    # Use exact vault paths for Obsidian to guarantee edge creation
    vault_path = asset.replace('_wiki_de_poble/', '')
    content += f"- ![[{vault_path}]]\n"

content += "\n**Ancoratge de Seguretat:** [[00_INDEX]]\n"

with open(index_path, 'w') as f:
    f.write(content)

print(f"Forced exact path links for {len(assets)} attachments.")
