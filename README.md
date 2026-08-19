# Activity_Tracker
A personal habit/activity counter. The user logs a count against an activity (e.g. "Gayatri Mantra: 108", "Surya Namaskar: 21", "Running: 3 km") and the app rolls those entries up into daily, weekly, and monthly tables.

## Running the app

This is a React Native + Expo app. Everything is stored locally on the device (SQLite) — no login, no backend, no internet needed.

1. Install dependencies:
   ```
   npm install
   ```
2. Start the app:
   ```
   npm start
   ```
   This opens the Expo developer tools. From there:
   - Press `a` for Android (needs Android Studio's emulator, or scan the QR code with the **Expo Go** app on a real Android phone)
   - Press `i` for iOS (needs a Mac with Xcode's simulator, or scan the QR code with the **Expo Go** app / Camera app on a real iPhone)
   - Press `w` to try it in a web browser (a convenience for development only — the brief targets iOS/Android)

## Project layout

- `App.tsx` — sets up the local database and switches between the two screens
- `src/screens/AddEntryScreen.tsx` — Screen 1: log a count against an activity
- `src/screens/TablesScreen.tsx` — Screen 2: Week / Month / Year roll-up tables
- `src/components/` — the activity dropdown, "add activity" panel, and table grid
- `src/db/` — SQLite schema and queries (`activities`, `entries` tables)
- `src/utils/dateHelpers.ts` — week/month/year period math (weeks start Monday)
- `src/utils/aggregate.ts` — turns raw entries into the table's sum/average grid
