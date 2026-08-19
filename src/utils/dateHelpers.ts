// All calculations use the device's local calendar (not UTC), so "today"
// and "this week" match what the user sees on their clock.

export interface Period {
  label: string;
  start: Date; // inclusive
  end: Date; // exclusive
}

const DAY_MS = 24 * 60 * 60 * 1000;
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEKDAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export function addYears(date: Date, years: number): Date {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

// Monday of the week containing `date` (Monday = start of week).
export function getMonday(date: Date): Date {
  const d = startOfDay(date);
  const dow = d.getDay(); // Sun=0..Sat=6
  const diffToMonday = dow === 0 ? -6 : 1 - dow;
  return addDays(d, diffToMonday);
}

export function daysBetween(start: Date, end: Date): number {
  return Math.round((startOfDay(end).getTime() - startOfDay(start).getTime()) / DAY_MS);
}

function shortDate(d: Date): string {
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

// ---- Week view: rows = the 7 days of the week containing `anchor` ----
export function getWeekDayRows(anchor: Date): Period[] {
  const monday = getMonday(anchor);
  return Array.from({ length: 7 }, (_, i) => {
    const start = addDays(monday, i);
    const end = addDays(start, 1);
    return { label: `${WEEKDAY_NAMES[i]} ${shortDate(start)}`, start, end };
  });
}

export function getWeekRangeLabel(anchor: Date): string {
  const monday = getMonday(anchor);
  const sunday = addDays(monday, 6);
  return `${shortDate(monday)} – ${shortDate(sunday)}, ${sunday.getFullYear()}`;
}

// ---- Month view: rows = weeks (Mon–Sun) that fall within the month,
// clipped to the month's start/end so partial first/last weeks only
// count the days that are actually in the month. ----
export function getMonthWeekRows(anchor: Date): Period[] {
  const year = anchor.getFullYear();
  const month = anchor.getMonth();
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 1);

  const rows: Period[] = [];
  let cursor = monthStart;
  let weekNumber = 1;
  while (cursor < monthEnd) {
    const mondayOfCursorWeek = getMonday(cursor);
    const nextMonday = addDays(mondayOfCursorWeek, 7);
    const rowEnd = nextMonday < monthEnd ? nextMonday : monthEnd;
    rows.push({
      label: `Week ${weekNumber} (${shortDate(cursor)}–${shortDate(addDays(rowEnd, -1))})`,
      start: cursor,
      end: rowEnd,
    });
    cursor = rowEnd;
    weekNumber += 1;
  }
  return rows;
}

export function getMonthRangeLabel(anchor: Date): string {
  return `${MONTH_NAMES[anchor.getMonth()]} ${anchor.getFullYear()}`;
}

export function getMonthBounds(anchor: Date): { start: Date; end: Date } {
  const year = anchor.getFullYear();
  const month = anchor.getMonth();
  return { start: new Date(year, month, 1), end: new Date(year, month + 1, 1) };
}

// ---- Year view: rows = the 12 months of the year containing `anchor` ----
export function getYearMonthRows(anchor: Date): Period[] {
  const year = anchor.getFullYear();
  return Array.from({ length: 12 }, (_, i) => ({
    label: MONTH_NAMES[i],
    start: new Date(year, i, 1),
    end: new Date(year, i + 1, 1),
  }));
}

export function getYearRangeLabel(anchor: Date): string {
  return `${anchor.getFullYear()}`;
}

export function getYearBounds(anchor: Date): { start: Date; end: Date } {
  const year = anchor.getFullYear();
  return { start: new Date(year, 0, 1), end: new Date(year + 1, 0, 1) };
}
