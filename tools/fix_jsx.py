import re

with open('src/sections/disseny/DesignSection.jsx', 'r', encoding='utf-8') as f:
    jsx = f.read()

# Fix HTML comments
jsx = re.sub(r'<!--(.*?)-->', r'{/* \1 */}', jsx, flags=re.DOTALL)

# Fix SVG attributes
svg_attrs = {
    'stroke-width': 'strokeWidth',
    'stroke-linecap': 'strokeLinecap',
    'stroke-linejoin': 'strokeLinejoin',
    'fill-rule': 'fillRule',
    'clip-rule': 'clipRule',
    'stroke-miterlimit': 'strokeMiterlimit',
    'stop-color': 'stopColor',
    'stop-opacity': 'stopOpacity'
}

for html_attr, jsx_attr in svg_attrs.items():
    jsx = jsx.replace(html_attr + '=', jsx_attr + '=')

# Fix style strings left behind (there shouldn't be any but just in case)
jsx = re.sub(r'style="([^"]*)"', '', jsx)

with open('src/sections/disseny/DesignSection.jsx', 'w', encoding='utf-8') as f:
    f.write(jsx)
print("JSX fixed!")
