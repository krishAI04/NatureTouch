"""Client logos in their own colours, cut out of their white boxes and trimmed, for the marble partners plaque.

Usage: python tools/make_logos.py
Reads research/raw/logos/, writes site/src/assets/clients/<key>.png (transparent, trimmed, max 480 px wide).
"""
import os

import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, "research", "raw", "logos")
OUT = os.path.join(ROOT, "site", "src", "assets", "clients")

SOURCES = {
    "jspl": "1200px-Jindal_Steel_and_Power_Logo.svg_.png",
    "avinash": "avinash-group.png",
    "wallfort": "cropped-Wallfort-Properties-Logo.png",
    "raipur-smart-city": "download.png",
    "nrda": "nrda-logo.png",
    "singhania": "singhania.png",
}


def cut_white(im: Image.Image) -> Image.Image:
    """Near-white becomes transparent with a soft edge, so the logo sits on marble without a white box."""
    a = np.asarray(im.convert("RGBA"), np.float32)
    rgb, alpha = a[..., :3], a[..., 3]
    whiteness = rgb.min(axis=2)                       # 255 = pure white
    fade = np.clip((250 - whiteness) / 30, 0, 1)      # >=250 gone, <=220 kept
    a[..., 3] = alpha * fade
    return Image.fromarray(a.astype(np.uint8), "RGBA")


def trim(im: Image.Image, pad: int = 4) -> Image.Image:
    box = im.getchannel("A").point(lambda v: 255 if v > 12 else 0).getbbox()
    if not box:
        return im
    l, t, r, b = box
    return im.crop((max(0, l - pad), max(0, t - pad), min(im.width, r + pad), min(im.height, b + pad)))


if __name__ == "__main__":
    for key, name in SOURCES.items():
        im = trim(cut_white(Image.open(os.path.join(RAW, name))))
        if im.width > 480:
            im = im.resize((480, round(im.height * 480 / im.width)), Image.LANCZOS)
        im.save(os.path.join(OUT, f"{key}.png"), optimize=True)
        print(key, im.size)
