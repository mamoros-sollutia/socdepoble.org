import re

files = ["mur_socdepoble.html", "mercat_socdepoble.html"]

for filename in files:
    with open(filename, "r") as f:
        content = f.read()

    # Fix navigation links
    if filename == "mur_socdepoble.html":
        content = re.sub(r'<a class="nav-item[^"]*" href="[^"]*">Mur</a>', r'<a class="nav-item active" href="mur_socdepoble.html">Mur</a>', content)
        content = re.sub(r'<a class="nav-item[^"]*" href="[^"]*">Mercat</a>', r'<a class="nav-item" href="mercat_socdepoble.html">Mercat</a>', content)
    elif filename == "mercat_socdepoble.html":
        content = re.sub(r'<a class="nav-item[^"]*" href="[^"]*">Mur</a>', r'<a class="nav-item" href="mur_socdepoble.html">Mur</a>', content)
        content = re.sub(r'<a class="nav-item[^"]*" href="[^"]*">Mercat</a>', r'<a class="nav-item active" href="mercat_socdepoble.html">Mercat</a>', content)
    
    with open(filename, "w") as f:
        f.write(content)

print("Nav links fixed.")
