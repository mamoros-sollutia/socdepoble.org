#!/usr/bin/env python3
# tooling/brain/build_context_pack.py
# Genera un únic .md comprimit intel·ligentment per a agents (Amnèsia de Resurrecció).

import os
import re

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
WIKI_DIR = os.path.join(ROOT_DIR, '_wiki_de_poble')
OUTPUT_FILE = os.path.join(ROOT_DIR, '.agents', 'sosp_master_context_pack.md')

IMPORTANT_FILES = [
    'package.json',
    'vite.config.js',
    'disseny_pedra_seca.html',
    'src/css/index.css',
    'src/universal/UniversalComponents.jsx',
    '_wiki_de_poble/00_INDEX_MESTRE.md'
]

def read_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception:
        return ""

def compress_markdown(content):
    # Llevant el frontmatter YAML
    content = re.sub(r'^---\n.*?\n---\n', '', content, flags=re.DOTALL)
    # Llevant salts de línia múltiples
    content = re.sub(r'\n{3,}', '\n\n', content)
    # Ací podríem afegir lògica per resumir textos llargs si calguera
    return content.strip()

def build_pack():
    print("⏳ Construint el Context Pack intel·ligent...")
    pack = "# SÓC DE POBLE - CONTEXT PACK CANÒNIC\n\n"
    
    # 1. Inserir fitxers crítics complets (sense compressió severa)
    for rel_path in IMPORTANT_FILES:
        full_path = os.path.join(ROOT_DIR, rel_path)
        if os.path.exists(full_path):
            content = read_file(full_path)
            if rel_path.endswith('.md'):
                content = compress_markdown(content)
            pack += f"## [FILE: {rel_path}]\n```\n{content}\n```\n\n"

    # 2. Afegir resums de la Wiki
    pack += "## RESUMS WIKI\n"
    for root, dirs, files in os.walk(WIKI_DIR):
        # Ignorar carpetes ocultes i arxiu
        dirs[:] = [d for d in dirs if not d.startswith('.') and not d.startswith('9')]
        for file in files:
            if file.endswith('.md') and file != '00_INDEX_MESTRE.md':
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, ROOT_DIR)
                content = read_file(full_path)
                compressed = compress_markdown(content)
                # Prendre només els primers 500 caràcters com a resum
                summary = compressed[:500] + ("..." if len(compressed) > 500 else "")
                pack += f"### {rel_path}\n{summary}\n\n"
                
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(pack)
        
    size_mb = os.path.getsize(OUTPUT_FILE) / (1024 * 1024)
    print(f"✅ Context Pack generat a {OUTPUT_FILE} ({size_mb:.2f} MB)")

if __name__ == "__main__":
    build_pack()
