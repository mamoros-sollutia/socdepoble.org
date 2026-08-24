import re

with open('/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/disseny_pedra_seca.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the previous CSS block entirely to fix the sizes and alignments
old_css_regex = r'\.sp-card-body h1 \{[\s\S]*?\}\n\.sp-card-copyright \{\n\s*text-align: center;\n\}'
# Actually, let's just find the block from .sp-card-body h1 to the end of .sp-card-copyright
old_css_regex = r'\.sp-card-body h1 \{[\s\S]*?\}\n/\* If there\'s a price/badge in the top right, H1 and H2 go left \*/[\s\S]*?\.sp-card-copyright \{\n\s*text-align: center;\n\}'

new_css = """
.sp-card-body h1 {
  font-size: 1.75rem; /* Clearly larger than H2 */
  margin-top: 0;
  margin-bottom: var(--sdp-space-2);
  color: var(--sdp-secondary-600);
  line-height: var(--sdp-leading-tight);
  font-weight: 800;
}
.sp-card-body h2 {
  font-size: 1.15rem; /* Smaller subtitle */
  margin-top: 0;
  margin-bottom: var(--sdp-space-4);
  color: var(--sdp-primary-600);
  line-height: var(--sdp-leading-snug);
  font-weight: 700;
}
/* By default, center everything in the card body if there is no top-right badge */
.sp-card-body h1,
.sp-card-body h2,
.sp-card-body p,
.sp-card-body .sp-card-text {
  text-align: center;
}
/* If there's a price/badge in the top right, everything aligns left to balance the visual weight */
.sp-card-body:has(.sp-card-price) h1,
.sp-card-body:has(.sp-card-price) h2,
.sp-card-body:has(.sp-card-price) p,
.sp-card-body:has(.sp-card-price) .sp-card-text {
  text-align: left;
}
.sp-card-copyright {
  text-align: center;
}
"""

# Let's use a more robust replacement by just replacing the whole injected CSS from yesterday.
# I will search for ".sp-card-body h1 {" and replace everything up to ".sp-card-copyright { text-align: center; }"
start_idx = content.find('.sp-card-body h1 {')
if start_idx != -1:
    end_str = '.sp-card-copyright {\n  text-align: center;\n}'
    end_idx = content.find(end_str, start_idx)
    if end_idx != -1:
        end_idx += len(end_str)
        content = content[:start_idx] + new_css.strip() + content[end_idx:]

with open('/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/disseny_pedra_seca.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Card sizes and alignment updated.")
