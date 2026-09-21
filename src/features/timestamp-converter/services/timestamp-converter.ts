export type TimestampUnit = "seconds" | "milliseconds";

export function parseTimestamp(value: string, unit: TimestampUnit): Date | null {
  if (!value.trim() || !/^-?\d+$/.test(value.trim())) {
    return null;
  }
  const number = Number(value);
  const milliseconds = unit === "seconds" ? number * 1000 : number;
  const date = new Date(milliseconds);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDateParts(date: Date, now = Date.now()): {
  local: string;
  utc: string;
  iso: string;
  relative: string;
} {
  return {
    local: date.toLocaleString(undefined, { dateStyle: "full", timeStyle: "long" }),
    utc: date.toLocaleString("en-US", {
      timeZone: "UTC",
      dateStyle: "full",
      timeStyle: "long"
    }),
    iso: date.toISOString(),
    relative: formatRelative(date, now)
  };
}

export function formatRelative(date: Date, now = Date.now()): string {
  const diffMs = date.getTime() - now;
  const abs = Math.abs(diffMs);
  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

  if (abs < 60_000) {
    return formatter.format(Math.round(diffMs / 1000), "second");
  }

  const units: [number, Intl.RelativeTimeFormatUnit][] = [
    [60_000, "minute"],
    [3_600_000, "hour"],
    [86_400_000, "day"],
    [604_800_000, "week"],
    [2_592_000_000, "month"],
    [31_536_000_000, "year"]
  ];

  for (let i = units.length - 1; i >= 0; i--) {
    const [ms, unit] = units[i];
    if (abs >= ms) {
      return formatter.format(Math.round(diffMs / ms), unit);
    }
  }

  return formatter.format(Math.round(diffMs / 60_000), "minute");
}

export function dateToTimestamps(value: string): { seconds: number; milliseconds: number } | null {
  if (!value) return null;
  const date = new Date(value);
  const time = date.getTime();
  if (Number.isNaN(time)) return null;
  return { seconds: Math.floor(time / 1000), milliseconds: time };
}
