import os
import yaml

all_tags = set()

def extract_frontmatter(content):
    if content.startswith('---\n'):
        parts = content.split('---\n', 2)
        if len(parts) >= 3:
            try:
                return yaml.safe_load(parts[1])
            except:
                pass
    return {}

for root, dirs, files in os.walk('_wiki_de_poble'):
    for file in files:
        if file.endswith('.md'):
            with open(os.path.join(root, file), 'r') as f:
                fm = extract_frontmatter(f.read())
                if not isinstance(fm, dict): continue
                for key in ['tags', 'temes', 'categoria']:
                    val = fm.get(key)
                    if isinstance(val, list):
                        for v in val:
                            all_tags.add(v)
                    elif isinstance(val, str):
                        all_tags.add(val)

print("Extracted Tags/Categories/Temes:")
for t in sorted(list(all_tags)):
    print(t)
