#!/bin/bash
# Neteja de la Bandeja d'Entrada movent arxius actius a Producció
# Executat automàticament per la skill socdepoble-workflow

SAFATA="_wiki_de_poble/04_ESCRIPTORI/00_Bandeja_d_Entrada"
PRODUCCIO="_wiki_de_poble/04_ESCRIPTORI/produccio"

mkdir -p "$PRODUCCIO"

echo "🧹 Iniciant la Neteja Termodinàmica de la Safata d'Entrada..."

if [ ! -d "$SAFATA" ]; then
  echo "La Bandeja d'Entrada no existeix. Res a fer."
  exit 0
fi

# Movem tots els arxius rellevants de disseny i treball actiu a producció
MOVED=0

for ext in html css js png jpg jpeg svg webp json md; do
  for file in "$SAFATA"/*.$ext; do
    if [ -f "$file" ]; then
      mv "$file" "$PRODUCCIO/"
      echo "✅ Mogut a producció: $(basename "$file")"
      MOVED=$((MOVED + 1))
    fi
  done
done

# Informem del resultat
if [ $MOVED -eq 0 ]; then
  echo "Safata d'entrada neta. Cap arxiu mogut a Producció."
else
  echo "🎉 Neteja completada. S'han enviat $MOVED arxius a Producció."
fi
