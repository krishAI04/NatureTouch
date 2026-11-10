"""Ken Burns films from stills: slow zoom/pan per photo, 1 s dissolves, muted, 1280x720 H.264 + poster.

Usage: python tools/make_films.py [slug ...]
Outputs: site/public/films/<slug>.mp4 and <slug>.jpg (poster = first frame of the first photo).
"""
import json
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "site", "src", "assets", "projects")
OUT = os.path.join(ROOT, "site", "public", "films")
os.makedirs(OUT, exist_ok=True)

FPS, SEC, FADE = 30, 5.0, 1.0
W, H = 1280, 720
CRF = {"hero-reel": "35", "khanuj-khanna": "35"}  # foliage-dense films need more compression

FILMS = {
    "hero-reel": [("khanuj-khanna", "01"), ("khanuj-khanna", "04"), ("vinay-bajaj-farm-house", "01"), ("khanuj-khanna", "06"), ("signature-home", "01")],
    "khanuj-khanna": [("khanuj-khanna", n) for n in ("04", "05", "06", "07", "08")],
    "avinash-new-county": [("avinash-new-county", n) for n in ("01", "02", "06", "07")],
    "avinash-maruti-home": [("avinash-maruti-home", n) for n in ("01", "02", "03")],
    "vinay-bajaj-farm-house": [("vinay-bajaj-farm-house", n) for n in ("01", "02", "03")],
    "signature-home": [("signature-home", n) for n in ("01", "02", "03")],
    "romansque": [("romansque", n) for n in ("01", "02", "03", "04")],
    "raipur-airport": [("raipur-airport", n) for n in ("01", "03", "04", "05")],
    "serikhedi": [("serikhedi", n) for n in ("01", "02", "03")],
    "jspl-naya-raipur": [("jspl-naya-raipur", n) for n in ("01", "02", "03", "04")],
}

# alternate the move so consecutive shots don't feel identical
MOVES = [
    "z='min(1.0+0.001*on,1.05)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'",           # slow push in
    "z='1.05':x='(iw-iw/zoom)*on/{n}':y='ih/2-(ih/zoom/2)'",                             # pan left→right
    "z='max(1.05-0.001*on,1.0)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'",           # slow pull out
    "z='1.05':x='(iw-iw/zoom)*(1-on/{n})':y='ih/2-(ih/zoom/2)'",                         # pan right→left
]


def film(name, shots):
    frames = int(FPS * SEC)
    inputs, chains = [], []
    for i, (slug, n) in enumerate(shots):
        inputs += ["-loop", "1", "-t", str(SEC), "-i", os.path.join(SRC, slug, f"{n}.jpg")]
        move = MOVES[i % len(MOVES)].format(n=frames)
        chains.append(
            f"[{i}]scale={W*2}:{H*2}:force_original_aspect_ratio=increase,crop={W*2}:{H*2},"
            f"zoompan={move}:d={frames}:s={W}x{H}:fps={FPS},trim=duration={SEC},setsar=1,format=yuv420p[s{i}]"
        )
    last, offset = "s0", SEC - FADE
    for i in range(1, len(shots)):
        out = f"x{i}"
        chains.append(f"[{last}][s{i}]xfade=transition=fade:duration={FADE}:offset={offset:.2f}[{out}]")
        last, offset = out, offset + SEC - FADE
    mp4 = os.path.join(OUT, f"{name}.mp4")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", ";".join(chains),
                    "-map", f"[{last}]", "-an", "-c:v", "libx264", "-preset", "veryslow", "-tune", "film", "-crf", CRF.get(name, "33"),
                    "-movflags", "+faststart", "-pix_fmt", "yuv420p", mp4], check=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", mp4, "-frames:v", "1", "-q:v", "4",
                    os.path.join(OUT, f"{name}.jpg")], check=True)
    return os.path.getsize(mp4)


if __name__ == "__main__":
    wanted = sys.argv[1:] or list(FILMS)
    for name in wanted:
        print(f"{name}: {film(name, FILMS[name]) / 1e6:.2f} MB")
