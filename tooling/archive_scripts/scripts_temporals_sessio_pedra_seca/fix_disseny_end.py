import re

with open("disseny_pedra_seca.html", "r") as f:
    content = f.read()

start_marker = "<!-- SECCIÓ 34: VARIABLES CSS -->"
end_marker = "</main>"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + "</article>\n" + content[end_idx:]
    with open("disseny_pedra_seca.html", "w") as f:
        f.write(new_content)
    print("Fixed ghost cards at the end of disseny.")
else:
    print("Markers not found.")

