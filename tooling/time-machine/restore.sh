#!/usr/bin/env bash
# tooling/time-machine/restore.sh <stamp>
STAMP=${1:-$(cat .time-machine/LATEST)}
rsync -a --delete ".time-machine/$STAMP/" ./
echo "Restaurat a $STAMP"
