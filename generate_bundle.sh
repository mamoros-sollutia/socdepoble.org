#!/bin/bash
# Script corregit per a macOS (sense globstar)

OUTPUT="BUNDLE_AUDITORIA_GLOBAL.md"

echo "# BUNDLE D'AUDITORIA GLOBAL - SÓC DE POBLE" > "$OUTPUT"
echo "Generat el: $(date)" >> "$OUTPUT"
echo "" >> "$OUTPUT"

# Funció per afegir fitxers
add_files() {
  local dir=$1
  local ext=$2
  
  if [ -d "$dir" ]; then
    find "$dir" -type f -name "*.$ext" | while read -r file; do
      echo "Afegint $file..."
      echo "### fitxer: $file" >> "$OUTPUT"
      echo "\`\`\`${ext}" >> "$OUTPUT"
      cat "$file" >> "$OUTPUT"
      echo "\`\`\`" >> "$OUTPUT"
      echo "" >> "$OUTPUT"
    done
  fi
}

echo "Empaquetant codi font React..."
add_files "src" "js"
add_files "src" "jsx"
add_files "src" "css"

echo "Empaquetant codi PHP del Plugin..."
add_files "wordpress-plugin" "php"

echo "Empaquetant Skills i Regles..."
add_files ".agents" "md"

echo "Empaquetant Scripts de Tooling..."
add_files "tooling" "js"
add_files "tooling" "mjs"
add_files "tooling" "cjs"
add_files "tooling" "py"

echo "Bundle completat. Mida:"
du -sh "$OUTPUT"
