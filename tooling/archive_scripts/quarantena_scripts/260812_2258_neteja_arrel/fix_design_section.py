import re

with open('src/sections/disseny/DesignSection.jsx', 'r') as f:
    content = f.read()

# 1. Update imports
content = content.replace("import React from 'react';", "import React, { useState } from 'react';\nimport TableOfContents from '../../components/design-system/TableOfContents';")

# 2. Add state
content = content.replace("  const navigate = useNavigate();\n  return (", "  const navigate = useNavigate();\n  const [isTocOpen, setIsTocOpen] = useState(false);\n\n  return (")

# 3. Add onClick to back button
content = content.replace(
    '<button className="sp-card-action" title="Tornar arrere">',
    '<button className="sp-card-action" title="Tornar arrere" onClick={() => navigate(-1)}>'
)

# 4. Add onClick to index button
content = content.replace(
    '<button className="sp-card-action" title="Índex de secció">',
    '<button className="sp-card-action" title="Índex de secció" onClick={() => setIsTocOpen(true)}>'
)

# 5. Append TableOfContents at the end before closing tag
# Find the last `</>` which should be at the end of the file. Wait, it's `</>` not `</div>`
# Actually, it's just before `</>`
if content.endswith('\n</>\n  );\n}\n'):
    content = content.replace('\n</>\n  );\n}\n', '\n      <TableOfContents isOpen={isTocOpen} onClose={() => setIsTocOpen(false)} />\n    </>\n  );\n}\n')
else:
    # Just substitute the last `    </>`
    content = re.sub(r'(?s)(.*?)\s*</>\s*\);\s*}\s*$', r'\1\n      <TableOfContents isOpen={isTocOpen} onClose={() => setIsTocOpen(false)} />\n    </>\n  );\n}', content)

with open('src/sections/disseny/DesignSection.jsx', 'w') as f:
    f.write(content)
print("DesignSection updated!")
