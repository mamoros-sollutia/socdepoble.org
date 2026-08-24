import re

files = ["disseny_pedra_seca.html", "mur_socdepoble.html", "mercat_socdepoble.html"]

for filename in files:
    with open(filename, "r") as f:
        content = f.read()

    # Replace "2. Estudi Tipogràfic (Nivell Expert)" with "2. Estudi Tipogràfic"
    content = content.replace("2. Estudi Tipogràfic (Nivell Expert)", "2. Estudi Tipogràfic")

    with open(filename, "w") as f:
        f.write(content)
    print(f"Fixed {filename}")

