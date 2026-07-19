import os
import yaml

readmes = ['README.md', 'src/config/README.md', 'src/sections/detail/README.md', 'src/sections/README.md', 'supabase/README.md']
for r in readmes:
    if not os.path.exists(r): continue
    with open(r, 'r') as f:
        c = f.read()
    c = c.replace('tipus: "document"', 'tipus: "index"').replace('tipus: document', 'tipus: "index"')
    with open(r, 'w') as f:
        f.write(c)

sollutia_dir = '_wiki_de_poble/00_SER_Brain_Identitat/Sollutia'
if os.path.exists(sollutia_dir):
    for f in os.listdir(sollutia_dir):
        if not f.endswith('.md'): continue
        path = os.path.join(sollutia_dir, f)
        with open(path, 'r') as file:
            c = file.read()
        if c.startswith('---\n'):
            parts = c.split('---\n', 2)
            try:
                fm = yaml.safe_load(parts[1])
                fm['estat'] = 'canonic'
                fm['tipus'] = 'skill'
                if 'name' in fm: del fm['name']
                if 'autor' in fm: del fm['autor']
                new_fm = ""
                for k, v in fm.items():
                    if k == 'description':
                        v = str(v).replace('\n', ' ').replace('"', "'")
                        new_fm += f'{k}: "{v}"\n'
                    elif isinstance(v, list):
                        new_fm += f'{k}: {str(v).replace("\'", "\"")}\n'
                    else:
                        new_fm += f'{k}: "{v}"\n'
                with open(path, 'w') as fw:
                    fw.write('---\n' + new_fm + '---\n' + parts[2])
            except Exception as e:
                pass
