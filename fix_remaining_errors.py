import os
import yaml
import re

# Fix READMEs
readmes = ['AGENTS.md', 'README.md', 'src/config/README.md', 'src/sections/detail/README.md', 'src/sections/README.md', 'supabase/README.md']
for r in readmes:
    if not os.path.exists(r): continue
    with open(r, 'r') as f:
        content = f.read()
    if not content.startswith('---\n'):
        fm = '---\nestat: "canonic"\ntipus: "document"\ndescription: "Documentació canònica de Sóc de Poble."\n---\n'
        with open(r, 'w') as f:
            f.write(fm + content)

# Fix tipus errors
def replace_frontmatter(path, old_tipus, new_tipus):
    if not os.path.exists(path): return
    with open(path, 'r') as f:
        c = f.read()
    c = c.replace(f'tipus: "{old_tipus}"', f'tipus: "{new_tipus}"')
    # fallback for no quotes
    c = c.replace(f'tipus: {old_tipus}', f'tipus: {new_tipus}')
    with open(path, 'w') as f:
        f.write(c)

replace_frontmatter('_wiki_de_poble/05_Escriptori_Soc_de_Poble/260719_0345_PROMPT_Auditoria_Suprema_Consell.md', 'petorreta', 'prompt')
replace_frontmatter('_wiki_de_poble/05_Escriptori_Soc_de_Poble/260719_0415_ACTA_SESSIO_La_Gran_Destillacio.md', 'sessio', 'acta')
replace_frontmatter('_wiki_de_poble/05_Escriptori_Soc_de_Poble/Claude/260719_0630_AUDITORIA_Fuita_Bancaria_Nucli_Mort_I_Constitucio_Triple_Trencada.md', 'acta', 'informe')

# Truncate descriptions in Sollutia folder
sollutia_dir = '_wiki_de_poble/00_SER_Brain_Identitat/Sollutia'
if os.path.exists(sollutia_dir):
    for f in os.listdir(sollutia_dir):
        if not f.endswith('.md'): continue
        path = os.path.join(sollutia_dir, f)
        with open(path, 'r') as file:
            content = file.read()
        
        if content.startswith('---\n'):
            parts = content.split('---\n', 2)
            if len(parts) >= 3:
                fm_str = parts[1]
                try:
                    fm = yaml.safe_load(fm_str)
                    if 'description' in fm and len(fm['description']) > 130:
                        fm['description'] = fm['description'][:130] + "..."
                        new_fm = yaml.dump(fm, sort_keys=False, allow_unicode=True)
                        with open(path, 'w') as fw:
                            fw.write('---\n' + new_fm + '---\n' + parts[2])
                except Exception as e:
                    pass

print("Done fixing")
