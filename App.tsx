import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { SQLiteProvider } from 'expo-sqlite';
import { DATABASE_NAME, migrateDbIfNeeded } from './src/db/database';
import AddEntryScreen from './src/screens/AddEntryScreen';
import TablesScreen from './src/screens/TablesScreen';

type Screen = 'add' | 'tables';

export default function App() {
  return (
    <SQLiteProvider databaseName={DATABASE_NAME} onInit={migrateDbIfNeeded}>
      <Root />
    </SQLiteProvider>
  );
}

function Root() {
  const [screen, setScreen] = useState<Screen>('add');

  return (
    <SafeAreaView style={styles.flex}>
      <View style={styles.flex}>{screen === 'add' ? <AddEntryScreen /> : <TablesScreen />}</View>

      <View style={styles.tabBar}>
        <Pressable style={styles.tabItem} onPress={() => setScreen('add')}>
          <Text style={[styles.tabLabel, screen === 'add' && styles.tabLabelActive]}>Add Entry</Text>
        </Pressable>
        <Pressable style={styles.tabItem} onPress={() => setScreen('tables')}>
          <Text style={[styles.tabLabel, screen === 'tables' && styles.tabLabelActive]}>
            Data Tables
          </Text>
        </Pressable>
      </View>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#fff' },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ddd',
    backgroundColor: '#fafafa',
  },
  tabItem: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  tabLabel: { fontSize: 14, fontWeight: '600', color: '#888' },
  tabLabelActive: { color: '#2f6fed' },
});
