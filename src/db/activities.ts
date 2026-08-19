import type { SQLiteDatabase } from 'expo-sqlite';
import type { Activity } from '../types';

export async function getActivities(db: SQLiteDatabase): Promise<Activity[]> {
  const rows = await db.getAllAsync<{ id: number; name: string }>(
    'SELECT id, name FROM activities ORDER BY name COLLATE NOCASE ASC'
  );
  return rows;
}

// Throws a plain Error with a message safe to show to the user
// (e.g. "An activity with this name already exists.").
export async function addActivity(db: SQLiteDatabase, name: string): Promise<Activity> {
  const trimmed = name.trim();

  const existing = await db.getFirstAsync<{ id: number }>(
    'SELECT id FROM activities WHERE name = ? COLLATE NOCASE',
    trimmed
  );
  if (existing) {
    throw new Error('An activity with this name already exists.');
  }

  const result = await db.runAsync('INSERT INTO activities (name) VALUES (?)', trimmed);
  return { id: result.lastInsertRowId, name: trimmed };
}
