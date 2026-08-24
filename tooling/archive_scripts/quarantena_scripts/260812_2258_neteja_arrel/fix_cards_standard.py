import re

with open('src/sections/disseny/DesignSection.jsx', 'r') as f:
    content = f.read()

# 1. Remove Targeta Mestra: Memòria
start_pattern = r'\{\/\*\s*24\.9 Targeta Mestra: Memòria\s*\*\/\}'
end_pattern = r'</article>\n'
match_start = re.search(start_pattern, content)
if match_start:
    match_end = re.search(end_pattern, content[match_start.start():])
    if match_end:
        content = content[:match_start.start()] + content[match_start.start() + match_end.end():]

# 2. Add id="targeta-perfil" to the Persona card
content = content.replace(
    'className="sp-card">\n<a className="sp-card-link-overlay" href="#" title="Obrir Perfil">',
    'className="sp-card" id="targeta-perfil">\n<a className="sp-card-link-overlay" href="#targeta-perfil" title="Obrir Perfil">'
)

# 3. Standardize Author names to "Sóc de Poble" and location to "La Torre de les Maçanes"
# Replace all names except if there's a specific reason not to. The user said ALL cards were standardized except Gent de la Torre (which isn't here).
# We have "Ajuntament", "Javi Llinares", "Consell del Poble", "Maria", "Alerta Civil".
content = re.sub(
    r'<div className="sp-card-author-name"[^>]*>.*?</div>',
    '<div className="sp-card-author-name">Sóc de Poble</div>',
    content
)
content = re.sub(
    r'<div className="sp-card-author-location"[^>]*>.*?</div>',
    '<div className="sp-card-author-location">La Torre de les Maçanes</div>',
    content
)

# If an author doesn't have a location, we need to add it? Let's just do a simple replacement for known variations.
content = content.replace(
    '<div className="sp-card-author-name">Sóc de Poble</div>\n</div>',
    '<div className="sp-card-author-name">Sóc de Poble</div>\n<div className="sp-card-author-location">La Torre de les Maçanes</div>\n</div>'
)
# Clean up duplicate locations just in case
content = content.replace(
    '<div className="sp-card-author-location">La Torre de les Maçanes</div>\n<div className="sp-card-author-location">La Torre de les Maçanes</div>',
    '<div className="sp-card-author-location">La Torre de les Maçanes</div>'
)

# 4. Standardize the bottom button to Connectar.
content = re.sub(
    r'<button className="sp-card-connect" title="[^"]*"[^>]*>.*?</button>',
    '<button className="sp-card-connect" title="Connectar">Connectar</button>',
    content
)

# 5. Make all author links point to #targeta-perfil
content = re.sub(
    r'<a className="sp-card-author-link" href="[^"]*"',
    '<a className="sp-card-author-link" href="#targeta-perfil"',
    content
)

# Write back
with open('src/sections/disseny/DesignSection.jsx', 'w') as f:
    f.write(content)
print("Cards standardized successfully!")
