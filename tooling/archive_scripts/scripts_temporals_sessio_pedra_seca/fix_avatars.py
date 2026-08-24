import re

files = ["disseny_pedra_seca.html", "mur_socdepoble.html"]

for filename in files:
    with open(filename, "r") as f:
        content = f.read()

    # 1. Add :has(img) to force 48px on the user avatar in the black bar (desktop & general)
    content = content.replace(
        '.bar-black .right-icons .icon img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block; }',
        '.bar-black .right-icons .icon img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block; }\n.bar-black .right-icons .icon:has(img) { width: 48px !important; height: 48px !important; }'
    )
    
    # 2. Fix the mobile override that might squash it (if there is one).
    # Since we added !important, it should override the mobile `.icon { width: 28px; }`.
    
    with open(filename, "w") as f:
        f.write(content)

print("Updated avatars in both files.")
