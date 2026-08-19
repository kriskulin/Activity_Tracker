import React, { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Activity } from '../types';

interface Props {
  activities: Activity[];
  selectedId: number | null;
  onSelect: (activity: Activity) => void;
}

export default function ActivityDropdown({ activities, selectedId, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const disabled = activities.length === 0;
  const selected = activities.find((a) => a.id === selectedId) ?? null;

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={[styles.field, disabled && styles.fieldDisabled]}
        disabled={disabled}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="Select activity"
      >
        <Text style={[styles.fieldText, !selected && styles.placeholderText]} numberOfLines={1}>
          {selected ? selected.name : disabled ? 'No activities yet' : 'Select an activity'}
        </Text>
        <Text style={[styles.chevron, disabled && styles.chevronDisabled]}>▼</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet} onStartShouldSetResponder={() => true}>
            <Text style={styles.sheetTitle}>Choose an activity</Text>
            <FlatList
              data={activities}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.option}
                  onPress={() => {
                    onSelect(item);
                    setOpen(false);
                  }}
                >
                  <Text style={styles.optionText}>{item.name}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#c9c9c9',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 46,
    backgroundColor: '#fff',
  },
  fieldDisabled: { backgroundColor: '#f0f0f0', borderColor: '#e0e0e0' },
  fieldText: { fontSize: 16, color: '#222', flex: 1 },
  placeholderText: { color: '#999' },
  chevron: { color: '#555', marginLeft: 8 },
  chevronDisabled: { color: '#bbb' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '60%',
    paddingBottom: 24,
  },
  sheetTitle: { fontSize: 16, fontWeight: '600', padding: 16, color: '#222' },
  option: { paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: 1, borderTopColor: '#eee' },
  optionText: { fontSize: 16, color: '#222' },
});
