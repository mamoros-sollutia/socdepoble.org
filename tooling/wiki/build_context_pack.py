#!/usr/bin/env python3
import os
import sys

def build_context_pack(input_dir, output_file):
    print(f"Building Context Pack from {input_dir} into {output_file}...")
    
    with open(output_file, 'w', encoding='utf-8') as out_f:
        out_f.write("# BUNDLE DE CONTEXT I AUDITORIA GLOBAL\n\n")
        out_f.write("Aquest document conté la concatenació de múltiples fitxers de context.\n")
        out_f.write("Si us plau, utilitza aquest bundle per a auditories forenses del Consell.\n\n")
        
        for root, _, files in os.walk(input_dir):
            if '.git' in root or 'node_modules' in root:
                continue
            for file in sorted(files):
                if file.endswith('.md'):
                    filepath = os.path.join(root, file)
                    relpath = os.path.relpath(filepath, input_dir)
                    out_f.write(f"\n\n{'='*80}\n")
                    out_f.write(f"### FITXER: {relpath}\n")
                    out_f.write(f"{'='*80}\n\n")
                    try:
                        with open(filepath, 'r', encoding='utf-8') as in_f:
                            out_f.write(in_f.read())
                    except Exception as e:
                        out_f.write(f"[Error llegint l'arxiu: {e}]\n")
    print(f"Context Pack build successful! ({os.path.getsize(output_file)} bytes)")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Build Context Pack per al Consell")
    parser.add_argument('input_dir', default='.', nargs='?', help='Directori a escanejar')
    parser.add_argument('--out', default='BUNDLE_PETORRETA_INTERNACIONAL.md', help='Arxiu d\'eixida')
    
    args = parser.parse_args()
    build_context_pack(args.input_dir, args.out)
