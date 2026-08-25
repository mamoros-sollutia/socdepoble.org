import os
import shutil
from pathlib import Path

SKILLS_DIR = Path('.agents/skills')

MAPPING = {
    'evi-grounding-dades': ['grounding-en-forza-de-dades'],
    'evi-chain-verification': ['chain-of-verification', 'verificacio-en-cadena-qwen', 'evidence-first-reasoning', 'hallucination-guard', 'anti-hallucination-guard'],
    'evi-multi-model': ['multi-model-consensus'],
    'cog-trellat-deliberation': ['trellat-reasoning', 'raonament-pas-a-pas', 'chain-of-thought-moderation', 'socdepoble-cot-profund'],
    'cog-context-curator': ['semantic-compression', 'progressive-disclosure', 'socdepoble-context-forensics'],
    'sec-application-security': ['pedra-seca-security-audit', 'socdepoble-adversarial-code-review', 'socdepoble-contract-consistency'],
    'sec-trust-boundary': ['engany-de-restriccions'],
    'arc-pedra-seca-ui': ['pedra-seca-code', 'socdepoble-criteri-visual'],
    'arc-react-thermodynamics': ['react-memory-thermodynamics', 'thermodynamic-optimization', 'consola-termodinamica'],
    'arc-offline-resilience': ['offline-first-resilience-engineer', 'sovereign-offline'],
    'arc-embedded-boundary': ['code-stability-refactor', 'memory-leak-detector'],
    'ops-safe-mutation': ['socdepoble-safe-patch-planning', 'trust-verify-execute', 'codi-corrector-segons-esquema', 'socdepoble-autosanacio', 'socdepoble-llm-wiki', 'socdepoble-zero-slop'],
    'ops-mechanical-gates': ['code-guardian', 'anti-collapse-audit', 'destructive-architecture-audit'],
    'ops-defuddle': ['defuddle'],
    'prm-craft-architecture': ['prompt-architecture-council', 'prompt-safety-and-context'],
    'ux-rural-dialogue': ['rural-empathy', 'socdepoble-sociologia-whatsapp', 'socdepoble-civic']
}

def migrate():
    # 1. Create new super-skills
    for super_skill, old_skills in MAPPING.items():
        super_dir = SKILLS_DIR / super_skill
        super_dir.mkdir(exist_ok=True)
        
        merged_content = f"---\nestat: actiu\ntipus: skill\ndescription: Lòbul {super_skill} (Fusionat)\n---\n\n# {super_skill}\n\n"
        
        for old in old_skills:
            old_dir = SKILLS_DIR / old
            skill_file = old_dir / 'SKILL.md'
            if skill_file.exists():
                content = skill_file.read_text('utf-8')
                merged_content += f"\n## Antic: {old}\n\n{content}\n"
                
                # Copy other files if they exist (except SKILL.md)
                for f in old_dir.iterdir():
                    if f.name != 'SKILL.md':
                        dest = super_dir / f.name
                        if f.is_dir():
                            shutil.copytree(f, dest, dirs_exist_ok=True)
                        else:
                            shutil.copy2(f, dest)
            
            # Remove old directory
            if old_dir.exists():
                shutil.rmtree(old_dir)
                
        # Write merged SKILL.md
        (super_dir / 'SKILL.md').write_text(merged_content, 'utf-8')

if __name__ == '__main__':
    migrate()
    print("Migració completada.")
