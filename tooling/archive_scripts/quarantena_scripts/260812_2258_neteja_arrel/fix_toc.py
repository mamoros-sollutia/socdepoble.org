import re

with open('src/components/design-system/TableOfContents.jsx', 'r') as f:
    content = f.read()

# Replace the heading parsing logic to filter only numbered sections
old_logic = """      const parsedHeadings = Array.from(domHeadings).map((h, i) => {
        // Ignorar els que estan amagats visualment o buits
        if (h.classList.contains('sr-only') || h.textContent.trim() === '') return null;"""
new_logic = """      const parsedHeadings = Array.from(domHeadings).map((h, i) => {
        // Ignorar els que estan amagats visualment o buits
        if (h.classList.contains('sr-only') || h.textContent.trim() === '') return null;
        
        // Només volem els títols que comencen per un número (ex: "1. Identitat", "20.1 Targeta")
        if (!/^\d+\./.test(h.textContent.trim())) return null;"""

content = content.replace(old_logic, new_logic)

with open('src/components/design-system/TableOfContents.jsx', 'w') as f:
    f.write(content)
print("TableOfContents fixed!")
