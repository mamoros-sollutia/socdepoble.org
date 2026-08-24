import re

files = ["disseny_pedra_seca.html", "mur_socdepoble.html"]

css_addition = """
.mobile-logo-btn { background: transparent; border: none; min-width: auto; }
.mobile-logo-btn img { height: 32px; width: auto; object-fit: contain; }
"""

for filename in files:
    with open(filename, "r") as f:
        content = f.read()

    # Find where to put it
    content = content.replace('.mobile-logo-btn { display: none !important; }',
                              '.mobile-logo-btn { display: none !important; }' + '\n' + css_addition)
    
    with open(filename, "w") as f:
        f.write(content)

print("Ghost fixed")
