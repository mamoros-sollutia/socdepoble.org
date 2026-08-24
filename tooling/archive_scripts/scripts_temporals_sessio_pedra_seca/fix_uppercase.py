import re

files = ["disseny_pedra_seca.html", "mur_socdepoble.html", "mercat_socdepoble.html"]

for filename in files:
    with open(filename, "r") as f:
        content = f.read()

    # Find .sidebar-control-btn CSS and add text-transform
    content = content.replace(".sidebar-control-btn {\n  display: flex;", ".sidebar-control-btn {\n  display: flex;\n  text-transform: uppercase;")

    with open(filename, "w") as f:
        f.write(content)
    print(f"Added uppercase to {filename}")

