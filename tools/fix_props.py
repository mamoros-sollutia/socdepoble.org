import re

with open('src/sections/disseny/DesignSection.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix title
content = content.replace('title="Disseny Pedra Seca"', 'title="Disseny"')
# Add showLogos
content = content.replace('title="Disseny"', 'showLogos={true}\n      title="Disseny"')
# Add subtitle
content = content.replace('lead="Inclou', 'subtitle="Sistema oficial de disseny per a Sóc de Poble"\n      lead="Inclou')
# Fix labels
content = content.replace("{ text: 'MUR', className: 'label-orange' }", "{ text: 'Mur', className: 'label-blue' }")
content = content.replace("{ text: 'Disseny UI', className: 'label-blue' }", "{ text: 'Disseny UI', className: 'label-orange' }") # I'll assume standard categories are orange if system is blue

# Remove the hardcoded H2 inside the children
content = re.sub(r'<h2>Sistema oficial de disseny per a Sóc de Poble</h2>\s*', '', content)

with open('src/sections/disseny/DesignSection.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Props fixed!")
