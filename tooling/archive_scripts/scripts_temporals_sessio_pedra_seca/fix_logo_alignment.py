import re

files = ["disseny_pedra_seca.html", "mur_socdepoble.html", "mercat_socdepoble.html"]

for filename in files:
    with open(filename, "r") as f:
        content = f.read()

    # Find the CSS where body.sidebar-closed .mobile-logo-wrapper is defined
    # Currently it is:
    # body.sidebar-closed .mobile-logo-wrapper {
    #   display: flex !important;
    # }
    
    old_css = r"body\.sidebar-closed \.mobile-logo-wrapper \{\s*display: flex !important;\s*\}"
    new_css = """body.sidebar-closed header.bar-black {
    padding-left: 0 !important;
  }
  body.sidebar-closed .mobile-logo-wrapper {
    display: flex !important;
    width: var(--sdp-col-sidebar);
    height: var(--sdp-alt-negra);
    align-items: center;
    justify-content: center;
  }
  body.sidebar-closed .mobile-logo-wrapper img {
    width: 100% !important;
    max-width: 160px !important;
    height: auto !important;
    object-fit: contain !important;
  }"""
    
    content = re.sub(old_css, new_css, content, flags=re.DOTALL)

    with open(filename, "w") as f:
        f.write(content)
    print(f"Fixed logo alignment in {filename}")

