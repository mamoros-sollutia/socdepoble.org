import re

with open('src/sections/disseny/DesignSection.jsx', 'r') as f:
    content = f.read()

# Find all H3 elements
h3_pattern = re.compile(r'<h3>(\d+)\.\s*(.*?)</h3>')
# Find all H4 elements that start with a number like 24.1
h4_pattern = re.compile(r'<h4>(\d+)\.(\d+)\s*(.*?)</h4>')

# We need to do a stateful replace because h4 numbering depends on the current h3 numbering.
current_h3_num = 0
current_h4_num = 0

def replace_h3(match):
    global current_h3_num
    global current_h4_num
    current_h3_num += 1
    current_h4_num = 0 # reset h4 for new h3
    return f'<h3>{current_h3_num}. {match.group(2)}</h3>'

# We split the document into pieces by h3, then process each piece.
parts = h3_pattern.split(content)
# parts[0] is before first h3
# parts[1] is num, parts[2] is text, parts[3] is content after it, etc.
# Actually, re.split is tricky. Let's do it with finditer and manual string building.

new_content = ""
last_end = 0
current_h3 = 0
current_h4 = 0

# Find all matches for both h3 and h4 in order
pattern = re.compile(r'<(h[34])>(\d+)\.?(\d*)\.?\s*(.*?)</\1>')
for match in pattern.finditer(content):
    new_content += content[last_end:match.start()]
    tag = match.group(1)
    title_text = match.group(4)
    
    if tag == 'h3':
        current_h3 += 1
        current_h4 = 0
        new_content += f'<h3>{current_h3}. {title_text}</h3>'
    elif tag == 'h4':
        current_h4 += 1
        # If it was 24.1, make it {current_h3}.{current_h4}
        new_content += f'<h4>{current_h3}.{current_h4} {title_text}</h4>'
        
    last_end = match.end()

new_content += content[last_end:]

# Now let's just make sure there are no remaining H3s that were formatted slightly differently (like <h3>H3: Sub-secció Temàtica (24px)</h3>)
# Oh wait, there is one: <h3>H3: Sub-secció Temàtica (24px)</h3>
# We shouldn't touch that one because it's a demonstration of typography, not a section.
# The pattern `r'<(h[34])>(\d+)\.?(\d*)\.?\s*(.*?)</\1>'` only matches if it starts with a digit. So "H3:" is safe.

with open('src/sections/disseny/DesignSection.jsx', 'w') as f:
    f.write(new_content)
print("Numbering fixed successfully!")
