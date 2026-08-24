import re

files = ["disseny_pedra_seca.html", "mur_socdepoble.html", "mercat_socdepoble.html"]

for filename in files:
    with open(filename, "r") as f:
        content = f.read()

    # Change position to left
    content = content.replace("right: 0; width: 340px;", "left: 0; width: 340px;")
    
    # Change transform from 100% to -100%
    content = content.replace("transform: translateX(100%);", "transform: translateX(-100%);")
    
    # Change box shadow direction
    content = content.replace("box-shadow: -4px 0 24px", "box-shadow: 4px 0 24px")

    with open(filename, "w") as f:
        f.write(content)
    print(f"Updated TOC to slide from left in {filename}")

