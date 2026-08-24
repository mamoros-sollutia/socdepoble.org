import re

files = ["disseny_pedra_seca.html", "mur_socdepoble.html", "mercat_socdepoble.html"]

for filename in files:
    with open(filename, "r") as f:
        content = f.read()

    # 1. HTML: Update mobile-logo-wrapper to have the ID, and make img clean
    old_html = r'<div class="mobile-logo-wrapper sdp-flex sdp-items-center sdp-justify-center">\s*<img alt="Sóc de Poble" class="mobile-logo-btn" id="mobile-sidebar-toggle" src="https://socdepoble.org/assets/system/ui/logo-socdepoble-rect-blanc.svg"[^>]*>\s*</div>'
    new_html = r'''<div class="mobile-logo-wrapper sdp-flex sdp-items-center sdp-justify-center" id="mobile-sidebar-toggle">
<img alt="Sóc de Poble" src="https://socdepoble.org/assets/system/ui/logo-socdepoble-rect-blanc.svg" />
</div>'''
    content = re.sub(old_html, new_html, content, flags=re.DOTALL)
    
    # 2. CSS: Replace .mobile-logo-btn logic with .mobile-logo-wrapper logic
    content = re.sub(r'/\* Botó logo/hamburguesa: només visible en mòbil \(obri la sidebar\) \*/\s*\.mobile-logo-btn \{ display: none !important; \}\s*\.mobile-logo-btn \{ background: transparent; border: none; min-width: auto; \}\s*\.mobile-logo-btn img \{ height: 32px; width: auto; object-fit: contain; \}',
        r'/* Botó logo: només visible en mòbil (obri la sidebar) o en escriptori tancat */\n.mobile-logo-wrapper { display: none !important; cursor: pointer; }\n.mobile-logo-wrapper img { height: 32px; width: auto; object-fit: contain; }',
        content, flags=re.DOTALL)
        
    content = re.sub(r'/\* El logo actua com a botó \(sense hamburguesa addicional\) \*/\s*\.mobile-logo-btn \{ display: flex !important; \}',
        r'/* El logo actua com a botó (sense hamburguesa addicional) */\n  .mobile-logo-wrapper { display: flex !important; }',
        content, flags=re.DOTALL)
        
    content = re.sub(r'body\.sidebar-closed \.mobile-logo-btn \{\s*display: flex !important;\s*\}',
        r'body.sidebar-closed .mobile-logo-wrapper {\n    display: flex !important;\n  }',
        content, flags=re.DOTALL)

    with open(filename, "w") as f:
        f.write(content)
    print(f"Fixed logo logic in {filename}")

