#!/usr/bin/env bash
# Upscale the photos that show large, most visible first. Originals are kept in research/originals/.
set -e
cd "$(dirname "$0")/.."
A=site/src/assets
mkdir -p research/originals
run() { # src dst [args]
  local src=$1 dst=$2; shift 2
  local bak="research/originals/${src#$A/}"; mkdir -p "$(dirname "$bak")"
  [ -f "$bak" ] || cp "$src" "$bak"
  python tools/upscale.py "$bak" "$dst" "$@"
}
# 1. the plot-to-garden scene (after = Vinay Bajaj 03; before = the AI plot image)
run $A/projects/vinay-bajaj-farm-house/03.jpg $A/scene/after-farmhouse.jpg --size 3072x2048
python -c "from PIL import Image; Image.open('$A/scene/after-farmhouse.jpg').resize((2560,1707), Image.LANCZOS).save('$A/projects/vinay-bajaj-farm-house/03.jpg', quality=90)"
run $A/scene/before-farmhouse.jpg $A/scene/before-farmhouse.jpg --size 3072x2048
# 2. photos in the homepage project films and panels
for f in signature-home/01 signature-home/02 signature-home/03 raipur-airport/01 raipur-airport/03 raipur-airport/04 raipur-airport/05 serikhedi/02 serikhedi/03 romansque/01 romansque/02 romansque/03 romansque/04; do
  run $A/projects/$f.jpg $A/projects/$f.jpg --long 2560
done
# serikhedi 01 was hand-enlarged earlier; start from the untouched original
python tools/upscale.py research/serikhedi-01-before-upscale.jpg $A/projects/serikhedi/01.jpg --long 2560
# 3. the other case-study heroes
for f in vinay-bajaj-farm-house/01 avinash-maruti-home/01 jspl-naya-raipur/01 avinash-new-county/02; do
  run $A/projects/$f.jpg $A/projects/$f.jpg --long 2560
done
echo ALL DONE
