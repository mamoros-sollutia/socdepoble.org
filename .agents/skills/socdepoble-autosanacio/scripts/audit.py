import os
import re
import yaml
import json

wiki_dir = "_wiki_de_poble"

estats = set()
tipus_set = set()
yaml_tags = set()
inline_tags = set()
aliases = set()
other_keys = set()

for root, dirs, files in os.walk(wiki_dir):
    if "04_ARXIU_Documents_Historics" in root or ".obsidian" in root:
        continue
    for file in files:
        if file.endswith(".md"):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
                # Extract inline tags (e.g. #etiqueta/graf or #rag)
                matches = re.findall(r'(?<!\S)#([a-zA-Z0-9_/-]+)', content)
                for m in matches:
                    inline_tags.add(m)
                
                match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
                if match:
                    frontmatter = match.group(1)
                    try:
                        data = yaml.safe_load(frontmatter)
                        if not data or not isinstance(data, dict): continue
                        
                        for k, v in data.items():
                            if k == 'estat': estats.add(str(v))
                            elif k == 'tipus': tipus_set.add(str(v))
                            elif k == 'tags':
                                if isinstance(v, list): yaml_tags.update(v)
                                else: yaml_tags.add(str(v))
                            elif k == 'aliases':
                                if isinstance(v, list): aliases.update(v)
                                else: aliases.add(str(v))
                            elif k != 'description':
                                other_keys.add(k)
                    except Exception as e:
                        pass

print("=== RESULTATS DE L'AUDITORIA (Actius) ===")
print(f"Estats detectats: {sorted(list(estats))}")
print(f"Tipus detectats: {sorted(list(tipus_set))}")
print(f"Etiquetes (YAML tags): {sorted(list(yaml_tags))}")
print(f"Etiquetes INLINE (Cos del text): {sorted(list(inline_tags))}")
print(f"Altres claus no estàndard usades: {sorted(list(other_keys))}")
