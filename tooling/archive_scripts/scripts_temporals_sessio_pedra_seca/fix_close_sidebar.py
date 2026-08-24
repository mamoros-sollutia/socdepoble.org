import re

files = ["disseny_pedra_seca.html", "mur_socdepoble.html", "mercat_socdepoble.html"]

for filename in files:
    with open(filename, "r") as f:
        content = f.read()

    # Change transform from 100% to -100% in closeSidebar
    content = content.replace("tocSidebar.style.transform = 'translateX(100%)';", "tocSidebar.style.transform = 'translateX(-100%)';")

    with open(filename, "w") as f:
        f.write(content)
    print(f"Fixed closeSidebar slide direction in {filename}")

