import os
import glob
import datetime

def add_file(f_out, title, path):
    if not os.path.exists(path):
        return
    f_out.write(f"\n## {title}\n")
    f_out.write(f"**Fitxer:** `{path}`\n\n")
    
    ext = os.path.splitext(path)[1].lower()
    lang = ""
    if ext in [".jsx", ".js", ".cjs", ".mjs"]:
        lang = "javascript"
    elif ext == ".css":
        lang = "css"
    elif ext == ".html":
        lang = "html"
    elif ext == ".md":
        lang = "markdown"
    elif ext == ".json":
        lang = "json"

    f_out.write(f"```{lang}\n")
    with open(path, "r", encoding="utf-8") as f_in:
        f_out.write(f_in.read())
    f_out.write(f"\n```\n")

bundle_path = "_wiki_de_poble/05_Escriptori_Soc_de_Poble/00_Bandeja_d_Entrada/260813_0645_MEGA_BUNDLE_CONSELL.md"

with open(bundle_path, "w", encoding="utf-8") as f:
    f.write("---\n")
    f.write("estat: \"actiu\"\n")
    f.write("tipus: \"mega-bundle\"\n")
    f.write(f"data: \"{datetime.datetime.now().isoformat()}\"\n")
    f.write("---\n\n")
    f.write("# 📦 MEGA BUNDLE PER AL CONSELL: Reescriptura Pura del Sistema de Disseny\n\n")
    f.write("Aquest document conté TOT el context necessari (identitat, disseny, HTML canònic, components complets, regles globals i skills) perquè el Consell treballe sense inventar absolutament res.\n\n")
    f.write("## EL PROBLEMA 🚨\n")
    f.write("Fins ara he estat bloquejada barrejant versions antigues i noves de Sóc de Poble. He arrossegat 'fantasmes' de codi antic als components (com les targetes de Festes Patronals, o les LegacySections) que no servixen per a res en l'Arquitectura Pedra Seca.\n\n")
    f.write("## INSTRUCCIONS PRINCIPALS\n")
    f.write("1. **Font de la Veritat Absoluta:** L'arxiu `disseny_pedra_seca.html` (adjuntat més avall) és el disseny PUR i definitiu.\n")
    f.write("2. **Destrucció i Reescriptura:** Llegiu tots els fitxers de `src/components/design-system/sections/` i netegeu-los. Elimineu qualsevol codi antic o targeta fantasma que jo haja deixat.\n")
    f.write("3. **Reproducció Exacta:** Reescriviu aquests components perquè generen exactament l'estructura HTML, classes i textos que es veuen a `disseny_pedra_seca.html`.\n")
    f.write("4. **Zero div fantasmes:** Volem un disseny fluid, sense fem. Implementeu l'HTML semàntic usant exclusivament les classes documentades.\n")

    add_file(f, "Identitat: Sóc de Poble", "/Users/javillinares/.gemini/antigravity-ide/knowledge/01_identitat_iaia/artifacts/soc_de_poble.md")
    add_file(f, "Disseny: Pedra Seca", "/Users/javillinares/.gemini/antigravity-ide/knowledge/04_arquitectura_disseny/artifacts/pedra_seca.md")
    add_file(f, "Regles Globals: AGENTS", ".agents/AGENTS.md")
    add_file(f, "Regles Globals: PROTOCOL", ".agents/PROTOCOL_PETORRETA.md")
    
    for skill_path in glob.glob(".agents/skills/*/SKILL.md"):
        add_file(f, f"Skill: {os.path.basename(os.path.dirname(skill_path))}", skill_path)
        
    add_file(f, "HTML Canònic (Font de Veritat)", "_wiki_de_poble/05_Escriptori_Soc_de_Poble/00_Bandeja_d_Entrada/disseny_pedra_seca.html")
    
    for ext in ("*.css", "*.jsx", "*.js"):
        for path in glob.glob(f"src/**/{ext}", recursive=True):
            add_file(f, f"Source Code: {os.path.basename(path)}", path)

print(f"Mega bundle creat a {bundle_path}")
