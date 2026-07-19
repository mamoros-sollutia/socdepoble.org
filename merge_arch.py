import os

files = [
    '_wiki_de_poble/04_ARXIU_Documents_Historics/actes_historiques/Arquitectura_Directives.md',
    '_wiki_de_poble/04_ARXIU_Documents_Historics/actes_historiques/Arquitectura_Etnografia.md',
    '_wiki_de_poble/04_ARXIU_Documents_Historics/actes_historiques/Arquitectura_General.md',
    '_wiki_de_poble/04_ARXIU_Documents_Historics/actes_historiques/Arquitectura_Gestio.md',
    '_wiki_de_poble/04_ARXIU_Documents_Historics/actes_historiques/Arquitectura_Skills_Arrel.md',
    '_wiki_de_poble/04_ARXIU_Documents_Historics/actes_arxivades/Arquitectura_Identitat.md'
]

merged_content = """---
estat: "arxivat"
tipus: "acta"
description: "Consolidació històrica de directives, etnografia i arquitectura de la plataforma Sóc de Poble."
---
# 🪵 ACTA ARQUITECTURA HISTÒRICA CONSOLIDADA

Aquesta acta destil·la els antics fragments arquitectònics i operatius històrics de la IAIA MarIA i la plataforma Sóc de Poble.

"""

for f in files:
    if os.path.exists(f):
        with open(f, 'r') as file:
            content = file.read()
            # Strip existing frontmatter
            if content.startswith('---\n'):
                parts = content.split('---\n', 2)
                if len(parts) >= 3:
                    content = parts[2]
            # Strip the main title if it starts with #
            lines = content.strip().split('\n')
            if lines and lines[0].startswith('# '):
                lines = lines[1:]
            
            merged_content += f"\n\n## [{os.path.basename(f).replace('.md', '')}]\n\n"
            merged_content += '\n'.join(lines).strip() + "\n"

merged_path = '_wiki_de_poble/04_ARXIU_Documents_Historics/actes_historiques/ACTA_Arquitectura_Historica_Consolidada.md'
with open(merged_path, 'w') as f:
    f.write(merged_content.strip() + '\n\n---\n\n**Ancoratge:** [[90_arxiu_historic]]\n')

for f in files:
    if os.path.exists(f):
        os.remove(f)
        print(f"Removed {f}")

print("Merge complete")
