#!/usr/bin/env python3
"""Generate REESKOVA corporate presentation PDFs in EN, PT and FR."""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white, Color
import os
import sys

W, H = A4
MX, MT, MB = 16 * mm, 13 * mm, 13 * mm
ACCENT = HexColor("#8B3A26")
ACCENT_SOFT = HexColor("#F5F0ED")
INK = HexColor("#181818")
MUTED = HexColor("#555555")
SOFT = HexColor("#2F2F2F")
RULE = HexColor("#D6D6D6")
FOOTER_C = HexColor("#888888")
TABLE_LINE = HexColor("#D2CBC6")
EMAIL = "rscgroupltda@gmail.com"
PHONE = "+33 7 85 61 86 44"
WEB = "www.rscchain.com"
DIR = os.path.dirname(__file__)
ASSETS = os.path.join(DIR, "assets")
BG = os.path.join(ASSETS, "bg")
LOGO = os.path.join(ASSETS, "rsc-group-logo.png")
TOTAL = 12

# ───────────────────────── helpers ─────────────────────────

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


def draw_bg(c, n):
    path = os.path.join(BG, f"bg-{n:02d}.jpg")
    if os.path.exists(path):
        c.drawImage(path, 0, 0, width=W, height=H, preserveAspectRatio=False)
    else:
        c.setFillColor(white)
        c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(Color(1, 1, 1, alpha=0.96))
    c.rect(MX - 1.5 * mm, MB + 5 * mm, W - 2 * MX + 3 * mm, H - MT - MB - 26 * mm, fill=1, stroke=0)


def draw_header(c):
    if os.path.exists(LOGO):
        c.drawImage(LOGO, MX, H - MT - 16 * mm, width=13 * mm, height=14 * mm, mask="auto", preserveAspectRatio=True, anchor="c")
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 9.5)
    c.drawCentredString(W / 2, H - MT - 3.5 * mm, "RSC Group")
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 6.8)
    c.drawCentredString(W / 2, H - MT - 7.5 * mm, "Building the Next Generation of Digital Platforms")
    c.setFont("Helvetica", 6.5)
    c.drawCentredString(W / 2, H - MT - 11 * mm, WEB)
    right, y = W - MX, H - MT - 3.5 * mm
    c.setFont("Helvetica", 6.5)
    for label in [EMAIL, WEB, PHONE]:
        c.setFillColor(ACCENT)
        c.circle(right - c.stringWidth(label, "Helvetica", 6.5) - 3 * mm, y + 1 * mm, 1 * mm, fill=1, stroke=0)
        c.setFillColor(MUTED)
        c.drawRightString(right, y, label)
        y -= 3.4 * mm
    y_rule = H - MT - 18 * mm
    c.setStrokeColor(ACCENT)
    c.setLineWidth(0.8)
    c.line(MX, y_rule, W - MX, y_rule)
    return y_rule - 5.5 * mm


def draw_footer(c, page, footer_label):
    c.setStrokeColor(RULE)
    c.setLineWidth(0.4)
    c.line(MX, MB + 3.5 * mm, W - MX, MB + 3.5 * mm)
    c.setFillColor(FOOTER_C)
    c.setFont("Helvetica", 6)
    c.drawString(MX, MB - 0.5 * mm, f"{footer_label}  ·  {WEB}  ·  {EMAIL}")
    c.drawRightString(W - MX, MB - 0.5 * mm, f"{page:02d} / {TOTAL:02d}")


def render_blocks(c, blocks, footer_label, page_no, bg_n):
    draw_bg(c, bg_n)
    y = draw_header(c)
    for b in blocks:
        kind = b[0]
        if kind == "h1":
            c.setFillColor(INK)
            c.setFont("Helvetica-Bold", 15)
            c.drawString(MX, y, b[1])
            y -= 5 * mm
        elif kind == "sub":
            c.setFillColor(MUTED)
            c.setFont("Helvetica", 8.5)
            c.drawString(MX, y, b[1])
            y -= 3.5 * mm
        elif kind == "audiences":
            c.setFillColor(MUTED)
            c.setFont("Helvetica", 7.2)
            c.drawString(MX, y, b[1])
            y -= 5.5 * mm
        elif kind == "p":
            size, leading = (b[2], b[3]) if len(b) > 3 else (8.2, 11)
            c.setFillColor(SOFT)
            c.setFont("Helvetica", size)
            for ln in wrap(c, b[1], "Helvetica", size, W - 2 * MX):
                c.drawString(MX, y, ln)
                y -= leading
            y -= 1.5 * mm
        elif kind == "h2":
            c.setFillColor(ACCENT)
            c.setFont("Helvetica-Bold", 8.5)
            c.drawString(MX, y, f"{b[1]:02d}")
            c.setFillColor(INK)
            c.setFont("Helvetica-Bold", 9.5)
            c.drawString(MX + 7 * mm, y, b[2].upper())
            y -= 5.2 * mm
        elif kind == "label":
            c.setFillColor(INK)
            c.setFont("Helvetica-Bold", 9)
            c.drawString(MX, y, b[1].upper())
            y -= 5 * mm
        elif kind == "callout":
            lines = wrap(c, b[1], "Helvetica-Oblique", 7.8, W - 2 * MX - 7 * mm)
            h = len(lines) * 10.2 + 8
            c.setFillColor(ACCENT_SOFT)
            c.rect(MX, y - h, W - 2 * MX, h, fill=1, stroke=0)
            c.setFillColor(SOFT)
            c.setFont("Helvetica-Oblique", 7.8)
            ty = y - 8
            for ln in lines:
                c.drawString(MX + 3 * mm, ty, ln)
                ty -= 10.2
            y = y - h - 3 * mm
        elif kind == "bullets":
            for item in b[1]:
                c.setFillColor(ACCENT)
                c.circle(MX + 1.1 * mm, y + 1.1 * mm, 0.85 * mm, fill=1, stroke=0)
                c.setFillColor(SOFT)
                c.setFont("Helvetica", 7.9)
                for ln in wrap(c, item, "Helvetica", 7.9, W - 2 * MX - 4.5 * mm):
                    c.drawString(MX + 4.2 * mm, y, ln)
                    y -= 10.5
                y -= 1.2 * mm
            y -= 1 * mm
        elif kind == "table":
            headers, rows = b[1], b[2]
            max_w = W - 2 * MX
            col_w = b[3] if len(b) > 3 and b[3] is not None else [max_w * 0.30, max_w * 0.70]
            fs = b[4] if len(b) > 4 else 7.3
            c.setFillColor(ACCENT_SOFT)
            c.rect(MX, y - 5.8 * mm, max_w, 5.8 * mm, fill=1, stroke=0)
            c.setStrokeColor(TABLE_LINE)
            c.setLineWidth(0.45)
            c.line(MX, y, W - MX, y)
            c.line(MX, y - 5.8 * mm, W - MX, y - 5.8 * mm)
            c.setFillColor(ACCENT)
            c.setFont("Helvetica-Bold", 6.6)
            x = MX
            for i, h in enumerate(headers):
                c.drawString(x + 2 * mm, y - 3.9 * mm, h.upper())
                x += col_w[i]
            y -= 5.8 * mm
            for row in rows:
                cell_lines, max_lines = [], 1
                for i, cell in enumerate(row):
                    font = "Helvetica-Bold" if i == 0 else "Helvetica"
                    lines = wrap(c, cell, font, fs, col_w[i] - 4 * mm)
                    cell_lines.append((font, lines))
                    max_lines = max(max_lines, len(lines))
                hh = max(6.8 * mm, max_lines * 3.15 * mm + 2.6 * mm)
                c.setStrokeColor(TABLE_LINE)
                c.setLineWidth(0.35)
                c.line(MX, y - hh, W - MX, y - hh)
                x = MX
                for i, (font, lines) in enumerate(cell_lines):
                    c.setFont(font, fs)
                    c.setFillColor(INK if i == 0 else SOFT)
                    ty = y - 3.6 * mm
                    for ln in lines:
                        c.drawString(x + 2 * mm, ty, ln)
                        ty -= 3.15 * mm
                    x += col_w[i]
                y -= hh
            y -= 1.8 * mm
        elif kind == "steps":
            items = b[1]
            bh = b[2] if len(b) > 2 else 17 * mm
            n = len(items)
            gap = 2.2 * mm
            bw = (W - 2 * MX - gap * (n - 1)) / n
            x = MX
            for i, (title, desc) in enumerate(items):
                c.setFillColor(ACCENT_SOFT)
                c.rect(x, y - bh, bw, bh, fill=1, stroke=0)
                c.setFillColor(ACCENT)
                c.setFont("Helvetica-Bold", 7.2)
                c.drawString(x + 2 * mm, y - 4.8 * mm, f"{i + 1:02d}")
                c.setFillColor(INK)
                c.setFont("Helvetica-Bold", 7)
                c.drawString(x + 2 * mm, y - 9 * mm, title)
                c.setFillColor(MUTED)
                c.setFont("Helvetica", 6)
                ty = y - 12.5 * mm
                for ln in wrap(c, desc, "Helvetica", 6, bw - 3.5 * mm)[:2]:
                    c.drawString(x + 2 * mm, ty, ln)
                    ty -= 7
                x += bw + gap
            y -= bh + 3 * mm
        elif kind == "two_col":
            blocks2 = b[1]
            bh = b[2] if len(b) > 2 else 16 * mm
            gap = 2.5 * mm
            bw = (W - 2 * MX - gap) / 2
            for i, (title, desc) in enumerate(blocks2):
                col, row = i % 2, i // 2
                x = MX + col * (bw + gap)
                yy = y - row * (bh + 2 * mm)
                c.setFillColor(ACCENT_SOFT)
                c.rect(x, yy - bh, bw, bh, fill=1, stroke=0)
                c.setFillColor(ACCENT)
                c.setFont("Helvetica-Bold", 7.4)
                c.drawString(x + 2.5 * mm, yy - 4.8 * mm, title)
                c.setFillColor(SOFT)
                c.setFont("Helvetica", 6.6)
                ty = yy - 9.2 * mm
                for ln in wrap(c, desc, "Helvetica", 6.6, bw - 5 * mm)[:3]:
                    c.drawString(x + 2.5 * mm, ty, ln)
                    ty -= 8
            rows = (len(blocks2) + 1) // 2
            y -= rows * (bh + 2 * mm) + 1.5 * mm
        elif kind == "brand":
            c.setFillColor(ACCENT)
            c.setFont("Helvetica-Bold", 9)
            c.drawString(MX, y, "RSC GROUP")
            y -= 3.5 * mm
            c.setFillColor(MUTED)
            c.setFont("Helvetica", 7.5)
            c.drawString(MX, y, f"REESKOVA  ·  {WEB}  ·  {EMAIL}  ·  {PHONE}")
            y -= 3 * mm
        elif kind == "gap":
            y -= b[1]
        elif kind == "toc":
            for t in b[1]:
                c.setFillColor(SOFT)
                c.setFont("Helvetica", 7.8)
                c.drawString(MX, y, t)
                y -= 4.4 * mm
            y -= 2 * mm
    draw_footer(c, page_no, footer_label)


# ───────────────────────── CONTENT ─────────────────────────

CONTACT = f"{EMAIL} · {PHONE} · {WEB}"

def pages_en():
    f = "REESKOVA · Corporate Presentation"
    return f, [
        # 1
        [
            ("h1", "REESKOVA"),
            ("sub", "Corporate Presentation for Companies"),
            ("audiences", "Real-estate firms  ·  Dealerships  ·  Developers  ·  Service partners  ·  Multi-branch operations"),
            ("p", "REESKOVA is the premium marketplace for properties, vehicles and services powered by RSC Group. This document presents, in operational detail, the digital infrastructure available to companies that want to publish verified inventory, capture qualified demand and manage the commercial relationship with buyers and investors without handing the closing process to an intermediary agency.", 8.3, 11.2),
            ("p", "The platform combines a public discovery layer (a multilingual, multi-market B2B2C marketplace) with a private operations layer (Company Portal / Backoffice). RSC / REESKOVA publishes and connects; negotiation, paperwork and closing remain exclusively between the listing company and the customer.", 8.3, 11.2),
            ("callout", "Institutional principle: REESKOVA is a publishing and connection platform. It does not intermediate contracts, custody funds or handle legal procedures. This framework sets clear expectations for companies, buyers and ecosystem partners."),
            ("h2", 1, "Purpose of this document"),
            ("bullets", [
                "Explain REESKOVA’s positioning within the RSC Group ecosystem and its role toward the listing company.",
                "Describe verticals, the buyer journey, SaaS capabilities and corporate verification rules.",
                "Document the actual flows for onboarding, inventory publishing, contact and visit scheduling.",
                "Define institutional boundaries, reciprocal commitments and official contact channels.",
                "Serve as an evaluation basis for onboarding real-estate firms, dealerships, developers and partners.",
            ]),
            ("h2", 2, "Product operating scope"),
            ("table", ["Dimension", "Detail"], [
                ["Verticals", "Properties, vehicles, services and credit options published by partners"],
                ["Model", "B2B2C marketplace + Company Portal / Backoffice for verified advertisers"],
                ["Markets", "Multi-market configuration with a strategic LATAM+ and international focus"],
                ["Interface languages", "Portuguese, Spanish, English, French, German, Italian and Arabic"],
                ["Company admission", "Corporate application with verification before operational activation"],
                ["RSC role", "Publishing and connection; no contract intermediation or fund custody"],
            ]),
            ("h2", 3, "Contents"),
            ("toc", [
                "04  RSC Group and the definition of REESKOVA",
                "05  Market context and value proposition",
                "06  Verticals, publishing rules and audiences",
                "07  Buyer journey and contact points",
                "08  SaaS infrastructure and operating architecture",
                "09  Onboarding, verification and activation",
                "10  Daily operations: publish, leads and visits",
                "11  Discovery, ecosystem and governance",
                "12  Official channels and next steps",
            ]),
            ("label", "How to use this document"),
            ("bullets", [
                "Executive leadership and partnerships: assess strategic fit with REESKOVA infrastructure.",
                "Operations and sales: review the journey, SaaS panel and lead/visit flows before onboarding.",
                "Internal legal / compliance: align the publish-and-connect principle with company policies.",
                f"Official contact to proceed: {CONTACT}",
            ]),
        ],
        # 2
        [
            ("h2", 4, "RSC Group — parent company"),
            ("p", "RSC Group is the parent technology company of a multi-product ecosystem focused on digital infrastructure, markets and associated services. Its institutional identity — professional, sober and technology-forward — sets the visual, operating and reputational standard for group brands, including REESKOVA."),
            ("p", "The group combines marketplace, chain, wallet, financial services and applied technology capabilities. REESKOVA concentrates the premium marketplace experience for properties, vehicles and services, while other units contribute complementary layers without changing the marketplace principle of no contractual intermediation."),
            ("h2", 5, "Ecosystem map"),
            ("table", ["Unit / brand", "Role"], [
                ["REESKOVA (RSC Market)", "Premium B2B2C marketplace + Company Portal / Backoffice for verified advertisers"],
                ["RSC Chain / Reesk Chain", "Blockchain infrastructure and chain technology layer of the ecosystem"],
                ["RSC Wallet", "Wallet and payments capabilities within the group"],
                ["RSC Bank · RSC Capital", "Financial services and capital associated with the ecosystem"],
                ["Ora Technology", "Technology partner of the group"],
                ["Auxiliary services", "Escrow, P2P and Corporate layers when activated within the RSC ecosystem"],
            ]),
            ("h2", 6, "Operational definition of REESKOVA"),
            ("p", "REESKOVA is a B2B2C marketplace: associated and verified companies manage listings from the Company Portal / Backoffice; consumers do not publish. Buyers discover inventory, contact the advertiser, schedule visits and advance the purchase directly with the company. RSC enables publishing, discovery, messaging and scheduling infrastructure; it does not replace the advertiser in the commercial relationship."),
            ("table", ["Dimension", "Institutional detail"], [
                ["Legal-operating nature", "Publishing and connection platform; not a real-estate or automotive brokerage"],
                ["B2B model", "SaaS infrastructure and digital distribution for verified companies"],
                ["Who publishes", "Only associated companies after onboarding and verification"],
                ["Who buys / browses", "Consumers, investors and users of the public marketplace"],
                ["Verticals", "Properties, vehicles, services and credit options published by partners"],
                ["Product coverage", "Multi-market configuration with strategic LATAM+ communication"],
                ["Languages", "Seven interface languages for regional and international operations"],
                ["Explicit boundary", "No contract intermediation, no fund custody, no legal paperwork"],
            ]),
            ("callout", "Positioning in brief: “A marketplace, not an agency.” The company keeps commercial control; REESKOVA provides infrastructure, audience and operating tools."),
        ],
        # 3
        [
            ("h2", 7, "Market context"),
            ("p", "The digital environment for properties, vehicles and services remains fragmented. Companies operate across disconnected vertical portals, with heavy competition for impressions, weak lead traceability and little integration between discovery, contact, visits and commercial follow-up. Buyers, by contrast, expect a continuous and transparent journey."),
            ("bullets", [
                "Isolated vertical portals force companies to duplicate inventory, brand presence and commercial effort.",
                "Impression-led metrics do not guarantee conversation or a qualified visit.",
                "Without CRM connected to the demand channel, leads are lost across WhatsApp, forms and scattered email.",
                "Buyer trust erodes in open classifieds with weak advertiser verification.",
                "LATAM+ and adjacent markets concentrate growing digital demand in housing, mobility and services.",
                "Multi-branch operations need consistent corporate identity and centralized inventory control.",
            ]),
            ("h2", 8, "REESKOVA value proposition for companies"),
            ("p", "REESKOVA answers that context with a unified ecosystem: multi-vertical distribution, actionable leads in a panel, verified identity, and a clear separation between digital infrastructure and closing responsibility."),
            ("two_col", [
                ("Unified distribution", "One channel for properties, vehicles and services inside a coherent purchase journey."),
                ("Actionable leads", "Chats, requests and visits reach the company’s operating environment — not only traffic metrics."),
                ("Verified trust", "Marketplace reserved for associated companies; RSC seal visible on profile and listings."),
                ("Commercial control", "Price, negotiation, contract and payment remain between advertiser and customer."),
                ("SaaS operations", "Listings, CRM, chat, scheduling, analytics and AI on shared infrastructure."),
                ("Expanded ecosystem", "Financing, insurance and contextual services without making RSC the deal intermediary."),
            ], 17 * mm),
            ("h2", 9, "Expected operating outcomes"),
            ("bullets", [
                "Stronger brand coherence when publishing inventory under a verified corporate identity.",
                "Less friction between public discovery and internal commercial response.",
                "Traceability of contacts and visits with clear statuses for the sales team.",
                "Scalability across markets and languages without rebuilding the channel from scratch.",
                "Legal-operating alignment: the company closes; the platform connects.",
            ]),
            ("callout", "Commercial focus of the For Companies product: publish listings, receive qualified leads and run operations in the SaaS panel, inside an ecosystem built for real-estate firms, dealerships and developers."),
        ],
        # 4
        [
            ("h2", 10, "Marketplace verticals"),
            ("p", "REESKOVA organizes supply into verticals that follow the purchase decision. The company publishes in the category it operates; the buyer navigates the ecosystem with a continuous experience, filters, map and direct contact."),
            ("table", ["Vertical", "Scope and dynamics"], [
                ["Properties", "Homes, apartments, land, commercial assets, launches, condominiums, beach and countryside; buy and rent. Published by verified real-estate firms and developers, with rich listing pages, map, comparison and contact."],
                ["Vehicles", "Cars, SUVs, motorcycles and related categories, new or used. Published by verified dealerships. The journey prioritizes fast leads, chat and visits to the point of sale."],
                ["Services", "Journey layers: insurance, moving, décor, energy, connectivity and related partners. They add contextual value without turning REESKOVA into the service intermediary."],
                ["Credit / financing", "Options published by companies or partners. Evaluation, approval and the financial agreement are between the customer and the entity. In product, the credit flag is prioritized in Brazil."],
            ], None, 7.1),
            ("h2", 11, "Publishing rules"),
            ("table", ["Rule", "Application"], [
                ["Verified companies only", "Individuals do not manage listings on the marketplace"],
                ["Backoffice as source", "Inventory is created and maintained in the company panel and synced to public showcases"],
                ["Corporate identity", "Name, logo, document, branches, hours and WhatsApp channel may be displayed"],
                ["Verified seal", "Trust signal on cards and detail pages when company/listing are verified"],
                ["Content quality", "The company is responsible for accuracy, updates and legal compliance of listings"],
                ["Removal / suspension", "RSC may remove content or restrict access for non-compliance or integrity risk"],
            ]),
            ("h2", 12, "Business audiences"),
            ("table", ["Audience", "Mode of operation"], [
                ["Real-estate firms", "Publish properties, receive qualified contacts and connect visits and partner credit options."],
                ["Dealerships", "Expose stock, capture real-time leads and accelerate showroom / point-of-sale visits."],
                ["Developers", "Launch projects, manage units and capture demand from early stages."],
                ["Agencies and retail", "Onboarding categories admitted for specialized commercial operations."],
                ["Service partners", "Participate in the journey with insurance, home, energy, financing and related offers."],
            ]),
        ],
        # 5
        [
            ("h2", 13, "Buyer journey"),
            ("p", "The journey is designed to convert discovery into a commercial relationship with the listing company. Each stage generates an operating event usable by the sales team. RSC does not organize physical logistics or documentary closing."),
            ("steps", [
                ("Search", "Explore inventory with filters, map, comparison and AI"),
                ("Contact", "RSC chat, WhatsApp or request to the advertiser"),
                ("Visit", "Schedule date and time with the company"),
                ("Negotiate", "Terms between customer and company"),
                ("Close", "Contracts and payments outside RSC"),
            ], 18 * mm),
            ("h2", 14, "Functional detail by stage"),
            ("table", ["Stage", "What happens / what the company receives"], [
                ["Search", "The buyer browses property or vehicle showcases, applies filters, switches views (list, gallery, map, satellite) and may compare options."],
                ["Contact", "From the listing page, starts RSC chat or WhatsApp. The thread or contact is routed to the listing company for commercial response."],
                ["Visit", "Completes a scheduling request; the company manages confirmation, cancellation or reschedule proposals from its panel."],
                ["Negotiate", "Price, terms, paperwork and due diligence are handled between the parties, outside RSC intermediation."],
                ["Close", "Signature, payments, registration and delivery are solely the responsibility of customer and company."],
            ], None, 7.1),
            ("h2", 15, "Contact points on the public listing"),
            ("p", "The listing page concentrates the actions that feed the company’s commercial funnel. These actions are designed to reduce friction and leave traceability in the advertiser’s operating environment."),
            ("two_col", [
                ("RSC Chat", "In-platform messaging. The team replies from the Leads Panel / Backoffice and keeps history."),
                ("WhatsApp", "Fast channel linked to the corporate number configured by the company in its operating profile."),
                ("Schedule visit", "Capture of name, phone, optional email, date, time and notes, with availability validation."),
                ("Compare & favorites", "Buyers organize alternatives; this increases recontact intent and conversation quality."),
            ], 18 * mm),
            ("callout", "Principle repeated to buyers and companies: RSC does not handle paperwork, does not sign contracts, does not custody money and does not close deals. Visits, documentation and delivery remain exclusively between customer and company."),
            ("h2", 16, "Implications for the sales team"),
            ("bullets", [
                "There must be an operating owner for chat and visit response with an internal SLA defined by the company.",
                "Listing quality (media, data, price, location) directly conditions lead quality.",
                "Verification and the RSC seal strengthen contact rates versus unverified listings on other channels.",
                "Combined use of chat + WhatsApp + scheduling covers different levels of buyer intent.",
            ]),
        ],
        # 6
        [
            ("h2", 17, "Extended proposition for companies"),
            ("p", "Joining REESKOVA is not only about listing inventory. The company operates inside infrastructure that combines public distribution, verified identity and private commercial management tools. Value is measured by the ability to convert discovery into conversation and visits."),
            ("h2", 18, "Operating benefits"),
            ("bullets", [
                "A demand channel aligned to verified inventory — not open classifieds for individuals.",
                "Centralization of chats, visits and requests with clear operating statuses for the team.",
                "Visible corporate identity: brand, document, branches, hours and WhatsApp on the marketplace.",
                "Listing sync from Backoffice to multilingual, multi-market public showcases.",
                "Ability to highlight inventory and use AI insights to prioritize commercial actions.",
                "Clear separation between digital distribution and legal responsibility for closing.",
                "Scalability for networks that need brand consistency across multiple locations.",
            ]),
            ("h2", 19, "What REESKOVA does not assume"),
            ("table", ["Out of scope", "Practical implication"], [
                ["Contract intermediation", "RSC does not draft, sign or guarantee contracts between buyer and company"],
                ["Fund custody", "RSC does not hold the deal price or act as escrow for the marketplace transaction"],
                ["Legal / registry procedures", "Notarial, registry or regulatory paperwork is outside the platform"],
                ["Closing and delivery", "Physical and legal execution of the deal belongs to the parties"],
                ["Credit approval", "If financing exists, the partner or financial advertiser decides approval"],
            ]),
            ("h2", 20, "Ideal company profile"),
            ("p", "REESKOVA is built for organizations with real inventory, commercial response capacity and willingness to uphold accuracy standards. Onboarding verifies corporate identity precisely to preserve that network quality."),
            ("bullets", [
                "Holds active inventory of properties, vehicles or services published professionally.",
                "Has a team or owner to respond to leads within commercially reasonable timelines.",
                "Accepts operating under curated-marketplace and verification rules.",
                "Values controlling the customer relationship through closing, without ceding it to a digital agency layer.",
                "Seeks multi-market or multilingual presence without fragmenting operations across isolated tools.",
            ]),
        ],
        # 7
        [
            ("h2", 21, "SaaS infrastructure — Company Portal"),
            ("p", "Day-to-day operations concentrate in the Company Portal / Backoffice. The REESKOVA marketplace syncs published inventory and delivers demand events generated by buyers. The Backoffice is the source of truth for listings and organization; the marketplace is the discovery, contact and scheduling layer."),
            ("h2", 22, "Business environment modules"),
            ("table", ["Module", "Function"], [
                ["Listing management", "Create, edit, highlight, media and active inventory control"],
                ["Leads CRM", "Organize contacts, requests and visits in one flow"],
                ["Integrated chat", "Reply to RSC threads with continuity and history"],
                ["Visit scheduling", "Manage requests with pending, confirmed, cancelled and reschedule_proposed statuses"],
                ["Analytics", "Performance visibility by listing, region and conversion"],
                ["Verified seal", "Public trust signal associated with profile and listing pages"],
                ["Sales AI", "Insights and commercial prioritization to highlight inventory"],
                ["Corporate WhatsApp", "Fast channel linked to the organization profile"],
                ["Organization data", "Logo, tax ID, branches, hours and contact details"],
                ["Network extensions", "Multi-branch and API integrations for larger-scale operations"],
            ], None, 7.1),
            ("h2", 23, "Operating architecture"),
            ("table", ["Layer", "Behavior"], [
                ["Company Backoffice", "Inventory and organization administration; source of truth for listings"],
                ["Marketplace API", "Sync of listings to public marketplace showcases"],
                ["Demand events", "Chats, visits and contacts generated publicly and consumed by the company"],
                ["Verified profile", "Trust attributes visible on cards, detail pages and search"],
                ["Buyer hub", "Buyers also keep favorites, comparisons and visits in their user space"],
            ]),
            ("h2", 24, "Data-governance implications"),
            ("bullets", [
                "The company is responsible for published content and for data received outside the platform.",
                "REESKOVA processes account, publishing, discovery, messaging and visit data under its policies.",
                "Financial or service partners involved after contact remain independently responsible for their processes.",
                "Onboarding verification may require corporate identification and contact validation.",
            ]),
            ("callout", "Deliberate design: separating distribution (marketplace) from operations (SaaS) scales audience without forcing the company to surrender control of commercial closing."),
        ],
        # 8
        [
            ("h2", 25, "Onboarding process"),
            ("p", "Company admission is verified. The process protects marketplace quality and buyer trust. This is not an instant unchecked signup: operational activation happens after RSC team validation."),
            ("steps", [
                ("Apply", "Corporate form in For Companies"),
                ("Review", "Identity and data validation within 24 h"),
                ("Activate", "Credentials and Backoffice access"),
                ("Go live", "Profile, inventory and lead handling"),
            ], 18 * mm),
            ("h2", 26, "Information required in the application"),
            ("table", ["Field", "Purpose"], [
                ["Company name", "Commercial / legal identification for the corporate profile"],
                ["Tax ID / document", "Validation of corporate existence and identity"],
                ["Corporate email", "Channel for onboarding communication and access delivery"],
                ["Phone / WhatsApp", "Operating contact during verification and activation"],
                ["Category", "Classification: real estate, automotive, agency, retail or services"],
            ]),
            ("h2", 27, "Application handling"),
            ("bullets", [
                "The application is registered with an initial pending status for internal review.",
                "The RSC team may request additional corporate verification information.",
                "Duplicate pending applications are rejected to avoid double registrations.",
                "After approval, access instructions to the Company Portal / Backoffice are sent.",
                "The company configures profile, visual identity, branches and contact channels before or when publishing inventory.",
            ]),
            ("h2", 28, "Post-approval activities"),
            ("table", ["Activity", "Expected result"], [
                ["Backoffice access", "Authorized team enters the administration environment"],
                ["Organization setup", "Logo, document, branches, hours and operating WhatsApp"],
                ["Initial publishing", "First set of active listings in the relevant vertical"],
                ["Visible verification", "Seal activation according to RSC team validation"],
                ["Demand operations", "Handling chats and visits from the leads panel"],
                ["Optimization", "Use of highlights, analytics and insights to prioritize inventory"],
            ]),
            ("callout", f"Application channel: For Companies section in REESKOVA. Institutional contact: {CONTACT}"),
        ],
        # 9
        [
            ("h2", 29, "Operation A — publish inventory"),
            ("p", "Publishing is managed in the Backoffice. Once active, the listing syncs to the marketplace and becomes available in public showcases. Data and media quality determine conversion capacity."),
            ("steps", [
                ("Create", "Data, price, location, attributes"),
                ("Media", "Photos, video and visual materials"),
                ("Publish", "Active status in Backoffice"),
                ("Sync", "Exposure in public showcase"),
                ("Optimize", "Highlights, analytics and insights"),
            ], 17 * mm),
            ("bullets", [
                "Listings must keep price, availability and attributes updated to avoid invalid leads.",
                "Professional media and correct geolocation improve discovery via map and filters.",
                "Highlights and AI insights help prioritize units or vehicles with relatively higher demand.",
                "The company retains authority to pause or remove inventory from its administration environment.",
            ]),
            ("h2", 30, "Operation B — from contact to lead"),
            ("table", ["Step", "Description"], [
                ["1", "The buyer opens the public listing page in the relevant showcase."],
                ["2", "Selects RSC chat or WhatsApp as the first contact channel."],
                ["3", "A thread or contact is generated toward the listing company."],
                ["4", "The team replies from the Leads Panel / Backoffice under its internal protocol."],
                ["5", "The conversation remains available for follow-up, qualification and external commercial closing."],
            ], [(W - 2 * MX) * 0.10, (W - 2 * MX) * 0.90]),
            ("h2", 31, "Operation C — visit scheduling"),
            ("table", ["Step", "Description"], [
                ["1", "The buyer chooses the schedule-visit action on the listing page."],
                ["2", "Enters contact details, date, time and relevant notes."],
                ["3", "The system validates the request against availability defined by the company."],
                ["4", "The visit is registered in an initial pending management status."],
                ["5", "The company confirms, cancels or proposes rescheduling; the buyer sees status in their space."],
            ], [(W - 2 * MX) * 0.10, (W - 2 * MX) * 0.90]),
            ("callout", "Visit statuses used in operations: pending, confirmed, cancelled and reschedule_proposed. This state machine enables commercial follow-up without RSC intervening in physical logistics."),
            ("h2", 32, "Operating best practices"),
            ("bullets", [
                "Define maximum first-response times for chat and visits.",
                "Keep realistic agenda slots to avoid systematic cancellations.",
                "Unify lead-qualification criteria across branches when a network exists.",
                "Record post-contact outcomes in the company’s internal CRM when applicable.",
            ]),
        ],
        # 10
        [
            ("h2", 33, "Discovery capabilities"),
            ("p", "Beyond the B2B panel, REESKOVA provides public tools that raise traffic quality toward company inventory. These capabilities exist to improve intent, not only visit volume."),
            ("two_col", [
                ("Maps and geography", "List, gallery, map and satellite views; hierarchical navigation and geocoding for local discovery."),
                ("Comparator", "Property and vehicle comparison, favorites and continuity between guest session and account."),
                ("Reeskova AI", "Natural-language search and insights oriented to commercial inventory prioritization."),
                ("Visible financing", "Signaling of partner credit options; the agreement remains with the entity."),
                ("Multilingual", "Interface in seven languages for regional and international markets."),
                ("Verified seal", "Public badge on cards and detail pages to reinforce buyer trust."),
            ], 18 * mm),
            ("h2", 34, "Relevant product surfaces"),
            ("table", ["Surface", "Function"], [
                ["For Companies", "Corporate B2B entry and value explanation for advertisers"],
                ["Company registration", "Application form for incorporation and verification"],
                ["Property showcase", "Public discovery of properties"],
                ["Vehicle showcase", "Public discovery of automotive inventory"],
                ["Services / financing", "Journey layers and partner credit options"],
                ["Company Portal / Backoffice", "Inventory, organization and demand operations administration"],
            ]),
            ("h2", 35, "Trust signals to the market"),
            ("bullets", [
                "Marketplace restricted to associated companies — not an open classifieds board for individuals.",
                "Onboarding verification before full operating access.",
                "Corporate identity visible on listing pages and search results.",
                "Institutional transparency about RSC’s role: publishes and connects; boundaries are explicit.",
                "Use, privacy and compliance policies available in the product for buyers and companies.",
            ]),
            ("h2", 36, "Implication for commercial strategy"),
            ("p", "A company operating in REESKOVA should treat the channel as demand and reputation infrastructure. Inventory consistency, response speed and clarity of corporate identity are the factors that turn presence into measurable commercial results."),
        ],
        # 11
        [
            ("h2", 37, "Ecosystem around the decision"),
            ("p", "REESKOVA is part of a broader journey inside the RSC Group ecosystem. Partners and group units may contribute complementary layers — financing, insurance, home, energy — without changing the principle that closing of the main deal remains between customer and listing company."),
            ("table", ["Layer", "Contribution"], [
                ["Financing", "Credit options visible at decision time; agreement with the corresponding entity"],
                ["Insurance", "Contextual protection associated with property or vehicle"],
                ["Home and energy", "Post-decision services: moving, décor, solar, connectivity"],
                ["RSC Group", "RSC Group, RSC Chain, wallet, bank, capital and technology partners of the ecosystem"],
            ]),
            ("h2", 38, "Institutional and legal framework"),
            ("p", "REESKOVA’s legal positioning is deliberately bounded. That clarity reduces regulatory ambiguity and aligns expectations among RSC, companies and end users."),
            ("bullets", [
                "REESKOVA / RSC Market operates as a publishing and connection platform within the RSC Group ecosystem.",
                "It does not intermediate contracts, payments or legal procedures between buyer and advertiser.",
                "It does not act as a brokerage, dealership, escrow or law firm.",
                "Advertisers and partner institutions are independently responsible for their own processes and obligations.",
                "Companies must maintain accurate information, compliant listings and responsible attention to received demand.",
                "RSC may apply quality controls, verification and suspension to protect marketplace integrity.",
            ]),
            ("h2", 39, "Reciprocal commitments"),
            ("table", ["RSC Group", "Participating company"], [
                ["Provide access to REESKOVA infrastructure", "Provide accurate and updated corporate data"],
                ["Coordinate activation via the partnerships team", "Keep listings responsible and current"],
                ["Preserve a curated and verified marketplace", "Handle leads and visits to a professional standard"],
                ["Respect the partner’s brand image", "Respect RSC / REESKOVA institutional identity"],
                ["Maintain official contact channels", "Designate a permanent internal operating contact"],
            ], [(W - 2 * MX) * 0.5, (W - 2 * MX) * 0.5], 7.0),
            ("callout", "Any specific commercial collaboration, creative annex or particular condition between RSC and a company must be documented in writing. This document is an informative corporate presentation, not a contract."),
        ],
        # 12
        [
            ("h2", 40, "How to join as a company"),
            ("p", "To operate on REESKOVA infrastructure, the company completes corporate registration in the For Companies section or writes to the RSC team. Onboarding includes verification, access activation and support to launch the profile and initial inventory."),
            ("steps", [
                ("Enter", "REESKOVA → For Companies"),
                ("Register", "Complete corporate application"),
                ("Verify", "RSC review within 24 h"),
                ("Activate", "Backoffice access and inventory"),
            ], 18 * mm),
            ("h2", 41, "Official channels"),
            ("table", ["Channel", "Detail"], [
                ["Web registration", "REESKOVA → For Companies → company registration"],
                ["Corporate email", EMAIL],
                ["Phone (France)", PHONE],
                ["Corporate website", WEB],
                ["Recommended subject", "Company onboarding — REESKOVA"],
                ["Information to include", "Legal name, country/market, vertical, approximate inventory volume and operating contact"],
            ]),
            ("h2", 42, "Preparation checklist"),
            ("bullets", [
                "Have a valid tax ID / corporate identifier ready.",
                "Define operating email and phone that will be used for verification and support.",
                "Prepare visual identity (logo) and branch/hours data when applicable.",
                "Select the initial inventory to publish after activation.",
                "Appoint an internal owner for onboarding and lead response.",
                "Internally review the non-intermediation principle to align the commercial team’s expectations.",
            ]),
            ("h2", 43, "Onboarding FAQ"),
            ("table", ["Question", "Institutional answer"], [
                ["Who can publish?", "Only associated and verified companies. Individuals do not manage listings."],
                ["Does RSC intermediate closing?", "No. It publishes and connects; negotiation, contract and payment are between the parties."],
                ["How long does verification take?", "The standard review process is up to 24 business hours of analysis."],
                ["Which verticals are accepted?", "Properties, vehicles, services and associated onboarding categories."],
                ["Where is inventory managed?", "In the Company Portal / Backoffice, synced to the public marketplace."],
            ], None, 6.9),
            ("h2", 44, "Closing"),
            ("p", "REESKOVA gives companies digital infrastructure to publish, capture demand and operate the commercial relationship with clear roles. The marketplace distributes and connects; the company decides, negotiates and closes. Incorporation is aimed at organizations that value verification, commercial control and professional digital-channel operations."),
            ("callout", f"One Marketplace. Endless Opportunities. — REESKOVA by RSC Group  ·  {CONTACT}"),
            ("p", f"Notice: REESKOVA / RSC Market is a publishing and connection platform operated within the RSC Group ecosystem. It does not intermediate contracts, custody funds or handle legal procedures. This document is informative and institutional; it does not constitute a binding offer or definitive commercial terms. For particular conditions, write to {EMAIL} or call {PHONE}. Corporate website: {WEB}.", 7.0, 9.5),
            ("brand",),
        ],
    ]


def pages_pt():
    f = "REESKOVA · Apresentação Corporativa"
    return f, [
        [
            ("h1", "REESKOVA"),
            ("sub", "Apresentação Corporativa para Empresas"),
            ("audiences", "Imobiliárias  ·  Concessionárias  ·  Construtoras  ·  Partners de serviços  ·  Operações multi-filial"),
            ("p", "A REESKOVA é o marketplace premium de imóveis, veículos e serviços impulsionado pelo RSC Group. Este documento apresenta, com detalhe operacional, a infraestrutura digital disponível para empresas que desejam publicar inventário verificado, captar demanda qualificada e gerir a relação comercial com compradores e investidores sem ceder o fechamento a uma gestora intermediária.", 8.3, 11.2),
            ("p", "A plataforma combina uma camada pública de descoberta (marketplace B2B2C multilíngue e multimercado) com uma camada privada de operação (Portal Empresas / Backoffice). A RSC / REESKOVA publica e conecta; a negociação, a documentação e o fechamento permanecem exclusivamente entre a empresa anunciante e o cliente.", 8.3, 11.2),
            ("callout", "Princípio institucional: a REESKOVA é uma plataforma de publicação e conexão. Não intermedia contratos, não custodia fundos e não realiza trâmites legais. Este marco define expectativas claras para empresas, compradores e partners do ecossistema."),
            ("h2", 1, "Objetivo deste documento"),
            ("bullets", [
                "Explicar o posicionamento da REESKOVA no ecossistema RSC Group e o seu papel perante a empresa anunciante.",
                "Descrever verticais, journey do comprador, capacidades SaaS e regras de verificação corporativa.",
                "Documentar os fluxos reais de incorporação, publicação de inventário, contacto e agenda de visitas.",
                "Definir limites institucionais, compromissos recíprocos e canais oficiais de contacto.",
                "Servir de base de avaliação para a incorporação de imobiliárias, concessionárias, construtoras e partners.",
            ]),
            ("h2", 2, "Âmbito operativo do produto"),
            ("table", ["Dimensão", "Detalhe"], [
                ["Verticais", "Imóveis, veículos, serviços e opções de crédito publicadas por partners"],
                ["Modelo", "Marketplace B2B2C + Portal Empresas / Backoffice para anunciantes verificados"],
                ["Mercados", "Configuração multimercado com foco estratégico LATAM+ e internacional"],
                ["Idiomas de interface", "Português, espanhol, inglês, francês, alemão, italiano e árabe"],
                ["Admissão de empresas", "Pedido corporativo com verificação antes da ativação operativa"],
                ["Papel da RSC", "Publicação e conexão; sem intermediação de contratos nem custódia de fundos"],
            ]),
            ("h2", 3, "Índice"),
            ("toc", [
                "04  RSC Group e definição da REESKOVA",
                "05  Contexto de mercado e proposta de valor",
                "06  Verticais, regras de publicação e audiências",
                "07  Journey do comprador e pontos de contacto",
                "08  Infraestrutura SaaS e arquitetura operativa",
                "09  Incorporação, verificação e ativação",
                "10  Operação diária: publicar, leads e visitas",
                "11  Descoberta, ecossistema e governação",
                "12  Canais oficiais e próximos passos",
            ]),
            ("label", "Como usar este documento"),
            ("bullets", [
                "Direção geral e partnerships: avaliar o encaixe estratégico com a infraestrutura REESKOVA.",
                "Operações e comercial: rever journey, painel SaaS e fluxos de leads/visitas antes do onboarding.",
                "Legal / compliance interno: alinhar o princípio de publicação e conexão com as políticas da empresa.",
                f"Contacto oficial para avanço: {CONTACT}",
            ]),
        ],
        [
            ("h2", 4, "RSC Group — empresa-mãe"),
            ("p", "O RSC Group é a empresa de tecnologia matriz de um ecossistema multiproduto orientado a infraestrutura digital, mercados e serviços associados. A sua identidade institucional — profissional, sóbria e technology-forward — define o padrão visual, operativo e reputacional das marcas do grupo, incluindo a REESKOVA."),
            ("p", "O grupo articula capacidades de marketplace, chain, wallet, serviços financeiros e tecnologia aplicada. A REESKOVA concentra a experiência de marketplace premium para imóveis, veículos e serviços, enquanto outras unidades aportam camadas complementares sem alterar o princípio de não intermediação contratual do marketplace."),
            ("h2", 5, "Mapa do ecossistema"),
            ("table", ["Unidade / marca", "Papel"], [
                ["REESKOVA (RSC Market)", "Marketplace B2B2C premium + Portal Empresas / Backoffice para anunciantes verificados"],
                ["RSC Chain / Reesk Chain", "Infraestrutura blockchain e camada tecnológica de chain do ecossistema"],
                ["RSC Wallet", "Capacidades de wallet e pagamentos dentro do grupo"],
                ["RSC Bank · RSC Capital", "Serviços financeiros e capital associados ao ecossistema"],
                ["Ora Technology", "Partner tecnológico do grupo"],
                ["Serviços auxiliares", "Camadas Escrow, P2P e Corporate quando ativadas no ecossistema RSC"],
            ]),
            ("h2", 6, "Definição operativa da REESKOVA"),
            ("p", "A REESKOVA é um marketplace B2B2C: empresas associadas e verificadas administram anúncios a partir do Portal Empresas / Backoffice; os consumidores não publicam. O comprador descobre inventário, contacta o anunciante, agenda visitas e avança a compra diretamente com a empresa. A RSC habilita a infraestrutura de publicação, descoberta, mensagens e agenda; não substitui o anunciante na relação comercial."),
            ("table", ["Dimensão", "Detalhe institucional"], [
                ["Natureza jurídico-operativa", "Plataforma de publicação e conexão; não é gestora imobiliária nem automóvel"],
                ["Modelo B2B", "Infraestrutura SaaS e distribuição digital para empresas verificadas"],
                ["Quem publica", "Exclusivamente empresas associadas após onboarding e verificação"],
                ["Quem compra / explora", "Consumidores, investidores e utilizadores do marketplace público"],
                ["Verticais", "Imóveis, veículos, serviços e opções de crédito publicadas por partners"],
                ["Cobertura do produto", "Configuração multimercado com comunicação estratégica LATAM+"],
                ["Idiomas", "Sete idiomas de interface para operação regional e internacional"],
                ["Limite explícito", "Sem intermediação de contratos, sem custódia de fundos, sem trâmites legais"],
            ]),
            ("callout", "Posicionamento resumido: «Um marketplace, não uma gestora.» A empresa mantém o controlo comercial; a REESKOVA aporta infraestrutura, audiência e ferramentas de operação."),
        ],
        [
            ("h2", 7, "Contexto de mercado"),
            ("p", "O ambiente digital de imóveis, veículos e serviços continua fragmentado. As empresas operam em portais verticais desligados, com elevada competição por impressão, baixa rastreabilidade do lead e pouca integração entre descoberta, contacto, visita e acompanhamento comercial. O comprador, pelo contrário, espera um journey contínuo e transparente."),
            ("bullets", [
                "Portais isolados por vertical obrigam a duplicar inventário, marca e esforço comercial.",
                "A métrica dominante de impressão não garante conversa nem visita qualificada.",
                "Sem CRM ligado ao canal de procura, o lead perde-se entre WhatsApp, formulários e e-mail disperso.",
                "A confiança do comprador erode-se em classificados abertos com fraca verificação de anunciantes.",
                "LATAM+ e mercados adjacentes concentram procura digital crescente em habitação, mobilidade e serviços.",
                "Operações multi-filial exigem identidade corporativa consistente e controlo centralizado de inventário.",
            ]),
            ("h2", 8, "Proposta de valor da REESKOVA para a empresa"),
            ("p", "A REESKOVA responde a esse contexto com um ecossistema unificado: distribuição multi-vertical, leads acionáveis em painel, identidade verificada e separação clara entre infraestrutura digital e responsabilidade do fechamento."),
            ("two_col", [
                ("Distribuição unificada", "Um único canal para imóveis, veículos e serviços num journey de compra coerente."),
                ("Leads acionáveis", "Chats, pedidos e visitas chegam ao ambiente operativo da empresa — não só como métrica de tráfego."),
                ("Confiança verificada", "Marketplace reservado a empresas associadas; selo RSC visível no perfil e anúncios."),
                ("Controlo comercial", "Preço, negociação, contrato e pagamento permanecem entre anunciante e cliente."),
                ("Operação SaaS", "Anúncios, CRM, chat, agenda, analytics e IA numa infraestrutura comum."),
                ("Ecossistema alargado", "Financiamento, seguros e serviços contextuais sem tornar a RSC intermediária do negócio."),
            ], 17 * mm),
            ("h2", 9, "Resultados operativos esperados"),
            ("bullets", [
                "Maior coerência de marca ao publicar inventário sob identidade corporativa verificada.",
                "Menor fricção entre descoberta pública e resposta comercial interna.",
                "Rastreabilidade de contactos e visitas com estados claros para a equipa comercial.",
                "Escalabilidade para vários mercados e idiomas sem reconstruir o canal do zero.",
                "Alinhamento jurídico-operativo: a empresa fecha; a plataforma conecta.",
            ]),
            ("callout", "Foco comercial do produto Para Empresas: publicar anúncios, receber leads qualificados e gerir a operação no painel SaaS, num ecossistema pensado para imobiliárias, concessionárias e construtoras."),
        ],
        [
            ("h2", 10, "Verticais do marketplace"),
            ("p", "A REESKOVA organiza a oferta em verticais que acompanham a decisão de compra. A empresa publica na categoria em que opera; o comprador navega o ecossistema com experiência contínua, filtros, mapa e contacto direto."),
            ("table", ["Vertical", "Âmbito e dinâmica"], [
                ["Imóveis", "Casas, apartamentos, terrenos, comerciais, lançamentos, condomínios, praia e campo; compra e arrendamento. Publicação por imobiliárias e construtoras verificadas, com ficha enriquecida, mapa, comparação e contacto."],
                ["Veículos", "Carros, SUVs, motos e categorias afins, novo ou usado. Publicação por concessionárias verificadas. O journey prioriza lead rápido, chat e visita ao ponto de venda."],
                ["Serviços", "Camadas do journey: seguros, mudanças, decoração, energia, conectividade e partners afins. Acrescentam valor contextual sem transformar a REESKOVA em intermediária do serviço."],
                ["Crédito / financiamento", "Opções publicadas por empresas ou partners. Avaliação, aprovação e acordo financeiro celebram-se entre o cliente e a entidade. No produto, a flag de crédito é priorizada no Brasil."],
            ], None, 7.1),
            ("h2", 11, "Regras de publicação"),
            ("table", ["Regra", "Aplicação"], [
                ["Apenas empresas verificadas", "Particulares não administram anúncios no marketplace"],
                ["Backoffice como origem", "O inventário é criado e mantido no painel empresarial e sincronizado para vitrinas públicas"],
                ["Identidade corporativa", "Nome, logo, documento, filiais, horários e canal WhatsApp podem ser exibidos"],
                ["Selo verificado", "Sinal de confiança em cartões e fichas quando empresa/anúncio estão verificados"],
                ["Qualidade de conteúdo", "A empresa é responsável pela veracidade, atualização e conformidade legal do anúncio"],
                ["Remoção / suspensão", "A RSC pode remover conteúdo ou restringir acesso em caso de incumprimento ou risco à integridade"],
            ]),
            ("h2", 12, "Audiências empresariais"),
            ("table", ["Audiência", "Modo de operação"], [
                ["Imobiliárias", "Publicam imóveis, recebem contactos qualificados e ligam visitas e opções de crédito de partners."],
                ["Concessionárias", "Expõem stock, capturam leads em tempo real e aceleram visitas ao showroom / ponto de venda."],
                ["Construtoras", "Lançam empreendimentos, gerem unidades e capturam procura desde fases iniciais."],
                ["Agências e retail", "Categorias admitidas no onboarding para operações comerciais especializadas."],
                ["Partners de serviços", "Participam no journey com seguros, lar, energia, financiamento e afins."],
            ]),
        ],
        [
            ("h2", 13, "Journey do comprador"),
            ("p", "O journey foi desenhado para converter descoberta em relação comercial com a empresa anunciante. Cada etapa gera um evento operativo utilizável pela equipa comercial. A RSC não organiza a logística física nem o fecho documental."),
            ("steps", [
                ("Procura", "Explora inventário com filtros, mapa, comparação e IA"),
                ("Contacta", "Chat RSC, WhatsApp ou pedido ao anunciante"),
                ("Visita", "Agenda data e hora com a empresa"),
                ("Negocia", "Condições entre cliente e empresa"),
                ("Fecha", "Contratos e pagamentos fora da RSC"),
            ], 18 * mm),
            ("h2", 14, "Detalhe funcional por etapa"),
            ("table", ["Etapa", "O que acontece / o que a empresa recebe"], [
                ["Procura", "O comprador navega vitrinas de imóveis ou veículos, aplica filtros, muda vistas (lista, galeria, mapa, satélite) e pode comparar opções."],
                ["Contacta", "Na ficha, inicia chat RSC ou WhatsApp. O fio ou contacto é dirigido à empresa anunciante para resposta comercial."],
                ["Visita", "Completa pedido de agenda; a empresa gere confirmação, cancelamento ou reagendamento no painel."],
                ["Negocia", "Preço, condições, documentação e due diligence tratam-se entre as partes, fora da intermediação RSC."],
                ["Fecha", "Assinatura, pagamentos, registo e entrega são responsabilidade exclusiva de cliente e empresa."],
            ], None, 7.1),
            ("h2", 15, "Pontos de contacto na ficha pública"),
            ("p", "A ficha do anúncio concentra as ações que alimentam o funil comercial da empresa. Estas ações reduzem fricção e deixam rastreabilidade no ambiente operativo do anunciante."),
            ("two_col", [
                ("Chat RSC", "Mensagens na plataforma. A equipa responde no Painel de leads / Backoffice e mantém histórico."),
                ("WhatsApp", "Canal rápido ligado ao número corporativo configurado pela empresa no perfil operativo."),
                ("Agendar visita", "Captura de nome, telefone, e-mail opcional, data, hora e notas, com validação de disponibilidade."),
                ("Comparar e favoritos", "O comprador organiza alternativas; aumenta intenção de recontacto e qualidade da conversa."),
            ], 18 * mm),
            ("callout", "Princípio reiterado a compradores e empresas: a RSC não faz papelada, não assina contratos, não custodia dinheiro e não fecha operações. Visita, documentação e entrega são exclusivamente entre cliente e empresa."),
            ("h2", 16, "Implicações para a equipa comercial"),
            ("bullets", [
                "Deve existir um responsável operativo de resposta a chats e visitas com SLA interno definido pela empresa.",
                "A qualidade do anúncio (media, dados, preço, localização) condiciona diretamente a qualidade do lead.",
                "A verificação e o selo RSC reforçam a taxa de contacto face a anúncios não verificados noutros canais.",
                "O uso combinado de chat + WhatsApp + agenda cobre diferentes níveis de intenção do comprador.",
            ]),
        ],
        [
            ("h2", 17, "Proposta alargada para a empresa"),
            ("p", "A incorporação na REESKOVA não consiste apenas em listar inventário. A empresa passa a operar numa infraestrutura que articula distribuição pública, identidade verificada e ferramentas privadas de gestão comercial. O valor mede-se na capacidade de converter descoberta em conversa e visita."),
            ("h2", 18, "Benefícios operativos"),
            ("bullets", [
                "Canal de procura alinhado a inventário verificado — não a classificados abertos de particulares.",
                "Centralização de chats, visitas e pedidos com estados operativos claros para a equipa.",
                "Identidade corporativa visível: marca, documento, filiais, horários e WhatsApp no marketplace.",
                "Sincronização de anúncios do Backoffice para vitrinas públicas multilíngues e multimercado.",
                "Capacidade de destacar inventário e usar insights de IA para priorizar ações comerciais.",
                "Separação nítida entre distribuição digital e responsabilidade legal do fecho.",
                "Escalabilidade para redes que precisam de consistência de marca em várias praças.",
            ]),
            ("h2", 19, "O que a REESKOVA não assume"),
            ("table", ["Fora de âmbito", "Implicação prática"], [
                ["Intermediação contratual", "A RSC não redige, assina nem garante contratos entre comprador e empresa"],
                ["Custódia de fundos", "A RSC não retém o preço da operação nem atua como escrow do deal marketplace"],
                ["Trâmites legais / registais", "Papelada notarial, registal ou regulatória é alheia à plataforma"],
                ["Fecho e entrega", "A execução física e jurídica da operação cabe às partes"],
                ["Aprovação de crédito", "Se existir financiamento, a decisão cabe à entidade partner ou anunciante financeiro"],
            ]),
            ("h2", 20, "Perfil ideal de empresa"),
            ("p", "A REESKOVA destina-se a organizações com inventário real, capacidade de atendimento comercial e vontade de manter padrões de veracidade. O onboarding verifica a identidade corporativa precisamente para preservar essa qualidade de rede."),
            ("bullets", [
                "Dispõe de inventário ativo de imóveis, veículos ou serviços publicados de forma profissional.",
                "Tem equipa ou responsável para responder a leads em prazos comercialmente razoáveis.",
                "Aceita operar sob regras de marketplace curado e verificação.",
                "Valoriza controlar a relação com o cliente até ao fecho, sem a ceder a uma camada de gestora digital.",
                "Procura presença multimercado ou multilíngue sem fragmentar a operação em ferramentas isoladas.",
            ]),
        ],
        [
            ("h2", 21, "Infraestrutura SaaS — Portal Empresas"),
            ("p", "A operação diária concentra-se no Portal Empresas / Backoffice. O marketplace REESKOVA sincroniza o inventário publicado e entrega os eventos de procura gerados pelos compradores. O Backoffice é a fonte de verdade de anúncios e organização; o marketplace é a camada de descoberta, contacto e agenda."),
            ("h2", 22, "Módulos do ambiente empresarial"),
            ("table", ["Módulo", "Função"], [
                ["Gestão de anúncios", "Criação, edição, destaques, media e controlo de inventário ativo"],
                ["CRM de leads", "Organização de contactos, pedidos e visitas num fluxo único"],
                ["Chat integrado", "Resposta a fios RSC com continuidade e histórico"],
                ["Agenda de visitas", "Gestão de pedidos com estados pending, confirmed, cancelled e reschedule_proposed"],
                ["Analytics", "Visibilidade de desempenho por anúncio, região e conversão"],
                ["Selo verificado", "Sinal público de confiança associado ao perfil e às fichas"],
                ["IA para vendas", "Insights e priorização comercial para destacar inventário"],
                ["WhatsApp corporativo", "Canal rápido ligado ao perfil da organização"],
                ["Dados da organização", "Logo, documento fiscal, filiais, horários e contactos"],
                ["Extensões de rede", "Multi-filial e integrações API para operações de maior escala"],
            ], None, 7.1),
            ("h2", 23, "Arquitetura operativa"),
            ("table", ["Camada", "Comportamento"], [
                ["Backoffice empresas", "Administração de inventário e organização; origem de verdade dos listings"],
                ["API marketplace", "Sincronização de anúncios para vitrinas públicas"],
                ["Eventos de procura", "Chats, visitas e contactos gerados na camada pública e consumidos pela empresa"],
                ["Perfil verificado", "Atributos de confiança visíveis em cartões, detalhe e pesquisa"],
                ["Buyer hub", "O comprador também conserva favoritos, comparações e visitas no seu espaço"],
            ]),
            ("h2", 24, "Implicações de governação de dados"),
            ("bullets", [
                "A empresa é responsável pelo conteúdo que publica e pelos dados que recebe fora da plataforma.",
                "A REESKOVA trata dados de conta, publicação, descoberta, mensagens e visitas conforme as suas políticas.",
                "Partners financeiros ou de serviços envolvidos após o contacto são responsáveis independentes dos seus processos.",
                "A verificação de onboarding pode exigir identificação corporativa e validação de contactos.",
            ]),
            ("callout", "Desenho deliberado: separar distribuição (marketplace) de operação (SaaS) permite escalar audiência sem obrigar a empresa a ceder o controlo do fecho comercial."),
        ],
        [
            ("h2", 25, "Processo de incorporação"),
            ("p", "A admissão de empresas é verificada. O processo protege a qualidade do marketplace e a confiança do comprador. Não se trata de um registo imediato sem revisão: a ativação operativa ocorre após validação da equipa RSC."),
            ("steps", [
                ("Pedido", "Formulário corporativo em Para Empresas"),
                ("Revisão", "Validação de identidade e dados em até 24 h"),
                ("Ativação", "Credenciais e acesso ao Backoffice"),
                ("Arranque", "Perfil, inventário e atendimento de leads"),
            ], 18 * mm),
            ("h2", 26, "Informação necessária no pedido"),
            ("table", ["Campo", "Finalidade"], [
                ["Nome da empresa", "Identificação comercial / razão social para o perfil corporativo"],
                ["Documento fiscal / ID", "Validação de existência e identidade corporativa"],
                ["E-mail corporativo", "Canal para comunicação de onboarding e entrega de acesso"],
                ["Telefone / WhatsApp", "Contacto operativo durante verificação e ativação"],
                ["Categoria", "Classificação: real estate, automotive, agency, retail ou services"],
            ]),
            ("h2", 27, "Tratamento do pedido"),
            ("bullets", [
                "O pedido é registado com estado inicial pending para revisão interna.",
                "A equipa RSC pode solicitar informação adicional de verificação corporativa.",
                "Pedidos duplicados em estado pendente são rejeitados para evitar duplos registos.",
                "Após aprovação, são enviadas instruções de acesso ao Portal Empresas / Backoffice.",
                "A empresa configura perfil, identidade visual, filiais e canais de contacto antes ou ao publicar inventário.",
            ]),
            ("h2", 28, "Atividades após a aprovação"),
            ("table", ["Atividade", "Resultado esperado"], [
                ["Acesso Backoffice", "Equipa autorizada entra no ambiente de administração"],
                ["Configuração da organização", "Logo, documento, filiais, horários e WhatsApp operativo"],
                ["Publicação inicial", "Primeiro conjunto de anúncios ativos na vertical correspondente"],
                ["Verificação visível", "Ativação do selo conforme validação da equipa RSC"],
                ["Operação de procura", "Atendimento de chats e visitas no painel de leads"],
                ["Otimização", "Uso de destaques, analytics e insights para priorizar inventário"],
            ]),
            ("callout", f"Canal de pedido: secção Para Empresas na REESKOVA. Contacto institucional: {CONTACT}"),
        ],
        [
            ("h2", 29, "Operação A — publicar inventário"),
            ("p", "A publicação é administrada no Backoffice. Depois de ativo, o anúncio sincroniza-se com o marketplace e fica disponível nas vitrinas públicas. A qualidade de dados e media determina a capacidade de conversão."),
            ("steps", [
                ("Criar", "Dados, preço, localização, atributos"),
                ("Media", "Fotos, vídeo e materiais visuais"),
                ("Publicar", "Estado ativo no Backoffice"),
                ("Sincronizar", "Exposição na vitrina pública"),
                ("Otimizar", "Destaques, analytics e insights"),
            ], 17 * mm),
            ("bullets", [
                "O anúncio deve manter preço, disponibilidade e atributos atualizados para evitar leads inválidos.",
                "Media profissional e geolocalização correta melhoram a descoberta por mapa e filtros.",
                "Destaques e insights de IA ajudam a priorizar unidades ou veículos com procura relativa mais elevada.",
                "A empresa mantém a faculdade de pausar ou retirar inventário no ambiente de administração.",
            ]),
            ("h2", 30, "Operação B — do contacto ao lead"),
            ("table", ["Passo", "Descrição"], [
                ["1", "O comprador abre a ficha pública do anúncio na vitrina correspondente."],
                ["2", "Seleciona chat RSC ou WhatsApp como canal de primeiro contacto."],
                ["3", "É gerado um fio ou contacto dirigido à empresa anunciante."],
                ["4", "A equipa responde no Painel de leads / Backoffice segundo o seu protocolo interno."],
                ["5", "A conversa fica disponível para seguimento, qualificação e fecho comercial externo."],
            ], [(W - 2 * MX) * 0.10, (W - 2 * MX) * 0.90]),
            ("h2", 31, "Operação C — agenda de visita"),
            ("table", ["Passo", "Descrição"], [
                ["1", "O comprador escolhe a ação de agendar visita na ficha."],
                ["2", "Introduz dados de contacto, data, hora e notas relevantes."],
                ["3", "O sistema valida o pedido conforme a disponibilidade definida pela empresa."],
                ["4", "A visita fica registada em estado inicial pendente de gestão."],
                ["5", "A empresa confirma, cancela ou propõe reagendar; o comprador vê o estado no seu espaço."],
            ], [(W - 2 * MX) * 0.10, (W - 2 * MX) * 0.90]),
            ("callout", "Estados de visita usados na operação: pending, confirmed, cancelled e reschedule_proposed. Esta máquina de estados permite seguimento comercial sem a RSC intervir na logística física."),
            ("h2", 32, "Boas práticas operativas"),
            ("bullets", [
                "Definir tempos máximos de primeira resposta para chat e visitas.",
                "Manter franjas de agenda realistas para evitar cancelamentos sistemáticos.",
                "Unificar critério de qualificação de leads entre filiais quando existir rede.",
                "Registar no CRM interno da empresa o resultado após o contacto (quando aplicável).",
            ]),
        ],
        [
            ("h2", 33, "Capacidades de descoberta"),
            ("p", "Além do painel B2B, a REESKOVA oferece ferramentas públicas que elevam a qualidade do tráfego para o inventário da empresa. Estas capacidades existem para melhorar intenção, não apenas volume de visitas."),
            ("two_col", [
                ("Mapas e geografia", "Vistas lista, galeria, mapa e satélite; navegação hierárquica e geocodificação para descoberta local."),
                ("Comparador", "Comparação de imóveis e veículos, favoritos e continuidade entre sessão de convidado e conta."),
                ("Reeskova AI", "Pesquisa em linguagem natural e insights orientados à priorização comercial do inventário."),
                ("Financiamento visível", "Sinalização de opções de crédito de partners; o acordo permanece com a entidade."),
                ("Multilíngue", "Interface em sete idiomas para mercados regionais e internacionais."),
                ("Selo verificado", "Badge público em cartões e fichas para reforçar a confiança do comprador."),
            ], 18 * mm),
            ("h2", 34, "Superfícies relevantes do produto"),
            ("table", ["Superfície", "Função"], [
                ["Para Empresas", "Entrada corporativa B2B e explicação de valor para anunciantes"],
                ["Registo de empresa", "Formulário de pedido de incorporação e verificação"],
                ["Vitrina de imóveis", "Descoberta pública de propriedades"],
                ["Vitrina de veículos", "Descoberta pública de inventário automóvel"],
                ["Serviços / financiamento", "Camadas do journey e opções de crédito de partners"],
                ["Portal Empresas / Backoffice", "Administração de inventário, organização e operação de procura"],
            ]),
            ("h2", 35, "Sinais de confiança para o mercado"),
            ("bullets", [
                "Marketplace restrito a empresas associadas — não é um classificado aberto de particulares.",
                "Verificação de onboarding antes do acesso operativo completo.",
                "Identidade corporativa visível em fichas e resultados de pesquisa.",
                "Transparência institucional sobre o papel da RSC: publica e conecta; os limites são explícitos.",
                "Políticas de utilização, privacidade e conformidade disponíveis no produto para compradores e empresas.",
            ]),
            ("h2", 36, "Implicação para a estratégia comercial"),
            ("p", "A empresa que opera na REESKOVA deve tratar o canal como infraestrutura de procura e reputação. Consistência de inventário, velocidade de resposta e clareza de identidade corporativa são os fatores que transformam presença em resultados comerciais mensuráveis."),
        ],
        [
            ("h2", 37, "Ecossistema em torno da decisão"),
            ("p", "A REESKOVA faz parte de um journey alargado no ecossistema RSC Group. Partners e unidades do grupo podem aportar camadas complementares — financiamento, seguros, lar, energia — sem alterar o princípio de que o fecho da operação principal permanece entre cliente e empresa anunciante."),
            ("table", ["Camada", "Contribuição"], [
                ["Financiamento", "Opções de crédito visíveis no momento da decisão; acordo com a entidade correspondente"],
                ["Seguros", "Proteção contextual associada a imóvel ou veículo"],
                ["Lar e energia", "Serviços pós-decisão: mudanças, ambientação, solar, conectividade"],
                ["Grupo RSC", "RSC Group, RSC Chain, wallet, bank, capital e partners tecnológicos do ecossistema"],
            ]),
            ("h2", 38, "Quadro institucional e legal"),
            ("p", "O posicionamento legal da REESKOVA é deliberadamente delimitado. Essa clareza reduz ambiguidade regulatória e alinha expectativas entre RSC, empresas e utilizadores finais."),
            ("bullets", [
                "A REESKOVA / RSC Market opera como plataforma de publicação e conexão no ecossistema RSC Group.",
                "Não intermedia contratos, pagamentos nem trâmites legais entre comprador e anunciante.",
                "Não atua como imobiliária intermediária, concessionária, escrow nem escritório de advocacia.",
                "Anunciantes e instituições partner são responsáveis independentes dos seus processos e obrigações.",
                "As empresas devem manter informação verdadeira, anúncios conformes e atendimento responsável à procura recebida.",
                "A RSC pode aplicar controlos de qualidade, verificação e suspensão para proteger a integridade do marketplace.",
            ]),
            ("h2", 39, "Compromissos recíprocos"),
            ("table", ["RSC Group", "Empresa participante"], [
                ["Fornecer acesso à infraestrutura REESKOVA", "Entregar dados corporativos verdadeiros e atualizados"],
                ["Coordenar ativação via equipa de partnerships", "Manter anúncios responsáveis e vigentes"],
                ["Preservar um marketplace curado e verificado", "Atender leads e visitas com padrão profissional"],
                ["Respeitar a imagem de marca do partner", "Respeitar a identidade institucional RSC / REESKOVA"],
                ["Manter canais oficiais de contacto", "Designar um contacto operativo interno permanente"],
            ], [(W - 2 * MX) * 0.5, (W - 2 * MX) * 0.5], 7.0),
            ("callout", "Qualquer colaboração comercial específica, anexo criativo ou condição particular entre a RSC e uma empresa deverá ser documentada por escrito. Este documento é apresentação corporativa informativa, não contrato."),
        ],
        [
            ("h2", 40, "Como incorporar a sua empresa"),
            ("p", "Para operar na infraestrutura REESKOVA, a empresa completa o registo corporativo na secção Para Empresas ou escreve à equipa RSC. O onboarding inclui verificação, ativação de acesso e suporte para o arranque do perfil e do inventário inicial."),
            ("steps", [
                ("Entrar", "REESKOVA → Para Empresas"),
                ("Registar", "Pedido corporativo completo"),
                ("Verificar", "Revisão RSC em até 24 h"),
                ("Ativar", "Acesso Backoffice e inventário"),
            ], 18 * mm),
            ("h2", 41, "Canais oficiais"),
            ("table", ["Canal", "Detalhe"], [
                ["Registo web", "REESKOVA → Para Empresas → registo de empresa"],
                ["E-mail corporativo", EMAIL],
                ["Telefone (França)", PHONE],
                ["Site corporativo", WEB],
                ["Assunto recomendado", "Incorporação empresa — REESKOVA"],
                ["Informação a incluir", "Nome legal, país/mercado, vertical, volume aproximado de inventário e contacto operativo"],
            ]),
            ("h2", 42, "Checklist de preparação"),
            ("bullets", [
                "Dispor de documento fiscal / identificador corporativo válido.",
                "Definir e-mail e telefone operativos para verificação e atendimento.",
                "Preparar identidade visual (logo) e dados de filiais/horários quando aplicável.",
                "Selecionar o inventário inicial a publicar após a ativação.",
                "Nomear um responsável interno de onboarding e resposta a leads.",
                "Rever internamente o princípio de não intermediação para alinhar expectativas da equipa comercial.",
            ]),
            ("h2", 43, "FAQ de incorporação"),
            ("table", ["Pergunta", "Resposta institucional"], [
                ["Quem pode publicar?", "Apenas empresas associadas e verificadas. Particulares não administram anúncios."],
                ["A RSC intermedia o fecho?", "Não. Publica e conecta; negociação, contrato e pagamento são entre as partes."],
                ["Quanto demora a verificação?", "O processo padrão de revisão é de até 24 horas úteis de análise."],
                ["Que verticais admite?", "Imóveis, veículos, serviços e categorias associadas de onboarding."],
                ["Onde administrar inventário?", "No Portal Empresas / Backoffice, sincronizado com o marketplace público."],
            ], None, 6.9),
            ("h2", 44, "Encerramento"),
            ("p", "A REESKOVA oferece às empresas infraestrutura digital para publicar, captar procura e operar a relação comercial com clareza de papéis. O marketplace distribui e conecta; a empresa decide, negoceia e fecha. A incorporação destina-se a organizações que valorizam verificação, controlo comercial e operação profissional do canal digital."),
            ("callout", f"One Marketplace. Endless Opportunities. — REESKOVA by RSC Group  ·  {CONTACT}"),
            ("p", f"Aviso: a REESKOVA / RSC Market é uma plataforma de publicação e conexão operada no ecossistema RSC Group. Não intermedia contratos, não custodia fundos nem realiza trâmites legais. Este documento é informativo e institucional; não constitui oferta vinculativa nem termos comerciais definitivos. Para condições particulares, escreva para {EMAIL} ou ligue para {PHONE}. Site corporativo: {WEB}.", 7.0, 9.5),
            ("brand",),
        ],
    ]



from presentation_fr_pages import pages_fr as _pages_fr_factory


def pages_fr():
    return _pages_fr_factory(W, MX)


OUTPUTS = {
    "en": ("REESKOVA-Corporate-Presentation-EN.pdf", pages_en),
    "pt": ("REESKOVA-Apresentacao-Corporativa-PT.pdf", pages_pt),
    "fr": ("REESKOVA-Presentation-Corporative-FR.pdf", pages_fr),
}


def build_lang(lang):
    filename, factory = OUTPUTS[lang]
    footer, pages = factory()
    out = os.path.join(DIR, filename)
    c = canvas.Canvas(out, pagesize=A4)
    for i, blocks in enumerate(pages, 1):
        render_blocks(c, blocks, footer, i, i)
        if i < len(pages):
            c.showPage()
    c.save()
    print(f"Wrote {out} ({len(pages)} pages)")
    return out


def main(langs=None):
    langs = langs or list(OUTPUTS.keys())
    paths = []
    for lang in langs:
        if lang not in OUTPUTS:
            raise SystemExit(f"Unknown lang: {lang}. Use: {', '.join(OUTPUTS)}")
        paths.append(build_lang(lang))
    return paths


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if a in OUTPUTS] or None
    main(args)
