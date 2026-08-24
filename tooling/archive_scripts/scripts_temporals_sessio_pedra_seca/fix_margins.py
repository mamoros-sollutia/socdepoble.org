import re

files = ["disseny_pedra_seca.html", "mur_socdepoble.html", "mercat_socdepoble.html"]

for filename in files:
    with open(filename, "r") as f:
        content = f.read()

    # Remove margin-left: auto; margin-right: auto; from section.design-block
    pattern = r'section\.design-block > p,\nsection\.design-block > \.lead,\nsection\.design-block > ul,\nsection\.design-block > ol,\nsection\.design-block > blockquote \{\n  margin-left: auto;\n  margin-right: auto;\n\}\n'
    content = re.sub(pattern, '', content)

    with open(filename, "w") as f:
        f.write(content)
    print(f"Fixed {filename}")

