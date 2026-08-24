import re

with open("disseny_pedra_seca.html", "r") as f:
    content = f.read()

# Replace the generic > *:first-child / > *:last-child rules Grok gave
# We'll remove these lines entirely and replace them with our explicit grid-column rules

content = re.sub(r'header\.bar-blue > \*:first-child \{ justify-self: start; \}\nheader\.bar-blue > \*:last-child \{ justify-self: end; \}', '', content)
content = re.sub(r'section\.bar-orange > \*:first-child \{ justify-self: start; \}\nsection\.bar-orange > \*:last-child \{ justify-self: end; \}', '', content)
content = re.sub(r'\.sp-card-header > \*:first-child \{ justify-self: start; \}\n\.sp-card-header > \*:last-child \{ justify-self: end; \}', '', content)
content = re.sub(r'\.sp-card-footer > \*:first-child \{ justify-self: start; \}\n\.sp-card-footer > \*:last-child \{ justify-self: end; \}', '', content)

css_to_insert = """
/* Explicit Grid Placements for Atomic Components */
/* .bar-blue has 3 elements: Left, Center, Right */
header.bar-blue > *:first-child { grid-column: 1; justify-self: start; }
header.bar-blue > *:nth-child(2) { grid-column: 2; justify-self: center; }
header.bar-blue > *:last-child { grid-column: 3; justify-self: end; }

/* .bar-orange & .sp-card-header have 2 elements: Left and Right (skip center) */
section.bar-orange > *:first-child, .sp-card-header > *:first-child { grid-column: 1; justify-self: start; }
section.bar-orange > *:last-child, .sp-card-header > *:last-child { grid-column: 3; justify-self: end; }

/* .sp-card-footer has 2 elements: Center and Right (skip left) */
.sp-card-footer > *:first-child { grid-column: 2; justify-self: center; }
.sp-card-footer > *:last-child { grid-column: 3; justify-self: end; }
"""

# Insert the CSS right after the section.bar-orange rule block
content = content.replace('z-index: var(--z-barra-taronja);\n}', 'z-index: var(--z-barra-taronja);\n}\n' + css_to_insert)

# Now, add the pin to the Camiseta card
# Locate the specific meta block for Camiseta:
camiseta_meta = '''<div class="sp-card-meta sdp-gap-8">
<button class="btn-date-time" title="Veure calendari d'este dia">
<span>00:33</span><span>23/3/26</span>'''

camiseta_meta_replacement = '''<div class="sp-card-meta sdp-gap-8">
<button class="btn-icon-orange" title="Ancorar" style="z-index: 3; position: relative;">
<svg class="icon" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 0 0-8 0v4l-2 4h12l-2-4z"></path><path d="M12 15v7"></path></svg>
</button>
<button class="btn-date-time" title="Veure calendari d'este dia">
<span>00:33</span><span>23/3/26</span>'''

content = content.replace(camiseta_meta, camiseta_meta_replacement)

with open("disseny_pedra_seca.html", "w") as f:
    f.write(content)

print("CSS updated and pin added.")
