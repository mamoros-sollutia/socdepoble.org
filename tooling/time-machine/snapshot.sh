#!/usr/bin/env bash
# tooling/time-machine/snapshot.sh
set -euo pipefail
STAMP=$(date +%Y%m%d_%H%M%S)
ROOT="$(git rev-parse --show-toplevel)"
SNAP_DIR="$ROOT/.time-machine/$STAMP"
mkdir -p "$SNAP_DIR"
# Copia només el que importa ( Pedra Seca + React core + wiki )
rsync -a --include='*/' \
  --include='disseny_pedra_seca.html' \
  --include='src/css/**' \
  --include='src/universal/**' \
  --include='_wiki_de_poble/**' \
  --exclude='*' \
  "$ROOT/" "$SNAP_DIR/"
echo "$STAMP" > "$ROOT/.time-machine/LATEST"
git add -A && git commit -m "time-machine: snapshot $STAMP" || true
