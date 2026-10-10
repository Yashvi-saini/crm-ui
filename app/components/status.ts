import type { Status } from "../lib/leads";

export const STATUS_STYLE: Record<Status, { pill: string; color: string }> = {
  New: { pill: "bg-sky-50 text-sky-800 border-sky-200", color: "#6d95b8" },
  Contacted: { pill: "bg-amber-50 text-amber-800 border-amber-200", color: "#d4a24c" },
  "Proposal Sent": { pill: "bg-teal-50 text-teal-800 border-teal-200", color: "#4f9a94" },
  Won: { pill: "bg-green-50 text-green-800 border-green-200", color: "#4d8f5e" },
  Lost: { pill: "bg-stone-100 text-stone-700 border-stone-300", color: "#a39d96" },
};

export function addDays(iso: string, n: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + n));
  return dt.toISOString().slice(0, 10);
}

export function formatDate(iso: string): string {
  if (!iso) return "-";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function weekday(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", {
    weekday: "short",
    timeZone: "UTC",
  });
}
