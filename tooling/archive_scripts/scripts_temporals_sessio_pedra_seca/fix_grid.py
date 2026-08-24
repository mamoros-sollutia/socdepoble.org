import re

files = ["disseny_pedra_seca.html", "mur_socdepoble.html"]

grid_old = ".sdp-card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--sdp-space-6); align-items: start; }"
grid_new = """
.sdp-card-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--sdp-space-6); align-items: start; }
@media (max-width: 1400px) { .sdp-card-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 800px) { .sdp-card-grid { grid-template-columns: 1fr; } }
"""

for filename in files:
    with open(filename, "r") as f:
        content = f.read()

    content = content.replace(grid_old, grid_new.strip())
    
    with open(filename, "w") as f:
        f.write(content)

print("Grid updated")
