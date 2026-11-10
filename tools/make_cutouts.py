"""Clean plant cut-outs (no sticker border, no shadow) for the botanical plates.

Usage: python tools/make_cutouts.py
Same sources as make_stickers.py; outputs site/src/assets/plants/<name>.png (transparent, max 900px).
"""
import json
import os

from PIL import Image, ImageFilter
from rembg import new_session, remove

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "site", "src", "assets", "plants")
os.makedirs(OUT, exist_ok=True)
plants = json.load(open(os.path.join(ROOT, "research", "raw", "plants3", "index.json")))
PICK = {0: "ficus", 3: "echeveria", 7: "coleus", 14: "begonia", 17: "rubber-plant",
        24: "areca-palm", 29: "sago-palm", 46: "dracaena", 35: "cordyline", 45: "anthurium"}
session = new_session("isnet-general-use")

for k, name in PICK.items():
    im = Image.open(os.path.join(ROOT, plants[k][1])).convert("RGB")
    im.thumbnail((1400, 1400))
    cut = remove(im, session=session, post_process_mask=True)
    a = cut.getchannel("A").filter(ImageFilter.GaussianBlur(0.6))   # soft, natural edge
    cut.putalpha(a)
    cut = cut.crop(a.point(lambda v: 255 if v > 40 else 0).getbbox())
    cut.thumbnail((900, 900), Image.LANCZOS)
    cut.save(os.path.join(OUT, f"{name}.png"), optimize=True)
    print(name, cut.size)
