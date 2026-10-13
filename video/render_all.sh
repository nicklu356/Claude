#!/bin/bash
# Render the whole timeline in N parallel segments, then concatenate.
# usage: ./render_all.sh <scale> <out.mp4> [workers]
set -e
SCALE=$1; OUT=$2; N=${3:-3}
cd "$(dirname "$0")"
TOTAL=$(python3 -c "import json;tl=json.load(open('web/timeline.json'));print(round(tl['duration']*tl['fps']))")
mkdir -p build/seg; rm -f build/seg/*.mp4 build/seg/list.txt
PER=$(( (TOTAL + N - 1) / N ))
for i in $(seq 0 $((N-1))); do
  FROM=$((i*PER)); TO=$(( (i+1)*PER )); [ $TO -gt $TOTAL ] && TO=$TOTAL
  node render.js --shadow ${SHADOW:-2048} --scale $SCALE --from $FROM --to $TO --out build/seg/seg$i.mp4 2>&1 | grep -v DEP0 &
  echo "file 'seg$i.mp4'" >> build/seg/list.txt
done
wait
ffmpeg -loglevel error -y -f concat -safe 0 -i build/seg/list.txt -c copy "$OUT"
echo "done $OUT frames=$TOTAL"
