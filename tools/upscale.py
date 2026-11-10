"""Sharpen small project photos with Real-ESRGAN x4plus (ONNX, Qualcomm AI Hub build, BSD-3).

Usage: python tools/upscale.py <in.jpg> <out.jpg> [--long 2560]
The model takes fixed 128x128 tiles, so the photo is cut into overlapping tiles, each one is upscaled 4x,
and the tiles are blended back with feathered edges. The 4x result is then resized down to --long px on the
long side with Lanczos, which keeps the recovered detail without inventing a huge file.
"""
import argparse
import os
import time

import numpy as np
import onnxruntime as ort
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL = os.path.join(ROOT, "tools", "models", "real_esrgan_x4plus.onnx")
T, OV, S = 128, 16, 4          # tile, overlap, scale

_session = None


def session():
    global _session
    if _session is None:
        so = ort.SessionOptions()
        so.intra_op_num_threads = os.cpu_count() or 4
        _session = ort.InferenceSession(MODEL, so, providers=["CPUExecutionProvider"])
    return _session


def ramp(n, ov):
    """1D weights: fade in/out over the overlap so neighbouring tiles blend without seams."""
    w = np.ones(n, np.float32)
    r = np.linspace(0, 1, ov * S + 2, dtype=np.float32)[1:-1]
    w[: ov * S] = r
    w[-ov * S:] = r[::-1]
    return w


def upscale(img: Image.Image) -> Image.Image:
    a = np.asarray(img.convert("RGB"), np.float32) / 255.0
    h, w, _ = a.shape
    # pad so the tiling covers the whole image
    ph = max(T, int(np.ceil((h - OV) / (T - OV))) * (T - OV) + OV)
    pw = max(T, int(np.ceil((w - OV) / (T - OV))) * (T - OV) + OV)
    a = np.pad(a, ((0, ph - h), (0, pw - w), (0, 0)), mode="reflect")
    out = np.zeros((ph * S, pw * S, 3), np.float32)
    acc = np.zeros((ph * S, pw * S, 1), np.float32)
    wt = np.outer(ramp(T * S, OV), ramp(T * S, OV))[..., None]
    sess = session()
    name = sess.get_inputs()[0].name
    for y in range(0, ph - OV, T - OV):
        for x in range(0, pw - OV, T - OV):
            tile = a[y:y + T, x:x + T].transpose(2, 0, 1)[None]
            res = sess.run(None, {name: tile})[0][0].transpose(1, 2, 0)
            out[y * S:(y + T) * S, x * S:(x + T) * S] += res * wt
            acc[y * S:(y + T) * S, x * S:(x + T) * S] += wt
    out = (out / np.maximum(acc, 1e-6))[: h * S, : w * S]
    return Image.fromarray((np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8))


def keep_colour(up: Image.Image, orig: Image.Image) -> Image.Image:
    """The model shifts colour and contrast a little. Keep its fine detail but take the broad colour
    from the original: up + (blur(original) - blur(up))."""
    r = max(2, up.size[0] // 400)
    o = orig.convert("RGB").resize(up.size, Image.LANCZOS).filter(ImageFilter.GaussianBlur(r))
    u = up.filter(ImageFilter.GaussianBlur(r))
    a = np.asarray(up, np.float32) + np.asarray(o, np.float32) - np.asarray(u, np.float32)
    return Image.fromarray(np.clip(a + 0.5, 0, 255).astype(np.uint8))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("dst")
    ap.add_argument("--long", type=int, default=2560)
    ap.add_argument("--size", help="exact WxH for the output (overrides --long)")
    a = ap.parse_args()
    t = time.time()
    big = upscale(Image.open(a.src))
    if a.size:
        tw, th = map(int, a.size.lower().split("x"))
    else:
        k = a.long / max(big.size)
        tw, th = round(big.size[0] * k), round(big.size[1] * k)
    out = keep_colour(big.resize((tw, th), Image.LANCZOS), Image.open(a.src))
    out.save(a.dst, quality=90, subsampling=0)
    print(f"{os.path.basename(a.src)} -> {tw}x{th} in {time.time() - t:.0f}s")


if __name__ == "__main__":
    main()
