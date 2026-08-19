import type { SQLiteDatabase } from 'expo-sqlite';
import type { EntryWithActivity } from '../types';

export async function addEntry(
  db: SQLiteDatabase,
  activityId: number,
  count: number
): Promise<void> {
  const timestamp = new Date().toISOString();
  await db.runAsync(
    'INSERT INTO entries (activity_id, count, timestamp) VALUES (?, ?, ?)',
    activityId,
    count,
    timestamp
  );
}

// Fetches every entry with a timestamp in [startIso, endIso), joined with
// its activity name. Callers aggregate this in JS into whatever rows/columns
// they need (day, week, month) instead of running one query per cell.
export async function getEntriesInRange(
  db: SQLiteDatabase,
  startIso: string,
  endIso: string
): Promise<EntryWithActivity[]> {
  return db.getAllAsync<EntryWithActivity>(
    `SELECT entries.count as count, entries.timestamp as timestamp, activities.name as activityName
     FROM entries
     JOIN activities ON activities.id = entries.activity_id
     WHERE entries.timestamp >= ? AND entries.timestamp < ?`,
    startIso,
    endIso
  );
}
