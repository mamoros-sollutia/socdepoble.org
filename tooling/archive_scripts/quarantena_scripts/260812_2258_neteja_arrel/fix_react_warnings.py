with open('src/sections/disseny/DesignSection.jsx', 'r') as f:
    content = f.read()

# Fix checked="" without onChange
content = content.replace('checked="" id="chk1"', 'defaultChecked id="chk1"')
content = content.replace('checked="" id="optA"', 'defaultChecked id="optA"')
content = content.replace('checked="" type="checkbox"', 'defaultChecked type="checkbox"')

# Fix value="..." without onChange
content = content.replace('value="valor incorrecte"', 'defaultValue="valor incorrecte"')
content = content.replace('value="No editable"', 'defaultValue="No editable"')

with open('src/sections/disseny/DesignSection.jsx', 'w') as f:
    f.write(content)
print("React warnings fixed!")
