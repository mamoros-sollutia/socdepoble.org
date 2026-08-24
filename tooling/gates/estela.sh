#!/bin/sh
# estela.sh — Anell 1 de la Time Machine.
# Contracte: no falla MAI, no demana permís, no toca HEAD ni l'índex ni el
# worktree. Crea un commit real en una referència privada, invisible per a
# `git log`, `git status` i `git push`, però protegida de `git gc`.
set -u
ARREL=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0
cd "$ARREL" || exit 0

# EL TRUC: un índex propi. `git add -A` mai toca el teu staging area.
GIT_INDEX_FILE="$ARREL/.git/sdp-estela.index"
export GIT_INDEX_FILE

git add -A --force >/dev/null 2>&1
ARBRE=$(git write-tree 2>/dev/null) || exit 0

PARE=$(git rev-parse --verify -q refs/sdp/estela 2>/dev/null)
# Deduplicació: si res ha canviat, no fem commit. Cridar-ho 500 cops és gratis.
if [ -n "$PARE" ] && [ "$(git rev-parse -q "${PARE}^{tree}")" = "$ARBRE" ]; then
  exit 0
fi

MISSATGE="estela $(date -u +%Y-%m-%dT%H:%M:%SZ) ${1:-auto}"
if [ -n "$PARE" ]; then
  NOU=$(printf '%s\n' "$MISSATGE" | git commit-tree "$ARBRE" -p "$PARE")
else
  NOU=$(printf '%s\n' "$MISSATGE" | git commit-tree "$ARBRE")
fi

git update-ref refs/sdp/estela "$NOU"
exit 0
