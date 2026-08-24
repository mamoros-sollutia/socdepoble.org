import re

file_path = "disseny_pedra_seca.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Meta viewport
content = content.replace(", maximum-scale=1.0, user-scalable=no", "")

# 2. Variables
replacements = {
    "--sp-black": "--sdp-pedra-900",
    "--sp-white": "--sdp-superficie",
    "--sp-cream": "--sdp-pedra-100",
    "--sp-orange": "--sdp-primary-500",
    "--sp-blue": "--sdp-secondary-500",
    "--sp-text": "--sdp-pedra-900",
    "--sp-muted": "--sdp-pedra-500",
    "--sp-radius": "--sdp-radi-m"
}

for old, new in replacements.items():
    content = content.replace(old, new)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Replaced variables successfully.")
