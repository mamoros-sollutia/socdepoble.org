import re

with open("disseny_pedra_seca.html", "r") as f:
    content = f.read()

# 1. Fix the Typography list (Lleis Fonamentals)
ul_block = """<ul>
<li><strong>Arrel Mestra:</strong> <code>18px (1.125rem)</code> per a garantir touch-targets i visibilitat nativa sense zoom.</li>
<li><strong>Font Única:</strong> <code>Noto Sans</code>, escollida per l'altura de la seua "x", les seues formes obertes i el suport multilingüe extrem.</li>
<li><strong>Ample Màxim de Lectura:</strong> <code>68ch</code>, el límit científic abans de causar fatiga ocular al saltar de línia.</li>
<li><strong>Interlineat (Line-height):</strong> <code>1.6</code> en paràgrafs per a donar oxigen; <code>1.2</code> en capçaleres per mantindre la compacitat.</li>
</ul>"""

p_block = """<p><strong>Arrel Mestra:</strong> <code>18px (1.125rem)</code> per a garantir touch-targets i visibilitat nativa sense zoom.</p>
<p><strong>Font Única:</strong> <code>Noto Sans</code>, escollida per l'altura de la seua "x", les seues formes obertes i el suport multilingüe extrem.</p>
<p><strong>Ample Màxim de Lectura:</strong> <code>68ch</code>, el límit científic abans de causar fatiga ocular al saltar de línia.</p>
<p><strong>Interlineat (Line-height):</strong> <code>1.6</code> en paràgrafs per a donar oxigen; <code>1.2</code> en capçaleres per mantindre la compacitat.</p>"""

if ul_block in content:
    content = content.replace(ul_block, p_block)
    print("Fixed Typography ul block.")
else:
    print("Could not find Typography ul block.")


# 2. Fix the Ghost cards at the end of the file.
# We know the ghost starts right after:
# <!-- SECCIÓ 34: VARIABLES CSS -->
# <section class="design-block">
# And then it goes all the way to </article>\n</main> or something similar.
# In disseny_pedra_seca.html, after SECCIÓ 34, what WAS there?
# Let's search for '<!-- SECCIÓ 34: VARIABLES CSS -->' and cut off everything that looks like a card.

# Let's see what is currently there.
# I will print the last 2000 chars to debug.
