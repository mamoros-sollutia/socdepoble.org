import json
import os

with open('audit_report.json', 'r') as f:
    data = json.load(f)

orphans = data.get('graph', {}).get('orphanFiles', [])
if not orphans:
    orphans = []

merged_files = [
    '_wiki_de_poble/04_ARXIU_Documents_Historics/actes_historiques/Arquitectura_Directives.md',
    '_wiki_de_poble/04_ARXIU_Documents_Historics/actes_historiques/Arquitectura_Etnografia.md',
    '_wiki_de_poble/04_ARXIU_Documents_Historics/actes_historiques/Arquitectura_General.md',
    '_wiki_de_poble/04_ARXIU_Documents_Historics/actes_historiques/Arquitectura_Gestio.md',
    '_wiki_de_poble/04_ARXIU_Documents_Historics/actes_historiques/Arquitectura_Skills_Arrel.md',
    '_wiki_de_poble/04_ARXIU_Documents_Historics/actes_arxivades/Arquitectura_Identitat.md'
]

count = 0
for orphan in orphans:
    if orphan in merged_files: continue
    if not os.path.exists(orphan): continue
    
    anchor = '[[00_index]]'
    if '00_SER_Brain_Identitat' in orphan:
        if 'Sollutia' in orphan:
            anchor = '[[Soci_Sollutia]]'
        else:
            anchor = '[[00_INDEX_ARXIU_SECUNDARI]]'
    elif '04_ARXIU_Documents_Historics' in orphan:
        anchor = '[[90_arxiu_historic]]'
    elif '05_Escriptori_Soc_de_Poble' in orphan:
        anchor = '[[00_INDEX_ARXIU_SECUNDARI]]'
    
    with open(orphan, 'a') as f:
        f.write(f'\n\n---\n\n**Ancoratge de Seguretat:** {anchor}\n')
    print(f'Anchored {orphan}')
    count += 1

print(f'Total anchored: {count}')
