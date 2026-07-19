import os
import yaml

canonical_tags = ['arquitectura', 'auditoria', 'termodinamica', 'petorreta', 'sistema', 'sollutia', 'soci', 'consell-ia', 'acta', 'destillacio']

for root, dirs, files in os.walk('_wiki_de_poble'):
    for f in files:
        if f.endswith('.md'):
            path = os.path.join(root, f)
            with open(path, 'r') as file:
                content = file.read()
            
            if '[[' not in content and f != '00_index.md':
                if content.strip():
                    content += "\n\n**Ancoratge de Seguretat:** [[00_index]]\n"
                
            if content.startswith('---\n'):
                parts = content.split('---\n', 2)
                if len(parts) >= 3:
                    try:
                        fm = yaml.safe_load(parts[1])
                        if not isinstance(fm, dict):
                            fm = {}
                        
                        tags = set()
                        for key in ['tags', 'categoria', 'temes', 'Categoria', 'Etiquetes', 'Tags', 'Temes']:
                            if key in fm:
                                val = fm.pop(key)
                                if isinstance(val, list):
                                    for v in val: tags.add(str(v).lower())
                                elif isinstance(val, str):
                                    tags.add(val.lower())
                        
                        new_tags = set()
                        for t in tags:
                            if t in canonical_tags:
                                new_tags.add(t)
                            elif 'sollutia' in t or 'root' in t:
                                new_tags.add('sollutia')
                            elif 'text' in t or 'acta' in t:
                                new_tags.add('acta')
                            elif 'mapadeltresor' in t or 'offlinefirst' in t or 'graf' in t:
                                new_tags.add('arquitectura')
                            elif 'socdepoble' in t:
                                new_tags.add('sistema')
                            
                        if not new_tags:
                            tipus = fm.get('tipus', '')
                            if tipus == 'acta': new_tags.add('acta')
                            elif tipus == 'skill': new_tags.add('sistema')
                            elif tipus == 'document': new_tags.add('sistema')
                            elif tipus in ['petorreta', 'prompt']: new_tags.add('petorreta')
                            elif tipus == 'informe': new_tags.add('auditoria')
                            else: new_tags.add('sistema')

                        fm['temes'] = sorted(list(new_tags))
                        
                        new_fm = ""
                        for k, v in fm.items():
                            if k == 'description':
                                v = str(v).replace('\n', ' ').replace('"', "'")
                                new_fm += f'{k}: "{v}"\n'
                            elif isinstance(v, list):
                                new_fm += f'{k}: {str(v).replace("\'", "\"")}\n'
                            elif isinstance(v, str):
                                new_fm += f'{k}: "{v}"\n'
                            else:
                                new_fm += f'{k}: {v}\n'
                        
                        content = '---\n' + new_fm + '---\n' + parts[2]
                    except Exception as e:
                        print(f"Error parsing {path}: {e}")
            
            with open(path, 'w') as file:
                file.write(content)
