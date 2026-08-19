import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Period } from '../utils/dateHelpers';
import type { Cell } from '../utils/aggregate';

interface Props {
  rows: Period[];
  columns: string[];
  grid: Cell[][];
  showAverage: boolean;
}

const ROW_LABEL_WIDTH = 150;
const COLUMN_WIDTH = 110;

function formatCell(cell: Cell, showAverage: boolean): string {
  if (cell.sum === 0) return '–';
  if (!showAverage) return String(cell.sum);
  return `${cell.sum} / ${cell.average!.toFixed(1)}`;
}

export default function PeriodTable({ rows, columns, grid, showAverage }: Props) {
  if (columns.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>Add an activity on the Add Entry tab to see it here.</Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator>
      <View>
        <View style={styles.row}>
          <View style={[styles.cell, styles.headerCell, { width: ROW_LABEL_WIDTH }]}>
            <Text style={styles.headerText} numberOfLines={2}>
              {showAverage ? 'Period (sum / avg per day)' : 'Day'}
            </Text>
          </View>
          {columns.map((name) => (
            <View key={name} style={[styles.cell, styles.headerCell, { width: COLUMN_WIDTH }]}>
              <Text style={styles.headerText} numberOfLines={2}>
                {name}
              </Text>
            </View>
          ))}
        </View>

        <ScrollView>
          {rows.map((row, rowIndex) => (
            <View key={row.label} style={styles.row}>
              <View style={[styles.cell, styles.labelCell, { width: ROW_LABEL_WIDTH }]}>
                <Text style={styles.labelText} numberOfLines={2}>
                  {row.label}
                </Text>
              </View>
              {columns.map((name, colIndex) => (
                <View key={name} style={[styles.cell, { width: COLUMN_WIDTH }]}>
                  <Text style={styles.valueText}>{formatCell(grid[rowIndex][colIndex], showAverage)}</Text>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  cell: {
    minHeight: 48,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  headerCell: { backgroundColor: '#f2f4f8' },
  headerText: { fontSize: 12, fontWeight: '700', color: '#333', textAlign: 'center' },
  labelCell: { backgroundColor: '#fafafa', alignItems: 'flex-start' },
  labelText: { fontSize: 13, fontWeight: '600', color: '#333' },
  valueText: { fontSize: 14, color: '#222' },
  emptyState: { padding: 24, alignItems: 'center' },
  emptyText: { color: '#777', textAlign: 'center', fontSize: 14 },
});
