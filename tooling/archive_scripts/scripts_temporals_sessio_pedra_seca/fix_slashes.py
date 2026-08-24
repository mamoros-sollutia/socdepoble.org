import re

files = ["disseny_pedra_seca.html", "mur_socdepoble.html", "mercat_socdepoble.html"]

for filename in files:
    with open(filename, "r") as f:
        content = f.read()

    # Replace backslash + apostrophe with just apostrophe
    content = content.replace(r"d\'un", "d'un")
    content = content.replace(r"d\'aquest", "d'aquest")
    content = content.replace(r"L\'H2", "L'H2")
    content = content.replace(r"l\'estàndard", "l'estàndard")
    content = content.replace(r"d\'este", "d'este")
    content = content.replace(r"l\'entradilla", "l'entradilla")

    with open(filename, "w") as f:
        f.write(content)
    print(f"Fixed slashes in {filename}")

