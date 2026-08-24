import re

files = ["disseny_pedra_seca.html", "mur_socdepoble.html"]

for filename in files:
    with open(filename, "r") as f:
        content = f.read()

    # Find where to put it
    content = re.sub(
        r'<button class="sdp-m-0 sdp-flex sdp-items-center sdp-p-0 mobile-logo-btn" id="mobile-sidebar-toggle">\s*<img alt="Sóc de Poble" src="https://socdepoble.org/assets/system/ui/logo-socdepoble-rect-blanc.svg"/>\s*</button>',
        r'<img alt="Sóc de Poble" class="mobile-logo-btn" id="mobile-sidebar-toggle" src="https://socdepoble.org/assets/system/ui/logo-socdepoble-rect-blanc.svg" style="cursor: pointer; height: 32px; width: auto;"/>',
        content,
        flags=re.DOTALL
    )
    
    with open(filename, "w") as f:
        f.write(content)

print("Ghost fixed completely")
