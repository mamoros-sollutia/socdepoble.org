import re

with open('src/html/disseny.html', 'r') as f:
    content = f.read()

# Define the standard header
standard_header = """<header class="sp-card-header">
<a class="sp-card-author-link" href="autor.html" title="Anar al perfil de l'autor">
<div class="sp-card-author">
<img alt="Avatar" class="sp-card-avatar sdp-p-0" src="https://socdepoble.org/assets/system/ui/logo-socdepoble-cuadrat-verd.svg"/>
<div class="sp-card-author-info">
<div class="sp-card-author-name">Sóc de Poble</div>
<div class="sp-card-author-location">La Torre de les Maçanes</div>
</div>
</div>
</a>
<div class="sp-card-meta sdp-gap-8">
<button class="btn-icon-orange" title="Ancorar" style="z-index: 3; position: relative;">
<svg class="icon" viewBox="0 0 24 24"><use href="#icon-9"></use></svg>
</button>
<button class="btn-date-time" title="Veure calendari d'este dia" style="z-index: 3; position: relative;">
<span>10:00</span><span>07/8/26</span>
</button>
</div>
</header>"""

# Find the start and end of section 20
start_idx = content.find('<h3>20. Targeta Mestra (Sóc de Poble Universal Card)</h3>')
end_idx = content.find('<!-- SECCIÓ 21: ESTADÍSTIQUES I DASHBOARDS -->')

if start_idx == -1 or end_idx == -1:
    print("Could not find section 20 bounds")
    import sys
    sys.exit(1)

section_content = content[start_idx:end_idx]

# We need to replace headers in each subsection EXCEPT 20.4
# Let's split by "<h4>"
parts = section_content.split('<h4>')
new_parts = [parts[0]]

for part in parts[1:]:
    if '20.4 Targeta Mestra: Persona' in part:
        # Do not modify this part
        new_parts.append(part)
    else:
        # Replace the header block
        # Match <header class="sp-card-header"...>...</header>
        # Because we might have inline styles, use a regex
        part = re.sub(
            r'<header class="sp-card-header".*?</header>', 
            standard_header, 
            part, 
            flags=re.DOTALL
        )
        new_parts.append(part)

new_section_content = '<h4>'.join(new_parts)

new_content = content[:start_idx] + new_section_content + content[end_idx:]

with open('src/html/disseny.html', 'w') as f:
    f.write(new_content)

print("Updated headers")
