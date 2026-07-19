import os
import yaml

files_with_yaml_errors = [
    "_wiki_de_poble/00_SER_Brain_Identitat/00_AGENTS_I_SKILLS_MIRROR/README.md",
    "_wiki_de_poble/00_SER_Brain_Identitat/antigravity.md",
    "_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/a11y_debugging.md",
    "_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/chrome_devtools.md",
    "_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/chrome_extensions.md",
    "_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/debug_optimize_lcp.md",
    "_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/google_antigravity_sdk.md",
    "_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/memory_leak_debugging.md",
    "_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/modern_web_guidance.md",
    "_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/troubleshooting.md",
    "_wiki_de_poble/03_GOVERNAR_Normativa_Regles/agents_actius/README.md",
    "_wiki_de_poble/04_ARXIU_Documents_Historics/actes_arxivades/00_informes/informe_sollutia_v1.md",
    "_wiki_de_poble/04_ARXIU_Documents_Historics/actes_arxivades/260707_0105_AUDITORIA_Estructural_Destructiva.md",
    "_wiki_de_poble/04_ARXIU_Documents_Historics/actes_arxivades/260707_0645_ACTA_UNICA_Victoria_Estructural.md",
    "_wiki_de_poble/04_ARXIU_Documents_Historics/actes_arxivades/260709_0930_ACTA_UNICA_Recopilacio_Auditoria_Final.md"
]

for p in files_with_yaml_errors:
    if not os.path.exists(p): continue
    with open(p, 'r') as f:
        c = f.read()
    
    if c.startswith('---\n'):
        parts = c.split('---\n', 2)
        try:
            parsed = yaml.safe_load(parts[1])
            new_fm = ""
            for k, v in parsed.items():
                if k == 'description':
                    v = str(v).replace('\n', ' ').replace('"', "'")
                    new_fm += f'{k}: "{v}"\n'
                elif isinstance(v, list):
                    new_fm += f'{k}: {str(v).replace("\'", "\"")}\n'
                else:
                    new_fm += f'{k}: "{v}"\n'
            with open(p, 'w') as f:
                f.write('---\n' + new_fm + '---\n' + parts[2])
        except Exception as e:
            pass

def rep(p, old, new):
    if not os.path.exists(p): return
    with open(p, 'r') as f:
        c = f.read()
    c = c.replace(f'tipus: {old}', f'tipus: {new}').replace(f'tipus: "{old}"', f'tipus: "{new}"')
    with open(p, 'w') as f:
        f.write(c)

rep('_wiki_de_poble/04_ARXIU_Documents_Historics/prompts/petorreta_appshell_alcoi.md', 'prompt', 'petorreta')
rep('_wiki_de_poble/05_Escriptori_Soc_de_Poble/260715_1624_ACTA_Teixidora_Proposta_Insercio_Enllacos_Interns_Cos_Documents_Canonics.md', 'document', 'acta')
