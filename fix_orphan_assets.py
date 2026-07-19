import os

md_contents = ""
for root, dirs, files in os.walk('_wiki_de_poble'):
    for f in files:
        if f.endswith('.md'):
            try:
                with open(os.path.join(root, f), 'r') as file:
                    md_contents += file.read()
            except:
                pass

assets = []
for root, dirs, files in os.walk('_wiki_de_poble'):
    for f in files:
        if not f.endswith('.md') and not f.endswith('.txt') and not f.endswith('.json') and not f.endswith('.js') and not f.endswith('.py') and not f.endswith('.mjs') and not f.startswith('.') and not f.endswith('.cjs') and not f.endswith('.html'):
            assets.append(os.path.join(root, f))

orphaned_assets = []
for asset in assets:
    basename = os.path.basename(asset)
    if basename not in md_contents and basename.replace(' ', '%20') not in md_contents:
        orphaned_assets.append(asset)

if orphaned_assets:
    index_path = '_wiki_de_poble/04_ARXIU_Documents_Historics/00_INDEX_ADJUNTS.md'
    content = "---\nestat: \"canonic\"\ntipus: \"index\"\ndescription: \"Índex d'arxius adjunts orfes i multimèdia.\"\ntemes: [\"sistema\", \"acta\"]\n---\n# 📎 Índex d'Adjunts i Multimèdia\n\nAquest índex recopila tots els arxius multimèdia (imatges, àudios, PDFs) que no estan enllaçats directament en cap document de la Wiki, per tal que el Graf els absorbisca i no queden flotant com a orfes.\n\n"
    for asset in orphaned_assets:
        content += f"- [[{os.path.basename(asset)}]]\n"
    content += "\n**Ancoratge de Seguretat:** [[00_index]]\n"
    with open(index_path, 'w') as f:
        f.write(content)
    print(f"Linked {len(orphaned_assets)} orphaned assets in 00_INDEX_ADJUNTS.md")
