#!/usr/bin/env python3
"""Contrato de captación comercial — reclutador de empresas anunciantes RSC."""

from __future__ import annotations

import os

from reportlab.lib.colors import HexColor, white
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

FONT_DIR = "/usr/share/fonts/truetype/dejavu"
pdfmetrics.registerFont(TTFont("DejaVu", os.path.join(FONT_DIR, "DejaVuSans.ttf")))
pdfmetrics.registerFont(TTFont("DejaVu-Bold", os.path.join(FONT_DIR, "DejaVuSans-Bold.ttf")))

OUT_ES = os.path.join(os.path.dirname(__file__), "Contrato-Reclutador-Empresas-RSC.pdf")
OUT_EN = os.path.join(os.path.dirname(__file__), "RSC-Company-Recruiter-Agreement.pdf")
META = {"header": "Contrato de captación comercial", "footer": "Modelo para completar y firmar  ·  RSC Market"}

INK = HexColor("#142820")
MUTED = HexColor("#5A6B63")
GREEN = HexColor("#0B2218")
GOLD = HexColor("#C9A84C")
CREAM = HexColor("#FAF8F5")
SOFT = HexColor("#E8F0EC")
LINE = HexColor("#D5DDD8")

PAGE_W, PAGE_H = A4


def styles():
    s = {}
    s["kicker"] = ParagraphStyle(
        "kicker",
        fontName="DejaVu-Bold",
        fontSize=8,
        leading=11,
        textColor=GOLD,
        alignment=TA_LEFT,
        tracking=0.6,
    )
    s["h1"] = ParagraphStyle(
        "h1",
        fontName="DejaVu-Bold",
        fontSize=16,
        leading=20,
        textColor=GREEN,
        alignment=TA_LEFT,
        spaceAfter=4,
    )
    s["sub"] = ParagraphStyle(
        "sub",
        fontName="DejaVu",
        fontSize=9,
        leading=13,
        textColor=MUTED,
        spaceAfter=8,
    )
    s["h2"] = ParagraphStyle(
        "h2",
        fontName="DejaVu-Bold",
        fontSize=11,
        leading=14,
        textColor=GREEN,
        spaceBefore=10,
        spaceAfter=4,
    )
    s["body"] = ParagraphStyle(
        "body",
        fontName="DejaVu",
        fontSize=9,
        leading=12.5,
        textColor=INK,
        alignment=TA_JUSTIFY,
        spaceAfter=6,
    )
    s["clause"] = ParagraphStyle(
        "clause",
        fontName="DejaVu",
        fontSize=9,
        leading=12.5,
        textColor=INK,
        alignment=TA_JUSTIFY,
        spaceAfter=5,
        leftIndent=0,
    )
    s["label"] = ParagraphStyle(
        "label",
        fontName="DejaVu-Bold",
        fontSize=8,
        leading=11,
        textColor=MUTED,
        spaceBefore=2,
        spaceAfter=1,
    )
    s["field"] = ParagraphStyle(
        "field",
        fontName="DejaVu",
        fontSize=9,
        leading=12,
        textColor=INK,
        spaceAfter=2,
    )
    s["box_title"] = ParagraphStyle(
        "box_title",
        fontName="DejaVu-Bold",
        fontSize=8,
        leading=11,
        textColor=GOLD,
        alignment=TA_CENTER,
    )
    s["box_big"] = ParagraphStyle(
        "box_big",
        fontName="DejaVu-Bold",
        fontSize=13,
        leading=16,
        textColor=white,
        alignment=TA_CENTER,
    )
    s["box_small"] = ParagraphStyle(
        "box_small",
        fontName="DejaVu",
        fontSize=8,
        leading=11,
        textColor=HexColor("#E8F0EC"),
        alignment=TA_CENTER,
    )
    s["example"] = ParagraphStyle(
        "example",
        fontName="DejaVu",
        fontSize=8.5,
        leading=12,
        textColor=INK,
        alignment=TA_LEFT,
    )
    s["sign"] = ParagraphStyle(
        "sign",
        fontName="DejaVu",
        fontSize=8.5,
        leading=12,
        textColor=INK,
        alignment=TA_LEFT,
    )
    s["footer"] = ParagraphStyle(
        "footer",
        fontName="DejaVu",
        fontSize=7.5,
        leading=9,
        textColor=MUTED,
        alignment=TA_CENTER,
    )
    s["center_note"] = ParagraphStyle(
        "center_note",
        fontName="DejaVu",
        fontSize=8,
        leading=11,
        textColor=MUTED,
        alignment=TA_CENTER,
        spaceBefore=6,
    )
    return s


S = styles()


def header_footer(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(GREEN)
    canvas.rect(0, PAGE_H - 16 * mm, PAGE_W, 16 * mm, fill=1, stroke=0)
    canvas.setFillColor(GOLD)
    canvas.rect(0, PAGE_H - 17.2 * mm, PAGE_W, 1.2 * mm, fill=1, stroke=0)
    canvas.setFillColor(white)
    canvas.setFont("DejaVu-Bold", 9)
    canvas.drawString(18 * mm, PAGE_H - 10 * mm, "RSC  ·  REESKOVA")
    canvas.setFont("DejaVu", 8)
    canvas.drawRightString(PAGE_W - 18 * mm, PAGE_H - 10 * mm, META["header"])

    canvas.setFillColor(GREEN)
    canvas.rect(0, 0, PAGE_W, 12 * mm, fill=1, stroke=0)
    canvas.setFillColor(HexColor("#E8F0EC"))
    canvas.setFont("DejaVu", 7.5)
    canvas.drawString(18 * mm, 5 * mm, META["footer"])
    canvas.drawRightString(PAGE_W - 18 * mm, 5 * mm, f"{doc.page}")
    canvas.restoreState()


def commission_box(left_title, left_sub, right_sub, example):
    left = [
        Paragraph(left_title, S["box_title"]),
        Spacer(1, 2 * mm),
        Paragraph("40%", S["box_big"]),
        Spacer(1, 1.5 * mm),
        Paragraph(left_sub, S["box_small"]),
    ]
    right = [
        Paragraph("RSC", S["box_title"]),
        Spacer(1, 2 * mm),
        Paragraph("60%", S["box_big"]),
        Spacer(1, 1.5 * mm),
        Paragraph(right_sub, S["box_small"]),
    ]
    inner = Table([[left, right]], colWidths=[82 * mm, 82 * mm])
    inner.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (0, 0), HexColor("#163D30")),
                ("BACKGROUND", (1, 0), (1, 0), HexColor("#0B2218")),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ("LINEAFTER", (0, 0), (0, 0), 0.6, GOLD),
            ]
        )
    )
    wrap = Table([[inner]], colWidths=[164 * mm])
    wrap.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), GREEN),
                ("BOX", (0, 0), (-1, -1), 1.2, GOLD),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    note = Paragraph(example, S["example"])
    note_wrap = Table([[note]], colWidths=[164 * mm])
    note_wrap.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), SOFT),
                ("BOX", (0, 0), (-1, -1), 0.4, LINE),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    return KeepTogether([wrap, Spacer(1, 2 * mm), note_wrap])


def field(label, hint=""):
    line = hint or "______________________________________________"
    return [Paragraph(label, S["label"]), Paragraph(line, S["field"])]


def build():
    story = []
    story.append(Paragraph("RSC MARKET", S["kicker"]))
    story.append(Spacer(1, 1.5 * mm))
    story.append(Paragraph("Contrato de prestación de servicios<br/>de captación de empresas anunciantes", S["h1"]))
    story.append(
        Paragraph(
            "El Reclutador capta empresas para que anuncien en RSC. "
            "De cada cuota mensual que esa empresa pague, el 40% es del Reclutador y el 60% es de RSC.",
            S["sub"],
        )
    )
    story.append(
        commission_box(
            "EL RECLUTADOR",
            "de cada cuota mensual<br/>que la empresa pague",
            "de esa misma cuota<br/>mensual",
            "Ejemplo. Si la empresa paga R$ 299 al mes por su plan de anuncios, "
            "el Reclutador recibe <b>R$ 119,60</b> y RSC retiene <b>R$ 179,40</b>. "
            "La regla es la misma sea cual sea el importe del plan de pago.",
        )
    )
    story.append(Spacer(1, 4 * mm))

    story.append(Paragraph("Partes", S["h2"]))
    story.append(
        Paragraph(
            "En la ciudad de ____________________, a _____ de ________________________ de 20____, "
            "comparecen las siguientes partes:",
            S["body"],
        )
    )
    story.append(Paragraph("1. RSC (la plataforma)", S["label"]))
    story.append(
        Paragraph(
            "La sociedad operadora de la plataforma <b>RSC Market (REESKOVA)</b>, "
            "parte del grupo RSC, en adelante <b>RSC</b>.",
            S["clause"],
        )
    )
    for label, hint in [
        ("Razón social", ""),
        ("CNPJ / documento", ""),
        ("Domicilio", ""),
        ("Representante y cargo", ""),
    ]:
        story.extend(field(label))

    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph("2. El Reclutador", S["label"]))
    story.append(
        Paragraph(
            "La persona física o jurídica que capta empresas anunciantes, en adelante <b>el Reclutador</b>.",
            S["clause"],
        )
    )
    for label in [
        "Nombre o razón social",
        "CPF / CNPJ / documento",
        "Domicilio",
        "Correo y teléfono",
        "Cuenta bancaria para el pago de la comisión",
    ]:
        story.extend(field(label))

    story.append(Spacer(1, 2 * mm))
    story.append(
        Paragraph(
            "RSC y el Reclutador se denominan, en conjunto, las <b>Partes</b>.",
            S["body"],
        )
    )

    story.append(Paragraph("Cláusula 1. Objeto", S["h2"]))
    story.append(
        Paragraph(
            "El Reclutador prestará a RSC servicios de captación comercial: identificar, contactar "
            "y presentar empresas (inmobiliarias, concesionarias, constructoras, prestadores de "
            "servicios y otros anunciantes) para que se registren y contraten un plan de anuncios "
            "de pago en RSC Market.",
            S["clause"],
        )
    )
    story.append(
        Paragraph(
            "RSC es un marketplace de publicación y contacto. No cierra la compraventa entre "
            "el anunciante y el comprador, no custodia ese dinero y no sustituye a la empresa "
            "anunciante. Este contrato solo regula la captación de empresas y la comisión del Reclutador.",
            S["clause"],
        )
    )

    story.append(Paragraph("Cláusula 2. Naturaleza de la relación", S["h2"]))
    story.append(
        Paragraph(
            "El Reclutador actúa como prestador independiente. Este contrato no crea relación laboral, "
            "sociedad, mandato general ni exclusividad, salvo que las Partes lo pacten por escrito. "
            "El Reclutador organiza su tiempo, asume sus gastos de captación y no tiene poder para "
            "obligar a RSC, conceder descuentos, prometer condiciones distintas de los planes vigentes "
            "ni cobrar a las empresas.",
            S["clause"],
        )
    )

    story.append(Paragraph("Cláusula 3. Qué es una empresa captada", S["h2"]))
    story.append(
        Paragraph(
            "Una <b>Empresa Captada</b> es la que cumple las tres condiciones siguientes:",
            S["clause"],
        )
    )
    items = [
        "El Reclutador la presentó a RSC antes de que fuera cliente de pago.",
        "La empresa se registra identificando al Reclutador (código, enlace o constancia escrita aceptada por RSC).",
        "RSC no tenía ya con esa empresa una relación comercial activa ni una negociación abierta atribuida a otro canal.",
    ]
    for i, text in enumerate(items, 1):
        story.append(Paragraph(f"{i}. {text}", S["clause"]))
    story.append(
        Paragraph(
            "Si dos personas reclaman la misma empresa, prevalece el registro escrito que conste "
            "en el alta aceptada por RSC. Las empresas que llegan solas, las que ya eran clientes "
            "y las captadas por el equipo de RSC no generan comisión para el Reclutador.",
            S["clause"],
        )
    )

    story.append(Paragraph("Cláusula 4. Comisión: 40% de la cuota mensual", S["h2"]))
    story.append(
        Paragraph(
            "<b>4.1.</b> Por cada Empresa Captada, el Reclutador percibe el <b>cuarenta por ciento (40%)</b> "
            "de la cuota mensual del plan de anuncios que esa empresa pague a RSC.",
            S["clause"],
        )
    )
    story.append(
        Paragraph(
            "<b>4.2.</b> El <b>sesenta por ciento (60%)</b> restante de esa misma cuota mensual "
            "corresponde a RSC. El Reclutador no participa de otros ingresos de la plataforma.",
            S["clause"],
        )
    )
    story.append(
        Paragraph(
            "<b>4.3.</b> La comisión nace cada mes, solo sobre la cuota que RSC haya cobrado de verdad. "
            "Si la empresa no paga un mes, ese mes no hay comisión. Si cambia de plan, recibe un "
            "descuento, una devolución o un contracargo, la base es el importe efectivamente cobrado "
            "y no revertido. El plan gratuito no genera comisión.",
            S["clause"],
        )
    )
    story.append(
        Paragraph(
            "<b>4.4.</b> El derecho al 40% se mantiene <b>todos los meses en que la Empresa Captada "
            "siga pagando</b> su plan, aunque este contrato ya haya terminado. Se extingue si la "
            "empresa deja de pagar, si RSC resuelve el contrato por incumplimiento grave del "
            "Reclutador, o si se acredita que la atribución de la empresa fue falsa.",
            S["clause"],
        )
    )
    story.append(
        Paragraph(
            "<b>4.5.</b> El 40% se calcula sobre la cuota del plan cobrada a la empresa. No se "
            "descuentan costes operativos de RSC. Cada Parte paga sus propios impuestos. "
            "Si un tributo se factura aparte de la cuota del plan, no entra en la base.",
            S["clause"],
        )
    )
    story.append(
        Paragraph(
            "<b>4.6.</b> El Reclutador no cobra a las empresas. La empresa paga a RSC. "
            "RSC paga después el 40% al Reclutador.",
            S["clause"],
        )
    )

    story.append(Paragraph("Cláusula 5. Liquidación y pago", S["h2"]))
    story.append(
        Paragraph(
            "RSC paga la comisión dentro de los <b>quince (15) días</b> siguientes al cierre de "
            "cada mes natural, por transferencia a la cuenta indicada en este contrato. "
            "Con cada pago entrega un detalle con: empresa, plan, cuota cobrada y 40% correspondiente. "
            "El Reclutador puede pedir el detalle de un mes dentro de los noventa (90) días siguientes "
            "al pago. Pasado ese plazo, la liquidación se tiene por aceptada, salvo error manifiesto.",
            S["clause"],
        )
    )

    story.append(Paragraph("Cláusula 6. Obligaciones del Reclutador", S["h2"]))
    for text in [
        "Presentar RSC de forma veraz, con los planes, precios y límites publicados por RSC.",
        "No prometer destacados, plazos de aprobación ni condiciones que RSC no haya autorizado por escrito.",
        "No cobrar dinero de las empresas ni indicar una cuenta distinta de la de RSC.",
        "Tratar los datos de contacto de las empresas solo para esta captación y conforme a la ley aplicable de protección de datos.",
        "Informar a RSC, cuando se lo pida, el estado de las empresas que está presentando.",
    ]:
        story.append(Paragraph(f"• {text}", S["clause"]))

    story.append(Paragraph("Cláusula 7. Obligaciones de RSC", S["h2"]))
    for text in [
        "Decidir, con criterio propio, si aprueba el alta de cada empresa.",
        "Poner a disposición del Reclutador la información vigente de planes y el medio para identificar sus altas (código o enlace).",
        "Cobrar la cuota a la Empresa Captada y pagar el 40% en el plazo de la cláusula 5.",
        "Mantener el registro de atribución de cada Empresa Captada mientras esa empresa siga de alta.",
    ]:
        story.append(Paragraph(f"• {text}", S["clause"]))

    story.append(Paragraph("Cláusula 8. Vigencia y terminación", S["h2"]))
    story.append(
        Paragraph(
            "Este contrato dura <b>doce (12) meses</b> desde la firma y se renueva por períodos "
            "iguales si ninguna Parte avisa lo contrario con treinta (30) días de antelación. "
            "Cualquiera de las Partes puede terminarlo sin causa con un preaviso de treinta (30) días. "
            "RSC puede resolverlo de inmediato si el Reclutador cobra a una empresa, falsea la "
            "atribución, usa la marca fuera de lo permitido o incumple de forma grave la cláusula 6. "
            "La terminación no borra las comisiones ya devengadas ni, salvo resolución por causa grave, "
            "el 40% futuro de las Empresas Captadas que sigan pagando.",
            S["clause"],
        )
    )

    story.append(Paragraph("Cláusula 9. Marca y confidencialidad", S["h2"]))
    story.append(
        Paragraph(
            "RSC autoriza al Reclutador a usar el nombre y los materiales comerciales de RSC "
            "solo para captar empresas, mientras el contrato esté vigente y siguiendo las "
            "indicaciones de RSC. Esa autorización termina con el contrato. "
            "Las condiciones no públicas, listados de clientes y liquidaciones son confidenciales "
            "durante el contrato y durante dos (2) años después.",
            S["clause"],
        )
    )

    story.append(Paragraph("Cláusula 10. Ley y firma", S["h2"]))
    story.append(
        Paragraph(
            "Este contrato se rige por las leyes de Brasil. Para cualquier controversia, "
            "las Partes se someten a los tribunales del domicilio de RSC, salvo norma imperativa "
            "distinta. Lo no previsto se resuelve de buena fe. Cualquier cambio de la comisión "
            "del 40% exige acuerdo escrito firmado por las dos Partes. "
            "La firma electrónica tiene la misma validez que la manuscrita.",
            S["clause"],
        )
    )
    story.append(
        Paragraph(
            "Leído el contrato, las Partes lo firman en dos ejemplares del mismo tenor.",
            S["body"],
        )
    )

    story.append(Spacer(1, 8 * mm))
    sign_rsc = [
        Paragraph("<b>RSC</b>", S["sign"]),
        Spacer(1, 14 * mm),
        Paragraph("Firma: _______________________________", S["sign"]),
        Paragraph("Nombre: ______________________________", S["sign"]),
        Paragraph("Cargo: _______________________________", S["sign"]),
    ]
    sign_rec = [
        Paragraph("<b>EL RECLUTADOR</b>", S["sign"]),
        Spacer(1, 14 * mm),
        Paragraph("Firma: _______________________________", S["sign"]),
        Paragraph("Nombre: ______________________________", S["sign"]),
        Paragraph("Documento: ___________________________", S["sign"]),
    ]
    signs = Table([[sign_rsc, sign_rec]], colWidths=[82 * mm, 82 * mm])
    signs.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LINEABOVE", (0, 0), (-1, -1), 0.4, LINE),
                ("LEFTPADDING", (0, 0), (-1, -1), 4),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BACKGROUND", (0, 0), (-1, -1), CREAM),
            ]
        )
    )
    story.append(signs)
    story.append(
        Paragraph(
            "Modelo de uso interno. Completar los datos en blanco y revisarlo con asesoría legal antes de firmar.",
            S["center_note"],
        )
    )

    doc = BaseDocTemplate(
        OUT_ES,
        pagesize=A4,
        title="Contrato de captación comercial — Reclutador de empresas RSC",
        author="RSC Market",
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=24 * mm,
        bottomMargin=18 * mm,
    )
    frame = Frame(
        18 * mm,
        18 * mm,
        PAGE_W - 36 * mm,
        PAGE_H - 42 * mm,
        id="body",
        showBoundary=0,
    )
    doc.addPageTemplates([PageTemplate(id="main", frames=[frame], onPage=header_footer)])
    doc.build(story)
    return OUT_ES


def build_en():
    META["header"] = "Commercial recruitment agreement"
    META["footer"] = "Form to complete and sign  ·  RSC Market"
    story = []
    story.append(Paragraph("RSC MARKET", S["kicker"]))
    story.append(Spacer(1, 1.5 * mm))
    story.append(
        Paragraph("Services agreement for recruiting<br/>companies that advertise on RSC", S["h1"])
    )
    story.append(
        Paragraph(
            "The Recruiter brings companies to advertise on RSC. "
            "Of each monthly fee that company pays, 40% stays with the Recruiter and 60% stays with RSC.",
            S["sub"],
        )
    )
    story.append(
        commission_box(
            "THE RECRUITER",
            "of each monthly fee<br/>the company pays",
            "of that same<br/>monthly fee",
            "Example. If a company pays R$ 299 per month for its listing plan, "
            "the Recruiter receives <b>R$ 119.60</b> and RSC keeps <b>R$ 179.40</b>. "
            "The same rule applies whatever the paid plan amount is.",
        )
    )
    story.append(Spacer(1, 4 * mm))

    story.append(Paragraph("Parties", S["h2"]))
    story.append(
        Paragraph(
            "In the city of ____________________, on _____ ________________________ 20____, "
            "the following parties enter into this agreement:",
            S["body"],
        )
    )
    story.append(Paragraph("1. RSC (the platform)", S["label"]))
    story.append(
        Paragraph(
            "The company that operates the <b>RSC Market (REESKOVA)</b> platform, "
            "part of the RSC group, referred to as <b>RSC</b>.",
            S["clause"],
        )
    )
    for label in [
        "Legal name",
        "CNPJ / ID number",
        "Address",
        "Representative and title",
    ]:
        story.extend(field(label))

    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph("2. The Recruiter", S["label"]))
    story.append(
        Paragraph(
            "The individual or company that recruits advertising businesses, referred to as <b>the Recruiter</b>.",
            S["clause"],
        )
    )
    for label in [
        "Name or legal name",
        "CPF / CNPJ / ID number",
        "Address",
        "Email and phone",
        "Bank account for commission payments",
    ]:
        story.extend(field(label))

    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph("RSC and the Recruiter are together the <b>Parties</b>.", S["body"]))

    story.append(Paragraph("Clause 1. Purpose", S["h2"]))
    story.append(
        Paragraph(
            "The Recruiter will provide RSC with commercial recruitment services: identify, contact, "
            "and introduce companies (real-estate firms, dealerships, builders, service providers, and "
            "other advertisers) so that they register and take a paid listing plan on RSC Market.",
            S["clause"],
        )
    )
    story.append(
        Paragraph(
            "RSC is a publishing and contact marketplace. It does not close the sale between the "
            "advertiser and the buyer, does not hold that money, and does not replace the advertising "
            "company. This agreement covers only company recruitment and the Recruiter’s commission.",
            S["clause"],
        )
    )

    story.append(Paragraph("Clause 2. Nature of the relationship", S["h2"]))
    story.append(
        Paragraph(
            "The Recruiter acts as an independent contractor. This agreement does not create employment, "
            "a partnership, a general agency, or exclusivity, unless the Parties agree otherwise in writing. "
            "The Recruiter sets their own schedule, pays their own recruitment expenses, and has no authority "
            "to bind RSC, grant discounts, promise terms other than the current plans, or collect money from companies.",
            S["clause"],
        )
    )

    story.append(Paragraph("Clause 3. What counts as a recruited company", S["h2"]))
    story.append(
        Paragraph("A <b>Recruited Company</b> is one that meets all three of the following:", S["clause"])
    )
    for i, text in enumerate(
        [
            "The Recruiter introduced it to RSC before it was a paying customer.",
            "The company registers and identifies the Recruiter (code, link, or written record accepted by RSC).",
            "RSC did not already have an active commercial relationship with that company, or an open negotiation attributed to another channel.",
        ],
        1,
    ):
        story.append(Paragraph(f"{i}. {text}", S["clause"]))
    story.append(
        Paragraph(
            "If two people claim the same company, the written record on the registration accepted by RSC prevails. "
            "Companies that arrive on their own, companies that were already customers, and companies recruited "
            "by RSC’s own team do not earn a commission for the Recruiter.",
            S["clause"],
        )
    )

    story.append(Paragraph("Clause 4. Commission: 40% of the monthly fee", S["h2"]))
    story.append(
        Paragraph(
            "<b>4.1.</b> For each Recruited Company, the Recruiter receives <b>forty percent (40%)</b> "
            "of the monthly listing-plan fee that company pays to RSC.",
            S["clause"],
        )
    )
    story.append(
        Paragraph(
            "<b>4.2.</b> The remaining <b>sixty percent (60%)</b> of that same monthly fee belongs to RSC. "
            "The Recruiter does not share in any other platform revenue.",
            S["clause"],
        )
    )
    story.append(
        Paragraph(
            "<b>4.3.</b> The commission arises each month, and only on the fee RSC has actually collected. "
            "If the company does not pay in a given month, there is no commission for that month. If it changes "
            "plan, receives a discount, a refund, or a chargeback, the base is the amount actually collected and "
            "not reversed. The free plan earns no commission.",
            S["clause"],
        )
    )
    story.append(
        Paragraph(
            "<b>4.4.</b> The right to 40% continues <b>for every month the Recruited Company keeps paying</b> "
            "its plan, even after this agreement has ended. It ends if the company stops paying, if RSC terminates "
            "for the Recruiter’s material breach, or if the company attribution is shown to be false.",
            S["clause"],
        )
    )
    story.append(
        Paragraph(
            "<b>4.5.</b> The 40% is calculated on the plan fee collected from the company. RSC’s operating costs "
            "are not deducted. Each Party pays its own taxes. A tax invoiced separately from the plan fee is not part of the base.",
            S["clause"],
        )
    )
    story.append(
        Paragraph(
            "<b>4.6.</b> The Recruiter does not collect from companies. The company pays RSC. "
            "RSC then pays the 40% to the Recruiter.",
            S["clause"],
        )
    )

    story.append(Paragraph("Clause 5. Settlement and payment", S["h2"]))
    story.append(
        Paragraph(
            "RSC pays the commission within <b>fifteen (15) days</b> after the end of each calendar month, "
            "by transfer to the account stated in this agreement. Each payment includes a statement showing: "
            "company, plan, fee collected, and the corresponding 40%. The Recruiter may request the statement "
            "for a month within ninety (90) days after payment. After that period, the settlement is deemed "
            "accepted, except for a clear error.",
            S["clause"],
        )
    )

    story.append(Paragraph("Clause 6. Recruiter’s duties", S["h2"]))
    for text in [
        "Present RSC accurately, using the plans, prices, and limits published by RSC.",
        "Do not promise featured placement, approval times, or terms that RSC has not authorized in writing.",
        "Do not collect money from companies or give them a bank account other than RSC’s.",
        "Use company contact details only for this recruitment and in line with applicable data-protection law.",
        "Tell RSC, when asked, the status of the companies being introduced.",
    ]:
        story.append(Paragraph(f"• {text}", S["clause"]))

    story.append(Paragraph("Clause 7. RSC’s duties", S["h2"]))
    for text in [
        "Decide, at its own discretion, whether to approve each company’s registration.",
        "Give the Recruiter the current plan information and a way to identify their sign-ups (code or link).",
        "Collect the fee from the Recruited Company and pay the 40% within the period in Clause 5.",
        "Keep the attribution record for each Recruited Company for as long as that company remains registered.",
    ]:
        story.append(Paragraph(f"• {text}", S["clause"]))

    story.append(Paragraph("Clause 8. Term and termination", S["h2"]))
    story.append(
        Paragraph(
            "This agreement lasts <b>twelve (12) months</b> from signature and renews for equal periods "
            "unless either Party gives thirty (30) days’ notice. Either Party may end it without cause on "
            "thirty (30) days’ notice. RSC may end it immediately if the Recruiter collects from a company, "
            "falsifies attribution, uses the brand outside what is allowed, or materially breaches Clause 6. "
            "Termination does not cancel commissions already earned or, except for termination for material "
            "breach, the future 40% on Recruited Companies that keep paying.",
            S["clause"],
        )
    )

    story.append(Paragraph("Clause 9. Brand and confidentiality", S["h2"]))
    story.append(
        Paragraph(
            "RSC allows the Recruiter to use RSC’s name and sales materials only to recruit companies, "
            "while this agreement is in force and in line with RSC’s instructions. That permission ends "
            "with the agreement. Non-public terms, customer lists, and settlements stay confidential "
            "during the agreement and for two (2) years after it ends.",
            S["clause"],
        )
    )

    story.append(Paragraph("Clause 10. Law and signature", S["h2"]))
    story.append(
        Paragraph(
            "This agreement is governed by the laws of Brazil. The Parties submit disputes to the courts "
            "of RSC’s domicile, unless a mandatory rule says otherwise. Anything not covered is resolved "
            "in good faith. Any change to the 40% commission requires a written agreement signed by both Parties. "
            "An electronic signature has the same effect as a handwritten one.",
            S["clause"],
        )
    )
    story.append(
        Paragraph(
            "The Parties have read this agreement and sign it in two originals of the same content.",
            S["body"],
        )
    )

    story.append(Spacer(1, 8 * mm))
    sign_rsc = [
        Paragraph("<b>RSC</b>", S["sign"]),
        Spacer(1, 14 * mm),
        Paragraph("Signature: ___________________________", S["sign"]),
        Paragraph("Name: ________________________________", S["sign"]),
        Paragraph("Title: ________________________________", S["sign"]),
    ]
    sign_rec = [
        Paragraph("<b>THE RECRUITER</b>", S["sign"]),
        Spacer(1, 14 * mm),
        Paragraph("Signature: ___________________________", S["sign"]),
        Paragraph("Name: ________________________________", S["sign"]),
        Paragraph("ID number: ___________________________", S["sign"]),
    ]
    signs = Table([[sign_rsc, sign_rec]], colWidths=[82 * mm, 82 * mm])
    signs.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LINEABOVE", (0, 0), (-1, -1), 0.4, LINE),
                ("LEFTPADDING", (0, 0), (-1, -1), 4),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BACKGROUND", (0, 0), (-1, -1), CREAM),
            ]
        )
    )
    story.append(signs)
    story.append(
        Paragraph(
            "Internal form. Fill in the blanks and have it reviewed by legal counsel before signing.",
            S["center_note"],
        )
    )

    doc = BaseDocTemplate(
        OUT_EN,
        pagesize=A4,
        title="Commercial recruitment agreement — RSC company recruiter",
        author="RSC Market",
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=24 * mm,
        bottomMargin=18 * mm,
    )
    frame = Frame(
        18 * mm,
        18 * mm,
        PAGE_W - 36 * mm,
        PAGE_H - 42 * mm,
        id="body-en",
        showBoundary=0,
    )
    doc.addPageTemplates([PageTemplate(id="main-en", frames=[frame], onPage=header_footer)])
    doc.build(story)
    return OUT_EN


if __name__ == "__main__":
    print(build())
    print(build_en())
