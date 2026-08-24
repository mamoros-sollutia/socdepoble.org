import re

files = ['src/html/disseny.html', 'src/html/mercat.html', 'src/html/mur.html']

for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()
        
    # Fix the footer icons
    # The first icon in .sp-card-action should be #icon-6 (Traduir)
    # The second should be #icon-7 (Comentar)
    # The third should be #icon-8 (Compartir)
    
    # Let's replace the whole sp-card-actions block with a standardized one
    pattern = re.compile(r'<div class="sp-card-actions">.*?</div>', re.DOTALL)
    
    standard_actions = """<div class="sp-card-actions">
<button class="sp-card-action" title="Traduir">
<svg class="icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24"><use href="#icon-6"></use></svg>
</button>
<button class="sp-card-action" title="Comentar (Xat Privat)">
<svg class="icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24"><use href="#icon-7"></use></svg>
</button>
<button class="sp-card-action" title="Compartir">
<svg class="icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24"><use href="#icon-8"></use></svg>
</button>
</div>"""

    content = pattern.sub(standard_actions, content)
    
    # Fix the pin icon in the header (btn-icon-orange)
    # It should always be #icon-9
    pin_pattern = re.compile(r'(<button class="btn-icon-orange" title="Ancorar"[^>]*>\s*<svg class="icon" viewBox="0 0 24 24"><use href="#icon-)\d+("></use></svg>\s*</button>)')
    content = pin_pattern.sub(r'\g<1>9\g<2>', content)
    
    # Wait, some might not have viewBox capitalized or might have other differences.
    # Let's just do a simpler replacement for the pin icon inside btn-icon-orange
    pin_pattern_2 = re.compile(r'(<button class="btn-icon-orange"[^>]*>.*?<use href="#icon-)\d+("></use></svg>.*?</button>)', re.DOTALL)
    content = pin_pattern_2.sub(r'\g<1>9\g<2>', content)
    
    with open(filepath, 'w') as f:
        f.write(content)

print("Icons standardized!")
