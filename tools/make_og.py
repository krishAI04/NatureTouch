"""Share images (1200x630) for every page, cropped from the site's own photos.

Usage: python tools/make_og.py      -> site/public/og/<name>.jpg
Run again after photos change (it reads the current masters).
"""
import glob
import os

from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = os.path.join(ROOT, "site", "src", "assets")
OUT = os.path.join(ROOT, "site", "public", "og")
os.makedirs(OUT, exist_ok=True)


def best(slug):
    """the sharpest photo of a project (most pixels), as the case-study hero uses"""
    fs = glob.glob(os.path.join(A, "projects", slug, "*.jpg"))
    return max(fs, key=lambda f: Image.open(f).size[0] * Image.open(f).size[1])


PAGES = {
    "home": os.path.join(A, "projects", "khanuj-khanna", "01.jpg"),
    "projects": os.path.join(A, "projects", "khanuj-khanna", "03.jpg"),
    "services": os.path.join(A, "projects", "signature-home", "01.jpg"),
    "nursery": os.path.join(A, "projects", "khanuj-khanna", "05.jpg"),
    "about": os.path.join(A, "scene", "after-farmhouse.jpg"),
    "contact": os.path.join(A, "scene", "dusk-pergola.jpg"),
}
for slug in os.listdir(os.path.join(A, "projects")):
    if os.path.isdir(os.path.join(A, "projects", slug)) and slug != "misc":
        PAGES[f"project-{slug}"] = best(slug)

for name, src in PAGES.items():
    im = ImageOps.fit(Image.open(src).convert("RGB"), (1200, 630), Image.LANCZOS, centering=(0.5, 0.5))
    im.save(os.path.join(OUT, f"{name}.jpg"), quality=82, optimize=True, progressive=True)
    print(name, os.path.basename(src))
