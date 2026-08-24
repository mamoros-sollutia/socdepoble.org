import re
with open('src/css/index.css', 'r') as f:
    content = f.read()

# Remove max-width lines completely
content = re.sub(r'^\s*max-width:\s*var\(--sdp-measure\);\s*\n', '', content, flags=re.MULTILINE)

with open('src/css/index.css', 'w') as f:
    f.write(content)
print("Removed max-width limits!")
