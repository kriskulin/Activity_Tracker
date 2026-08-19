import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import PeriodTable from '../components/PeriodTable';
import { getActivities } from '../db/activities';
import { getEntriesInRange } from '../db/entries';
import { buildGrid, type Cell } from '../utils/aggregate';
import {
  addDays,
  addMonths,
  addYears,
  getMonthBounds,
  getMonthRangeLabel,
  getMonthWeekRows,
  getMonday,
  getWeekDayRows,
  getWeekRangeLabel,
  getYearBounds,
  getYearMonthRows,
  getYearRangeLabel,
  type Period,
} from '../utils/dateHelpers';
import type { Activity, EntryWithActivity } from '../types';

type Tab = 'week' | 'month' | 'year';

export default function TablesScreen() {
  const db = useSQLiteContext();
  const [tab, setTab] = useState<Tab>('week');
  const [weekAnchor, setWeekAnchor] = useState(() => new Date());
  const [monthAnchor, setMonthAnchor] = useState(() => new Date());
  const [yearAnchor, setYearAnchor] = useState(() => new Date());

  const [activities, setActivities] = useState<Activity[]>([]);
  const [entries, setEntries] = useState<EntryWithActivity[]>([]);

  const rows: Period[] = useMemo(() => {
    if (tab === 'week') return getWeekDayRows(weekAnchor);
    if (tab === 'month') return getMonthWeekRows(monthAnchor);
    return getYearMonthRows(yearAnchor);
  }, [tab, weekAnchor, monthAnchor, yearAnchor]);

  const rangeLabel = useMemo(() => {
    if (tab === 'week') return getWeekRangeLabel(weekAnchor);
    if (tab === 'month') return getMonthRangeLabel(monthAnchor);
    return getYearRangeLabel(yearAnchor);
  }, [tab, weekAnchor, monthAnchor, yearAnchor]);

  const queryBounds = useMemo(() => {
    if (tab === 'week') {
      const monday = getMonday(weekAnchor);
      return { start: monday, end: addDays(monday, 7) };
    }
    if (tab === 'month') return getMonthBounds(monthAnchor);
    return getYearBounds(yearAnchor);
  }, [tab, weekAnchor, monthAnchor, yearAnchor]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [activityList, entryList] = await Promise.all([
        getActivities(db),
        getEntriesInRange(db, queryBounds.start.toISOString(), queryBounds.end.toISOString()),
      ]);
      if (!cancelled) {
        setActivities(activityList);
        setEntries(entryList);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [db, queryBounds]);

  const activityNames = activities.map((a) => a.name);
  const grid: Cell[][] = useMemo(
    () => buildGrid(rows, activityNames, entries),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rows, entries, activityNames.join('|')]
  );

  function goPrev() {
    if (tab === 'week') setWeekAnchor((d) => addDays(d, -7));
    else if (tab === 'month') setMonthAnchor((d) => addMonths(d, -1));
    else setYearAnchor((d) => addYears(d, -1));
  }

  function goNext() {
    if (tab === 'week') setWeekAnchor((d) => addDays(d, 7));
    else if (tab === 'month') setMonthAnchor((d) => addMonths(d, 1));
    else setYearAnchor((d) => addYears(d, 1));
  }

  return (
    <View style={styles.flex}>
      <Text style={styles.title}>Data Tables</Text>

      <View style={styles.segmented}>
        {(['week', 'month', 'year'] as Tab[]).map((t) => (
          <Pressable
            key={t}
            style={[styles.segment, tab === t && styles.segmentActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.segmentText, tab === t && styles.segmentTextActive]}>
              {t === 'week' ? 'Week' : t === 'month' ? 'Month' : 'Year'}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.nav}>
        <Pressable style={styles.navButton} onPress={goPrev} accessibilityLabel="Previous period">
          <Text style={styles.navButtonText}>‹ Prev</Text>
        </Pressable>
        <Text style={styles.rangeLabel}>{rangeLabel}</Text>
        <Pressable style={styles.navButton} onPress={goNext} accessibilityLabel="Next period">
          <Text style={styles.navButtonText}>Next ›</Text>
        </Pressable>
      </View>

      <PeriodTable rows={rows} columns={activityNames} grid={grid} showAverage={tab !== 'week'} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16, color: '#111' },
  segmented: {
    flexDirection: 'row',
    backgroundColor: '#eef0f4',
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
  },
  segment: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  segmentActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 1 },
  segmentText: { fontSize: 14, color: '#555', fontWeight: '600' },
  segmentTextActive: { color: '#2f6fed' },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  navButton: { paddingVertical: 6, paddingHorizontal: 10 },
  navButtonText: { color: '#2f6fed', fontWeight: '600', fontSize: 14 },
  rangeLabel: { fontSize: 15, fontWeight: '600', color: '#222' },
});
