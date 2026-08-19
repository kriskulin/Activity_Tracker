export interface Activity {
  id: number;
  name: string;
}

export interface Entry {
  id: number;
  activityId: number;
  count: number;
  timestamp: string;
}

export interface EntryWithActivity {
  count: number;
  timestamp: string;
  activityName: string;
}
