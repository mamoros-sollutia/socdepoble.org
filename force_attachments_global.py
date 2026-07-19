import os

attachment_exts = {'.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg', '.mp3', '.webm', '.wav', '.m4a', '.ogg', '.3gp', '.flac', '.mp4', '.ogv', '.mov', '.mkv', '.pdf', '.opus', '.docx', '.css', '.yaml', '.ndjson'}

assets = []
vault_root = '/Users/javillinares/Documents/Antigravity/Som de Poble'
for root, dirs, files in os.walk(vault_root):
    # Skip legacy folder and code artifacts
    if 'node_modules' in root or '.git' in root or '/socdepoble/' in root or '.next' in root:
        continue
    for f in files:
        ext = os.path.splitext(f)[1].lower()
        if ext in attachment_exts:
            assets.append(os.path.join(root, f))

index_path = os.path.join(vault_root, 'socdepoble.org', '_wiki_de_poble', '04_ARXIU_Documents_Historics', '00_INDEX_ADJUNTS.md')
content = "---\nestat: \"canonic\"\ntipus: \"index\"\ndescription: \"Índex d'arxius adjunts orfes i multimèdia.\"\ntemes: [\"sistema\", \"acta\"]\n---\n# 📎 Índex d'Adjunts i Multimèdia\n\n"

for asset in assets:
    vault_path = os.path.relpath(asset, vault_root)
    content += f"- ![[{vault_path}]]\n"

content += "\n**Ancoratge de Seguretat:** [[00_INDEX]]\n"

with open(index_path, 'w') as f:
    f.write(content)

print(f"Forced exact path links for {len(assets)} global attachments.")
