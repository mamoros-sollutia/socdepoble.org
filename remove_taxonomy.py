import os
import re

wiki_dir = '/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/_wiki_de_poble'
count = 0

for root, dirs, files in os.walk(wiki_dir):
    for file in files:
        if file.endswith('.md'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()
            
            # Remove lines containing #categoria/ or #etiqueta/
            new_content = re.sub(r'^.*(?:#categoria/|#etiqueta/).*$\n?', '', content, flags=re.MULTILINE)
            
            # Remove leftover empty bullet points for Categories/Tags
            new_content = re.sub(r'^- \*\*Categoria( Pròpia)?:\*\*\s*$\n?', '', new_content, flags=re.MULTILINE)
            new_content = re.sub(r'^- \*\*Etiquetes( Pròpies)?:\*\*\s*$\n?', '', new_content, flags=re.MULTILINE)
            
            # Remove empty ## Taxonomia headers (if followed by another header or end of file)
            new_content = re.sub(r'## Taxonomia\s*(?=\n## |\Z)', '', new_content)
            new_content = re.sub(r'## Taxonomia\s*$', '', new_content)

            if content != new_content:
                with open(filepath, 'w') as f:
                    f.write(new_content)
                count += 1

print(f"Modified {count} files.")
