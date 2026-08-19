import type { EntryWithActivity } from '../types';
import type { Period } from './dateHelpers';
import { daysBetween } from './dateHelpers';

export interface Cell {
  sum: number;
  average: number | null; // null when the period has no entries at all
}

// Buckets entries into rows by which period their timestamp instant falls
// into, and sums per activity within each row. `average` is the row's sum
// divided by the number of calendar days in that row's period, i.e. the
// average daily count for that period.
export function buildGrid(
  rows: Period[],
  activityNames: string[],
  entries: EntryWithActivity[]
): Cell[][] {
  const grid: Cell[][] = rows.map(() => activityNames.map(() => ({ sum: 0, average: null })));

  for (const entry of entries) {
    const t = new Date(entry.timestamp).getTime();
    const rowIndex = rows.findIndex((r) => t >= r.start.getTime() && t < r.end.getTime());
    if (rowIndex === -1) continue;
    const colIndex = activityNames.indexOf(entry.activityName);
    if (colIndex === -1) continue;
    grid[rowIndex][colIndex].sum += entry.count;
  }

  rows.forEach((row, rowIndex) => {
    const days = Math.max(1, daysBetween(row.start, row.end));
    grid[rowIndex].forEach((cell) => {
      cell.average = cell.sum > 0 ? cell.sum / days : null;
    });
  });

  return grid;
}
