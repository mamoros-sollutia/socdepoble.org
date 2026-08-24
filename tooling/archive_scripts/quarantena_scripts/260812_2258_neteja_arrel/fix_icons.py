import re

with open('src/css/index.css', 'r') as f:
    content = f.read()

# Replace the previous .bar-black .right-icons .icon svg rule
content = content.replace(
    '.bar-black .right-icons .icon svg { width: 100%; height: 100%; }',
    '.bar-black .right-icons .icon svg { width: 30px; height: 30px; stroke-width: 2.5; }'
)

# And make sure it's 24px on mobile
content = content.replace(
    '  .bar-black .right-icons .icon { width: var(--sdp-touch); height: var(--sdp-touch); padding: 9px; }',
    '  .bar-black .right-icons .icon { width: var(--sdp-touch); height: var(--sdp-touch); padding: 9px; }\n  .bar-black .right-icons .icon svg { width: 24px; height: 24px; stroke-width: 2; }'
)

with open('src/css/index.css', 'w') as f:
    f.write(content)

print("Fixed icon sizes!")
