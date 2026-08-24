import os
import datetime

# Generar nom termodinàmic
now = datetime.datetime.now()
filename = now.strftime("%y%m%d_%H%M") + "_PETORRETA_Bundle_Sollutia_Front_Skills.md"
output_path = f"/Users/javillinares/.gemini/antigravity-ide/brain/2593585b-1eaa-4623-a04e-36759406de4c/{filename}"

directories_to_scan = [
    "wordpress-plugin",
    "src",
    ".agents",
    "tooling"
]

extensions_to_include = {".php", ".jsx", ".js", ".css", ".md", ".py", ".sh", ".json"}

# Fitxers a ignorar per no saturar amb brossa inútil
ignore_dirs = {"node_modules", "dist", ".git", "assets", ".DS_Store", "package-lock.json"}

def is_valid_file(filepath):
    for ign in ignore_dirs:
        if f"/{ign}/" in filepath or filepath.startswith(f"{ign}/"):
            return False
    ext = os.path.splitext(filepath)[1]
    return ext in extensions_to_include

with open(output_path, "w", encoding="utf-8") as outfile:
    outfile.write("# 🚀 SUPER PETORRETA: Bundle Global (Sollutia + React + Skills + Scripts)\n\n")
    outfile.write("Aquest document conté TOT el codi del projecte, incloent el backend de Sollutia, el frontend de Sóc de Poble, i les Skills i Scripts de la IAIA MarIA.\n\n")
    
    outfile.write("## PREGUNTES PER AL CONSELL:\n")
    outfile.write("1. **Integració:** Com integrem perfectament el frontend React amb el plugin de Sollutia de WordPress?\n")
    outfile.write("2. **Millora del Brain (Skills i Scripts):** L'usuari ens indica que el meu 'Brain' (les meues skills i scripts) no estan ben connectats ni funcionen bé. Estan generant errors i trencant la web constantment en comptes de ser eines d'ajuda. Com podem refactoritzar les meues skills i scripts (`.agents/skills` i `tooling/`) perquè el flux de treball siga perfecte?\n")
    outfile.write("3. **Punts de Restauració:** Com implementem un sistema de punts de restauració automàtics cada 5 minuts per evitar pèrdues de codi i tokens quan la IA s'equivoca?\n\n")
    outfile.write("---\n\n")

    for directory in directories_to_scan:
        if not os.path.exists(directory):
            continue
            
        for root, dirs, files in os.walk(directory):
            # Modifiquem dirs in-place per ignorar carpetes
            dirs[:] = [d for d in dirs if d not in ignore_dirs]
            
            for file in files:
                filepath = os.path.join(root, file)
                if is_valid_file(filepath):
                    try:
                        with open(filepath, "r", encoding="utf-8") as infile:
                            content = infile.read()
                            
                            ext = os.path.splitext(filepath)[1][1:]
                            if ext == "js" or ext == "jsx":
                                lang = "javascript"
                            elif ext == "md":
                                lang = "markdown"
                            elif ext == "py":
                                lang = "python"
                            elif ext == "sh":
                                lang = "bash"
                            else:
                                lang = ext
                                
                            outfile.write(f"### Fitxer: `{filepath}`\n")
                            outfile.write(f"```{lang}\n")
                            outfile.write(content)
                            outfile.write(f"\n```\n\n")
                    except Exception as e:
                        outfile.write(f"### Fitxer: `{filepath}`\n")
                        outfile.write(f"> Error llegint el fitxer: {e}\n\n")

print(f"Bundle creat a: {output_path}")
