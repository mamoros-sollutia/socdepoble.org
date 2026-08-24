import re

file_path = "disseny_pedra_seca.html"
with open(file_path, "r", encoding="utf-8") as f:
    html = f.read()

# 1. Update CSS colors: Swap H3 (now Orange) and H4 (now Blue)
html = html.replace('.cms-preview h3 { color: var(--sp-blue);', '.cms-preview h3 { color: var(--sp-orange);')
html = html.replace('.cms-preview h4 { color: var(--sp-orange);', '.cms-preview h4 { color: var(--sp-blue);')
html = html.replace('section.design-block h2 {', 'section.design-block h2, section.design-block h3 {')

# 2. To avoid collisions, do this in reverse order!
# First: old H6 -> H6 (leave alone or change if we had H5)
# Let's just do H4 -> H5, H3 -> H4, H2 -> H3.
# Let's only do it inside the <article class="content-wrapper">
start_idx = html.find('<article class="content-wrapper">')
if start_idx != -1:
    before = html[:start_idx]
    content = html[start_idx:]
    
    # Save the new subtitle we just added so it doesn't get shifted to H3
    subtitle_token = "[[SUBTITLE_TOKEN]]"
    content = content.replace('<h2 style="color: var(--sp-blue); font-size: clamp(1.4rem, 3vw, 1.8rem); font-weight: 800; text-transform: none; text-align: center; margin-bottom: 16px;">Sistema oficial de disseny per a Sóc de Poble.</h2>', subtitle_token)
    
    # Shift H5 -> H6
    content = content.replace('<h5', '<h6').replace('</h5', '</h6')
    # Shift H4 -> H5
    content = content.replace('<h4', '<h5').replace('</h4', '</h5')
    # Shift H3 -> H4
    content = content.replace('<h3', '<h4').replace('</h3', '</h4')
    # Shift H2 -> H3
    content = content.replace('<h2', '<h3').replace('</h2', '</h3')
    
    # Restore subtitle
    content = content.replace(subtitle_token, '<h2 style="color: var(--sp-blue); font-size: clamp(1.4rem, 3vw, 1.8rem); font-weight: 800; text-transform: none; text-align: center; margin-bottom: 16px;">Sistema oficial de disseny per a Sóc de Poble.</h2>')
    
    # Wait! The card title in 24.4 was an H3. Now it became an H4!
    # Card title: <h4 class="sp-card-title uppercase">Disseny Pedra Seca</h4>
    # That is totally fine, it's inside a card. Or we can revert it to H3.
    content = content.replace('<h4 class="sp-card-title', '<h3 class="sp-card-title')
    content = content.replace('Disseny Pedra Seca</h4>', 'Disseny Pedra Seca</h3>') # just for the card 24.4
    
    html = before + content

with open(file_path, "w", encoding="utf-8") as f:
    f.write(html)
print("Updated hierarchy")
