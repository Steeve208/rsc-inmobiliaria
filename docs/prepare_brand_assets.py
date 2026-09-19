#!/usr/bin/env python3
"""Extract transparent REESKOVA brand assets from source images."""

from __future__ import annotations

import os

import numpy as np
from PIL import Image

DIR = os.path.join(os.path.dirname(__file__), "assets")
MARK_SRC = os.path.join(
    os.path.dirname(__file__),
    "..",
    ".cursor",
    "projects",
    "home-usuario-rea-de-Trabalho-rsc-market",
    "assets",
    "image-57215aea-4bc6-4284-bb4d-bc7ebb383e04.png",
)
# fallback if cursor path missing
MARK_FALLBACK = os.path.join(DIR, "reeskova-logo-primary.png")
FULL_SRC = os.path.join(DIR, "reeskova-logo-primary.png")


def remove_green(path: str, out: str) -> None:
    img = Image.open(path).convert("RGBA")
    px = np.array(img)
    r, g, b = px[..., 0], px[..., 1], px[..., 2]
    green_bg = (g > r + 10) & (g > b + 10) & (g > 55)
    dark_bg = (r < 50) & (g < 80) & (b < 60)
    gold = (r > 110) & (g > 85) & (b < 150)
    alpha = np.where(gold, 255, np.where(green_bg | dark_bg, 0, px[..., 3]))
    px[..., 3] = alpha.astype(np.uint8)
    Image.fromarray(px).save(out)


def trim_transparent(path: str) -> Image.Image:
    img = Image.open(path).convert("RGBA")
    bbox = img.getbbox()
    return img.crop(bbox) if bbox else img


def main() -> None:
    mark_src = MARK_SRC if os.path.exists(MARK_SRC) else MARK_FALLBACK
    mark_out = os.path.join(DIR, "reeskova-mark.png")
    remove_green(mark_src, mark_out)
    trim_transparent(mark_out).save(mark_out)
    print(f"mark -> {mark_out}")

    if os.path.exists(FULL_SRC):
        full = Image.open(FULL_SRC)
        w, h = full.size
        word = full.crop((int(w * 0.08), int(h * 0.52), int(w * 0.92), int(h * 0.66)))
        raw = os.path.join(DIR, "_word_raw.png")
        word.save(raw)
        word_out = os.path.join(DIR, "reeskova-wordmark.png")
        remove_green(raw, word_out)
        trim_transparent(word_out).save(word_out)
        os.remove(raw)
        print(f"wordmark -> {word_out}")


if __name__ == "__main__":
    main()
