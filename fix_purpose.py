import os, re

files = [
  '.agents/cervells/inicial_2026-08-24T21-26-15-657Z/core-trust-boundary/SKILL.md',
  '.agents/cervells/inicial_2026-08-24T21-26-15-657Z/core-verified-change/SKILL.md',
  '.agents/cervells/inicial_2026-08-24T21-26-15-657Z/multi-agent-review/SKILL.md'
]

for fpath in files:
    with open(fpath, 'r') as f:
        content = f.read()
    
    def repl(m):
        if m.group(1).startswith('>') or m.group(1).startswith('|'):
            return m.group(0)
        return f"purpose: >\n  {m.group(1)}\n  {m.group(3)}"
        
    new_content = re.sub(r'^purpose:\s*(.*?)\n(\s+)(.*)$', repl, content, flags=re.MULTILINE)
    
    if new_content != content:
        with open(fpath, 'w') as f:
            f.write(new_content)

print("Fixed files.")
