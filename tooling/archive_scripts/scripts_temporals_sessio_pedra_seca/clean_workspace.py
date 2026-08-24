import os
import shutil

scripts_dir = "_wiki_de_poble/90_arxiu_historic/scripts_temporals_sessio_pedra_seca"
os.makedirs(scripts_dir, exist_ok=True)

root_files = os.listdir(".")
for f in root_files:
    if os.path.isfile(f) and (f.endswith(".py") or f.endswith(".mjs")) and f not in ["dola_audit.html"]:
        # Only move files that match standard temporary script names
        if f.startswith("fix_") or f.startswith("clean_") or f.startswith("create_") or f.startswith("make_") or f.startswith("update_") or f.startswith("append_") or f.startswith("really_") or f.startswith("strip_") or f.startswith("replace_") or f.startswith("align_") or f.startswith("get_") or f.startswith("add_") or f.startswith("tweak_") or f.startswith("upgrade_") or f.startswith("inject_"):
            shutil.move(f, os.path.join(scripts_dir, f))
            print(f"Moved {f} to {scripts_dir}")

html_files_to_delete = [
    "_wiki_de_poble/05_Escriptori_Soc_de_Poble/00_Bandeja_d_Entrada/disseny_pedra_seca.html",
    "_wiki_de_poble/05_Escriptori_Soc_de_Poble/00_Bandeja_d_Entrada/files/disseny_pedra_seca.html",
    "_wiki_de_poble/05_Escriptori_Soc_de_Poble/00_Bandeja_d_Entrada/files/disseny_pedra_seca_CORREGIT.html"
]

for html_f in html_files_to_delete:
    if os.path.exists(html_f):
        os.remove(html_f)
        print(f"Deleted {html_f}")
        
# also delete the empty files directory if it is empty
files_dir = "_wiki_de_poble/05_Escriptori_Soc_de_Poble/00_Bandeja_d_Entrada/files"
if os.path.exists(files_dir) and not os.listdir(files_dir):
    os.rmdir(files_dir)
    print(f"Deleted empty dir {files_dir}")

