import re

with open('/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/disseny_pedra_seca.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the previous CSS I injected with the logic for alignment
old_css_regex = r'\.sp-card-body h1 \{[^}]*\}\n\.sp-card-body h2 \{[^}]*\}\n\.sp-card-copyright \{[^}]*\}'
new_css = """
.sp-card-body h1 {
  font-size: 1.4rem;
  margin-top: 0;
  margin-bottom: 4px; /* Reduced gap between H1 and H2 */
  color: var(--sdp-secondary-600);
  line-height: 1.2;
  font-weight: 800;
  text-align: center;
}
.sp-card-body h2 {
  font-size: 1.15rem;
  margin-top: 0;
  margin-bottom: var(--sdp-space-4);
  color: var(--sdp-primary-600);
  line-height: 1.3;
  font-weight: 700;
  text-align: center;
}
/* If there's a price/badge in the top right, H1 and H2 go left */
.sp-card-body:has(.sp-card-price) h1,
.sp-card-body:has(.sp-card-price) h2 {
  text-align: left;
}
/* In Caixa Real, the H1 has a large gap above H2, ensure no margin-bottom on h1 or margin-top on h2 */
.sp-card-copyright {
  text-align: center;
}
"""

content = re.sub(old_css_regex, new_css.strip(), content)

with open('/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/disseny_pedra_seca.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("CSS updated for card alignment.")
