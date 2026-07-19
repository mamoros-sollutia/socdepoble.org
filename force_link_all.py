import os

anchored_count = 0
for root, dirs, files in os.walk('_wiki_de_poble'):
    for f in files:
        if f.endswith('.md'):
            path = os.path.join(root, f)
            with open(path, 'r') as file:
                content = file.read()
            
            if '**Ancoratge de Seguretat:**' not in content and f.lower() != '00_index.md' and f.lower() != '00_index_arxiu_secundari.md':
                if content.strip():
                    content += "\n\n**Ancoratge de Seguretat:** [[00_INDEX]]\n"
                    with open(path, 'w') as file:
                        file.write(content)
                    anchored_count += 1
print(f"Anchored {anchored_count} files.")
