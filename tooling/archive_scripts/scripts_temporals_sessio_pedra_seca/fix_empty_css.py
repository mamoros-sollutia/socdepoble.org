import os
import re

files = ["disseny_pedra_seca.html", "mur_socdepoble.html", "mercat_socdepoble.html"]

target_pattern = r"section\.design-block > h1,[\s\n]*section\.design-block > h2,[\s\n]*section\.design-block > h3,[\s\n]*section\.design-block > h4,[\s\n]*section\.design-block > h5,[\s\n]*section\.design-block > h6,[\s\n]*section\.design-block > p,[\s\n]*section\.design-block > \.lead,[\s\n]*section\.design-block > ul,[\s\n]*section\.design-block > ol,[\s\n]*section\.design-block > blockquote \{\s*\}"

for f_name in files:
    if not os.path.exists(f_name): continue
    with open(f_name, "r") as f:
        content = f.read()
    
    new_content = re.sub(target_pattern, "", content)
    
    if new_content != content:
        with open(f_name, "w") as f:
            f.write(new_content)
        print(f"Fixed {f_name}")

