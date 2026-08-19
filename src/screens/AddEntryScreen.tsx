import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import ActivityDropdown from '../components/ActivityDropdown';
import AddActivityInline from '../components/AddActivityInline';
import { addActivity, getActivities } from '../db/activities';
import { addEntry } from '../db/entries';
import type { Activity } from '../types';

export default function AddEntryScreen() {
  const db = useSQLiteContext();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selected, setSelected] = useState<Activity | null>(null);
  const [count, setCount] = useState('');
  const [activityError, setActivityError] = useState<string | null>(null);
  const [countError, setCountError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadActivities = useCallback(async () => {
    const list = await getActivities(db);
    setActivities(list);
  }, [db]);

  useEffect(() => {
    loadActivities();
    return () => {
      if (savedTimer.current) clearTimeout(savedTimer.current);
    };
  }, [loadActivities]);

  function handleCountChange(value: string) {
    const digitsOnly = value.replace(/[^0-9]/g, '');
    setCount(digitsOnly);
    if (countError) setCountError(null);
  }

  async function handleAddActivity(name: string) {
    const created = await addActivity(db, name);
    await loadActivities();
    setSelected(created);
    setActivityError(null);
  }

  async function handleSave() {
    let hasError = false;
    if (!selected) {
      setActivityError('Please select an activity.');
      hasError = true;
    }
    const numericCount = parseInt(count, 10);
    if (count.length === 0 || Number.isNaN(numericCount) || numericCount < 1) {
      setCountError('Please enter a count greater than 0.');
      hasError = true;
    }
    if (hasError || !selected) return;

    setSaving(true);
    try {
      await addEntry(db, selected.id, numericCount);
      setCount('');
      setShowSaved(true);
      if (savedTimer.current) clearTimeout(savedTimer.current);
      savedTimer.current = setTimeout(() => setShowSaved(false), 1500);
    } finally {
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Add Entry</Text>

        <Text style={styles.label}>Activity</Text>
        <View style={styles.activityRow}>
          <ActivityDropdown
            activities={activities}
            selectedId={selected?.id ?? null}
            onSelect={(a) => {
              setSelected(a);
              setActivityError(null);
            }}
          />
          <View style={styles.plusSpacer}>
            <AddActivityInline onAdd={handleAddActivity} />
          </View>
        </View>
        {activityError && <Text style={styles.errorText}>{activityError}</Text>}

        <Text style={[styles.label, styles.spacedLabel]}>Count</Text>
        <TextInput
          style={styles.countInput}
          value={count}
          onChangeText={handleCountChange}
          placeholder="0"
          keyboardType="number-pad"
        />
        {countError && <Text style={styles.errorText}>{countError}</Text>}

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>{saving ? 'Saving…' : 'Save'}</Text>
        </TouchableOpacity>

        {showSaved && <Text style={styles.savedBanner}>Saved</Text>}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 20, paddingBottom: 60 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 24, color: '#111' },
  label: { fontSize: 14, fontWeight: '600', color: '#444', marginBottom: 8 },
  spacedLabel: { marginTop: 20 },
  activityRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  plusSpacer: { marginTop: 0 },
  countInput: {
    borderWidth: 1,
    borderColor: '#c9c9c9',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 46,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  errorText: { color: '#d33', marginTop: 6, fontSize: 13 },
  saveButton: {
    marginTop: 28,
    backgroundColor: '#2f6fed',
    borderRadius: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: { opacity: 0.6 },
  saveButtonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  savedBanner: {
    marginTop: 16,
    textAlign: 'center',
    color: '#1b8f4c',
    fontWeight: '600',
    fontSize: 15,
  },
});
