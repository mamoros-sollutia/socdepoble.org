import re

def parse_style(match):
    style_str = match.group(1)
    rules = [r.strip() for r in style_str.split(';') if r.strip()]
    obj = {}
    for r in rules:
        if ':' in r:
            k, v = r.split(':', 1)
            k = k.strip()
            v = v.strip().replace("'", "\\'")
            # camelCase key unless it's a CSS variable
            if k.startswith('--'):
                pass
            else:
                parts = k.split('-')
                k = parts[0] + ''.join(p.title() for p in parts[1:])
            obj[k] = v
    style_obj = "{" + ", ".join(f"'{k}': '{v}'" for k, v in obj.items()) + "}"
    return f'style={{{style_obj}}}'

with open("_wiki_de_poble/05_Escriptori_Soc_de_Poble/00_Bandeja_d_Entrada/disseny_pedra_seca.html", "r", encoding="utf-8") as f:
    html = f.read()

# Extract from <header class="bar-blue"> to </main>
start = html.find('<header class="bar-blue">')
end = html.rfind('</main>')
if start == -1 or end == -1:
    print("Could not find start or end tags")
    exit(1)

content = html[start:end]

# Convert class to className
content = content.replace('class=', 'className=')
content = content.replace('for=', 'htmlFor=')

# SVG attributes to camelCase
attrs = ['viewbox', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'fill-rule', 'clip-rule', 'stroke-dasharray', 'stroke-dashoffset']
for attr in attrs:
    parts = attr.split('-')
    if len(parts) == 2:
        camel = parts[0] + parts[1].title()
    elif len(parts) == 1 and attr == 'viewbox':
        camel = 'viewBox'
    content = content.replace(f'{attr}=', f'{camel}=')

# Handle self-closing tags
def self_close(tag, text):
    # Regex to find <tag ... > and replace with <tag ... /> if not already self-closing
    pattern = re.compile(f'<{tag}([^>]*?)(?<!/)>', re.IGNORECASE)
    return pattern.sub(f'<{tag}\\1 />', text)

for tag in ['img', 'input', 'br', 'hr', 'circle', 'path', 'line', 'rect']:
    content = self_close(tag, content)

# Remove HTML comments that might break JSX (or convert to {/* ... */})
content = re.sub(r'<!--(.*?)-->', r'{/* \1 */}', content, flags=re.DOTALL)

# Handle styles
content = re.sub(r'style="([^"]*)"', parse_style, content)

jsx = f"""import React from 'react';

export default function DesignSection() {{
  return (
    <>
      {content}
    </>
  );
}}
"""

with open("src/sections/disseny/DesignSection.jsx", "w", encoding="utf-8") as f:
    f.write(jsx)

print("Generated DesignSection.jsx")
