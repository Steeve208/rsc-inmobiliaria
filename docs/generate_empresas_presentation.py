#!/usr/bin/env python3
"""REESKOVA — Presentación Corporativa para Empresas (RSC Group)."""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white, Color
import os

W, H = A4
MX = 16 * mm
MT = 13 * mm
MB = 13 * mm

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
OUT = os.path.join(DIR, "REESKOVA-Presentacion-Empresas.pdf")
LOGO = os.path.join(ASSETS, "rsc-group-logo.png")
TOTAL = 12


def bg_path(n):
    return os.path.join(BG, f"bg-{n:02d}.jpg")


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
    path = bg_path(n)
    if os.path.exists(path):
        c.drawImage(path, 0, 0, width=W, height=H, preserveAspectRatio=False)
    else:
        c.setFillColor(white)
        c.rect(0, 0, W, H, fill=1, stroke=0)
    # almost opaque reading surface — B/W photo remains only as outer frame
    c.setFillColor(Color(1, 1, 1, alpha=0.96))
    c.rect(MX - 1.5 * mm, MB + 5 * mm, W - 2 * MX + 3 * mm, H - MT - MB - 26 * mm, fill=1, stroke=0)


def draw_header(c):
    if os.path.exists(LOGO):
        c.drawImage(
            LOGO, MX, H - MT - 16 * mm,
            width=13 * mm, height=14 * mm,
            mask="auto", preserveAspectRatio=True, anchor="c",
        )
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 9.5)
    c.drawCentredString(W / 2, H - MT - 3.5 * mm, "RSC Group")
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 6.8)
    c.drawCentredString(W / 2, H - MT - 7.5 * mm, "Building the Next Generation of Digital Platforms")
    c.setFont("Helvetica", 6.5)
    c.drawCentredString(W / 2, H - MT - 11 * mm, WEB)

    right = W - MX
    y = H - MT - 3.5 * mm
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


def draw_footer(c, page):
    c.setStrokeColor(RULE)
    c.setLineWidth(0.4)
    c.line(MX, MB + 3.5 * mm, W - MX, MB + 3.5 * mm)
    c.setFillColor(FOOTER_C)
    c.setFont("Helvetica", 6)
    c.drawString(MX, MB - 0.5 * mm, f"REESKOVA  ·  Presentación Corporativa  ·  {WEB}  ·  {EMAIL}")
    c.drawRightString(W - MX, MB - 0.5 * mm, f"{page:02d} / {TOTAL:02d}")


def h1(c, text, y):
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 15)
    c.drawString(MX, y, text)
    return y - 5 * mm


def h2(c, num, title, y):
    c.setFillColor(ACCENT)
    c.setFont("Helvetica-Bold", 8.5)
    c.drawString(MX, y, f"{num:02d}")
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 9.5)
    c.drawString(MX + 7 * mm, y, title.upper())
    return y - 5.2 * mm


def p(c, text, y, size=8.2, leading=11, color=SOFT, max_w=None):
    max_w = max_w or (W - 2 * MX)
    c.setFillColor(color)
    c.setFont("Helvetica", size)
    for ln in wrap(c, text, "Helvetica", size, max_w):
        c.drawString(MX, y, ln)
        y -= leading
    return y


def bullets(c, items, y, size=7.9, leading=10.5, x=None, max_w=None):
    x = x or MX
    max_w = max_w or (W - x - MX)
    for item in items:
        c.setFillColor(ACCENT)
        c.circle(x + 1.1 * mm, y + 1.1 * mm, 0.85 * mm, fill=1, stroke=0)
        c.setFillColor(SOFT)
        c.setFont("Helvetica", size)
        for ln in wrap(c, item, "Helvetica", size, max_w - 4.5 * mm):
            c.drawString(x + 4.2 * mm, y, ln)
            y -= leading
        y -= 1.2 * mm
    return y


def callout(c, text, y):
    lines = wrap(c, text, "Helvetica-Oblique", 7.8, W - 2 * MX - 7 * mm)
    h = len(lines) * 10.2 + 8
    c.setFillColor(ACCENT_SOFT)
    c.rect(MX, y - h, W - 2 * MX, h, fill=1, stroke=0)
    c.setFillColor(SOFT)
    c.setFont("Helvetica-Oblique", 7.8)
    ty = y - 8
    for ln in lines:
        c.drawString(MX + 3 * mm, ty, ln)
        ty -= 10.2
    return y - h - 3 * mm


def table(c, headers, rows, y, col_w=None, fs=7.3):
    max_w = W - 2 * MX
    if col_w is None:
        col_w = [max_w * 0.30, max_w * 0.70]
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
        cell_lines = []
        max_lines = 1
        for i, cell in enumerate(row):
            font = "Helvetica-Bold" if i == 0 else "Helvetica"
            lines = wrap(c, cell, font, fs, col_w[i] - 4 * mm)
            cell_lines.append((font, lines))
            max_lines = max(max_lines, len(lines))
        h = max(6.8 * mm, max_lines * 3.15 * mm + 2.6 * mm)
        c.setStrokeColor(TABLE_LINE)
        c.setLineWidth(0.35)
        c.line(MX, y - h, W - MX, y - h)
        x = MX
        for i, (font, lines) in enumerate(cell_lines):
            c.setFont(font, fs)
            c.setFillColor(INK if i == 0 else SOFT)
            ty = y - 3.6 * mm
            for ln in lines:
                c.drawString(x + 2 * mm, ty, ln)
                ty -= 3.15 * mm
            x += col_w[i]
        y -= h
    return y - 1.8 * mm


def steps(c, items, y, bh=17 * mm):
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
    return y - bh - 3 * mm


def two_col(c, blocks, y, bh=16 * mm):
    gap = 2.5 * mm
    bw = (W - 2 * MX - gap) / 2
    for i, (title, desc) in enumerate(blocks):
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
    rows = (len(blocks) + 1) // 2
    return y - rows * (bh + 2 * mm) - 1.5 * mm


# ───────────────────────── PAGES ─────────────────────────


def page_01(c):
    draw_bg(c, 1)
    y = draw_header(c)
    y = h1(c, "REESKOVA", y)
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 8.5)
    c.drawString(MX, y, "Presentación Corporativa para Empresas")
    y -= 3.5 * mm
    c.setFont("Helvetica", 7.2)
    c.drawString(MX, y, "Inmobiliarias  ·  Concesionarios  ·  Constructoras  ·  Partners de servicios  ·  Operaciones multi-sucursal")
    y -= 5.5 * mm

    y = p(
        c,
        "REESKOVA es el marketplace premium de inmuebles, vehículos y servicios impulsado por RSC Group. "
        "Este documento presenta, con detalle operativo, la infraestructura digital disponible para empresas "
        "que desean publicar inventario verificado, captar demanda calificada y gestionar la relación comercial "
        "con compradores e inversores sin ceder el cierre a una gestoría intermediaria.",
        y, size=8.3, leading=11.2,
    )
    y -= 1.5 * mm
    y = p(
        c,
        "La plataforma combina una capa pública de descubrimiento (marketplace B2B2C multiidioma y multi-mercado) "
        "con una capa privada de operación (Portal Empresas / Backoffice). RSC / REESKOVA publica y conecta; "
        "la negociación, la documentación y el cierre permanecen exclusivamente entre la empresa anunciante y el cliente.",
        y, size=8.3, leading=11.2,
    )
    y -= 2 * mm
    y = callout(
        c,
        "Principio institucional: REESKOVA es una plataforma de publicación y conexión. No intermedia contratos, "
        "no custodia fondos y no realiza trámites legales. Este marco redefine expectativas claras para empresas, "
        "compradores y partners del ecosistema.",
        y,
    )
    y -= 1 * mm

    y = h2(c, 1, "Objetivo de este documento", y)
    y = bullets(
        c,
        [
            "Explicar el posicionamiento de REESKOVA dentro del ecosistema RSC Group y su rol frente a la empresa anunciante.",
            "Describir verticales, journey del comprador, capacidades SaaS y reglas de verificación corporativa.",
            "Documentar los flujos reales de incorporación, publicación de inventario, contacto y agenda de visitas.",
            "Definir límites institucionales, compromisos recíprocos y canales oficiales de contacto.",
            "Servir como base de evaluación para la incorporación de inmobiliarias, concesionarios, constructoras y partners.",
        ],
        y,
    )
    y -= 1.5 * mm

    y = h2(c, 2, "Alcance operativo del producto", y)
    y = table(
        c,
        ["Dimensión", "Detalle"],
        [
            ["Verticales", "Inmuebles, vehículos, servicios y opciones de crédito publicadas por partners"],
            ["Modelo", "Marketplace B2B2C + Portal Empresas / Backoffice para anunciantes verificados"],
            ["Mercados", "Configuración multi-mercado con enfoque estratégico LATAM+ e internacional"],
            ["Idiomas de interfaz", "Portugués, español, inglés, francés, alemán, italiano y árabe"],
            ["Ingreso de empresas", "Solicitud corporativa con verificación previa a la activación operativa"],
            ["Rol de RSC", "Publicación y conexión; sin intermediación de contratos ni custodia de fondos"],
        ],
        y,
    )
    y -= 1 * mm
    y = h2(c, 3, "Índice", y)
    toc = [
        "04  RSC Group y definición de REESKOVA",
        "05  Contexto de mercado y propuesta de valor",
        "06  Verticales, reglas de publicación y audiencias",
        "07  Journey del comprador y puntos de contacto",
        "08  Infraestructura SaaS y arquitectura operativa",
        "09  Incorporación, verificación y activación",
        "10  Operación diaria: publicar, leads y visitas",
        "11  Descubrimiento, ecosistema y gobernanza",
        "12  Canales oficiales y siguientes pasos",
    ]
    for t in toc:
        c.setFillColor(SOFT)
        c.setFont("Helvetica", 7.8)
        c.drawString(MX, y, t)
        y -= 4.4 * mm
    y -= 2 * mm
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(MX, y, "CÓMO USAR ESTE DOCUMENTO")
    y -= 5 * mm
    y = bullets(
        c,
        [
            "Dirección general y partnerships: evaluar encaje estratégico con la infraestructura REESKOVA.",
            "Operaciones y comercial: revisar journey, panel SaaS y flujos de leads/visitas antes del onboarding.",
            "Legal / compliance interno: contrastar el principio de publicación y conexión con las políticas de la empresa.",
            "Contacto oficial para avance: rscgroupltda@gmail.com · +33 7 85 61 86 44 · www.rscchain.com",
        ],
        y,
    )
    draw_footer(c, 1)


def page_02(c):
    draw_bg(c, 2)
    y = draw_header(c)
    y = h2(c, 4, "RSC Group — compañía matriz", y)
    y = p(
        c,
        "RSC Group es la compañía de tecnología matriz de un ecosistema multiproducto orientado a infraestructura "
        "digital, mercados y servicios asociados. Su identidad institucional — profesional, sobria y technology-forward — "
        "define el estándar visual, operativo y reputacional de las marcas del grupo, incluida REESKOVA.",
        y,
    )
    y -= 1.5 * mm
    y = p(
        c,
        "El grupo articula capacidades de marketplace, cadena, wallet, servicios financieros y tecnología aplicada. "
        "REESKOVA concentra la experiencia de marketplace premium para inmuebles, vehículos y servicios, mientras "
        "otras unidades aportan capas complementarias del ecosistema sin alterar el principio de no intermediación "
        "contractual del marketplace.",
        y,
    )
    y -= 2 * mm
    y = h2(c, 5, "Mapa del ecosistema", y)
    y = table(
        c,
        ["Unidad / marca", "Rol"],
        [
            ["REESKOVA (RSC Market)", "Marketplace B2B2C premium + Portal Empresas / Backoffice para anunciantes verificados"],
            ["RSC Chain / Reesk Chain", "Infraestructura blockchain y capa tecnológica de cadena del ecosistema"],
            ["RSC Wallet", "Capacidades de wallet y pagos dentro del grupo"],
            ["RSC Bank · RSC Capital", "Servicios financieros y capital asociados al ecosistema"],
            ["Ora Technology", "Partner tecnológico del grupo"],
            ["Servicios auxiliares", "Capas Escrow, P2P y Corporate cuando se activan dentro del ecosistema RSC"],
        ],
        y,
    )
    y -= 2 * mm
    y = h2(c, 6, "Definición operativa de REESKOVA", y)
    y = p(
        c,
        "REESKOVA es un marketplace B2B2C: las empresas asociadas y verificadas administran anuncios desde el "
        "Portal Empresas / Backoffice; los consumidores no publican. El comprador descubre inventario, contacta "
        "al anunciante, agenda visitas y avanza la compra directamente con la empresa. RSC habilita la infraestructura "
        "de publicación, descubrimiento, mensajería y agenda; no sustituye al anunciante en la relación comercial.",
        y,
    )
    y -= 2 * mm
    y = table(
        c,
        ["Dimensión", "Detalle institucional"],
        [
            ["Naturaleza jurídica-operativa", "Plataforma de publicación y conexión; no gestoría inmobiliaria ni automotriz"],
            ["Modelo B2B", "Infraestructura SaaS y distribución digital para empresas verificadas"],
            ["Quién publica", "Exclusivamente empresas asociadas tras onboarding y verificación"],
            ["Quién compra / explora", "Consumidores, inversores y usuarios del marketplace público"],
            ["Verticales", "Inmuebles, vehículos, servicios y opciones de crédito publicadas por partners"],
            ["Cobertura de producto", "Configuración multi-mercado con comunicación estratégica LATAM+"],
            ["Idiomas", "Siete idiomas de interfaz para operación regional e internacional"],
            ["Límite explícito", "Sin intermediación de contratos, sin custodia de fondos, sin trámites legales"],
        ],
        y,
    )
    y -= 1.5 * mm
    y = callout(
        c,
        "Posicionamiento resumido: «Un marketplace, no una gestoría.» La empresa mantiene el control comercial; "
        "REESKOVA aporta infraestructura, audiencia y herramientas de operación.",
        y,
    )
    draw_footer(c, 2)


def page_03(c):
    draw_bg(c, 3)
    y = draw_header(c)
    y = h2(c, 7, "Contexto de mercado", y)
    y = p(
        c,
        "El entorno digital de inmuebles, vehículos y servicios sigue caracterizado por fragmentación. Las empresas "
        "operan en portales verticales desconectados, con alta competencia por impresión, baja trazabilidad del lead "
        "y escasa integración entre descubrimiento, contacto, visita y seguimiento comercial. El comprador, en cambio, "
        "espera un journey continuo y transparente.",
        y,
    )
    y -= 1.5 * mm
    y = bullets(
        c,
        [
            "Portales aislados por vertical obligan a duplicar inventario, marca y esfuerzo comercial.",
            "La métrica dominante de impresión no garantiza conversación ni visita calificada.",
            "Sin CRM conectado al canal de demanda, el lead se pierde entre WhatsApp, formularios y correo disperso.",
            "La confianza del comprador se erosiona en clasificados abiertos con baja verificación de anunciantes.",
            "LATAM+ y mercados adyacentes concentran demanda digital creciente en vivienda, movilidad y servicios.",
            "Las operaciones multi-sucursal requieren identidad corporativa consistente y control centralizado de inventario.",
        ],
        y,
    )
    y -= 2 * mm
    y = h2(c, 8, "Propuesta de valor de REESKOVA para la empresa", y)
    y = p(
        c,
        "REESKOVA responde a ese contexto con un ecosistema unificado: distribución multi-vertical, leads operativos "
        "en panel, identidad verificada y separación clara entre infraestructura digital y responsabilidad del cierre.",
        y,
    )
    y -= 2 * mm
    y = two_col(
        c,
        [
            ("Distribución unificada", "Un solo canal para inmuebles, vehículos y servicios dentro de un journey coherente de compra."),
            ("Leads accionables", "Chats, solicitudes y visitas llegan al entorno operativo de la empresa, no solo como métrica de tráfico."),
            ("Confianza verificada", "Marketplace reservado a empresas asociadas; sello RSC visible en perfil y fichas."),
            ("Control comercial", "Precio, negociación, contrato y pago permanecen entre anunciante y cliente."),
            ("Operación SaaS", "Anuncios, CRM, chat, agenda, analytics e IA en una infraestructura común."),
            ("Ecosistema ampliado", "Financiación, seguros y servicios contextuales sin convertir a RSC en intermediario del deal."),
        ],
        y,
        bh=17 * mm,
    )
    y -= 1.5 * mm
    y = h2(c, 9, "Resultados operativos esperados", y)
    y = bullets(
        c,
        [
            "Mayor coherencia de marca al publicar inventario bajo identidad corporativa verificada.",
            "Reducción de fricción entre descubrimiento público y respuesta comercial interna.",
            "Trazabilidad de contactos y visitas con estados claros para el equipo de ventas.",
            "Escalabilidad a múltiples mercados e idiomas sin reconstruir el canal desde cero.",
            "Alineación legal-operativa: la empresa cierra; la plataforma conecta.",
        ],
        y,
    )
    y -= 1.5 * mm
    y = callout(
        c,
        "Enfoque comercial del producto Para Empresas: publicar anuncios, recibir leads calificados y gestionar "
        "la operación en el panel SaaS, dentro de un ecosistema pensado para inmobiliarias, concesionarios y constructoras.",
        y,
    )
    draw_footer(c, 3)


def page_04(c):
    draw_bg(c, 4)
    y = draw_header(c)
    y = h2(c, 10, "Verticales del marketplace", y)
    y = p(
        c,
        "REESKOVA organiza la oferta en verticales que acompañan la decisión de compra. La empresa publica en la "
        "categoría que opera; el comprador navega el ecosistema con continuidad de experiencia, filtros, mapa y contacto directo.",
        y,
    )
    y -= 2 * mm
    y = table(
        c,
        ["Vertical", "Alcance y dinámica"],
        [
            ["Inmuebles", "Casas, apartamentos, terrenos, comerciales, lanzamientos, condominios, playa y campo; compra y alquiler. Publicación por inmobiliarias y constructoras verificadas, con ficha enriquecida, mapa, comparación y contacto."],
            ["Vehículos", "Coches, SUVs, motos y categorías afines, nuevo o usado. Publicación por concesionarios verificados. El journey prioriza lead rápido, chat y visita al punto de venta."],
            ["Servicios", "Capas del journey: seguros, mudanzas, decoración, energía, conectividad y partners afines. Aportan valor contextual sin convertir a REESKOVA en prestador intermediario del servicio."],
            ["Crédito / financiación", "Opciones publicadas por empresas o partners. Evaluación, aprobación y acuerdo financiero se celebran entre el cliente y la entidad. En producto, la bandera de crédito está priorizada en Brasil."],
        ],
        y,
        fs=7.1,
    )
    y -= 2 * mm
    y = h2(c, 11, "Reglas de publicación", y)
    y = table(
        c,
        ["Regla", "Aplicación"],
        [
            ["Solo empresas verificadas", "Los particulares no administran anuncios en el marketplace"],
            ["Backoffice como origen", "El inventario se crea y mantiene en el panel empresarial y se sincroniza a vitrinas públicas"],
            ["Identidad corporativa", "Nombre, logo, documento, sucursales, horarios y canal WhatsApp pueden exhibirse"],
            ["Sello verificado", "Señal de confianza en tarjetas y fichas cuando empresa/anuncio están verificados"],
            ["Calidad de contenido", "La empresa es responsable de veracidad, actualización y conformidad legal del anuncio"],
            ["Retiro / suspensión", "RSC puede retirar contenido o restringir acceso ante incumplimiento o riesgo a la integridad del marketplace"],
        ],
        y,
    )
    y -= 2 * mm
    y = h2(c, 12, "Audiencias empresariales", y)
    y = table(
        c,
        ["Audiencia", "Modo de operación"],
        [
            ["Inmobiliarias", "Publican propiedades, reciben contactos calificados y conectan visitas y opciones de crédito de partners."],
            ["Concesionarios", "Exponen stock, capturan leads en tiempo real y aceleran visitas al showroom o punto de venta."],
            ["Constructoras", "Lanzan emprendimientos, gestionan unidades y capturan demanda desde etapas tempranas."],
            ["Agencias y retail", "Categorías admitidas en onboarding para operaciones comerciales especializadas."],
            ["Partners de servicios", "Participan en el journey con seguros, hogar, energía, financiamiento y afines."],
        ],
        y,
    )
    draw_footer(c, 4)


def page_05(c):
    draw_bg(c, 5)
    y = draw_header(c)
    y = h2(c, 13, "Journey del comprador", y)
    y = p(
        c,
        "El journey está diseñado para convertir descubrimiento en relación comercial con la empresa anunciante. "
        "Cada etapa genera un evento operativo utilizable por el equipo de ventas. RSC no organiza la logística "
        "física ni el cierre documental.",
        y,
    )
    y -= 2 * mm
    y = steps(
        c,
        [
            ("Busca", "Explora inventario con filtros, mapa, comparación e IA"),
            ("Contacta", "Chat RSC, WhatsApp o solicitud al anunciante"),
            ("Visita", "Agenda fecha y hora con la empresa"),
            ("Negocia", "Condiciones entre cliente y empresa"),
            ("Cierra", "Contratos y pagos fuera de RSC"),
        ],
        y,
        bh=18 * mm,
    )
    y -= 1 * mm
    y = h2(c, 14, "Detalle funcional por etapa", y)
    y = table(
        c,
        ["Etapa", "Qué ocurre en plataforma / qué recibe la empresa"],
        [
            ["Busca", "El comprador navega vitrinas de inmuebles o vehículos, aplica filtros, cambia vistas (lista, galería, mapa, satélite) y puede comparar opciones."],
            ["Contacta", "Desde la ficha, inicia chat RSC o WhatsApp. El hilo o contacto se dirige a la empresa anunciante para respuesta comercial."],
            ["Visita", "Completa solicitud de agenda; la empresa gestiona confirmación, cancelación o propuesta de reagenda desde su panel."],
            ["Negocia", "Precio, condiciones, documentación y due diligence se tratan entre las partes, fuera de intermediación RSC."],
            ["Cierra", "Firma, pagos, registro y entrega son responsabilidad exclusiva de cliente y empresa."],
        ],
        y,
        fs=7.1,
    )
    y -= 2 * mm
    y = h2(c, 15, "Puntos de contacto en la ficha pública", y)
    y = p(
        c,
        "La ficha del anuncio concentra las acciones que alimentan el embudo comercial de la empresa. Estas acciones "
        "están diseñadas para reducir fricción y dejar trazabilidad en el entorno operativo del anunciante.",
        y,
    )
    y -= 1.5 * mm
    y = two_col(
        c,
        [
            ("Chat RSC", "Mensajería dentro de la plataforma. El equipo responde desde el Panel de leads / Backoffice y conserva historial."),
            ("WhatsApp", "Canal rápido vinculado al número corporativo configurado por la empresa en su perfil operativo."),
            ("Agendar visita", "Captura de nombre, teléfono, correo opcional, fecha, hora y notas, con validación de disponibilidad."),
            ("Comparar y favoritos", "El comprador organiza alternativas; aumenta intención de recontacto y calidad de la conversación."),
        ],
        y,
        bh=18 * mm,
    )
    y -= 1.5 * mm
    y = callout(
        c,
        "Principio reiterado al comprador y a la empresa: RSC no hace papeleo, no firma contratos, no custodia dinero "
        "ni cierra operaciones. La visita, documentación y entrega son exclusivamente entre cliente y empresa.",
        y,
    )
    y -= 1 * mm
    y = h2(c, 16, "Implicaciones para el equipo comercial", y)
    y = bullets(
        c,
        [
            "Debe existir un responsable operativo de respuesta a chats y visitas con SLA interno definido por la empresa.",
            "La calidad del anuncio (media, datos, precio, ubicación) condiciona directamente la calidad del lead.",
            "La verificación y el sello RSC refuerzan la tasa de contacto frente a anuncios no verificados de otros canales.",
            "El uso combinado de chat + WhatsApp + agenda permite cubrir distintos niveles de intención del comprador.",
        ],
        y,
    )
    draw_footer(c, 5)


def page_06(c):
    draw_bg(c, 6)
    y = draw_header(c)
    y = h2(c, 17, "Propuesta extendida para la empresa", y)
    y = p(
        c,
        "La incorporación a REESKOVA no consiste únicamente en listar inventario. La empresa pasa a operar dentro "
        "de una infraestructura que articula distribución pública, identidad verificada y herramientas privadas de "
        "gestión comercial. El valor se mide en capacidad de convertir descubrimiento en conversación y visita.",
        y,
    )
    y -= 2 * mm
    y = h2(c, 18, "Beneficios operativos", y)
    y = bullets(
        c,
        [
            "Canal de demanda alineado a inventario verificado, no a clasificados abiertos de particulares.",
            "Centralización de chats, visitas y solicitudes con estados operativos claros para el equipo.",
            "Identidad corporativa visible: marca, documento, sucursales, horarios y WhatsApp en el marketplace.",
            "Sincronización de anuncios desde Backoffice hacia vitrinas públicas multiidioma y multi-mercado.",
            "Capacidad de destacar inventario y utilizar insights de IA para priorizar acciones comerciales.",
            "Separación nítida entre distribución digital y responsabilidad legal del cierre, reduciendo ambigüedad.",
            "Escalabilidad para redes y operaciones que requieren consistencia de marca en varias plazas.",
        ],
        y,
    )
    y -= 2 * mm
    y = h2(c, 19, "Lo que REESKOVA no asume", y)
    y = table(
        c,
        ["Fuera de alcance", "Implicación práctica"],
        [
            ["Intermediación contractual", "RSC no redacta, firma ni garantiza contratos entre comprador y empresa"],
            ["Custodia de fondos", "RSC no retiene el precio de la operación ni actúa como escrow del deal marketplace"],
            ["Trámites legales / registrales", "Documentación notarial, registral o regulatoria es ajena a la plataforma"],
            ["Cierre y entrega", "La ejecución física y jurídica de la operación corresponde a las partes"],
            ["Aprobación crediticia", "Si existe financiación, la decide la entidad partner o anunciante financiero"],
        ],
        y,
    )
    y -= 2 * mm
    y = h2(c, 20, "Perfil de empresa ideal", y)
    y = p(
        c,
        "REESKOVA está orientada a organizaciones con inventario real, capacidad de atención comercial y voluntad "
        "de mantener estándares de veracidad. El onboarding verifica identidad corporativa precisamente para preservar "
        "esa calidad de red.",
        y,
    )
    y -= 1.5 * mm
    y = bullets(
        c,
        [
            "Dispone de inventario activo de inmuebles, vehículos o servicios publicados de forma profesional.",
            "Cuenta con equipo o responsable para responder leads en plazos comerciales razonables.",
            "Acepta operar bajo reglas de marketplace curado y verificación.",
            "Valora controlar la relación con el cliente hasta el cierre, sin cederla a una gestoría digital.",
            "Busca presencia multi-mercado o multiidioma sin fragmentar su operación en múltiples herramientas aisladas.",
        ],
        y,
    )
    draw_footer(c, 6)


def page_07(c):
    draw_bg(c, 7)
    y = draw_header(c)
    y = h2(c, 21, "Infraestructura SaaS — Portal Empresas", y)
    y = p(
        c,
        "La operación diaria se concentra en el Portal Empresas / Backoffice. El marketplace REESKOVA sincroniza "
        "el inventario publicado y entrega los eventos de demanda generados por compradores. El Backoffice es la "
        "fuente de verdad de anuncios y organización; el marketplace es la capa de descubrimiento, contacto y agenda.",
        y,
    )
    y -= 2 * mm
    y = h2(c, 22, "Módulos del entorno empresarial", y)
    y = table(
        c,
        ["Módulo", "Función"],
        [
            ["Gestión de anuncios", "Alta, edición, destacados, media y control de inventario activo"],
            ["CRM de leads", "Organización de contactos, solicitudes y visitas en un flujo único"],
            ["Chat integrado", "Respuesta a hilos RSC con continuidad e historial"],
            ["Agenda de visitas", "Gestión de solicitudes con estados pending, confirmed, cancelled y reschedule_proposed"],
            ["Analytics", "Visibilidad de rendimiento por anuncio, región y conversión"],
            ["Sello verificado", "Señal pública de confianza asociada al perfil y a las fichas"],
            ["IA para ventas", "Insights y priorización comercial para destacar inventario"],
            ["WhatsApp corporativo", "Canal rápido vinculado al perfil de la organización"],
            ["Datos de organización", "Logo, documento fiscal, sucursales, horarios y datos de contacto"],
            ["Extensiones de red", "Multi-sucursal e integraciones API para operaciones de mayor escala"],
        ],
        y,
        fs=7.1,
    )
    y -= 2 * mm
    y = h2(c, 23, "Arquitectura operativa", y)
    y = table(
        c,
        ["Capa", "Comportamiento"],
        [
            ["Backoffice empresas", "Administración de inventario y organización; origen de verdad de listings"],
            ["API marketplace", "Sincronización de anuncios hacia vitrinas públicas del marketplace"],
            ["Eventos de demanda", "Chats, visitas y contactos generados en la capa pública y consumidos por la empresa"],
            ["Perfil verificado", "Atributos de confianza visibles en tarjetas, detalle y búsqueda"],
            ["Buyer hub", "El comprador también conserva favoritos, comparaciones y visitas en su espacio de usuario"],
        ],
        y,
    )
    y -= 2 * mm
    y = h2(c, 24, "Implicaciones de gobierno de datos", y)
    y = bullets(
        c,
        [
            "La empresa es responsable del contenido que publica y de los datos que recibe fuera de la plataforma.",
            "REESKOVA trata datos de cuenta, publicación, descubrimiento, mensajería y visitas conforme a sus políticas.",
            "Partners financieros o de servicios que intervienen tras el contacto son responsables independientes de sus procesos.",
            "La verificación de onboarding puede requerir identificación corporativa y validación de contactos.",
        ],
        y,
    )
    y -= 1.5 * mm
    y = callout(
        c,
        "Diseño deliberado: separar distribución (marketplace) de operación (SaaS) permite escalar audiencia sin "
        "obligar a la empresa a ceder el control del cierre comercial.",
        y,
    )
    draw_footer(c, 7)


def page_08(c):
    draw_bg(c, 8)
    y = draw_header(c)
    y = h2(c, 25, "Proceso de incorporación", y)
    y = p(
        c,
        "El ingreso de empresas es verificado. El proceso protege la calidad del marketplace y la confianza del "
        "comprador. No se trata de un alta inmediata sin revisión: la activación operativa ocurre tras validación "
        "del equipo RSC.",
        y,
    )
    y -= 2 * mm
    y = steps(
        c,
        [
            ("Solicitud", "Formulario corporativo en Para Empresas"),
            ("Revisión", "Validación de identidad y datos en hasta 24 h"),
            ("Activación", "Credenciales y acceso al Backoffice"),
            ("Puesta en marcha", "Perfil, inventario y atención de leads"),
        ],
        y,
        bh=18 * mm,
    )
    y -= 1 * mm
    y = h2(c, 26, "Información requerida en la solicitud", y)
    y = table(
        c,
        ["Campo", "Propósito"],
        [
            ["Nombre de la empresa", "Identificación comercial / razón social para el perfil corporativo"],
            ["Documento fiscal / ID", "Validación de existencia e identidad corporativa"],
            ["Correo corporativo", "Canal para comunicación de onboarding y entrega de acceso"],
            ["Teléfono / WhatsApp", "Contacto operativo durante verificación y activación"],
            ["Categoría", "Clasificación: real estate, automotive, agency, retail o services"],
        ],
        y,
    )
    y -= 2 * mm
    y = h2(c, 27, "Tratamiento de la solicitud", y)
    y = bullets(
        c,
        [
            "La solicitud se registra con estado inicial pending para revisión interna.",
            "El equipo RSC puede solicitar información adicional de verificación corporativa.",
            "Solicitudes duplicadas en estado pendiente son rechazadas para evitar dobles altas.",
            "Tras la aprobación, se envían instrucciones de acceso al Portal Empresas / Backoffice.",
            "La empresa configura perfil, identidad visual, sucursales y canales de contacto antes o al publicar inventario.",
        ],
        y,
    )
    y -= 2 * mm
    y = h2(c, 28, "Actividades posteriores a la aprobación", y)
    y = table(
        c,
        ["Actividad", "Resultado esperado"],
        [
            ["Acceso Backoffice", "Equipo autorizado ingresa al entorno de administración"],
            ["Configuración de organización", "Logo, documento, sucursales, horarios y WhatsApp operativos"],
            ["Publicación inicial", "Primer conjunto de anuncios activos en la vertical correspondiente"],
            ["Verificación visible", "Activación del sello conforme a la validación del equipo RSC"],
            ["Operación de demanda", "Atención de chats y visitas desde el panel de leads"],
            ["Optimización", "Uso de destacados, analytics e insights para priorizar inventario"],
        ],
        y,
    )
    y -= 1.5 * mm
    y = callout(
        c,
        "Canal de solicitud: sección Para Empresas en REESKOVA. Contacto institucional: "
        f"{EMAIL}  ·  {PHONE}  ·  {WEB}",
        y,
    )
    draw_footer(c, 8)


def page_09(c):
    draw_bg(c, 9)
    y = draw_header(c)
    y = h2(c, 29, "Operación A — publicar inventario", y)
    y = p(
        c,
        "La publicación se administra en el Backoffice. Una vez activo, el anuncio se sincroniza con el marketplace "
        "y queda disponible en las vitrinas públicas. La calidad de datos y media determina la capacidad de conversión.",
        y,
    )
    y -= 1.5 * mm
    y = steps(
        c,
        [
            ("Crear", "Datos, precio, ubicación, atributos"),
            ("Media", "Fotografías, video y materiales visuales"),
            ("Publicar", "Estado activo en Backoffice"),
            ("Sincronizar", "Exposición en vitrina pública"),
            ("Optimizar", "Destacados, analytics e insights"),
        ],
        y,
        bh=17 * mm,
    )
    y -= 1 * mm
    y = bullets(
        c,
        [
            "El anuncio debe mantener precio, disponibilidad y atributos actualizados para evitar leads inválidos.",
            "La media profesional y la geolocalización correcta mejoran descubrimiento por mapa y filtros.",
            "Los destacados e insights de IA ayudan a priorizar unidades o unidades/vehículos con mayor demanda relativa.",
            "La empresa conserva la potestad de pausar o retirar inventario desde su entorno de administración.",
        ],
        y,
    )
    y -= 2 * mm
    y = h2(c, 30, "Operación B — del contacto al lead", y)
    y = table(
        c,
        ["Paso", "Descripción"],
        [
            ["1", "El comprador abre la ficha pública del anuncio en la vitrina correspondiente."],
            ["2", "Selecciona chat RSC o WhatsApp como canal de primer contacto."],
            ["3", "Se genera un hilo o contacto dirigido a la empresa anunciante."],
            ["4", "El equipo responde desde el Panel de leads / Backoffice según su protocolo interno."],
            ["5", "La conversación queda disponible para seguimiento, calificación y cierre comercial externo."],
        ],
        y,
        col_w=[(W - 2 * MX) * 0.10, (W - 2 * MX) * 0.90],
    )
    y -= 1.5 * mm
    y = h2(c, 31, "Operación C — agenda de visita", y)
    y = table(
        c,
        ["Paso", "Descripción"],
        [
            ["1", "El comprador elige la acción de agendar visita en la ficha."],
            ["2", "Ingresa datos de contacto, fecha, hora y notas relevantes."],
            ["3", "El sistema valida la solicitud conforme a la disponibilidad definida por la empresa."],
            ["4", "La visita queda registrada en estado inicial pendiente de gestión."],
            ["5", "La empresa confirma, cancela o propone reagendar; el comprador visualiza el estado en su espacio."],
        ],
        y,
        col_w=[(W - 2 * MX) * 0.10, (W - 2 * MX) * 0.90],
    )
    y -= 1.5 * mm
    y = callout(
        c,
        "Estados de visita utilizados en operación: pending, confirmed, cancelled y reschedule_proposed. "
        "Esta máquina de estados permite seguimiento comercial sin que RSC intervenga en la logística física.",
        y,
    )
    y -= 1 * mm
    y = h2(c, 32, "Buenas prácticas operativas", y)
    y = bullets(
        c,
        [
            "Definir tiempos máximos de primera respuesta para chat y visitas.",
            "Mantener franjas de agenda realistas para evitar cancelaciones sistemáticas.",
            "Unificar criterio de calificación de leads entre sucursales cuando exista red.",
            "Registrar en el CRM interno de la empresa el resultado posterior al contacto (cuando aplique).",
        ],
        y,
    )
    draw_footer(c, 9)


def page_10(c):
    draw_bg(c, 10)
    y = draw_header(c)
    y = h2(c, 33, "Capacidades de descubrimiento", y)
    y = p(
        c,
        "Además del panel B2B, REESKOVA ofrece herramientas públicas que elevan la calidad del tráfico hacia el "
        "inventario de la empresa. Estas capacidades existen para mejorar intención, no solo volumen de visitas.",
        y,
    )
    y -= 2 * mm
    y = two_col(
        c,
        [
            ("Mapas y geografía", "Vistas lista, galería, mapa y satélite; navegación jerárquica y geocodificación para descubrimiento local."),
            ("Comparador", "Comparación de inmuebles y vehículos, favoritos y continuidad entre sesión de invitado y cuenta."),
            ("Reeskova AI", "Búsqueda en lenguaje natural e insights orientados a priorización comercial del inventario."),
            ("Financiación visible", "Señalización de opciones crediticias de partners; el acuerdo permanece con la entidad."),
            ("Multiidioma", "Interfaz en siete idiomas para mercados regionales e internacionales."),
            ("Sello verificado", "Badge público en tarjetas y fichas para reforzar confianza del comprador."),
        ],
        y,
        bh=18 * mm,
    )
    y -= 1.5 * mm
    y = h2(c, 34, "Superficies relevantes del producto", y)
    y = table(
        c,
        ["Superficie", "Función"],
        [
            ["Para Empresas", "Entrada corporativa B2B y explicación del valor para anunciantes"],
            ["Registro de empresa", "Formulario de solicitud de incorporación y verificación"],
            ["Vitrina de inmuebles", "Descubrimiento público de propiedades"],
            ["Vitrina de vehículos", "Descubrimiento público de inventario automotriz"],
            ["Servicios / financiación", "Capas del journey y opciones crediticias de partners"],
            ["Portal Empresas / Backoffice", "Administración de inventario, organización y operación de demanda"],
        ],
        y,
    )
    y -= 2 * mm
    y = h2(c, 35, "Señales de confianza al mercado", y)
    y = bullets(
        c,
        [
            "Marketplace restringido a empresas asociadas: no es un clasificado abierto de particulares.",
            "Verificación de onboarding antes del acceso operativo completo.",
            "Identidad corporativa visible en fichas y resultados de búsqueda.",
            "Transparencia institucional sobre el rol de RSC: publica y conecta; no oculta límites.",
            "Políticas de uso, privacidad y cumplimiento disponibles en el producto para compradores y empresas.",
        ],
        y,
    )
    y -= 1.5 * mm
    y = h2(c, 36, "Implicación para la estrategia comercial de la empresa", y)
    y = p(
        c,
        "La empresa que opera en REESKOVA debe tratar el canal como infraestructura de demanda y reputación. "
        "La consistencia de inventario, la velocidad de respuesta y la claridad de identidad corporativa son "
        "los factores que convierten la presencia en resultados comerciales medibles.",
        y,
    )
    draw_footer(c, 10)


def page_11(c):
    draw_bg(c, 11)
    y = draw_header(c)
    y = h2(c, 37, "Ecosistema alrededor de la decisión", y)
    y = p(
        c,
        "REESKOVA forma parte de un journey ampliado dentro del ecosistema RSC Group. Partners y unidades del grupo "
        "pueden aportar capas complementarias — financiación, seguros, hogar, energía — sin modificar el principio "
        "de que el cierre de la operación principal permanece entre cliente y empresa anunciante.",
        y,
    )
    y -= 2 * mm
    y = table(
        c,
        ["Capa", "Contribución"],
        [
            ["Financiación", "Opciones de crédito visibles en el momento de decisión; acuerdo con la entidad correspondiente"],
            ["Seguros", "Protección contextual asociada a inmueble o vehículo"],
            ["Hogar y energía", "Servicios post-decisión: mudanzas, ambientación, solar, conectividad"],
            ["Grupo RSC", "RSC Group, RSC Chain, wallet, bank, capital y partners tecnológicos del ecosistema"],
        ],
        y,
    )
    y -= 2 * mm
    y = h2(c, 38, "Marco institucional y legal", y)
    y = p(
        c,
        "El posicionamiento legal de REESKOVA es deliberadamente acotado. Esa claridad reduce ambigüedad regulatoria "
        "y alinea expectativas entre RSC, empresas y usuarios finales.",
        y,
    )
    y -= 1.5 * mm
    y = bullets(
        c,
        [
            "REESKOVA / RSC Market opera como plataforma de publicación y conexión dentro del ecosistema RSC Group.",
            "No intermedia contratos, pagos ni trámites legales entre comprador y anunciante.",
            "No actúa como inmobiliaria intermediaria, concesionario, escrow ni bufete.",
            "Los anunciantes e instituciones partner son responsables independientes de sus procesos y obligaciones.",
            "Las empresas deben mantener información veraz, anuncios conformes y atención responsable a la demanda recibida.",
            "RSC puede aplicar controles de calidad, verificación y suspensión para proteger la integridad del marketplace.",
        ],
        y,
    )
    y -= 2 * mm
    y = h2(c, 39, "Compromisos recíprocos", y)
    y = table(
        c,
        ["RSC Group", "Empresa participante"],
        [
            ["Proveer acceso a la infraestructura REESKOVA", "Entregar datos corporativos veraces y actualizados"],
            ["Coordinar activación vía equipo de partnerships", "Mantener anuncios responsables y vigentes"],
            ["Preservar un marketplace curado y verificado", "Atender leads y visitas con estándar profesional"],
            ["Respetar la imagen de marca del partner", "Respetar la identidad institucional de RSC / REESKOVA"],
            ["Mantener canales oficiales de contacto", "Designar un contacto operativo interno permanente"],
        ],
        y,
        col_w=[(W - 2 * MX) * 0.5, (W - 2 * MX) * 0.5],
        fs=7.0,
    )
    y -= 1.5 * mm
    y = callout(
        c,
        "Cualquier colaboración comercial específica, anexo creativo o condición particular entre RSC y una empresa "
        "deberá documentarse por escrito. Este documento es presentación corporativa informativa, no contrato.",
        y,
    )
    draw_footer(c, 11)


def page_12(c):
    draw_bg(c, 12)
    y = draw_header(c)
    y = h2(c, 40, "Cómo incorporar su empresa", y)
    y = p(
        c,
        "Para operar en la infraestructura REESKOVA, la empresa completa el registro corporativo en la sección "
        "Para Empresas o escribe al equipo RSC. El onboarding incluye verificación, activación de acceso y soporte "
        "para la puesta en marcha del perfil y del inventario inicial.",
        y,
    )
    y -= 2 * mm
    y = steps(
        c,
        [
            ("Entrar", "REESKOVA → Para Empresas"),
            ("Registrar", "Solicitud corporativa completa"),
            ("Verificar", "Revisión RSC en hasta 24 h"),
            ("Activar", "Acceso Backoffice e inventario"),
        ],
        y,
        bh=18 * mm,
    )
    y -= 1 * mm
    y = h2(c, 41, "Canales oficiales", y)
    y = table(
        c,
        ["Canal", "Detalle"],
        [
            ["Registro web", "REESKOVA → Para Empresas → registro de empresa"],
            ["Correo corporativo", EMAIL],
            ["Teléfono (Francia)", PHONE],
            ["Sitio corporativo", WEB],
            ["Asunto recomendado", "Incorporación empresa — REESKOVA"],
            ["Información a incluir", "Nombre legal, país/mercado, vertical, volumen aproximado de inventario y contacto operativo"],
        ],
        y,
    )
    y -= 2 * mm
    y = h2(c, 42, "Checklist de preparación", y)
    y = bullets(
        c,
        [
            "Disponer de documento fiscal / identificador corporativo vigente.",
            "Definir correo y teléfono operativos que serán usados en verificación y atención.",
            "Preparar identidad visual (logo) y datos de sucursales u horarios si aplican.",
            "Seleccionar el inventario inicial que se publicará tras la activación.",
            "Nombrar un responsable interno de onboarding y respuesta a leads.",
            "Revisar internamente el principio de no intermediación para alinear expectativas del equipo comercial.",
        ],
        y,
    )
    y -= 2 * mm
    y = h2(c, 43, "Preguntas frecuentes de incorporación", y)
    y = table(
        c,
        ["Pregunta", "Respuesta institucional"],
        [
            ["¿Quién puede publicar?", "Solo empresas asociadas y verificadas. Los particulares no administran anuncios."],
            ["¿RSC intermedia el cierre?", "No. Publica y conecta; negociación, contrato y pago son entre las partes."],
            ["¿Cuánto tarda la verificación?", "El proceso estándar de revisión es de hasta 24 horas hábiles de análisis."],
            ["¿Qué verticales admite?", "Inmuebles, vehículos, servicios y categorías de onboarding asociadas."],
            ["¿Dónde administrar inventario?", "En el Portal Empresas / Backoffice, sincronizado al marketplace público."],
        ],
        y,
        fs=6.9,
    )
    y -= 1.5 * mm
    y = h2(c, 44, "Cierre", y)
    y = p(
        c,
        "REESKOVA ofrece a las empresas una infraestructura digital para publicar, captar demanda y operar la "
        "relación comercial con claridad de roles. El marketplace distribuye y conecta; la empresa decide, negocia "
        "y cierra. La incorporación está orientada a organizaciones que valoran verificación, control comercial "
        "y operación profesional del canal digital.",
        y,
    )
    y -= 1.5 * mm
    y = callout(
        c,
        f"One Marketplace. Endless Opportunities. — REESKOVA by RSC Group  ·  {WEB}  ·  {EMAIL}  ·  {PHONE}",
        y,
    )
    y -= 1 * mm
    y = p(
        c,
        "Aviso: REESKOVA / RSC Market es una plataforma de publicación y conexión operada en el ecosistema RSC Group. "
        "No intermedia contratos, no custodia fondos ni realiza trámites legales. Este documento es informativo e "
        "institucional; no constituye oferta vinculante ni términos comerciales definitivos. Para condiciones "
        f"particulares, escriba a {EMAIL} o llame al {PHONE}. Sitio corporativo: {WEB}.",
        y, size=7.0, leading=9.5, color=MUTED,
    )
    y -= 3 * mm
    c.setFillColor(ACCENT)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(MX, y, "RSC GROUP")
    y -= 3.5 * mm
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 7.5)
    c.drawString(MX, y, f"REESKOVA  ·  {WEB}  ·  {EMAIL}  ·  {PHONE}")
    draw_footer(c, 12)


def main():
    c = canvas.Canvas(OUT, pagesize=A4)
    pages = [
        page_01, page_02, page_03, page_04, page_05, page_06,
        page_07, page_08, page_09, page_10, page_11, page_12,
    ]
    for i, fn in enumerate(pages):
        fn(c)
        if i < len(pages) - 1:
            c.showPage()
    c.save()
    print(f"Wrote {OUT} ({TOTAL} pages)")
    # sanity
    bad = ["STEEVE", "rscgroup.com", "partnerships@", "+55 54", "Inmobiliaria Valle", "Apto Centro", "Owner"]
    # can't easily read pdf here without deps; print reminder
    print("Contacts:", EMAIL, PHONE, WEB)


if __name__ == "__main__":
    main()
