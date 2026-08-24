import re

files = ["disseny_pedra_seca.html", "mur_socdepoble.html", "mercat_socdepoble.html"]

for filename in files:
    with open(filename, "r") as f:
        content = f.read()

    # 1. Update CSS
    old_css = r'\.sp-card-price \{ position: absolute; top: 20px; right: 24px; font-size: 1\.2rem; font-weight: 800; color: var\(--sdp-secondary-500\); background: var\(--sdp-secondary-50\); padding: 4px 12px; border-radius: var\(--sdp-radi-pastilla\); white-space: nowrap; \}'
    new_css = r'.sp-card-price { float: right; margin-left: 6px; margin-bottom: 6px; font-size: 1.2rem; font-weight: 800; color: var(--sdp-secondary-500); background: var(--sdp-secondary-50); padding: 4px 12px; border-radius: var(--sdp-radi-pastilla); white-space: nowrap; }'
    content = re.sub(old_css, new_css, content)

    # 2. Swap HTML
    # We want to change:
    # <h1>TITLE</h1>
    # <div class="sp-card-price">PRICE</div>
    # to:
    # <div class="sp-card-price">PRICE</div>
    # <h1>TITLE</h1>
    # This might happen multiple times.
    old_html = r'(<h1[^>]*>.*?</h1>)\n\s*(<div class="sp-card-price">.*?</div>)'
    new_html = r'\2\n\1'
    content = re.sub(old_html, new_html, content)

    with open(filename, "w") as f:
        f.write(content)
    print(f"Fixed card price in {filename}")

