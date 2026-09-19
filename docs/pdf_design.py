"""REESKOVA corporate PDF — layout, brand assets, auto-pagination."""

from __future__ import annotations

import os

from reportlab.lib.colors import Color, HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas

W, H = A4
MX, MB = 18 * mm, 14 * mm
CONTENT_W = W - 2 * MX
HERO_H = 30 * mm
HEADER_H = 10 * mm
FOOTER_H = 10 * mm
BLOCK_GAP = 4 * mm

GREEN_DARK = HexColor("#0B2218")
GREEN_MID = HexColor("#163D30")
GREEN_SOFT = HexColor("#E8F0EC")
GOLD = HexColor("#C9A84C")
GOLD_LIGHT = HexColor("#E8D9A8")
CREAM = HexColor("#FAF8F5")
INK = HexColor("#142820")
MUTED = HexColor("#5A6B63")
SOFT = HexColor("#2D3B36")
FOOTER_C = HexColor("#7A8A82")

SLOGAN = "bâtit un avenir meilleur"

PAGE_HERO = [
    "img-platform.jpg",
    "img-fragmented.jpg",
    "img-home.jpg",
    "img-business.jpg",
    "promo-platform.jpg",
    "img-finance.jpg",
    "img-city.jpg",
    "img-vehicles.jpg",
    "img-open.jpg",
    "promo-home.jpg",
    "img-cta.jpg",
]


def wrap(c, text, font, size, max_width):
    words = text.split()
    lines, line = [], ""
    for w in words:
        test = (line + " " + w).strip()
        if c.stringWidth(test, font, size) <= max_width:
            line = test
        else:
            if line:
                lines.append(line)
            line = w
    if line:
        lines.append(line)
    return lines


class ReeskovaPDFDesign:
    def __init__(self, assets_dir: str, total_pages: int = 12):
        self.assets = assets_dir
        self.total = total_pages
        self.mark = os.path.join(assets_dir, "reeskova-mark.png")
        self.wordmark = os.path.join(assets_dir, "reeskova-wordmark.png")

    def content_top(self, with_hero: bool) -> float:
        if with_hero:
            return H - HERO_H - HEADER_H - 8 * mm
        return H - HEADER_H - 12 * mm

    def content_bottom(self) -> float:
        return MB + FOOTER_H + 2 * mm

    def _hero_for(self, page_index: int) -> str | None:
        if not PAGE_HERO:
            return None
        name = PAGE_HERO[(page_index - 1) % len(PAGE_HERO)]
        path = os.path.join(self.assets, name)
        return path if os.path.exists(path) else None

    def _img_aspect(self, path: str) -> float:
        try:
            from PIL import Image

            w, h = Image.open(path).size
            return w / h if h else 1.0
        except Exception:
            return 1.0

    def _draw_mark(self, c, cx: float, bottom_y: float, height_mm: float):
        if not os.path.exists(self.mark):
            return height_mm
        aspect = self._img_aspect(self.mark)
        w_mm = height_mm * aspect
        c.drawImage(
            self.mark, cx - w_mm / 2, bottom_y,
            width=w_mm, height=height_mm,
            preserveAspectRatio=True, mask="auto",
        )
        return height_mm

    def _draw_wordmark(self, c, cx: float, bottom_y: float, width_mm: float) -> float:
        if not os.path.exists(self.wordmark):
            c.setFillColor(GOLD_LIGHT)
            c.setFont("Helvetica-Bold", 18)
            c.drawCentredString(cx, bottom_y + 2 * mm, "reeskOva")
            return 8 * mm
        aspect = self._img_aspect(self.wordmark)
        h_mm = width_mm / aspect
        c.drawImage(
            self.wordmark, cx - width_mm / 2, bottom_y,
            width=width_mm, height=h_mm,
            preserveAspectRatio=True, mask="auto",
        )
        return h_mm

    def _two_col_metrics(self, c, block) -> tuple[list[float], float]:
        blocks2 = block[1]
        gap = 4 * mm
        bw = (CONTENT_W - gap) / 2
        rows = (len(blocks2) + 1) // 2
        row_heights: list[float] = []
        for row in range(rows):
            rh = 0.0
            for col in (0, 1):
                i = row * 2 + col
                if i >= len(blocks2):
                    continue
                _, desc = blocks2[i]
                lines = wrap(c, desc, "Helvetica", 6.3, bw - 6 * mm)
                rh = max(rh, 5 * mm + min(3, len(lines)) * 7 + 2 * mm)
            row_heights.append(rh)
        total = sum(row_heights) + max(0, rows - 1) * 2 * mm + 2 * mm
        return row_heights, total

    def _steps_height(self, block) -> float:
        return 24 * mm

    def block_height(self, c, block, width=CONTENT_W) -> float:
        kind = block[0]
        if kind == "h1":
            return 6 * mm
        if kind == "sub":
            return 4.5 * mm
        if kind == "audiences":
            return len(wrap(c, block[1], "Helvetica", 7.2, width)) * 8.5 + 2 * mm
        if kind == "p":
            size, leading = (block[2], block[3]) if len(block) > 3 else (7.8, 10)
            return len(wrap(c, block[1], "Helvetica", size, width)) * leading + 2 * mm
        if kind == "h2":
            return 10 * mm
        if kind == "label":
            return 5 * mm
        if kind == "callout":
            lines = wrap(c, block[1], "Helvetica-Oblique", 7.2, width - 8 * mm)
            return len(lines) * 9 + 12
        if kind == "bullets":
            h = 0.0
            for item in block[1]:
                h += len(wrap(c, item, "Helvetica", 7.5, width - 5 * mm)) * 9.8 + 2
            return h + 2 * mm
        if kind == "table":
            _, rows = block[1], block[2]
            col_w = block[3] if len(block) > 3 and block[3] else [width * 0.32, width * 0.68]
            fs = block[4] if len(block) > 4 else 6.9
            h = 6 * mm
            for row in rows:
                max_lines = 1
                for i, cell in enumerate(row):
                    font = "Helvetica-Bold" if i == 0 else "Helvetica"
                    max_lines = max(max_lines, len(wrap(c, cell, font, fs, col_w[i] - 3 * mm)))
                h += max(5.2 * mm, max_lines * 2.9 * mm + 2 * mm) + 0.6 * mm
            return h + 2 * mm
        if kind == "steps":
            return self._steps_height(block)
        if kind == "two_col":
            return self._two_col_metrics(c, block)[1]
        if kind == "toc":
            return len(block[1]) * 3.8 * mm + 2 * mm
        if kind == "stat_row":
            return 14 * mm
        if kind == "gap":
            return block[1]
        if kind == "brand":
            return 0
        return 3 * mm

    def paginate(self, c, blocks, with_hero: bool = True):
        top = self.content_top(with_hero)
        bottom = self.content_bottom()
        pages: list[list] = []
        current: list = []
        y = top
        for block in blocks:
            bh = self.block_height(c, block) + BLOCK_GAP
            if current and y - bh < bottom:
                pages.append(current)
                current = []
                y = top
            current.append(block)
            y -= bh
        if current:
            pages.append(current)
        return pages

    def render_cover(self, c, blocks, footer_label: str, contact: str):
        subtitle = footer_label.replace("REESKOVA · ", "").strip()

        # Full-bleed hero background
        hero = os.path.join(self.assets, "promo-home.jpg")
        if not os.path.exists(hero):
            hero = os.path.join(self.assets, "img-home.jpg")
        if os.path.exists(hero):
            c.drawImage(hero, 0, 0, width=W, height=H, preserveAspectRatio=False)
        else:
            c.setFillColor(GREEN_DARK)
            c.rect(0, 0, W, H, fill=1, stroke=0)

        # Cinematic overlays
        c.setFillColor(Color(0.04, 0.12, 0.09, alpha=0.72))
        c.rect(0, 0, W, H, fill=1, stroke=0)
        c.setFillColor(Color(0.02, 0.08, 0.06, alpha=0.55))
        c.rect(0, 0, W, H * 0.38, fill=1, stroke=0)
        c.setFillColor(Color(0.02, 0.06, 0.05, alpha=0.82))
        c.rect(0, 0, W, H * 0.14, fill=1, stroke=0)
        c.setFillColor(Color(0.02, 0.06, 0.05, alpha=0.88))
        c.rect(0, 0, W, MB + 16 * mm, fill=1, stroke=0)

        # Subtle gold frame
        c.setStrokeColor(Color(0.79, 0.66, 0.30, alpha=0.45))
        c.setLineWidth(0.6)
        c.rect(MX - 2 * mm, MB + 6 * mm, CONTENT_W + 4 * mm, H - MB - 12 * mm, fill=0, stroke=1)

        # Brand stack — vertically centred in upper area
        cy = H * 0.56
        mark_h = 44 * mm
        mark_bottom = cy + 8 * mm
        self._draw_mark(c, W / 2, mark_bottom, mark_h)

        # Wordmark
        c.setFillColor(GOLD_LIGHT)
        c.setFont("Helvetica-Bold", 26)
        c.drawCentredString(W / 2, cy - 10 * mm, "reeskOva")

        c.setFillColor(GOLD)
        c.setFont("Helvetica-Oblique", 10)
        c.drawCentredString(W / 2, cy - 18 * mm, SLOGAN)

        # Gold ornament
        cx = W / 2
        oy = cy - 24 * mm
        c.setStrokeColor(GOLD)
        c.setLineWidth(0.7)
        c.line(cx - 32 * mm, oy, cx - 4 * mm, oy)
        c.line(cx + 4 * mm, oy, cx + 32 * mm, oy)
        c.setFillColor(GOLD)
        c.circle(cx, oy, 1.3 * mm, fill=1, stroke=0)

        # Document title
        c.setFillColor(white)
        c.setFont("Helvetica-Bold", 13)
        c.drawCentredString(W / 2, cy - 32 * mm, subtitle.upper())

        # Audiences / tagline from blocks
        tag_y = cy - 40 * mm
        for b in blocks:
            if b[0] == "audiences":
                c.setFillColor(Color(1, 1, 1, alpha=0.78))
                c.setFont("Helvetica", 7.5)
                for ln in wrap(c, b[1], "Helvetica", 7.5, CONTENT_W - 30 * mm):
                    c.drawCentredString(W / 2, tag_y, ln)
                    tag_y -= 9

        # Bottom tagline
        c.setFillColor(Color(1, 1, 1, alpha=0.65))
        c.setFont("Helvetica", 7)
        c.drawCentredString(W / 2, MB + 22 * mm, "One Marketplace  ·  Endless Opportunities")
        c.setFillColor(Color(1, 1, 1, alpha=0.5))
        c.setFont("Helvetica", 6.5)
        c.drawCentredString(W / 2, MB + 16 * mm, "RSC Group  ·  Publishing & connection platform")

        c.setFillColor(Color(1, 1, 1, alpha=0.55))
        c.setFont("Helvetica", 6)
        c.drawCentredString(W / 2, MB + 9 * mm, contact)
        c.setFillColor(GOLD)
        c.setFont("Helvetica-Bold", 7)
        c.drawRightString(W - MX, MB + 9 * mm, f"01 / {self.total:02d}")

    def render_closing(self, c, blocks, footer_label: str, page_no: int, contact: str):
        c.setFillColor(GREEN_DARK)
        c.rect(0, 0, W, H, fill=1, stroke=0)
        self._draw_mark(c, W / 2, H - 70 * mm, 30 * mm)
        self._draw_wordmark(c, W / 2, H - 78 * mm, 46 * mm)
        c.setFillColor(GOLD)
        c.setFont("Helvetica-Oblique", 8)
        c.drawCentredString(W / 2, H - 88 * mm, SLOGAN)
        c.setFillColor(GOLD_LIGHT)
        c.setFont("Helvetica-Bold", 14)
        c.drawCentredString(W / 2, H - 100 * mm, "One Marketplace. Endless Opportunities.")
        y = H - 114 * mm
        for b in blocks:
            if b[0] == "p":
                c.setFillColor(Color(1, 1, 1, alpha=0.78))
                c.setFont("Helvetica", 7.2)
                for ln in wrap(c, b[1], "Helvetica", 7.2, CONTENT_W - 24 * mm):
                    c.drawCentredString(W / 2, y, ln)
                    y -= 8.5
            elif b[0] == "callout":
                c.setFillColor(GOLD)
                c.setFont("Helvetica-Bold", 7.5)
                for ln in wrap(c, b[1], "Helvetica-Bold", 7.5, CONTENT_W - 20 * mm):
                    c.drawCentredString(W / 2, y, ln)
                    y -= 9
        c.setFillColor(Color(1, 1, 1, alpha=0.5))
        c.setFont("Helvetica", 6)
        c.drawCentredString(W / 2, MB + 3 * mm, f"{footer_label}  ·  {contact}")
        c.drawRightString(W - MX, MB, f"{page_no:02d} / {self.total:02d}")

    def _draw_page_frame(self, c, page_no: int, footer_label: str, with_hero: bool, hero_index: int):
        c.setFillColor(CREAM)
        c.rect(0, 0, W, H, fill=1, stroke=0)
        if with_hero:
            hero = self._hero_for(hero_index)
            if hero:
                c.drawImage(hero, 0, H - HERO_H, width=W, height=HERO_H, preserveAspectRatio=False)
                c.setFillColor(Color(0.04, 0.13, 0.09, alpha=0.68))
                c.rect(0, H - HERO_H, W, HERO_H, fill=1, stroke=0)
        bar_y = H - HERO_H - HEADER_H if with_hero else H - HEADER_H
        c.setFillColor(GREEN_DARK)
        c.rect(0, bar_y, W, HEADER_H, fill=1, stroke=0)
        self._draw_mark(c, MX + 4 * mm, bar_y + 1 * mm, 7 * mm)
        c.setFillColor(GOLD_LIGHT)
        c.setFont("Helvetica-Bold", 8)
        c.drawString(MX + 13 * mm, bar_y + 5.5 * mm, "reeskOva")
        c.setFillColor(Color(1, 1, 1, alpha=0.65))
        c.setFont("Helvetica", 5.8)
        c.drawString(MX + 13 * mm, bar_y + 2 * mm, footer_label)
        c.setFillColor(GOLD)
        c.setFont("Helvetica-Bold", 7)
        c.drawRightString(W - MX, bar_y + 4 * mm, f"{page_no:02d} / {self.total:02d}")

    def _draw_footer(self, c, page_no: int, contact: str):
        c.setFillColor(FOOTER_C)
        c.setFont("Helvetica", 6)
        c.drawString(MX, MB, contact)
        c.drawRightString(W - MX, MB, f"{page_no:02d} / {self.total:02d}")

    def draw_block(self, c, block, y: float) -> float:
        kind = block[0]
        if kind == "h1":
            c.setFillColor(INK)
            c.setFont("Helvetica-Bold", 13)
            c.drawString(MX, y, block[1])
            return y - 6 * mm
        if kind == "sub":
            c.setFillColor(MUTED)
            c.setFont("Helvetica", 8.2)
            c.drawString(MX, y, block[1])
            return y - 4.5 * mm
        if kind == "audiences":
            c.setFillColor(MUTED)
            c.setFont("Helvetica", 7.2)
            c.drawString(MX, y, block[1])
            return y - 5 * mm
        if kind == "p":
            size, leading = (block[2], block[3]) if len(block) > 3 else (7.8, 10)
            c.setFillColor(SOFT)
            c.setFont("Helvetica", size)
            for ln in wrap(c, block[1], "Helvetica", size, CONTENT_W):
                c.drawString(MX, y, ln)
                y -= leading
            return y - 2 * mm
        if kind == "h2":
            c.setFillColor(GOLD)
            c.setFont("Helvetica-Bold", 11)
            c.drawString(MX, y, f"{block[1]:02d}")
            c.setFillColor(INK)
            c.setFont("Helvetica-Bold", 9.2)
            c.drawString(MX + 8 * mm, y + 0.3 * mm, block[2].upper())
            y -= 3 * mm
            c.setStrokeColor(GOLD)
            c.setLineWidth(0.6)
            c.line(MX, y, MX + 38 * mm, y)
            return y - 5 * mm
        if kind == "label":
            c.setFillColor(GREEN_MID)
            c.setFont("Helvetica-Bold", 8.5)
            c.drawString(MX, y, block[1].upper())
            return y - 5 * mm
        if kind == "callout":
            lines = wrap(c, block[1], "Helvetica-Oblique", 7.2, CONTENT_W - 8 * mm)
            h = len(lines) * 9 + 10
            c.setFillColor(GREEN_SOFT)
            c.roundRect(MX, y - h, CONTENT_W, h, 2 * mm, fill=1, stroke=0)
            c.setStrokeColor(GOLD)
            c.setLineWidth(1.2)
            c.line(MX + 1.5 * mm, y - 2, MX + 1.5 * mm, y - h + 2)
            c.setFillColor(SOFT)
            c.setFont("Helvetica-Oblique", 7.2)
            ty = y - 7
            for ln in lines:
                c.drawString(MX + 5 * mm, ty, ln)
                ty -= 9
            return y - h - 4 * mm
        if kind == "bullets":
            for item in block[1]:
                c.setFillColor(GOLD)
                c.setFont("Helvetica-Bold", 6.5)
                c.drawString(MX + 0.5 * mm, y, "◆")
                c.setFillColor(SOFT)
                c.setFont("Helvetica", 7.5)
                for ln in wrap(c, item, "Helvetica", 7.5, CONTENT_W - 5 * mm):
                    c.drawString(MX + 4.5 * mm, y, ln)
                    y -= 9.8
                y -= 1.5 * mm
            return y - 1 * mm
        if kind == "table":
            headers, rows = block[1], block[2]
            col_w = block[3] if len(block) > 3 and block[3] else [CONTENT_W * 0.32, CONTENT_W * 0.68]
            fs = block[4] if len(block) > 4 else 6.9
            c.setFillColor(GREEN_MID)
            c.setFont("Helvetica-Bold", 6.5)
            x = MX
            for i, htxt in enumerate(headers):
                c.drawString(x + 1.5 * mm, y - 3.2 * mm, htxt.upper())
                x += col_w[i]
            y -= 6 * mm
            for ri, row in enumerate(rows):
                cell_lines, max_lines = [], 1
                for i, cell in enumerate(row):
                    font = "Helvetica-Bold" if i == 0 else "Helvetica"
                    lines = wrap(c, cell, font, fs, col_w[i] - 3 * mm)
                    cell_lines.append((font, lines))
                    max_lines = max(max_lines, len(lines))
                hh = max(5.2 * mm, max_lines * 2.9 * mm + 2 * mm)
                if ri % 2 == 0:
                    c.setFillColor(GREEN_SOFT)
                    c.roundRect(MX, y - hh, CONTENT_W, hh, 1 * mm, fill=1, stroke=0)
                x = MX
                for i, (font, lines) in enumerate(cell_lines):
                    c.setFont(font, fs)
                    c.setFillColor(GREEN_MID if i == 0 else SOFT)
                    ty = y - 3.2 * mm
                    for ln in lines:
                        c.drawString(x + 1.5 * mm, ty, ln)
                        ty -= 2.9 * mm
                    x += col_w[i]
                y -= hh + 0.6 * mm
            return y - 2 * mm
        if kind == "steps":
            items = block[1]
            n = len(items)
            gap = 2 * mm
            bw = (CONTENT_W - gap * (n - 1)) / n
            total_h = self._steps_height(block)
            cy = y - 9 * mm
            c.setStrokeColor(GOLD_LIGHT)
            c.setLineWidth(0.5)
            c.line(MX + bw / 2, cy, MX + CONTENT_W - bw / 2, cy)
            x = MX
            for i, (title, desc) in enumerate(items):
                cx = x + bw / 2
                c.setFillColor(GREEN_MID)
                c.circle(cx, cy, 2.6 * mm, fill=1, stroke=0)
                c.setFillColor(GOLD_LIGHT)
                c.setFont("Helvetica-Bold", 6)
                c.drawCentredString(cx, cy - 1 * mm, str(i + 1))
                c.setFillColor(INK)
                c.setFont("Helvetica-Bold", 6.5)
                c.drawCentredString(cx, y - 14 * mm, title)
                c.setFillColor(MUTED)
                c.setFont("Helvetica", 5.5)
                ty = y - 18 * mm
                for ln in wrap(c, desc, "Helvetica", 5.5, bw - 3 * mm)[:2]:
                    c.drawCentredString(cx, ty, ln)
                    ty -= 6.5
                x += bw + gap
            return y - total_h - 2 * mm
        if kind == "two_col":
            blocks2 = block[1]
            gap = 4 * mm
            bw = (CONTENT_W - gap) / 2
            row_heights, _ = self._two_col_metrics(c, block)
            yy = y
            for row, rh in enumerate(row_heights):
                for col in (0, 1):
                    i = row * 2 + col
                    if i >= len(blocks2):
                        continue
                    title, desc = blocks2[i]
                    x = MX + col * (bw + gap)
                    top = yy
                    c.setFillColor(GOLD)
                    c.circle(x + 2.5 * mm, top - 3 * mm, 1.2 * mm, fill=1, stroke=0)
                    c.setFillColor(INK)
                    c.setFont("Helvetica-Bold", 6.8)
                    c.drawString(x + 5.5 * mm, top - 3.8 * mm, title)
                    c.setFillColor(SOFT)
                    c.setFont("Helvetica", 6.3)
                    ty = top - 7.5 * mm
                    for ln in wrap(c, desc, "Helvetica", 6.3, bw - 6 * mm)[:3]:
                        c.drawString(x + 5.5 * mm, ty, ln)
                        ty -= 7
                yy -= rh + 2 * mm
            return yy - 1 * mm
        if kind == "toc":
            for t in block[1]:
                c.setFillColor(SOFT)
                c.setFont("Helvetica", 7.3)
                c.drawString(MX + 2 * mm, y, t)
                y -= 3.8 * mm
            return y - 2 * mm
        if kind == "stat_row":
            items = block[1]
            n = len(items)
            gap = 3 * mm
            bw = (CONTENT_W - gap * (n - 1)) / n
            box_h = 12 * mm
            x = MX
            for val, label in items:
                c.setFillColor(GREEN_MID)
                c.roundRect(x, y - box_h, bw, box_h, 2 * mm, fill=1, stroke=0)
                c.setFillColor(GOLD_LIGHT)
                c.setFont("Helvetica-Bold", 10)
                c.drawCentredString(x + bw / 2, y - 5 * mm, val)
                c.setFillColor(Color(1, 1, 1, alpha=0.88))
                c.setFont("Helvetica", 5.8)
                c.drawCentredString(x + bw / 2, y - 8.5 * mm, label)
                x += bw + gap
            return y - box_h - 4 * mm
        if kind == "gap":
            return y - block[1]
        return y - 3 * mm

    def render_content_page(self, c, page_no: int, blocks, footer_label: str, contact: str, hero_index: int):
        with_hero = True
        self._draw_page_frame(c, page_no, footer_label, with_hero, hero_index)
        y = self.content_top(with_hero)
        bottom = self.content_bottom()
        for block in blocks:
            bh = self.block_height(c, block) + BLOCK_GAP
            if y - bh < bottom:
                break
            y = self.draw_block(c, block, y)
            y -= BLOCK_GAP
        self._draw_footer(c, page_no, contact)

    def render_document(self, c, cover_blocks, body_blocks, closing_blocks, footer_label: str, contact: str):
        pages = self.paginate(c, body_blocks, with_hero=True)
        self.total = 1 + len(pages) + 1
        self.render_cover(c, cover_blocks, footer_label, contact)
        for i, page_blocks in enumerate(pages, 1):
            c.showPage()
            self.render_content_page(c, i + 1, page_blocks, footer_label, contact, i)
        c.showPage()
        self.render_closing(c, closing_blocks, footer_label, self.total, contact)
