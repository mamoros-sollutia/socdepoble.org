import re

with open("tooling/brain/sync_agent_mirror.py", "r") as f:
    content = f.read()

# We need to add the generation of the index in source_mapping
new_mapping = """        rendered = HEADER.format(
            source=source_name,
            digest=digest_bytes(source_bytes),
        ) + body
        result[destination] = rendered.encode("utf-8")
        
    # GENERATE INDEX
    index_destination = mirror_root / "00_INDEX_MIRROR.md"
    index_content = "---\\nestat: generat\\ntipus: document\\ndescription: Índex automàtic del mirall d'agents i skills.\\n---\\n\\n# Índex del Mirall d'Agents\\n\\n"
    for dest in sorted(result.keys()):
        if dest.name != "00_INDEX_MIRROR.md" and dest.suffix == ".md":
            index_content += f"- [[{dest.stem}]]\\n"
            
    result[index_destination] = index_content.encode("utf-8")
        
    return result
"""

content = content.replace("""        rendered = HEADER.format(
            source=source_name,
            digest=digest_bytes(source_bytes),
        ) + body
        result[destination] = rendered.encode("utf-8")
    return result""", new_mapping)

with open("tooling/brain/sync_agent_mirror.py", "w") as f:
    f.write(content)

