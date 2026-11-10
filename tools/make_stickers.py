"""Cut out plants/flowers and turn them into die-cut stickers (white border + soft shadow).

Usage: python tools/make_stickers.py
Inputs are listed in JOBS; outputs go to site/src/assets/stickers/<name>.png (transparent, max 900px).
"""
import json
import os
import sys

from PIL import Image, ImageFilter
from rembg import new_session, remove

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "site", "src", "assets", "stickers")
os.makedirs(OUT, exist_ok=True)

plants = json.load(open(os.path.join(ROOT, "research", "raw", "plants3", "index.json")))
PICK = {0: "ficus", 3: "echeveria", 6: "pentas", 7: "coleus", 10: "oxalis", 14: "begonia",
        15: "succulent", 17: "rubber-plant", 18: "rhoeo", 24: "areca-palm", 27: "vinca",
        29: "sago-palm", 46: "dracaena", 35: "cordyline", 37: "pothos", 45: "anthurium"}

JOBS = [(os.path.join(ROOT, plants[k][1]), f"plant-{name}") for k, name in PICK.items()]
for b in ["bougainvillea", "hibiscus", "frangipani", "marigold", "lotus"]:
    JOBS.append((os.path.join(ROOT, "assets", "ai", f"bloom-{b}.png"), f"bloom-{b}"))

session = new_session("u2net")
BORDER = 14   # px at 900px output: the die-cut white edge
MAX = 900


def sticker(src: str, name: str) -> str:
    im = Image.open(src).convert("RGB")
    im.thumbnail((1400, 1400))
    cut = remove(im, session=session, post_process_mask=True)          # RGBA
    a = cut.getchannel("A").point(lambda v: 255 if v > 110 else 0)      # hard edge for a clean die-cut
    a = a.filter(ImageFilter.MedianFilter(5))
    bbox = a.getbbox()
    if not bbox:
        raise RuntimeError(f"empty cut-out: {src}")
    cut.putalpha(a)
    cut = cut.crop(bbox)
    cut.thumbnail((MAX - 4 * BORDER, MAX - 4 * BORDER), Image.LANCZOS)
    w, h = cut.size
    pad = BORDER * 2
    canvas_size = (w + 2 * pad, h + 2 * pad)

    alpha = Image.new("L", canvas_size, 0)
    alpha.paste(cut.getchannel("A"), (pad, pad))
    # die-cut outline: grow the silhouette and round it
    outline = alpha.filter(ImageFilter.MaxFilter(2 * BORDER + 1)).filter(ImageFilter.GaussianBlur(2)).point(lambda v: 255 if v > 100 else 0)
    shadow = outline.filter(ImageFilter.GaussianBlur(8)).point(lambda v: int(v * 0.28))

    out = Image.new("RGBA", canvas_size, (0, 0, 0, 0))
    sh = Image.new("RGBA", canvas_size, (8, 30, 18, 0)); sh.putalpha(shadow)
    out.alpha_composite(sh, (0, 0) if False else (0, 0))
    out = Image.alpha_composite(Image.new("RGBA", canvas_size, (0, 0, 0, 0)), _offset(sh, 3, 6))
    white = Image.new("RGBA", canvas_size, (250, 251, 248, 0)); white.putalpha(outline)
    out.alpha_composite(white)
    out.alpha_composite(cut, (pad, pad))
    dst = os.path.join(OUT, f"{name}.png")
    out.save(dst, optimize=True)
    return dst


def _offset(img: Image.Image, dx: int, dy: int) -> Image.Image:
    shifted = Image.new("RGBA", img.size, (0, 0, 0, 0))
    shifted.paste(img, (dx, dy))
    return shifted


if __name__ == "__main__":
    only = set(sys.argv[1:])
    for src, name in JOBS:
        if only and name not in only:
            continue
        print(name, "->", os.path.relpath(sticker(src, name), ROOT))
