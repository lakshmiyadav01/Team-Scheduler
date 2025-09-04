// src/app/lib/time.ts
export function hhmmToMinutes(hhmm: string): number {
  // expects "HH:MM" (24h). Failsafe returns 0
  const parts = (hhmm || "00:00").split(":");
  const hh = parseInt(parts[0] ?? "0", 10) || 0;
  const mm = parseInt(parts[1] ?? "0", 10) || 0;
  return hh * 60 + mm;
}

// clamp helper
export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
