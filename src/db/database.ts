import type { SQLiteDatabase } from 'expo-sqlite';

export const DATABASE_NAME = 'activity_tracker.db';

// Runs once when the app opens the database. Creates the tables if they
// don't exist yet. Safe to run every launch (IF NOT EXISTS).
export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE COLLATE NOCASE
    );

    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      activity_id INTEGER NOT NULL REFERENCES activities(id),
      count INTEGER NOT NULL,
      timestamp TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_entries_timestamp ON entries(timestamp);
    CREATE INDEX IF NOT EXISTS idx_entries_activity_id ON entries(activity_id);
  `);
}
