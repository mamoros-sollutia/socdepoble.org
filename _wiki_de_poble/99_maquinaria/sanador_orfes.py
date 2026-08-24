#!/usr/bin/env python3
import os
import re

# Rutes base
WIKI_DIR = '_wiki_de_poble'
INDEX_FILE = os.path.join(WIKI_DIR, '00_INDEX.md') # O on es vulga bolcar la quarantena

def get_all_files(base_dir):
    all_files = []
    for root, dirs, files in os.walk(base_dir):
        # Excloure carpetes ocultes i node_modules
        dirs[:] = [d for d in dirs if not d.startswith('.') and d != 'node_modules']
        for file in files:
            if not file.startswith('.'):
                all_files.append(os.path.join(root, file))
    return all_files

def extract_links_from_md(filepath):
    links = set()
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            # Enllaços Obsidian [[Document]] o [[Document|Alias]]
            obsidian_links = re.findall(r'\[\[(.*?)\]\]', content)
            for link in obsidian_links:
                target = link.split('|')[0].split('#')[0].strip()
                links.add(target.lower())
            
            # Enllaços Markdown [Text](ruta/al/document.ext)
            md_links = re.findall(r'\[.*?\]\((.*?)\)', content)
            for link in md_links:
                target = os.path.basename(link).split('#')[0].split('?')[0].strip()
                links.add(target.lower())
    except Exception as e:
        print(f"Error llegint {filepath}: {e}")
    return links

def main():
    print("🤖 Iniciant sanació de graf (Cerca d'orfes i satèl·lits)...")
    
    all_files = get_all_files(WIKI_DIR)
    all_links = set()
    md_files = [f for f in all_files if f.endswith('.md')]
    
    for md in md_files:
        all_links.update(extract_links_from_md(md))
        
    orphans_by_ext = {}
    
    for filepath in all_files:
        basename = os.path.basename(filepath)
        name_no_ext, ext = os.path.splitext(basename)
        
        # Ignorar els propis índexs i arxius del sistema
        if 'index' in name_no_ext.lower() or ext.lower() in ['.png', '.jpg', '.jpeg', '.gif', '.svg']:
            continue
            
        # Un fitxer està enllaçat si el seu nom (amb o sense extensió) està als enllaços
        if basename.lower() not in all_links and name_no_ext.lower() not in all_links:
            ext_key = ext.lower() if ext else 'sense_extensio'
            if ext_key not in orphans_by_ext:
                orphans_by_ext[ext_key] = []
            orphans_by_ext[ext_key].append(filepath)
            
    total_orphans = sum(len(files) for files in orphans_by_ext.values())
    print(f"S'han trobat {total_orphans} arxius orfes.")
    
    if total_orphans == 0:
        print("✅ Graf perfectament connectat. No cal sanació.")
        return

    # Bolcar orfes a l'índex per forçar la connexió al graf
    index_path = os.path.join(WIKI_DIR, '90_arxiu_historic', '00_INDEX_ARXIU.md')
    
    # Assegurar que l'índex existeix
    if not os.path.exists(index_path):
        os.makedirs(os.path.dirname(index_path), exist_ok=True)
        with open(index_path, 'w', encoding='utf-8') as f:
            f.write("# 00_INDEX_ARXIU\n\n")

    with open(index_path, 'a', encoding='utf-8') as f:
        f.write("\n\n## 🏥 Sanació Automàtica (Arxius Recuperats)\n")
        f.write("> Aquests arxius eren satèl·lits desconnectats del graf. S'han afegit aquí per mantenir la cohesió.\n\n")
        
        for ext, files in orphans_by_ext.items():
            f.write(f"### Tipus: {ext.upper()}\n")
            for filepath in files:
                # Per a Obsidian, enllaçar el basename és suficient si els noms són únics, 
                # però per arxius no-md o rutes exactes, podem usar el basename
                basename = os.path.basename(filepath)
                f.write(f"- [[{basename}]]\n")
            f.write("\n")
            
    print(f"✅ Sanació completada. Els {total_orphans} orfes han estat connectats a {index_path}.")

if __name__ == "__main__":
    main()
