import os
import re

def extract_skill_info(path):
    name = "Unknown"
    description = "Sense descripció"
    lang = "ca" # Default unless english is found
    
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
            
            # Match frontmatter Name
            name_match = re.search(r'^name:\s*"?([^"\n]+)"?', content, re.MULTILINE)
            if not name_match:
                name_match = re.search(r'^#\s*SKILL:\s*(.+)$', content, re.MULTILINE)
                
            if name_match:
                name = name_match.group(1).strip()
            else:
                name = os.path.basename(os.path.dirname(path))
                
            # Match Description
            desc_match = re.search(r'^description:\s*"?([^"\n]+)"?', content, re.MULTILINE)
            if desc_match:
                description = desc_match.group(1).strip()
                
            # Match Lang
            lang_match = re.search(r'^lang:\s*"?([^"\n]+)"?', content, re.MULTILINE)
            if lang_match:
                lang = lang_match.group(1).strip()
            else:
                # Basic heuristic if not explicitly set
                if "Ensures" in description or "Use when" in description or "Performs" in description or "Builds" in description or "Designs" in description:
                    lang = "en"
                    
    except Exception as e:
        print(f"Error reading {path}: {e}")
        
    return name, description, lang

directories = [
    ".agents/skills",
    "_wiki_de_poble/05_Escriptori_Soc_de_Poble/00_Bandeja_d_Entrada/Dola Skills",
    "_wiki_de_poble/05_Escriptori_Soc_de_Poble/00_Bandeja_d_Entrada/Codex Skills/soc-de-poble-skills/.agents/skills",
    "_wiki_de_poble/05_Escriptori_Soc_de_Poble/00_Bandeja_d_Entrada/Claude Skills"
]

inventory = []

for base_dir in directories:
    if not os.path.exists(base_dir):
        continue
        
    # If it's a deep skill directory structure
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if "SKILL.md" in file or "SKILL_" in file or "skill_" in file.lower():
                path = os.path.join(root, file)
                name, desc, lang = extract_skill_info(path)
                
                source = "Sollutia / Fàbrica" if base_dir == ".agents/skills" and lang == "en" else "Actual" if base_dir == ".agents/skills" else base_dir.split('/')[-1]
                if "Dola" in source: source = "Dola"
                if "Codex" in source: source = "Codex"
                if "Claude" in source: source = "Claude"
                
                inventory.append({
                    "name": name,
                    "desc": desc,
                    "lang": lang,
                    "source": source
                })

print("## INVENTARI ACTUAL DE SKILLS (Per a ser Purgat, Fusionat i Organitzat)")
print("Aquest és el llistat complet de totes les skills que l'Agent té actualment al cervell, barrejades amb les noves aportades pel Consell. Tingues en compte que algunes s'encavalquen. L'objectiu és reduir-les i organitzar-les en 5 'lòbuls' clars (cog, sec, arc, dev, core).\n")

# Sort by source then name
inventory.sort(key=lambda x: (x['source'], x['name']))

current_source = None
for item in inventory:
    if current_source != item['source']:
        current_source = item['source']
        print(f"\n### Font: {current_source}")
        
    print(f"- **{item['name']}** [{item['lang'].upper()}]: {item['desc']}")
