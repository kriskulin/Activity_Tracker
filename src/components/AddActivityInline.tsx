import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

const LETTERS_AND_SPACES_ONLY = /^[A-Za-z\s]+$/;

interface Props {
  onAdd: (name: string) => Promise<void>;
}

export default function AddActivityInline({ onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function close() {
    setOpen(false);
    setText('');
    setError(null);
  }

  async function handleAdd() {
    const trimmed = text.trim();
    if (trimmed.length === 0) {
      setError('Please enter an activity name.');
      return;
    }
    if (!LETTERS_AND_SPACES_ONLY.test(trimmed)) {
      setError('Only letters and spaces are allowed.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onAdd(trimmed);
      close();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not add activity.');
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <Pressable
        style={styles.plusButton}
        onPress={() => setOpen(true)}
        accessibilityLabel="Add new activity"
      >
        <Text style={styles.plusText}>+</Text>
      </Pressable>
    );
  }

    return (
    <View style={styles.panel}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={(v) => {
          setText(v);
          if (error) setError(null);
        }}
        placeholder="New activity name"
        autoFocus
        editable={!saving}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <View style={styles.row}>
        <Pressable style={[styles.button, styles.addButton]} onPress={handleAdd} disabled={saving}>
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Add</Text>}
        </Pressable>
        <Pressable style={[styles.button, styles.cancelButton]} onPress={close} disabled={saving}>
          <Text style={[styles.buttonText, styles.cancelText]}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  plusButton: {
    width: 46,
    height: 46,
    borderRadius: 8,
    backgroundColor: '#2f6fed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusText: { color: '#fff', fontSize: 24, lineHeight: 26 },
  panel: { marginTop: 10, backgroundColor: '#f9f9f9', borderRadius: 8, padding: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#c9c9c9',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    height: 56,
    fontSize: 18,
    backgroundColor: '#fff',
  },
  button: { flex: 1, paddingHorizontal: 14, height: 46, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  addButton: { backgroundColor: '#2f6fed' },
  cancelButton: { backgroundColor: '#eee' },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  cancelText: { color: '#444' },
  errorText: { color: '#d33', marginTop: 8, fontSize: 13 },
});
