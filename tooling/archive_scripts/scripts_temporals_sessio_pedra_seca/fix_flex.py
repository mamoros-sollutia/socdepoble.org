import re

files = ["disseny_pedra_seca.html", "mur_socdepoble.html"]

for filename in files:
    with open(filename, "r") as f:
        content = f.read()

    # 1. Update bar-orange
    content = content.replace(
        "display: grid;\n  grid-template-columns: 1fr auto 1fr;",
        "display: flex;\n  justify-content: space-between;"
    )

    # Update any single-line ones
    content = content.replace("display: grid; \n  grid-template-columns: 1fr auto 1fr;", "display: flex; justify-content: space-between;")
    content = content.replace("display: grid; grid-template-columns: 1fr auto 1fr;", "display: flex; justify-content: space-between;")
    
    # 2. Remove grid-column placement rules for these elements
    content = re.sub(r'/\* \.bar-orange & \.sp-card-header have 2 elements.*?\*/\n', '', content, flags=re.DOTALL)
    content = re.sub(r'section\.bar-orange > \*:first-child, \.sp-card-header > \*:first-child \{ grid-column: 1; justify-self: start; \}\n', '', content)
    content = re.sub(r'section\.bar-orange > \*:last-child, \.sp-card-header > \*:last-child \{ grid-column: 3; justify-self: end; \}\n', '', content)
    content = re.sub(r'/\* \.sp-card-footer has 2 elements.*?\*/\n', '', content, flags=re.DOTALL)
    content = re.sub(r'\.sp-card-footer > \*:first-child \{ grid-column: 1; justify-self: start; \}\n', '', content)
    content = re.sub(r'\.sp-card-footer > \*:last-child \{ grid-column: 3; justify-self: end; \}\n', '', content)

    with open(filename, "w") as f:
        f.write(content)

print("Flexbox layout fixed.")
