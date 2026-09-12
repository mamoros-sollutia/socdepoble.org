import subprocess
import re

# Get the list of orphans
result = subprocess.run(['node', 'tooling/gates/tractor-classes-orfes.mjs'], capture_output=True, text=True)
lines = result.stderr.split('\n')

# Parse orphans for DesignSectionContent.jsx
orphans = []
for line in lines:
    if 'DesignSectionContent.jsx' in line:
        match = re.search(r'\.(sdp-[a-zA-Z0-9_-]+) no té cap regla', line)
        if not match:
             match = re.search(r'\.([a-zA-Z0-9_-]+) no té cap regla', line)
        if match:
            cls = match.group(1)
            orphans.append(cls)

orphans = set(orphans)

# Read file
with open('src/sections/disseny/DesignSectionContent.jsx', 'r') as f:
    content = f.read()

# Replace each orphan class
for orphan in orphans:
    # We replace ' classname ' or 'classname' inside className string
    # Actually, the simplest is to just remove the exact word from the file
    content = re.sub(r'\b' + re.escape(orphan) + r'\b', '', content)

# Clean up empty classNames
content = re.sub(r'className="\s+"', 'className=""', content)

with open('src/sections/disseny/DesignSectionContent.jsx', 'w') as f:
    f.write(content)
