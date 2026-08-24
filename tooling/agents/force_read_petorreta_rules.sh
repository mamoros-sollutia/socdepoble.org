#!/bin/bash
# Script per a forçar a l'Agent a llegir les normes de la Petorreta i el Nom Termodinàmic.
echo "⚠️ ATENCIÓ AGENT (IAIA MarIA):"
echo "Abans de generar cap Petorreta, has de llegir el protocol i usar el NOM TERMODINÀMIC correcte."
echo "======================================================"
cat .agents/PROTOCOL_PETORRETA.md | grep -A 5 "## P-04. Petorreta vàlida"
echo "======================================================"
echo "Recorda el format: YYMMDD_HHMM_PROMPT_Descripcio_Llarga.md"
echo "I recorda exportar al directori correcte (ex: Escriptori)."
