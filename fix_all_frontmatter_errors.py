import os
import yaml

def fix_file(path):
    if not os.path.exists(path): return
    with open(path, 'r') as f:
        content = f.read()
    
    if content.startswith('---\n'):
        parts = content.split('---\n', 2)
        if len(parts) >= 3:
            try:
                fm = yaml.safe_load(parts[1])
                changed = False
                if 'description' in fm and len(fm['description']) > 130:
                    fm['description'] = fm['description'][:130] + "..."
                    changed = True
                if 'tipus' in fm:
                    if fm['tipus'] == 'petorreta':
                        fm['tipus'] = 'prompt'
                        changed = True
                    elif fm['tipus'] == 'sessio':
                        fm['tipus'] = 'acta'
                        changed = True
                    elif fm['tipus'] == 'acta' and 'AUDITORIA' in path:
                        fm['tipus'] = 'informe'
                        changed = True
                if os.path.basename(path) == 'README.md' and fm.get('tipus') != 'index':
                    fm['tipus'] = 'index'
                    changed = True
                if changed:
                    new_fm = yaml.dump(fm, sort_keys=False, allow_unicode=True)
                    with open(path, 'w') as f:
                        f.write('---\n' + new_fm + '---\n' + parts[2])
                    print(f"Fixed {path}")
            except:
                pass

for root, dirs, files in os.walk('_wiki_de_poble'):
    for f in files:
        if f.endswith('.md'):
            fix_file(os.path.join(root, f))
