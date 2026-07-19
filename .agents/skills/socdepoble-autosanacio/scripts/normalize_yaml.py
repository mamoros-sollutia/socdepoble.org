import os
import re
import yaml

wiki_dir = "_wiki_de_poble"

for root, dirs, files in os.walk(wiki_dir):
    if "04_ARXIU_Documents_Historics" in root or ".obsidian" in root:
        continue
    
    categoria = "arxiu"
    if "00_SER" in root: categoria = "identitat"
    elif "01_SABER" in root: categoria = "coneixement"
    elif "02_ACTUAR" in root: categoria = "sistema"
    elif "03_GOVERNAR" in root: categoria = "normativa"
    elif "05_Escriptori" in root: categoria = "arxiu"
        
    for file in files:
        if file.endswith(".md"):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            match = re.match(r'^---\n(.*?)\n---(.*)', content, re.DOTALL)
            if match:
                fm_text = match.group(1)
                body = match.group(2)
                try:
                    data = yaml.safe_load(fm_text)
                    if not isinstance(data, dict): data = {}
                except:
                    data = {}
            else:
                data = {}
                body = "\n" + content
            
            estat = data.get('estat', 'esborrany')
            if estat == 'arxivat': estat = 'històric'
            elif estat == 'futur': estat = 'esborrany'
            if estat not in ['canonic', 'esborrany', 'històric']: estat = 'esborrany'
                
            tags = data.get('tags', [])
            if isinstance(tags, str): tags = [tags]
            if not isinstance(tags, list): tags = []
            
            tipus = data.get('tipus', 'document')
            desc = data.get('description', '')
            
            new_data = {
                'estat': estat,
                'categoria': categoria,
                'tipus': tipus,
                'tags': tags
            }
            if desc: new_data['description'] = desc
                
            new_fm = yaml.dump(new_data, allow_unicode=True, default_flow_style=False, sort_keys=False)
            new_content = f"---\n{new_fm}---\n{body.lstrip()}"
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
                
print("YAML Normalitzat correctament a tots els documents actius.")
