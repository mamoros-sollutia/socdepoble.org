import re

with open('/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/disseny_pedra_seca.html', 'r', encoding='utf-8') as f:
    content = f.read()

# The user explicitly wants all sub-sections within the numbered sections to be H4.
# Currently they are a mix of H4, H5, and H6.
# Let's target all standalone H5 and H6 tags and convert them to H4, EXCEPT inside the typography study (which demonstrates the tags).

# Split content to avoid touching the typography section (Section 2)
# Section 2 starts around <h3>2. Estudi Tipogràfic
# Section 3 starts around <h3>3. Espaiat i Grid
parts = re.split(r'(<h3>3\. Espaiat i Grid</h3>)', content, 1)

if len(parts) == 3:
    pre_content = parts[0]
    sec3_header = parts[1]
    post_content = parts[2]
    
    # In post_content (Section 3 onwards), convert all <h5> and <h6> to <h4>
    post_content = re.sub(r'<h5>(.*?)</h5>', r'<h4>\1</h4>', post_content)
    post_content = re.sub(r'<h6>(.*?)</h6>', r'<h4>\1</h4>', post_content)
    
    content = pre_content + sec3_header + post_content

# Also fix Section 1 (Identitat Cromàtica)
# Section 1 starts around <h3>1. Identitat
# Section 2 starts around <h3>2. Estudi
parts2 = re.split(r'(<h3>1\. Identitat Cromàtica</h3>)', content, 1)
if len(parts2) == 3:
    pre_c = parts2[0]
    sec1_header = parts2[1]
    rest_c = parts2[2]
    
    # Split out section 2 so we only modify section 1
    sec1_parts = re.split(r'(<h3>2\. Estudi Tipogràfic)', rest_c, 1)
    if len(sec1_parts) == 3:
        sec1_content = sec1_parts[0]
        # modify sec1
        sec1_content = re.sub(r'<h5>(.*?)</h5>', r'<h4>\1</h4>', sec1_content)
        sec1_content = re.sub(r'<h6>(.*?)</h6>', r'<h4>\1</h4>', sec1_content)
        content = pre_c + sec1_header + sec1_content + sec1_parts[1] + sec1_parts[2]

with open('/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/disseny_pedra_seca.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Upgraded H5 and H6 to H4 outside of Typography section.")
