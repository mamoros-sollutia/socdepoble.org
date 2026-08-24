import re

filename = "mur_socdepoble.html"

with open(filename, "r") as f:
    content = f.read()

# 1. Remove hero image
content = re.sub(r'<!-- IMATGE HERO \(Entre Blava i Taronja\) -->\s*<div class="hero-image">\s*<img alt="Construcció de Pedra Seca estil Ibáñez"[^>]+>\s*</div>', '', content)

# 2. Update CSS for grid to ensure 3 columns on large screens
# In disseny_pedra_seca.html and mur_socdepoble.html, I should probably update both.
with open(filename, "w") as f:
    f.write(content)

print("Hero image removed from Mur")
