import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import type { ScheduledVisit } from "./types";

function formatVisitDate(date: string): string {
  try {
    return format(parseISO(`${date}T12:00:00`), "PPP", { locale: es });
  } catch {
    return date;
  }
}

function formatVisitTime(time: string): string {
  return time.slice(0, 5);
}

export function formatVisitRequestChatMessage(visit: ScheduledVisit): string {
  const lines = [
    `Solicitud de visita — ${visit.listingTitle}`,
    `Fecha: ${formatVisitDate(visit.preferredDate)}`,
    `Horario: ${formatVisitTime(visit.preferredTime)}`,
    `Teléfono: ${visit.buyerPhone}`,
  ];
  if (visit.notes) lines.push(`Notas: ${visit.notes}`);
  return lines.join("\n");
}

export function formatVisitBuyerAcceptedRescheduleMessage(visit: ScheduledVisit): string {
  return [
    `Reagendamiento aceptado — ${visit.listingTitle}`,
    `Fecha confirmada: ${formatVisitDate(visit.preferredDate)}`,
    `Horario: ${formatVisitTime(visit.preferredTime)}`,
  ].join("\n");
}

export function formatVisitBuyerDeclinedRescheduleMessage(visit: ScheduledVisit): string {
  return `Reagendamiento rechazado — ${visit.listingTitle}. Se mantiene la fecha original solicitada.`;
}
