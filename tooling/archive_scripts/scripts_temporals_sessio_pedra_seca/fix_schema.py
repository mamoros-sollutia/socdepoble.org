import json
with open('/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/tooling/wiki/schema.json', 'r') as f:
    schema = json.load(f)
schema['properties']['tipus']['enum'].append('petorreta')
with open('/Users/javillinares/Documents/Antigravity/Som de Poble/socdepoble.org/tooling/wiki/schema.json', 'w') as f:
    json.dump(schema, f, indent=2)
