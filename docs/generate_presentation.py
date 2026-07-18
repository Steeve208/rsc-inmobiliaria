#!/usr/bin/env python3
"""Generate REESKOVA commercial pitch deck PDF."""

from reportlab.lib.pagesizes import landscape
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.lib.colors import Color, HexColor, white
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

# 16:9 slide
PAGE = landscape((13.333 * inch, 7.5 * inch))
W, H = PAGE

BG = HexColor("#0B1220")
CARD = HexColor("#151E2E")
CARD_LINE = HexColor("#2A3648")
TEAL = HexColor("#2DD4BF")
TEAL_DIM = HexColor("#5EEAD4")
TEXT = HexColor("#F1F5F9")
MUTED = HexColor("#94A3B8")
SOFT = HexColor("#CBD5E1")
HIGHLIGHT = HexColor("#12241F")

OUT = os.path.join(os.path.dirname(__file__), "REESKOVA-Presentacion-Comercial.pdf")
TOTAL = 12


def bg(c):
    c.setFillColor(BG)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    # soft glows
    c.setFillColor(Color(0.18, 0.78, 0.65, alpha=0.08))
    c.circle(W * 0.9, H * 0.95, 220, fill=1, stroke=0)
    c.setFillColor(Color(0.22, 0.55, 0.95, alpha=0.06))
    c.circle(W * 0.05, H * 0.1, 180, fill=1, stroke=0)


def footer(c, page, label=""):
    c.setStrokeColor(CARD_LINE)
    c.setLineWidth(0.8)
    c.line(0.7 * inch, 0.45 * inch, W - 0.7 * inch, 0.45 * inch)
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(0.7 * inch, 0.25 * inch, "REESKOVA")
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 9)
    if label:
        c.drawCentredString(W / 2, 0.25 * inch, label)
    c.drawRightString(W - 0.7 * inch, 0.25 * inch, f"{page:02d} / {TOTAL:02d}")


def eyebrow(c, text, y):
    c.setFillColor(TEAL)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(0.7 * inch, y, text.upper())


def title(c, text, y, size=34):
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", size)
    c.drawString(0.7 * inch, y, text)


def wrapped_text(c, text, x, y, max_width, font="Helvetica", size=12, color=SOFT, leading=None):
    c.setFont(font, size)
    c.setFillColor(color)
    leading = leading or size + 5
    words = text.split()
    lines = []
    line = ""
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
    for i, ln in enumerate(lines):
        c.drawString(x, y - i * leading, ln)
    return len(lines) * leading


def card(c, x, y, w, h, highlight=False):
    c.setFillColor(HIGHLIGHT if highlight else CARD)
    c.setStrokeColor(TEAL if highlight else CARD_LINE)
    c.setLineWidth(1.2 if highlight else 0.9)
    c.roundRect(x, y, w, h, 12, fill=1, stroke=1)


def bullet_list(c, items, x, y, max_width, size=12):
    cy = y
    for item in items:
        c.setFillColor(TEAL)
        c.circle(x + 4, cy + 3, 3, fill=1, stroke=0)
        h = wrapped_text(c, item, x + 16, cy, max_width - 16, size=size, color=TEXT, leading=size + 5)
        cy -= max(h, size + 8) + 6
    return cy


def slide_cover(c):
    bg(c)
    eyebrow(c, "RSC Group  ·  Documento comercial", H - 1.0 * inch)
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 64)
    c.drawString(0.7 * inch, H - 2.3 * inch, "REESKOVA")
    wrapped_text(
        c,
        "Marketplace de inmuebles, vehículos y servicios. Conectamos empresas verificadas con compradores en LATAM+.",
        0.7 * inch,
        H - 3.1 * inch,
        W - 2.2 * inch,
        size=16,
        color=SOFT,
        leading=22,
    )
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 10)
    c.drawString(0.7 * inch, H - 3.55 * inch, "[by rsc group]")
    # quote box
    c.setFillColor(HIGHLIGHT)
    c.setStrokeColor(TEAL)
    c.setLineWidth(3)
    c.line(0.7 * inch, H - 4.75 * inch, 0.7 * inch, H - 3.75 * inch)
    c.setLineWidth(0)
    c.setFillColor(Color(0.18, 0.78, 0.65, alpha=0.1))
    c.roundRect(0.7 * inch, H - 4.75 * inch, W - 1.4 * inch, 1.0 * inch, 8, fill=1, stroke=0)
    wrapped_text(
        c,
        "Un marketplace, no una gestoría. Publicamos y conectamos — sin intermediar contratos ni pagos.",
        0.95 * inch,
        H - 4.1 * inch,
        W - 2.2 * inch,
        size=14,
        color=TEXT,
        leading=20,
    )

    metas = [
        ("Audiencia", "Inversores · Empresas · Partners"),
        ("Modelo", "SaaS B2B · Marketplace B2B2C"),
        ("Contacto", "support@rscmarket.com"),
    ]
    x = 0.7 * inch
    for label, value in metas:
        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 12)
        c.drawString(x, 1.35 * inch, label)
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 11)
        c.drawString(x, 1.1 * inch, value)
        x += 3.6 * inch
    footer(c, 1, "Presentación comercial · Confidencial")


def slide_exec(c):
    bg(c)
    eyebrow(c, "Resumen ejecutivo", H - 0.85 * inch)
    title(c, "La tesis en una pantalla", H - 1.45 * inch)

    cards = [
        ("Qué somos", "Marketplace B2B2C donde empresas verificadas publican inventario y compradores descubren, contactan y avanzan en la compra.", False),
        ("Qué resolvemos", "La fragmentación entre portales de inmuebles, vehículos y servicios — y la falta de un CRM real para convertir tráfico en leads.", False),
        ("Cómo ganamos", "Suscripción SaaS B2B recurrente. Monetizamos software y distribución, no comisiones por cierre.", True),
    ]
    cw = (W - 1.8 * inch) / 3
    for i, (t, body, hi) in enumerate(cards):
        x = 0.7 * inch + i * (cw + 0.2 * inch)
        card(c, x, H - 4.15 * inch, cw, 2.3 * inch, hi)
        c.setFillColor(TEAL_DIM)
        c.setFont("Helvetica-Bold", 13)
        c.drawString(x + 0.2 * inch, H - 2.15 * inch, t)
        wrapped_text(c, body, x + 0.2 * inch, H - 2.5 * inch, cw - 0.4 * inch, size=11, color=TEXT, leading=15)

    stats = [("+10k", "Propiedades"), ("+2k", "Empresas"), ("+5k", "Servicios"), ("+100k", "Usuarios")]
    sw = (W - 2.0 * inch) / 4
    for i, (v, l) in enumerate(stats):
        x = 0.7 * inch + i * (sw + 0.15 * inch)
        card(c, x, 0.85 * inch, sw, 1.35 * inch)
        c.setFillColor(TEAL)
        c.setFont("Helvetica-Bold", 28)
        c.drawString(x + 0.2 * inch, 1.55 * inch, v)
        c.setFillColor(SOFT)
        c.setFont("Helvetica", 11)
        c.drawString(x + 0.2 * inch, 1.15 * inch, l)
    footer(c, 2, "Indicadores de alcance del marketplace")


def slide_market(c):
    bg(c)
    eyebrow(c, "Oportunidad", H - 0.85 * inch)
    title(c, "LATAM+ pide un ecosistema, no otro portal", H - 1.45 * inch, size=28)
    items = [
        "Alta intención digital de compra y alquiler residencial/comercial",
        "Mercado automotriz con stock disperso y baja conversión online",
        "Empresas necesitan leads calificados, no solo impresiones",
        "Compradores esperan journey completo: buscar → contactar → visitar → financiar",
        "Espacio para un player regional multi-vertical con SaaS operativo",
    ]
    bullet_list(c, items, 0.7 * inch, H - 2.1 * inch, 7.2 * inch, size=13)

    card(c, 8.3 * inch, 1.0 * inch, 4.3 * inch, 4.6 * inch, True)
    c.setFillColor(TEAL)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(8.55 * inch, 5.15 * inch, "POSICIONAMIENTO")
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 16)
    wrapped_text(
        c,
        "Inmuebles + Vehículos + Servicios + Crédito",
        8.55 * inch,
        4.7 * inch,
        3.8 * inch,
        font="Helvetica-Bold",
        size=16,
        color=TEXT,
        leading=22,
    )
    wrapped_text(
        c,
        "Una sola plataforma para descubrir y convertir. Un panel SaaS para que las empresas publiquen, respondan y midan.",
        8.55 * inch,
        3.7 * inch,
        3.8 * inch,
        size=12,
        color=SOFT,
        leading=17,
    )
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 11)
    c.drawString(8.55 * inch, 1.5 * inch, "Cobertura: regional LATAM+")
    footer(c, 3, "Mercado y momento")


def slide_product(c):
    bg(c)
    eyebrow(c, "Producto", H - 0.85 * inch)
    title(c, "Dos caras, un ecosistema", H - 1.45 * inch)

    # B2C
    card(c, 0.7 * inch, 0.9 * inch, 5.7 * inch, 4.6 * inch)
    c.setFillColor(TEAL)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(0.95 * inch, 5.1 * inch, "B2C  ·  MARKETPLACE")
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 18)
    c.drawString(0.95 * inch, 4.7 * inch, "Para compradores e inversores")
    bullet_list(
        c,
        [
            "Catálogo de inmuebles y vehículos",
            "Filtros, mapa, comparación y favoritos",
            "Chat y agendamiento de visitas",
            "Simulador RSC Credit",
            "Reeskova AI (búsqueda en lenguaje natural)",
        ],
        0.95 * inch,
        4.2 * inch,
        5.1 * inch,
        size=12,
    )

    # B2B
    card(c, 6.7 * inch, 0.9 * inch, 5.9 * inch, 4.6 * inch, True)
    c.setFillColor(TEAL)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(6.95 * inch, 5.1 * inch, "B2B  ·  SAAS")
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 18)
    c.drawString(6.95 * inch, 4.7 * inch, "Para empresas anunciantes")
    bullet_list(
        c,
        [
            "Gestión de anuncios y destacados",
            "CRM de leads en tiempo real",
            "Chat integrado con compradores",
            "Analytics por anuncio y región",
            "Sello verificado + insights de IA",
        ],
        6.95 * inch,
        4.2 * inch,
        5.3 * inch,
        size=12,
    )
    footer(c, 4, "Capacidades de plataforma")


def slide_flow(c):
    bg(c)
    eyebrow(c, "Modelo operativo", H - 0.85 * inch)
    title(c, "Cómo funciona REESKOVA", H - 1.45 * inch)

    steps = [
        ("1", "Busca", "El comprador explora inventario de empresas."),
        ("2", "Contacta", "Chat o solicitud directa al anunciante."),
        ("3", "Visita", "Agenda con la empresa. RSC no hace trámites."),
        ("4", "Negocia", "Precio y condiciones entre las partes."),
        ("5", "Cierra", "Contratos y pagos fuera de RSC."),
    ]
    sw = (W - 1.9 * inch) / 5
    for i, (n, t, d) in enumerate(steps):
        x = 0.7 * inch + i * (sw + 0.12 * inch)
        card(c, x, 2.6 * inch, sw, 2.6 * inch)
        c.setFillColor(Color(0.18, 0.78, 0.65, alpha=0.2))
        c.circle(x + sw / 2, 4.7 * inch, 16, fill=1, stroke=0)
        c.setFillColor(TEAL)
        c.setFont("Helvetica-Bold", 12)
        c.drawCentredString(x + sw / 2, 4.65 * inch, n)
        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 13)
        c.drawCentredString(x + sw / 2, 4.1 * inch, t)
        wrapped_text(c, d, x + 0.15 * inch, 3.65 * inch, sw - 0.3 * inch, size=10, color=MUTED, leading=14)

    c.setFillColor(Color(0.18, 0.78, 0.65, alpha=0.1))
    c.roundRect(0.7 * inch, 1.0 * inch, W - 1.4 * inch, 1.2 * inch, 8, fill=1, stroke=0)
    wrapped_text(
        c,
        "Solo empresas verificadas publican. Particulares no anuncian. Registro con revisión en hasta ~24 horas.",
        0.95 * inch,
        1.65 * inch,
        W - 2.0 * inch,
        size=13,
        color=TEXT,
        leading=18,
    )
    footer(c, 5, "Marketplace de conexión")


def slide_companies(c):
    bg(c)
    eyebrow(c, "Para empresas", H - 0.85 * inch)
    title(c, "Venda más con el canal RSC", H - 1.45 * inch)

    segs = [
        ("Inmobiliarias", "Publique inmuebles, reciba contactos calificados y conecte compradores al crédito."),
        ("Concesionarios", "Stock online, leads en tiempo real y financiación digital para acelerar ventas."),
        ("Constructoras", "Lance emprendimientos, gestione unidades y conecte demanda al financiamiento."),
    ]
    cw = (W - 1.8 * inch) / 3
    for i, (t, b) in enumerate(segs):
        x = 0.7 * inch + i * (cw + 0.2 * inch)
        card(c, x, 3.3 * inch, cw, 2.1 * inch)
        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 16)
        c.drawString(x + 0.22 * inch, 4.9 * inch, t)
        wrapped_text(c, b, x + 0.22 * inch, 4.45 * inch, cw - 0.44 * inch, size=11, color=SOFT, leading=15)

    benefits = [
        ("Sin setup", "Registro gratuito y onboarding ágil."),
        ("Leads al panel", "Chats, visitas y contactos centralizados."),
        ("Confianza", "Sello verificado RSC para destacar."),
    ]
    for i, (t, b) in enumerate(benefits):
        x = 0.7 * inch + i * (cw + 0.2 * inch)
        card(c, x, 0.95 * inch, cw, 2.0 * inch, True)
        c.setFillColor(TEAL_DIM)
        c.setFont("Helvetica-Bold", 15)
        c.drawString(x + 0.22 * inch, 2.4 * inch, t)
        wrapped_text(c, b, x + 0.22 * inch, 2.0 * inch, cw - 0.44 * inch, size=12, color=TEXT, leading=16)
    footer(c, 6, "Propuesta de valor B2B")


def slide_plans(c):
    bg(c)
    eyebrow(c, "Planes comerciales", H - 0.85 * inch)
    title(c, "Empieza gratis. Escala con el negocio.", H - 1.45 * inch)

    plans = [
        ("STARTER", "Gratis", "Para empezar a vender online", [
            "Hasta 10 anuncios activos",
            "Panel básico de leads",
            "Perfil de la empresa",
        ], False),
        ("GROWTH · MÁS POPULAR", "R$ 299/mes", "Para equipos en crecimiento", [
            "Anuncios ilimitados",
            "CRM completo + chat",
            "Destacados premium · 14 días gratis",
        ], True),
        ("ENTERPRISE", "A consultar", "Para redes y grandes grupos", [
            "Multi-sucursales",
            "API e integraciones",
            "Account manager dedicado",
        ], False),
    ]
    cw = (W - 1.8 * inch) / 3
    for i, (name, price, desc, feats, hi) in enumerate(plans):
        x = 0.7 * inch + i * (cw + 0.2 * inch)
        card(c, x, 0.9 * inch, cw, 4.55 * inch, hi)
        c.setFillColor(TEAL)
        c.setFont("Helvetica-Bold", 9)
        c.drawString(x + 0.25 * inch, 5.05 * inch, name)
        c.setFillColor(TEAL if hi else TEXT)
        c.setFont("Helvetica-Bold", 26)
        c.drawString(x + 0.25 * inch, 4.45 * inch, price)
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 10)
        c.drawString(x + 0.25 * inch, 4.1 * inch, desc)
        bullet_list(c, feats, x + 0.25 * inch, 3.55 * inch, cw - 0.5 * inch, size=12)
    footer(c, 7, "Sin comisión por transacción")


def slide_investors(c):
    bg(c)
    eyebrow(c, "Para inversores", H - 0.85 * inch)
    title(c, "Por qué REESKOVA es una tesis atractiva", H - 1.45 * inch, size=28)

    rows = [
        ("Mercado grande", "Inmobiliario + automotriz + servicios en LATAM+"),
        ("SaaS recurrente", "Ingresos por suscripción B2B, no dependencia de comisión por deal"),
        ("Confianza", "Solo empresas verificadas; marketplace curado"),
        ("Menor riesgo operativo", "Plataforma de conexión, no gestoría ni custodia de fondos"),
        ("Efecto de red", "Más empresas → más inventario → más usuarios → más leads"),
        ("Upsell natural", "Starter → Growth → Enterprise + partners del ecosistema RSC"),
    ]
    y = H - 2.0 * inch
    # header
    c.setFillColor(TEAL)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(0.85 * inch, y, "PILARES")
    c.drawString(3.8 * inch, y, "ARGUMENTO")
    y -= 0.15 * inch
    c.setStrokeColor(CARD_LINE)
    c.line(0.7 * inch, y, W - 0.7 * inch, y)
    y -= 0.35 * inch
    for pillar, arg in rows:
        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 12)
        c.drawString(0.85 * inch, y, pillar)
        c.setFont("Helvetica", 12)
        c.setFillColor(SOFT)
        c.drawString(3.8 * inch, y, arg)
        y -= 0.18 * inch
        c.setStrokeColor(CARD_LINE)
        c.setLineWidth(0.6)
        c.line(0.7 * inch, y, W - 0.7 * inch, y)
        y -= 0.38 * inch
    footer(c, 8, "Investment thesis")


def slide_diff(c):
    bg(c)
    eyebrow(c, "Ventaja competitiva", H - 0.85 * inch)
    title(c, "Qué nos diferencia", H - 1.45 * inch)

    diffs = [
        ("1. Ecosistema unificado", "Inmuebles, vehículos, servicios y crédito en una experiencia."),
        ("2. Conexión directa", "Cliente ↔ Empresa sin capa de gestoría."),
        ("3. SaaS operativo real", "Anuncios, CRM, chat, visitas, analytics e IA."),
        ("4. Trust verificado", "Solo empresas asociadas publican. Sello RSC."),
        ("5. Grupo RSC", "Bank, Capital, Ora Technology y Reesk Chain."),
        ("6. Multiidioma", "Producto en pt / es / en para LATAM+."),
    ]
    cw = (W - 1.8 * inch) / 3
    ch = 2.15 * inch
    for i, (t, b) in enumerate(diffs):
        col = i % 3
        row = i // 3
        x = 0.7 * inch + col * (cw + 0.2 * inch)
        y = 3.35 * inch - row * (ch + 0.2 * inch)
        card(c, x, y, cw, ch)
        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 14)
        c.drawString(x + 0.22 * inch, y + ch - 0.45 * inch, t)
        wrapped_text(c, b, x + 0.22 * inch, y + ch - 0.9 * inch, cw - 0.44 * inch, size=12, color=SOFT, leading=16)
    footer(c, 9, "Diferenciadores")


def slide_ecosystem(c):
    bg(c)
    eyebrow(c, "Ecosistema", H - 0.85 * inch)
    title(c, "Más que un listado: el journey completo", H - 1.45 * inch, size=28)

    items = [
        ("Financiación", "RSC Credit y partners financieros"),
        ("Seguros", "Protección en el momento de compra"),
        ("Hogar", "Mudanzas, decoración, mobiliario"),
        ("Energía", "Solar, internet y conectividad"),
    ]
    cw = (W - 2.0 * inch) / 4
    for i, (t, b) in enumerate(items):
        x = 0.7 * inch + i * (cw + 0.15 * inch)
        card(c, x, 3.2 * inch, cw, 2.2 * inch)
        c.setFillColor(TEXT)
        c.setFont("Helvetica-Bold", 14)
        c.drawString(x + 0.2 * inch, 4.85 * inch, t)
        wrapped_text(c, b, x + 0.2 * inch, 4.4 * inch, cw - 0.4 * inch, size=11, color=SOFT, leading=15)

    card(c, 0.7 * inch, 1.1 * inch, W - 1.4 * inch, 1.7 * inch)
    c.setFillColor(TEAL)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(0.95 * inch, 2.35 * inch, "PARTNERS DEL GRUPO")
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(0.95 * inch, 1.7 * inch, "RSC Group  ·  RSC Bank  ·  RSC Capital  ·  Ora Technology  ·  Reesk Chain")
    footer(c, 10, "Servicios alrededor de la decisión")


def slide_partners(c):
    bg(c)
    eyebrow(c, "Partnership & capital", H - 0.85 * inch)
    title(c, "Con quién queremos trabajar", H - 1.45 * inch)

    card(c, 0.7 * inch, 1.0 * inch, 5.8 * inch, 4.5 * inch)
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 18)
    c.drawString(0.95 * inch, 5.0 * inch, "Buscamos")
    bullet_list(
        c,
        [
            "Capital para adquisición de empresas e inventario",
            "Partners financieros y aseguradores",
            "Redes inmobiliarias y concesionarios multi-sucursal",
            "Alianzas estratégicas para expansión regional",
        ],
        0.95 * inch,
        4.4 * inch,
        5.2 * inch,
        size=12,
    )

    card(c, 6.8 * inch, 1.0 * inch, 5.8 * inch, 4.5 * inch, True)
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 18)
    c.drawString(7.05 * inch, 5.0 * inch, "Ofrecemos bajo NDA")
    bullet_list(
        c,
        [
            "Deck extendido y unit economics SaaS",
            "Métricas operativas (ARPU, conversión, churn)",
            "Roadmap de producto e IA",
            "Reunión con equipo comercial / RSC Group",
        ],
        7.05 * inch,
        4.4 * inch,
        5.2 * inch,
        size=12,
    )
    footer(c, 11, "Inversores y partners estratégicos")


def slide_cta(c):
    bg(c)
    eyebrow(c, "Próximo paso", H - 0.85 * inch)
    title(c, "Listos para crecer juntos", H - 1.45 * inch)

    card(c, 0.7 * inch, 2.5 * inch, 5.8 * inch, 2.9 * inch, True)
    c.setFillColor(TEAL)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(0.95 * inch, 4.95 * inch, "EMPRESAS")
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 22)
    c.drawString(0.95 * inch, 4.4 * inch, "Registre su empresa")
    wrapped_text(
        c,
        "Starter gratis · Growth R$ 299/mes · Enterprise a medida",
        0.95 * inch,
        3.9 * inch,
        5.2 * inch,
        size=12,
        color=SOFT,
        leading=16,
    )
    c.setFillColor(TEAL_DIM)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(0.95 * inch, 2.9 * inch, "→ Portal Empresas · support@rscmarket.com")

    card(c, 6.8 * inch, 2.5 * inch, 5.8 * inch, 2.9 * inch, True)
    c.setFillColor(TEAL)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(7.05 * inch, 4.95 * inch, "INVERSORES")
    c.setFillColor(TEXT)
    c.setFont("Helvetica-Bold", 22)
    c.drawString(7.05 * inch, 4.4 * inch, "Solicite reunión")
    wrapped_text(
        c,
        "Asunto: Partnership / Inversión — REESKOVA",
        7.05 * inch,
        3.9 * inch,
        5.2 * inch,
        size=12,
        color=SOFT,
        leading=16,
    )
    c.setFillColor(TEAL_DIM)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(7.05 * inch, 2.9 * inch, "→ support@rscmarket.com")

    wrapped_text(
        c,
        "Aviso: REESKOVA / RSC Market es una plataforma de publicación y conexión. No intermedia contratos, no custodia fondos ni realiza trámites legales. Precios y métricas son informativos.",
        0.7 * inch,
        1.9 * inch,
        W - 1.4 * inch,
        size=9,
        color=MUTED,
        leading=13,
    )
    footer(c, 12, "Impulsado por RSC Group")


def main():
    c = canvas.Canvas(OUT, pagesize=PAGE)
    slides = [
        slide_cover,
        slide_exec,
        slide_market,
        slide_product,
        slide_flow,
        slide_companies,
        slide_plans,
        slide_investors,
        slide_diff,
        slide_ecosystem,
        slide_partners,
        slide_cta,
    ]
    for fn in slides:
        fn(c)
        c.showPage()
    c.save()
    print(OUT)


if __name__ == "__main__":
    main()
