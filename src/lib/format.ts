const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Parse a YYYY-MM or YYYY-MM-DD string without timezone surprises. */
function parts(iso: string) {
  const [y, m, d] = iso.split("-").map((n) => parseInt(n, 10));
  return { y, m: m || 1, d: d || 0 };
}

/** "Aug 8 — 15, 2026" / "Jun 19, 2026" / "Aug 2026" */
export function formatRange(start: string, end?: string): string {
  const s = parts(start);
  const startStr = s.d
    ? `${MONTHS[s.m - 1]} ${s.d}`
    : `${MONTHS[s.m - 1]}`;

  if (!end) return `${startStr}, ${s.y}`;

  const e = parts(end);
  if (s.y === e.y && s.m === e.m) {
    return `${MONTHS[s.m - 1]} ${s.d} – ${e.d}, ${s.y}`;
  }
  if (s.y === e.y) {
    return `${MONTHS[s.m - 1]} ${s.d} – ${MONTHS[e.m - 1]} ${e.d}, ${s.y}`;
  }
  return `${startStr}, ${s.y} – ${MONTHS[e.m - 1]} ${e.d}, ${e.y}`;
}

/** Relative time like "3h", "2d", "just now" for the feed. */
export function timeAgo(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const secs = Math.floor((Date.now() - d.getTime()) / 1000);
  if (secs < 45) return "just now";
  if (secs < 3600) return `${Math.floor(secs / 60)}m`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h`;
  if (secs < 604800) return `${Math.floor(secs / 86400)}d`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
