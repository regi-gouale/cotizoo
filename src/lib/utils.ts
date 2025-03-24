import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formate un nombre en devise (EUR)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

// Fonction utilitaire pour formater la date
export function formatDate(date: Date): string {
  return format(date, "dd MMMM yyyy", { locale: fr });
}

/**
 * Formate une date avec l'heure au format localisé français
 */
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
