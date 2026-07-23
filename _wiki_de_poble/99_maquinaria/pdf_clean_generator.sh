#!/bin/bash

# pdf_clean_generator.sh
# Genera un PDF a partir d'un HTML usant Chrome Headless i neteja els PDFs vells amb el mateix nom base.

if [ "$#" -ne 2 ]; then
    echo "Ús: $0 <arxiu_origen_html> <arxiu_desti_pdf>"
    exit 1
fi

HTML_IN="$1"
PDF_OUT="$2"

# Extraiem el directori de destí i el nom base sense extensió ni sufixos innecessaris
DEST_DIR=$(dirname "$PDF_OUT")
BASE_NAME=$(basename "$PDF_OUT" .pdf)

# Neteja prèvia: esborrem qualsevol PDF que continga el mateix patró base a eixa carpeta
# per evitar duplicats (ex: Proposta_NLnet.pdf vs Proposta_NLnet_Condensed.pdf)
echo "Netejant versions antigues del PDF..."
find "$DEST_DIR" -type f -name "${BASE_NAME%%_*}*.pdf" -exec rm -v {} \;

echo "Generant nou PDF..."
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --headless --disable-gpu --print-to-pdf="$PDF_OUT" "file://$HTML_IN"

echo "PDF generat correctament: $PDF_OUT"
