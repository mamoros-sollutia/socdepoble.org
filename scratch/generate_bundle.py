import os
import datetime
import glob

files_to_bundle = [
    ".agents/AGENTS.md",
    ".agents/PROFILE.md",
    ".agents/PROTOCOL_PETORRETA.md",
    "package.json",
    "eslint.config.js",
    ".husky/pre-commit",
    "tooling/gates/tractor-manual.mjs",
    "tooling/gates/tractor-consell.mjs",
    "tooling/gates/tractor-registre.mjs",
    "tooling/gates/tractor-doctrina.mjs",
    "src/components/universal/UniversalComponents.jsx",
    "src/css/index.css"
]

skills = glob.glob(".agents/cervells/inicial_2026-08-24T21-26-15-657Z/*/SKILL.md")
files_to_bundle.extend(skills)

date_str = datetime.datetime.now().strftime("%y%m%d_%H%M")
out_file = f"_wiki_de_poble/05_Escriptori_Soc_de_Poble/{date_str}_PETORRETA_Delegacio_Universal.md"

with open(out_file, "w") as out:
    out.write("# BUNDLE DE CONTEXT: SÓC DE POBLE (Fase 0 Completada)\n\n")
    for f in files_to_bundle:
        if os.path.exists(f):
            out.write(f"## Arxiu: {f}\n")
            out.write("```\n")
            with open(f, "r") as infile:
                out.write(infile.read())
            out.write("\n```\n\n")
        else:
            out.write(f"## Arxiu: {f} (NO TROBAT)\n\n")

print(out_file)
