import os

files_to_fix = [
    '_wiki_de_poble/04_ARXIU_Documents_Historics/actes_arxivades/s6a_documentacio_original_sollutia/DOCUMENTACIO_BASE_DE_DADES.md',
    '_wiki_de_poble/04_ARXIU_Documents_Historics/actes_arxivades/s6a_documentacio_original_sollutia/DOCUMENTACIO_EXEMPLES.md',
    '_wiki_de_poble/04_ARXIU_Documents_Historics/actes_arxivades/s6a_documentacio_original_sollutia/DOCUMENTACIO_PROJECTE.md',
    '_wiki_de_poble/04_ARXIU_Documents_Historics/actes_arxivades/s6a_documentacio_original_sollutia/INSTRUCCIONS_SUPABASE.md',
    '_wiki_de_poble/05_Escriptori_Soc_de_Poble/260715_1624_ACTA_Teixidora_Proposta_Insercio_Enllacos_Interns_Cos_Documents_Canonics.md',
    '_wiki_de_poble/05_Escriptori_Soc_de_Poble/260719_0410_BUNDLE_Sistema_Operatiu_IAIA_MarIA_Complet.md'
]

frontmatter = """---
estat: "arxivat"
tipus: "document"
description: "Documentació heretada o arxiu restaurat."
---
"""

for filepath in files_to_fix:
    if not os.path.exists(filepath): continue
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Check if it already has frontmatter
    if not content.startswith('---'):
        new_content = frontmatter + content
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Fixed frontmatter: {filepath}")

# Delete Identitat.md
identitat_path = '_wiki_de_poble/Identitat.md'
if os.path.exists(identitat_path):
    os.remove(identitat_path)
    print(f"Deleted {identitat_path}")
