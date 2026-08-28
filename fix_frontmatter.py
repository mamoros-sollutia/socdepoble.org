import os, re

files = [
  '.agents/cervells/inicial_2026-08-24T21-26-15-657Z/cog-deliberation/SKILL.md',
  '.agents/cervells/inicial_2026-08-24T21-26-15-657Z/core-bounded-action/SKILL.md',
  '.agents/cervells/inicial_2026-08-24T21-26-15-657Z/core-trust-boundary/SKILL.md',
  '.agents/cervells/inicial_2026-08-24T21-26-15-657Z/core-verified-change/SKILL.md',
  '.agents/cervells/inicial_2026-08-24T21-26-15-657Z/identity-iaia-voice/SKILL.md',
  '.agents/cervells/inicial_2026-08-24T21-26-15-657Z/multi-agent-review/SKILL.md',
  '.agents/cervells/inicial_2026-08-24T21-26-15-657Z/pedra-seca/SKILL.md',
  '_wiki_de_poble/12_actes/260828_1625_ACTA_SESSIO_Fase4_Superacio.md'
]

for fpath in files:
    if not os.path.exists(fpath): continue
    with open(fpath, 'r') as f:
        content = f.read()
    
    # We want to replace something like:
    # description: Some text here
    #   and here
    # with:
    # description: >
    #   Some text here
    #   and here
    def repl(m):
        if m.group(1).startswith('>') or m.group(1).startswith('|'):
            return m.group(0)
        return f"description: >\n  {m.group(1)}\n  {m.group(3)}"
        
    new_content = re.sub(r'^description:\s*(.*?)\n(\s+)(.*)$', repl, content, flags=re.MULTILINE)
    
    if new_content != content:
        with open(fpath, 'w') as f:
            f.write(new_content)

print("Fixed files.")
