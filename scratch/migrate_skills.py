import os
import yaml
import re

SKILLS_DIR = '.agents/cervells/inicial_2026-08-24T21-26-15-657Z'

SKILL_TRIGGERS = {
    'cog-deliberation': ['deliberar', 'planificar', 'pensar', 'reflexionar', 'estratègia'],
    'core-bounded-action': ['bucle', 'acció', 'límits', 'execució', 'seguretat', 'aturar'],
    'core-trust-boundary': ['confiança', 'permisos', 'frontera', 'secrets', 'dades personals', 'privacitat'],
    'core-verified-change': ['canvi', 'verificar', 'tests', 'gate', 'ci', 'aprovació'],
    'identity-iaia-voice': ['veu', 'iaia', 'maria', 'personalitat', 'to', 'valencià'],
    'multi-agent-review': ['consell', 'qwen', 'claude', 'revisió', 'agents', 'auditoria'],
    'socdepoble-workflow': ['workflow', 'flux', 'procés', 'passos', 'guia'],
    'pedra-seca': ['disseny', 'css', 'ui', 'pedra', 'seca', 'estil', 'colors', 'components']
}

def process_skill(skill_name):
    path = os.path.join(SKILLS_DIR, skill_name, 'SKILL.md')
    if not os.path.exists(path):
        return
    
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split frontmatter
    match = re.match(r'^---\n(.*?)\n---\n(.*)', content, re.DOTALL)
    if not match:
        return

    frontmatter_text = match.group(1)
    body = match.group(2)

    try:
        meta = yaml.safe_load(frontmatter_text)
    except:
        return

    # Update metadata
    meta['lang'] = 'ca'
    if skill_name in SKILL_TRIGGERS:
        meta['triggers_on'] = SKILL_TRIGGERS[skill_name]
    
    new_frontmatter = yaml.dump(meta, allow_unicode=True, sort_keys=False)

    # Remove fluff
    # Fluff section starts with ## Detall Operatiu i Instruccions d'Ús Extès
    # and ends at the next ## or end of file.
    body = re.sub(r'## Detall Operatiu i Instruccions d\'Ús Extès.*?(?=## |\Z)', '', body, flags=re.DOTALL)

    new_content = f"---\n{new_frontmatter}---\n{body.strip()}\n"

    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Processed {skill_name}")

for skill in os.listdir(SKILLS_DIR):
    if os.path.isdir(os.path.join(SKILLS_DIR, skill)):
        process_skill(skill)
