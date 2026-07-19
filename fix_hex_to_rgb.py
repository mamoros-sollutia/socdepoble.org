import os
import re

files_with_hex = [
    '_wiki_de_poble/02_ACTUAR_Maquina_Tecnica/07_plantilles/plantilla_branding.md',
    '_wiki_de_poble/04_ARXIU_Documents_Historics/prompts/sosp_ai_audit_prompt_round_2.md',
    '_wiki_de_poble/04_ARXIU_Documents_Historics/prompts/petorreta_appshell_alcoi.md',
    '_wiki_de_poble/05_Escriptori_Soc_de_Poble/260719_0410_BUNDLE_Sistema_Operatiu_IAIA_MarIA_Complet.md',
    '_wiki_de_poble/05_Escriptori_Soc_de_Poble/Claude/260719_0630_AUDITORIA_Fuita_Bancaria_Nucli_Mort_I_Constitucio_Triple_Trencada.md',
    '_wiki_de_poble/03_GOVERNAR_Normativa_Regles/ESTANDARD_UI_Universal.md',
    '_wiki_de_poble/00_SER_Brain_Identitat/Sollutia/chrome_extensions.md'
]

def hex_to_rgb(match):
    hex_str = match.group(1).lstrip('#')
    if len(hex_str) == 3:
        hex_str = ''.join(c + c for c in hex_str)
    if len(hex_str) == 6:
        r, g, b = tuple(int(hex_str[i:i+2], 16) for i in (0, 2, 4))
        return f'rgb({r}, {g}, {b})'
    return match.group(0) # return original if not 3 or 6

pattern = re.compile(r'`(#(?:[A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}))`')

for filepath in files_with_hex:
    if not os.path.exists(filepath): continue
    with open(filepath, 'r') as f:
        content = f.read()
    
    new_content = pattern.sub(hex_to_rgb, content)
    
    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Converted hex to RGB in: {filepath}")
