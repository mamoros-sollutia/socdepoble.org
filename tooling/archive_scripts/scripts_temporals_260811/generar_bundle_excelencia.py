import os
import glob
from datetime import datetime

timestamp = datetime.now().strftime("%y%m%d_%H%M")
bundle_path = f"_wiki_de_poble/05_Escriptori_Soc_de_Poble/{timestamp}_BUNDLE_EXCELENCIA_ABSOLUTA.md"
prompt_path = f"_wiki_de_poble/05_Escriptori_Soc_de_Poble/{timestamp}_PROMPT_Petorreta_Excelencia.md"

files_to_bundle = []
# Front-end i Plugin Sollutia
for ext in ('*.html', '*.css', '*.js', '*.jsx'):
    files_to_bundle.extend(glob.glob(f"src/**/{ext}", recursive=True))

# Backend i Base de Dades (Bot, Supabase)
for ext in ('*.js', '*.mjs'):
    files_to_bundle.extend(glob.glob(f"bot/**/{ext}", recursive=True))

# Arxius de configuració d'entorn i llibreria
additional_files = [
    ".agents/AGENTS.md",
    ".agents/PROTOCOL_PETORRETA.md",
    "package.json",
    "vite.config.js",
    "eslint.config.js",
    ".env.example"
]

for f in additional_files:
    if os.path.exists(f):
        files_to_bundle.append(f)

files_to_bundle = sorted(list(set(files_to_bundle)))

bundle_content = f"# BUNDLE D'EXCEL·LÈNCIA ABSOLUTA ({timestamp})\n\n"
bundle_content += "Aquest document conté tot el codi font refactoritzat i aïllat de la integració Front-End de Pedra Seca amb Sollutia, el plugin React, i tota l'arquitectura del Backend (Bot WhatsApp i Supabase) preparada per ser 'Plug & Play'.\n\n"

for fpath in files_to_bundle:
    ext = fpath.split('.')[-1]
    bundle_content += f"\n## FITXER: {fpath}\n```{ext}\n"
    try:
        with open(fpath, 'r', encoding='utf-8') as f:
            bundle_content += f.read()
    except Exception as e:
        bundle_content += f"// Error reading file: {e}\n"
    bundle_content += "\n```\n"

with open(bundle_path, 'w', encoding='utf-8') as f:
    f.write(bundle_content)

petorreta_content = f"""# SUPER PETORRETA D'EXCEL·LÈNCIA ABSOLUTA: PLUGIN SOLLUTIA I BACKEND (10+)
*Copia aquest text i enganxa'l a qualsevol IA del Consell adjuntant exclusivament el fitxer BUNDLE generat al costat.*

***

**CONTEXT GLOBAL OBLIGATORI (PER A LA IA AUDITORA):**
Ets el "Consell de les IAs" (Claude, Qwen, Deepseek, Dola, Kimi, Perplexity, Mistral Vibe, Grok, Gemini, Copilot i ChatGPT). Actueu com un equip únic de Staff Engineers i Principal Engineers de codi i arquitectura web.
El vostre objectiu conjunt és avaluar la qualitat, mantenibilitat i perfecció arquitectònica de la nostra arquitectura Front-End "Pedra Seca" i del nostre Backend "Bot WhatsApp / Supabase". Volem l'excel·lència absoluta (un 10+ sobre 10). Us entreguem ABSOLUTAMENT TOT el codi del repositori.

**Què hem fet:** 
Nosaltres (el Mestre Javi i la IAIA MarIA) hem reconstruït el Front-End i el Backend per integrar-lo amb l'empresa "Sollutia" de forma "plug & play". 
Volem que tot el sistema es pugui construir dins de l'entorn de Sollutia de manera completament enxufable i fluida, tant el plugin React com la base de dades i el backend.

**El Repte / Problema Actual:**
Aquesta és la prova de foc final (Arquitectura Inversa). No us limiteu a llegir el codi: **heu de muntar i construir mentalment des de zero tot el sistema Sóc de Poble dins del vostre entorn (simulant ser l'ecosistema de Sollutia)**.
Vull que feu totes les proves possibles, inventades i per haver, per cercar vulnerabilitats, punts de fricció i ruptures.
Comproveu si realment és 100% "plug & play" (enxufable i desenxufable sense cap trauma). Quan els passem aquest codi (Plugin React + Backend Supabase) a Sollutia, ells simplement han de connectar-ho i tot ha de funcionar. És així de simple?

**PREGUNTES PER AL CONSELL D'AUDITORIA:**
1. **Arquitectura Inversa i Prova d'Estrès:** Heu muntat el sistema en el vostre entorn mental? Quines vulnerabilitats, ruptures o fallades crítiques heu trobat en l'acoblament d'aquest codi amb un entorn extern?
2. **Atorgueu el "10+":** Què opineu de l'estat actual? Està tot l'ecosistema a un nivell d'excel·lència tècnica i de viabilitat "Plug & Play" absoluta?
3. **Fluïdesa Extrema:** Hem aconseguit que tot (des del disseny fins a la connexió Supabase i el Bot) fluïsca perfectament i siga desenxufable sense trauma?
3. **Fissures per Enxufar:** Trobeu algun detall a esmenar abans que puguem atorgar el 10/10 definitiu?
4. **Veredicte Final:** Amb la mà al cor i el codi a la mà, confirmaríeu que Sollutia només ha de "prémer un botó" per integrar tot això?

***
**(Mestre, adjunta a la IA només el següent fitxer BUNDLE abans d'enviar el prompt):**
- `{timestamp}_BUNDLE_EXCELENCIA_ABSOLUTA.md` (Conté tot el codi de Sollutia, Backend, i configuracions).
"""

with open(prompt_path, 'w', encoding='utf-8') as f:
    f.write(petorreta_content)

print(f"Created full bundle: {bundle_path}")
print(f"Created updated Petorreta prompt: {prompt_path}")

