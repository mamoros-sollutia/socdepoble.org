import re

files = ["disseny_pedra_seca.html", "mur_socdepoble.html", "mercat_socdepoble.html"]

for filename in files:
    with open(filename, "r") as f:
        content = f.read()

    # Remove the backslash typo
    content = content.replace(r"l\'<em>entradilla", "l'<em>entradilla")

    with open(filename, "w") as f:
        f.write(content)
    print(f"Fixed typo in {filename}")

