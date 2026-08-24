import re

files = ["disseny_pedra_seca.html", "mur_socdepoble.html", "mercat_socdepoble.html"]

for filename in files:
    with open(filename, "r") as f:
        content = f.read()

    content = content.replace(
        "display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 0 var(--sdp-space-6);\n  position: sticky;\n  top: var(--sdp-alt-negra);\n  z-index: var(--z-barra-blava);",
        "display: grid;\n  grid-template-columns: 1fr auto 1fr;\n  align-items: center;\n  padding: 0 var(--sdp-space-6);\n  position: sticky;\n  top: var(--sdp-alt-negra);\n  z-index: var(--z-barra-blava);"
    )
    
    with open(filename, "w") as f:
        f.write(content)

print("Bar-blue fixed.")
